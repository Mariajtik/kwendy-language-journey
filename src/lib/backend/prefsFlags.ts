/**
 * prefsFlags.ts — Helper para flags booleanas de tour/onboarding.
 * Persistem em `localStorage["kwendi.prefs.flags"]` (JSON) e são espelhadas
 * automaticamente em `public.user_preferencias.flags` pelo mirror.
 */
import { pushKey } from "./mirror";

const KEY = "kwendi.prefs.flags";

function read(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function getFlag(name: string): boolean {
  return !!read()[name];
}

export function setFlag(name: string, value = true): void {
  const flags = read();
  flags[name] = value;
  pushKey(KEY, flags);
}

/** Verifica flag legado do localStorage (chaves antigas kwendi_seen_*). */
export function getLegacyFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1" || getFlag(key);
  } catch {
    return getFlag(key);
  }
}