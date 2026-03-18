/**
 * Orb — Pinecone retrieval helper
 * Fetches relevant document chunks at query time for RAG.
 *
 * Usage:
 *   const context = await getRelevantContext(userMessage)
 *   const prompt = buildRagPrompt(userMessage, context)
 *   const response = await window.puter.ai.chat(prompt)
 */

import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! })
const index = pc.Index(process.env.PINECONE_INDEX ?? 'orb-knowledge')

/**
 * Embed a text string via an API route (calls Ollama nomic-embed-text server-side).
 * Uses /api/embed/route.ts which proxies to Ollama.
 */
async function embedText(text: string): Promise<number[]> {
  const res = await fetch('/api/embed', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error('Embedding request failed')
  const { embedding } = await res.json()
  return embedding
}

/**
 * Retrieve the top-k most relevant chunks for a given query.
 * @param query      - The user's message
 * @param topK       - Number of chunks to retrieve (default: 4)
 * @param namespace  - Pinecone namespace to query (default: "default")
 * @param minScore   - Minimum cosine similarity score (default: 0.6)
 */
export async function getRelevantContext(
  query: string,
  topK = 4,
  namespace = 'default',
  minScore = 0.6
): Promise<string> {
  const embedding = await embedText(query)

  const results = await index.namespace(namespace).query({
    vector: embedding,
    topK,
    includeMetadata: true,
  })

  const relevantMatches = results.matches.filter(
    (m) => (m.score ?? 0) >= minScore
  )

  if (relevantMatches.length === 0) return ''

  return relevantMatches
    .map((m) => m.metadata?.text as string)
    .filter(Boolean)
    .join('\n\n---\n\n')
}

/**
 * Build a RAG-aware prompt that injects retrieved context.
 */
export function buildRagPrompt(userMessage: string, context: string): string {
  if (!context) return userMessage

  return `You are a helpful assistant. Use the following context to answer the question.
If the answer is not covered in the context, say so honestly — do not make up information.

Context:
${context}

---

Question: ${userMessage}`
}
