/**
 * loja.ts — Catálogo da Loja Kwendi.
 * Itens divididos em 3 categorias: power-ups, baus, cultura.
 * Preços em diamantes. precoReal reservado para futura integração com Stripe/Paddle.
 */
import bauComum from "@/assets/missoes/bau-comum.png.asset.json";
import bauRaro from "@/assets/missoes/bau-raro.png.asset.json";
import bauLendario from "@/assets/missoes/bau-lendario.png.asset.json";

export type CategoriaLoja = "powerup" | "bau" | "cultura";

export type PowerUpId =
  | "manter-chama"
  | "dobrador-xp"
  | "dica-extra"
  | "vida-extra";

export type BauId = "bau-comum" | "bau-raro" | "bau-lendario" | "pacote-fragmentos";

export type CulturaId =
  | "desbloqueio-kianda"
  | "desbloqueio-sumbi"
  | "musicas-tradicionais"
  | "curiosidades-extra";

export type ItemId = PowerUpId | BauId | CulturaId;

export interface ItemLoja {
  id: ItemId;
  categoria: CategoriaLoja;
  nome: string;
  descricao: string;
  preco: number;
  precoReal?: number;
  emoji?: string;
  imagem?: string;
  cor: string;
  duracaoMin?: number;
  payload?: Record<string, unknown>;
}

export const ITENS_LOJA: ItemLoja[] = [
  // ----- POWER-UPS -----
  {
    id: "manter-chama",
    categoria: "powerup",
    nome: "Manter Chama",
    descricao: "Protege a tua ofensiva por um dia sem prática.",
    preco: 80,
    emoji: "🔥",
    cor: "25 90% 55%",
  },
  {
    id: "dobrador-xp",
    categoria: "powerup",
    nome: "Dobrador de XP",
    descricao: "Ganha o dobro de XP durante 15 minutos.",
    preco: 120,
    emoji: "⚡",
    cor: "45 95% 55%",
    duracaoMin: 15,
  },
  {
    id: "dica-extra",
    categoria: "powerup",
    nome: "Dica Extra",
    descricao: "Uma dica adicional para usar numa lição difícil.",
    preco: 25,
    emoji: "💡",
    cor: "50 95% 60%",
  },
  {
    id: "vida-extra",
    categoria: "powerup",
    nome: "Coração Extra",
    descricao: "Recupera uma vida imediatamente.",
    preco: 50,
    emoji: "❤️",
    cor: "5 84% 55%",
  },

  // ----- BAÚS -----
  {
    id: "bau-comum",
    categoria: "bau",
    nome: "Baú Comum",
    descricao: "Recompensas básicas de XP e diamantes.",
    preco: 100,
    imagem: bauComum.url,
    cor: "270 50% 60%",
  },
  {
    id: "bau-raro",
    categoria: "bau",
    nome: "Baú Raro",
    descricao: "Boas recompensas e fragmentos extra.",
    preco: 350,
    imagem: bauRaro.url,
    cor: "270 60% 50%",
  },
  {
    id: "bau-lendario",
    categoria: "bau",
    nome: "Baú Lendário",
    descricao: "As maiores recompensas da Kwendi.",
    preco: 900,
    imagem: bauLendario.url,
    cor: "270 70% 40%",
  },
  {
    id: "pacote-fragmentos",
    categoria: "bau",
    nome: "Pacote de 10 Fragmentos",
    descricao: "Junta fragmentos para abrir baús especiais.",
    preco: 180,
    emoji: "🧩",
    cor: "290 50% 55%",
  },

  // ----- CULTURA PREMIUM -----
  {
    id: "desbloqueio-kianda",
    categoria: "cultura",
    nome: "História: A Kianda do Mar",
    descricao: "Desbloqueia a lenda da sereia de Luanda.",
    preco: 1500,
    emoji: "🌊",
    cor: "200 75% 45%",
    payload: { historiaId: "kianda" },
  },
  {
    id: "desbloqueio-sumbi",
    categoria: "cultura",
    nome: "História: Sumbi, a tartaruga sábia",
    descricao: "Desbloqueia uma fábula Ovimbundu.",
    preco: 1200,
    emoji: "🐢",
    cor: "90 50% 38%",
    payload: { historiaId: "sumbi" },
  },
  {
    id: "musicas-tradicionais",
    categoria: "cultura",
    nome: "Pack de Músicas",
    descricao: "Trilha sonora extra em Para Além de Fronteiras (+2).",
    preco: 5000,
    emoji: "🥁",
    cor: "30 75% 45%",
  },
  {
    id: "curiosidades-extra",
    categoria: "cultura",
    nome: "Mais Curiosidades",
    descricao: "Desbloqueia 3 curiosidades adicionais sobre Angola.",
    preco: 950,
    emoji: "✨",
    cor: "340 70% 50%",
    payload: { quantidade: 3 },
  },
];

export const CATEGORIAS: { id: CategoriaLoja; nome: string; cor: string }[] = [
  { id: "powerup", nome: "Power-ups", cor: "25 90% 55%" },
  { id: "bau", nome: "Baús", cor: "270 60% 50%" },
  { id: "cultura", nome: "Cultura", cor: "5 84% 42%" },
];

export const getItem = (id: ItemId) => ITENS_LOJA.find((i) => i.id === id);