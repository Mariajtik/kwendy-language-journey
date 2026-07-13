/**
 * push-dispatch — invocado por cron. Percorre subscrições activas,
 * envia web-push a utilizadores com ofensiva viva mas ainda não validada hoje,
 * respeitando o fuso horário e a hora preferida do utilizador.
 *
 * Idempotente por dia por subscrição (via `ultima_notificacao_em`).
 */
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:hello@kwendi.xyz";

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

function horaLocal(tz: string, now = new Date()): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: tz });
    return parseInt(fmt.format(now), 10);
  } catch {
    return now.getUTCHours();
  }
}

function isoDiaLocal(tz: string, now = new Date()): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: tz });
    return fmt.format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(SUPABASE_URL, SERVICE);
  const now = new Date();

  const { data: subs, error } = await admin
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth, tz, hora_local, ultima_notificacao_em")
    .eq("ativo", true);
  if (error) {
    console.error("[push-dispatch] list", error);
    return new Response(JSON.stringify({ error: "list_failed" }), { status: 500, headers: corsHeaders });
  }

  let enviados = 0, saltados = 0, removidos = 0, falhas = 0;

  for (const s of subs ?? []) {
    try {
      const h = horaLocal(s.tz, now);
      if (h !== s.hora_local) { saltados++; continue; }

      const diaHoje = isoDiaLocal(s.tz, now);
      if (s.ultima_notificacao_em) {
        const diaUltimo = isoDiaLocal(s.tz, new Date(s.ultima_notificacao_em));
        if (diaUltimo === diaHoje) { saltados++; continue; }
      }

      const { data: prog } = await admin
        .from("progresso")
        .select("ofensiva, ofensiva_hoje")
        .eq("user_id", s.user_id)
        .maybeSingle();
      if (!prog || prog.ofensiva_hoje || (prog.ofensiva ?? 0) <= 0) { saltados++; continue; }

      const payload = JSON.stringify({
        titulo: "🔥 A tua ofensiva está em risco",
        corpo: `Não deixes a chama de ${prog.ofensiva} dia${prog.ofensiva === 1 ? "" : "s"} apagar. Faz uma lição hoje!`,
        url: "/home",
      });

      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        );
        enviados++;
        await admin.from("push_subscriptions")
          .update({ ultima_notificacao_em: now.toISOString() })
          .eq("id", s.id);
      } catch (err: unknown) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await admin.from("push_subscriptions").delete().eq("id", s.id);
          removidos++;
        } else {
          falhas++;
          console.error("[push-dispatch] send", status, err);
        }
      }
    } catch (e) {
      falhas++;
      console.error("[push-dispatch] loop", e);
    }
  }

  return new Response(
    JSON.stringify({ enviados, saltados, removidos, falhas, total: subs?.length ?? 0 }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});