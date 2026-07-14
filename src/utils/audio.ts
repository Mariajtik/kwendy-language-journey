// src/utils/audio.ts
// Gestor central de efeitos sonoros do Kwendi com latência ZERO absoluta (Web Audio API).
// - Pré-carrega os MP3s limpos diretamente da pasta pública (/sounds/) na RAM.
// - Respeita o flag de acessibilidade `kwendi.def.acessibilidade` (sons).
// - Debounce em clicks globais para evitar disparos duplicados.

export type SfxName = "click" | "correct" | "wrong" | "achievement";

// Mapeamento exato dos teus ficheiros guardados na pasta public/sounds/ do GitHub
const SOUND_FILES: Record<SfxName, string> = {
  click: "Voicy_Click.mp3",
  correct: "Voicy_Correct.mp3",
  wrong: "Voicy_Wrong.mp3",
  achievement: "Voicy_Correct.mp3", // Reutiliza o som correto como fallback para conquistas
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

  static init() {
    if (typeof window === "undefined" || this.ctx) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      // Pré-carrega e descodifica todos os sons para a memória RAM (latência zero)
      Object.entries(SOUND_FILES).forEach(([key, filename]) => {
        this.preload(key as SfxName, filename);
      });

      this.initGlobalListener();
    } catch (e) {
      console.warn("Web Audio API não suportada neste browser:", e);
    }
  }

  private static async preload(name: SfxName, filename: string) {
    try {
      const baseUrl = import.meta.env.BASE_URL || "/";
      const path = `${baseUrl}sounds/${filename}`.replace(/\/+/g, "/");
      
      const response = await fetch(path);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      
      // Descodifica o áudio comprimido para áudio bruto (PCM) na memória RAM
      this.ctx?.decodeAudioData(
        arrayBuffer,
        (decodedBuffer) => {
          this.buffers[name] = decodedBuffer;
        },
        (err) => console.error(`Erro ao descodificar som [${name}]:`, err)
      );
    } catch (error) {
      console.warn(`Não foi possível pré-carregar o som [${name}]:`, error);
    }
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

    // Contorna políticas estritas de autoplay dos navegadores modernos
    if (context.state === "suspended") {
      context.resume();
    }

    const buffer = this.buffers[name];
    if (!buffer) {
      // Fallback ultra-rápido caso o buffer ainda esteja a carregar
      const baseUrl = import.meta.env.BASE_URL || "/";
      const path = `${baseUrl}sounds/${SOUND_FILES[name]}`.replace(/\/+/g, "/");
      const fallback = new Audio(path);
      fallback.volume = VOLUMES[name];
      void fallback.play().catch(() => {});
      return;
    }

    try {
      // Toca o som diretamente da memória do hardware de áudio (Instantâneo / 0ms)
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
