// Recebe feedback do utilizador, grava em feedback_log e (best-effort) envia email.
// O endereço de destino nunca é exposto ao cliente.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEV_EMAIL = "mariakcbaptista06@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "unauthenticated" }, 401);

    const user = userData.user;
    const body = await req.json().catch(() => ({}));
    const assunto = String(body.assunto ?? "").trim().slice(0, 120);
    const mensagem = String(body.mensagem ?? "").trim().slice(0, 2000);
    if (assunto.length < 3 || mensagem.length < 10) {
      return json({ error: "invalid_input" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Rate-limit: 1 msg / 60s
    const oneMinAgo = new Date(Date.now() - 60_000).toISOString();
    const { count } = await admin
      .from("feedback_log")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", oneMinAgo);
    if ((count ?? 0) > 0) return json({ error: "rate_limited" }, 429);

    const { error: insErr } = await admin.from("feedback_log").insert({
      user_id: user.id,
      assunto,
      mensagem,
      email_autor: user.email ?? null,
    });
    if (insErr) return json({ error: "db_error", detail: insErr.message }, 500);

    // Best-effort email delivery via Resend if configured. Silencioso em falha.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Kwendi Feedback <onboarding@resend.dev>",
            to: [DEV_EMAIL],
            subject: `[Kwendi] ${assunto}`,
            text: `De: ${user.email ?? "(anónimo)"}\nUser ID: ${user.id}\n\n${mensagem}`,
          }),
        });
      } catch { /* silencioso */ }
    }

    return json({ ok: true }, 200);
  } catch (e) {
    return json({ error: "unexpected", detail: String(e) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}