/**
 * AuthContext.tsx
 * ----------------
 * Autenticação Supabase real. Expõe `user`, `session`, `loading` e helpers
 * de sign-in/sign-up/OAuth/reset. Sincroniza também `localStorage["kwendi.auth.user"]`
 * para manter compatibilidade com o código legado do app que ainda lê essa chave.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
// Regista todos os espelhos localStorage ⇄ Supabase (side-effect import).
import { clearAllLocal } from "@/lib/backend/mirror";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

function getProfileName(user: User) {
  const m = (user.user_metadata ?? {}) as Record<string, any>;
  return m.nome ?? m.full_name ?? m.name ?? user.email?.split("@")[0] ?? "Utilizador";
}

async function syncBackendUser(user: User | null) {
  if (!user) return;
  const nome = getProfileName(user);
  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email ?? null,
      nome,
    },
    { onConflict: "id" },
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Regista listener PRIMEIRO. Callback síncrono: nunca await aqui
    // (evita deadlocks nos eventos do Supabase).
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // fire-and-forget
        setTimeout(() => {
          void syncBackendUser(s.user);
        }, 0);
      } else {
        clearAllLocal();
      }
    });
    // Depois lê sessão existente
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        void syncBackendUser(data.session.user);
      }
      setLoading(false);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      loading,
      signOut: async () => {
        await supabase.auth.signOut();
        clearAllLocal();
      },
    }),
    [session, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);