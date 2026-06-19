/**
 * stats.ts — contadores simples persistidos em localStorage,
 * usados para destravar conquistas e marcos.
 */
export const bumpStat = (key: string, n = 1): number => {
  try {
    const cur = Number(localStorage.getItem(key) ?? "0");
    const next = cur + n;
    localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 0;
  }
};

export const getStat = (key: string): number => {
  try {
    return Number(localStorage.getItem(key) ?? "0");
  } catch {
    return 0;
  }
};

export const STATS = {
  dicionarioBuscas: "kwendi.stats.dicionario.buscas",
  falaGravacoes: "kwendi.stats.fala.gravacoes",
  alfabetoEscutas: "kwendi.stats.alfabeto.escutas",
  cadernoGuardadas: "kwendi.caderno.guardadas",
} as const;