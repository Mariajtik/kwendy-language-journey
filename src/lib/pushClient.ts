/**
 * pushClient — regista/desregista subscrição Web Push no backend Kwendi.
 * A chave pública VAPID vive aqui em claro (é *pública* por design).
 */
import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC =
  "BBWq8paIG5vLdZsetCIoa-LUtr4ciQw6xJo_bKN70hppVjEGT5iv9XyRwmt4T196IZZH0H-rstNAHb0rVSq31LA";

function urlB64ToUint8(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const buf = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function toB64u(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function pushSupported(): boolean {
  return typeof window !== "undefined"
    && "serviceWorker" in navigator
    && "PushManager" in window
    && "Notification" in window;
}

export async function activarPushRemoto(hora_local = 20): Promise<boolean> {
  if (!pushSupported()) return false;
  const perm = await Notification.requestPermission();
  if (perm !== "granted") return false;

  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8(VAPID_PUBLIC),
    });
  }

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Luanda";
  const p256dh = toB64u(sub.getKey("p256dh"));
  const auth = toB64u(sub.getKey("auth"));

  const { error } = await supabase.functions.invoke("push-subscribe", {
    body: { endpoint: sub.endpoint, keys: { p256dh, auth }, tz, hora_local, ativo: true },
  });
  if (error) {
    console.warn("[push] subscribe backend falhou", error);
    return false;
  }
  return true;
}

export async function desactivarPushRemoto(): Promise<void> {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.getRegistration("/sw.js");
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe().catch(() => {});
      await supabase.functions.invoke("push-subscribe", {
        method: "DELETE",
        body: { endpoint },
      });
    }
  } catch (e) {
    console.warn("[push] unsubscribe falhou", e);
  }
}