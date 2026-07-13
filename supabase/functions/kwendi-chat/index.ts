/**
 * kwendi-chat — Streaming chat com Google Gemini API.
 * Espera JSON: { thread_id, messages: [{ role, content }] }.
 * Devolve corpo em stream (chunks de texto puro) para o cliente ir escrevendo.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `És o Kwendi, um tutor amigável e paciente de Umbundu e cultura angolana.
Responde SEMPRE em Português europeu. Sê breve (2-4 frases), didático e caloroso.
Quando ensinares uma palavra Umbundu, mostra sempre a tradução em Português entre parênteses.
Se o utilizador perguntar algo fora de Umbundu/Angola, redireciona gentilmente.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validar utilizador
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verificar Premium (fonte da verdade: progresso.premium)
    const { data: prog } = await admin
      .from("progresso")
      .select("premium, premium_expira_em")
      .eq("user_id", userData.user.id)
      .maybeSingle();
    const expirou =
      prog?.premium_expira_em && new Date(prog.premium_expira_em).getTime() < Date.now();
    if (!prog?.premium || expirou) {
      return new Response(JSON.stringify({ error: "premium_required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    // Converter mensagens para formato Google Generative AI
    const contents = messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Chamada Google Gemini API (streaming)
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
        }),
      }
    );

    if (!upstream.ok || !upstream.body) {
      const err = await upstream.text();
      console.error("Gemini API error:", err);
      return new Response(
        JSON.stringify({ 
          error: "upstream_failed", 
          detail: err,
          status: upstream.status 
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Processar SSE stream do Google Gemini
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";
    const outStream = new ReadableStream({
      async pull(controller) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return;
          }
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const l = line.trim();
            if (!l.startsWith("data:")) continue;
            const payload = l.slice(5).trim();
            if (!payload) continue;
            try {
              const j = JSON.parse(payload);
              // Google Generative AI structure: candidates[0].content.parts[0].text
              const text = j?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
              /* ignore malformed chunks */
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
          controller.close();
        }
      },
    });

    return new Response(outStream, {
      headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("kwendi-chat error:", e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
