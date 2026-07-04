import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { HISTORIAS } from "../../../data/historias";

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
    const items = HISTORIAS.filter((h) => !nivel || h.nivel === nivel).map((h) => ({
      id: h.id,
      titulo: h.titulo,
      subtitulo: h.subtitulo,
      regiao: h.regiao,
      epoca: h.epoca,
      nivel: h.nivel,
      duracaoMin: h.duracaoMin,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items, count: items.length },
    };
  },
});