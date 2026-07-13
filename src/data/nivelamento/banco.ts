/**
 * banco.ts — Banco de itens do Teste de Nivelamento anotados por CEFR e
 * categoria. **Não inventa conteúdo**: reaproveita todos os passos já
 * existentes em `LICOES_M1` e atribui-lhes um nível CEFR combinando:
 *   - base CEFR da unidade (A1..B1)
 *   - overlay de dificuldade do tipo de passo (easy / medium / hard)
 *
 * O resultado é um pool que cobre A1 até C1 usando exclusivamente o
 * material do Módulo 1 do currículo Kwendi.
 */

import { LICOES_M1 } from "@/data/licoes/m1";
import type { Passo } from "@/data/licoes/tipos";

export type Cefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export const NIVEIS_CEFR: Cefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export type Categoria =
  | "gramatica"
  | "vocabulario"
  | "compreensao"
  | "listening"
  | "traducao_pt_um"
  | "traducao_um_pt";

export const CATEGORIAS_LABEL: Record<Categoria, string> = {
  gramatica: "Gramática",
  vocabulario: "Vocabulário",
  compreensao: "Compreensão",
  listening: "Escuta",
  traducao_pt_um: "Tradução PT → Umbundu",
  traducao_um_pt: "Tradução Umbundu → PT",
};

export type ItemNivelamento = {
  id: string;
  cefr: Cefr;
  categoria: Categoria;
  unidadeSugerida: string; // ex: "m1u1"
  passo: Passo;
};

// Base CEFR por unidade do M1.
const BASE_UNIDADE: Record<string, Cefr> = {
  m1u1: "A1",
  m1u2: "A1",
  m1u3: "A2",
  m1u4: "A2",
  m1u5: "B1",
};

type Tier = "easy" | "medium" | "hard";

const TIER_POR_TIPO: Record<Passo["tipo"], Tier | null> = {
  escuta_escolha: "easy",
  emparelhar: "easy",
  preencher_letras: "easy",
  traduzir_umbundu_pt: "easy",
  traduzir_pt_umbundu: "medium",
  preencher_lacuna: "medium",
  escuta_montar: "medium",
  montar_frase: "hard",
  escrever: "hard",
  escuta_escrever: "hard",
  falar: null, // ignorado (não avaliável sem STT)
  aprender: null,
  dialogo: null,
  conversa_escolha: null,
};

const CATEGORIA_POR_TIPO: Record<Passo["tipo"], Categoria | null> = {
  escuta_escolha: "listening",
  escuta_montar: "listening",
  escuta_escrever: "listening",
  emparelhar: "vocabulario",
  preencher_letras: "vocabulario",
  preencher_lacuna: "gramatica",
  traduzir_umbundu_pt: "traducao_um_pt",
  traduzir_pt_umbundu: "traducao_pt_um",
  montar_frase: "traducao_pt_um",
  escrever: "compreensao",
  falar: null,
  aprender: null,
  dialogo: null,
  conversa_escolha: null,
};

/** Aplica o overlay de dificuldade sobre a base CEFR da unidade. */
function cefrFinal(base: Cefr, tier: Tier): Cefr {
  const bump = tier === "easy" ? 0 : tier === "medium" ? 1 : 2;
  const idx = NIVEIS_CEFR.indexOf(base) + bump;
  return NIVEIS_CEFR[Math.min(idx, NIVEIS_CEFR.length - 1)];
}

/** Extrai unidadeId de um secaoId (ex: "m1u3s2" → "m1u3"). */
function unidadeDaSecao(secaoId: string): string {
  const m = /^(m\d+u\d+)/.exec(secaoId);
  return m ? m[1] : "m1u1";
}

let cache: ItemNivelamento[] | null = null;

/** Constrói (uma única vez, memoizado) o banco completo de itens. */
export function bancoItens(): ItemNivelamento[] {
  if (cache) return cache;
  const out: ItemNivelamento[] = [];
  for (const secaoId of Object.keys(LICOES_M1)) {
    const licao = LICOES_M1[secaoId];
    const uId = unidadeDaSecao(licao.id);
    const base = BASE_UNIDADE[uId];
    if (!base) continue;
    licao.passos.forEach((passo, i) => {
      const tier = TIER_POR_TIPO[passo.tipo];
      const cat = CATEGORIA_POR_TIPO[passo.tipo];
      if (!tier || !cat) return;
      out.push({
        id: `${licao.id}#${i}`,
        cefr: cefrFinal(base, tier),
        categoria: cat,
        unidadeSugerida: uId,
        passo,
      });
    });
  }
  cache = out;
  return out;
}

/** Devolve itens filtrados por CEFR alvo (fallback = níveis adjacentes). */
export function itensPorNivel(alvo: Cefr): ItemNivelamento[] {
  const banco = bancoItens();
  const exatos = banco.filter((x) => x.cefr === alvo);
  if (exatos.length) return exatos;
  // Fallback: expande em anéis vizinhos.
  const alvoIdx = NIVEIS_CEFR.indexOf(alvo);
  for (let raio = 1; raio < NIVEIS_CEFR.length; raio++) {
    const cima = NIVEIS_CEFR[alvoIdx + raio];
    const baixo = NIVEIS_CEFR[alvoIdx - raio];
    const cands = banco.filter((x) => x.cefr === cima || x.cefr === baixo);
    if (cands.length) return cands;
  }
  return banco;
}