/**
 * useAdminAuth.ts
 * ---------------
 * Autenticação real do painel admin via Supabase:
 *  1. Utilizador digita user "grupo16Kwendi" + password.
 *  2. Chamamos a edge function `bootstrap-admin` (idempotente) que garante
 *     que existe uma conta `grupo16Kwendi@kwendi.admin` com role `admin`.
 *  3. Fazemos `signInWithPassword` com essa conta.
 *  4. `RequireAdmin` valida `has_role(auth.uid(),'admin')` na base de dados.
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_USER = "grupo16Kwendi";
const ADMIN_EMAIL = "grupo16Kwendi@kwendi.admin";

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const check = useCallback(async () => {
    try {
      const { data: sess } = await supabase.auth.getSession();
      const uid = sess.session?.user?.id;
      if (!uid) {
        setAuthed(false);
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: uid,
        _role: "admin",
      });
      setAuthed(!!data && !error);
    } catch {
      setAuthed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => sub.subscription.unsubscribe();
  }, [check]);

  const login = useCallback(async (user: string, pass: string) => {
    if (user.trim() !== ADMIN_USER) return false;
    // Bootstrap idempotente (cria a conta admin + role se necessário).
    try {
      const { error: fnError } = await supabase.functions.invoke("bootstrap-admin", {
        body: { password: pass },
      });
      if (fnError) {
        // Bootstrap falhou (password errada ou serviço) — tentamos signin mesmo assim.
      }
    } catch {
      /* continua */
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: pass,
    });
    if (error) return false;
    await check();
    return true;
  }, [check]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setAuthed(false);
  }, []);

  return { authed, checking, login, logout };
}