const fs = require('fs/promises')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')
const EMBEDDINGS_PATH = path.join(DATA_DIR, 'embeddings.json')
const META_PATH = path.join(DATA_DIR, 'embeddings-meta.json')

const ensureDataDir = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

const readEmbeddings = async () => {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(EMBEDDINGS_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeEmbeddings = async (entries) => {
  await ensureDataDir()
  await fs.writeFile(EMBEDDINGS_PATH, JSON.stringify(entries, null, 2), 'utf-8')
}

const readMeta = async () => {
  await ensureDataDir()

  try {
    const raw = await fs.readFile(META_PATH, 'utf-8')
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed.files)) {
      return { files: [] }
    }

    return parsed
  } catch {
    return { files: [] }
  }
}

const writeMeta = async (meta) => {
  await ensureDataDir()
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2), 'utf-8')
}

const isFileUpToDate = (meta, filePath, modifiedTimeMs) =>
  meta.files.some((item) => item.filePath === filePath && item.modifiedTimeMs === modifiedTimeMs)

const upsertFileEntries = async ({ filePath, modifiedTimeMs, entries }) => {
  const storedEntries = await readEmbeddings()
  const meta = await readMeta()

  const filteredEntries = storedEntries.filter((item) => item.filePath !== filePath)
  const filteredFiles = meta.files.filter((item) => item.filePath !== filePath)

  const nextMeta = {
    files: [
      {
        filePath,
        modifiedTimeMs,
        processedAt: Date.now(),
        chunkCount: entries.length,
      },
      ...filteredFiles,
    ],
  }
  const nextEntries = [...entries, ...filteredEntries]

  await writeEmbeddings(nextEntries)
  await writeMeta(nextMeta)

  return {
    files: nextMeta.files,
    entries: nextEntries,
  }
}

const getAllEntries = async () => {
  return readEmbeddings()
}

module.exports = {
  EMBEDDINGS_PATH,
  META_PATH,
  readEmbeddings,
  writeEmbeddings,
  readMeta,
  writeMeta,
  isFileUpToDate,
  upsertFileEntries,
  getAllEntries,
}
