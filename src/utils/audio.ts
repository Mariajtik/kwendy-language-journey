class AudioManager {
  // Configura um ouvinte global (ignora as regras do React)
  public static initGlobalListener() {
    if (typeof window === "undefined") return;

    // Colocamos o evento diretamente no documento da página
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      
      // Verifica se clicámos num <button>, num <a> (link), ou em algo dentro deles
      const isButton = target.closest('button, a, [role="button"]');
      
      if (isButton) {
        this.playClick();
      }
    });
  }

  public static playClick() {
    try {
      // Usamos o teu ficheiro original
      const som = new Audio(`${import.meta.env.BASE_URL}sounds/Voicy_Click.mp3`);
      som.volume = 0.5;
      som.play().catch(() => {
        // Falha silenciosa para não poluir a consola
      });
    } catch (erro) {
      // Ignora erros
    }
  }
}

// Inicializa o ouvinte global automaticamente assim que o ficheiro é lido
AudioManager.initGlobalListener();

export default AudioManager;
