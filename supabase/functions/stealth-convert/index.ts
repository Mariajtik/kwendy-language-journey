import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) return json(401, { error: "unauthorized" });

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return json(401, { error: "unauthorized" });
    const authUser = userData.user;
    if (!authUser.is_anonymous) {
      return json(400, { error: "not_anonymous" });
    }

    let body: { email?: string; password?: string };
    try {
      body = await req.json();
    } catch {
      return json(400, { error: "invalid_json" });
    }
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return json(400, { error: "invalid_email" });
    if (password.length < 8) return json(400, { error: "weak_password" });

    // Promote anonymous → permanent user (keeps the same UUID and all FK data)
    const { error: updErr } = await admin.auth.admin.updateUserById(authUser.id, {
      email,
      password,
      email_confirm: true,
    });
    if (updErr) {
      const msg = updErr.message || "";
      if (/already registered|already been registered|duplicate/i.test(msg)) {
        return json(409, { error: "email_in_use" });
      }
      if (/password/i.test(msg)) {
        return json(400, { error: "weak_password", message: msg });
      }
      return json(500, { error: "update_failed", message: msg });
    }

    // Reflect the change in the app's profile row.
    await admin
      .from("profiles")
      .update({ tipo: "signup", stealth_expira_em: null, email })
      .eq("id", authUser.id);

    return json(200, { ok: true });
  } catch (e) {
    return json(500, { error: String(e) });
  }
});