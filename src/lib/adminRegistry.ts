/**
 * adminRegistry.ts
 * ----------------
 * Persistência local de "utilizadores" registados no dispositivo (signup + stealth).
 * Alimenta o painel admin enquanto o backend não existe. Capado a 500 registos.
 */

export type RegistryEntry = {
  id: string;
  tipo: "signup" | "stealth";
  nome: string;
  email?: string | null;
  provincia?: string | null;
  pais?: string | null;
  motivacao?: string | null;
  nivel?: string | null;
  criadoEm: string; // ISO
  // stealth-only
  ativadoEm?: string;
  expiraEm?: string;
};

const KEY = "kwendi_local_users";
const MAX = 500;

function read(): RegistryEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(arr: RegistryEntry[]) {
  try {
    const trimmed = arr.slice(-MAX);
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* silencioso */
  }
}

export function registerLocalUser(entry: Omit<RegistryEntry, "id" | "criadoEm"> & { id?: string; criadoEm?: string }) {
  try {
    if (sessionStorage.getItem("kwendi_admin_testing") === "1") return;
  } catch {
    /* noop */
  }
  const list = read();
  const id = entry.id ?? `${entry.tipo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const criadoEm = entry.criadoEm ?? new Date().toISOString();
  list.push({ ...entry, id, criadoEm } as RegistryEntry);
  write(list);
}

export function getLocalUsers(): RegistryEntry[] {
  return read();
}

export function setStealthActive(ativadoEm: string, expiraEm: string) {
  try {
    localStorage.setItem("kwendi.stealth.ativo", JSON.stringify({ ativadoEm, expiraEm }));
  } catch {
    /* silencioso */
  }
}

export function getStealthActive(): { ativadoEm: string; expiraEm: string } | null {
  try {
    const raw = localStorage.getItem("kwendi.stealth.ativo");
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v?.expiraEm) return null;
    if (Date.parse(v.expiraEm) < Date.now()) return null;
    return v;
  } catch {
    return null;
  }
}