// Kwendi IA Beta — chat flutuante na Home.
// Usa APENAS Gemini (Interactions API) via _shared/gemini.ts.
// Streaming de texto puro. Requer sessão autenticada (não anónima).

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { callGeminiStream, type ChatMsg } from "../_shared/gemini.ts";

const SYSTEM_PROMPT = `És o Kwendi, um tutor amigável e paciente de Umbundu e cultura angolana.
Responde SEMPRE em Português europeu. Sê breve (2-4 frases), didático e caloroso.
Quando ensinares uma palavra Umbundu, mostra sempre a tradução em Português entre parênteses.
Se o utilizador perguntar algo fora de Umbundu/Angola, redireciona gentilmente.

IMPORTANTE: Estás em versão BETA — se tiveres dúvidas sobre uma resposta, diz que és uma IA em beta e podes errar.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supa = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supa.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const clientMsgs = Array.isArray(body?.messages) ? body.messages : [];
    const messages: ChatMsg[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...clientMsgs.filter(
        (m: unknown) =>
          typeof m === "object" &&
          m !== null &&
          "role" in m &&
          "content" in m &&
          typeof (m as ChatMsg).content === "string",
      ),
    ];

    const stream = await callGeminiStream(messages);
    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    const msg = String(e);
    console.error("[kwendi-ia-beta] error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});