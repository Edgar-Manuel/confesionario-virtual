import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import audio from './audio'
import api from './api'
import CustomCursor from './components/CustomCursor'
import WelcomeScreen from './components/WelcomeScreen'
import ConfessionChat from './components/ConfessionChat'
import AbsolutionOverlay from './components/AbsolutionOverlay'
import SpiritualDashboard from './components/SpiritualDashboard'
import DonationScreen from './components/DonationScreen'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [absolveOpen, setAbsolveOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [history, setHistory] = useState(() => api.loadHistory())

  const refreshHistory = useCallback(() => {
    setHistory(api.loadHistory())
  }, [])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    audio.setMuted(next)
  }

  const handleEnter = () => setScreen('chat')

  const handleAbsolved = () => {
    setAbsolveOpen(true)
    refreshHistory()
  }

  const handleOverlayClose = () => {
    setAbsolveOpen(false)
    setScreen('donation')
  }

  const handleDonationContinue = () => setScreen('dashboard')

  const handleConfessAgain = () => setScreen('chat')

  const handleShowDashboard = () => {
    refreshHistory()
    setScreen('dashboard')
  }

  const handleLeave = () => {
    setScreen('welcome')
    refreshHistory()
  }

  return (
    <>
      <CustomCursor />

      {/* Mute toggle */}
      <div className="fixed top-3 right-3 z-[150] flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="text-bone/40 hover:text-gold-300 transition-colors p-2 rounded-full border border-gold-500/15 hover:border-gold-500/40 bg-ink-900/40 backdrop-blur-md"
          title={muted ? 'Activar sonido' : 'Silenciar'}
          aria-label="Sonido"
        >
          {muted ? <MuteIcon /> : <SoundIcon />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen key="welcome" onEnter={handleEnter} history={history} />
        )}
        {screen === 'chat' && (
          <ConfessionChat
            key="chat"
            onLeave={handleLeave}
            onAbsolved={handleAbsolved}
            onShowDashboard={handleShowDashboard}
            history={history}
          />
        )}
        {screen === 'donation' && (
          <DonationScreen key="donation" onContinue={handleDonationContinue} />
        )}
        {screen === 'dashboard' && (
          <SpiritualDashboard
            key="dashboard"
            history={history}
            onConfessAgain={handleConfessAgain}
            onBack={handleLeave}
          />
        )}
      </AnimatePresence>

      <AbsolutionOverlay open={absolveOpen} onClose={handleOverlayClose} />
    </>
  )
}

function SoundIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

function MuteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l5 6M22 9l-5 6" />
    </svg>
  )
}
