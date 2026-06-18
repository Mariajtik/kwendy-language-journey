/**
 * historias.ts — Catálogo de histórias/contos angolanos.
 * Primeira história: "O Jacaré Bangão" (lenda de Caxito, província do Bengo).
 * Adaptação livre baseada em Rodrigues (Revista Ecos, 2017) e tradição oral.
 */
import bangaoAsset from "@/assets/bangao.jpg.asset.json";

export type Vocabulario = { umbundu: string; pt: string };
export type Capitulo = {
  id: string;
  titulo: string;
  paragrafos: string[];
  vocabulario?: Vocabulario[];
};
export type QuizPergunta = {
  pergunta: string;
  opcoes: string[];
  correta: number;
};
export type Historia = {
  id: string;
  titulo: string;
  subtitulo: string;
  regiao: string;
  epoca: string;
  duracaoMin: number;
  nivel: "Iniciante" | "Intermédio" | "Avançado";
  imagem: string;
  cor: string;
  corEscura: string;
  sinopse: string;
  desbloqueada: boolean;
  capitulos: Capitulo[];
  curiosidade: { titulo: string; texto: string; imagem?: string };
  quiz: QuizPergunta[];
  recompensa: { xp: number; diamantes: number };
  referencia?: string;
};

export const HISTORIAS: Historia[] = [
  {
    id: "jacare-bangao",
    titulo: "O Jacaré Bangão",
    subtitulo: "Uma lenda do rio Dande",
    regiao: "Caxito, Província do Bengo",
    epoca: "Século XIX — Angola colonial",
    duracaoMin: 7,
    nivel: "Iniciante",
    imagem: bangaoAsset.url,
    cor: "28 55% 42%",
    corEscura: "28 55% 28%",
    sinopse:
      "Diz-se que, há muito tempo, nas margens do rio Dande, vivia um jacaré chamado Sr. Ngandu. Cansado da crueldade de um chefe de posto colonial, decidiu ele próprio ir pagar o imposto — e dar uma lição que Caxito nunca mais esqueceu.",
    desbloqueada: true,
    capitulos: [
      {
        id: "c1",
        titulo: "As margens do Dande",
        paragrafos: [
          "Em Caxito, pequena cidade da província do Bengo, corre o rio Dande, sereno e antigo. Foi nas suas margens que, há mais de cem anos, viveu um jacaré enorme, de escamas escuras, conhecido por toda a gente como Sr. Ngandu.",
          "Diziam os mais velhos que ele era irascível, brigão, sempre zangado — até com a própria sombra. Mas Ngandu não era apenas um animal qualquer: era um crocodilo da mais alta linhagem do Dande, e por isso o respeitavam.",
        ],
        vocabulario: [
          { umbundu: "Ongandu", pt: "Jacaré, crocodilo" },
          { umbundu: "Olui", pt: "Rio" },
          { umbundu: "Imbo", pt: "Aldeia, terra" },
          { umbundu: "Ukulu", pt: "Ancião, mais velho" },
          { umbundu: "Otembo", pt: "Tempo, época" },
        ],
      },
      {
        id: "c2",
        titulo: "O Imposto Geral Mínimo",
        paragrafos: [
          "Naqueles tempos, as autoridades coloniais portuguesas obrigavam cada angolano a pagar o Imposto Geral Mínimo. Quem não pagasse era espancado, humilhado, levado à força para o trabalho contratado.",
          "Em Caxito, o Chefe de Posto era implacável. Feroz e desumano, batia nos mais velhos, atemorizava as mães, arrancava as últimas moedas das mãos das crianças. O povo sofria em silêncio, mas o rio escutava.",
        ],
        vocabulario: [
          { umbundu: "Olombongo", pt: "Dinheiro" },
          { umbundu: "Soma", pt: "Chefe, autoridade" },
          { umbundu: "Omanu", pt: "Pessoas, povo" },
          { umbundu: "Ohali", pt: "Sofrimento" },
        ],
      },
      {
        id: "c3",
        titulo: "A vingança do jacaré",
        paragrafos: [
          "Já tinha o Sr. Ngandu, em tempos idos, escapado por pouco de caçadores que queriam mandar a sua pele para o Putu, para se fazerem carteiras. Não esqueceu a humilhação.",
          "Numa certa manhã, quando o sol mal beijava o Dande, Ngandu saiu da água com uma moeda presa entre os dentes. Atravessou a estrada, subiu os degraus da Administração e bateu à porta do Chefe de Posto. Vinha — disse-se depois — pagar o seu imposto.",
        ],
        vocabulario: [
          { umbundu: "Okuenda", pt: "Caminhar, ir" },
          { umbundu: "Onjo", pt: "Casa" },
          { umbundu: "Ekumbi", pt: "Sol" },
        ],
      },
      {
        id: "c4",
        titulo: "A fuga do Sipaio",
        paragrafos: [
          "O Sipaio que guardava a porta deu um grito e fugiu de imediato. O Chefe de Posto, ao ver aquele jacaré enorme no seu gabinete, saltou pela janela e correu pelas ruas de Caxito, branco como a cal.",
          "Alertados pelo Sipaio, os populares juntaram-se à porta da Administração e a tudo assistiram, rindo-se às gargalhadas. Aquele dia, o medo trocou de lado.",
        ],
        vocabulario: [
          { umbundu: "Okuyuvuka", pt: "Fugir" },
          { umbundu: "Oyembu", pt: "Riso, alegria" },
          { umbundu: "Usumba", pt: "Medo" },
        ],
      },
      {
        id: "c5",
        titulo: "Lenda que virou estátua",
        paragrafos: [
          "A história do Sr. Ngandu correu de boca em boca, de avó para neto, de aldeia em aldeia. Tornou-se uma das lendas mais conhecidas de Angola — uma oratura de combate, que prenunciava a luta pela libertação do povo.",
          "Hoje, em Caxito, ergue-se uma estátua: um grande jacaré com uma moeda entre os dentes, sustentado por figuras do povo de braços erguidos. É o Jacaré Bangão, lembrando a todos que mesmo o mais fraco pode fazer o opressor fugir pela janela.",
        ],
        vocabulario: [
          { umbundu: "Esanju", pt: "Alegria, vitória" },
          { umbundu: "Ekanga", pt: "Liberdade" },
          { umbundu: "Ukulu wetu", pt: "A nossa tradição" },
        ],
      },
    ],
    curiosidade: {
      titulo: "A estátua do Jacaré Bangão",
      texto:
        "Na entrada da cidade de Caxito, província do Bengo, ergue-se uma estátua que homenageia esta lenda: um enorme jacaré de pedra, com uma moeda entre os dentes, sustentado por figuras do povo de braços levantados. É a única lenda angolana com monumento próprio numa cidade do país, sinal da importância que a tradição oral tem para a identidade do Bengo e de Angola.",
      imagem: bangaoAsset.url,
    },
    quiz: [
      {
        pergunta: "Em que rio vivia o Sr. Ngandu?",
        opcoes: ["Kwanza", "Dande", "Cunene", "Cuango"],
        correta: 1,
      },
      {
        pergunta: "O que foi o Sr. Ngandu fazer à Administração?",
        opcoes: [
          "Pedir um emprego",
          "Roubar comida",
          "Pagar o Imposto Geral Mínimo",
          "Visitar o Sipaio",
        ],
        correta: 2,
      },
      {
        pergunta: "Como reagiu o Chefe de Posto ao ver o jacaré?",
        opcoes: [
          "Cumprimentou-o",
          "Saltou pela janela e fugiu",
          "Chamou o exército",
          "Pediu desculpa ao povo",
        ],
        correta: 1,
      },
      {
        pergunta: "Em Umbundu, o que significa \"Ongandu\"?",
        opcoes: ["Rio", "Chefe", "Jacaré", "Dinheiro"],
        correta: 2,
      },
    ],
    recompensa: { xp: 80, diamantes: 20 },
    referencia:
      "Adaptado livremente de Sérgio de Carvalho Rodrigues, \"O Jacaré Bangão: uma lenda da oratura angolana\", Revista Ecos, vol. 23, n.º 02, 2017, e da tradição oral do Bengo.",
  },
  {
    id: "kianda",
    titulo: "A Kianda do Mar",
    subtitulo: "Mistérios da baía de Luanda",
    regiao: "Luanda",
    epoca: "Lenda atemporal",
    duracaoMin: 6,
    nivel: "Iniciante",
    imagem: "",
    cor: "200 70% 45%",
    corEscura: "200 70% 30%",
    sinopse: "Em breve — a sereia das águas angolanas chega à Kwendi.",
    desbloqueada: false,
    capitulos: [],
    curiosidade: { titulo: "", texto: "" },
    quiz: [],
    recompensa: { xp: 0, diamantes: 0 },
  },
  {
    id: "sumbi",
    titulo: "Sumbi, a tartaruga sábia",
    subtitulo: "Um conto de astúcia",
    regiao: "Planalto Central",
    epoca: "Tradição Ovimbundu",
    duracaoMin: 5,
    nivel: "Iniciante",
    imagem: "",
    cor: "90 45% 38%",
    corEscura: "90 45% 25%",
    sinopse: "Em breve — uma fábula sobre paciência e inteligência.",
    desbloqueada: false,
    capitulos: [],
    curiosidade: { titulo: "", texto: "" },
    quiz: [],
    recompensa: { xp: 0, diamantes: 0 },
  },
];

export const getHistoria = (id: string) => HISTORIAS.find((h) => h.id === id);