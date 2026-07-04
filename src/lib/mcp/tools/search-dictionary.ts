import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DICIONARIO } from "@/data/dicionario";

export default defineTool({
  name: "search_dictionary",
  title: "Search Umbundu ⇄ Portuguese dictionary",
  description:
    "Search the Kwendi bilingual dictionary. Matches Portuguese or Umbundu terms (case-insensitive substring). Returns up to 25 entries.",
  inputSchema: {
    query: z.string().min(1).describe("Word or fragment to search for, in Portuguese or Umbundu."),
    categoria: z
      .enum([
        "saudacoes",
        "familia",
        "numeros",
        "tempo",
        "corpo",
        "natureza",
        "cultura",
        "verbos",
        "objetos",
      ])
      .optional()
      .describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, categoria }) => {
    const q = query.toLowerCase();
    const results = DICIONARIO.filter(
      (e) =>
        (!categoria || e.categoria === categoria) &&
        (e.pt.toLowerCase().includes(q) || e.umbundu.toLowerCase().includes(q)),
    ).slice(0, 25);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { results, count: results.length },
    };
  },
});