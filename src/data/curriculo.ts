/**
 * curriculo.ts
 * Catálogo de Módulos → Unidades → Secções do Kwendi.
 * Baseado no índice do material de Umbundu enviado pelo utilizador.
 */

export type Seccao = {
  id: string; // ex: "m1u1s1"
  titulo: string;
  tipo: "licao" | "bau";
};

export type Unidade = {
  id: string; // ex: "m1u1"
  numero: number;
  titulo: string;
  cor: string; // HSL para banner
  seccoes: Seccao[];
};

export type Modulo = {
  id: string;
  numero: number;
  titulo: string;
  /** HSL para banner/tema do módulo (ex: "5 84% 42%") */
  cor: string;
  /** HSL para sombra 3D escura (ex: "5 84% 32%") */
  corEscura: string;
  unidades: Unidade[];
};

/** Helper: monta secções (n lições numeradas + 1 báu no fim) */
const mk = (
  unidadeId: string,
  titulos: string[],
): Seccao[] => [
  ...titulos.map((t, i) => ({
    id: `${unidadeId}s${i + 1}`,
    titulo: t,
    tipo: "licao" as const,
  })),
  { id: `${unidadeId}bau`, titulo: "Báu de tesouro", tipo: "bau" as const },
];

export const CURRICULO: Modulo[] = [
  {
    id: "m1",
    numero: 1,
    titulo: "Saúda a tua comunidade",
    cor: "0 100% 65%",
    corEscura: "0 70% 50%",
    unidades: [
      {
        id: "m1u1",
        numero: 1,
        titulo: "Saudações",
        cor: "5 84% 42%",
        seccoes: mk("m1u1", ["Olá, mundo", "Saudações", "Apresentar-se", "Família"]),
      },
      {
        id: "m1u2",
        numero: 2,
        titulo: "De manhã e na rua",
        cor: "25 90% 55%",
        seccoes: mk("m1u2", ["De manhã", "Na rua", "Cumprimentos do dia"]),
      },
      {
        id: "m1u3",
        numero: 3,
        titulo: "No mercado",
        cor: "35 90% 50%",
        seccoes: mk("m1u3", ["No mercado", "Comprar e vender", "Números básicos"]),
      },
      {
        id: "m1u4",
        numero: 4,
        titulo: "Conversação básica",
        cor: "150 60% 40%",
        seccoes: mk("m1u4", ["Conversação I", "Conversação II", "Diálogos do dia-a-dia"]),
      },
    ],
  },
  {
    id: "m2",
    numero: 2,
    titulo: "Eu e tu",
    cor: "25 90% 50%",
    corEscura: "25 90% 38%",
    unidades: [
      {
        id: "m2u1",
        numero: 1,
        titulo: "Identificação pessoal",
        cor: "5 84% 42%",
        seccoes: mk("m2u1", ["Quem sou", "O meu nome", "A minha idade"]),
      },
      {
        id: "m2u2",
        numero: 2,
        titulo: "Pronomes pessoais",
        cor: "265 60% 55%",
        seccoes: mk("m2u2", ["Pronomes pessoais", "Formas dos pronomes", "Conversação I", "Conversação II"]),
      },
      {
        id: "m2u3",
        numero: 3,
        titulo: "Nacionalidade e origem",
        cor: "200 75% 45%",
        seccoes: mk("m2u3", ["De onde sou", "Países e povos", "A minha terra"]),
      },
      {
        id: "m2u4",
        numero: 4,
        titulo: "Frases completas",
        cor: "150 60% 40%",
        seccoes: mk("m2u4", ["Frases declarativas", "Frases interrogativas", "Praticar diálogos"]),
      },
    ],
  },
  {
    id: "m3",
    numero: 3,
    titulo: "Introduza a tua família",
    cor: "330 75% 50%",
    corEscura: "330 75% 38%",
    unidades: [
      {
        id: "m3u1",
        numero: 1,
        titulo: "Família básica",
        cor: "5 84% 42%",
        seccoes: mk("m3u1", ["Pai e mãe", "Irmãos", "Filhos"]),
      },
      {
        id: "m3u2",
        numero: 2,
        titulo: "Família extensa",
        cor: "25 90% 55%",
        seccoes: mk("m3u2", ["Avós", "Tios e primos", "Sogros e cunhados"]),
      },
      {
        id: "m3u3",
        numero: 3,
        titulo: "Amizades",
        cor: "330 75% 55%",
        seccoes: mk("m3u3", ["O meu amigo", "Vizinhos", "Comunidade"]),
      },
      {
        id: "m3u4",
        numero: 4,
        titulo: "Possessivos e descrições",
        cor: "265 60% 55%",
        seccoes: mk("m3u4", ["Pronomes possessivos", "Descrever pessoas", "Frases descritivas"]),
      },
    ],
  },
  {
    id: "m4",
    numero: 4,
    titulo: "Ações",
    cor: "265 60% 50%",
    corEscura: "265 60% 38%",
    unidades: [
      {
        id: "m4u1",
        numero: 1,
        titulo: "Verbos essenciais",
        cor: "5 84% 42%",
        seccoes: mk("m4u1", ["Ser e estar", "Ter e haver", "Verbos do dia"]),
      },
      {
        id: "m4u2",
        numero: 2,
        titulo: "Rotina",
        cor: "25 90% 55%",
        seccoes: mk("m4u2", ["De manhã cedo", "Durante o dia", "Ao fim do dia"]),
      },
      {
        id: "m4u3",
        numero: 3,
        titulo: "Perguntar com verbos",
        cor: "200 75% 45%",
        seccoes: mk("m4u3", ["O que fazes?", "Onde vais?", "Quando voltas?"]),
      },
      {
        id: "m4u4",
        numero: 4,
        titulo: "Advérbios de tempo e modo",
        cor: "150 60% 40%",
        seccoes: mk("m4u4", ["Advérbios de tempo", "Advérbios de modo", "Praticar"]),
      },
    ],
  },
  {
    id: "m5",
    numero: 5,
    titulo: "Explora a natureza",
    cor: "150 55% 38%",
    corEscura: "150 55% 28%",
    unidades: [
      {
        id: "m5u1",
        numero: 1,
        titulo: "Animais",
        cor: "5 84% 42%",
        seccoes: mk("m5u1", ["Animais da casa", "Animais selvagens", "Sons dos animais"]),
      },
      {
        id: "m5u2",
        numero: 2,
        titulo: "Aves",
        cor: "200 75% 45%",
        seccoes: mk("m5u2", ["Aves comuns", "Aves do campo"]),
      },
      {
        id: "m5u3",
        numero: 3,
        titulo: "Plantas e vocabulário agrícola",
        cor: "150 60% 40%",
        seccoes: mk("m5u3", ["Plantas e árvores", "Vocabulário agrícola", "Profissões do campo"]),
      },
      {
        id: "m5u4",
        numero: 4,
        titulo: "Estações e meses",
        cor: "25 90% 55%",
        seccoes: mk("m5u4", ["Estações do ano", "Meses", "Dias da semana"]),
      },
    ],
  },
  {
    id: "m6",
    numero: 6,
    titulo: "Sabedoria Ovimbundu",
    cor: "28 45% 38%",
    corEscura: "28 45% 28%",
    unidades: [
      {
        id: "m6u1",
        numero: 1,
        titulo: "Provérbios do dia-a-dia",
        cor: "28 55% 45%",
        seccoes: mk("m6u1", ["Primeiros provérbios", "Significados", "Usar no diálogo"]),
      },
      {
        id: "m6u2",
        numero: 2,
        titulo: "Família e comunidade",
        cor: "330 55% 50%",
        seccoes: mk("m6u2", ["Provérbios de família", "Provérbios de comunidade", "Conversação"]),
      },
      {
        id: "m6u3",
        numero: 3,
        titulo: "Trabalho e natureza",
        cor: "150 55% 38%",
        seccoes: mk("m6u3", ["Provérbios do campo", "Provérbios da natureza", "Praticar"]),
      },
      {
        id: "m6u4",
        numero: 4,
        titulo: "Interpretar provérbios",
        cor: "42 80% 48%",
        seccoes: mk("m6u4", ["Interpretação", "Aplicação", "Criar o teu provérbio"]),
      },
    ],
  },
  {
    id: "m7",
    numero: 7,
    titulo: "Pronomes",
    cor: "210 80% 48%",
    corEscura: "210 80% 36%",
    unidades: [
      {
        id: "m7u1",
        numero: 1,
        titulo: "Pronomes pessoais",
        cor: "210 75% 50%",
        seccoes: mk("m7u1", ["Pessoais singulares", "Pessoais plurais", "Formas dos pronomes", "Conversação"]),
      },
      {
        id: "m7u2",
        numero: 2,
        titulo: "Pronomes possessivos",
        cor: "265 60% 55%",
        seccoes: mk("m7u2", ["Meu, teu, seu", "Nosso e vosso", "Conversação"]),
      },
      {
        id: "m7u3",
        numero: 3,
        titulo: "Pronomes demonstrativos",
        cor: "178 60% 42%",
        seccoes: mk("m7u3", ["Este, esse, aquele", "Perto e longe", "Conversação"]),
      },
      {
        id: "m7u4",
        numero: 4,
        titulo: "Interrogativos e indefinidos",
        cor: "25 90% 55%",
        seccoes: mk("m7u4", ["Pronomes interrogativos", "Pronomes indefinidos", "Praticar"]),
      },
    ],
  },
  {
    id: "m8",
    numero: 8,
    titulo: "Advérbios",
    cor: "42 90% 48%",
    corEscura: "42 90% 36%",
    unidades: [
      {
        id: "m8u1",
        numero: 1,
        titulo: "Advérbios de modo",
        cor: "42 85% 50%",
        seccoes: mk("m8u1", ["Advérbios de modo", "Como fazer", "Conversação"]),
      },
      {
        id: "m8u2",
        numero: 2,
        titulo: "Advérbios de lugar",
        cor: "210 75% 50%",
        seccoes: mk("m8u2", ["Pi = onde", "Kupi = aonde", "Frases interrogativas"]),
      },
      {
        id: "m8u3",
        numero: 3,
        titulo: "Quantidade e tempo",
        cor: "150 55% 40%",
        seccoes: mk("m8u3", ["Advérbios de quantidade", "Advérbios de tempo", "Conversação"]),
      },
      {
        id: "m8u4",
        numero: 4,
        titulo: "Dúvida e negação",
        cor: "5 84% 45%",
        seccoes: mk("m8u4", ["Advérbios de dúvida", "Advérbios de negação", "Praticar"]),
      },
    ],
  },
  {
    id: "m9",
    numero: 9,
    titulo: "Conjunções e frases",
    cor: "178 65% 40%",
    corEscura: "178 65% 30%",
    unidades: [
      {
        id: "m9u1",
        numero: 1,
        titulo: "Copulativas e disjuntivas",
        cor: "178 60% 42%",
        seccoes: mk("m9u1", ["Conjunções copulativas", "Conjunções disjuntivas", "Conversação"]),
      },
      {
        id: "m9u2",
        numero: 2,
        titulo: "Adversativas e conclusivas",
        cor: "265 55% 52%",
        seccoes: mk("m9u2", ["Conjunções adversativas", "Conjunções conclusivas", "Conversação"]),
      },
      {
        id: "m9u3",
        numero: 3,
        titulo: "Condicionais e causais",
        cor: "25 85% 52%",
        seccoes: mk("m9u3", ["Conjunções condicionais", "Conjunções causais", "Conversação"]),
      },
      {
        id: "m9u4",
        numero: 4,
        titulo: "Temporais, concessivas, comparativas",
        cor: "150 55% 40%",
        seccoes: mk("m9u4", ["Temporais", "Concessivas", "Comparativas", "Praticar"]),
      },
    ],
  },
  {
    id: "m10",
    numero: 10,
    titulo: "Vida quotidiana",
    cor: "15 85% 55%",
    corEscura: "15 85% 42%",
    unidades: [
      {
        id: "m10u1",
        numero: 1,
        titulo: "Em casa",
        cor: "15 85% 55%",
        seccoes: mk("m10u1", ["Compartimentos da casa", "Mobília", "Conversação"]),
      },
      {
        id: "m10u2",
        numero: 2,
        titulo: "Loiça e utensílios",
        cor: "42 85% 50%",
        seccoes: mk("m10u2", ["Loiça", "Utensílios da cozinha", "Praticar"]),
      },
      {
        id: "m10u3",
        numero: 3,
        titulo: "Vestuário",
        cor: "330 60% 55%",
        seccoes: mk("m10u3", ["Roupa do dia-a-dia", "Roupa tradicional", "Conversação"]),
      },
      {
        id: "m10u4",
        numero: 4,
        titulo: "Alimentação",
        cor: "150 55% 40%",
        seccoes: mk("m10u4", ["Comidas típicas", "Bebidas", "À mesa"]),
      },
    ],
  },
  {
    id: "m11",
    numero: 11,
    titulo: "Trabalho e campo",
    cor: "90 45% 38%",
    corEscura: "90 45% 28%",
    unidades: [
      {
        id: "m11u1",
        numero: 1,
        titulo: "Vocabulário agrícola",
        cor: "90 50% 40%",
        seccoes: mk("m11u1", ["Cultivos", "Ferramentas", "Conversação no campo"]),
      },
      {
        id: "m11u2",
        numero: 2,
        titulo: "Profissões",
        cor: "210 75% 50%",
        seccoes: mk("m11u2", ["Profissões da aldeia", "Profissões da cidade", "Praticar"]),
      },
      {
        id: "m11u3",
        numero: 3,
        titulo: "Animais (expansão)",
        cor: "28 55% 45%",
        seccoes: mk("m11u3", ["Animais do gado", "Animais selvagens", "Conversação"]),
      },
      {
        id: "m11u4",
        numero: 4,
        titulo: "Aves (expansão)",
        cor: "178 60% 42%",
        seccoes: mk("m11u4", ["Aves do quintal", "Aves selvagens", "Praticar"]),
      },
    ],
  },
  {
    id: "m12",
    numero: 12,
    titulo: "Verbos e tempos",
    cor: "345 65% 42%",
    corEscura: "345 65% 30%",
    unidades: [
      {
        id: "m12u1",
        numero: 1,
        titulo: "Presente do indicativo",
        cor: "345 60% 48%",
        seccoes: mk("m12u1", ["Formação dos tempos verbais", "Presente do indicativo", "Conversação"]),
      },
      {
        id: "m12u2",
        numero: 2,
        titulo: "Pretéritos do indicativo",
        cor: "25 85% 50%",
        seccoes: mk("m12u2", ["Pretérito perfeito", "Pretérito imperfeito", "Praticar"]),
      },
      {
        id: "m12u3",
        numero: 3,
        titulo: "Futuro e condicional",
        cor: "210 75% 50%",
        seccoes: mk("m12u3", ["Futuro do indicativo", "Modo condicional", "Conversação"]),
      },
      {
        id: "m12u4",
        numero: 4,
        titulo: "Modo conjuntivo",
        cor: "265 55% 52%",
        seccoes: mk("m12u4", ["Presente do conjuntivo", "Pretérito imperfeito do conjuntivo", "Futuro do conjuntivo", "Praticar"]),
      },
    ],
  },
];

/** Lookups */
export function getUnidade(unidadeId: string): { modulo: Modulo; unidade: Unidade } | null {
  for (const m of CURRICULO) {
    const u = m.unidades.find((x) => x.id === unidadeId);
    if (u) return { modulo: m, unidade: u };
  }
  return null;
}

export function getSeccao(seccaoId: string): {
  modulo: Modulo;
  unidade: Unidade;
  seccao: Seccao;
} | null {
  for (const m of CURRICULO) {
    for (const u of m.unidades) {
      const s = u.seccoes.find((x) => x.id === seccaoId);
      if (s) return { modulo: m, unidade: u, seccao: s };
    }
  }
  return null;
}

/** Retorna a próxima unidade na sequência (ou null se já é a última) */
export function getProximaUnidade(unidadeId: string): { modulo: Modulo; unidade: Unidade } | null {
  const flat: { modulo: Modulo; unidade: Unidade }[] = [];
  CURRICULO.forEach((m) => m.unidades.forEach((u) => flat.push({ modulo: m, unidade: u })));
  const idx = flat.findIndex((x) => x.unidade.id === unidadeId);
  if (idx === -1 || idx + 1 >= flat.length) return null;
  return flat[idx + 1];
}

/** Primeira unidade do currículo */
export const PRIMEIRA_UNIDADE = CURRICULO[0].unidades[0];