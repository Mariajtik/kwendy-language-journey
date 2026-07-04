/**
 * PremiumContext — switch global de Pacote Premium (degustação gratuita).
 * Estado persistido em localStorage `kwendi.premium.ativo`. Um `CustomEvent`
 * `kwendi:premium-changed` mantém componentes sincronizados quando o valor
 * muda a partir de outro contexto (mesmo padrão de useSaldo / useInventario).
 *
 * A função `premiumAtivoStatic()` permite consultar o estado fora do React
 * (ex.: dentro de `perderVida()` ou `dobradorXpAtivo()` que não são hooks).
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "kwendi.premium.ativo";
const EVT = "kwendi:premium-changed";

function ler(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

function gravarLocal(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (v) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
}

/** Empurra o novo valor para o Supabase (fonte da verdade em `progresso.premium`). */
async function gravarBackend(v: boolean) {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return;
  await supabase
    .from("progresso")
    .update({ premium: v })
    .eq("user_id", uid);
}

/** Lê o Premium a partir de `progresso.premium` e sincroniza a cache local. */
async function hidratarDoBackend() {
  const { data: sess } = await supabase.auth.getSession();
  const uid = sess.session?.user?.id;
  if (!uid) return;
  const { data } = await supabase
    .from("progresso")
    .select("premium, premium_expira_em")
    .eq("user_id", uid)
    .maybeSingle();
  if (!data) return;
  const expirou =
    data.premium_expira_em != null && new Date(data.premium_expira_em).getTime() < Date.now();
  const ativo = !!data.premium && !expirou;
  gravarLocal(ativo);
}

/** Leitura estática — para uso fora de componentes React. */
export function premiumAtivoStatic(): boolean {
  return ler();
}

type Ctx = { ativo: boolean; setAtivo: (v: boolean) => void; toggle: () => void };

const PremiumCtx = createContext<Ctx | null>(null);

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const [ativo, setAtivoState] = useState<boolean>(() => ler());

  useEffect(() => {
    const sync = () => setAtivoState(ler());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    // Hidrata a partir do backend ao montar; volta a hidratar em cada auth change.
    void hidratarDoBackend();
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, s) => {
      if (s?.user) setTimeout(() => void hidratarDoBackend(), 0);
    });
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
      sub.subscription.unsubscribe();
    };
  }, []);

  const setAtivo = useCallback((v: boolean) => {
    gravarLocal(v);
    void gravarBackend(v);
    setAtivoState(v);
  }, []);
  const toggle = useCallback(() => setAtivo(!ler()), [setAtivo]);

  const value = useMemo<Ctx>(() => ({ ativo, setAtivo, toggle }), [ativo, setAtivo, toggle]);
  return <PremiumCtx.Provider value={value}>{children}</PremiumCtx.Provider>;
};

export const usePremium = (): Ctx => {
  const ctx = useContext(PremiumCtx);
  if (!ctx) {
    // Fallback seguro (não deve acontecer com o provider no App).
    return { ativo: ler(), setAtivo: gravarLocal, toggle: () => gravarLocal(!ler()) };
  }
  return ctx;
};