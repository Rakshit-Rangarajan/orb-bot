'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { ChatbotWidget } from '@/components/chatbot-widget'
import {
  BookOpen, Copy, Check, Sparkles, Zap, Shield, Puzzle,
  Database, MessageSquare, ToggleLeft, ToggleRight, ChevronRight,
  Code, Terminal, Globe,
} from 'lucide-react'

/* ══════════════ Design tokens ══════════════ */
const T = {
  bg:      '#08060f',
  bg1:     '#0e0b1e',
  bg2:     '#141128',
  border:  '#241b46',
  border2: '#352860',
  purple:  '#9333ea',
  purpleL: '#c084fc',
  purpleD: '#6d28d9',
  green:   '#4ade80',
  blue:    '#38bdf8',
  amber:   '#fbbf24',
  rose:    '#fb7185',
  orange:  '#fb923c',
  text:    '#ede8f8',
  text2:   '#8b7aac',
  text3:   '#3e3060',
}

/* ══════════════ Shared inline styles ══════════════ */
const row    = { display: 'flex', alignItems: 'center' } as const
const col    = { display: 'flex', flexDirection: 'column' as const }
const wrap   = { display: 'flex', flexWrap: 'wrap' as const, alignItems: 'center' }
const grid2  = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } as const
const grid3  = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 } as const
const card   = { background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20 } as const
const inputS: React.CSSProperties = {
  background: T.bg2,
  border: `1px solid ${T.border}`,
  color: T.text,
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  width: '100%',
  outline: 'none',
  fontFamily: "'Inter', sans-serif",
  transition: 'border-color .15s',
  display: 'block',
}
const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: T.purpleL,
  display: 'block',
  marginBottom: 6,
}

/* ══════════════ Helpers ══════════════ */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button onClick={copy} style={{
      ...row, gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer',
      background: copied ? '#4ade8014' : '#9333ea12',
      color:      copied ? T.green : T.text2,
      border:     `1px solid ${copied ? '#4ade8038' : T.border2}`,
      fontFamily: "'Inter', sans-serif",
    }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

function CodeBlock({ filename, code }: { filename?: string; code: string }) {
  return (
    <div style={{ background: '#06040e', border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', margin: '12px 0' }}>
      {filename && (
        <div style={{ ...row, justifyContent: 'space-between', padding: '8px 14px', borderBottom: `1px solid ${T.border}`, background: T.bg1 }}>
          <span style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: T.text3 }}>{filename}</span>
          <CopyBtn text={code} />
        </div>
      )}
      <pre style={{ padding: 16, overflowX: 'auto', margin: 0 }}>
        <code style={{ fontSize: 12, fontFamily: "'Fira Code', monospace", color: T.purpleL, lineHeight: 1.65 }}>{code}</code>
      </pre>
    </div>
  )
}

function Inp({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ ...inputS, fontFamily: mono ? "'Fira Code', monospace" : "'Inter', sans-serif" }}
      onFocus={e => (e.target.style.borderColor = T.purple)}
      onBlur={e => (e.target.style.borderColor = T.border)} />
  )
}

function Txta({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
      style={{ ...inputS, resize: 'none' }}
      onFocus={e => (e.target.style.borderColor = T.purple)}
      onBlur={e => (e.target.style.borderColor = T.border)} />
  )
}

function SectionHeader({ icon: Icon, color, title, hint }: { icon: React.ElementType; color: string; title: string; hint: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ ...row, gap: 10, marginBottom: 4 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: color + '14', border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={14} color={color} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13, color: T.text2, paddingLeft: 38 }}>{hint}</p>
    </div>
  )
}

/* ══════════════ Architecture Diagram ══════════════ */
function ArchDiagram() {
  return (
    <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}` }}>
      <svg width="100%" viewBox="0 0 680 160" style={{ display: 'block', background: '#06040e' }}>
        <defs>
          <radialGradient id="ag" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="680" height="160" fill="#06040e" />
        <rect width="680" height="160" fill="url(#ag)" />
        <line x1="195" y1="20" x2="195" y2="140" stroke={T.border} strokeWidth="1" strokeDasharray="3 6" />
        <line x1="360" y1="20" x2="360" y2="140" stroke={T.border} strokeWidth="1" strokeDasharray="3 6" />
        <line x1="525" y1="20" x2="525" y2="140" stroke={T.border} strokeWidth="1" strokeDasharray="3 6" />
        <path d="M133 80 H202" fill="none" stroke="#9333ea55" strokeWidth="1.5" strokeDasharray="5 4" style={{ animation: 'dash 2s linear infinite' }} />
        <path d="M298 80 H367" fill="none" stroke="#9333ea55" strokeWidth="1.5" strokeDasharray="5 4" style={{ animation: 'dash 2s .4s linear infinite' }} />
        <path d="M463 80 H532" fill="none" stroke="#9333ea55" strokeWidth="1.5" strokeDasharray="5 4" style={{ animation: 'dash 2s .8s linear infinite' }} />
        <polygon points="202,76 193,80 202,84" fill="#9333ea70" />
        <polygon points="367,76 358,80 367,84" fill="#9333ea70" />
        <polygon points="532,76 523,80 532,84" fill="#9333ea70" />
        <path d="M298 80 Q412 28 532 80" fill="none" stroke="#9333ea20" strokeWidth="1" strokeDasharray="4 6" />
        <text x="412" y="22" textAnchor="middle" fontSize="7" fill={T.text3} fontFamily="Fira Code, monospace">no RAG (direct)</text>
        <rect x="14" y="56" width="119" height="48" rx="9" fill={T.bg1} stroke={T.border2} />
        <text x="73" y="77" textAnchor="middle" fontSize="10" fill={T.purpleL} fontFamily="Inter, sans-serif" fontWeight="700">User Message</text>
        <text x="73" y="93" textAnchor="middle" fontSize="7.5" fill={T.text3} fontFamily="Fira Code, monospace">POST /api/chat</text>
        <rect x="202" y="50" width="96" height="60" rx="9" fill={T.bg1} stroke="#38bdf830" />
        <text x="250" y="74" textAnchor="middle" fontSize="10" fill={T.blue} fontFamily="Inter, sans-serif" fontWeight="700">Ollama</text>
        <text x="250" y="88" textAnchor="middle" fontSize="7.5" fill={T.text2} fontFamily="Fira Code, monospace">embed(msg)</text>
        <text x="250" y="102" textAnchor="middle" fontSize="7" fill={T.text3} fontFamily="Fira Code, monospace">nomic-embed</text>
        <rect x="367" y="50" width="96" height="60" rx="9" fill="#060f08" stroke="#4ade8030" />
        <text x="415" y="74" textAnchor="middle" fontSize="10" fill={T.green} fontFamily="Inter, sans-serif" fontWeight="700">Pinecone</text>
        <text x="415" y="88" textAnchor="middle" fontSize="7.5" fill={T.text2} fontFamily="Fira Code, monospace">top-k chunks</text>
        <text x="415" y="102" textAnchor="middle" fontSize="7" fill={T.text3} fontFamily="Fira Code, monospace">cosine ≥ 0.55</text>
        <rect x="532" y="50" width="130" height="60" rx="9" fill="#0c0820" stroke="#7c3aed40" />
        <text x="597" y="74" textAnchor="middle" fontSize="10" fill={T.purpleL} fontFamily="Inter, sans-serif" fontWeight="700">Puter.js AI</text>
        <text x="597" y="88" textAnchor="middle" fontSize="7.5" fill={T.text2} fontFamily="Fira Code, monospace">context + msg</text>
        <text x="597" y="102" textAnchor="middle" fontSize="7" fill={T.text3} fontFamily="Fira Code, monospace">→ response</text>
        <text x="73"  y="143" textAnchor="middle" fontSize="7.5" fill={T.text3} fontFamily="Fira Code, monospace" letterSpacing="1">CLIENT</text>
        <text x="250" y="143" textAnchor="middle" fontSize="7.5" fill={T.text3} fontFamily="Fira Code, monospace" letterSpacing="1">SERVER</text>
        <text x="415" y="143" textAnchor="middle" fontSize="7.5" fill={T.text3} fontFamily="Fira Code, monospace" letterSpacing="1">VECTOR DB</text>
        <text x="597" y="143" textAnchor="middle" fontSize="7.5" fill={T.text3} fontFamily="Fira Code, monospace" letterSpacing="1">AI</text>
      </svg>
    </div>
  )
}

const FEATURES = [
  { icon: Zap,           title: 'Two-Tag Setup',   desc: 'Load Puter.js + Orb embed. Live AI chat in under a minute.',        color: T.amber   },
  { icon: Sparkles,      title: 'Real AI, Free',   desc: 'Puter.js drives responses. No API keys, no billing ever.',          color: T.purpleL },
  { icon: Database,      title: 'Pinecone RAG',    desc: 'Index your own documents for retrieval-augmented answers.',          color: T.green   },
  { icon: Puzzle,        title: 'Live Customizer', desc: 'Name, color, prompt, Pinecone — generate embed code instantly.',    color: T.blue    },
  { icon: Shield,        title: 'System Prompts',  desc: 'Give Orb a persona or restrict it to specific topics.',             color: T.rose    },
  { icon: MessageSquare, title: 'Rich Markdown',   desc: 'Code blocks, bold, lists, headings — beautifully rendered.',        color: T.orange  },
]

/* ══════════════════════════════ PAGE ══════════════════════════════ */
export default function Home() {
  const [botName,       setBotName]       = useState('Orb')
  const [greeting,      setGreeting]      = useState("Hi there! 👋 I'm Orb, your AI assistant. How can I help?")
  const [color,         setColor]         = useState('#9333ea')
  const [position,      setPosition]      = useState<'bottom-right' | 'bottom-left'>('bottom-right')
  const [systemPrompt,  setSystemPrompt]  = useState('')
  const [usePinecone,   setUsePinecone]   = useState(false)
  const [pineconeIndex, setPineconeIndex] = useState('')
  const [pineconeNS,    setPineconeNS]    = useState('default')
  const [activeTab,     setActiveTab]     = useState<'script' | 'iframe' | 'react'>('script')
  const [previewOpen,   setPreviewOpen]   = useState(false)

  const pcLines = usePinecone && pineconeIndex
    ? `\n    pineconeEnabled: true,\n    pineconeIndexName: "${pineconeIndex}",\n    pineconeNamespace: "${pineconeNS}",`
    : ''

  const scriptCode = `<script>
  window.OrbConfig = {
    botName: "${botName}",
    greeting: "${greeting.replace(/"/g, '\\"')}",
    primaryColor: "${color}",
    position: "${position}",${systemPrompt ? `\n    systemPrompt: "${systemPrompt.replace(/"/g, '\\"')}",` : ''}${pcLines}
  }
</script>
<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>`

  const iframeCode = `<iframe
  src="https://your-domain.com/embed?name=${encodeURIComponent(botName)}&color=${encodeURIComponent(color)}&pos=${position}${usePinecone && pineconeIndex ? `&pcIndex=${encodeURIComponent(pineconeIndex)}&pcNS=${encodeURIComponent(pineconeNS)}` : ''}"
  style="position:fixed;${position === 'bottom-right' ? 'right' : 'left'}:0;bottom:0;width:420px;height:650px;border:none;z-index:9999;"
></iframe>`

  const reactCode = `import { ChatbotWidget } from '@/components/chatbot-widget'

export default function Page() {
  return (
    <>
      <ChatbotWidget
        botName="${botName}"
        position="${position}"${systemPrompt ? `\n        systemPrompt="${systemPrompt.replace(/"/g, '\\"')}"` : ''}${usePinecone && pineconeIndex ? `\n        pineconeEnabled={true}\n        pineconeIndexName="${pineconeIndex}"\n        pineconeNamespace="${pineconeNS}"` : ''}
      />
    </>
  )
}`

  const tabCode = activeTab === 'script' ? scriptCode : activeTab === 'iframe' ? iframeCode : reactCode

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif", color: T.text }}>

      {/* Purple top accent line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${T.purpleD}, ${T.purple}, ${T.purpleL})` }} />

      {/* ═══ NAV ═══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: `1px solid ${T.border}`,
        background: T.bg + 'f0',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', height: 56, ...row, justifyContent: 'space-between' }}>
          <div style={{ ...row, gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg, ${T.purple}, ${T.purpleD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${T.purple}40` }}>
              <Sparkles size={15} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: T.text, letterSpacing: '-.02em' }}>Orb</span>
          </div>
          <div style={{ ...row, gap: 24 }}>
            {[{ l: 'Customizer', h: '#customizer' }, { l: 'Pinecone', h: '#pinecone-docs' }].map(({ l, h }) => (
              <a key={h} href={h} style={{ fontSize: 13, fontWeight: 500, color: T.text3, textDecoration: 'none', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
                onMouseLeave={e => (e.currentTarget.style.color = T.text3)}>{l}</a>
            ))}
            <Link href="/docs/how-to-use" style={{ ...row, gap: 6, fontSize: 13, fontWeight: 500, color: T.text3, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = T.text3)}>
              <BookOpen size={14} /> Docs
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* ═══ HERO ═══ */}
        <section style={{ paddingTop: 72, paddingBottom: 60, maxWidth: 600, textAlign: 'center', margin: '0 auto' }}>
          <div style={{ ...row, justifyContent: 'center', gap: 8, marginBottom: 24, display: 'inline-flex', padding: '5px 12px', borderRadius: 999, background: '#9333ea12', border: `1px solid ${T.border2}` }}>
            <Sparkles size={12} color={T.purpleL} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.purpleL }}>Puter.js · Pinecone RAG · No API key required</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-.03em', color: T.text, marginBottom: 20 }}>
            
            {/* OrbBot Branding */}
            <span style={{ display: 'block', fontSize: 'clamp(3.5rem, 8vw, 5rem)', fontWeight: 900, marginBottom: '15px' }}>
              <span style={{ color: '#ffffff' }}>Orb</span>
              <span style={{ background: `linear-gradient(130deg, ${T.purpleL}, #818cf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Bot
              </span>
            </span>

            {/* Original Heading */}
            The AI chat widget<br />
            for{' '}
            <span style={{ background: `linear-gradient(130deg, ${T.purpleL}, #818cf8)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              any website
            </span>
          </h1>

          {/* Changed marginBottom to margin: '0 auto 32px' so the block centers itself horizontally */}
          <p style={{ fontSize: 16, color: T.text2, lineHeight: 1.7, margin: '0 auto 32px', maxWidth: 460 }}>
            Drop in two script tags — Puter.js powers the AI, Pinecone gives it knowledge of your docs.
            No backend. No API keys. Fully customizable.
          </p>

          {/* Added justifyContent: 'center' to the button container */}
          <div style={{ ...row, justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="#customizer" style={{ ...row, justifyContent: 'center', gap: 8, padding: '10px 20px', borderRadius: 9, fontWeight: 600, fontSize: 13, color: 'white', textDecoration: 'none', background: `linear-gradient(135deg, ${T.purple}, ${T.purpleD})`, boxShadow: `0 0 20px ${T.purple}35` }}>
              <Sparkles size={15} /> Build Your Bot
            </a>
            <Link href="/docs/how-to-use" style={{ ...row, justifyContent: 'center', gap: 8, padding: '10px 20px', borderRadius: 9, fontWeight: 600, fontSize: 13, color: T.purpleL, textDecoration: 'none', background: T.bg1, border: `1px solid ${T.border2}` }}>
              <BookOpen size={15} /> Read the Docs
            </Link>
          </div>

          {/* Added justifyContent: 'center' to the feature tags container */}
          <div style={{ ...wrap, justifyContent: 'center', gap: 8 }}>
            {[{ l: 'No API key', c: T.purpleL }, { l: 'Pinecone RAG', c: T.green }, { l: 'iFrame embed', c: T.blue }, { l: 'Markdown chat', c: T.amber }].map(({ l, c }) => (
              <span key={l} style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: c + '12', border: `1px solid ${c}28`, color: c }}>{l}</span>
            ))}
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section style={{ marginBottom: 72}}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {FEATURES.map(({ icon: Icon, title, desc, color: ic }) => (
              <div key={title} style={{ ...card, transition: 'border-color .15s', cursor: 'default' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = ic + '50')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = T.border)}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: ic + '14', border: `1px solid ${ic}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                  <Icon size={15} color={ic} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ QUICK INSTALL ═══ */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>Live in 30 Seconds</h2>
          <p style={{ fontSize: 13, color: T.text2, marginBottom: 20 }}>Two script tags — that's it.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { n: '01', t: 'Load Puter.js', code: '<script src="https://js.puter.com/v2/"></script>',                            nc: T.purpleL },
              { n: '02', t: 'Add Orb',       code: '<script src="https://your-domain.com/chatbot-embed.js"></script>',            nc: T.green   },
              { n: '03', t: '✓ Done',        code: 'Live AI chat — zero configuration needed',                                    nc: T.blue    },
            ].map(({ n, t, code, nc }) => (
              <div key={n} style={card}>
                <div style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: nc, marginBottom: 6, fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>{t}</div>
                <div style={{ background: '#06040e', border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 12px' }}>
                  <code style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: T.purpleL, wordBreak: 'break-all' as const }}>{code}</code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CUSTOMIZER ═══ */}
        <section id="customizer" style={{ marginBottom: 72, scrollMarginTop: 80 }}>
          <SectionHeader icon={Puzzle} color={T.purpleL} title="Customizer" hint="Configure your bot, toggle Pinecone RAG, then copy the ready-to-paste embed code." />

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Controls */}
            <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <span style={label}>Bot Name</span>
                <Inp value={botName} onChange={setBotName} placeholder="Orb" />
              </div>

              <div>
                <span style={label}>Greeting Message</span>
                <Txta value={greeting} onChange={setGreeting} rows={2} />
              </div>

              <div>
                <span style={label}>System Prompt <span style={{ fontWeight: 400, color: T.text3 }}>(optional)</span></span>
                <Txta value={systemPrompt} onChange={setSystemPrompt} rows={2}
                  placeholder="You are a helpful support agent for Acme Corp. Only answer product questions." />
              </div>

              <div style={grid2}>
                <div>
                  <span style={label}>Brand Color</span>
                  <div style={{ ...row, gap: 8 }}>
                    <input type="color" value={color} onChange={e => setColor(e.target.value)}
                      style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer', background: T.bg2, padding: 2, flexShrink: 0 }} />
                    <Inp value={color} onChange={setColor} mono />
                  </div>
                </div>
                <div>
                  <span style={label}>Position</span>
                  <select value={position} onChange={e => setPosition(e.target.value as 'bottom-right' | 'bottom-left')}
                    style={{ ...inputS, cursor: 'pointer' }}
                    onFocus={e => (e.target.style.borderColor = T.purple)}
                    onBlur={e => (e.target.style.borderColor = T.border)}>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              </div>

              {/* Pinecone toggle */}
              <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${usePinecone ? '#4ade8030' : T.border}`, background: usePinecone ? '#060f08' : T.bg2, transition: 'border-color .25s, background .25s' }}>
                <button onClick={() => setUsePinecone(p => !p)}
                  style={{ width: '100%', ...row, justifyContent: 'space-between', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', color: T.text, fontFamily: "'Inter', sans-serif" }}>
                  <div style={{ ...row, gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: usePinecone ? '#4ade8015' : '#ffffff08', border: `1px solid ${usePinecone ? '#4ade8035' : T.border2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Database size={13} color={usePinecone ? T.green : T.text2} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: usePinecone ? T.green : T.text }}>Pinecone RAG</div>
                      <div style={{ fontSize: 11, color: T.text3 }}>{usePinecone ? 'Enabled — queries your knowledge base' : 'Add document-based knowledge to your bot'}</div>
                    </div>
                  </div>
                  <div style={{ ...row, gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Fira Code', monospace", color: usePinecone ? T.green : T.text3 }}>{usePinecone ? 'ON' : 'OFF'}</span>
                    {usePinecone ? <ToggleRight size={22} color={T.green} /> : <ToggleLeft size={22} color={T.text3} />}
                  </div>
                </button>

                {usePinecone && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid #4ade8015', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 12 }}>
                    <div>
                      <span style={{ ...label, color: T.green }}>Index Name <span style={{ color: '#ef4444' }}>*</span></span>
                      <Inp value={pineconeIndex} onChange={setPineconeIndex} placeholder="orb-knowledge" mono />
                      {!pineconeIndex && <p style={{ fontSize: 11, color: '#ef444460', marginTop: 5 }}>⚠ Enter the exact name from your Pinecone dashboard</p>}
                    </div>
                    <div>
                      <span style={{ ...label, color: T.green }}>Namespace <span style={{ color: T.text3, fontWeight: 400 }}>(default: "default")</span></span>
                      <Inp value={pineconeNS} onChange={setPineconeNS} placeholder="default" mono />
                    </div>
                    <div style={{ fontSize: 11, lineHeight: 1.7, padding: '10px 12px', borderRadius: 8, background: '#040c06', border: '1px solid #4ade8015', color: '#4ade8080' }}>
                      Set <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>PINECONE_API_KEY</code> + <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>OLLAMA_URL</code> in your <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>.env</code>. Pull model: <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>ollama pull nomic-embed-text</code>.
                      Run <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>scripts/ingest.py</code> to index your docs.{' '}
                      <a href="#pinecone-docs" style={{ color: T.green }}>Setup guide ↓</a>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={() => setPreviewOpen(p => !p)}
                style={{ width: '100%', padding: '10px 0', borderRadius: 9, fontWeight: 700, fontSize: 13, color: 'white', background: `linear-gradient(135deg, ${T.purple}, ${T.purpleD})`, border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                {previewOpen ? '✕ Hide Preview' : '🔮 Preview Your Bot'}
              </button>
            </div>

            {/* Generated code panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden' }}>
                {/* Tabs */}
                <div style={{ ...row, borderBottom: `1px solid ${T.border}` }}>
                  {([
                    { k: 'script' as const, l: 'Script',  I: Terminal },
                    { k: 'iframe' as const, l: 'iFrame',  I: Globe    },
                    { k: 'react'  as const, l: 'React',   I: Code     },
                  ]).map(({ k, l, I }) => (
                    <button key={k} onClick={() => setActiveTab(k)}
                      style={{ flex: 1, ...row, justifyContent: 'center', gap: 6, padding: '10px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: "'Inter', sans-serif", background: activeTab === k ? '#9333ea10' : 'transparent', color: activeTab === k ? T.purpleL : T.text2, borderBottom: `2px solid ${activeTab === k ? T.purple : 'transparent'}` }}>
                      <I size={12} />{l}
                    </button>
                  ))}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ ...row, gap: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 11, color: T.text2 }}>
                      {activeTab === 'script' && 'Paste before </body> on any HTML page.'}
                      {activeTab === 'iframe'  && 'Works in any environment, including no-script.'}
                      {activeTab === 'react'   && 'Import directly into your React / Next.js app.'}
                    </p>
                    {usePinecone && pineconeIndex && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#4ade8012', color: T.green, border: '1px solid #4ade8025' }}>+ RAG</span>
                    )}
                  </div>
                  <CodeBlock code={tabCode} />
                </div>
              </div>

              {/* Pinecone status */}
              <div style={{ padding: '14px 16px', borderRadius: 10, background: usePinecone && pineconeIndex ? '#060f08' : T.bg1, border: `1px solid ${usePinecone && pineconeIndex ? '#4ade8025' : T.border}`, transition: 'all .25s' }}>
                <div style={{ ...row, gap: 8, marginBottom: 4 }}>
                  <Database size={13} color={usePinecone && pineconeIndex ? T.green : T.text3} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: usePinecone && pineconeIndex ? T.green : T.text3 }}>
                    Pinecone RAG: {usePinecone ? (pineconeIndex ? `enabled · "${pineconeIndex}"` : 'on — index name needed') : 'disabled'}
                  </span>
                </div>
                <p style={{ fontSize: 11, color: T.text3, lineHeight: 1.6 }}>
                  {usePinecone && pineconeIndex
                    ? `Queries "${pineconeIndex}" (ns: "${pineconeNS}") for context before every AI response.`
                    : 'Toggle Pinecone ON above to give your bot domain-specific knowledge.'}
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {previewOpen && (
            <div style={{ marginTop: 16, borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border2}` }}>
              <div style={{ ...row, gap: 8, padding: '10px 16px', background: '#9333ea0a', borderBottom: `1px solid ${T.border2}` }}>
                <Sparkles size={13} color={T.purpleL} />
                <span style={{ fontSize: 12, fontWeight: 700, color: T.purpleL }}>Live Preview</span>
                <span style={{ fontSize: 11, color: T.text3 }}>— your bot appears in the corner below</span>
              </div>
              <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06040e' }}>
                <span style={{ fontSize: 13, color: T.border2 }}>Your website content here</span>
                <div style={{ position: 'absolute', bottom: 16, right: 16, width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${color}, ${color}99)`, boxShadow: `0 0 20px ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="white" />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section style={{ marginBottom: 72 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, marginBottom: 4 }}>How It Works</h2>
          <p style={{ fontSize: 13, color: T.text2, marginBottom: 20 }}>With Pinecone enabled, every message triggers a retrieval pipeline before hitting the AI.</p>
          <ArchDiagram />
        </section>

        {/* ═══ PINECONE DOCS ═══ */}
        <section id="pinecone-docs" style={{ marginBottom: 72, scrollMarginTop: 80 }}>
          <SectionHeader icon={Database} color={T.green} title="Pinecone Setup" hint="Index your documents once. Orb retrieves the most relevant chunks at query time — no fine-tuning needed." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 20 }}>
            {[
              { n: '01', t: 'Set env vars',        d: 'Add PINECONE_API_KEY and OLLAMA_URL to your .env file.' },
              { n: '02', t: 'Run ingest.py',        d: 'Chunks, embeds, and upserts your documents into Pinecone.' },
              { n: '03', t: 'Enable in Customizer', d: 'Toggle Pinecone ON, enter your index name, copy embed code.' },
            ].map(({ n, t, d }) => (
              <div key={n} style={card}>
                <div style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: T.green, marginBottom: 6, fontWeight: 600 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 5 }}>{t}</div>
                <div style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>

          <CodeBlock filename=".env" code={`PINECONE_API_KEY=your_pinecone_api_key\nPINECONE_INDEX_NAME=orb-knowledge    # must match the Customizer input\nOLLAMA_URL=http://ollama:11434       # Docker · http://localhost:11434 for bare-metal\nOLLAMA_EMBED_MODEL=nomic-embed-text   # run: ollama pull nomic-embed-text`} />
          <CodeBlock filename="terminal" code={`pip install pinecone openai python-dotenv\n\n# Single file\npython scripts/ingest.py docs/knowledge.txt\n\n# Whole folder (.txt .md .rst)\npython scripts/ingest.py docs/ --namespace faq\n\n# Custom chunk size\npython scripts/ingest.py manual.md --chunk-size 400 --overlap 60`} />
          <CodeBlock filename="Runtime RAG flow" code={`User sends message
  │
  ▼  POST /api/chat  { message, pineconeIndexName, namespace }
  │
  ├─ 1. Embed message  →  Ollama nomic-embed-text (local)
  ├─ 2. Query Pinecone →  top-4 chunks, cosine similarity ≥ 0.55
  └─ 3. Return { context }
  │
  ▼  Widget builds RAG prompt:
     "Use the context below to answer. If not covered, say so.

      Context: <retrieved chunks>
      ---
      User: <message>"
  │
  ▼  window.puter.ai.chat(prompt)  →  AI response
     ["Retrieved from knowledge base" badge on RAG messages]`} />

          <div style={{ background: '#060f08', border: '1px solid #4ade8015', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 10 }}>💡 Tips for great retrieval</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Aim for 400–600 words per chunk with ~50-word overlap', 'Add metadata: source filename, section title, date', 'Use separate namespaces for "support", "docs", "faq"', 'Re-run ingest.py when docs change — upserts are idempotent by ID', 'Test retrieval quality in the Pinecone console before wiring to the bot'].map(tip => (
                <div key={tip} style={{ ...row, gap: 8, alignItems: 'flex-start' }}>
                  <ChevronRight size={12} color="#4ade8045" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 12, color: T.text2, lineHeight: 1.6 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section style={{ marginBottom: 72, padding: '56px 40px', borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden', background: T.bg1, border: `1px solid ${T.border2}` }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 100%, ${T.purple}0c, transparent)`, pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 8, position: 'relative' }}>Ready to launch?</h2>
          <p style={{ fontSize: 14, color: T.text2, marginBottom: 28, position: 'relative' }}>Click the 🔮 bubble in the corner — live AI chat, right now.</p>
          <div style={{ ...row, justifyContent: 'center', gap: 12, flexWrap: 'wrap', position: 'relative' }}>
            <a href="#customizer" style={{ ...row, gap: 8, padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: 13, color: 'white', textDecoration: 'none', background: `linear-gradient(135deg, ${T.purple}, ${T.purpleD})`, boxShadow: `0 0 20px ${T.purple}35` }}>
              <Sparkles size={15} /> Build Your Bot
            </a>
            <Link href="/docs/how-to-use" style={{ ...row, gap: 8, padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: 13, color: T.purpleL, textDecoration: 'none', background: T.bg, border: `1px solid ${T.border2}` }}>
              <BookOpen size={15} /> Full Docs
            </Link>
          </div>
        </section>
      </div>

      <footer style={{ borderTop: `1px solid ${T.border}`, padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: T.text3 }}>Orb · Built with Puter.js · Next.js · Pinecone</p>
      </footer>

      <ChatbotWidget
        botName={botName} greeting={greeting} position={position}
        systemPrompt={systemPrompt || undefined}
        pineconeEnabled={usePinecone}
        pineconeIndexName={pineconeIndex || undefined}
        pineconeNamespace={pineconeNS}
      />
    </div>
  )
}
