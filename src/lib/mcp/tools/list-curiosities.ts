import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Inline catalog (kept in sync with src/data/curiosidades.ts) so the Deno
// bundle for the MCP function does not pull in asset imports.
const CURIOSIDADES = [
  { categoria: "natureza", titulo: "O Imbondeiro", subtitulo: "A árvore que cresce ao contrário", resumo: "Símbolo de resistência e espiritualidade, o imbondeiro é uma das árvores mais emblemáticas de Angola." },
  { categoria: "historia", titulo: "Rainha Nzinga", subtitulo: "A guerreira que enfrentou impérios", resumo: "Uma das figuras mais poderosas da história africana e símbolo eterno da resistência angolana." },
  { categoria: "cultura", titulo: "O Pensador", subtitulo: "O símbolo da sabedoria angolana", resumo: "Uma das esculturas mais importantes da identidade cultural de Angola." },
  { categoria: "natureza", titulo: "Palanca Negra Gigante", subtitulo: "O símbolo vivo de Angola", resumo: "Um dos animais mais raros do mundo e orgulho nacional angolano." },
  { categoria: "natureza", titulo: "Welwitschia Mirabilis", subtitulo: "A planta que desafia o tempo", resumo: "Uma das plantas mais antigas e resistentes do planeta, nascida no deserto angolano." },
  { categoria: "gastronomia", titulo: "Mufete", subtitulo: "O sabor tradicional de Luanda", resumo: "Um dos pratos mais celebrados da culinária angolana, alma das mesas de sábado." },
  { categoria: "historia", titulo: "Agostinho Neto", subtitulo: "Manguxi Kilamba", resumo: "Poeta, líder revolucionário e primeiro presidente de Angola." },
  { categoria: "cultura", titulo: "Nontombi", subtitulo: "O penteado ancestral africano", resumo: "Uma tradição cultural dos povos Mwila e Mucubal que atravessa gerações." },
  { categoria: "linguas", titulo: "Umbundu", subtitulo: "A língua mais falada de Angola", resumo: "Uma língua bantu carregada de história, ancestralidade e identidade cultural." },
  { categoria: "monumentos", titulo: "Fenda da Tundavala", subtitulo: "O abismo natural da Huíla", resumo: "Uma das paisagens mais impressionantes de Angola." },
  { categoria: "natureza", titulo: "Floresta do Maiombe", subtitulo: "O pulmão verde de Cabinda", resumo: "Uma das florestas tropicais mais ricas em biodiversidade de África." },
  { categoria: "monumentos", titulo: "Quedas de Kalandula", subtitulo: "A força das águas angolanas", resumo: "Uma das maiores quedas de água de África em volume." },
  { categoria: "natureza", titulo: "Mussivi", subtitulo: "A jóia das florestas de Angola", resumo: "Madeira nobre e preciosa, nativa do Cuando Cubango e do Moxico, símbolo de riqueza natural e de responsabilidade." },
];

export default defineTool({
  name: "list_curiosities",
  title: "List Angolan culture curiosities",
  description:
    "List cultural curiosities from Kwendi (nature, history, culture, gastronomy, languages, monuments of Angola). Optionally filter by category.",
  inputSchema: {
    categoria: z
      .enum(["natureza", "historia", "cultura", "gastronomia", "linguas", "monumentos"])
      .optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ categoria }) => {
    const items = CURIOSIDADES.filter((c) => !categoria || c.categoria === categoria);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items, count: items.length },
    };
  },
});
