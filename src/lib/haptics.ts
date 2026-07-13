/**
 * haptics.ts — vibração leve/gradual em web e nativo.
 * Silencioso quando não suportado ou desativado nas preferências.
 */

const KEY = "kwendi:vibracao";

function enabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "false") return false;
  } catch { /* noop */ }
  return true;
}

function vibrate(pattern: number | number[]) {
  if (!enabled()) return;
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch { /* noop */ }
}

export const haptics = {
  tap: () => vibrate(10),
  success: () => vibrate([20, 40, 20]),
  celebrate: () => vibrate([30, 60, 30, 60, 80]),
  error: () => vibrate([80, 40, 80]),
  setEnabled: (on: boolean) => {
    try { window.localStorage.setItem(KEY, on ? "true" : "false"); } catch { /* noop */ }
  },
  isEnabled: enabled,
};