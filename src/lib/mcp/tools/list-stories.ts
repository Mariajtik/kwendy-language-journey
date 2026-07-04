import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Minimal inline catalog (kept in sync with src/data/historias.ts). Inline to
// avoid pulling asset imports into the Deno bundle for the MCP function.
const STORIES = [
  {
    id: "jacare-bangao",
    titulo: "O Jacaré Bangão",
    subtitulo: "Uma lenda do rio Dande",
    regiao: "Caxito, Província do Bengo",
    epoca: "Século XIX — Angola colonial",
    duracaoMin: 7,
    nivel: "Iniciante" as const,
  },
  {
    id: "kianda",
    titulo: "A Kianda do Mar",
    subtitulo: "Mistérios da baía de Luanda",
    regiao: "Luanda",
    epoca: "Lenda atemporal",
    duracaoMin: 6,
    nivel: "Iniciante" as const,
  },
  {
    id: "sumbi",
    titulo: "Sumbi, a tartaruga sábia",
    subtitulo: "Um conto de astúcia",
    regiao: "Planalto Central",
    epoca: "Tradição Ovimbundu",
    duracaoMin: 5,
    nivel: "Iniciante" as const,
  },
];

export default defineTool({
  name: "list_stories",
  title: "List Kwendi stories",
  description:
    "List Angolan cultural stories available in Kwendi with their region, era, level, and duration. Optionally filter by level.",
  inputSchema: {
    nivel: z.enum(["Iniciante", "Intermédio", "Avançado"]).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ nivel }) => {
    const items = STORIES.filter((h) => !nivel || h.nivel === nivel);
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items, count: items.length },
    };
  },
});
