'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { ArrowLeft, ExternalLink, Copy, Check, Sparkles, Database, Server, Globe } from 'lucide-react'

/* ── Design tokens ── */
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
  text:    '#ede8f8',
  text2:   '#8b7aac',
  text3:   '#3e3060',
}

/* ── Shared styles ── */
const row = { display: 'flex', alignItems: 'center' } as const

/* ── Helpers ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return (
    <button onClick={copy} style={{
      ...row, gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
      cursor: 'pointer', border: `1px solid ${copied ? '#4ade8040' : T.border2}`,
      background: copied ? '#4ade8014' : '#9333ea12', color: copied ? T.green : T.text2,
      fontFamily: "'Inter', sans-serif",
    }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      <span style={{ marginLeft: 4 }}>{copied ? 'Copied' : 'Copy'}</span>
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

function Section({ id, title, icon: Icon, iconColor = T.purpleL, children }: {
  id: string; title: string; icon?: React.ElementType; iconColor?: string; children: React.ReactNode
}) {
  return (
    <section id={id} style={{ marginBottom: 56, scrollMarginTop: 80 }}>
      <div style={{ ...row, gap: 10, marginBottom: 4, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>
        {Icon && (
          <div style={{ width: 26, height: 26, borderRadius: 7, background: iconColor + '14', border: `1px solid ${iconColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={13} color={iconColor} />
          </div>
        )}
        <h2 style={{ fontSize: 19, fontWeight: 700, color: T.text }}>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: T.purpleL, marginBottom: 8 }}>{title}</h3>
      {children}
    </div>
  )
}

function InfoBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 9, background: color + '08', border: `1px solid ${color}22`, fontSize: 12, lineHeight: 1.7, color: T.text2, marginTop: 12 }}>
      {children}
    </div>
  )
}

const TOC = [
  { id: 'overview',       label: 'Overview'              },
  { id: 'prerequisites',  label: 'Prerequisites'          },
  { id: 'frontend',       label: 'Frontend Setup'         },
  { id: 'backend',        label: 'Python Backend'         },
  { id: 'cors',           label: 'CORS & Domain Access'   },
  { id: 'embed',          label: 'Embed on Any Website'   },
  { id: 'react',          label: 'React / Next.js'        },
  { id: 'config-ref',     label: 'Configuration Reference'},
  { id: 'pinecone',       label: 'Pinecone RAG'           },
  { id: 'ingest',         label: 'Ingesting Documents'    },
  { id: 'js-api',         label: 'JavaScript API'         },
  { id: 'platforms',      label: 'Platform Examples'      },
  { id: 'troubleshooting',label: 'Troubleshooting'        },
]

export default function HowToUsePage() {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif", color: T.text }}>

      {/* Top purple line */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${T.purpleD}, ${T.purple}, ${T.purpleL})` }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 30, borderBottom: `1px solid ${T.border}`, background: T.bg + 'f0', backdropFilter: 'blur(12px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 52, ...row, justifyContent: 'space-between' }}>
          <div style={{ ...row, gap: 16 }}>
            <Link href="/" style={{ ...row, gap: 6, fontSize: 13, fontWeight: 500, color: T.text3, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = T.text3)}>
              <ArrowLeft size={14} /> Back
            </Link>
            <div style={{ width: 1, height: 16, background: T.border }} />
            <div style={{ ...row, gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: `linear-gradient(135deg, ${T.purple}, ${T.purpleD})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={12} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>Orb</span>
              <span style={{ fontSize: 13, color: T.text3 }}>/</span>
              <span style={{ fontSize: 13, color: T.text3 }}>Docs</span>
            </div>
          </div>
          <a href="https://puter.com/dev" target="_blank" rel="noopener noreferrer"
            style={{ ...row, gap: 5, fontSize: 12, color: T.text3, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
            onMouseLeave={e => (e.currentTarget.style.color = T.text3)}>
            Puter.js Docs <ExternalLink size={11} />
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

        {/* Sidebar TOC */}
        <aside style={{ width: 200, flexShrink: 0, position: 'sticky', top: 72, display: 'none' }} id="toc-sidebar">
          <style>{`@media(min-width:900px){#toc-sidebar{display:block}}`}</style>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.text3, marginBottom: 10 }}>On this page</p>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {TOC.map(item => (
              <a key={item.id} href={`#${item.id}`}
                style={{ fontSize: 12, padding: '5px 8px', borderRadius: 6, color: T.text2, textDecoration: 'none', transition: 'color .15s, background .15s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => { e.currentTarget.style.color = T.purpleL; e.currentTarget.style.background = '#9333ea0a' }}
                onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.background = 'transparent' }}>
                {item.id === 'pinecone' && <Database size={10} color={T.green} />}
                {item.id === 'backend'  && <Server  size={10} color={T.blue} />}
                {item.id === 'cors'     && <Globe   size={10} color={T.amber} />}
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ ...row, gap: 8, marginBottom: 16, display: 'inline-flex', padding: '4px 12px', borderRadius: 999, background: '#9333ea12', border: `1px solid ${T.border2}` }}>
              <Sparkles size={11} color={T.purpleL} />
              <span style={{ fontSize: 11, fontWeight: 600, color: T.purpleL }}>Documentation</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: T.text, marginBottom: 10, letterSpacing: '-.02em' }}>How to Use Orb</h1>
            <p style={{ fontSize: 15, color: T.text2, lineHeight: 1.6 }}>
              Complete guide — frontend setup, Python backend, CORS configuration, Pinecone RAG, and platform examples.
            </p>
          </div>

          {/* ── OVERVIEW ── */}
          <Section id="overview" title="Overview" icon={Sparkles}>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.7, marginBottom: 16 }}>
              Orb is a floating AI chat widget. <a href="https://puter.com" target="_blank" rel="noopener noreferrer" style={{ color: T.purpleL }}>Puter.js</a> handles AI response generation entirely in the browser — no LLM server needed. The optional Python backend handles Pinecone vector retrieval (RAG) and Ollama embeddings (local, free, no API key).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
              {[
                { l: 'No API Key',       d: 'Puter.js handles AI auth transparently',       c: T.purpleL },
                { l: 'Puter.js AI',      d: 'Chat runs 100% in the browser',                 c: T.purpleL },
                { l: 'Pinecone RAG',     d: 'Optional — train on your own documents',        c: T.green   },
                { l: 'CORS Protected',   d: 'Only your allowed domains can call the API',    c: T.amber   },
              ].map(({ l, d, c }) => (
                <div key={l} style={{ padding: 14, borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: c, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 11, color: T.text2, lineHeight: 1.5 }}>{d}</div>
                </div>
              ))}
            </div>

            <CodeBlock filename="Architecture" code={`User types message
  │
  ├─ [Pinecone ON] ──► POST /api/chat ──► Python backend
  │                        embed via Ollama + query Pinecone
  │                        returns { context, sources }
  │
  ▼
buildPrompt(message + context)
  │
  ▼
window.puter.ai.chat(prompt)   ← Puter.js (free, no API key)
  │
  ▼
AI response shown in chat`} />
          </Section>

          {/* ── PREREQUISITES ── */}
          <Section id="prerequisites" title="Prerequisites">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: 'Embed script',    r: 'Any webpage that can load a <script> tag' },
                { l: 'React component', r: 'React 18+ or Next.js 14+' },
                { l: 'Local dev',       r: 'Node.js 18+ and npm / pnpm' },
                { l: 'Python backend',  r: 'Python 3.10+, pip' },
                { l: 'Pinecone RAG',    r: 'Pinecone account + Ollama running locally (nomic-embed-text pulled)' },
              ].map(({ l, r }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 9, background: T.bg1, border: `1px solid ${T.border}` }}>
                  <code style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", padding: '2px 8px', borderRadius: 5, background: '#9333ea12', color: T.purpleL, border: `1px solid ${T.border2}`, flexShrink: 0 }}>{l}</code>
                  <span style={{ fontSize: 13, color: T.text2 }}>{r}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── FRONTEND SETUP ── */}
          <Section id="frontend" title="Frontend Setup" icon={Sparkles}>
            <Sub title="Install & run">
              <CodeBlock filename="terminal" code={`git clone https://github.com/your-org/orb.git
cd orb
npm install
npm run dev
# → http://localhost:3000`} />
            </Sub>
            <Sub title="Production build">
              <CodeBlock filename="terminal" code={`npm run build
npm start`} />
            </Sub>
            <Sub title="Environment variables">
              <CodeBlock filename=".env.local" code={`# Point at the Python backend (recommended)
BACKEND_URL=http://localhost:8000

# OR — run without the Python backend (direct Pinecone mode)
# PINECONE_API_KEY=your_key
# OLLAMA_URL=http://localhost:11434  # when not using Python backend directly`} />
              <InfoBox color={T.purpleL}>
                When <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>BACKEND_URL</code> is set, Next.js proxies all <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>/api/chat</code> and <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>/api/embed</code> calls to the Python server. Leave it unset to run Pinecone calls directly inside Next.js.
              </InfoBox>
            </Sub>
          </Section>

          {/* ── PYTHON BACKEND ── */}
          <Section id="backend" title="Python Backend" icon={Server} iconColor={T.blue}>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.7, marginBottom: 16 }}>
              The backend handles <strong style={{ color: T.text }}>embeddings</strong> (Ollama — local, free) and <strong style={{ color: T.text }}>Pinecone retrieval</strong>. It does NOT run an LLM — AI responses are generated by Puter.js on the client.
            </p>

            <Sub title="Install">
              <CodeBlock filename="terminal" code={`cd backend
pip install -r requirements.txt`} />
            </Sub>

            <Sub title="Configure .env">
              <CodeBlock filename="backend/.env" code={`PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=orb-knowledge
PINECONE_ENVIRONMENT=us-east-1

OLLAMA_URL=http://ollama:11434        # Docker; use http://localhost:11434 bare-metal
OLLAMA_EMBED_MODEL=nomic-embed-text   # pull with: ollama pull nomic-embed-text

# CORS — comma-separated list of allowed frontend origins
ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com

TRAIN_DOX_PATH=./train-docs`} />
            </Sub>

            <Sub title="Start the server">
              <CodeBlock filename="terminal" code={`uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs`} />
            </Sub>

            <Sub title="Endpoints">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { method: 'GET',    path: '/',                       desc: 'Health check — returns index name, model, allowed origins' },
                  { method: 'POST',   path: '/chat',                   desc: 'Embed query → query Pinecone → return { context, sources }' },
                  { method: 'POST',   path: '/embed',                  desc: 'Return a raw Ollama embedding for a string' },
                  { method: 'POST',   path: '/ingest-directory',       desc: 'Chunk, embed, and upsert documents from a folder into Pinecone' },
                  { method: 'DELETE', path: '/namespace/{namespace}',  desc: 'Delete all vectors in a namespace (useful before re-ingesting)' },
                ].map(({ method, path, desc }) => (
                  <div key={path} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 9, background: T.bg1, border: `1px solid ${T.border}` }}>
                    <code style={{ fontSize: 10, fontFamily: "'Fira Code', monospace", padding: '2px 7px', borderRadius: 5, flexShrink: 0, fontWeight: 700,
                      background: method === 'GET' ? '#38bdf814' : method === 'POST' ? '#9333ea14' : '#fb718514',
                      color:      method === 'GET' ? T.blue      : method === 'POST' ? T.purpleL  : T.rose,
                      border: `1px solid ${method === 'GET' ? '#38bdf828' : method === 'POST' ? '#9333ea28' : '#fb718528'}`,
                    }}>{method}</code>
                    <div>
                      <code style={{ fontSize: 11, fontFamily: "'Fira Code', monospace", color: T.text }}>{path}</code>
                      <div style={{ fontSize: 11, color: T.text2, marginTop: 2 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Sub>
          </Section>

          {/* ── CORS ── */}
          <Section id="cors" title="CORS & Domain Access" icon={Globe} iconColor={T.amber}>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.7, marginBottom: 16 }}>
              The Python backend restricts API access to a whitelist of domains. Only origins listed in <code style={{ fontFamily: "'Fira Code', monospace", color: T.amber }}>ALLOWED_ORIGINS</code> can make requests — any other domain will receive a CORS error.
            </p>

            <Sub title="Single domain">
              <CodeBlock filename="backend/.env" code={`ALLOWED_ORIGINS=https://mysite.com`} />
            </Sub>

            <Sub title="Multiple domains (comma-separated)">
              <CodeBlock filename="backend/.env" code={`ALLOWED_ORIGINS=https://mysite.com,https://app.mysite.com,http://localhost:3000`} />
            </Sub>

            <InfoBox color={T.amber}>
              <strong style={{ color: T.amber }}>Important:</strong> Always include <code style={{ fontFamily: "'Fira Code', monospace", color: T.amber }}>http://localhost:3000</code> during development. In production, list every domain that hosts an Orb widget powered by this backend. Wildcards (<code style={{ fontFamily: "'Fira Code', monospace", color: T.amber }}>*</code>) are intentionally not supported for security.
            </InfoBox>

            <Sub title="How it works in the backend">
              <CodeBlock filename="backend/main.py (excerpt)" code={`app.add_middleware(
    CORSMiddleware,
    allow_origins=Settings.cors_origins,   # parsed from ALLOWED_ORIGINS
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)`} />
            </Sub>
          </Section>

          {/* ── EMBED ── */}
          <Section id="embed" title="Embed on Any Website" icon={Globe} iconColor={T.blue}>
            <Sub title="Step 1 — Optional config">
              <CodeBlock filename="index.html" code={`<script>
  window.OrbConfig = {
    botName: "Orb",
    greeting: "Hi! How can I help?",
    primaryColor: "#9333ea",
    position: "bottom-right",          // or "bottom-left"
    systemPrompt: "You are a helpful assistant for Acme Corp.",
    // Pinecone RAG (optional):
    pineconeEnabled: true,
    pineconeIndexName: "orb-knowledge",
    pineconeNamespace: "default",
  }
</script>`} />
            </Sub>
            <Sub title="Step 2 — Load scripts">
              <CodeBlock filename="index.html" code={`<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>`} />
            </Sub>
            <InfoBox color={T.purpleL}>
              Add both tags before <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>&lt;/body&gt;</code>. Puter.js must load first. Orb appears in the corner automatically.
            </InfoBox>
          </Section>

          {/* ── REACT ── */}
          <Section id="react" title="React / Next.js">
            <CodeBlock filename="app/page.tsx" code={`import { ChatbotWidget } from '@/components/chatbot-widget'

export default function Page() {
  return (
    <>
      <h1>Your Website</h1>
      <ChatbotWidget
        botName="Orb"
        position="bottom-right"
        systemPrompt="You are a support agent for Acme Corp."
        pineconeEnabled={true}
        pineconeIndexName="orb-knowledge"
        pineconeNamespace="default"
      />
    </>
  )
}`} />
            <InfoBox color={T.purpleL}>
              The component auto-injects Puter.js — no manual script tag needed in React. When <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>pineconeEnabled</code> is true and your Next.js <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>.env.local</code> has <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>BACKEND_URL</code> set, Pinecone context is fetched automatically before every AI call.
            </InfoBox>
          </Section>

          {/* ── CONFIG REFERENCE ── */}
          <Section id="config-ref" title="Configuration Reference">
            <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${T.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: T.bg1, borderBottom: `1px solid ${T.border}` }}>
                    {['Option', 'Type', 'Default', 'Description'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: T.text, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { o: 'botName',            t: 'string',  d: '"Orb"',           desc: 'Display name shown in the widget header' },
                    { o: 'greeting',           t: 'string',  d: '"Hi there! 👋..."', desc: 'Opening message from the bot' },
                    { o: 'primaryColor',       t: 'string',  d: '"#9333ea"',        desc: 'Brand color for the button and header' },
                    { o: 'position',           t: 'string',  d: '"bottom-right"',   desc: '"bottom-right" or "bottom-left"' },
                    { o: 'systemPrompt',       t: 'string',  d: 'undefined',        desc: 'Persona / instructions prepended to every prompt' },
                    { o: 'pineconeEnabled',    t: 'boolean', d: 'false',            desc: 'Enable Pinecone RAG context retrieval' },
                    { o: 'pineconeIndexName',  t: 'string',  d: 'undefined',        desc: 'Your Pinecone index name (must match backend)' },
                    { o: 'pineconeNamespace',  t: 'string',  d: '"default"',        desc: 'Pinecone namespace to query' },
                  ].map((r, i) => (
                    <tr key={r.o} style={{ background: i % 2 === 0 ? '#0a0818' : 'transparent', borderBottom: `1px solid ${T.border}` }}>
                      <td style={{ padding: '9px 14px', fontFamily: "'Fira Code', monospace", color: T.purpleL }}>{r.o}</td>
                      <td style={{ padding: '9px 14px', color: T.text3 }}>{r.t}</td>
                      <td style={{ padding: '9px 14px', fontFamily: "'Fira Code', monospace", color: T.text3, fontSize: 11 }}>{r.d}</td>
                      <td style={{ padding: '9px 14px', color: T.text2 }}>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* ── PINECONE RAG ── */}
          <Section id="pinecone" title="Pinecone RAG" icon={Database} iconColor={T.green}>
            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.7, marginBottom: 16 }}>
              Pinecone RAG gives Orb domain-specific knowledge. Documents are chunked, embedded via Ollama (nomic-embed-text, local), and stored in Pinecone. At query time, the most relevant chunks are retrieved and injected into the Puter.js prompt.
            </p>
            <Sub title="Environment variables">
              <CodeBlock filename="backend/.env" code={`PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=orb-knowledge   # must match pineconeIndexName in the widget
OLLAMA_URL=http://localhost:11434    # Ollama server URL
OLLAMA_EMBED_MODEL=nomic-embed-text  # pull once: ollama pull nomic-embed-text`} />
            </Sub>
            <Sub title="How retrieval works">
              <CodeBlock filename="Runtime flow" code={`User sends message
  │
  ▼  POST /api/chat  { message, pineconeIndexName, namespace }
  │
  ├─ 1. Embed message      →  Ollama nomic-embed-text (local)
  ├─ 2. Query Pinecone     →  top-4 chunks, cosine similarity ≥ 0.55
  └─ 3. Return { context, sources }
  │
  ▼  Widget builds prompt:
     "Use the context below to answer. If not covered, say so.

      Context: <retrieved chunks>
      ---
      User: <message>"
  │
  ▼  window.puter.ai.chat(prompt)  →  AI response
     ["Retrieved from knowledge base" badge shown on RAG messages]`} />
            </Sub>
            <InfoBox color={T.green}>
              <strong style={{ color: T.green }}>Tips:</strong> Aim for 400–600 words per chunk · Add source/section metadata · Use separate namespaces for "support", "docs", "faq" · Re-ingest whenever docs change — upserts are idempotent.
            </InfoBox>
          </Section>

          {/* ── INGESTING DOCUMENTS ── */}
          <Section id="ingest" title="Ingesting Documents" icon={Database} iconColor={T.green}>
            <Sub title="Via the API (recommended)">
              <p style={{ fontSize: 12, color: T.text2, marginBottom: 8 }}>Put your docs in <code style={{ fontFamily: "'Fira Code', monospace", color: T.green }}>backend/train-docs/</code> then call:</p>
              <CodeBlock filename="terminal" code={`curl -X POST http://localhost:8000/ingest-directory \\
  -H "Content-Type: application/json" \\
  -d '{"namespace": "default"}'`} />
            </Sub>

            <Sub title="Via the CLI script">
              <CodeBlock filename="terminal" code={`# Single file
python scripts/ingest.py docs/knowledge.txt

# Whole folder (.txt .md .rst)
python scripts/ingest.py docs/ --namespace faq

# Custom chunk size
python scripts/ingest.py manual.md --chunk-size 400 --overlap 60`} />
            </Sub>

            <Sub title="Clear and re-ingest a namespace">
              <CodeBlock filename="terminal" code={`# Delete everything in the "default" namespace
curl -X DELETE http://localhost:8000/namespace/default

# Then re-ingest
curl -X POST http://localhost:8000/ingest-directory \\
  -H "Content-Type: application/json" \\
  -d '{"namespace": "default"}'`} />
            </Sub>
          </Section>

          {/* ── JS API ── */}
          <Section id="js-api" title="JavaScript API">
            <p style={{ fontSize: 13, color: T.text2, marginBottom: 12 }}>When using the embed script, <code style={{ fontFamily: "'Fira Code', monospace", color: T.purpleL }}>window.ChatbotWidget</code> exposes a small programmatic API.</p>
            <CodeBlock code={`ChatbotWidget.open()                         // open the chat window
ChatbotWidget.close()                        // close the chat window
ChatbotWidget.sendMessage('Hello!')          // send as user (triggers AI response)
ChatbotWidget.addMessage('Welcome!', 'bot')  // inject a message without triggering AI`} />
            <Sub title="Example — auto-open after 5 seconds">
              <CodeBlock code={`setTimeout(() => ChatbotWidget.open(), 5000)`} />
            </Sub>
            <Sub title="Example — page-specific greeting">
              <CodeBlock code={`window.addEventListener('load', () => {
  ChatbotWidget.addMessage("👋 Need help with checkout? I'm here!", 'bot')
})`} />
            </Sub>
          </Section>

          {/* ── PLATFORMS ── */}
          <Section id="platforms" title="Platform Examples" icon={Globe} iconColor={T.blue}>
            {[
              { name: 'WordPress',    hint: 'Appearance → Theme Editor → footer.php, before </body>' },
              { name: 'Shopify',      hint: 'Online Store → Themes → Edit code → theme.liquid, before </body>' },
              { name: 'Webflow',      hint: 'Page Settings → Custom Code → Footer Code' },
              { name: 'Static HTML',  hint: 'Paste before </body> in your HTML file' },
            ].map(({ name, hint }) => (
              <Sub key={name} title={name}>
                <p style={{ fontSize: 12, color: T.text2, marginBottom: 6 }}>{hint}:</p>
                <CodeBlock code={`<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>`} />
              </Sub>
            ))}
          </Section>

          {/* ── TROUBLESHOOTING ── */}
          <Section id="troubleshooting" title="Troubleshooting">
            {[
              {
                q: 'The chat bubble is not appearing',
                a: ['Open DevTools → Console and check for JS errors', 'Ensure both Puter.js and chatbot-embed.js script tags are present', 'Check z-index conflicts (Orb uses z-index 999999)'],
              },
              {
                q: 'No AI reply comes back',
                a: ['Open DevTools → Network and check for failed requests to puter.com', 'Ensure js.puter.com/v2/ loads before chatbot-embed.js', 'Check if an ad blocker or CSP header is blocking puter.com'],
              },
              {
                q: 'CORS error when Pinecone RAG is enabled',
                a: ['Add your frontend domain to ALLOWED_ORIGINS in backend/.env', 'Restart the backend after changing .env', 'Include http:// or https:// — bare domains without scheme are rejected'],
              },
              {
                q: 'Backend /chat returns context: null',
                a: ['Check that PINECONE_API_KEY and OLLAMA_URL are set in backend/.env', 'Verify Ollama is running and nomic-embed-text is pulled (ollama pull nomic-embed-text)', 'Verify the index name matches pineconeIndexName in the widget config', 'Run /ingest-directory first — the index may be empty'],
              },
              {
                q: 'Pinecone retrieval returns poor results',
                a: ['Review chunk size — aim for 400–600 words', 'Ensure OLLAMA_EMBED_MODEL matches between ingest and query (default: nomic-embed-text)', 'Inspect vector quality in the Pinecone console'],
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ marginBottom: 12, padding: '14px 16px', borderRadius: 10, background: T.bg1, border: `1px solid ${T.border}` }}>
                <div style={{ ...row, gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.purple }}>?</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{q}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, paddingLeft: 20 }}>
                  {a.map(p => (
                    <div key={p} style={{ ...row, gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#9333ea60', flexShrink: 0, marginTop: 2, fontSize: 11 }}>→</span>
                      <span style={{ fontSize: 12, color: T.text2, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Section>

          {/* Footer */}
          <div style={{ ...row, justifyContent: 'space-between', paddingTop: 24, borderTop: `1px solid ${T.border}`, marginTop: 8 }}>
            <Link href="/" style={{ ...row, gap: 6, fontSize: 13, color: T.text2, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = T.text2)}>
              <ArrowLeft size={14} /> Back to demo
            </Link>
            <a href="https://puter.com/dev" target="_blank" rel="noopener noreferrer"
              style={{ ...row, gap: 6, fontSize: 13, color: T.text2, textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = T.text2)}>
              Puter.js Docs <ExternalLink size={13} />
            </a>
          </div>
        </main>
      </div>
    </div>
  )
}
