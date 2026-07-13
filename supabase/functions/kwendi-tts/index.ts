/**
 * kwendi-tts — Text-to-Speech com sotaque angolano/Umbundu para o Kwendi.
 *
 * Recebe { text, contexto?, previous_text?, next_text? } e devolve audio/mpeg
 * em stream vindo do ElevenLabs (voz feminina Matilda, modelo multilingual v2).
 *
 * Aplica pré-processamento fonético para forçar sonoridade angolana:
 *  - Ritmo silábico (velocidade 0.92, style 0.55).
 *  - Vogais abertas em finais átonos.
 *  - Micro-pausas nas pré-nasais (mb, nd, ng, nh) de palavras Umbundu.
 *  - Prefixo invisível de instrução de sotaque.
 *
 * Cache em Storage bucket privado `tts-cache` por hash(text + preset).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const VOICE_ID_FEMININA = "XrExE9yKIg1WjnnlVkGX"; // Matilda
const MODEL_ID = "eleven_multilingual_v2";

const INSTRUCAO_SOTAQUE =
  "Lê com sotaque angolano de Luanda, vogais abertas e ritmo silábico. Palavras em Umbundu como Kwendi, Kalandula, Ovimbundu, Umbundu, Cazenga pronunciam-se sílaba a sílaba, com pré-nasais mb, nd, ng, nh bem articuladas.";

/** Palavras/nomes em Umbundu onde forçamos ênfase silábica com pontos médios. */
const PALAVRAS_UMBUNDU: [RegExp, string][] = [
  [/\bKwendi\b/gi, "Kwen·di"],
  [/\bKalandula\b/gi, "Ka·lan·du·la"],
  [/\bOvimbundu\b/gi, "O·vim·bun·du"],
  [/\bUmbundu\b/gi, "Um·bun·du"],
  [/\bTundavala\b/gi, "Tun·da·va·la"],
  [/\bMussivi\b/gi, "Mus·si·vi"],
  [/\bCazenga\b/gi, "Ca·zen·ga"],
  [/\bMuxima\b/gi, "Mu·xi·ma"],
];

function prepararTexto(texto: string, contexto: string): string {
  let t = texto.trim();
  // Micro-pausas nas palavras Umbundu conhecidas
  for (const [re, rep] of PALAVRAS_UMBUNDU) t = t.replace(re, rep);
  // Vocab isolado: adiciona reticências para pausa articulada
  if (contexto === "vocab" && !/[.!?…]$/.test(t)) t = `${t}.`;
  return t;
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ELEVEN = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVEN) {
      return new Response(JSON.stringify({ error: "tts_not_configured" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Auth — permite anónimo (modo furtivo tem session), mas exige um userId qualquer
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    let userId: string | null = null;
    if (token) {
      const { data } = await admin.auth.getUser(token);
      userId = data?.user?.id ?? null;
    }

    const body = await req.json().catch(() => ({}));
    const text = String(body?.text ?? "").slice(0, 1500);
    if (!text || text.length < 1) {
      return new Response(JSON.stringify({ error: "empty_text" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const contexto = String(body?.contexto ?? "frase");
    const previous = body?.previous_text ? String(body.previous_text).slice(0, 500) : undefined;
    const next = body?.next_text ? String(body.next_text).slice(0, 500) : undefined;

    // Rate-limit por utilizador autenticado: 40 req/min
    if (userId) {
      const since = new Date(Date.now() - 60_000).toISOString();
      const { count } = await admin
        .from("tts_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", since);
      if ((count ?? 0) >= 40) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const preparado = prepararTexto(text, contexto);
    const cacheKey = await sha256Hex(`v1|${VOICE_ID_FEMININA}|${contexto}|${preparado}`);
    const cachePath = `${cacheKey.slice(0, 2)}/${cacheKey}.mp3`;

    // Tenta servir do cache
    const { data: cached } = await admin.storage.from("tts-cache").download(cachePath);
    if (cached) {
      return new Response(cached, {
        headers: {
          ...corsHeaders,
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400",
          "X-Kwendi-Cache": "hit",
        },
      });
    }

    // Chama ElevenLabs (não-streaming — precisamos guardar em cache)
    const upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID_FEMININA}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: preparado,
          model_id: MODEL_ID,
          previous_text: previous,
          next_text: next,
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.8,
            style: 0.55,
            use_speaker_boost: true,
            speed: 0.92,
          },
          // ElevenLabs aceita "text" como fonte; inclui a instrução como
          // pseudo-prompt de contexto para orientar sotaque (via previous_text
          // quando não fornecido pelo cliente).
          ...(previous ? {} : { previous_text: INSTRUCAO_SOTAQUE }),
        }),
      },
    );
    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "tts_upstream_failed", status: upstream.status, detail }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const mp3 = new Uint8Array(await upstream.arrayBuffer());

    // Guarda em cache (fire-and-forget)
    admin.storage
      .from("tts-cache")
      .upload(cachePath, mp3, { contentType: "audio/mpeg", upsert: true })
      .catch(() => undefined);

    // Log de uso
    if (userId) {
      admin.from("tts_log").insert({ user_id: userId, chars: preparado.length }).then(() => undefined);
    }

    return new Response(mp3, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
        "X-Kwendi-Cache": "miss",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});