/**
 * useAdminAuth.ts
 * ---------------
 * Autenticação real do painel admin via Supabase:
 *  1. Utilizador digita email + password no formulário.
 *  2. Se a password bater com `ADMIN_BOOTSTRAP_PASSWORD` (segredo server-side),
 *     a edge function `bootstrap-admin` garante a existência da conta e do role
 *     admin — idempotente. Sem essa password, o bootstrap não faz nada.
 *  3. Fazemos `signInWithPassword` com o email/password submetidos.
 *  4. `RequireAdmin` valida `has_role(auth.uid(),'admin')` na base de dados,
 *     o que impede acesso mesmo se alguém adivinhar o email.
 *
 * Nenhum email ou nome de utilizador do admin é embutido no bundle público.
 */

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

  const login = useCallback(async (email: string, pass: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !pass) return false;
    // Bootstrap idempotente: só surte efeito se `pass` == ADMIN_BOOTSTRAP_PASSWORD
    // (segredo do servidor). Para todos os outros casos, é um no-op silencioso.
    try {
      await supabase.functions.invoke("bootstrap-admin", {
        body: { email: trimmedEmail, password: pass },
      });
    } catch {
      /* segue para o signin */
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
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