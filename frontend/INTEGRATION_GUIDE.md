# Orb – Integration Guide (Powered by Puter.js)

A lightweight, plug-and-play Orb AI widget that works on any website. Powered by [Puter.js](https://puter.com) — no API key or backend required.

## Quick Start

### Option 1: Embed Script (Any Website)

Add these two lines before `</body>`:

```html
<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>
```

That's it! The Orb will appear in the bottom-right corner.

### Option 2: React Component (Next.js / React Apps)

```tsx
import { ChatbotWidget } from '@/components/chatbot-widget'

export default function Page() {
  return (
    <div>
      <h1>My Website</h1>
      <ChatbotWidget />
    </div>
  )
}
```

The component auto-injects Puter.js — no extra setup needed.

## Configuration

### Embed Script

```html
<script>
  window.ChatbotConfig = {
    primaryColor: '#7c3aed',     // Brand color (hex)
    position: 'bottom-right',    // 'bottom-right' or 'bottom-left'
  }
</script>
<script src="https://js.puter.com/v2/"></script>
<script src="https://your-domain.com/chatbot-embed.js"></script>
```

## How It Works

The chatbot uses `puter.ai.chat()` to send each user message to Puter's AI and stream back a response. There's no API key, no server, and no cost to get started.

## JavaScript API (Embed Script)

```javascript
ChatbotWidget.open()
ChatbotWidget.close()
ChatbotWidget.sendMessage('Hello!')
ChatbotWidget.addMessage('Welcome!', 'bot')
```

## Responsive Design

- **Desktop**: 400px × 600px
- **Mobile**: Full width minus padding, 500px height

## Browser Support

Chrome, Firefox, Safari, Edge — latest versions. iOS Safari and Chrome Mobile supported.

## Security

- All user input is HTML-escaped before rendering
- No messages are stored or sent to third parties beyond Puter.js
- Use HTTPS in production

## Deployment

```bash
npm install
npm run build
vercel deploy
```

Your embed script will be at `https://your-project.vercel.app/chatbot-embed.js`.

---

Happy chatting! 🚀
