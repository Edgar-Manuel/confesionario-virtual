import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import audio from '../audio'
import api from '../api'
import { speak, stopSpeaking } from '../tts'
import { createSTT, isSTTSupported } from '../stt'

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
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [sttSupported] = useState(() => isSTTSupported())

  const scrollerRef = useRef(null)
  const inputRef = useRef(null)
  const sttRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, showEffect, loading, scrollToBottom])
  useEffect(() => { inputRef.current?.focus() }, [])

  // Speak the initial greeting on mount
  useEffect(() => {
    setIsSpeaking(true)
    speak(INITIAL_MESSAGE.content).finally(() => setIsSpeaking(false))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sttRef.current?.stop()
      stopSpeaking()
    }
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      sttRef.current?.stop()
      setIsRecording(false)
      return
    }

    stopSpeaking()
    setIsSpeaking(false)

    const stt = createSTT({
      onInterim: (text) => setInput(text),
      onFinal: (text) => {
        setInput(text)
        setIsRecording(false)
      },
      onError: () => setIsRecording(false),
      onEnd: () => setIsRecording(false),
    })

    if (!stt) return
    sttRef.current = stt
    stt.start()
    setIsRecording(true)
    setInput('')
  }, [isRecording])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || loading || absolved) return

    // Stop any ongoing recording or speech
    sttRef.current?.stop()
    setIsRecording(false)
    stopSpeaking()
    setIsSpeaking(false)

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

      // Speak the response
      setIsSpeaking(true)
      speak(data.reply).finally(() => setIsSpeaking(false))

      setTimeout(() => setAbsolved(true), 2200)
    } catch {
      setMessages(prev => [...prev, {
        role: 'curia',
        content: 'Perdona, hijo mío. Parece que hay interferencias en la línea divina. ¿Podrías intentarlo de nuevo?',
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, absolved])

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

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-gold-500/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="text-bone/40 hover:text-bone/80 transition-colors p-1.5 rounded-full"
            aria-label="Volver"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {/* Animated priest avatar */}
            <PriestAvatar isSpeaking={isSpeaking} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm tracking-[0.25em] text-gold-300/90 uppercase">CurIA</h2>
                {isSpeaking && <SpeakingWave />}
              </div>
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

      {/* Messages */}
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

      {/* Composer */}
      <div className="relative z-10 border-t border-gold-500/10 shrink-0 px-4 sm:px-8 py-4 sm:py-5 bg-gradient-to-t from-ink-990/95 to-transparent">
        <div className="mx-auto max-w-3xl flex items-end gap-3">
          {/* Microphone button */}
          <MicButton
            isRecording={isRecording}
            disabled={loading || absolved || !sttSupported}
            onToggle={toggleRecording}
          />

          <div className="flex-1 relative">
            <div className="absolute -top-px left-3 right-3 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={autoResize}
              placeholder={
                isRecording
                  ? 'Escuchando...'
                  : absolved
                  ? 'Has sido absuelto. Sal en paz.'
                  : 'Confiesa lo que llevas en el alma...'
              }
              rows={1}
              disabled={loading || absolved}
              className="w-full bg-ink-900/70 border border-gold-500/15 rounded-2xl px-5 py-3.5 text-bone text-[15px] font-serif placeholder-bone/30 resize-none outline-none transition-all focus:border-gold-500/40 focus:bg-ink-850/80 focus:shadow-[0_0_30px_-10px_rgba(201,168,76,0.4)] disabled:opacity-40"
              style={{ minHeight: '54px', maxHeight: '160px' }}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading || absolved}
            className="btn-incense relative shrink-0 h-[54px] w-[54px] flex items-center justify-center rounded-2xl border border-gold-500/35 bg-gradient-to-b from-gold-500/15 to-gold-700/5 text-gold-300 hover:text-bone hover:border-gold-300/60 hover:from-gold-500/25 hover:to-gold-500/10 transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
            aria-label="Enviar"
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
              onClick={onAbsolved}
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

/* ── Animated Priest Avatar ─────────────────────────────────────────── */
function PriestAvatar({ isSpeaking }) {
  // Mouth cycles between slightly open/closed when speaking
  const mouthPath = isSpeaking
    ? 'M 34 58 Q 40 63 46 58'   // open
    : 'M 35 58 Q 40 60 45 58'   // closed/smile

  return (
    <motion.div
      className="relative shrink-0"
      animate={isSpeaking ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.6, repeat: isSpeaking ? Infinity : 0, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 80 96" width="44" height="52" aria-hidden="true">
        <defs>
          <radialGradient id="faceGlow" cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="#efe1b1" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1410" />
            <stop offset="100%" stopColor="#0d0a07" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a97a" />
            <stop offset="100%" stopColor="#b8895a" />
          </linearGradient>
          <linearGradient id="archGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a7232" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Gothic arch frame */}
        <path
          d="M 6 88 L 6 44 Q 6 6 40 6 Q 74 6 74 44 L 74 88 Z"
          fill="url(#robeGrad)"
          stroke="url(#archGold)"
          strokeWidth="1.3"
        />
        {/* Inner arch line */}
        <path
          d="M 12 86 L 12 46 Q 12 12 40 12 Q 68 12 68 46 L 68 86"
          fill="none"
          stroke="rgba(201,168,76,0.22)"
          strokeWidth="0.5"
        />

        {/* Hood/cowl */}
        <ellipse cx="40" cy="36" rx="22" ry="25" fill="#161210" />
        <path
          d="M 18 36 Q 18 14 40 14 Q 62 14 62 36 Q 62 52 40 54 Q 18 52 18 36 Z"
          fill="#1a1612"
        />

        {/* Face */}
        <ellipse cx="40" cy="38" rx="14" ry="16" fill="url(#skinGrad)" />

        {/* Halo glow behind face */}
        <ellipse cx="40" cy="36" rx="18" ry="20" fill="url(#faceGlow)" />

        {/* Eyes */}
        <ellipse cx="34" cy="34" rx="2.2" ry="2.5" fill="#2a1a0e" />
        <ellipse cx="46" cy="34" rx="2.2" ry="2.5" fill="#2a1a0e" />
        {/* Eye shine */}
        <circle cx="35" cy="33" r="0.7" fill="rgba(255,255,255,0.5)" />
        <circle cx="47" cy="33" r="0.7" fill="rgba(255,255,255,0.5)" />

        {/* Eyebrows */}
        <path d="M 31 30.5 Q 34 29 37 30.5" fill="none" stroke="#5a3a1a" strokeWidth="1" strokeLinecap="round" />
        <path d="M 43 30.5 Q 46 29 49 30.5" fill="none" stroke="#5a3a1a" strokeWidth="1" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 39 37 Q 37 41 39 42 Q 41 42 43 41 Q 41 41 39 37 Z" fill="rgba(0,0,0,0.12)" />

        {/* Animated mouth */}
        <motion.path
          d={mouthPath}
          fill="none"
          stroke="#7a4a2a"
          strokeWidth="1.4"
          strokeLinecap="round"
          animate={{ d: isSpeaking ? [
            'M 34 58 Q 40 60 46 58',
            'M 34 57 Q 40 64 46 57',
            'M 34 58 Q 40 61 46 58',
            'M 34 57 Q 40 63 46 57',
            'M 34 58 Q 40 60 46 58',
          ] : 'M 35 58 Q 40 60 45 58' }}
          transition={isSpeaking ? {
            duration: 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
          } : { duration: 0.2 }}
        />

        {/* Collar */}
        <path
          d="M 26 68 Q 40 72 54 68 L 54 76 Q 40 80 26 76 Z"
          fill="#f5f0e8"
          opacity="0.85"
        />

        {/* Cross on chest */}
        <path d="M 40 76 V 86 M 36 80 H 44" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Base line */}
        <line x1="4" y1="88" x2="76" y2="88" stroke="rgba(201,168,76,0.45)" strokeWidth="0.7" strokeLinecap="round" />
      </svg>

      {/* Speaking glow ring */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(228,198,130,0.18) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  )
}

/* ── Speaking waveform indicator ────────────────────────────────────── */
function SpeakingWave() {
  return (
    <div className="flex items-center gap-[2px] h-3">
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="w-[2px] bg-gold-300 rounded-full"
          animate={{ height: ['3px', '11px', '3px'] }}
          transition={{ duration: 0.7, delay: i * 0.12, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Microphone button ──────────────────────────────────────────────── */
function MicButton({ isRecording, disabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      title={isRecording ? 'Detener grabación' : 'Hablar'}
      aria-label={isRecording ? 'Detener grabación' : 'Hablar'}
      className={`shrink-0 h-[54px] w-[54px] flex items-center justify-center rounded-2xl border transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed ${
        isRecording
          ? 'border-gold-300/70 bg-gold-500/18 text-gold-200 shadow-[0_0_20px_-4px_rgba(228,198,130,0.5)]'
          : 'border-gold-500/25 bg-ink-900/50 text-bone/50 hover:text-gold-300 hover:border-gold-500/40'
      }`}
    >
      {isRecording ? (
        <motion.div
          className="w-3.5 h-3.5 rounded-full bg-gold-300"
          animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      )}
    </button>
  )
}

/* ── Message rendering ──────────────────────────────────────────────── */
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

/* ── Small CurIA emblem (messages) ─────────────────────────────────── */
function CurIAEmblem({ small = false }) {
  const size = small ? 36 : 44
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
      <svg viewBox="0 0 80 96" width={size * 0.62} height={size * 0.62 * 1.2} aria-hidden="true">
        <defs>
          <linearGradient id={`cg-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe1b1" />
            <stop offset="100%" stopColor="#a88a3c" />
          </linearGradient>
        </defs>
        <path d="M 14 84 L 14 47 Q 14 12 40 12 Q 66 12 66 47 L 66 84 Z" fill="none" stroke={`url(#cg-${size})`} strokeWidth="2" />
        <path d="M 40 26 V 70 M 29 46 H 51" stroke="#e2cc8b" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="10" y1="84" x2="70" y2="84" stroke="rgba(201,168,76,0.5)" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ── Absolved badge ─────────────────────────────────────────────────── */
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
