// src/utils/audio.ts
// Gestor central de efeitos sonoros do Kwendi.
// - Toca MP3s alojados em CDN (assets Lovable).
// - Respeita o flag de acessibilidade `kwendi.def.acessibilidade` (sons).
// - Debounce em clicks globais para evitar disparos duplicados.
import clickAsset from "@/assets/sfx/click.mp3.asset.json";
import correctAsset from "@/assets/sfx/correct.mp3.asset.json";
import wrongAsset from "@/assets/sfx/wrong.mp3.asset.json";
import achievementAsset from "@/assets/sfx/achievement.mp3.asset.json";

export type SfxName = "click" | "correct" | "wrong" | "achievement";

const URLS: Record<SfxName, string> = {
  click: clickAsset.url,
  correct: correctAsset.url,
  wrong: wrongAsset.url,
  achievement: achievementAsset.url,
};

const VOLUMES: Record<SfxName, number> = {
  click: 0.35,
  correct: 0.55,
  wrong: 0.5,
  achievement: 0.55,
};

function somsAtivos(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("kwendi.def.acessibilidade");
    if (!raw) return true;
    return JSON.parse(raw)?.sons !== false;
  } catch {
    return true;
  }
}

// Pool de HTMLAudio por som para permitir sobreposição sem re-download.
const pools: Record<SfxName, HTMLAudioElement[]> = {
  click: [],
  correct: [],
  wrong: [],
  achievement: [],
};

function getPlayer(name: SfxName): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  const pool = pools[name];
  const free = pool.find((a) => a.paused || a.ended);
  if (free) return free;
  if (pool.length >= 4) return pool[0]; // limite de instâncias simultâneas
  const a = new Audio(URLS[name]);
  a.preload = "auto";
  pool.push(a);
  return a;
}

let lastClickAt = 0;

class AudioManager {
  static initGlobalListener() {
    if (typeof window === "undefined") return;
    document.removeEventListener("click", AudioManager.handleGlobalClick, true);
    document.addEventListener("click", AudioManager.handleGlobalClick, true);
  }

  private static handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const el = target.closest('button, a, [role="button"], [data-sfx-click]');
    if (!el) return;
    if ((el as HTMLElement).dataset.sfxSilent === "true") return;
    AudioManager.playClick();
  };

  static play(name: SfxName) {
    if (!somsAtivos()) return;
    const a = getPlayer(name);
    if (!a) return;
    try {
      a.currentTime = 0;
      a.volume = VOLUMES[name];
      void a.play().catch(() => undefined);
    } catch {
      /* silencioso */
    }
  }

  static playClick() {
    const now = Date.now();
    if (now - lastClickAt < 40) return; // debounce
    lastClickAt = now;
    AudioManager.play("click");
  }
}

AudioManager.initGlobalListener();

export default AudioManager;