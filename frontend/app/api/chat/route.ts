/**
 * POST /api/chat
 *
 * RAG retrieval. Two modes:
 *  A) BACKEND_URL set  → proxy to Python FastAPI (uses Ollama internally)
 *  B) No BACKEND_URL   → call Ollama + Pinecone directly from Next.js
 *
 * Returns { context: string | null, sources: string[] }
 */

import { NextRequest, NextResponse } from 'next/server'

async function ollamaEmbed(text: string): Promise<number[]> {
  const url  = process.env.OLLAMA_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_EMBED_MODEL ?? 'nomic-embed-text'
  const res  = await fetch(`${url.replace(/\/$/, '')}/api/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: text }),
  })
  if (!res.ok) throw new Error(`Ollama embed failed: ${await res.text()}`)
  const data = await res.json()
  return data.embeddings[0]
}

export async function POST(req: NextRequest) {
  try {
    const { message, pineconeIndexName, namespace = 'default', topK = 4 } = await req.json()
    if (!message) return NextResponse.json({ context: null, sources: [] })

    // Mode A: proxy to Python backend
    const BACKEND = process.env.BACKEND_URL
    if (BACKEND) {
      const res = await fetch(`${BACKEND.replace(/\/$/, '')}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, namespace, top_k: topK, min_score: 0.55 }),
      })
      if (!res.ok) { console.error('Backend /chat failed:', await res.text()); return NextResponse.json({ context: null, sources: [] }) }
      const d = await res.json()
      return NextResponse.json({ context: d.context ?? null, sources: d.sources ?? [] })
    }

    // Mode B: direct Ollama + Pinecone
    const PINECONE_KEY = process.env.PINECONE_API_KEY
    if (!PINECONE_KEY || !pineconeIndexName) return NextResponse.json({ context: null, sources: [] })

    const vector = await ollamaEmbed(message)

    const describeRes = await fetch(`https://api.pinecone.io/indexes/${pineconeIndexName}`, {
      headers: { 'Api-Key': PINECONE_KEY },
    })
    if (!describeRes.ok) return NextResponse.json({ context: null, sources: [] })
    const { host } = await describeRes.json()

    const queryRes = await fetch(`https://${host}/query`, {
      method: 'POST',
      headers: { 'Api-Key': PINECONE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ vector, topK, namespace, includeMetadata: true }),
    })
    if (!queryRes.ok) return NextResponse.json({ context: null, sources: [] })

    const { matches = [] } = await queryRes.json()
    const good = matches.filter((m: { score: number }) => m.score >= 0.55)
    const context = good.map((m: { metadata?: { text?: string } }) => m.metadata?.text ?? '').filter(Boolean).join('\n\n---\n\n')
    const sources: string[] = [...new Set(good.map((m: { metadata?: { source?: string } }) => m.metadata?.source ?? '').filter(Boolean))] as string[]

    return NextResponse.json({ context: context || null, sources })
  } catch (err) {
    console.error('/api/chat error:', err)
    return NextResponse.json({ context: null, sources: [] })
  }
}
