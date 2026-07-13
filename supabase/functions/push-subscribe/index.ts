/**
 * push-subscribe — grava/actualiza a subscrição push do utilizador autenticado.
 * Body: { endpoint, keys: { p256dh, auth }, tz?, hora_local?, ativo? }
 * DELETE: remove subscrição pelo endpoint.
 */
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return json({ error: "not_authenticated" }, 401);
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
  const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const authed = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error: userErr } = await authed.auth.getUser();
  if (userErr || !user) return json({ error: "not_authenticated" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE);

  try {
    if (req.method === "DELETE") {
      const { endpoint } = await req.json().catch(() => ({}));
      if (!endpoint) return json({ error: "missing_endpoint" }, 400);
      await admin.from("push_subscriptions").delete()
        .eq("user_id", user.id).eq("endpoint", endpoint);
      return json({ ok: true });
    }

    const body = await req.json();
    const endpoint = String(body?.endpoint ?? "");
    const p256dh = String(body?.keys?.p256dh ?? "");
    const auth = String(body?.keys?.auth ?? "");
    const tz = String(body?.tz ?? "Africa/Luanda").slice(0, 64);
    const hora_local = Math.max(0, Math.min(23, Number(body?.hora_local ?? 20)));
    const ativo = body?.ativo !== false;
    if (!endpoint || !p256dh || !auth) return json({ error: "invalid_body" }, 400);

    const { error } = await admin.from("push_subscriptions").upsert(
      { user_id: user.id, endpoint, p256dh, auth, tz, hora_local, ativo },
      { onConflict: "endpoint" },
    );
    if (error) throw error;
    return json({ ok: true });
  } catch (e) {
    console.error("[push-subscribe]", e);
    return json({ error: String(e) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}