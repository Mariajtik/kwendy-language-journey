/**
 * Catálogo de conquistas (badges culturais) — 18 itens iniciais.
 */
import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  BookOpen,
  Headphones,
  Heart,
  Languages,
  Library,
  Shield,
  Mic,
  Repeat,
  Compass,
  ScrollText,
  MapPin,
  Utensils,
  Leaf,
  Flame,
  CalendarDays,
  Crown,
  Sunrise,
} from "lucide-react";
import type { Recompensa } from "./missoes";

export type BadgeCor =
  | "vermelha" | "laranja" | "verde" | "rosa"
  | "roxa" | "azul" | "laranja-escuro" | "branca";

export type ConquistaCategoria =
  | "primeiros_passos"
  | "linguagem"
  | "cultural"
  | "consistencia";

export interface ConquistaDef {
  id: string;
  titulo: string;
  descricao: string;
  icone: LucideIcon;
  categoria: ConquistaCategoria;
  meta: number;
  recompensa: Recompensa;
  badge: BadgeCor;
}

export const CATEGORIA_INFO: Record<
  ConquistaCategoria,
  { label: string; cor: string; corBg: string }
> = {
  primeiros_passos: {
    label: "Primeiros passos",
    cor: "var(--kwendi-pink)",
    corBg: "var(--kwendi-pink)",
  },
  linguagem: {
    label: "Língua Umbundu",
    cor: "var(--kwendi-red)",
    corBg: "var(--kwendi-red)",
  },
  cultural: {
    label: "Explorador Cultural",
    cor: "var(--kwendi-peach)",
    corBg: "var(--kwendi-peach)",
  },
  consistencia: {
    label: "Consistência",
    cor: "var(--kwendi-blue)",
    corBg: "var(--kwendi-blue)",
  },
};

export const CONQUISTAS: ConquistaDef[] = [
  // Primeiros passos (4)
  { id: "c1",  titulo: "Primeira Palavra",      descricao: "Traduza sua primeira palavra em Umbundu.", icone: Sparkles,    categoria: "primeiros_passos", meta: 1,   recompensa: { xp: 20,  diamantes: 10 },                badge: "rosa" },
  { id: "c2",  titulo: "Primeira Lição",        descricao: "Complete a sua primeira lição.",            icone: BookOpen,    categoria: "primeiros_passos", meta: 1,   recompensa: { xp: 30,  diamantes: 15 },                badge: "verde" },
  { id: "c3",  titulo: "Primeiro Áudio",        descricao: "Ouça o primeiro áudio em Umbundu.",         icone: Headphones,  categoria: "primeiros_passos", meta: 1,   recompensa: { xp: 20,  diamantes: 10 },                badge: "azul" },
  { id: "c4",  titulo: "Bem-vindo, Kwendi",     descricao: "Conclua o onboarding inicial.",             icone: Heart,       categoria: "primeiros_passos", meta: 1,   recompensa: { xp: 50,  diamantes: 25, bau: "comum" }, badge: "branca" },

  // Linguagem (5)
  { id: "c5",  titulo: "Aprendiz",              descricao: "Aprenda 50 palavras em Umbundu.",            icone: Languages,   categoria: "linguagem", meta: 50,  recompensa: { xp: 100, diamantes: 50 },                       badge: "vermelha" },
  { id: "c6",  titulo: "Vocabulista",           descricao: "Aprenda 200 palavras.",                      icone: Library,     categoria: "linguagem", meta: 200, recompensa: { xp: 250, diamantes: 120, bau: "raro" },        badge: "laranja" },
  { id: "c7",  titulo: "Guardião do Umbundu",   descricao: "Aprenda 500 palavras.",                      icone: Shield,      categoria: "linguagem", meta: 500, recompensa: { xp: 600, diamantes: 300, bau: "lendario" },    badge: "vermelha" },
  { id: "c8",  titulo: "Mestre da Pronúncia",   descricao: "100 áudios praticados corretamente.",        icone: Mic,         categoria: "linguagem", meta: 100, recompensa: { xp: 200, diamantes: 100, bau: "raro" },        badge: "roxa" },
  { id: "c9",  titulo: "Tradutor",              descricao: "300 traduções corretas.",                    icone: Repeat,      categoria: "linguagem", meta: 300, recompensa: { xp: 200, diamantes: 100 },                      badge: "laranja-escuro" },

  // Cultural (5)
  { id: "c10", titulo: "Explorador Cultural",   descricao: "Leia 10 curiosidades.",                       icone: Compass,    categoria: "cultural",  meta: 10,  recompensa: { xp: 120, diamantes: 60 },                       badge: "laranja" },
  { id: "c11", titulo: "Contador de Histórias", descricao: "Conclua 5 histórias.",                        icone: ScrollText, categoria: "cultural",  meta: 5,   recompensa: { xp: 200, diamantes: 100, bau: "raro" },         badge: "verde" },
  { id: "c12", titulo: "Conhecedor de Angola",  descricao: "Explore 18 províncias.",                      icone: MapPin,     categoria: "cultural",  meta: 18,  recompensa: { xp: 300, diamantes: 150, bau: "lendario" },     badge: "azul" },
  { id: "c13", titulo: "Provador",              descricao: "Descubra 8 pratos típicos.",                  icone: Utensils,   categoria: "cultural",  meta: 8,   recompensa: { xp: 120, diamantes: 60 },                       badge: "roxa" },
  { id: "c14", titulo: "Naturalista",           descricao: "Conheça 12 elementos da fauna e flora.",      icone: Leaf,       categoria: "cultural",  meta: 12,  recompensa: { xp: 150, diamantes: 75 },                       badge: "laranja-escuro" },

  // Consistência (4)
  { id: "c15", titulo: "Fagulha",               descricao: "Mantenha 7 dias de ofensiva.",                icone: Flame,        categoria: "consistencia", meta: 7,   recompensa: { xp: 100,  diamantes: 50 },                   badge: "vermelha" },
  { id: "c16", titulo: "Chama Viva",            descricao: "30 dias seguidos de prática.",                 icone: CalendarDays, categoria: "consistencia", meta: 30,  recompensa: { xp: 300,  diamantes: 150, bau: "raro" },    badge: "laranja" },
  { id: "c17", titulo: "Centenário",            descricao: "100 dias de ofensiva.",                        icone: Crown,        categoria: "consistencia", meta: 100, recompensa: { xp: 1000, diamantes: 500, bau: "lendario" },badge: "laranja-escuro" },
  { id: "c18", titulo: "Madrugador",            descricao: "Faça uma lição antes das 8h.",                 icone: Sunrise,      categoria: "consistencia", meta: 1,   recompensa: { xp: 80,   diamantes: 40 },                    badge: "azul" },
];

export const CONQUISTAS_POR_CATEGORIA: Record<ConquistaCategoria, ConquistaDef[]> = {
  primeiros_passos: CONQUISTAS.filter((c) => c.categoria === "primeiros_passos"),
  linguagem: CONQUISTAS.filter((c) => c.categoria === "linguagem"),
  cultural: CONQUISTAS.filter((c) => c.categoria === "cultural"),
  consistencia: CONQUISTAS.filter((c) => c.categoria === "consistencia"),
};