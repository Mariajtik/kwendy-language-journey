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