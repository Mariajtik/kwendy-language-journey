import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const DEFAULT_ADMIN_EMAIL = "grupo16Kwendi@kwendi.admin";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({} as { email?: string; password?: string }));
    const password: string | undefined = body?.password;
    const providedEmail: string | undefined =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;
    const expected = Deno.env.get("ADMIN_BOOTSTRAP_PASSWORD");
    if (!expected || password !== expected) {
      // Silent no-op for the wrong password — do not leak whether an admin exists.
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ADMIN_EMAIL = providedEmail || DEFAULT_ADMIN_EMAIL;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // find or create the admin user
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    if (existing) {
      userId = existing.id;
      // ensure password is current
      await admin.auth.admin.updateUserById(existing.id, { password: expected });
    } else {
      const { data: created, error } = await admin.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: expected,
        email_confirm: true,
        user_metadata: { nome: "Admin Kwendi", tipo: "signup" },
      });
      if (error || !created?.user) {
        return new Response(JSON.stringify({ error: error?.message ?? "create failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = created.user.id;
    }

    // ensure role
    await admin.from("user_roles").upsert(
      { user_id: userId!, role: "admin" },
      { onConflict: "user_id,role" },
    );

    return new Response(
      JSON.stringify({ ok: true, email: ADMIN_EMAIL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});