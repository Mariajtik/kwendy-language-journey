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

type Contexto = "vocab" | "frase" | "narracao" | "chat";

const cacheMem = new Map<string, string>(); // hash -> blob url
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
    // Preferência: pt-BR feminina; depois qualquer pt-BR; depois pt-PT
    const pref =
      voices.find((v) => /pt-BR/i.test(v.lang) && /female|feminin|luciana|camila|joana|maria/i.test(v.name)) ??
      voices.find((v) => /pt-BR/i.test(v.lang)) ??
      voices.find((v) => /pt/i.test(v.lang));
    if (pref) u.voice = pref;
    u.lang = pref?.lang ?? "pt-BR";
    u.rate = 0.9;
    u.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {
    /* noop */
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
    void audio.play(cached);
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

    // supabase.functions.invoke devolve Blob quando o content-type é binário
    const blob = data instanceof Blob ? data : new Blob([data as ArrayBuffer], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    cacheMem.set(key, url);
    // limitar cache em memória a 60 entradas
    if (cacheMem.size > 60) {
      const first = cacheMem.keys().next().value;
      if (first !== undefined) {
        const old = cacheMem.get(first);
        if (old) URL.revokeObjectURL(old);
        cacheMem.delete(first);
      }
    }
    void audio.play(url);
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