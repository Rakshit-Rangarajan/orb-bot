/**
 * POST /api/embed
 * Returns an Ollama embedding for the given text.
 * Proxies to Python backend if BACKEND_URL is set.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { text } = await req.json()

  const BACKEND = process.env.BACKEND_URL
  if (BACKEND) {
    const res = await fetch(`${BACKEND.replace(/\/$/, '')}/embed`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const d = await res.json()
    return NextResponse.json({ embedding: d.embedding })
  }

  const url   = process.env.OLLAMA_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_EMBED_MODEL ?? 'nomic-embed-text'
  const res   = await fetch(`${url.replace(/\/$/, '')}/api/embed`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: text }),
  })
  const data = await res.json()
  return NextResponse.json({ embedding: data.embeddings[0] })
}
