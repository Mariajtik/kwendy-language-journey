class AudioManager {
  public static initGlobalListener() {
    if (typeof window === "undefined") return;

    // Removemos eventos antigos para não duplicar se o ficheiro recarregar
    document.removeEventListener("click", this.handleGlobalClick);
    document.addEventListener("click", this.handleGlobalClick);
  }

  private static handleGlobalClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Deteta cliques em qualquer botão ou link da aplicação
    const isButton = target.closest('button, a, [role="button"]');
    
    if (isButton) {
      AudioManager.playSynthPop();
    }
  };

  // Cria um som do ZERO sem precisar de ficheiros MP3
  public static playSynthPop() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Cria um som de "Pop/gota" muito rápido e agradável
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime); // Volume a 40%
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (erro) {
      console.error("Falha ao gerar o som nativo:", erro);
    }
  }
}

// Inicializa a escuta global
AudioManager.initGlobalListener();

export default AudioManager;
