import { useMemo } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

const SIN_META = {
  ira:      { label: 'Ira',        color: '#a6262b' },
  mentira:  { label: 'Mentira',    color: '#b58a2e' },
  envidia:  { label: 'Envidia',    color: '#5b8a4e' },
  lujuria:  { label: 'Lujuria',    color: '#c97a4e' },
  soberbia: { label: 'Soberbia',   color: '#9e5fb8' },
  pereza:   { label: 'Pereza',     color: '#6d6d8c' },
  gula:     { label: 'Gula',       color: '#c9a84c' },
  codicia:  { label: 'Codicia',    color: '#7f6b3a' },
  otros:    { label: 'Sin nombre', color: '#5a5048' },
}

export default function SpiritualDashboard({ history, onConfessAgain, onBack }) {
  const stats = useMemo(() => computeStats(history), [history])

  return (
    <motion.div
      key="dashboard"
      className="relative h-full w-full overflow-y-auto scrollbar-fine"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0 -z-10" style={{
        background: 'radial-gradient(ellipse at 50% -10%, rgba(106,24,30,0.18) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 50%), #050505',
      }} />
      <div className="absolute inset-0 -z-10 light-rays opacity-40" />

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex items-start justify-between gap-6 flex-wrap"
        >
          <div>
            <p className="text-gold-500/55 text-[11px] tracking-[0.45em] uppercase mb-3">— Camino Espiritual —</p>
            <h1 className="font-display gold-text gold-text-glow text-[clamp(2rem,5vw,3.4rem)] leading-tight">
              {greeting(stats)}
            </h1>
            <p className="mt-3 font-serif italic text-bone/55 text-base sm:text-lg max-w-xl">
              Un registro privado de tu camino — guardado solo en tu dispositivo.
            </p>
          </div>
          <button
            onClick={onBack}
            className="text-bone/50 hover:text-bone/90 text-[11px] tracking-[0.3em] uppercase border border-gold-500/15 hover:border-gold-500/40 px-4 py-2 rounded-full transition-colors"
          >
            ← Volver
          </button>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <StaggerCard delay={0.15} className="md:col-span-1">
            <CountCard count={history.count} />
          </StaggerCard>

          <StaggerCard delay={0.25} className="md:col-span-1">
            <DaysSinceCard days={stats.daysSince} />
          </StaggerCard>

          <StaggerCard delay={0.35} className="md:col-span-1">
            <ProgressCard count={history.count} />
          </StaggerCard>

          <StaggerCard delay={0.5} className="md:col-span-2">
            <SinBarsCard sins={stats.sinList} />
          </StaggerCard>

          <StaggerCard delay={0.6} className="md:col-span-1">
            <PenitenciaCard text={history.lastPenitencia} />
          </StaggerCard>

          <StaggerCard delay={0.75} className="md:col-span-3">
            <CalendarCard days={history.days} />
          </StaggerCard>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onConfessAgain}
            className="btn-portal px-10 py-3.5 rounded-sm border border-gold-500/40 bg-gradient-to-b from-ink-900/60 to-ink-950/60 text-gold-300 font-display tracking-[0.35em] text-xs uppercase hover:text-bone transition-colors duration-500"
          >
            Confesar de nuevo
          </button>
          <button
            onClick={() => {
              if (confirm('¿Borrar todo tu historial? Esto no se puede deshacer.')) {
                api.resetHistory()
                window.location.reload()
              }
            }}
            className="text-bone/30 hover:text-wine-500/80 text-[10px] tracking-[0.3em] uppercase transition-colors"
          >
            Borrar historial
          </button>
        </motion.div>

        <p className="mt-10 text-center text-[10px] text-bone/25 tracking-[0.4em] uppercase">
          Memento mori · Memento vivere
        </p>
      </div>
    </motion.div>
  )
}

function computeStats(history) {
  const sinList = Object.entries(history.sins || {})
    .sort(([, a], [, b]) => b - a)
    .map(([key, val]) => ({ key, val, meta: SIN_META[key] || SIN_META.otros }))

  const max = sinList.reduce((m, s) => Math.max(m, s.val), 0) || 1
  sinList.forEach(s => { s.pct = s.val / max })

  let daysSince = null
  if (history.lastAt) {
    daysSince = Math.floor((Date.now() - history.lastAt) / (1000 * 60 * 60 * 24))
  }

  return { sinList, daysSince }
}

function greeting(stats) {
  if (stats.daysSince === 0) return 'Hoy has buscado la luz.'
  if (stats.daysSince === 1) return 'Un día desde tu última confesión.'
  return 'Tu alma ha vuelto al silencio.'
}

function StaggerCard({ delay = 0, className = '', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.9, ease: 'easeOut', delay }}
      className={`glass p-6 sm:p-7 ${className}`}
    >
      {children}
    </motion.div>
  )
}

function CardLabel({ children }) {
  return <p className="text-gold-500/55 text-[10px] tracking-[0.4em] uppercase">{children}</p>
}

function CountCard({ count }) {
  return (
    <div className="flex flex-col h-full">
      <CardLabel>Confesiones realizadas</CardLabel>
      <p className="mt-4 font-display gold-text text-6xl sm:text-7xl leading-none">{count}</p>
      <p className="mt-auto pt-6 font-serif italic text-bone/45 text-sm">
        {count === 1 ? 'El primer paso ya está dado.' : 'Cada vez, más cerca de la luz.'}
      </p>
    </div>
  )
}

function DaysSinceCard({ days }) {
  const label = days === 0 ? 'Hoy' : days === 1 ? '1 día' : `${days} días`
  return (
    <div className="flex flex-col h-full">
      <CardLabel>Desde tu última confesión</CardLabel>
      <p className="mt-4 font-display gold-text text-5xl sm:text-6xl leading-none">{label}</p>
      <p className="mt-auto pt-6 font-serif italic text-bone/45 text-sm">
        {days === 0 ? 'El alma respira renovada.' : 'El tiempo no borra, sólo invita.'}
      </p>
    </div>
  )
}

function ProgressCard({ count }) {
  const pct = Math.min(((count - 1) % 7 + 1) / 7, 1) * 100
  const level = Math.floor((count - 1) / 7) + 1
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-baseline justify-between">
        <CardLabel>Progreso espiritual</CardLabel>
        <span className="font-display text-gold-500/70 text-[10px] tracking-[0.3em]">NIVEL {level}</span>
      </div>
      <p className="mt-4 font-display gold-text text-4xl sm:text-5xl leading-none">{Math.round(pct)}%</p>
      <div className="mt-4 h-2 bg-ink-900/80 rounded-full overflow-hidden border border-gold-500/15">
        <motion.div
          className="h-full shimmer-bar"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
      <p className="mt-auto pt-5 font-serif italic text-bone/45 text-sm">
        Camino hacia la siguiente comunión interior.
      </p>
    </div>
  )
}

function SinBarsCard({ sins }) {
  return (
    <div className="flex flex-col h-full">
      <CardLabel>Pecados más confesados</CardLabel>
      <div className="mt-5 flex flex-col gap-3.5">
        {sins.length === 0 && (
          <p className="font-serif italic text-bone/40 text-sm">Aún no has confesado un pecado con nombre.</p>
        )}
        {sins.map((s, i) => (
          <div key={s.key} className="flex items-center gap-4">
            <span className="w-24 sm:w-28 text-bone/80 text-sm font-serif">{s.meta.label}</span>
            <div className="flex-1 h-2 bg-ink-900/60 rounded-full overflow-hidden border border-bone/5">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${s.meta.color} 0%, ${s.meta.color}cc 100%)`,
                  boxShadow: `0 0 12px ${s.meta.color}55`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${s.pct * 100}%` }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.5 + i * 0.1 }}
              />
            </div>
            <span className="w-6 text-right font-display text-gold-300/80 text-sm">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PenitenciaCard({ text }) {
  return (
    <div className="flex flex-col h-full">
      <CardLabel>Última penitencia</CardLabel>
      <div className="mt-4 relative pl-5">
        <span className="absolute left-0 top-1 text-gold-300 text-xl font-serif leading-none">"</span>
        <p className="font-serif italic text-bone/85 text-[15px] leading-relaxed">
          {text || 'Aún no se te ha asignado penitencia.'}
        </p>
      </div>
    </div>
  )
}

function CalendarCard({ days }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cells = []
  const total = 8 * 7
  for (let i = total - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    cells.push({ key, date: d, marked: days.includes(key), isToday: i === 0 })
  }
  const weekLabels = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <CardLabel>Días de confesión — últimas 8 semanas</CardLabel>
        <p className="text-bone/35 text-[10px] tracking-[0.3em] uppercase">
          {today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <div className="grid gap-1.5 text-[10px] text-bone/30 tracking-widest" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {weekLabels.map(l => <div key={l} className="text-center">{l}</div>)}
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {cells.map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.008, duration: 0.4 }}
              className="relative aspect-square rounded-md"
              style={{
                background: c.marked
                  ? 'radial-gradient(circle at 30% 25%, rgba(228,198,130,0.55) 0%, rgba(201,168,76,0.4) 50%, rgba(106,24,30,0.5) 100%)'
                  : 'rgba(20,16,12,0.55)',
                border: c.isToday
                  ? '1px solid rgba(228,198,130,0.7)'
                  : c.marked ? '1px solid rgba(228,198,130,0.5)' : '1px solid rgba(255,255,255,0.04)',
                boxShadow: c.marked ? '0 0 14px -4px rgba(228,198,130,0.5)' : 'none',
              }}
              title={c.date.toLocaleDateString('es-ES')}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[10px] text-bone/40 font-light">
                {c.date.getDate()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-[10px] text-bone/40 tracking-widest uppercase">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ background: 'radial-gradient(circle, #e2cc8b, #6b181e)', boxShadow: '0 0 6px rgba(228,198,130,0.5)' }} />
          Confesión
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm border border-gold-300/70" />
          Hoy
        </span>
      </div>
    </div>
  )
}
