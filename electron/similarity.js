const dotProduct = (first, second) => {
  let sum = 0
  const length = Math.min(first.length, second.length)

  for (let index = 0; index < length; index += 1) {
    sum += first[index] * second[index]
  }

  return sum
}

const magnitude = (vector) => Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))

const cosineSimilarity = (first, second) => {
  if (!Array.isArray(first) || !Array.isArray(second) || first.length === 0 || second.length === 0) {
    return 0
  }

  const denominator = magnitude(first) * magnitude(second)
  if (!denominator) {
    return 0
  }

  return dotProduct(first, second) / denominator
}

const topMatches = ({ queryEmbedding, entries, limit = 4 }) => {
  return entries
    .map((entry) => ({
      ...entry,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    }))
    .sort((first, second) => second.score - first.score)
    .slice(0, limit)
}

module.exports = {
  cosineSimilarity,
  topMatches,
}
