import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orb — AI Chat Widget · Puter.js + Pinecone RAG',
  description: 'Drop-in AI chat widget for any website. Powered by Puter.js, trainable with Pinecone RAG. No API key needed.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter — clean, readable UI font. Fira Code — sharp monospace */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body><Analytics />{children}</body>
    </html>
  )
}
