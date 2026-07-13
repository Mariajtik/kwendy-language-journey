/**
 * motor.ts — Motor adaptativo do Teste de Nivelamento (staircase simples).
 *
 * A cada resposta, sobe/desce 1 degrau CEFR e escolhe o próximo item
 * do banco filtrado por dificuldade. Termina entre 10 e 15 perguntas ou
 * quando o degrau estabiliza (3 respostas consecutivas com o mesmo nível).
 *
 * Nível final = mediana dos últimos 3 níveis atingidos.
 */

import type { Passo } from "@/data/licoes/tipos";
import {
  bancoItens,
  itensPorNivel,
  NIVEIS_CEFR,
  type Categoria,
  type Cefr,
  type ItemNivelamento,
} from "./banco";

export const MIN_PERGUNTAS = 10;
export const MAX_PERGUNTAS = 15;

export type ResumoNivelamento = {
  cefr: Cefr;
  acertos: number;
  total: number;
  percentagem: number;
  categorias: Record<Categoria, { acertos: number; total: number }>;
  pontosFortes: Categoria[];
  pontosFracos: Categoria[];
  unidadeSugerida: string | null;
  trilhaSugerida: string[];
};

/** Mapeia o nível auto-declarado no onboarding para um CEFR de partida. */
export function nivelInicialDeclarado(level?: string): Cefr {
  const l = (level ?? "").toLowerCase();
  if (l.startsWith("avan") || l.includes("advanced")) return "B2";
  if (l.startsWith("inter") || l.includes("intermed")) return "B1";
  return "A1";
}

function transformarAcessibilidade(
  p: Passo,
  semFala: boolean,
  semEscuta: boolean,
): Passo {
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

export class MotorAdaptativo {
  private nivelIdx: number;
  private historicoNiveis: number[] = [];
  private usados = new Set<string>();
  private respostas: { certo: boolean; categoria: Categoria; cefr: Cefr }[] = [];
  private semFala: boolean;
  private semEscuta: boolean;

  constructor(opts: { nivelInicial?: Cefr; semFala?: boolean; semEscuta?: boolean } = {}) {
    const inicial = opts.nivelInicial ?? "B1";
    this.nivelIdx = Math.max(0, NIVEIS_CEFR.indexOf(inicial));
    this.semFala = !!opts.semFala;
    this.semEscuta = !!opts.semEscuta;
  }

  get nivelAtual(): Cefr {
    return NIVEIS_CEFR[this.nivelIdx];
  }

  get respondidas(): number {
    return this.respostas.length;
  }

  /** Pega o próximo item, ou null se o teste terminou. */
  proximo(): ItemNivelamento | null {
    if (this.terminou()) return null;
    // Tenta o nível actual; se pool exausto, sobe raio.
    for (let raio = 0; raio < NIVEIS_CEFR.length; raio++) {
      const candidatos: ItemNivelamento[] = [];
      const alvos = new Set<number>();
      alvos.add(this.nivelIdx);
      if (raio > 0) {
        if (this.nivelIdx + raio < NIVEIS_CEFR.length) alvos.add(this.nivelIdx + raio);
        if (this.nivelIdx - raio >= 0) alvos.add(this.nivelIdx - raio);
      }
      for (const idx of alvos) {
        for (const it of itensPorNivel(NIVEIS_CEFR[idx])) {
          if (!this.usados.has(it.id)) candidatos.push(it);
        }
      }
      if (candidatos.length) {
        // Determinístico: escolhe o primeiro (banco já vem ordenado por unidade → secção → passo).
        const escolhido = candidatos[0];
        return {
          ...escolhido,
          passo: transformarAcessibilidade(escolhido.passo, this.semFala, this.semEscuta),
        };
      }
    }
    return null;
  }

  /** Regista a resposta e ajusta o degrau. */
  registrar(item: ItemNivelamento, certo: boolean) {
    this.usados.add(item.id);
    this.respostas.push({ certo, categoria: item.categoria, cefr: item.cefr });
    this.historicoNiveis.push(this.nivelIdx);
    if (certo && this.nivelIdx < NIVEIS_CEFR.length - 1) this.nivelIdx += 1;
    else if (!certo && this.nivelIdx > 0) this.nivelIdx -= 1;
  }

  /** Estável = últimos 3 níveis registados são idênticos. */
  private estabilizou(): boolean {
    const h = this.historicoNiveis;
    if (h.length < 3) return false;
    const [a, b, c] = h.slice(-3);
    return a === b && b === c;
  }

  terminou(): boolean {
    if (this.respostas.length >= MAX_PERGUNTAS) return true;
    if (this.respostas.length >= MIN_PERGUNTAS && this.estabilizou()) return true;
    return false;
  }

  /** Mediana dos últimos 3 níveis (ou último, se menos de 3). */
  private nivelFinalIdx(): number {
    const ult = this.historicoNiveis.slice(-3);
    if (!ult.length) return this.nivelIdx;
    const sorted = [...ult].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }

  resumo(): ResumoNivelamento {
    const total = this.respostas.length;
    const acertos = this.respostas.filter((r) => r.certo).length;
    const percentagem = total > 0 ? Math.round((acertos / total) * 100) : 0;

    const cats: Categoria[] = [
      "gramatica",
      "vocabulario",
      "compreensao",
      "listening",
      "traducao_pt_um",
      "traducao_um_pt",
    ];
    const categorias = Object.fromEntries(
      cats.map((c) => [c, { acertos: 0, total: 0 }]),
    ) as ResumoNivelamento["categorias"];
    for (const r of this.respostas) {
      categorias[r.categoria].total += 1;
      if (r.certo) categorias[r.categoria].acertos += 1;
    }
    const pontosFortes = cats.filter(
      (c) => categorias[c].total > 0 && categorias[c].acertos / categorias[c].total >= 0.7,
    );
    const pontosFracos = cats.filter(
      (c) => categorias[c].total > 0 && categorias[c].acertos / categorias[c].total < 0.5,
    );

    const cefr = NIVEIS_CEFR[this.nivelFinalIdx()];
    const unidadeSugerida = unidadeParaNivel(cefr, percentagem);
    const trilhaSugerida = trilhaParaUnidade(unidadeSugerida);

    return {
      cefr,
      acertos,
      total,
      percentagem,
      categorias,
      pontosFortes,
      pontosFracos,
      unidadeSugerida,
      trilhaSugerida,
    };
  }
}

/** Ordem canónica das unidades disponíveis (Módulo 1). */
const UNIDADES_ORDEM = ["m1u1", "m1u2", "m1u3", "m1u4", "m1u5"];

/**
 * Regra de posicionamento CEFR → unidade inicial. Baseia-se apenas nos
 * módulos e unidades atualmente desenvolvidos (M1). Para C1/C2 usamos a
 * última unidade do M1 e desbloqueamos todo o curso separadamente.
 */
export function unidadeParaNivel(cefr: Cefr, percentagem: number): string | null {
  if (percentagem === 100) return null;
  switch (cefr) {
    case "A1":
      return "m1u1";
    case "A2":
      return "m1u3";
    case "B1":
      return "m1u5";
    case "B2":
    case "C1":
    case "C2":
      return "m1u5";
  }
}

/** Trilha sugerida = unidades restantes a partir da inicial. */
export function trilhaParaUnidade(inicial: string | null): string[] {
  if (!inicial) return [];
  const idx = UNIDADES_ORDEM.indexOf(inicial);
  if (idx < 0) return UNIDADES_ORDEM.slice();
  return UNIDADES_ORDEM.slice(idx);
}

/** True se o CEFR detectado for considerado "avançado" (desbloqueia tudo). */
export function ehCefrAvancado(cefr: Cefr): boolean {
  return cefr === "C1" || cefr === "C2";
}

/** True se o CEFR detectado for iniciante (força bloqueio de avançados). */
export function ehCefrIniciante(cefr: Cefr): boolean {
  return cefr === "A1" || cefr === "A2";
}

/** Sanity check exposto para debug: quantos itens existem por CEFR. */
export function distribuicaoBanco(): Record<Cefr, number> {
  const out = Object.fromEntries(NIVEIS_CEFR.map((c) => [c, 0])) as Record<Cefr, number>;
  for (const it of bancoItens()) out[it.cefr] += 1;
  return out;
}