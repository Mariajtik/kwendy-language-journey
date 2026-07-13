/**
 * nivelamento.ts — Fachada legada + utilitários de rotulagem.
 *
 * O motor adaptativo real vive em `src/data/nivelamento/motor.ts`. Este
 * ficheiro mantém-se para compatibilidade com imports antigos e para
 * expor helpers de UI (`rotularUnidade`, `unidadesFlat`).
 */

import { CURRICULO, getUnidade } from "@/data/curriculo";

export {
  MotorAdaptativo,
  nivelInicialDeclarado,
  unidadeParaNivel,
  trilhaParaUnidade,
  ehCefrAvancado,
  ehCefrIniciante,
  MIN_PERGUNTAS,
  MAX_PERGUNTAS,
  type ResumoNivelamento,
} from "@/data/nivelamento/motor";
export {
  NIVEIS_CEFR,
  CATEGORIAS_LABEL,
  type Cefr,
  type Categoria,
  type ItemNivelamento,
} from "@/data/nivelamento/banco";

/**
 * Dá o rótulo bonito "Módulo X · Unidade Y" a partir do id.
 */
export function rotularUnidade(unidadeId: string): string {
  const info = getUnidade(unidadeId);
  if (!info) return unidadeId;
  return `Módulo ${info.modulo.numero} · Unidade ${info.unidade.numero} — ${info.unidade.titulo}`;
}

/** Todas as unidades ordenadas do currículo (flat). */
export function unidadesFlat() {
  const flat: { moduloId: string; unidadeId: string }[] = [];
  CURRICULO.forEach((m) => m.unidades.forEach((u) => flat.push({ moduloId: m.id, unidadeId: u.id })));
  return flat;
}