/**
 * Catálogo de missões diárias, semanais e especiais.
 * Estrutura preparada para migrar para Supabase sem alterar a UI.
 */
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Headphones,
  Languages,
  Flame,
  Trophy,
  Clock,
  ScrollText,
  Sparkles,
  Star,
  Calendar,
} from "lucide-react";

export type AcaoTipo =
  | "licao_completa"
  | "audio_ouvido"
  | "palavra_traduzida"
  | "resposta_correta_seguida"
  | "minuto_pratica"
  | "historia_concluida";

export type Raridade = "comum" | "raro" | "lendario";

export interface Recompensa {
  xp: number;
  kindeles: number;
  bau?: Raridade;
}

export interface MissaoDef {
  id: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  cor: string; // hsl token
  acao: AcaoTipo;
  meta: number;
  recompensa: Recompensa;
  tipo: "diaria" | "semanal" | "especial";
  banner?: string; // somente especiais
  prazo?: string; // somente especiais (texto livre)
}

export const MISSOES_DIARIAS: MissaoDef[] = [
  {
    id: "d-licao",
    titulo: "Completar 1 lição",
    descricao: "Conclua qualquer lição hoje.",
    icone: BookOpen,
    cor: "var(--kwendi-green)",
    acao: "licao_completa",
    meta: 1,
    recompensa: { xp: 20, kindeles: 10 },
    tipo: "diaria",
  },
  {
    id: "d-audio",
    titulo: "Ouvir 3 áudios",
    descricao: "Pratique a escuta em Umbundu.",
    icone: Headphones,
    cor: "var(--kwendi-blue)",
    acao: "audio_ouvido",
    meta: 3,
    recompensa: { xp: 15, kindeles: 8 },
    tipo: "diaria",
  },
  {
    id: "d-traduzir",
    titulo: "Traduzir 10 palavras",
    descricao: "Acerte traduções de palavras novas.",
    icone: Languages,
    cor: "var(--kwendi-purple)",
    acao: "palavra_traduzida",
    meta: 10,
    recompensa: { xp: 25, kindeles: 12 },
    tipo: "diaria",
  },
  {
    id: "d-streak",
    titulo: "5 respostas seguidas",
    descricao: "Acerte 5 respostas sem errar.",
    icone: Flame,
    cor: "var(--kwendi-red)",
    acao: "resposta_correta_seguida",
    meta: 5,
    recompensa: { xp: 30, kindeles: 15, bau: "comum" },
    tipo: "diaria",
  },
];

export const MISSOES_SEMANAIS: MissaoDef[] = [
  {
    id: "s-licoes",
    titulo: "Complete 7 lições",
    descricao: "Uma lição por dia mantém o ritmo.",
    icone: Trophy,
    cor: "var(--kwendi-yellow)",
    acao: "licao_completa",
    meta: 7,
    recompensa: { xp: 150, kindeles: 80, bau: "raro" },
    tipo: "semanal",
  },
  {
    id: "s-pratica",
    titulo: "30 min de prática",
    descricao: "Acumule meia hora estudando esta semana.",
    icone: Clock,
    cor: "var(--kwendi-peach)",
    acao: "minuto_pratica",
    meta: 30,
    recompensa: { xp: 100, kindeles: 50, bau: "raro" },
    tipo: "semanal",
  },
  {
    id: "s-historia",
    titulo: "Concluir 1 história",
    descricao: "Leia uma história cultural até o fim.",
    icone: ScrollText,
    cor: "var(--kwendi-brown)",
    acao: "historia_concluida",
    meta: 1,
    recompensa: { xp: 120, kindeles: 60, bau: "raro" },
    tipo: "semanal",
  },
];

export const MISSOES_ESPECIAIS: MissaoDef[] = [
  {
    id: "e-cultura",
    titulo: "Mês da Cultura Umbundu",
    descricao: "Explore 15 curiosidades culturais.",
    icone: Sparkles,
    cor: "var(--kwendi-purple)",
    acao: "licao_completa",
    meta: 15,
    recompensa: { xp: 500, kindeles: 200, bau: "lendario" },
    tipo: "especial",
    prazo: "Termina em 30 dias",
  },
  {
    id: "e-independencia",
    titulo: "Rumo à Independência",
    descricao: "Complete 11 lições até o Dia da Independência (11/nov).",
    icone: Star,
    cor: "var(--kwendi-red)",
    acao: "licao_completa",
    meta: 11,
    recompensa: { xp: 350, kindeles: 150, bau: "lendario" },
    tipo: "especial",
    prazo: "Até 11 de Novembro",
  },
];

export const TODAS_MISSOES: MissaoDef[] = [
  ...MISSOES_DIARIAS,
  ...MISSOES_SEMANAIS,
  ...MISSOES_ESPECIAIS,
];

/** Próximo reset diário (meia-noite local). */
export function proximoResetDiario(): Date {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

/** Próximo reset semanal (domingo 23:59). */
export function proximoResetSemanal(): Date {
  const d = new Date();
  const dias = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + dias);
  d.setHours(23, 59, 0, 0);
  return d;
}

export function formatarTempoRestante(alvo: Date): string {
  const ms = alvo.getTime() - Date.now();
  if (ms <= 0) return "00h";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

export { Calendar };