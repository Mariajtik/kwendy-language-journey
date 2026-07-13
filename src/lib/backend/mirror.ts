/**
 * mirror.ts — Espelho localStorage ⇄ Supabase.
 *
 * O modelo é write-through: cada `pushKey(key, value)` grava em localStorage
 * (síncrono, para os hooks reactivos) e, se houver mirror registado + user
 * autenticado, envia um `upsert` em segundo plano para a tabela mapeada.
 * `hydrateAll(userId)` lê todas as tabelas no login e reidrata localStorage
 * antes de os hooks montarem, para que o Cloud seja a fonte da verdade.
 */

import { supabase } from "@/integrations/supabase/client";

export interface MirrorEntry {
  key: string;
  table: string;
  event?: string;
  encode: (state: unknown) => Record<string, unknown>;
  decode: (row: Record<string, unknown>) => unknown;
}

const registry = new Map<string, MirrorEntry>();
let currentUserId: string | null = null;
const pending = new Map<string, ReturnType<typeof setTimeout>>();
const merged = new Map<string, Record<string, unknown>>();

export function registerMirror(entry: MirrorEntry) {
  if (!registry.has(entry.key)) registry.set(entry.key, entry);
}

export function pushKey(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
  const entry = registry.get(key);
  if (!entry || !currentUserId) return;

  // Debounced upsert (múltiplos writes ao mesmo key colapsam num só request).
  // Diferentes keys para a mesma tabela (ex: user_preferencias) são merged
  // para não se sobrescreverem mutuamente.
  try {
    const encoded = entry.encode(value);
    const bucketKey = `${entry.table}::${currentUserId}`;
    const prev = merged.get(bucketKey) ?? {};
    merged.set(bucketKey, { ...prev, ...encoded });

    const timer = pending.get(bucketKey);
    if (timer) clearTimeout(timer);
    pending.set(
      bucketKey,
      setTimeout(async () => {
        pending.delete(bucketKey);
        const payload = merged.get(bucketKey) ?? {};
        merged.delete(bucketKey);
        if (!currentUserId) return;
        try {
          await supabase
            .from(entry.table as any)
            .upsert({ user_id: currentUserId, ...payload } as any, { onConflict: "user_id" });
        } catch {
          /* ignora — cache local mantém funcional offline */
        }
      }, 400),
    );
  } catch {
    /* noop */
  }
}

export async function hydrateAll(userId: string) {
  currentUserId = userId;
  // Uma única leitura por tabela — reunir keys por tabela.
  const byTable = new Map<string, MirrorEntry[]>();
  for (const entry of registry.values()) {
    const arr = byTable.get(entry.table) ?? [];
    arr.push(entry);
    byTable.set(entry.table, arr);
  }
  await Promise.all(
    Array.from(byTable.entries()).map(async ([table, entries]) => {
      try {
        const { data } = await supabase
          .from(table as any)
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        if (!data) return;
        const row = data as unknown as Record<string, unknown>;
        for (const entry of entries) {
          try {
            const decoded = entry.decode(row);
            if (decoded == null) continue;
            localStorage.setItem(entry.key, JSON.stringify(decoded));
            if (entry.event) window.dispatchEvent(new CustomEvent(entry.event));
          } catch {
            /* noop */
          }
        }
      } catch {
        /* noop — segue com cache local */
      }
    }),
  );
  // Notificação global de fim de hidratação
  window.dispatchEvent(new CustomEvent("kwendi:hydrated"));
}

export function clearAllLocal() {
  currentUserId = null;
  merged.clear();
  pending.forEach((t) => clearTimeout(t));
  pending.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("kwendi"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* noop */
  }
  registry.forEach((e) => {
    if (e.event) window.dispatchEvent(new CustomEvent(e.event));
  });
}

export function currentUser(): string | null {
  return currentUserId;
}