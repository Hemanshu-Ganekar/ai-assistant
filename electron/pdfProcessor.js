const fs = require('fs/promises')
const pdfParse = require('pdf-parse')

const DEFAULT_CHUNK_WORDS = 280
const DEFAULT_OVERLAP_WORDS = 40

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim()

const splitIntoChunks = (text, chunkWords = DEFAULT_CHUNK_WORDS, overlapWords = DEFAULT_OVERLAP_WORDS) => {
  const normalized = normalizeText(text)
  if (!normalized) {
    return []
  }

  const words = normalized.split(' ')
  const chunks = []
  let index = 0

  while (index < words.length) {
    const chunk = words.slice(index, index + chunkWords).join(' ').trim()
    if (chunk) {
      chunks.push(chunk)
    }

    if (index + chunkWords >= words.length) {
      break
    }

    index += Math.max(chunkWords - overlapWords, 1)
  }

  return chunks
}

const extractPdfText = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath)
  const parsed = await pdfParse(fileBuffer)
  return normalizeText(parsed.text || '')
}

const processPdf = async (filePath) => {
  const text = await extractPdfText(filePath)
  const chunks = splitIntoChunks(text)

  return {
    text,
    chunks,
  }
}

module.exports = {
  processPdf,
  splitIntoChunks,
}
