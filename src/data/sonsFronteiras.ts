/**
 * SFX sintetizados com WebAudio — sem assets, sem downloads.
 * Chamar `tocar(<nome>)` para um som curto. Respeita o mute global.
 */

let ctx: AudioContext | null = null;
let mudo = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function setMudo(v: boolean) {
  mudo = v;
}

function tone(
  freq: number,
  duracao: number,
  tipo: OscillatorType = "sine",
  gainInicial = 0.25,
  delay = 0,
) {
  const c = getCtx();
  if (!c || mudo) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(gainInicial, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duracao);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t);
  osc.stop(t + duracao + 0.02);
}

export const sons = {
  acerto() {
    // Ding alegre em duas notas ascendentes.
    tone(880, 0.15, "triangle", 0.28, 0);
    tone(1320, 0.35, "triangle", 0.22, 0.08);
  },
  erro() {
    tone(220, 0.25, "sawtooth", 0.2, 0);
    tone(160, 0.35, "sawtooth", 0.18, 0.05);
  },
  carimbo() {
    tone(90, 0.08, "square", 0.35, 0);
    tone(60, 0.12, "square", 0.25, 0.03);
  },
  tique() {
    tone(1200, 0.05, "square", 0.08, 0);
  },
};