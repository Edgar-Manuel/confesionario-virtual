import { useState, useRef, useEffect, useCallback } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const INITIAL_MESSAGE = {
  role: 'curia',
  content: 'Buenas tardes, hijo mío. Estoy aquí para escucharte. Cuéntame qué te pesa en el alma, sin miedo y con sinceridad. ¿Qué te trae al confesionario hoy?',
}

export default function ConfessionChat({ onLeave }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [absolved, setAbsolved] = useState(false)
  const [showEffect, setShowEffect] = useState(false)
  const [effectText, setEffectText] = useState('')

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, showEffect, scrollToBottom])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/confess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) throw new Error('Error en la confesión')

      const data = await res.json()

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'curia', content: data.reply }])

        if (data.efecto) {
          setEffectText(data.efecto)
          setShowEffect(true)
          setTimeout(() => setShowEffect(false), 4000)
        }

        if (data.absolucion) {
          setTimeout(() => setAbsolved(true), 1500)
        }

        setLoading(false)
      }, 600)

    } catch {
      setMessages(prev => [...prev, {
        role: 'curia',
        content: 'Perdona, hijo mío. Parece que hay interferencias en la línea divina. ¿Podrías intentarlo de nuevo?',
      }])
      setLoading(false)
    }
  }, [input, loading])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const renderMessage = (content) => {
    const parts = content.split('Ego te absolvo de tus pecados. Ve en paz.')
    if (parts.length === 1) return <span>{content}</span>

    return (
      <span>
        {parts[0]}
        <span className="text-gold-400 font-serif italic block mt-3 pt-3 border-t border-gold-500/20">
          "Ego te absolvo de tus pecados. Ve en paz."
        </span>
      </span>
    )
  }

  return (
    <div className="h-full flex flex-col bg-dark-950">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-dark-700 bg-dark-900/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            title="Salir del confesionario"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="text-xl">⛪</div>
          <div>
            <h2 className="text-sm font-serif text-gray-200">CurIA</h2>
            <p className="text-[10px] text-gray-600 font-light tracking-wider">Sacerdote Virtual</p>
          </div>
        </div>
        {absolved && (
          <div className="flex items-center gap-1.5 text-gold-500/60 text-xs animate-fade-in">
            <span className="inline-block w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
            Absuelto
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {msg.role === 'curia' && (
              <div className="shrink-0 mt-2 mr-2 text-lg opacity-60">🕊️</div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-curia'}>
              {msg.role === 'curia' ? (
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-serif">
                  {renderMessage(msg.content)}
                </p>
              ) : (
                <p className="text-sm text-gray-200 leading-relaxed">{msg.content}</p>
              )}
              <p className={`text-[10px] mt-1.5 font-light ${msg.role === 'user' ? 'text-gray-600 text-right' : 'text-gray-700'}`}>
                {msg.role === 'user' ? 'Tú' : 'CurIA'}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="shrink-0 mt-2 mr-2 text-lg opacity-60">🕊️</div>
            <div className="chat-bubble-curia">
              <div className="flex gap-1.5 py-1">
                <span className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="w-2 h-2 bg-gold-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Efecto de absolución */}
        {showEffect && (
          <div className="flex justify-center animate-fade-in">
            <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg px-6 py-3 text-center max-w-md">
              <p className="text-gold-400/80 text-xs italic font-light">{effectText}</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-dark-700 bg-dark-900/60 backdrop-blur-sm p-4 shrink-0">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confiesa tus pecados..."
              rows={1}
              disabled={loading}
              className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none outline-none transition-colors focus:border-gold-500/30 focus:bg-dark-700 disabled:opacity-50"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="shrink-0 h-[44px] w-[44px] flex items-center justify-center bg-gold-500/10 border border-gold-500/30 rounded-xl text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-700 mt-2 font-light tracking-wider">
          Presiona Enter para enviar · Tu confesión es privada y anónima
        </p>
      </div>

      {/* Absolución celebration overlay */}
      {absolved && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 pointer-events-none animate-fade-in">
          <div className="bg-dark-900/90 border border-gold-500/20 rounded-2xl px-8 py-5 text-center shadow-2xl shadow-gold-500/5 backdrop-blur-md">
            <div className="text-4xl mb-2">🕊️</div>
            <p className="text-gold-400 font-serif text-lg italic">Ego te absolvo</p>
            <p className="text-gray-500 text-xs mt-1">Tus pecados han sido perdonados. Ve en paz.</p>
          </div>
        </div>
      )}
    </div>
  )
}
