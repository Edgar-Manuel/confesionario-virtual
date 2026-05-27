let ctx = null;
let muted = false;

function getCtx() {
  if (muted) return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone({ freq = 440, dur = 0.6, type = 'sine', gain = 0.08, attack = 0.01, release = 0.4, delay = 0, detune = 0 }) {
  const c = getCtx(); if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + release);
}

const audio = {
  setMuted(v) { muted = !!v; },
  isMuted() { return muted; },
  bell() {
    tone({ freq: 880, dur: 2.0, type: 'sine', gain: 0.06, attack: 0.005, release: 1.0 });
    tone({ freq: 1318.5, dur: 2.4, type: 'sine', gain: 0.035, attack: 0.005, release: 1.2, delay: 0.04 });
    tone({ freq: 660, dur: 2.8, type: 'sine', gain: 0.025, attack: 0.005, release: 1.6, delay: 0.08 });
  },
  spark() {
    tone({ freq: 1760, dur: 0.18, type: 'triangle', gain: 0.04, attack: 0.002, release: 0.12 });
    tone({ freq: 2637, dur: 0.14, type: 'triangle', gain: 0.025, attack: 0.002, release: 0.10, delay: 0.04 });
  },
  organ() {
    [130.8, 196.0, 261.6, 329.6, 392.0].forEach((f, i) => {
      tone({ freq: f, dur: 4.5, type: 'sawtooth', gain: 0.025, attack: 0.4, release: 1.5, delay: i * 0.02, detune: i * 2 });
    });
    tone({ freq: 1046.5, dur: 4.5, type: 'sine', gain: 0.02, attack: 0.6, release: 1.8, delay: 0.4 });
  },
};

export default audio;
