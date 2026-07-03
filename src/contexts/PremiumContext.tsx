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

function gravar(v: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (v) window.localStorage.setItem(KEY, "1");
    else window.localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {
    /* ignore */
  }
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
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setAtivo = useCallback((v: boolean) => {
    gravar(v);
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
    return { ativo: ler(), setAtivo: gravar, toggle: () => gravar(!ler()) };
  }
  return ctx;
};