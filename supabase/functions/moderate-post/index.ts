// Moderação de publicações da comunidade via Lovable AI Gateway.
// Recebe { postId, kind: 'post'|'comment' }, lê o registo, chama a IA
// e actualiza `status` para approved/rejected. Sem verify_jwt (uso público
// disparado pelo cliente logo após o insert), mas valida o dono via
// service role no servidor.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chatWithFallback } from "../_shared/ai-fallback.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type Kind = "post" | "comment";

async function classify(text: string): Promise<{ ok: boolean; reason?: string }> {
  const prompt = `És um moderador de uma comunidade de aprendizagem sobre a língua Umbundu, cultura angolana e africana. Aprova apenas conteúdo relacionado com África, Angola, língua Umbundu ou o app Kwendi. Rejeita spam, ódio, sexualização, política partidária, publicidade externa. Responde SÓ JSON válido: {"ok": boolean, "reason": string}. Texto: """${text}"""`;
  try {
    const { text: raw } = await chatWithFallback(
      [
        { role: "system", content: "Responde apenas com JSON válido." },
        { role: "user", content: prompt },
      ],
      { jsonMode: true },
    );
    const cleaned = (raw || "{}").replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { ok: !!parsed.ok, reason: parsed.reason ?? "" };
  } catch (e) {
    return { ok: false, reason: "ai_exception" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { postId, kind } = (await req.json()) as { postId: string; kind: Kind };
    if (!postId || (kind !== "post" && kind !== "comment")) {
      return new Response(JSON.stringify({ error: "bad_request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const table = kind === "post" ? "community_posts" : "community_comments";
    const { data: row, error } = await admin
      .from(table)
      .select("id, text, status")
      .eq("id", postId)
      .maybeSingle();
    if (error || !row) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (row.status !== "pending") {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const verdict = await classify(row.text as string);
    const update: Record<string, unknown> = {
      status: verdict.ok ? "approved" : "rejected",
    };
    if (kind === "post") update.moderation_reason = verdict.reason ?? null;
    await admin.from(table).update(update).eq("id", postId);

    return new Response(JSON.stringify({ ok: true, verdict }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});