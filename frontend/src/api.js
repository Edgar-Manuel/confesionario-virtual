import { askCurIA } from './groq'

const SIN_KEYWORDS = {
  ira:      ['ira', 'enojo', 'enojé', 'rabia', 'golpe', 'golpeé', 'insulté', 'odio', 'odié', 'violencia', 'grité'],
  mentira:  ['mentira', 'mentí', 'engaño', 'engañé', 'engañar', 'chisme', 'calumnia', 'blasfemé'],
  envidia:  ['envidia', 'envidié', 'celos', 'celosa', 'celoso', 'resentimiento'],
  lujuria:  ['lujuria', 'adulterio', 'deseé', 'deseo carnal', 'infidelidad', 'infiel'],
  soberbia: ['soberbia', 'orgullo', 'orgulloso', 'arrogancia', 'vanidad', 'desprecié'],
  pereza:   ['pereza', 'flojera', 'apatía', 'desidia', 'procrastiné'],
  gula:     ['gula', 'glotonería', 'borrachera', 'me emborraché', 'comí de más'],
  codicia:  ['codicia', 'avaricia', 'robé', 'robo', 'tacaño'],
};

const PENITENCIAS = [
  'Apaga el teléfono y pasa una hora en silencio, en compañía de ti mismo.',
  'Escribe una carta a mano a esa persona a la que le debes una disculpa sincera.',
  'Regala algo tuyo a alguien que lo necesite sin esperar nada a cambio.',
  'Lee un salmo y reflexiona sobre su significado en tu vida hoy.',
  'Sal a caminar sin destino fijo y observa la belleza que te rodea.',
  'Llama a un familiar con el que no hablas hace tiempo y pregúntale cómo está.',
  'Haz una donación anónima a una causa que te mueva el corazón.',
  'Escribe tres cosas por las que estés agradecido hoy.',
  'Ayuda a un desconocido sin revelar tu identidad.',
  'Pasa 20 minutos en completa quietud, respirando y dejando ir el rencor.',
];

const CONSEJOS = [
  'Todos caemos, hijo mío. Lo importante es levantarse con la mirada en alto y el corazón dispuesto a mejorar.',
  'El arrepentimiento es el primer paso hacia la libertad. No te aferres a la culpa; transfórmala en aprendizaje.',
  'La misericordia es infinita para quien la busca con sinceridad. Tu corazón arrepentido ya es parte del camino.',
  'Reconocer el error ya te hace más sabio que ayer. No te castigues por haber caído, alégrate por querer levantarte.',
  'Dios no se cansa de perdonar; somos nosotros los que nos cansamos de pedir perdón.',
  'Cada día es una nueva oportunidad para ser mejor. Hoy has dado el primer paso al reconocer tu falta.',
  'No hay pecado tan grande que el amor no pueda redimir. Confía en la misericordia que todo lo sana.',
  'El perdón comienza en uno mismo. Perdónate para poder ser luz para los demás.',
  'Vivir en verdad es el camino más corto hacia la paz interior. Sigue caminando, no estás solo.',
  'La humildad de reconocer los propios errores es la puerta a una vida más plena y auténtica.',
];

const EFECTOS = [
  'Una luz tenue parece brillar a través de la penumbra del confesionario...',
  'Un cálido silencio envuelve el ambiente. Se siente una paz profunda...',
  'El peso en tus hombros se disipa lentamente...',
  'Un susurro de esperanza cruza la penumbra...',
  'La paz que sobrepasa todo entendimiento llena tu corazón...',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function detectSins(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const [sin, words] of Object.entries(SIN_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) found.add(sin);
  }
  return [...found];
}

function extractPenitencia(reply) {
  const m = reply.match(/Como penitencia[^,]*,?\s*te pido que\s+(.+?)(?:\n|Ego te|$)/i)
  if (m) return m[1].replace(/\.$/, '').trim()
  const m2 = reply.match(/Como penitencia[^:]*:\s*(.+?)(?:\n|Ego te|$)/i)
  if (m2) return m2[1].replace(/\.$/, '').trim()
  return null
}

async function confess(message) {
  const sins = detectSins(message);
  const efecto = pick(EFECTOS);

  // Try real AI (Groq) if key is configured
  try {
    const reply = await askCurIA(message);
    const penitencia = extractPenitencia(reply) || pick(PENITENCIAS);
    return { reply, absolucion: true, efecto, sins, penitencia };
  } catch (e) {
    console.warn('[api] Groq unavailable, using mock:', e.message);
  }

  // Fallback: deterministic mock
  const consejo = pick(CONSEJOS);
  const penitencia = pick(PENITENCIAS);
  let reply;
  if (sins.length) {
    reply =
      `Querido hijo, gracias por tu confianza y por abrir tu corazón. He escuchado tus palabras con atención y sin juicio.\n\n` +
      `${consejo}\n\n` +
      `Como penitencia, te pido que ${penitencia.toLowerCase()}\n\n` +
      `Cierra los ojos un momento y respira profundo. Imagina que dejas caer una carga pesada que ya no necesitas llevar.\n\n` +
      `Ego te absolvo de tus pecados. Ve en paz.`;
  } else {
    reply =
      `Hijo mío, gracias por venir a compartir lo que llevas en tu corazón. A veces el mayor peso no tiene nombre, y aun así nos quema por dentro.\n\n` +
      `${consejo}\n\n` +
      `Te invito a reflexionar sobre lo que realmente te preocupa. A veces el mayor pecado es olvidarnos de cuidar nuestra propia paz.\n\n` +
      `Ego te absolvo de tus pecados. Ve en paz.`;
  }

  return new Promise(resolve =>
    setTimeout(() => resolve({ reply, absolucion: true, efecto, sins, penitencia }), 900 + Math.random() * 400)
  );
}

const KEY = 'cv.history';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null') ||
      { count: 0, sins: {}, days: [], lastPenitencia: null, lastAt: null };
  } catch {
    return { count: 0, sins: {}, days: [], lastPenitencia: null, lastAt: null };
  }
}

function saveHistory(h) { try { localStorage.setItem(KEY, JSON.stringify(h)); } catch {} }

function logConfession({ sins, penitencia }) {
  const h = loadHistory();
  h.count += 1;
  (sins.length ? sins : ['otros']).forEach(s => { h.sins[s] = (h.sins[s] || 0) + 1; });
  const dayKey = new Date().toISOString().slice(0, 10);
  if (!h.days.includes(dayKey)) h.days.push(dayKey);
  h.lastPenitencia = penitencia;
  h.lastAt = Date.now();
  saveHistory(h);
  return h;
}

function resetHistory() { localStorage.removeItem(KEY); }

const api = { confess, detectSins, loadHistory, logConfession, resetHistory };
export default api;
