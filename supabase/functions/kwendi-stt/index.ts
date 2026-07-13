/**
 * kwendi-stt — Avaliação de pronúncia via Lovable AI Gateway.
 *
 * Recebe multipart/form-data:
 *  - `audio` (WAV/webm/mp3/m4a, blob) — gravação do utilizador
 *  - `alvo` (string) — palavra ou frase em Umbundu que ele deve dizer
 *
 * Chama openai/gpt-4o-mini-transcribe (sem `language`, auto-detect) e
 * calcula um score simples via distância de Levenshtein normalizada, mais
 * a lista de palavras acertadas/erradas.
 *
 * Devolve { transcricao, alvo, score, acertos, erros }.
 */
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MODEL = "openai/gpt-4o-mini-transcribe";

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

function avaliar(alvo: string, transcricao: string) {
  const A = normalizar(alvo);
  const T = normalizar(transcricao);
  const dist = levenshtein(A, T);
  const maxLen = Math.max(A.length, T.length, 1);
  const score = Math.max(0, Math.round((1 - dist / maxLen) * 100));

  const palavrasAlvo = A.split(" ").filter(Boolean);
  const palavrasTrans = new Set(T.split(" ").filter(Boolean));
  const acertos: string[] = [];
  const erros: string[] = [];
  for (const p of palavrasAlvo) {
    // considera acerto se qualquer palavra transcrita está a ≤1 letra de distância
    let ok = false;
    for (const q of palavrasTrans) {
      if (p === q || levenshtein(p, q) <= 1) { ok = true; break; }
    }
    (ok ? acertos : erros).push(p);
  }
  return { score, acertos, erros };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE) {
      return new Response(JSON.stringify({ error: "stt_not_configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "expected_multipart" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const form = await req.formData();
    const audio = form.get("audio");
    const alvo = String(form.get("alvo") ?? "").trim();
    if (!alvo) {
      return new Response(JSON.stringify({ error: "missing_alvo" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!(audio instanceof File) || audio.size < 1024) {
      return new Response(JSON.stringify({ error: "audio_too_small" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (audio.size > 8 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "audio_too_large" }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Encaminhar para Lovable AI Gateway. Sem `language` (Umbundu não é ISO-639-1).
    const gwForm = new FormData();
    gwForm.append("file", audio, audio.name || "recording.wav");
    gwForm.append("model", MODEL);

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE}` },
      body: gwForm,
    });

    if (!resp.ok) {
      const detail = await resp.text().catch(() => "");
      const status = resp.status;
      const code = status === 429 ? "rate_limited" : status === 402 ? "credits_exhausted" : "stt_upstream_failed";
      return new Response(JSON.stringify({ error: code, status, detail }), {
        status: status === 429 || status === 402 ? status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json().catch(() => ({}));
    const transcricao = String(data?.text ?? "").trim();

    const { score, acertos, erros } = avaliar(alvo, transcricao);

    return new Response(
      JSON.stringify({ transcricao, alvo, score, acertos, erros }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});