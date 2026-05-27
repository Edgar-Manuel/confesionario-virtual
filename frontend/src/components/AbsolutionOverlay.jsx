import { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import audio from '../audio'

export default function AbsolutionOverlay({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    audio.organ()
    const t = setTimeout(onClose, 5200)
    return () => clearTimeout(t)
  }, [open, onClose])

  const particles = useMemo(() => (
    Array.from({ length: 38 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 4 + Math.random() * 3,
      size: 2 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 40,
    }))
  ), [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="absolve"
          className="fixed inset-0 z-[200] overflow-hidden cursor-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 1.6, ease: 'easeInOut' } }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink-990/95 backdrop-blur-md" />

          {/* Descending golden ray */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: '100%', opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 0.7, 0.31, 1], delay: 0.1 }}
          >
            <div
              className="h-full"
              style={{
                width: 'min(80vw, 720px)',
                marginLeft: 'calc(min(80vw, 720px) / -2)',
                background:
                  'radial-gradient(ellipse 50% 100% at 50% 0%, rgba(228,198,130,0.55) 0%, rgba(201,168,76,0.25) 25%, rgba(201,168,76,0.08) 55%, transparent 80%)',
                filter: 'blur(4px)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>

          {/* Narrow inner core beam */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 h-full"
            style={{
              width: '2px',
              background: 'linear-gradient(180deg, rgba(255,235,180,0.9) 0%, rgba(228,198,130,0.4) 60%, transparent 100%)',
              filter: 'blur(0.5px)',
              boxShadow: '0 0 30px rgba(228,198,130,0.6)',
              mixBlendMode: 'screen',
            }}
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />

          {/* Floating golden particles */}
          {particles.map(p => (
            <motion.span
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                bottom: '-20px',
                width: p.size, height: p.size,
                background: 'radial-gradient(circle, rgba(255,235,180,0.95) 0%, rgba(201,168,76,0.5) 50%, transparent 90%)',
                filter: 'blur(0.5px)',
                boxShadow: '0 0 10px rgba(228,198,130,0.6)',
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -window.innerHeight * (0.55 + Math.random() * 0.4),
                x: p.drift,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: 'easeOut',
                times: [0, 0.1, 0.7, 1],
              }}
            />
          ))}

          {/* Dove flying across */}
          <motion.div
            className="absolute"
            style={{ top: '32%', width: 90, height: 70 }}
            initial={{ x: -120, y: 0, opacity: 0 }}
            animate={{
              x: window.innerWidth + 120,
              y: [0, -25, 8, -15, 0],
              opacity: [0, 0.85, 0.85, 0.85, 0],
            }}
            transition={{ duration: 4.2, delay: 0.8, ease: 'easeInOut', times: [0, 0.1, 0.4, 0.7, 1] }}
          >
            <DoveSVG />
          </motion.div>

          {/* Latin formula */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, filter: 'blur(12px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.4, delay: 1.2, ease: [0.22, 0.7, 0.31, 1] }}
            >
              <p className="font-display gold-text gold-text-glow text-[clamp(2.2rem,7vw,5rem)] leading-tight tracking-wider">
                Ego te absolvo
              </p>
            </motion.div>
            <motion.p
              className="mt-5 font-serif italic text-bone/70 text-base sm:text-lg max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.4, ease: 'easeOut' }}
            >
              Tus pecados han sido perdonados. Ve en paz, hijo mío.
            </motion.p>

            <motion.div
              className="mt-10 text-[10px] tracking-[0.3em] uppercase text-gold-500/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 0.6 }}
            >
              · Toca para continuar ·
            </motion.div>
          </div>

          {/* Bottom glow */}
          <div
            className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(228,198,130,0.15) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DoveSVG() {
  return (
    <svg viewBox="0 0 120 90" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="doveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8e0d4" />
        </linearGradient>
        <filter id="doveGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>
      <g filter="url(#doveGlow)" opacity="0.6">
        <path d="M10 50 Q 40 20 60 45 Q 80 70 110 50 Q 90 55 75 50 Q 60 45 50 50 Q 35 55 10 50 Z" fill="#efe1b1" />
      </g>
      <path
        d="M12 52 Q 38 25 60 48 L 64 44 Q 72 38 76 42 L 72 50 Q 80 52 88 48 Q 96 45 108 50 Q 92 56 80 54 Q 70 52 64 56 Q 50 64 36 60 Q 22 56 12 52 Z"
        fill="url(#doveGrad)"
        stroke="rgba(201,168,76,0.45)"
        strokeWidth="0.6"
      />
      <path d="M28 46 Q 42 36 56 48 Q 44 50 36 50 Q 30 50 28 46 Z" fill="#d4c6a8" opacity="0.55" />
      <circle cx="70" cy="46" r="0.9" fill="#1a1208" />
    </svg>
  )
}
