/**
 * Tabela de drops dos baús (mock). Cada baú devolve uma lista de itens.
 */
import type { Raridade } from "./missoes";

export type DropItem =
  | { tipo: "kindeles"; qtd: number }
  | { tipo: "xp"; qtd: number }
  | { tipo: "fragmento"; qtd: number }
  | { tipo: "cosmetico"; nome: string };

interface BauConfig {
  label: string;
  cor: string;
  drops: DropItem[];
}

export const BAUS: Record<Raridade, BauConfig> = {
  comum: {
    label: "Baú Comum",
    cor: "var(--kwendi-brown)",
    drops: [
      { tipo: "kindeles", qtd: 25 },
      { tipo: "xp", qtd: 30 },
    ],
  },
  raro: {
    label: "Baú Raro",
    cor: "var(--kwendi-gray)",
    drops: [
      { tipo: "kindeles", qtd: 80 },
      { tipo: "xp", qtd: 100 },
      { tipo: "fragmento", qtd: 1 },
    ],
  },
  lendario: {
    label: "Baú Lendário",
    cor: "var(--kwendi-yellow)",
    drops: [
      { tipo: "kindeles", qtd: 250 },
      { tipo: "xp", qtd: 400 },
      { tipo: "fragmento", qtd: 3 },
      { tipo: "cosmetico", nome: "Chapéu do Soba" },
    ],
  },
};

export function rotuloDrop(d: DropItem): string {
  switch (d.tipo) {
    case "kindeles":
      return `${d.qtd} Kindeles`;
    case "xp":
      return `${d.qtd} XP`;
    case "fragmento":
      return `${d.qtd} Fragmento${d.qtd > 1 ? "s" : ""} de Badge`;
    case "cosmetico":
      return d.nome;
  }
}

export function emojiDrop(d: DropItem): string {
  switch (d.tipo) {
    case "kindeles":
      return "🪙";
    case "xp":
      return "⭐";
    case "fragmento":
      return "🧩";
    case "cosmetico":
      return "🎩";
  }
}