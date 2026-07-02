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
    corEscura: "0 100% 50%",
    unidades: [
      {
        id: "m1u1",
        numero: 1,
        titulo: "Identificação pessoal",
        cor: "5 84% 42%",
        seccoes: mk("m1u1", [
          "Como te chamas?",
          "Eu sou…",
          "Como estás?",
          "Passei bem, passei mal",
          "Como passaste o dia?",
          "Reencontro depois de tempo",
          "Diálogo: Kwendi e Otchali",
          "Conversação I — Ohango I",
          "Conversação II — Ohango II",
        ]),
      },
      {
        id: "m1u2",
        numero: 2,
        titulo: "De manhã",
        cor: "25 90% 55%",
        seccoes: mk("m1u2", [
          "O sol nasce",
          "Já amanheceu!",
          "Como passaste a noite?",
          "Onde vamos? À escola",
          "Temos fome, não temos comida",
          "Buscar água na fonte",
          "Diálogo: Yellen e Hossy",
          "Família em casa",
        ]),
      },
      {
        id: "m1u3",
        numero: 3,
        titulo: "Na rua",
        cor: "35 90% 50%",
        seccoes: mk("m1u3", [
          "Pi enda? — Onde vais?",
          "Vou à escola",
          "Onde estudas?",
          "Escola Ngola Kanini",
          "Quantos professores tens?",
          "Quantos anos tens?",
          "Diálogo: Kwendi e Otchali",
          "Meses do ano",
          "Onde nasceste?",
        ]),
      },
      {
        id: "m1u4",
        numero: 4,
        titulo: "No mercado",
        cor: "200 75% 45%",
        seccoes: mk("m1u4", [
          "Ciñgami? — Quanto é?",
          "Vinte kwanzas",
          "É caro!",
          "Quanto é o fuba?",
          "Comprar batata-doce",
          "Não compro mais",
          "Diálogo: Yellen e Hossy",
          "Comida no mercado",
          "Bebida e cozinha",
        ]),
      },
      {
        id: "m1u5",
        numero: 5,
        titulo: "Palavras Novas + revisão",
        cor: "330 75% 55%",
        seccoes: mk("m1u5", [
          "Pi (onde) — advérbio antes do verbo",
          "Kupi (aonde) — advérbio depois do verbo",
          "Twenda kupi? — Aonde vamos?",
          "Ndikakala kupi — aonde estarei",
          "Vocabulário do dia-a-dia",
          "Revisão do módulo",
          "Casa e família alargada",
          "Corpo humano",
          "Cidade e natureza",
        ]),
      },
    ],
  },
  {
    id: "m3",
    numero: 2,
    titulo: "Eu e tu",
    cor: "265 60% 52%",
    corEscura: "265 60% 38%",
    unidades: [
      {
        id: "m3u1",
        numero: 1,
        titulo: "Pronomes pessoais singulares",
        cor: "5 84% 42%",
        seccoes: mk("m3u1", ["Ame · eu", "Ove · tu", "Eye · ele/ela"]),
      },
      {
        id: "m3u2",
        numero: 2,
        titulo: "Pronomes pessoais plurais",
        cor: "25 90% 55%",
        seccoes: mk("m3u2", ["Etu · nós", "Ene · vós", "Ovo · eles/elas"]),
      },
      {
        id: "m3u3",
        numero: 3,
        titulo: "Formas dos pronomes",
        cor: "330 75% 55%",
        seccoes: mk("m3u3", ["Formas curtas", "Formas longas", "Quando usar cada uma"]),
      },
      {
        id: "m3u4",
        numero: 4,
        titulo: "Conversação I, II e III",
        cor: "265 60% 55%",
        seccoes: mk("m3u4", ["Apresentar-se", "Nacionalidade e origem", "Diálogos com pronomes"]),
      },
    ],
  },
  {
    id: "m4",
    numero: 3,
    titulo: "Introduza a tua família",
    cor: "330 75% 52%",
    corEscura: "330 75% 38%",
    unidades: [
      {
        id: "m4u1",
        numero: 1,
        titulo: "Família básica",
        cor: "200 75% 45%",
        seccoes: mk("m4u1", ["Pai e mãe", "Irmãos", "Filhos"]),
      },
      {
        id: "m4u2",
        numero: 2,
        titulo: "Família alargada",
        cor: "265 60% 55%",
        seccoes: mk("m4u2", ["Avós", "Tios e primos", "Sogros e cunhados"]),
      },
      {
        id: "m4u3",
        numero: 3,
        titulo: "Amizades e vizinhança",
        cor: "150 60% 40%",
        seccoes: mk("m4u3", ["O meu amigo", "Vizinhos", "Comunidade"]),
      },
      {
        id: "m4u4",
        numero: 4,
        titulo: "Prática",
        cor: "25 90% 55%",
        seccoes: mk("m4u4", ["Descrever a família", "Possessivos básicos", "Diálogo familiar"]),
      },
    ],
  },
  {
    id: "m5",
    numero: 4,
    titulo: "Ações e rotina",
    cor: "25 90% 52%",
    corEscura: "25 90% 38%",
    unidades: [
      {
        id: "m5u1",
        numero: 1,
        titulo: "Presente do indicativo",
        cor: "330 75% 55%",
        seccoes: mk("m5u1", ["Verbos no presente", "Rotina diária", "Praticar"]),
      },
      {
        id: "m5u2",
        numero: 2,
        titulo: "Pretérito perfeito e imperfeito",
        cor: "5 84% 42%",
        seccoes: mk("m5u2", ["Pretérito perfeito", "Pretérito imperfeito", "Falar do passado"]),
      },
      {
        id: "m5u3",
        numero: 3,
        titulo: "Futuro imperfeito e condicional",
        cor: "200 75% 45%",
        seccoes: mk("m5u3", ["Futuro imperfeito", "Modo condicional", "Planos e hipóteses"]),
      },
      {
        id: "m5u4",
        numero: 4,
        titulo: "Modo conjuntivo",
        cor: "150 60% 40%",
        seccoes: mk("m5u4", ["Presente do conjuntivo", "P.I. do conjuntivo", "F.I. do conjuntivo"]),
      },
      {
        id: "m5u5",
        numero: 5,
        titulo: "Perguntar com verbos",
        cor: "265 60% 55%",
        seccoes: mk("m5u5", ["O que fazes?", "Onde vais?", "Quando voltas?"]),
      },
    ],
  },
  {
    id: "m6",
    numero: 5,
    titulo: "Explora a natureza",
    cor: "140 55% 38%",
    corEscura: "140 55% 26%",
    unidades: [
      {
        id: "m6u1",
        numero: 1,
        titulo: "Animais da casa",
        cor: "5 84% 42%",
        seccoes: mk("m6u1", ["Animais domésticos", "Sons dos animais", "Frases simples"]),
      },
      {
        id: "m6u2",
        numero: 2,
        titulo: "Animais selvagens",
        cor: "25 90% 55%",
        seccoes: mk("m6u2", ["Mamíferos da savana", "Répteis e insectos", "Praticar"]),
      },
      {
        id: "m6u3",
        numero: 3,
        titulo: "Aves",
        cor: "200 75% 45%",
        seccoes: mk("m6u3", ["Aves comuns", "Aves do campo", "Conversação"]),
      },
      {
        id: "m6u4",
        numero: 4,
        titulo: "Plantas e agricultura",
        cor: "150 60% 40%",
        seccoes: mk("m6u4", ["Plantas e árvores", "Cultivos", "Ferramentas do campo"]),
      },
    ],
  },
  {
    id: "m7",
    numero: 6,
    titulo: "Corpo humano e saúde",
    cor: "200 78% 46%",
    corEscura: "200 78% 32%",
    unidades: [
      {
        id: "m7u1",
        numero: 1,
        titulo: "Rosto e cabeça",
        cor: "210 75% 50%",
        seccoes: mk("m7u1", ["Olhos, nariz, boca", "Cabelo e orelhas", "Praticar"]),
      },
      {
        id: "m7u2",
        numero: 2,
        titulo: "Tronco e membros",
        cor: "265 60% 55%",
        seccoes: mk("m7u2", ["Braços e mãos", "Pernas e pés", "Frases do corpo"]),
      },
      {
        id: "m7u3",
        numero: 3,
        titulo: "No médico",
        cor: "178 60% 42%",
        seccoes: mk("m7u3", ["Dói-me…", "Sintomas comuns", "Pedir ajuda"]),
      },
      {
        id: "m7u4",
        numero: 4,
        titulo: "Hábitos saudáveis",
        cor: "25 90% 55%",
        seccoes: mk("m7u4", ["Comer e beber bem", "Dormir e descansar", "Conversação"]),
      },
    ],
  },
  {
    id: "m8",
    numero: 7,
    titulo: "Tempo e calendário",
    cor: "42 95% 50%",
    corEscura: "42 95% 36%",
    unidades: [
      {
        id: "m8u1",
        numero: 1,
        titulo: "Dias da semana",
        cor: "42 85% 50%",
        seccoes: mk("m8u1", ["Dias úteis", "Fim-de-semana", "Hoje, ontem, amanhã"]),
      },
      {
        id: "m8u2",
        numero: 2,
        titulo: "Meses do ano",
        cor: "210 75% 50%",
        seccoes: mk("m8u2", ["Janeiro a Junho", "Julho a Dezembro", "Datas do dia-a-dia"]),
      },
      {
        id: "m8u3",
        numero: 3,
        titulo: "Estações do ano",
        cor: "150 55% 40%",
        seccoes: mk("m8u3", ["Cacimbo (seca)", "Calor & chuvas", "Falar do tempo"]),
      },
      {
        id: "m8u4",
        numero: 4,
        titulo: "Horas e momentos",
        cor: "5 84% 45%",
        seccoes: mk("m8u4", ["Que horas são", "De manhã / à tarde / à noite", "Praticar"]),
      },
    ],
  },
  {
    id: "m9",
    numero: 8,
    titulo: "Em casa",
    cor: "18 70% 48%",
    corEscura: "18 70% 34%",
    unidades: [
      {
        id: "m9u1",
        numero: 1,
        titulo: "Compartimentos da casa",
        cor: "178 60% 42%",
        seccoes: mk("m9u1", ["Sala, quarto, cozinha", "Casa de banho e quintal", "Onde vivo"]),
      },
      {
        id: "m9u2",
        numero: 2,
        titulo: "Mobília",
        cor: "265 55% 52%",
        seccoes: mk("m9u2", ["Mesa, cadeira, cama", "Armários e prateleiras", "Descrever a casa"]),
      },
      {
        id: "m9u3",
        numero: 3,
        titulo: "Loiça e utensílios",
        cor: "25 85% 52%",
        seccoes: mk("m9u3", ["Loiça da mesa", "Utensílios da cozinha", "Praticar"]),
      },
      {
        id: "m9u4",
        numero: 4,
        titulo: "Vestuário",
        cor: "150 55% 40%",
        seccoes: mk("m9u4", ["Roupa do dia-a-dia", "Roupa tradicional", "Conversação"]),
      },
      {
        id: "m9u5",
        numero: 5,
        titulo: "Alimentação",
        cor: "5 84% 45%",
        seccoes: mk("m9u5", ["Comidas típicas", "Bebidas", "À mesa"]),
      },
    ],
  },
  {
    id: "m10",
    numero: 9,
    titulo: "Trabalho e comunidade",
    cor: "38 80% 45%",
    corEscura: "38 80% 32%",
    unidades: [
      {
        id: "m10u1",
        numero: 1,
        titulo: "Profissões da aldeia",
        cor: "15 85% 55%",
        seccoes: mk("m10u1", ["Lavrador e pastor", "Caçador e pescador", "Praticar"]),
      },
      {
        id: "m10u2",
        numero: 2,
        titulo: "Profissões da cidade",
        cor: "42 85% 50%",
        seccoes: mk("m10u2", ["Comerciante", "Professor e enfermeiro", "Conversação"]),
      },
      {
        id: "m10u3",
        numero: 3,
        titulo: "Comércio e mercado",
        cor: "330 60% 55%",
        seccoes: mk("m10u3", ["Vender e comprar", "Negociar o preço", "Diálogo de mercado"]),
      },
      {
        id: "m10u4",
        numero: 4,
        titulo: "Vida na comunidade",
        cor: "150 55% 40%",
        seccoes: mk("m10u4", ["Festas e celebrações", "Ajudar o próximo", "Conversação"]),
      },
    ],
  },
  {
    id: "m11",
    numero: 10,
    titulo: "Advérbios e ligações",
    cor: "230 55% 50%",
    corEscura: "230 55% 36%",
    unidades: [
      {
        id: "m11u1",
        numero: 1,
        titulo: "Advérbios de modo e lugar",
        cor: "5 84% 42%",
        seccoes: mk("m11u1", ["Advérbios de modo", "Advérbios de lugar (Pi, Kupi)", "Conversação"]),
      },
      {
        id: "m11u2",
        numero: 2,
        titulo: "Tempo, quantidade, dúvida e negação",
        cor: "200 75% 45%",
        seccoes: mk("m11u2", ["Advérbios de tempo", "Advérbios de quantidade", "Dúvida e negação"]),
      },
      {
        id: "m11u3",
        numero: 3,
        titulo: "Conjunções coordenativas",
        cor: "150 60% 40%",
        seccoes: mk("m11u3", ["Copulativas e disjuntivas", "Adversativas e conclusivas", "Coordenativas — prática"]),
      },
      {
        id: "m11u4",
        numero: 4,
        titulo: "Conjunções subordinativas",
        cor: "210 75% 50%",
        seccoes: mk("m11u4", ["Causais e condicionais", "Temporais e concessivas", "Comparativas e finais"]),
      },
    ],
  },
  {
    id: "m12",
    numero: 11,
    titulo: "Pronomes avançados e verbos",
    cor: "300 55% 45%",
    corEscura: "300 55% 32%",
    unidades: [
      {
        id: "m12u1",
        numero: 1,
        titulo: "Possessivos",
        cor: "345 60% 48%",
        seccoes: mk("m12u1", ["Meu, teu, seu", "Nosso e vosso", "Conversação"]),
      },
      {
        id: "m12u2",
        numero: 2,
        titulo: "Demonstrativos",
        cor: "25 85% 50%",
        seccoes: mk("m12u2", ["Este, esse, aquele", "Perto e longe", "Praticar"]),
      },
      {
        id: "m12u3",
        numero: 3,
        titulo: "Interrogativos e indefinidos",
        cor: "210 75% 50%",
        seccoes: mk("m12u3", ["Pronomes interrogativos", "Pronomes indefinidos", "Conversação"]),
      },
      {
        id: "m12u4",
        numero: 4,
        titulo: "Formação dos tempos verbais",
        cor: "265 55% 52%",
        seccoes: mk("m12u4", ["Radical e terminações", "Quadro-resumo", "Revisão dos modos"]),
      },
    ],
  },
  {
    id: "m13",
    numero: 12,
    titulo: "Provérbios e sabedoria Ovimbundu",
    cor: "28 70% 38%",
    corEscura: "28 70% 26%",
    unidades: [
      {
        id: "m13u1",
        numero: 1,
        titulo: "Provérbios do dia-a-dia",
        cor: "28 55% 50%",
        seccoes: mk("m13u1", ["Provérbios sobre família", "Provérbios sobre trabalho", "Provérbios sobre natureza"]),
      },
      {
        id: "m13u2",
        numero: 2,
        titulo: "Interpretar provérbios",
        cor: "25 90% 55%",
        seccoes: mk("m13u2", ["Sentido literal e figurado", "Quando usar", "Praticar"]),
      },
      {
        id: "m13u3",
        numero: 3,
        titulo: "Usar no diálogo",
        cor: "150 60% 40%",
        seccoes: mk("m13u3", ["Provérbios em conversação", "Histórias curtas", "Fechamento"]),
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