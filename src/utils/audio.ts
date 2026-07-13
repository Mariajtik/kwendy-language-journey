// src/utils/audio.ts
console.log("🔥 MÓDULO DE ÁUDIO CARREGADO!");

class AudioManager {
  public static initGlobalListener() {
    if (typeof window === "undefined") return;

    // TRUE no final ativa a "Capture Phase". 
    // Intercetamos o clique antes de o React sequer saber que ele aconteceu.
    document.removeEventListener("click", this.handleGlobalClick, true);
    document.addEventListener("click", this.handleGlobalClick, true);
    
    console.log("🎧 OUVINTE GLOBAL ATIVADO (Fase de Captura)!");
  }

  private static handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isButton = target.closest('button, a, [role="button"]');
    
    if (isButton) {
      console.log("🖱️ CLIQUE NUM BOTÃO DETETADO PELA CAPTURA!");
      AudioManager.playSynthPop();
    }
  };

  public static playSynthPop() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn("AudioContext não suportado neste browser.");
        return;
      }
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
      
      console.log("🎵 SOM GERADO COM SUCESSO!");
    } catch (erro) {
      console.error("Erro no synth:", erro);
    }
  }
}

AudioManager.initGlobalListener();
export default AudioManager;
