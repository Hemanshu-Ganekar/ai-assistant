const OLLAMA_URL = 'http://localhost:11434'
const GENERATE_MODEL = 'phi'

const buildPrompt = (question) => {
  return `You are a helpful study assistant. Answer the following question clearly and concisely.\n\nQuestion: ${question}\n\nAnswer:`
}

const processPdfToEmbeddings = async () => {
  // No-op: PDF button is just UI, no actual processing
  return {
    status: 'loaded',
    filePath: 'demo-pdf',
    chunkCount: 0,
  }
}

const answerQuestionWithRag = async ({ question }) => {
  const prompt = buildPrompt(question)

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GENERATE_MODEL,
      prompt,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate answer. Make sure Ollama is running.')
  }

  const payload = await response.json()

  return {
    answer: payload.response?.trim() || 'No response generated.',
    sources: [],
  }
}

const getKnowledgeStatus = async () => {
  return {
    status: 'ready',
    documentName: 'Demo Assistant',
    mode: 'direct-generation',
  }
}

module.exports = {
  processPdfToEmbeddings,
  answerQuestionWithRag,
  getKnowledgeStatus,
}
