<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:080612,100:9333ea&text=Orb&section=header&fontColor=ffffff&fontAlign=50&fontAlignY=38&animation=scaleIn&fontSize=72&stroke=000000&strokeWidth=1.5" />

<br/>

[![Live Demo](https://img.shields.io/badge/🔮%20Live%20Demo-Orb-9333ea?style=for-the-badge&logoColor=white)](https://your-domain.com)
[![Docs](https://img.shields.io/badge/📄%20Docs-How%20to%20Use-7c3aed?style=for-the-badge&logoColor=white)](https://your-domain.com/docs/how-to-use)
[![Pinecone](https://img.shields.io/badge/🌲%20Pinecone-RAG%20Training-000000?style=for-the-badge)](https://pinecone.io)

<br/>

> **A floating AI chat widget for any website — powered by Puter.js, trained by Pinecone, configured by the built-in Customizer.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)
![Puter.js](https://img.shields.io/badge/Puter.js-9333ea?style=flat-square&logoColor=white)
![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=flat-square&logoColor=white)

</div>

---

## 📖 Overview

<div align="justify">

**Orb** is a plug-and-play AI chat widget that floats on any website. Drop in two script tags and get real AI conversations instantly — no backend, no API key, no cost. Powered by [Puter.js](https://puter.com).

Want your bot to actually *know* your product? Toggle on **Pinecone RAG** in the built-in Customizer, enter your index name, and Orb will retrieve relevant document chunks before every response. The `/api/chat` route handles embedding (Ollama — local, no API key) and querying Pinecone server-side — nothing leaks to the browser.

The **Live Customizer** on the landing page generates ready-to-copy embed code (script tag, iFrame, or React component) with your exact configuration — including bot name, greeting, brand color, position, system prompt, and Pinecone settings.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔮 **Floating Widget** | Animated chat bubble + window — works on any website |
| 🤖 **Puter.js AI** | Real AI responses, zero API keys or billing |
| 🌲 **Pinecone RAG Toggle** | Enable in the Customizer → enter index name → done |
| 🎨 **Live Customizer** | Configure name, color, prompt, Pinecone → copy embed code |
| 📋 **3 Embed Formats** | Script tag, iFrame, and React component generated live |
| ✍️ **Rich Markdown** | Code blocks, bold, lists, headings — styled beautifully |
| 🏷️ **RAG Attribution** | "Retrieved from knowledge base" badge on RAG responses |
| 📱 **Fully Responsive** | Desktop, tablet, and mobile |

---

## 🛠️ Tech Stack

<details>
<summary><b>🖥️ Frontend</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI component library |
| [TypeScript 5.7](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | UI typography |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Code font |

</details>

<details>
<summary><b>🤖 AI & Data</b></summary>
<br/>

| Technology | Purpose |
|---|---|
| [Puter.js](https://puter.com) | AI responses — no API key needed |
| [Pinecone](https://pinecone.io) | Vector DB for document RAG |
| [Ollama](https://ollama.com/) | `nomic-embed-text` embeddings — local, free, no API key |

</details>

<details>
<summary><b>⚙️ API Routes</b></summary>
<br/>

| Route | Purpose |
|---|---|
| `POST /api/chat` | Embeds query → queries Pinecone → returns context |
| `POST /api/embed` | Server-side Ollama embedding (used by retrieval lib) |

</details>

---

## 🚀 Getting Started

### 1 · Install & Run

```bash
git clone https://github.com/your-org/orb.git
cd orb
npm install
npm run dev
# → http://localhost:3000          (landing + customizer)
# → http://localhost:3000/docs/how-to-use
```

### 2 · Environment Variables

Create a `.env.local` file:

```env
# Required only if using Pinecone RAG
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=orb-knowledge
OLLAMA_URL=http://localhost:11434     # or http://ollama:11434 in Docker
```

### 3 · Embed on Any Site

```html
<script>
  window.OrbConfig = {
    botName: "Orb",
    greeting: "Hi! How can I help?",
    primaryColor: "#9333ea",
    position: "bottom-right",
    // optional Pinecone RAG:
    pineconeEnabled: true,
    pineconeIndexName: "orb-knowledge",
    pineconeNamespace: "default",
  }
</script>
<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>
```

---

## 🌲 Pinecone RAG

### Enable in the Customizer (easiest)

1. Open the landing page → **Customizer** section
2. Toggle **Pinecone RAG** on
3. Enter your **Pinecone Index Name** (e.g. `orb-knowledge`)
4. Copy the generated embed code — it includes all Pinecone config

### Index your documents

```bash
pip install pinecone httpx python-dotenv
python scripts/ingest.py docs/knowledge.txt
python scripts/ingest.py docs/ --namespace faq
```

### How it works at runtime

```
User message
  → POST /api/chat { message, pineconeIndexName, namespace }
  → Embed with Ollama (nomic-embed-text) → Query Pinecone top-4 (cosine ≥ 0.55)
  → Return context to client
  → Build RAG prompt → window.puter.ai.chat(prompt)
  → Response shown with "Retrieved from knowledge base" badge
```

---

## 📂 Project Structure

```
orb/
├── app/
│   ├── page.tsx                   # Landing page + Customizer + Pinecone docs
│   ├── api/
│   │   ├── chat/route.ts          # Pinecone RAG: embed → query → return context
│   │   └── embed/route.ts         # Standalone Ollama embedding endpoint
│   ├── docs/how-to-use/page.tsx   # Full documentation
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   └── chatbot-widget.tsx         # React widget with real Pinecone RAG
│
├── public/
│   └── chatbot-embed.js           # Vanilla JS embed (also Pinecone-enabled)
│
├── scripts/
│   └── ingest.py                  # Document ingestion → Pinecone
│
├── lib/
│   └── pinecone-retrieval.ts      # Typed retrieval helper
│
└── README.md
```

---

## 🗺️ Roadmap

- [x] Floating AI chat widget (Puter.js)
- [x] Markdown + code block rendering
- [x] Live Customizer → generated embed code (script, iFrame, React)
- [x] Pinecone RAG toggle + index name in Customizer
- [x] `/api/chat` route — real Pinecone retrieval
- [x] RAG attribution badge on messages
- [x] System prompt support
- [x] Vanilla JS embed with full Pinecone support
- [ ] PDF upload UI for direct indexing
- [ ] Streaming responses
- [ ] Multi-namespace switcher in Customizer
- [ ] Analytics dashboard

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a branch — `git checkout -b feature/your-feature`
3. **Commit** — `git commit -m 'feat: your feature'`
4. **Push** — `git push origin feature/your-feature`
5. **Open** a Pull Request

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&height=120&color=0:9333ea,100:080612&section=footer" />

*Built with Puter.js · Next.js · Tailwind CSS · Pinecone*

</div>
