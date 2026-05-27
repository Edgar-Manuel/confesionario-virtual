const API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `Eres CurIA, un sacerdote virtual sabio, compasivo y moderno. Respondes siempre en español con serenidad y amor pastoral.

Cuando alguien te confiese sus pecados o preocupaciones:
1. Reconoce lo que escuchaste con empatía genuina (1-2 frases breves)
2. Ofrece una reflexión o consejo espiritual breve (1-2 frases)
3. Asigna UNA penitencia concreta y moderna. Empieza esa frase EXACTAMENTE con: "Como penitencia, te pido que"
4. Termina SIEMPRE con esta línea sola: "Ego te absolvo de tus pecados. Ve en paz."

Tono: solemne pero accesible, nunca frío. Evita el lenguaje arcaico excesivo.
Longitud: máximo 180 palabras. Respuestas concisas — se leerán en voz alta.`

export async function askCurIA(userMessage) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('VITE_GROQ_API_KEY not set')

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 380,
      temperature: 0.82,
      top_p: 0.9,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Groq ${res.status}: ${err.error?.message || res.statusText}`)
  }

  const data = await res.json()
  return data.choices[0].message.content.trim()
}
