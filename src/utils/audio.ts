// src/utils/audio.ts

class AudioManager {
  private static clickSound: HTMLAudioElement | null = null;

  // Pré-carrega o som para que seja imediato ao clicar
  public static init() {
    if (typeof window !== "undefined") {
      this.clickSound = new Audio('/sounds/click.mp3');
      this.clickSound.volume = 0.5; // Ajusta o volume (0.0 a 1.0)
    }
  }

  public static playClick() {
    if (!this.clickSound) return;
    
    // Clonar o node permite que cliques rápidos sobreponham os sons sem cortar o anterior (Efeito Duolingo real)
    const soundClone = this.clickSound.cloneNode(true) as HTMLAudioElement;
    
    soundClone.play().catch((error) => {
      // Browsers bloqueiam áudio automático até o utilizador interagir com a página.
      // O bloco catch evita que a aplicação quebre se houver restrições.
      console.warn("Áudio bloqueado pelo navegador:", error);
    });
  }
}

// Inicializa o áudio assim que o utilitário é importado
AudioManager.init();

export default AudioManager;
