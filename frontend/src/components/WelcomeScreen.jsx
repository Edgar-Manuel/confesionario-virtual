import { useState } from 'react'

export default function WelcomeScreen({ onEnter }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="h-full flex flex-col items-center justify-center relative px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-wine-700/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="text-6xl mb-2 opacity-80">⛪</div>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wider text-gray-100">
            El Confesionario Virtual
          </h1>
          <p className="text-gray-500 text-sm md:text-base font-sans font-light tracking-widest uppercase">
            — Sacramentum Misericordiae —
          </p>
        </div>

        <div className="h-px w-32 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

        <div className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-gray-400 text-sm font-light max-w-md text-center leading-relaxed italic">
            "Venid a mí todos los que estáis cansados y agobiados, y yo os aliviaré."
          </p>
          <p className="text-gray-600 text-xs">— Mateo 11:28</p>
        </div>

        <button
          onClick={onEnter}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`
            relative group px-10 py-4 text-sm font-medium tracking-widest uppercase
            border border-gold-500/40 rounded
            transition-all duration-500 ease-out
            ${hovered
              ? 'bg-gold-500/10 border-gold-500/70 text-gold-300 shadow-lg shadow-gold-500/10'
              : 'bg-transparent text-gold-500/70 hover:text-gold-300'
            }
          `}
        >
          <span className="relative z-10">Entrar al confesionario</span>
          <div className={`
            absolute inset-0 rounded
            transition-all duration-500
            ${hovered ? 'animate-glow' : ''}
          `} />
        </button>

        <p className="text-gray-600 text-xs animate-fade-in" style={{ animationDelay: '0.6s' }}>
          Tu confesión es anónima y privada
        </p>
      </div>

      <div className="absolute bottom-8 text-gray-700 text-[10px] tracking-wider font-light">
        CurIA — Sacerdote Virtual
      </div>
    </div>
  )
}
