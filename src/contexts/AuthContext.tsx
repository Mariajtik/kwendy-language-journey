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

function syncLegacyLocal(user: User | null) {
  try {
    if (!user) {
      // não apaga automaticamente para não quebrar flows existentes
      return;
    }
    const m = (user.user_metadata ?? {}) as Record<string, any>;
    const legacy = {
      id: user.id,
      email: user.email,
      nome: m.nome ?? user.email?.split("@")[0] ?? "Utilizador",
      nivel: m.nivel_declarado ?? m.nivel ?? null,
      cadastradoEm: user.created_at,
    };
    localStorage.setItem("kwendi.auth.user", JSON.stringify(legacy));
  } catch {
    /* noop */
  }
}

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
  await supabase.from("progresso").upsert({ user_id: user.id }, { onConflict: "user_id" });
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Regista listener PRIMEIRO
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      syncLegacyLocal(s?.user ?? null);
      void syncBackendUser(s?.user ?? null);
    });
    // Depois lê sessão existente
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      syncLegacyLocal(data.session?.user ?? null);
      void syncBackendUser(data.session?.user ?? null);
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
        try {
          localStorage.removeItem("kwendi.auth.user");
        } catch {
          /* noop */
        }
      },
    }),
    [session, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);