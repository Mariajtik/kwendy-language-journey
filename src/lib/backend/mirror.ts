/**
 * mirror.ts — Camada de espelho localStorage ⇄ Supabase.
 *
 * Os hooks (useSaldo, useInventario, useMissoes, useNivelamento, usePassaporte
 * e preferências) continuam a usar `localStorage` como cache síncrono rápido.
 * Aqui garantimos que:
 *  1. Ao autenticar, o estado guardado no Supabase é copiado para o localStorage
 *     (hidratação). Se o servidor ainda estiver vazio mas o localStorage tem
 *     dados, empurramos essa "primeira migração" para o servidor uma vez.
 *  2. Cada `pushKey(key, value)` faz um upsert com debounce (400ms) na tabela
 *     correspondente.
 *  3. No signOut, todas as chaves `kwendi*` são limpas.
 *
 * O mapeamento key ⇄ tabela ⇄ (encode/decode) vive em `registry`.
 */
import { supabase } from "@/integrations/supabase/client";

type EncodedRow = Record<string, unknown>;

export interface MirrorEntry {
  /** Chave no localStorage */
  key: string;
  /** Tabela pública (uma linha por utilizador, PK user_id) */
  table:
    | "user_saldo"
    | "user_inventario"
    | "user_missoes"
    | "user_nivelamento"
    | "user_passaporte"
    | "user_preferencias";
  /** localStorage JSON → colunas Supabase */
  encode: (parsed: any) => EncodedRow;
  /** linha Supabase → JSON para localStorage (ou null se linha vazia) */
  decode: (row: any) => unknown | null;
  /** disparar evento após hidratação para os hooks re-lerem */
  event?: string;
}

const registry: MirrorEntry[] = [];
let currentUserId: string | null = null;
const debouncers = new Map<string, ReturnType<typeof setTimeout>>();

export function registerMirror(entry: MirrorEntry) {
  if (!registry.find((e) => e.key === entry.key)) registry.push(entry);
}

function safeParse(raw: string | null): any {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Escreve no localStorage e agenda push para Supabase. */
export function pushKey(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
  scheduleUpsert(key);
}

function scheduleUpsert(key: string) {
  if (!currentUserId) return;
  const entry = registry.find((e) => e.key === key);
  if (!entry) return;
  const prev = debouncers.get(key);
  if (prev) clearTimeout(prev);
  debouncers.set(
    key,
    setTimeout(() => {
      void flushOne(entry).catch(() => {});
    }, 400),
  );
}

async function flushOne(entry: MirrorEntry) {
  if (!currentUserId) return;
  const parsed = safeParse(localStorage.getItem(entry.key));
  if (parsed == null) return;
  const row = { user_id: currentUserId, ...entry.encode(parsed) };
  await supabase.from(entry.table).upsert(row, { onConflict: "user_id" });
}

/** Ao logar: para cada chave, se o servidor tem dados, escreve-os no localStorage; caso contrário, empurra o localStorage atual para o servidor (migração one-shot). */
export async function hydrateAll(userId: string) {
  currentUserId = userId;
  await Promise.all(
    registry.map(async (entry) => {
      const { data, error } = await supabase
        .from(entry.table)
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) return;
      const decoded = data ? entry.decode(data) : null;
      const localRaw = localStorage.getItem(entry.key);
      const local = safeParse(localRaw);
      if (decoded != null) {
        // servidor tem dados → é a fonte da verdade
        try {
          localStorage.setItem(entry.key, JSON.stringify(decoded));
          if (entry.event) window.dispatchEvent(new CustomEvent(entry.event));
        } catch {}
      } else if (local != null) {
        // servidor vazio + local tem dados → migrar
        void flushOne(entry);
      }
    }),
  );
}

/** Ao terminar sessão: limpa todas as chaves `kwendi*` do localStorage. */
export function clearAllLocal() {
  currentUserId = null;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("kwendi") || k.startsWith("kwendi_"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
  // Notifica todos os hooks para se re-lerem no default.
  registry.forEach((e) => {
    if (e.event) window.dispatchEvent(new CustomEvent(e.event));
  });
}

/** Sabe se já temos um utilizador ativo (para os hooks decidirem se fazem push). */
export function currentUser(): string | null {
  return currentUserId;
}