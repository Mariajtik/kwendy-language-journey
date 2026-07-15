// src/utils/audio.ts
// Gestor de Áudio Híbrido e Resiliente para o Kwendi.
// - Tenta carregar ficheiros locais cortados (com suporte a múltiplos nomes).
// - Fallback automático para a CDN Lovable se o ficheiro local falhar.
// - Processamento via Web Audio API para latência ZERO.

import clickAsset from "@/assets/sfx/click.mp3.asset.json";
import correctAsset from "@/assets/sfx/correct.mp3.asset.json";
import wrongAsset from "@/assets/sfx/wrong.mp3.asset.json";
import achievementAsset from "@/assets/sfx/achievement.mp3.asset.json";

export type SfxName = "click" | "correct" | "wrong" | "achievement";

// Lista de nomes possíveis que os teus ficheiros cortados possam ter no GitHub
const LOCAL_VARIANTS: Record<SfxName, string[]> = {
  click: ["Voicy_Click.mp3", "click.mp3"],
  correct: ["Voicy_Correct.mp3", "Voicy_CORRECT ANSWER BUZZER.mp3", "correct.mp3"],
  wrong: ["Voicy_Wrong.mp3", "Voicy_Wrong Buzzer 4.mp3", "wrong.mp3"],
  achievement: ["Voicy_Terraria achievement.mp3", "achievement.mp3", "Voicy_Correct.mp3"]
};

// Fallbacks oficiais da CDN do Lovable
const CDN_URLS: Record<SfxName, string> = {
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

class AudioManager {
  private static ctx: AudioContext | null = null;
  private static buffers: Record<string, AudioBuffer> = {};
  private static lastClickAt = 0;

  /** Devolve (ou cria) o AudioContext partilhado, já desbloqueado. */
  static getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AC();
      } catch {
        return null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Reproduz um ArrayBuffer arbitrário no mesmo contexto global. */
  static async playArrayBuffer(data: ArrayBuffer, volume = 1): Promise<void> {
    const ctx = this.getContext();
    if (!ctx) throw new Error("no_audio_context");
    const buffer = await ctx.decodeAudioData(data.slice(0));
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(0);
  }

  static init() {
    if (typeof window === "undefined" || this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Inicia o pré-carregamento em paralelo para todos os efeitos
      Object.keys(LOCAL_VARIANTS).forEach((key) => {
        this.preloadWithFallback(key as SfxName);
      });

      this.initGlobalListener();
    } catch (e) {
      console.warn("Web Audio API não suportada:", e);
    }
  }

  // Tenta carregar o ficheiro local cortado. Se falhar, recorre à CDN do Lovable.
  private static async preloadWithFallback(name: SfxName) {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const variants = LOCAL_VARIANTS[name];
    
    // 1. Tenta as variantes de nomes locais no GitHub
    for (const filename of variants) {
      const localPath = `${baseUrl}sounds/${filename}`.replace(/\/+/g, "/");
      try {
        const response = await fetch(localPath);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          await this.decodeAndStore(name, arrayBuffer);
          console.log(`🎯 [Audio] Carregado com sucesso do GitHub: ${filename}`);
          return; // Sucesso! Sai da função.
        }
      } catch {
        // Falha silenciosa, tenta a próxima variante
      }
    }

    // 2. Plano B: Se nenhum local funcionar, descarrega o asset da CDN Lovable
    console.warn(`⚠️ [Audio] Ficheiro local para [${name}] não encontrado. Usando fallback CDN.`);
    try {
      const response = await fetch(CDN_URLS[name]);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        await this.decodeAndStore(name, arrayBuffer);
      }
    } catch (err) {
      console.error(`❌ [Audio] Falha crítica ao carregar fallback para [${name}]:`, err);
    }
  }

  private static decodeAndStore(name: SfxName, arrayBuffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
      this.ctx?.decodeAudioData(
        arrayBuffer,
        (decodedBuffer) => {
          this.buffers[name] = decodedBuffer;
          resolve();
        },
        (err) => {
          console.error(`Erro ao descodificar buffer de [${name}]:`, err);
          resolve();
        }
      );
    });
  }

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
    
    if (!this.ctx) this.init();
    const context = this.ctx;
    if (!context) return;

    if (context.state === "suspended") {
      context.resume();
    }

    const buffer = this.buffers[name];
    if (!buffer) {
      // Fallback clássico caso a descodificação ainda esteja a decorrer
      const fallback = new Audio(CDN_URLS[name]);
      fallback.volume = VOLUMES[name];
      void fallback.play().catch(() => {});
      return;
    }

    try {
      const source = context.createBufferSource();
      const gainNode = context.createGain();

      source.buffer = buffer;
      gainNode.gain.setValueAtTime(VOLUMES[name], context.currentTime);

      source.connect(gainNode);
      gainNode.connect(context.destination);
      source.start(0);
    } catch (e) {
      console.error(`Erro ao reproduzir [${name}]:`, e);
    }
  }

  static playClick() {
    const now = Date.now();
    if (now - AudioManager.lastClickAt < 40) return; // debounce
    AudioManager.lastClickAt = now;
    AudioManager.play("click");
  }
}

// Desbloqueia e inicializa o motor de áudio no primeiro clique do utilizador
if (typeof window !== "undefined") {
  const unlock = () => {
    AudioManager.init();
    document.removeEventListener("click", unlock, true);
    document.removeEventListener("touchstart", unlock, true);
  };
  document.addEventListener("click", unlock, true);
  document.addEventListener("touchstart", unlock, true);
}

// Inicializa a escuta global de botões
AudioManager.initGlobalListener();

export default AudioManager;
