/**
 * notifications.ts — pedido de permissão e agendamento simples de lembretes.
 * Usa Notification API do browser; em nativo (Capacitor) é fallback silencioso.
 */

export async function requestNotificationPermission(): Promise<"granted" | "denied" | "default"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  try {
    if (Notification.permission === "granted") return "granted";
    if (Notification.permission === "denied") return "denied";
    const res = await Notification.requestPermission();
    return res;
  } catch {
    return "denied";
  }
}

export function isNotificationGranted(): boolean {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  return Notification.permission === "granted";
}

/**
 * Agenda um lembrete diário (naïve, baseado em setTimeout). Sobrevive apenas
 * enquanto a aba estiver aberta; em produção usaria push server-side.
 */
let dailyTimer: number | null = null;

export function scheduleDailyReminder(hhmm: string, titulo: string, corpo: string) {
  if (!isNotificationGranted()) return;
  cancelDailyReminder();
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return;
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
  const ms = next.getTime() - now.getTime();
  dailyTimer = window.setTimeout(() => {
    try { new Notification(titulo, { body: corpo }); } catch { /* noop */ }
    scheduleDailyReminder(hhmm, titulo, corpo); // reagenda
  }, ms);
}

export function cancelDailyReminder() {
  if (dailyTimer !== null) {
    window.clearTimeout(dailyTimer);
    dailyTimer = null;
  }
}

/**
 * Se a ofensiva ainda não foi validada hoje e o utilizador tem sequência,
 * agenda uma notificação local às 20:00 a lembrar de manter a chama.
 * Idempotente por dia (usa localStorage `kwendi.notif.streak.dia`).
 */
export function agendarLembreteOfensiva(opts: {
  ofensiva: number;
  ofensivaHoje: boolean;
  hora?: string;
}) {
  if (!isNotificationGranted()) return;
  const { ofensiva, ofensivaHoje, hora = "20:00" } = opts;
  if (ofensivaHoje || ofensiva <= 0) return;
  try {
    const hoje = new Date().toDateString();
    const key = "kwendi.notif.streak.dia";
    if (localStorage.getItem(key) === hoje) return;
    localStorage.setItem(key, hoje);
  } catch {
    /* noop */
  }
  const [h, m] = hora.split(":").map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return;
  const now = new Date();
  const alvo = new Date();
  alvo.setHours(h, m, 0, 0);
  const ms = alvo.getTime() - now.getTime();
  if (ms <= 0) return; // já passou a hora hoje
  window.setTimeout(() => {
    try {
      new Notification("🔥 A tua ofensiva está em risco", {
        body: `Não deixes a chama apagar! Faz uma lição hoje.`,
      });
    } catch {
      /* noop */
    }
  }, Math.min(ms, 12 * 60 * 60 * 1000));
}