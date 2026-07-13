// Fallback automático: tenta Lovable AI Gateway. Se 402/429 → Gemini.
// Uso: chat completions non-streaming, devolve texto do assistant.

import { callGeminiText, type ChatMsg } from "./gemini.ts";

// Mensagem flexível — o path Lovable aceita content multimodal (array);
// o path Gemini text-only só aceita string.
export type FlexMsg = { role: string; content: unknown };

const LOVABLE_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

export interface AiCallOpts {
  model?: string;
  jsonMode?: boolean;
}

export interface AiCallResult {
  text: string;
  provider: "lovable" | "gemini";
}

/** Chama IA (chat completions style) com fallback automático em 402/429. */
export async function chatWithFallback(
  messages: FlexMsg[] | ChatMsg[],
  opts: AiCallOpts = {},
): Promise<AiCallResult> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (key) {
    try {
      const body: Record<string, unknown> = {
        model: opts.model ?? "google/gemini-2.5-flash",
        messages,
      };
      if (opts.jsonMode) body.response_format = { type: "json_object" };
      const res = await fetch(LOVABLE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Lovable-API-Key": key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content ?? "";
        return { text, provider: "lovable" };
      }
      // 402 credits exhausted, 429 rate limit → tenta Gemini
      if (res.status !== 402 && res.status !== 429) {
        const t = await res.text();
        throw new Error(`lovable_${res.status}: ${t.slice(0, 400)}`);
      }
      console.log(`[ai-fallback] Lovable ${res.status} → Gemini`);
    } catch (err) {
      // Se for erro de rede tenta Gemini; se for erro terminal do gateway propaga
      const msg = String(err);
      if (!msg.includes("lovable_")) console.log("[ai-fallback] Lovable err → Gemini:", msg);
      else throw err;
    }
  }
  const textMsgs: ChatMsg[] = (messages as FlexMsg[]).map((m) => ({
    role: (m.role === "user" || m.role === "assistant" || m.role === "system"
      ? m.role
      : "user") as ChatMsg["role"],
    content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
  }));
  const text = await callGeminiText(textMsgs, { responseFormat: opts.jsonMode ? "json" : "text" });
  return { text, provider: "gemini" };
}