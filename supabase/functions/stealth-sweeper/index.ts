/**
 * stealth-sweeper — Executado diariamente por cron.
 * 1) Marca perfis stealth cuja expiração está a <24h como "avisados"
 *    (para o cliente mostrar o banner).
 * 2) Elimina utilizadores stealth já expirados (cascata apaga tudo).
 * Requer: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const agora = new Date();
  const em24h = new Date(agora.getTime() + 24 * 3600 * 1000).toISOString();

  // 1) marcar avisados
  await admin
    .from("profiles")
    .update({ stealth_avisado_em: agora.toISOString() })
    .eq("tipo", "stealth")
    .is("stealth_avisado_em", null)
    .lte("stealth_expira_em", em24h);

  // 2) apagar expirados
  const { data: expirados } = await admin
    .from("profiles")
    .select("id")
    .eq("tipo", "stealth")
    .lte("stealth_expira_em", agora.toISOString());

  let apagados = 0;
  for (const p of expirados ?? []) {
    const { error } = await admin.auth.admin.deleteUser(p.id);
    if (!error) apagados++;
  }

  return new Response(
    JSON.stringify({ ok: true, apagados, avisados: (expirados?.length ?? 0) }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});