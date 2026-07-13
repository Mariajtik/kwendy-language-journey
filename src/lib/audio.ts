/**
 * audio.ts — gestor robusto de áudio.
 *
 *  - Cache de HTMLAudioElement por URL para evitar re-download.
 *  - Unlock automático no primeiro toque do utilizador (iOS/Safari exigem).
 *  - `play()` sempre em try/catch com re-instanciação em NotAllowedError.
 *  - Falha silenciosa; nunca lança para o UI.
 */

const cache = new Map<string, HTMLAudioElement>();
let unlocked = false;

function unlock() {
  if (unlocked || typeof window === "undefined") return;
  unlocked = true;
  // Toca um áudio silencioso para desbloquear em iOS.
  try {
    const a = new Audio(
      "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjM1AAAAAAAAAAAAAAAAJAAAAAAAAAAAASBs=",
    );
    a.volume = 0;
    void a.play().catch(() => undefined);
  } catch { /* noop */ }
}

if (typeof window !== "undefined") {
  const handler = () => {
    unlock();
    window.removeEventListener("pointerdown", handler);
    window.removeEventListener("touchstart", handler);
  };
  window.addEventListener("pointerdown", handler, { once: true });
  window.addEventListener("touchstart", handler, { once: true });
}

function get(url: string): HTMLAudioElement | null {
  if (typeof Audio === "undefined") return null;
  let a = cache.get(url);
  if (!a) {
    try {
      a = new Audio(url);
      a.preload = "auto";
      cache.set(url, a);
    } catch {
      return null;
    }
  }
  return a;
}

export const audio = {
  /** Toca um clip identificado por URL; ignora falhas. */
  async play(url: string, { volume = 1, loop = false }: { volume?: number; loop?: boolean } = {}) {
    unlock();
    const a = get(url);
    if (!a) return;
    try {
      a.currentTime = 0;
      a.volume = Math.max(0, Math.min(1, volume));
      a.loop = loop;
      await a.play();
    } catch {
      // Tentar nova instância se falhou (autoplay policy pode ter mudado).
      try {
        cache.delete(url);
        const b = get(url);
        if (b) {
          b.volume = volume;
          b.loop = loop;
          await b.play();
        }
      } catch { /* silencioso */ }
    }
  },
  stop(url: string) {
    const a = cache.get(url);
    if (!a) return;
    try { a.pause(); a.currentTime = 0; } catch { /* noop */ }
  },
  preload(urls: string[]) {
    urls.forEach(get);
  },
};