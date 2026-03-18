/**
 * Orb - AI Chat Widget Embed Script
 * Powered by Puter.js · Optional Pinecone RAG
 *
 * Usage:
 *   <script>
 *     window.OrbConfig = {
 *       botName: "Orb",
 *       greeting: "Hi! How can I help?",
 *       primaryColor: "#9333ea",
 *       position: "bottom-right",
 *       systemPrompt: "You are a support agent for Acme Corp.",
 *       pineconeEnabled: true,
 *       pineconeIndexName: "orb-knowledge",
 *       pineconeNamespace: "default",
 *     }
 *   </script>
 *   <script src="https://js.puter.com/v2/"></script>
 *   <script src="https://your-domain.com/chatbot-embed.js"></script>
 */
;(function () {
  var cfg = window.OrbConfig || {}
  var botName       = cfg.botName       || 'Orb'
  var primaryColor  = cfg.primaryColor  || '#9333ea'
  var position      = cfg.position      || 'bottom-right'
  var systemPrompt  = cfg.systemPrompt  || ''
  var pineconeEnabled   = cfg.pineconeEnabled   || false
  var pineconeIndexName = cfg.pineconeIndexName || ''
  var pineconeNamespace = cfg.pineconeNamespace || 'default'
  var greeting      = cfg.greeting || ("Hi there! \uD83D\uDC4B I'm " + botName + (pineconeEnabled && pineconeIndexName ? '. I have access to a knowledge base for accurate answers.' : '. How can I help?'))

  // Inject Puter.js if not already present
  if (!window.puter && !document.getElementById('puter-js')) {
    var ps = document.createElement('script')
    ps.id = 'puter-js'; ps.src = 'https://js.puter.com/v2/'; ps.async = true
    document.head.appendChild(ps)
  }

  var side = position === 'bottom-left' ? 'left' : 'right'

  /* ── Styles ── */
  var style = document.createElement('style')
  style.textContent = [
    '@keyframes orbUp{from{opacity:0;transform:translateY(16px) scale(.95)}to{opacity:1;transform:none}}',
    '@keyframes orbBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}',
    '@keyframes orbPulse{0%,100%{box-shadow:0 0 0 0 ' + primaryColor + '40,0 8px 32px #00000080}50%{box-shadow:0 0 0 12px ' + primaryColor + '00,0 8px 32px #00000080}}',
    '.orb-btn{position:fixed;bottom:20px;' + side + ':20px;z-index:999998;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,' + primaryColor + ',' + primaryColor + 'bb);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:orbPulse 2.5s ease-in-out infinite;transition:all .3s}',
    '.orb-btn svg{width:24px;height:24px;color:#fff}',
    '.orb-win{position:fixed;bottom:20px;' + side + ':20px;z-index:999999;width:min(390px,calc(100vw - 20px));height:min(620px,calc(100vh - 36px));border-radius:20px;background:#0c0a14;border:1px solid #3b1f6e;box-shadow:0 0 0 1px rgba(147,51,234,.1),0 32px 64px rgba(0,0,0,.9),0 0 100px rgba(124,58,237,.08);display:flex;flex-direction:column;overflow:hidden;animation:orbUp .25s cubic-bezier(.34,1.56,.64,1)}',
    '.orb-hdr{flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:linear-gradient(135deg,#5b21b6,#4c1d95);border-bottom:1px solid rgba(109,40,217,.25)}',
    '.orb-hdr-left{display:flex;align-items:center;gap:10px}',
    '.orb-avatar{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center}',
    '.orb-avatar svg{width:20px;height:20px;color:#fff}',
    '.orb-name{font-size:14px;font-weight:600;color:#fff;line-height:1.3}',
    '.orb-status{display:flex;align-items:center;gap:6px}',
    '.orb-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;box-shadow:0 0 6px #4ade80}',
    '.orb-sub{font-size:10px;color:rgba(255,255,255,.55)}',
    '.orb-rag-badge{font-size:9px;display:flex;align-items:center;gap:4px;padding:2px 7px;border-radius:20px;background:rgba(74,222,128,.1);color:#4ade80;border:1px solid rgba(74,222,128,.25)}',
    '.orb-close{background:rgba(255,255,255,.1);border:none;color:#fff;cursor:pointer;padding:6px;border-radius:8px;line-height:0}',
    '.orb-close svg{width:16px;height:16px}',
    '.orb-msgs{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:12px;background:#0c0a14;scrollbar-width:thin;scrollbar-color:#7c3aed30 transparent}',
    '.orb-row{display:flex;align-items:flex-end;gap:8px}',
    '.orb-row.user{flex-direction:row-reverse}',
    '.orb-ico{width:24px;height:24px;border-radius:8px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:rgba(76,29,149,.4);border:1px solid rgba(124,58,237,.3)}',
    '.orb-ico svg{width:12px;height:12px;color:#a78bfa}',
    '.orb-bubble{max-width:80%;border-radius:16px;font-size:13px;line-height:1.65}',
    '.orb-bubble.bot{padding:10px 13px;background:#161028;border:1px solid #2d1f5e;color:#d1c4f0;border-radius:16px 16px 16px 4px}',
    '.orb-bubble.user{padding:10px 14px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;border-radius:16px 16px 4px 16px}',
    '.orb-rag-note{font-size:9px;color:rgba(74,222,128,.5);display:flex;align-items:center;gap:4px;margin-top:3px;margin-left:4px}',
    '.orb-typing{display:flex;align-items:center;gap:5px;padding:12px}',
    '.orb-dot-bounce{width:6px;height:6px;border-radius:50%;background:#7c3aed}',
    '.orb-input-area{flex-shrink:0;padding:10px 12px;background:#0f0c1a;border-top:1px solid #2d1f5e}',
    '.orb-form{display:flex;gap:8px;align-items:center}',
    '.orb-input{flex:1;background:#1a1330;border:1px solid #3b2d6e;border-radius:12px;padding:10px 14px;color:#e2d9f3;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}',
    '.orb-input:focus{border-color:#7c3aed}',
    '.orb-send{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#9333ea,#6d28d9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .2s}',
    '.orb-send:disabled{opacity:.35;cursor:not-allowed}',
    '.orb-send svg{width:15px;height:15px;color:#fff}',
    '.orb-footer{text-align:center;font-size:10px;color:#4b3f6b;margin-top:6px}',
    /* prose */
    '.orb-prose p{margin:0 0 .4rem;line-height:1.65;color:#d1c4f0}',
    '.orb-prose p:last-child{margin-bottom:0}',
    '.orb-prose strong{font-weight:700;color:#c4b5fd}',
    '.orb-prose em{font-style:italic;color:#a78bfa}',
    '.orb-prose ul{margin:.2rem 0 .4rem 1rem;list-style:disc;color:#c4b5fd}',
    '.orb-prose ol{margin:.2rem 0 .4rem 1rem;list-style:decimal;color:#c4b5fd}',
    '.orb-prose li{margin-bottom:.15rem;line-height:1.5}',
    '.orb-prose h1,.orb-prose h2,.orb-prose h3{color:#ddd6fe;font-weight:700;margin:.4rem 0 .2rem}',
    '.orb-prose h1{font-size:1.05rem}.orb-prose h2{font-size:.95rem}.orb-prose h3{font-size:.875rem}',
    '.orb-prose pre{background:#0a0814;border:1px solid #3b1d6e;border-radius:8px;padding:10px;overflow-x:auto;margin:.4rem 0}',
    '.orb-prose code{font-family:monospace;font-size:.78em;color:#c4b5fd}',
    '.orb-prose pre code{background:none;border:none}',
    '.orb-prose code:not(pre code){background:#1e1333;border:1px solid #4c1d95;border-radius:4px;padding:.1rem .3rem}',
    '.orb-prose a{color:#a78bfa;text-decoration:underline}',
    '.orb-prose blockquote{border-left:3px solid rgba(124,58,237,.5);padding-left:10px;color:#9ca3af;font-style:italic;margin:.4rem 0}',
  ].join('')
  document.head.appendChild(style)

  /* ── SVG icons ── */
  var sparklesSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/></svg>'
  var dbSVG       = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/></svg>'
  var sendSVG     = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>'
  var closeSVG    = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd"/></svg>'

  /* ── Simple markdown renderer ── */
  function md(text) {
    return text
      .replace(/```[\s\S]*?```/g, function(m){
        var code = m.replace(/^```\w*\n?/, '').replace(/```$/, '')
        return '<pre><code>' + esc(code.trim()) + '</code></pre>'
      })
      .replace(/`([^`\n]+)`/g, function(_,c){ return '<code>' + esc(c) + '</code>' })
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,  '<h1>$1</h1>')
      .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, '<ul>$1</ul>$2')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .split(/\n\n+/).map(function(b){
        var t = b.trim()
        if (!t) return ''
        if (/^<[hupbla]/.test(t)) return t
        return '<p>' + t.replace(/\n/g,'<br/>') + '</p>'
      }).join('\n')
  }
  function esc(t){ return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

  /* ── State ── */
  var open = false
  var loading = false
  var messages = [{ id: '1', text: greeting, sender: 'bot' }]

  /* ── DOM ── */
  var btn = document.createElement('button')
  btn.className = 'orb-btn'
  btn.innerHTML = sparklesSVG
  btn.setAttribute('aria-label', 'Open ' + botName)

  var win = document.createElement('div')
  win.className = 'orb-win'
  win.style.display = 'none'
  win.innerHTML = [
    '<div class="orb-hdr">',
      '<div class="orb-hdr-left">',
        '<div class="orb-avatar">' + sparklesSVG + '</div>',
        '<div>',
          '<div class="orb-name">' + botName + '</div>',
          '<div class="orb-status">',
            '<div class="orb-dot"></div>',
            '<span class="orb-sub">' + (pineconeEnabled && pineconeIndexName ? 'RAG · ' + pineconeIndexName : 'Powered by Puter.js') + '</span>',
          '</div>',
        '</div>',
      '</div>',
      '<div style="display:flex;align-items:center;gap:8px">',
        (pineconeEnabled && pineconeIndexName ? '<div class="orb-rag-badge">' + dbSVG.replace('viewBox', 'width="10" height="10" viewBox') + 'RAG</div>' : ''),
        '<button class="orb-close" aria-label="Close">' + closeSVG + '</button>',
      '</div>',
    '</div>',
    '<div class="orb-msgs"></div>',
    '<div class="orb-input-area">',
      '<form class="orb-form">',
        '<input class="orb-input" type="text" placeholder="Ask me anything…"/>',
        '<button class="orb-send" type="submit">' + sendSVG + '</button>',
      '</form>',
      '<div class="orb-footer">' + (pineconeEnabled && pineconeIndexName ? 'RAG-enhanced · ' + pineconeIndexName : 'Puter.js AI · No API key needed') + '</div>',
    '</div>',
  ].join('')

  function renderMsgs() {
    var box = win.querySelector('.orb-msgs')
    box.innerHTML = messages.map(function(m) {
      var content = m.sender === 'bot'
        ? '<div class="orb-bubble bot orb-prose">' + md(m.text) + '</div>'
        : '<div class="orb-bubble user">' + esc(m.text) + '</div>'
      var rag = m.usedPinecone ? '<div class="orb-rag-note">' + dbSVG.replace('viewBox','width="10" height="10" viewBox') + 'Retrieved from knowledge base</div>' : ''
      if (m.sender === 'bot') {
        return '<div class="orb-row"><div class="orb-ico">' + sparklesSVG + '</div><div>' + content + rag + '</div></div>'
      }
      return '<div class="orb-row user">' + content + '</div>'
    }).join('') + (loading ? '<div class="orb-row"><div class="orb-ico">' + sparklesSVG + '</div><div class="orb-bubble bot orb-prose"><div class="orb-typing"><div class="orb-dot-bounce" style="animation:orbBounce .9s 0ms ease-in-out infinite"></div><div class="orb-dot-bounce" style="animation:orbBounce .9s 160ms ease-in-out infinite"></div><div class="orb-dot-bounce" style="animation:orbBounce .9s 320ms ease-in-out infinite"></div></div></div></div>' : '')
    box.scrollTop = box.scrollHeight
  }

  async function fetchContext(text) {
    if (!pineconeEnabled || !pineconeIndexName) return null
    try {
      var r = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text, pineconeIndexName: pineconeIndexName, namespace: pineconeNamespace, topK: 4 })
      })
      if (!r.ok) return null
      var d = await r.json()
      return d.context || null
    } catch { return null }
  }

  function buildPrompt(text, context) {
    var parts = []
    if (systemPrompt) parts.push('System: ' + systemPrompt)
    if (context) parts.push('Use the following context to answer. If not covered, say so.\n\nContext:\n' + context + '\n---')
    parts.push('User: ' + text)
    return parts.join('\n\n')
  }

  async function sendMsg(text) {
    if (!text.trim() || loading) return
    messages.push({ id: Date.now() + '', text: text, sender: 'user' })
    loading = true
    win.querySelector('input').value = ''
    win.querySelector('input').disabled = true
    renderMsgs()

    var context = await fetchContext(text)
    var prompt = buildPrompt(text, context)

    try {
      var resp = await window.puter.ai.chat(prompt)
      var botText = (resp && resp.message && resp.message.content) || "Sorry, I didn't get a response."
      messages.push({ id: (Date.now()+1) + '', text: botText, sender: 'bot', usedPinecone: !!context })
    } catch(e) {
      messages.push({ id: (Date.now()+1) + '', text: 'Something went wrong. Please try again.', sender: 'bot' })
    }
    loading = false
    win.querySelector('input').disabled = false
    win.querySelector('input').focus()
    renderMsgs()
  }

  btn.addEventListener('click', function(){
    open = true
    win.style.display = 'flex'
    btn.style.display = 'none'
    win.querySelector('input').focus()
  })
  win.querySelector('.orb-close').addEventListener('click', function(){
    open = false
    win.style.display = 'none'
    btn.style.display = 'flex'
  })
  win.querySelector('form').addEventListener('submit', function(e){
    e.preventDefault()
    sendMsg(win.querySelector('input').value)
  })

  var container = document.createElement('div')
  container.appendChild(btn)
  container.appendChild(win)
  document.body.appendChild(container)

  renderMsgs()

  window.OrbWidget = {
    open:        function(){ if (!open) btn.click() },
    close:       function(){ if (open) win.querySelector('.orb-close').click() },
    sendMessage: sendMsg,
    addMessage:  function(text, sender){ messages.push({ id: Date.now()+'', text:text, sender:sender||'bot' }); renderMsgs() }
  }
})()
