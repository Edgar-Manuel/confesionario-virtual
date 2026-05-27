import { useMemo } from 'react'
import { motion } from 'framer-motion'
import audio from '../audio'

export default function WelcomeScreen({ onEnter, history }) {
  const handleEnter = () => {
    audio.bell()
    onEnter()
  }

  return (
    <motion.div
      key="welcome"
      className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center px-6 penumbra-flicker"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    >
      {/* Deep cathedral background */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0a08 0%, #0a0507 40%, #050203 100%)',
      }} />

      {/* Stained glass rose window */}
      <RoseWindow />

      {/* Vertical column shadows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Drifting light rays */}
      <div className="light-rays" />

      {/* Floor vignette */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 60%, #000 100%)',
      }} />

      {/* Floating dust */}
      <Dust />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 max-w-2xl">
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 floaty">
            <SacredEmblem />
          </div>
          <h1 className="font-display gold-text gold-text-glow text-[clamp(2.6rem,6.5vw,4.5rem)] leading-[1.05] text-center tracking-wider">
            El Confesionario
            <br />
            <span className="text-[0.82em] opacity-95">Virtual</span>
          </h1>
          <p className="mt-5 text-gold-500/70 text-[0.7rem] sm:text-xs font-sans font-light tracking-[0.55em] uppercase">
            — Sacramentum&nbsp;Misericordiae —
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: 'easeOut' }}
          className="ornamental-divider origin-center"
        >
          <span>✦</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.2 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <p className="font-serif italic text-bone/75 text-lg sm:text-xl leading-relaxed max-w-md">
            "Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré."
          </p>
          <p className="text-gold-500/55 text-[11px] tracking-[0.35em] uppercase">— Mateo 11:28 —</p>
        </motion.div>

        <motion.button
          onClick={handleEnter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.8, ease: 'easeOut' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-portal group relative px-12 py-4 rounded-sm border border-gold-500/40 bg-gradient-to-b from-ink-900/60 to-ink-950/60 text-gold-300 font-display tracking-[0.35em] text-sm uppercase backdrop-blur-md transition-colors duration-500 hover:text-gold-200"
        >
          <span className="relative z-10">Entrar al confesionario</span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="text-bone/35 text-[11px] sm:text-xs font-light tracking-wider text-center"
        >
          Tu confesión es anónima y privada · Ningún dato se transmite a servidor alguno
        </motion.p>

        {history && history.count > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className="text-[10px] tracking-[0.3em] uppercase text-gold-500/40"
          >
            · {history.count} confesion{history.count === 1 ? '' : 'es'} en tu camino ·
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-bone/25 text-[10px] tracking-[0.4em] uppercase font-light">
        CurIA · Sacerdote Virtual
      </div>
    </motion.div>
  )
}

function RoseWindow() {
  const petals = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div
      className="absolute left-1/2 top-[-8vmin] -translate-x-1/2 pointer-events-none"
      style={{ width: 'min(90vmin, 800px)', height: 'min(90vmin, 800px)' }}
    >
      <motion.svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 240, ease: 'linear', repeat: Infinity }}
      >
        <defs>
          <radialGradient id="centerHalo" cx="0" cy="0" r="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#c9a84c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="petalWine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b1a1e" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#2c0609" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="petalGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b96a" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#6b181e" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <circle r="62" fill="url(#centerHalo)" />

        {petals.map(i => {
          const angle = (i * 360) / 12
          const fill = i % 2 === 0 ? 'url(#petalWine)' : 'url(#petalGold)'
          return (
            <g key={i} transform={`rotate(${angle})`}>
              <path
                d="M 0 -22 Q 14 -50 0 -82 Q -14 -50 0 -22 Z"
                fill={fill}
                stroke="rgba(201,168,76,0.45)"
                strokeWidth="0.5"
              />
            </g>
          )
        })}

        <circle r="90" fill="none" stroke="rgba(201,168,76,0.28)" strokeWidth="0.8" />
        <circle r="84" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.4" />
        <circle r="22" fill="none" stroke="rgba(228,198,130,0.55)" strokeWidth="0.5" />

        {petals.map(i => {
          const angle = (i * 360) / 12
          return (
            <line
              key={'sp' + i}
              x1="0" y1="-22" x2="0" y2="-90"
              transform={`rotate(${angle})`}
              stroke="rgba(201,168,76,0.18)"
              strokeWidth="0.4"
            />
          )
        })}
      </motion.svg>

      <motion.svg
        viewBox="-100 -100 200 200"
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 320, ease: 'linear', repeat: Infinity }}
      >
        <g opacity="0.55">
          {[0, 45, 90, 135].map(a => (
            <line key={a} x1="-90" y1="0" x2="90" y2="0" transform={`rotate(${a})`} stroke="rgba(228,198,130,0.22)" strokeWidth="0.4" />
          ))}
        </g>
      </motion.svg>

      <motion.div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: '14%', height: '14%',
          background: 'radial-gradient(circle, rgba(255,235,180,0.7) 0%, rgba(201,168,76,0.25) 50%, transparent 80%)',
          filter: 'blur(6px)',
          mixBlendMode: 'screen',
          left: 0, right: 0, top: 0, bottom: 0,
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function Dust() {
  const motes = useMemo(() => (
    Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: 60 + Math.random() * 30,
      delay: Math.random() * 6,
      duration: 12 + Math.random() * 14,
      size: 1 + Math.random() * 2,
    }))
  ), [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size, height: m.size,
            background: 'rgba(228, 198, 130, 0.6)',
            filter: 'blur(0.5px)',
            boxShadow: '0 0 4px rgba(228,198,130,0.6)',
          }}
          animate={{ y: [-10, -200], opacity: [0, 0.7, 0] }}
          transition={{ duration: m.duration, delay: m.delay, ease: 'linear', repeat: Infinity }}
        />
      ))}
    </div>
  )
}

function SacredEmblem() {
  return (
    <svg viewBox="0 0 80 96" width="64" height="76" aria-hidden="true">
      <defs>
        <radialGradient id="archHalo" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#efe1b1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8a7232" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="crossG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#efe1b1" />
          <stop offset="100%" stopColor="#c9a84c" />
        </linearGradient>
      </defs>
      {/* Halo glow behind arch */}
      <ellipse cx="40" cy="48" rx="32" ry="40" fill="url(#archHalo)" />
      {/* Gothic pointed arch */}
      <path
        d="M 12 84 L 12 46 Q 12 10 40 10 Q 68 10 68 46 L 68 84 Z"
        fill="none"
        stroke="url(#archGrad)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Inner decorative arch */}
      <path
        d="M 19 82 L 19 48 Q 19 18 40 18 Q 61 18 61 48 L 61 82"
        fill="none"
        stroke="rgba(228,198,130,0.3)"
        strokeWidth="0.5"
      />
      {/* Cross inside arch */}
      <path d="M 40 28 V 70 M 28 46 H 52" stroke="url(#crossG)" strokeWidth="2.4" strokeLinecap="round" />
      {/* Base line */}
      <line x1="8" y1="84" x2="72" y2="84" stroke="rgba(201,168,76,0.55)" strokeWidth="0.8" strokeLinecap="round" />
      {/* Keystone diamond at apex */}
      <rect x="37.5" y="7.5" width="5" height="5" rx="0.5" fill="rgba(228,198,130,0.7)" transform="rotate(45 40 10)" />
    </svg>
  )
}
