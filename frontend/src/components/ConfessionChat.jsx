import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import audio from '../audio'
import api from '../api'

const INITIAL_MESSAGE = {
  role: 'curia',
  content: 'Buenas tardes, hijo mío. Estoy aquí para escucharte. Cuéntame qué te pesa en el alma, sin miedo y con sinceridad. ¿Qué te trae al confesionario hoy?',
}

export default function ConfessionChat({ onLeave, onAbsolved, onShowDashboard, history }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [absolved, setAbsolved] = useState(false)
  const [effectText, setEffectText] = useState('')
  const [showEffect, setShowEffect] = useState(false)

  const scrollerRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, showEffect, loading, scrollToBottom])
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || absolved) return

    audio.spark()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const data = await api.confess(text)
      setMessages(prev => [...prev, { role: 'curia', content: data.reply }])
      setEffectText(data.efecto)
      setShowEffect(true)
      setTimeout(() => setShowEffect(false), 4500)
      api.logConfession({ sins: data.sins, penitencia: data.penitencia })
      setTimeout(() => {
        setAbsolved(true)
        onAbsolved && onAbsolved()
      }, 2200)
    } catch {
      setMessages(prev => [...prev, {
        role: 'curia',
        content: 'Perdona, hijo mío. Parece que hay interferencias en la línea divina. ¿Podrías intentarlo de nuevo?',
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, absolved, onAbsolved])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <motion.div
      key="chat"
      className="relative h-full w-full flex flex-col wood-texture penumbra-flicker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="lattice-overlay" />

      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
      }} />

      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-gold-500/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="text-bone/40 hover:text-bone/80 transition-colors p-1.5 rounded-full"
            title="Salir del confesionario"
            aria-label="Volver"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <CurIAEmblem />
            <div>
              <h2 className="font-display text-sm tracking-[0.25em] text-gold-300/90 uppercase">CurIA</h2>
              <p className="text-[10px] text-bone/35 tracking-[0.3em] uppercase">Sacerdote Virtual</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {history && history.count > 0 && (
            <button
              onClick={onShowDashboard}
              className="hidden sm:flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-gold-500/55 hover:text-gold-300 transition-colors px-3 py-1.5 rounded-full border border-gold-500/15 hover:border-gold-500/40"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-8 4 16 3-8h5" />
              </svg>
              Camino espiritual
            </button>
          )}
          <AbsolvedBadge visible={absolved} />
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="relative z-10 flex-1 overflow-y-auto scrollbar-fine px-4 sm:px-8 py-8"
      >
        <div className="mx-auto max-w-3xl space-y-7">
          {messages.map((msg, i) => (
            <Message key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex items-end gap-3 reveal-line">
              <div className="shrink-0 mb-1.5"><CurIAEmblem small /></div>
              <div className="bubble-curia flex items-center gap-4 py-4">
                <span className="wave" />
                <span className="font-serif italic text-bone/50 text-sm">CurIA está reflexionando...</span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {showEffect && (
              <motion.div
                key="effect"
                className="flex justify-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="glass px-6 py-3 max-w-md text-center">
                  <p className="text-gold-300/75 text-xs sm:text-sm italic font-serif tracking-wide">{effectText}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 border-t border-gold-500/10 shrink-0 px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-t from-ink-990/95 to-transparent">
        <div className="mx-auto max-w-3xl flex items-end gap-3">
          <div className="flex-1 relative">
            <div className="absolute -top-px left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={autoResize}
              placeholder={absolved ? 'Has sido absuelto. Sal en paz.' : 'Confiesa lo que llevas en el alma...'}
              rows={1}
              disabled={loading || absolved}
              className="w-full bg-ink-900/70 border border-gold-500/15 rounded-2xl px-5 py-3.5 text-bone text-[15px] font-serif placeholder-bone/30 resize-none outline-none transition-all focus:border-gold-500/40 focus:bg-ink-850/80 focus:shadow-[0_0_30px_-10px_rgba(201,168,76,0.4)] disabled:opacity-40"
              style={{ minHeight: '54px', maxHeight: '160px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || absolved}
            className="btn-incense relative shrink-0 h-[54px] w-[54px] flex items-center justify-center rounded-2xl border border-gold-500/35 bg-gradient-to-b from-gold-500/15 to-gold-700/5 text-gold-300 hover:text-bone hover:border-gold-300/60 hover:from-gold-500/25 hover:to-gold-500/10 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
            aria-label="Enviar confesión"
          >
            <span className="smoke" style={{ '--drift': '-6px' }} />
            <span className="smoke" style={{ '--drift': '4px' }} />
            <span className="smoke" style={{ '--drift': '-2px' }} />
            <span className="smoke" style={{ '--drift': '8px' }} />
            <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>

        <p className="text-center text-[10px] text-bone/30 mt-3 font-light tracking-[0.25em] uppercase">
          {absolved ? 'Ego te absolvo · Ve en paz' : 'Enter para enviar · Tu confesión es anónima'}
        </p>

        {absolved && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onShowDashboard}
              className="font-display text-[11px] tracking-[0.35em] uppercase text-gold-300 hover:text-bone border border-gold-500/40 hover:border-gold-300/70 px-5 py-2.5 rounded-sm transition-all duration-500"
            >
              Ver tu camino espiritual →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  const ABSOLUTION = 'Ego te absolvo de tus pecados. Ve en paz.'

  const renderCuriaBody = (content) => {
    const [main, ...absRest] = content.split(ABSOLUTION)
    const paragraphs = main.split(/\n\n+/).filter(Boolean)
    return (
      <>
        {paragraphs.map((para, pi) => {
          const sentences = para.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [para]
          return (
            <p key={pi} className={pi > 0 ? 'mt-3' : ''}>
              {sentences.map((s, si) => (
                <span
                  key={si}
                  className="reveal-line inline"
                  style={{ animationDelay: `${(pi * 3 + si) * 0.18}s` }}
                >
                  {s}
                </span>
              ))}
            </p>
          )
        })}
        {absRest.length > 0 && (
          <div
            className="reveal-line mt-4 pt-3 border-t border-gold-500/20"
            style={{ animationDelay: `${paragraphs.length * 0.5 + 0.2}s` }}
          >
            <p className="font-script text-gold-300 gold-text-glow text-[1.7rem] sm:text-[2rem] leading-none text-center" style={{ WebkitTextFillColor: 'unset' }}>
              {ABSOLUTION}
            </p>
          </div>
        )}
      </>
    )
  }

  return (
    <motion.div
      className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
    >
      {!isUser && <div className="shrink-0 mb-1.5"><CurIAEmblem small /></div>}
      <div className={isUser ? 'bubble-user' : 'bubble-curia'}>
        {isUser ? (
          <p className="text-bone/90 text-[15px] leading-relaxed font-sans whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="font-serif text-bone/85 text-[16px] leading-relaxed">
            {renderCuriaBody(msg.content)}
          </div>
        )}
        <p className={`mt-2 text-[10px] tracking-[0.3em] uppercase font-light ${isUser ? 'text-bone/30 text-right' : 'text-gold-500/35'}`}>
          {isUser ? 'Tú' : 'CurIA'}
        </p>
      </div>
    </motion.div>
  )
}

function CurIAEmblem({ small = false }) {
  const size = small ? 36 : 44
  const pad = size * 0.15
  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{
        width: size, height: size * 1.1,
        background: 'radial-gradient(ellipse at 50% 35%, rgba(228,198,130,0.22) 0%, rgba(14,9,5,0.92) 75%)',
        border: '1px solid rgba(201,168,76,0.38)',
        borderRadius: `${size * 0.38}px ${size * 0.38}px ${size * 0.18}px ${size * 0.18}px`,
        boxShadow: '0 0 18px -4px rgba(228,198,130,0.45), inset 0 0 10px rgba(0,0,0,0.55)',
      }}
    >
      <svg
        viewBox="0 0 80 96"
        width={size * 0.62}
        height={size * 0.62 * 1.2}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`cg-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe1b1" />
            <stop offset="100%" stopColor="#a88a3c" />
          </linearGradient>
        </defs>
        <path
          d="M 14 84 L 14 47 Q 14 12 40 12 Q 66 12 66 47 L 66 84 Z"
          fill="none"
          stroke={`url(#cg-${size})`}
          strokeWidth="2"
        />
        <path d="M 40 26 V 70 M 29 46 H 51" stroke="#e2cc8b" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="10" y1="84" x2="70" y2="84" stroke="rgba(201,168,76,0.5)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function AbsolvedBadge({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="absbadge"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-gold-300/80 px-3 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/5"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold-300 shadow-[0_0_10px_rgba(228,198,130,0.8)]" />
          Absuelto
        </motion.div>
      )}
    </AnimatePresence>
  )
}
