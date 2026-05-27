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

// Used as fallback when Groq's reply doesn't include a structured penitence
const PENITENCIAS = [
  'apaga el teléfono y pasa una hora en silencio, en compañía de ti mismo',
  'escribas una carta a mano a esa persona a la que le debes una disculpa sincera',
  'regales algo tuyo a alguien que lo necesite sin esperar nada a cambio',
  'leas un salmo y reflexiones sobre su significado en tu vida hoy',
  'salgas a caminar sin destino fijo y observes la belleza que te rodea',
  'llames a un familiar con el que no hablas hace tiempo y le preguntes cómo está',
  'hagas una donación anónima a una causa que te mueva el corazón',
  'escribas tres cosas por las que estés agradecido hoy',
  'ayudes a un desconocido sin revelar tu identidad',
  'pases 20 minutos en completa quietud, respirando y dejando ir el rencor',
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
  const reply = await askCurIA(message);
  const penitencia = extractPenitencia(reply) || pick(PENITENCIAS);
  return { reply, absolucion: true, efecto, sins, penitencia };
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
