class AudioManager {
  public static playClick() {
    try {
      // TESTE DE ISOLAMENTO: Usamos um som hospedado externamente.
      // É um som de clique leve de um banco de áudio público.
      const som = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      
      som.volume = 0.5;
      
      som.play().catch((erro) => {
        console.warn("O navegador bloqueou o som:", erro);
      });
    } catch (erro) {
      console.error("Erro interno:", erro);
    }
  }
}

export default AudioManager;
