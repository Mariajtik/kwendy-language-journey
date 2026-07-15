/**
 * kwendiVoice.ts — voz única do Kwendi (feminina, sotaque angolano).
 *
 * Cliente unificado que substitui todos os usos de `speechSynthesis` no app.
 * Chama a edge function `kwendi-tts` (ElevenLabs) e reproduz via `audio.play`.
 *
 * Fallback: se a rede falhar OU não houver sessão, cai para speechSynthesis
 * do browser procurando voz pt-BR feminina (mais próxima do angolano que pt-PT).
 */
import { supabase } from "@/integrations/supabase/client";
import { audio } from "@/lib/audio";
import AudioManager from "@/utils/audio";

type Contexto = "vocab" | "frase" | "narracao" | "chat";

// Cache em memória: hash -> ArrayBuffer decodificável pela Web Audio API.
// Usamos ArrayBuffer em vez de blob URL para podermos reproduzir no mesmo
// AudioContext global (desbloqueado pelo AudioManager) e evitar leaks.
const cacheMem = new Map<string, ArrayBuffer>();
let cancelToken = 0;

function hash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return String(h);
}

function fallbackSpeech(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(texto);
    const voices = window.speechSynthesis.getVoices();
    const pref =
      voices.find((v) => /pt-BR/i.test(v.lang) && /female|feminin|luciana|camila|joana|maria/i.test(v.name)) ??
      voices.find((v) => /pt-BR/i.test(v.lang)) ??
      voices.find((v) => /pt-PT/i.test(v.lang)) ??
      voices.find((v) => /pt/i.test(v.lang));
    if (pref) u.voice = pref;
    u.lang = pref?.lang ?? "pt-PT";
    u.rate = 0.9;
    u.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
  }
}

async function playBuffer(buf: ArrayBuffer): Promise<void> {
  // Preferir o AudioContext global (baixa latência, sem "mute" inicial).
  try {
    await AudioManager.playArrayBuffer(buf);
    return;
  } catch {
    // Fallback: HTMLAudioElement via blob URL.
    try {
      const blob = new Blob([buf], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      void audio.play(url);
    } catch { /* noop */ }
  }
}

/**
 * Fala um texto na voz Kwendi. Retorna promise que resolve quando o pedido
 * de rede termina (não quando o áudio termina de tocar).
 */
export async function falarKwendi(
  texto: string,
  opts: { contexto?: Contexto; previous?: string; next?: string } = {},
): Promise<void> {
  const clean = texto?.trim();
  if (!clean) return;
  const myToken = ++cancelToken;

  const key = hash(`${opts.contexto ?? "frase"}|${clean}`);
  const cached = cacheMem.get(key);
  if (cached) {
    void playBuffer(cached);
    return;
  }

  try {
    const { data, error } = await supabase.functions.invoke("kwendi-tts", {
      body: {
        text: clean,
        contexto: opts.contexto ?? "frase",
        previous_text: opts.previous,
        next_text: opts.next,
      },
    });
    if (myToken !== cancelToken) return;
    if (error) throw error;
    if (!data) throw new Error("empty_response");

    // A edge function pode devolver JSON de erro (rate_limit, quota, upstream).
    // Detectamos e caímos para o fallback nativo sem gastar mais quota.
    let arrayBuf: ArrayBuffer;
    if (data instanceof Blob) {
      if (data.type && data.type.includes("json")) {
        const txt = await data.text();
        throw new Error(`tts_error:${txt}`);
      }
      arrayBuf = await data.arrayBuffer();
    } else if (data instanceof ArrayBuffer) {
      arrayBuf = data;
    } else if (typeof data === "object" && data !== null && "error" in (data as any)) {
      throw new Error(`tts_error:${(data as any).error}`);
    } else {
      throw new Error("tts_unknown_response");
    }

    if (arrayBuf.byteLength < 200) {
      // Payload demasiado pequeno para ser áudio válido.
      throw new Error("tts_invalid_audio");
    }

    cacheMem.set(key, arrayBuf);
    // Limitar cache em memória a 60 entradas.
    if (cacheMem.size > 60) {
      const first = cacheMem.keys().next().value;
      if (first !== undefined) cacheMem.delete(first);
    }
    void playBuffer(arrayBuf);
  } catch (err) {
    console.warn("[kwendiVoice] fallback speechSynthesis:", err);
    fallbackSpeech(clean);
  }
}

/** Cancela reprodução em curso (best-effort). */
export function pararKwendi() {
  cancelToken++;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch { /* noop */ }
  }
}