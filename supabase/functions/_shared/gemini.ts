// Helper para chamar a Gemini Interactions API (Google AI Studio).
// Modo non-streaming: devolve texto completo.
// Modo streaming: devolve um ReadableStream<Uint8Array> com texto puro
// (concatenação de todos os step.delta text), pronto para reencaminhar ao
// cliente ou pipar para uma Response.

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-flash-latest";

export type ChatMsg = { role: "user" | "assistant" | "system"; content: string };

function toGenerateContentBody(messages: ChatMsg[], responseFormat?: "text" | "json") {
  const contents: Array<{ role: "user" | "model"; parts: { text: string }[] }> = [];
  let systemText = "";
  for (const m of messages) {
    if (m.role === "system") {
      systemText += (systemText ? "\n" : "") + m.content;
    } else {
      contents.push({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      });
    }
  }
  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.7,
      ...(responseFormat === "json" ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (systemText) {
    body.systemInstruction = { parts: [{ text: systemText }] };
  }
  return body;
}

export interface GeminiOptions {
  model?: string;
  responseFormat?: "text" | "json";
}

export async function callGeminiText(
  messages: ChatMsg[],
  opts: GeminiOptions = {},
): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("missing_gemini_key");
  const model = opts.model ?? DEFAULT_MODEL;
  const body = toGenerateContentBody(messages, opts.responseFormat);
  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`gemini_${res.status}: ${t.slice(0, 400)}`);
  }
  const data = await res.json();
  const cand = data?.candidates?.[0];
  const parts = cand?.content?.parts ?? [];
  return parts.map((p: { text?: string }) => p?.text ?? "").join("");
}

export function callGeminiStream(
  messages: ChatMsg[],
  opts: GeminiOptions = {},
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("missing_gemini_key");
  const model = opts.model ?? DEFAULT_MODEL;
  const body = toGenerateContentBody(messages, opts.responseFormat);
  // streamGenerateContent com alt=sse devolve eventos SSE por chunk.
  const url = `${GEMINI_BASE}/${model}:streamGenerateContent?alt=sse`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      Accept: "text/event-stream",
    },
    body: JSON.stringify(body),
  }).then((upstream) => {
    if (!upstream.ok || !upstream.body) {
      return upstream.text().then((t) => {
        throw new Error(`gemini_${upstream.status}: ${t.slice(0, 400)}`);
      });
    }
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    return new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";
        for (const block of parts) {
          const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const payload = dataLine.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const j = JSON.parse(payload);
            const chunks = j?.candidates?.[0]?.content?.parts ?? [];
            for (const c of chunks) {
              if (typeof c?.text === "string" && c.text.length > 0) {
                controller.enqueue(encoder.encode(c.text));
              }
            }
          } catch {
            /* ignore */
          }
        }
      },
      cancel() {
        reader.cancel().catch(() => {});
      },
    });
  });
}