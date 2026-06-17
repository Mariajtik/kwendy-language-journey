/**
 * Tabela de drops dos baús (mock). Cada baú devolve uma lista de itens.
 */
import type { Raridade } from "./missoes";
import bauComumFechado from "@/assets/missoes/bau-comum-fechado.png.asset.json";
import bauComumAberto from "@/assets/missoes/bau-comum-aberto.png.asset.json";
import bauRaroFechado from "@/assets/missoes/bau-raro-fechado.png.asset.json";
import bauRaroAberto from "@/assets/missoes/bau-raro-aberto.png.asset.json";
import bauLendarioFechado from "@/assets/missoes/bau-lendario-fechado.png.asset.json";
import bauLendarioAberto from "@/assets/missoes/bau-lendario-aberto.png.asset.json";

export type DropItem =
  | { tipo: "diamantes"; qtd: number }
  | { tipo: "xp"; qtd: number }
  | { tipo: "fragmento"; qtd: number }
  | { tipo: "cosmetico"; nome: string };

interface BauConfig {
  label: string;
  cor: string;
  imagemFechada: string;
  imagemAberta: string;
  drops: DropItem[];
}

export const BAUS: Record<Raridade, BauConfig> = {
  comum: {
    label: "Baú Comum",
    cor: "var(--kwendi-brown)",
    imagemFechada: bauComumFechado.url,
    imagemAberta: bauComumAberto.url,
    drops: [
      { tipo: "diamantes", qtd: 25 },
      { tipo: "xp", qtd: 30 },
    ],
  },
  raro: {
    label: "Baú Raro",
    cor: "var(--kwendi-gray)",
    imagemFechada: bauRaroFechado.url,
    imagemAberta: bauRaroAberto.url,
    drops: [
      { tipo: "diamantes", qtd: 80 },
      { tipo: "xp", qtd: 100 },
      { tipo: "fragmento", qtd: 1 },
    ],
  },
  lendario: {
    label: "Baú Lendário",
    cor: "var(--kwendi-yellow)",
    imagemFechada: bauLendarioFechado.url,
    imagemAberta: bauLendarioAberto.url,
    drops: [
      { tipo: "diamantes", qtd: 250 },
      { tipo: "xp", qtd: 400 },
      { tipo: "fragmento", qtd: 3 },
      { tipo: "cosmetico", nome: "Chapéu de Palha do Soba" },
    ],
  },
};

export function rotuloDrop(d: DropItem): string {
  switch (d.tipo) {
    case "diamantes":
      return `${d.qtd} Diamantes Negros`;
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
    case "diamantes":
      return "💎";
    case "xp":
      return "⭐";
    case "fragmento":
      return "🧩";
    case "cosmetico":
      return "👒";
  }
}