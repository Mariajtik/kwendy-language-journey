/**
 * mirror.ts — Cache offline local (Fase 1).
 *
 * Persistência real no Cloud vem na Fase 2. Por agora, `pushKey` só escreve
 * no `localStorage`; `hydrateAll` é no-op; `clearAllLocal` apaga as chaves
 * `kwendi*` no logout / eliminação de conta.
 */

export interface MirrorEntry {
  key: string;
  event?: string;
  [k: string]: unknown;
}

const registry: MirrorEntry[] = [];

export function registerMirror(entry: MirrorEntry) {
  if (!registry.find((e) => e.key === entry.key)) registry.push(entry);
}

export function pushKey(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

export async function hydrateAll(_userId: string) {
  /* Fase 2: hidratar do Cloud. */
}

export function clearAllLocal() {
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
  return null;
}