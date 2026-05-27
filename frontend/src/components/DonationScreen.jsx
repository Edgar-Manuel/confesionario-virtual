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
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 90, damping: 14 }}
        >
          <div
            className="rounded-full overflow-hidden border-2 border-gold-500/40"
            style={{
              width: 100, height: 100,
              boxShadow: '0 0 24px -4px rgba(228,198,130,0.45)',
            }}
          >
            <img
              src="/avatar/mouth-closed.png"
              alt="CurIA"
              width={100}
              height={100}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        </motion.div>

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
