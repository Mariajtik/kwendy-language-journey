/**
 * adminTesting.ts
 * ---------------
 * Flag de sessão para quando o admin está a usar o app "em modo teste".
 * Enquanto ativo, nenhuma escrita analítica (sessões, registos locais) deve ocorrer.
 */

const KEY = "kwendi_admin_testing";

export function isAdminTesting(): boolean {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function startAdminTesting() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* noop */
  }
}

export function stopAdminTesting() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}