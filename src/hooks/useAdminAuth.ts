/**
 * useAdminAuth.ts
 * ---------------
 * Autenticação do painel admin — hardcoded no frontend nesta fase (usuário
 * assumiu o risco). SUBSTITUIR por auth real (Supabase + user_roles admin)
 * quando o backend estiver disponível.
 */

import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "kwendi_admin_session";
// TODO(backend): substituir pelas credenciais/verificação server-side.
const ADMIN_USER = "grupo16Kwendi";
const ADMIN_PASS = "Teremos19Valores!";

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const onStorage = () => {
      try {
        setAuthed(sessionStorage.getItem(SESSION_KEY) === "1");
      } catch {
        setAuthed(false);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback((user: string, pass: string) => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* noop */
      }
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
    setAuthed(false);
  }, []);

  return { authed, login, logout };
}