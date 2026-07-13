// src/utils/audio.ts

class AudioManager {
  private static clickSound: HTMLAudioElement | null = null;

  public static init() {
    if (typeof window !== "undefined") {
      // O caminho exato do teu ficheiro com a capitalização correta
      this.clickSound = new Audio('/sounds/Voicy_Click.mp3');
      
      // Dica de UX: 0.5 (50%) é o ideal para cliques. 
      // 1.0 (100%) costuma ser demasiado alto com fones e assusta o utilizador.
      this.clickSound.volume = 0.5; 
    }
  }

  public static playClick() {
    if (!this.clickSound) return;
    
    // O cloneNode garante que cliques rápidos (double-click, etc) tocam o som duas vezes
    // em vez de cortar o som a meio. É isto que dá o "feeling" premium.
    const soundClone = this.clickSound.cloneNode(true) as HTMLAudioElement;
    
    soundClone.play().catch((error) => {
      console.warn("Áudio bloqueado pelas políticas do navegador:", error);
    });
  }
}

// Auto-inicialização ao importar
AudioManager.init();

export default AudioManager;
