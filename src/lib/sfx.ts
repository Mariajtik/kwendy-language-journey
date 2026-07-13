/**
 * sfx.ts — efeitos sonoros sintetizados via Web Audio API (sem assets).
 * Todos os sons respeitam o flag global de "sons ligados" em Acessibilidade.
 */
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

function somsAtivos(): boolean {
  try {
    const raw = localStorage.getItem("kwendi.def.acessibilidade");
    if (!raw) return true;
    const cfg = JSON.parse(raw);
    return cfg?.sons !== false;
  } catch {
    return true;
  }
}

function beep(freqs: number[], durMs = 140, tipo: OscillatorType = "sine", volume = 0.18) {
  if (!somsAtivos()) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  freqs.forEach((f, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = tipo;
    osc.frequency.value = f;
    const start = now + (i * durMs) / 1000;
    const end = start + durMs / 1000;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(end + 0.02);
  });
}

export const sfx = {
  correto: () => beep([660, 990], 140, "triangle"),
  errado:  () => beep([220, 165], 200, "sawtooth", 0.15),
  recompensa: () => beep([523, 659, 784, 1046], 110, "sine", 0.16),
  bau: () => beep([392, 523, 659, 880], 130, "triangle", 0.2),
  tick: () => beep([880], 60, "square", 0.08),
};