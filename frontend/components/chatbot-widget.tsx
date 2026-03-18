'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, X, Sparkles, Database } from 'lucide-react'

/* ── Types ── */
declare global {
  interface Window {
    puter: { ai: { chat: (msg: string) => Promise<{ message: { content: string } }> } }
    OrbConfig?: OrbConfigType
  }
}
interface OrbConfigType {
  botName?: string
  greeting?: string
  position?: 'bottom-right' | 'bottom-left'
  systemPrompt?: string
  pineconeEnabled?: boolean
  pineconeIndexName?: string
  pineconeNamespace?: string
}
export interface ChatbotWidgetProps {
  botName?: string
  greeting?: string
  position?: 'bottom-right' | 'bottom-left'
  systemPrompt?: string
  pineconeEnabled?: boolean
  pineconeIndexName?: string
  pineconeNamespace?: string
}
interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  usedPinecone?: boolean
}

/* ── Markdown renderer ── */
function escHtml(t: string) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function inlineMd(t: string): string {
  return t
    .replace(/`([^`\n]+)`/g, (_,c) => `<code class="ic">${escHtml(c)}</code>`)
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}
function renderMd(raw: string): string {
  return raw.split(/\n{2,}/).map(block => {
    const t = block.trim()
    if (!t) return ''
    if (t.startsWith('```')) {
      const m = t.match(/^```(\w+)?\n?([\s\S]*?)```$/)
      if (m) {
        const lang = m[1] ?? ''; const code = escHtml(m[2].trim())
        return `<pre class="cb">${lang ? `<span class="cl">${lang}</span>` : ''}<code>${code}</code></pre>`
      }
    }
    if (/^#{1,3} /.test(t)) return t
      .replace(/^### (.+)$/m,'<h3>$1</h3>')
      .replace(/^## (.+)$/m,'<h2>$1</h2>')
      .replace(/^# (.+)$/m,'<h1>$1</h1>')
    if (/^[-*+] /.test(t)) {
      const items = t.split('\n').filter(l => /^[-*+] /.test(l))
      return `<ul>${items.map(l=>`<li>${inlineMd(l.replace(/^[-*+] /,''))}</li>`).join('')}</ul>`
    }
    if (/^\d+\. /.test(t)) {
      const items = t.split('\n').filter(l => /^\d+\. /.test(l))
      return `<ol>${items.map(l=>`<li>${inlineMd(l.replace(/^\d+\. /,''))}</li>`).join('')}</ol>`
    }
    if (t.startsWith('> ')) return `<blockquote>${inlineMd(t.replace(/^> /gm,''))}</blockquote>`
    if (t === '---') return '<hr/>'
    return `<p>${t.split('\n').map(inlineMd).join('<br/>')}</p>`
  }).join('\n')
}

/* ── Pinecone fetch ── */
async function fetchContext(message: string, indexName: string, namespace = 'default'): Promise<string | null> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, pineconeIndexName: indexName, namespace, topK: 4 }),
    })
    if (!res.ok) return null
    const d = await res.json()
    return d.context ?? null
  } catch { return null }
}

function buildPrompt(text: string, sys?: string, ctx?: string | null): string {
  const parts: string[] = []
  if (sys) parts.push(`System: ${sys}`)
  if (ctx) parts.push(`Use the knowledge base context below to answer. If not covered, say so.\n\nContext:\n${ctx}\n---`)
  parts.push(`User: ${text}`)
  return parts.join('\n\n')
}

/* ══════════════ Widget ══════════════ */
export function ChatbotWidget({
  botName: pN, greeting: pG, position: pP, systemPrompt: pS,
  pineconeEnabled: pPE, pineconeIndexName: pPI, pineconeNamespace: pPN,
}: ChatbotWidgetProps = {}) {
  const cfg = typeof window !== 'undefined' ? (window.OrbConfig ?? {}) : {}
  const botName = pN ?? cfg.botName ?? 'Orb'
  const pos     = pP ?? cfg.position ?? 'bottom-right'
  const sysPr   = pS ?? cfg.systemPrompt
  const pcOn    = pPE ?? cfg.pineconeEnabled ?? false
  const pcIdx   = pPI ?? cfg.pineconeIndexName ?? ''
  const pcNS    = pPN ?? cfg.pineconeNamespace ?? 'default'
  const greeting = pG ?? cfg.greeting ??
    `Hi there! 👋 I'm ${botName}. ${pcOn && pcIdx ? 'I have access to a knowledge base for accurate answers.' : 'How can I help you today?'}`

  const [open, setOpen]       = useState(false)
  const [msgs, setMsgs]       = useState<Message[]>([
    { id: '1', text: greeting, sender: 'bot', timestamp: new Date() },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  useEffect(() => {
    if (document.getElementById('puter-js')) return
    const s = document.createElement('script')
    s.id = 'puter-js'; s.src = 'https://js.puter.com/v2/'; s.async = true
    document.head.appendChild(s)
  }, [])

  const send = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return
    setMsgs(p => [...p, { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() }])
    setInput('')
    setLoading(true)
    let ctx: string | null = null
    let usedPinecone = false
    if (pcOn && pcIdx) { ctx = await fetchContext(text, pcIdx, pcNS); if (ctx) usedPinecone = true }
    try {
      const r = await window.puter.ai.chat(buildPrompt(text, sysPr, ctx))
      const botText = r?.message?.content ?? "Sorry, I didn't get a response."
      setMsgs(p => [...p, { id: (Date.now()+1).toString(), text: botText, sender: 'bot', timestamp: new Date(), usedPinecone }])
    } catch {
      setMsgs(p => [...p, { id: (Date.now()+1).toString(), text: 'Something went wrong. Please try again.', sender: 'bot', timestamp: new Date() }])
    } finally { setLoading(false) }
  }, [input, loading, sysPr, pcOn, pcIdx, pcNS])

  const sideVal = pos === 'bottom-left' ? '20px' : undefined
  const sideKey = pos === 'bottom-left' ? 'left' : 'right'

  /* ── Shared style fragments ── */
  const font = "'Inter', sans-serif"
  const mono = "'Fira Code', monospace"

  return (
    <>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Open Orb chat"
        style={{
          position: 'fixed',
          bottom: 20,
          [sideKey]: 20,
          zIndex: 50,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #9333ea, #6d28d9)',
          boxShadow: '0 4px 24px #9333ea50',
          animation: 'orbPulse 2.8s ease-in-out infinite',
          transition: 'transform .2s, opacity .2s',
          transform: open ? 'scale(0)' : 'scale(1)',
          opacity: open ? 0 : 1,
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <Sparkles style={{ width: 22, height: 22, color: 'white' }} />
      </button>

      {/* ── Chat Window ── */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 20,
          [sideKey]: 20,
          zIndex: 50,
          width: 'min(380px, calc(100vw - 24px))',
          height: 'min(600px, calc(100vh - 40px))',
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0c0918',
          border: '1px solid #3b1f6e',
          boxShadow: '0 0 0 1px #9333ea12, 0 24px 60px #00000095, 0 0 80px #7c3aed10',
          animation: 'orbUp .22s cubic-bezier(.34,1.4,.64,1)',
          fontFamily: font,
        }}>

          {/* Header */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #5b21b6, #4c1d95)',
            borderBottom: '1px solid #6d28d930',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(255,255,255,.13)',
                border: '1px solid rgba(255,255,255,.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Sparkles style={{ width: 18, height: 18, color: 'white' }} />
              </div>
              {/* Name + status */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white', letterSpacing: '-.01em' }}>{botName}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontFamily: mono }}>
                    {pcOn && pcIdx ? `RAG · ${pcIdx}` : 'Powered by Puter.js'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right-side header actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {pcOn && pcIdx && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 9, fontWeight: 600, fontFamily: mono,
                  padding: '3px 8px', borderRadius: 20,
                  background: '#4ade8015', color: '#4ade80', border: '1px solid #4ade8035',
                }}>
                  <Database style={{ width: 9, height: 9 }} /> RAG
                </span>
              )}
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,.1)')}
              >
                <X style={{ width: 14, height: 14, color: 'rgba(255,255,255,.8)' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            background: '#0c0918',
            scrollbarWidth: 'thin',
            scrollbarColor: '#7c3aed25 transparent',
          }}>
            {msgs.map(msg => (
              <div key={msg.id} style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 7,
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
              }}>
                {/* Bot avatar */}
                {msg.sender === 'bot' && (
                  <div style={{
                    width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: '#4c1d9555', border: '1px solid #7c3aed45',
                    marginBottom: 2,
                  }}>
                    <Sparkles style={{ width: 11, height: 11, color: '#a78bfa' }} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: '80%' }}>
                  {/* Bubble */}
                  {msg.sender === 'user' ? (
                    <div style={{
                      padding: '9px 14px',
                      borderRadius: '16px 16px 4px 16px',
                      background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                      color: 'white',
                      fontSize: 13,
                      lineHeight: 1.6,
                      fontFamily: font,
                      wordBreak: 'break-word',
                    }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      className="orb-prose"
                      style={{
                        padding: '10px 13px',
                        borderRadius: '16px 16px 16px 4px',
                        background: '#161028',
                        border: '1px solid #2d1f52',
                        fontSize: 13,
                        lineHeight: 1.65,
                        fontFamily: font,
                        color: '#d1c4f0',
                        wordBreak: 'break-word',
                      }}
                      dangerouslySetInnerHTML={{ __html: renderMd(msg.text) }}
                    />
                  )}

                  {/* RAG badge */}
                  {msg.usedPinecone && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 9, color: '#4ade8070',
                      paddingLeft: 4, fontFamily: mono,
                    }}>
                      <Database style={{ width: 9, height: 9 }} />
                      Retrieved from knowledge base
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: '#4c1d9555', border: '1px solid #7c3aed45',
                  marginBottom: 2,
                }}>
                  <Sparkles style={{ width: 11, height: 11, color: '#a78bfa' }} />
                </div>
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '16px 16px 16px 4px',
                  background: '#161028',
                  border: '1px solid #2d1f52',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {[0, 140, 280].map((d, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#7c3aed',
                      animation: `orbBounce 0.85s ${d}ms ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div style={{
            flexShrink: 0,
            padding: '10px 12px 12px',
            background: '#0f0c1a',
            borderTop: '1px solid #1e1640',
          }}>
            <form onSubmit={send} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                placeholder="Ask me anything…"
                style={{
                  flex: 1,
                  background: '#1a1330',
                  border: '1px solid #3b2d6e',
                  borderRadius: 12,
                  padding: '9px 14px',
                  fontSize: 13,
                  color: '#e2d9f3',
                  fontFamily: font,
                  outline: 'none',
                  transition: 'border-color .15s',
                  opacity: loading ? 0.5 : 1,
                }}
                onFocus={e => (e.target.style.borderColor = '#7c3aed')}
                onBlur={e  => (e.target.style.borderColor = '#3b2d6e')}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #9333ea, #6d28d9)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.4 : 1,
                  transition: 'opacity .15s',
                }}
              >
                <Send style={{ width: 15, height: 15, color: 'white' }} />
              </button>
            </form>
            <p style={{
              textAlign: 'center',
              marginTop: 7,
              fontSize: 10,
              color: '#3e3060',
              fontFamily: mono,
            }}>
              {pcOn && pcIdx ? `RAG · ${pcIdx}` : 'Puter.js AI · no API key needed'}
            </p>
          </div>
        </div>
      )}
    </>
  )
}
