const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: process.versions,
  processPdfUpload: () => ipcRenderer.invoke('pdf:select-and-process'),
  askRagQuestion: (question, topK = 4) => ipcRenderer.invoke('rag:ask', { question, topK }),
  getKnowledgeStatus: () => ipcRenderer.invoke('rag:status'),
  checkOllamaStatus: () => ipcRenderer.invoke('ollama:status'),
})
