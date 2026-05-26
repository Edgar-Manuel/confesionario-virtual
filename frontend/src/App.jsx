import { useState, useCallback } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import ConfessionChat from './components/ConfessionChat'

export default function App() {
  const [screen, setScreen] = useState('welcome')

  const enterConfessionary = useCallback(() => {
    setScreen('chat')
  }, [])

  const leaveConfessionary = useCallback(() => {
    setScreen('welcome')
  }, [])

  return (
    <div className="h-screen w-screen overflow-hidden">
      {screen === 'welcome' ? (
        <WelcomeScreen onEnter={enterConfessionary} />
      ) : (
        <ConfessionChat onLeave={leaveConfessionary} />
      )}
    </div>
  )
}
