// Web Speech API wrapper for speech-to-text (es-ES)
// Supported: Chrome, Edge, Safari. Firefox: not supported.

export function isSTTSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function createSTT({ onInterim, onFinal, onError, onEnd }) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null

  const recognition = new SR()
  recognition.lang = 'es-ES'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 1

  recognition.onresult = (e) => {
    let interim = ''
    let final = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript
      if (e.results[i].isFinal) final += t
      else interim += t
    }
    if (final) onFinal?.(final.trim())
    else if (interim) onInterim?.(interim.trim())
  }

  recognition.onerror = (e) => {
    if (e.error !== 'no-speech') onError?.(e.error)
    onEnd?.()
  }

  recognition.onend = () => onEnd?.()

  return {
    start() { try { recognition.start() } catch {} },
    stop()  { try { recognition.stop()  } catch {} },
  }
}
