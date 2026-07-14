/**
 * sfx.ts — efeitos sonoros do Kwendi.
 * Delega em AudioManager (MP3s em CDN) e respeita o flag de Acessibilidade.
 */
import AudioManager from "@/utils/audio";

export const sfx = {
  correto: () => AudioManager.play("correct"),
  errado: () => AudioManager.play("wrong"),
  recompensa: () => AudioManager.play("achievement"),
  bau: () => AudioManager.play("achievement"),
  conquista: () => AudioManager.play("achievement"),
  tick: () => AudioManager.play("click"),
};