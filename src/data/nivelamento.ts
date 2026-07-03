/**
 * nivelamento.ts
 * Constrói o conjunto de exercícios do Teste de Nivelamento (~15 questões
 * difíceis, ≤10 min). Cada exercício é anotado com a unidade de origem
 * para permitir posicionamento em função dos acertos por unidade.
 *
 * Regras:
 *  - Só passos de exercício (exclui `aprender` e `dialogo`).
 *  - Preferência por tipos difíceis (escrever, montar_frase, preencher_lacuna,
 *    escuta_escrever) antes de fallback para escolha múltipla.
 *  - Respeita AcessibilidadeContext: se "não posso ouvir/falar" (passados
 *    como flags), converte fala/escuta em escrita equivalente — igual ao
 *    que a LessonScreen já faz.
 *  - 3 exercícios por unidade × 5 unidades = 15.
 */

import { LICOES_M1 } from "@/data/licoes/m1";
import type { Licao, Passo } from "@/data/licoes/tipos";
import { CURRICULO, getUnidade } from "@/data/curriculo";

export type ExercicioNivelamento = {
  unidadeId: string;
  passo: Passo;
};

const UNIDADES_M1 = ["m1u1", "m1u2", "m1u3", "m1u4", "m1u5"];

const EXERCICIO_TYPES = new Set<Passo["tipo"]>([
  "escrever",
  "montar_frase",
  "preencher_lacuna",
  "escuta_escrever",
  "escuta_montar",
  "traduzir_pt_umbundu",
  "traduzir_umbundu_pt",
  "escuta_escolha",
  "falar",
  "emparelhar",
  "preencher_letras",
]);

/** Ordenação por dificuldade (maior = mais difícil, escolhido primeiro). */
const PRIORIDADE: Record<Passo["tipo"], number> = {
  escrever: 10,
  montar_frase: 9,
  preencher_lacuna: 9,
  escuta_escrever: 8,
  escuta_montar: 7,
  traduzir_pt_umbundu: 6,
  traduzir_umbundu_pt: 5,
  escuta_escolha: 4,
  emparelhar: 4,
  preencher_letras: 3,
  falar: 2,
  // não usados
  aprender: 0,
  dialogo: 0,
  conversa_escolha: 0,
};

function passosDaUnidade(unidadeId: string): { licao: Licao; passo: Passo }[] {
  const info = getUnidade(unidadeId);
  if (!info) return [];
  const out: { licao: Licao; passo: Passo }[] = [];
  for (const sec of info.unidade.seccoes) {
    const licao = LICOES_M1[sec.id];
    if (!licao) continue;
    for (const p of licao.passos) {
      if (EXERCICIO_TYPES.has(p.tipo)) out.push({ licao, passo: p });
    }
  }
  return out;
}

function transformarPasso(p: Passo, semFala: boolean, semEscuta: boolean): Passo {
  if (semFala && p.tipo === "falar") {
    return { tipo: "escrever", pergunta: `Escreve em Umbundu: "${p.pt}"`, resposta: p.frase };
  }
  if (semEscuta && p.tipo === "escuta_escolha") {
    return { tipo: "traduzir_umbundu_pt", umbundu: p.audio, opcoes: p.opcoes, correta: p.correta };
  }
  if (semEscuta && p.tipo === "escuta_escrever") {
    return { tipo: "escrever", pergunta: `Escreve em Umbundu: "${p.pt}"`, resposta: p.audio };
  }
  if (semEscuta && p.tipo === "escuta_montar") {
    return { tipo: "montar_frase", pergunta: `Traduz para Umbundu: "${p.pt}"`, alvo: p.alvo, distratores: p.distratores };
  }
  return p;
}

/**
 * Constrói o teste de nivelamento: 3 exercícios difíceis por unidade
 * (m1u1..m1u5). Determinístico dentro de uma sessão (não usa Math.random
 * em runtime — pega os N mais difíceis, tomando amostra distribuída).
 */
export function construirTesteNivelamento(opts?: {
  semFala?: boolean;
  semEscuta?: boolean;
  porUnidade?: number;
}): ExercicioNivelamento[] {
  const N = opts?.porUnidade ?? 3;
  const semFala = opts?.semFala ?? false;
  const semEscuta = opts?.semEscuta ?? false;
  const teste: ExercicioNivelamento[] = [];
  for (const uId of UNIDADES_M1) {
    const todos = passosDaUnidade(uId);
    // Ordena por prioridade descendente; em empate mantém ordem original.
    const ordenados = todos
      .map((x, i) => ({ ...x, idx: i, prio: PRIORIDADE[x.passo.tipo] ?? 0 }))
      .sort((a, b) => b.prio - a.prio || a.idx - b.idx);
    // Se pedirmos 3, tenta espaçar amostras (topo, meio, fundo do sorted).
    const escolhidos: Passo[] = [];
    if (ordenados.length <= N) {
      escolhidos.push(...ordenados.map((o) => o.passo));
    } else {
      const step = Math.floor(ordenados.length / N);
      for (let i = 0; i < N; i++) {
        escolhidos.push(ordenados[i * step].passo);
      }
    }
    for (const passo of escolhidos) {
      teste.push({ unidadeId: uId, passo: transformarPasso(passo, semFala, semEscuta) });
    }
  }
  return teste;
}

/**
 * Dado os acertos por unidade (mapa unidadeId → nº acertos) e o total por
 * unidade, devolve a primeira unidade onde o utilizador não domina
 * (acertos < metade). Se acertou tudo em todas → null.
 */
export function calcularUnidadeSugerida(
  acertosPorUnidade: Record<string, number>,
  totalPorUnidade: Record<string, number>,
): string | null {
  for (const uId of UNIDADES_M1) {
    const total = totalPorUnidade[uId] ?? 0;
    const acertos = acertosPorUnidade[uId] ?? 0;
    if (total === 0) continue;
    // "Não domina" = acertou < metade dos exercícios daquela unidade.
    if (acertos < Math.ceil(total / 2)) return uId;
  }
  return null;
}

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