/**
 * deviceTrust.ts
 * Gestão de dispositivos de confiança (30 dias) para OTP no login.
 * device_id vive num cookie de 400 dias.
 */
import { supabase } from "@/integrations/supabase/client";

const COOKIE = "kwendi_did";
const TRUST_DAYS = 30;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const exp = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${exp}; Path=/; SameSite=Lax`;
}

function uuidv4(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b).map((x) => x.toString(16).padStart(2, "0"));
  return `${h.slice(0, 4).join("")}-${h.slice(4, 6).join("")}-${h.slice(6, 8).join("")}-${h.slice(8, 10).join("")}-${h.slice(10, 16).join("")}`;
}

export function getOrCreateDeviceId(): string {
  let id = readCookie(COOKIE);
  if (!id) {
    id = uuidv4();
    writeCookie(COOKIE, id, 400);
  }
  return id;
}

/** Retorna true se este dispositivo já foi validado por OTP nos últimos 30 dias. */
export async function isDeviceTrusted(userId: string): Promise<boolean> {
  const deviceId = getOrCreateDeviceId();
  const { data, error } = await supabase
    .from("user_devices")
    .select("ultimo_uso")
    .eq("user_id", userId)
    .eq("device_id", deviceId)
    .maybeSingle();
  if (error || !data) return false;
  const last = new Date(data.ultimo_uso).getTime();
  return Date.now() - last < TRUST_DAYS * 24 * 60 * 60 * 1000;
}

/** Marca este dispositivo como confiável para este utilizador. */
export async function trustDevice(userId: string): Promise<void> {
  const deviceId = getOrCreateDeviceId();
  const ua = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 120) : null;
  await supabase
    .from("user_devices")
    .upsert(
      { user_id: userId, device_id: deviceId, device_name: ua, ultimo_uso: new Date().toISOString() },
      { onConflict: "user_id,device_id" as any },
    );
}