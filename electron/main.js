const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { answerQuestionWithRag, getKnowledgeStatus, processPdfToEmbeddings } = require('./ragPipeline')

const OLLAMA_URL = 'http://localhost:11434'
let ipcHandlersRegistered = false
let ollamaAvailable = false

// Check if Ollama is running
const checkOllamaStatus = async () => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
      timeout: 5000,
    })
    ollamaAvailable = response.ok
    console.log('[main] Ollama status:', ollamaAvailable ? 'AVAILABLE' : 'UNAVAILABLE')
    return ollamaAvailable
  } catch (error) {
    console.error('[main] Ollama check failed:', error.message)
    ollamaAvailable = false
    return false
  }
}

const showOllamaErrorDialog = () => {
  dialog.showErrorBox(
    'Ollama Not Found',
    'The AI Study Assistant requires Ollama to be running.\n\n' +
      'Please:\n' +
      '1. Download Ollama from https://ollama.ai\n' +
      '2. Install and start the Ollama service\n' +
      '3. Pull required models:\n' +
      '   ollama pull phi\n\n' +
      'After Ollama is running, restart this application.',
  )
}

const setupIpcHandlers = () => {
  if (ipcHandlersRegistered) {
    return
  }

  // Check Ollama availability
  ipcMain.handle('ollama:status', async () => {
    const available = await checkOllamaStatus()
    return {
      available,
      url: OLLAMA_URL,
    }
  })

  // PDF button is just UI - no-op
  ipcMain.handle('pdf:select-and-process', async () => {
    try {
      const result = await processPdfToEmbeddings()
      return {
        success: true,
        filePath: result.filePath,
        status: result.status,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed.',
      }
    }
  })

  ipcMain.handle('rag:ask', async (_event, payload) => {
    if (!ollamaAvailable) {
      return {
        success: false,
        error: 'Ollama is not running. Please start Ollama and try again.',
      }
    }

    try {
      const response = await answerQuestionWithRag({
        question: payload?.question || '',
      })

      return {
        success: true,
        answer: response.answer,
        sources: response.sources,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to answer question.',
      }
    }
  })

  ipcMain.handle('rag:status', async () => {
    try {
      const status = await getKnowledgeStatus()
      return {
        success: true,
        ...status,
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to load status.',
      }
    }
  })

  ipcHandlersRegistered = true
  console.log('[main] IPC handlers registered')
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: '#0f172a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const startUrl = process.env.ELECTRON_START_URL

  if (startUrl) {
    // Development: load from localhost
    mainWindow.loadURL(startUrl)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // Production: load from built files
    const indexPath = path.join(__dirname, '../react-app/dist/index.html')
    mainWindow.loadFile(indexPath).catch((error) => {
      console.error('[main] Failed to load index.html:', error)
      dialog.showErrorBox('Error', 'Failed to load application interface.')
    })
  }

  mainWindow.on('closed', () => {
    console.log('[main] Window closed')
  })
}

app.whenReady().then(async () => {
  console.log('[main] App ready, checking Ollama...')

  // Check Ollama availability before creating window
  const ollamaRunning = await checkOllamaStatus()
  if (!ollamaRunning) {
    console.warn('[main] WARNING: Ollama is not running')
  }

  setupIpcHandlers()
  createWindow()

  // Show Ollama warning after a short delay if not available
  setTimeout(() => {
    if (!ollamaRunning) {
      showOllamaErrorDialog()
    }
  }, 1000)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
