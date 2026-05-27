import { useState } from 'react'
import { motion } from 'framer-motion'

const AMOUNTS = [
  { label: '1 €', cents: 100 },
  { label: '3 €', cents: 300 },
  { label: '5 €', cents: 500 },
]

export default function DonationScreen({ onContinue }) {
  const [donated, setDonated] = useState(false)

  const handleDonate = (cents) => {
    const base = import.meta.env.VITE_STRIPE_PAYMENT_LINK
    if (base) {
      const url = cents > 0 ? `${base}?prefilled_amount=${cents}` : base
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setDonated(true)
  }

  return (
    <motion.div
      key="donation"
      className="relative h-full w-full flex flex-col items-center justify-center wood-texture penumbra-flicker overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="lattice-overlay" />

      {/* Warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 30%, rgba(201,168,76,0.09) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm w-full">

        {/* Priest avatar — larger, centered */}
        <PriestBust />

        {/* Ornamental divider */}
        <div className="ornamental-divider my-5 w-32" />

        <motion.h2
          className="font-display text-gold-300/90 text-base tracking-[0.35em] uppercase mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          Pasar el Cepillo
        </motion.h2>

        <motion.p
          className="font-serif text-bone/60 text-[15px] leading-relaxed mb-7"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Si este momento te tocó el alma, considera dejar una pequeña ofrenda.
          <br />
          <span className="text-bone/35 text-[13px]">Tu limosna mantiene el confesionario abierto.</span>
        </motion.p>

        {/* Amount buttons */}
        <motion.div
          className="flex gap-2.5 mb-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          {AMOUNTS.map(({ label, cents }) => (
            <button
              key={cents}
              onClick={() => handleDonate(cents)}
              className="font-display text-[11px] tracking-[0.25em] uppercase px-4 py-3 rounded-sm border border-gold-500/40 bg-gold-500/8 text-gold-300 hover:bg-gold-500/20 hover:border-gold-300/70 hover:text-bone transition-all duration-300 min-w-[60px]"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => handleDonate(0)}
            className="font-display text-[11px] tracking-[0.25em] uppercase px-4 py-3 rounded-sm border border-gold-500/20 text-gold-500/55 hover:border-gold-500/40 hover:text-gold-300 transition-all duration-300"
          >
            Libre
          </button>
        </motion.div>

        {/* Coin drop animation */}
        <CollectionPlate donated={donated} />

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {donated ? (
            <button
              onClick={onContinue}
              className="font-display text-[11px] tracking-[0.35em] uppercase text-gold-300 hover:text-bone border border-gold-500/40 hover:border-gold-300/70 px-6 py-2.5 rounded-sm transition-all duration-500"
            >
              Ver mi camino espiritual →
            </button>
          ) : (
            <button
              onClick={onContinue}
              className="text-bone/28 hover:text-bone/55 text-[10px] tracking-[0.3em] uppercase transition-colors"
            >
              Continuar sin ofrenda
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ── Priest bust — larger version of the chat avatar ─────────────────── */
function PriestBust() {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 90, damping: 14 }}
      className="relative"
    >
      <svg viewBox="0 0 80 96" width="88" height="106" aria-hidden="true">
        <defs>
          <radialGradient id="faceGlowD" cx="50%" cy="42%" r="48%">
            <stop offset="0%" stopColor="#efe1b1" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="robeGradD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1410" />
            <stop offset="100%" stopColor="#0d0a07" />
          </linearGradient>
          <linearGradient id="skinGradD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a97a" />
            <stop offset="100%" stopColor="#b8895a" />
          </linearGradient>
          <linearGradient id="archGoldD" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a7232" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Gothic arch frame */}
        <path d="M 6 88 L 6 44 Q 6 6 40 6 Q 74 6 74 44 L 74 88 Z"
          fill="url(#robeGradD)" stroke="url(#archGoldD)" strokeWidth="1.3" />
        <path d="M 12 86 L 12 46 Q 12 12 40 12 Q 68 12 68 46 L 68 86"
          fill="none" stroke="rgba(201,168,76,0.22)" strokeWidth="0.5" />

        {/* Hood */}
        <ellipse cx="40" cy="36" rx="22" ry="25" fill="#161210" />
        <path d="M 18 36 Q 18 14 40 14 Q 62 14 62 36 Q 62 52 40 54 Q 18 52 18 36 Z" fill="#1a1612" />

        {/* Face */}
        <ellipse cx="40" cy="38" rx="14" ry="16" fill="url(#skinGradD)" />
        <ellipse cx="40" cy="36" rx="18" ry="20" fill="url(#faceGlowD)" />

        {/* Eyes */}
        <ellipse cx="34" cy="34" rx="2.2" ry="2.5" fill="#2a1a0e" />
        <ellipse cx="46" cy="34" rx="2.2" ry="2.5" fill="#2a1a0e" />
        <circle cx="35" cy="33" r="0.7" fill="rgba(255,255,255,0.5)" />
        <circle cx="47" cy="33" r="0.7" fill="rgba(255,255,255,0.5)" />

        {/* Eyebrows */}
        <path d="M 31 30.5 Q 34 29 37 30.5" fill="none" stroke="#5a3a1a" strokeWidth="1" strokeLinecap="round" />
        <path d="M 43 30.5 Q 46 29 49 30.5" fill="none" stroke="#5a3a1a" strokeWidth="1" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 39 37 Q 37 41 39 42 Q 41 42 43 41 Q 41 41 39 37 Z" fill="rgba(0,0,0,0.12)" />

        {/* Gentle smile (static on donation screen) */}
        <path d="M 35 57 Q 40 60 45 57" fill="none" stroke="#7a4a2a" strokeWidth="1.4" strokeLinecap="round" />

        {/* Collar */}
        <path d="M 26 68 Q 40 72 54 68 L 54 76 Q 40 80 26 76 Z" fill="#f5f0e8" opacity="0.85" />

        {/* Cross */}
        <path d="M 40 76 V 86 M 36 80 H 44" stroke="rgba(201,168,76,0.6)" strokeWidth="1.2" strokeLinecap="round" />

        <line x1="4" y1="88" x2="76" y2="88" stroke="rgba(201,168,76,0.45)" strokeWidth="0.7" strokeLinecap="round" />
      </svg>

      {/* Halo glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(228,198,130,0.15) 0%, transparent 65%)', filter: 'blur(6px)' }}
      />
    </motion.div>
  )
}

/* ── Animated collection plate ────────────────────────────────────────── */
function CollectionPlate({ donated }) {
  return (
    <div className="relative h-14 w-40">
      <svg viewBox="0 0 120 56" width="160" height="56" aria-hidden="true" className="absolute inset-0">
        <defs>
          <radialGradient id="platG" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#8a7232" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="42" rx="52" ry="12" fill="url(#platG)" />
        <ellipse cx="60" cy="40" rx="44" ry="9" fill="#0d0a07" />
        <path d="M 18 37 Q 60 30 102 37" fill="none" stroke="rgba(255,240,180,0.3)" strokeWidth="1" />
        <ellipse cx="60" cy="52" rx="30" ry="4" fill="rgba(201,168,76,0.12)" />
      </svg>

      {/* Coin drop when donated */}
      {donated && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 8, opacity: [0, 1, 1, 0.6] }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#c9a84c" />
            <circle cx="12" cy="12" r="8.5" fill="#d4b96a" />
            <text x="12" y="16" textAnchor="middle" fontSize="9" fill="#8a7232" fontFamily="serif">€</text>
          </svg>
        </motion.div>
      )}
    </div>
  )
}
