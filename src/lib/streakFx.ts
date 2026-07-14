/**
 * streakFx — efeitos sonoros sintetizados via WebAudio para o fluxo de chama.
 * Sem assets externos; se AudioContext não estiver disponível, falha silencioso.
 */
import AudioManager from "@/utils/audio";
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  try {
    const AC = (window.AudioContext || (window as any).webkitAudioContext) as
      | typeof AudioContext
      | undefined;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  } catch {
    return null;
  }
}

function beep(freq: number, dur: number, when: number, gain = 0.15, type: OscillatorType = "sine") {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + when);
  g.gain.setValueAtTime(0, ac.currentTime + when);
  g.gain.linearRampToValueAtTime(gain, ac.currentTime + when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + when + dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(ac.currentTime + when);
  osc.stop(ac.currentTime + when + dur + 0.02);
}

/** Chama a subir: efeito de conquista. */
export function playStreakUp() {
  AudioManager.play("achievement");
}

/** Chama a acender pela primeira vez: pop grave + harmónico. */
export function playStreakIgnite() {
  beep(220, 0.15, 0, 0.15, "sawtooth");
  beep(660, 0.25, 0.08, 0.12, "triangle");
}

/** Chama a apagar: descida triste. */
export function playStreakLost() {
  beep(440, 0.18, 0, 0.15, "sine");
  beep(220, 0.28, 0.12, 0.12, "sine");
  beep(120, 0.35, 0.32, 0.1, "sine");
}

/** Chama congelada consumida — cristalino curto. */
export function playStreakShield() {
  beep(880, 0.1, 0, 0.1, "square");
  beep(1320, 0.14, 0.06, 0.08, "triangle");
}

/** Fanfarra de conquista — usa MP3 real via AudioManager. */
export function playAchievement() {
  AudioManager.play("achievement");
}