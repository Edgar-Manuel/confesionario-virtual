import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let tx = x, ty = y

    const onMove = (e) => { tx = e.clientX; ty = e.clientY }
    const onOver = (e) => {
      const isInteractive = e.target.closest('button, a, [role="button"], textarea, input')
      el.classList.toggle('hover', !!isInteractive)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)

    let raf
    const loop = () => {
      x += (tx - x) * 0.32
      y += (ty - y) * 0.32
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div id="custom-cursor" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e2cc8b" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#c9a84c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#cursorGlow)" />
        <path d="M12 6.5 V17.5 M8 10.5 H16" stroke="#efe1b1" strokeWidth="1.2" strokeLinecap="round" opacity="0.95" />
      </svg>
    </div>
  )
}
