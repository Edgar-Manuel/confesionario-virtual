// ElevenLabs TTS with speechSynthesis fallback
// NOTE: API key is intentionally client-side for this prototype.
// For production, proxy through a backend.

const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
// Default: "Abel Quiñonez — Credible and Layered" (Spanish male)
const DEFAULT_VOICE_ID = 'z365btkMkbqu8wJGFTrh'

let currentAudio = null

export function stopSpeaking() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  window.speechSynthesis?.cancel()
}

export function speak(text) {
  stopSpeaking()
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID

  if (apiKey) {
    return speakElevenLabs(text, voiceId, apiKey).catch((err) => {
      console.error('[tts] ElevenLabs failed, falling back to native:', err?.message || err)
      return speakNative(text)
    })
  }
  console.warn('[tts] VITE_ELEVENLABS_API_KEY not set — using native speech synthesis')
  return speakNative(text)
}

async function speakElevenLabs(text, voiceId, apiKey) {
  const res = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.72,
        similarity_boost: 0.85,
        style: 0.28,
        use_speaker_boost: true,
      },
    }),
  })

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(`ElevenLabs ${res.status}: ${detail?.detail?.message || res.statusText}`)
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const audio = new Audio(url)
    currentAudio = audio
    audio.addEventListener('ended', () => { URL.revokeObjectURL(url); resolve() })
    audio.addEventListener('error', (e) => { URL.revokeObjectURL(url); reject(e) })
    audio.play().catch(reject)
  })
}

function speakNative(text) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    if (!synth) { resolve(); return }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.88
    utterance.pitch = 0.82
    utterance.volume = 1

    // Prefer a Spanish male voice
    const trySetVoice = () => {
      const voices = synth.getVoices()
      const voice =
        voices.find(v => v.lang.startsWith('es') && /male|hombre|jorge|pablo/i.test(v.name)) ||
        voices.find(v => v.lang.startsWith('es'))
      if (voice) utterance.voice = voice
    }

    if (synth.getVoices().length) {
      trySetVoice()
    } else {
      synth.addEventListener('voiceschanged', trySetVoice, { once: true })
    }

    utterance.onend = resolve
    utterance.onerror = resolve
    synth.speak(utterance)
  })
}
