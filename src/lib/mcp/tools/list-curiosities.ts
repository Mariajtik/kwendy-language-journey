import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { curiosidades } from "@/data/curiosidades";

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
    const items = curiosidades
      .filter((c: any) => !categoria || c.categoria === categoria)
      .map((c: any) => ({
        categoria: c.categoria,
        titulo: c.titulo,
        subtitulo: c.subtitulo,
        resumo: c.resumo,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items, count: items.length },
    };
  },
});