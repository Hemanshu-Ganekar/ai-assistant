import { useEffect, useState } from 'react'
import Chat from './components/Chat'
import InputBox from './components/InputBox'
import Sidebar from './components/Sidebar'

const STORAGE_KEY = 'study-assistant-conversations'
const LEGACY_STORAGE_KEY = 'study-assistant-chat-history'
const SYSTEM_PROMPT =
  'You are a helpful study assistant. Explain concepts simply, give step-by-step solutions, and provide examples.'

const hasElectronApi = () => typeof window !== 'undefined' && Boolean(window.electronAPI)

const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content,
})

const createConversation = () => ({
  id: crypto.randomUUID(),
  title: 'New chat',
  messages: [],
  updatedAt: Date.now(),
})

const toConversationTitle = (text) => {
  const title = text.trim().replace(/\s+/g, ' ')
  return title.length > 42 ? `${title.slice(0, 42)}...` : title
}

const buildFallbackPrompt = (messages) => {
  const transcript = messages
    .map((message) => `${message.role === 'user' ? 'User' : 'Assistant'}: ${message.content}`)
    .join('\n\n')

  return `${SYSTEM_PROMPT}\n\n${transcript}\n\nAssistant:`
}

function App() {
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ollamaAvailable, setOllamaAvailable] = useState(true)

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId)
  const messages = activeConversation?.messages ?? []

  useEffect(() => {
    // Check Ollama availability on startup
    const checkOllama = async () => {
      if (!hasElectronApi()) {
        return
      }

      try {
        const status = await window.electronAPI.checkOllamaStatus()
        setOllamaAvailable(status?.available ?? false)
        if (!status?.available) {
          setError('⚠️ Ollama is not running. Please start Ollama to use this app.')
        }
      } catch (err) {
        console.error('[App] Error checking Ollama:', err)
        setOllamaAvailable(false)
        setError('⚠️ Unable to connect to Ollama. Please ensure Ollama is running.')
      }
    }

    checkOllama()
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setConversations(parsed)
          setActiveConversationId(parsed[0].id)
          return
        }
      }

      const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacyStored) {
        const legacyMessages = JSON.parse(legacyStored)
        if (Array.isArray(legacyMessages) && legacyMessages.length > 0) {
          const firstUserMessage = legacyMessages.find((message) => message.role === 'user')
          const migratedConversation = {
            id: crypto.randomUUID(),
            title: firstUserMessage ? toConversationTitle(firstUserMessage.content) : 'Migrated chat',
            messages: legacyMessages,
            updatedAt: Date.now(),
          }

          setConversations([migratedConversation])
          setActiveConversationId(migratedConversation.id)
          localStorage.removeItem(LEGACY_STORAGE_KEY)
          return
        }
      }
    } catch {
      setConversations([])
    }

    const starterConversation = createConversation()
    setConversations([starterConversation])
    setActiveConversationId(starterConversation.id)
  }, [])

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    }
  }, [conversations])

  const updateConversationMessages = (conversationId, nextMessages, nextTitle) => {
    setConversations((current) => {
      const updated = current.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation
        }

        return {
          ...conversation,
          messages: nextMessages,
          title: nextTitle ?? conversation.title,
          updatedAt: Date.now(),
        }
      })

      return updated.sort((first, second) => second.updatedAt - first.updatedAt)
    })
  }

  const askQuestionFallback = async (userMessages) => {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'phi',
        prompt: buildFallbackPrompt(userMessages),
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Unable to connect to Ollama.')
    }

    const data = await response.json()
    const aiText = data.response?.trim()

    if (!aiText) {
      throw new Error('No response from model.')
    }

    return aiText
  }

  const askQuestionWithRag = async (question) => {
    if (!hasElectronApi()) {
      throw new Error('PDF knowledge is available only in Electron mode. Use npm run electron.')
    }

    const response = await window.electronAPI.askRagQuestion(question, 4)
    if (!response?.success) {
      throw new Error(response?.error || 'Failed to answer from PDF knowledge.')
    }

    return response.answer
  }

  const handleSend = async (userPrompt) => {
    if (!activeConversation) {
      return
    }

    if (!ollamaAvailable) {
      setError('❌ Ollama is not running. Please start Ollama to send messages.')
      return
    }

    const userMessage = createMessage('user', userPrompt)
    const userMessages = [...activeConversation.messages, userMessage]
    const conversationTitle =
      activeConversation.messages.length === 0 ? toConversationTitle(userPrompt) : activeConversation.title

    updateConversationMessages(activeConversation.id, userMessages, conversationTitle)

    setError('')
    setLoading(true)

    try {
      let aiText = ''
      if (hasElectronApi()) {
        aiText = await askQuestionWithRag(userPrompt)
      } else {
        aiText = await askQuestionFallback(userMessages)
      }

      updateConversationMessages(activeConversation.id, [...userMessages, createMessage('assistant', aiText)])
    } catch (err) {
      const errorMsg = err?.message || 'Unable to answer question.'
      setError(errorMsg)
      updateConversationMessages(activeConversation.id, [
        ...userMessages,
        createMessage('assistant', `I could not answer your question: ${errorMsg}`),
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    if (!activeConversation) {
      return
    }

    updateConversationMessages(activeConversation.id, [], 'New chat')
    setError('')
  }

  const createNewChat = () => {
    const newConversation = createConversation()
    setConversations((current) => [newConversation, ...current])
    setActiveConversationId(newConversation.id)
    setError('')
  }

  const selectConversation = (conversationId) => {
    setActiveConversationId(conversationId)
    setError('')
  }

  return (
    <main className="app-layout">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={selectConversation}
        onNewChat={createNewChat}
        loading={loading}
      />

      <section className="app-shell">
        <header className="app-header">
          <div>
            <h1 className="app-title">AI Study Assistant</h1>
          </div>
          <div className="header-actions">
            <button className="clear-button" onClick={clearChat} disabled={loading || messages.length === 0}>
              Clear Chat
            </button>
          </div>
        </header>

        {error && <p className="error-banner">{error}</p>}

        <Chat messages={messages} loading={loading} />
        <InputBox onSend={handleSend} loading={loading} disabled={!ollamaAvailable} />
      </section>
    </main>
  )
}

export default App
