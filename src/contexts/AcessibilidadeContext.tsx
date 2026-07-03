/**
 * AcessibilidadeContext
 * ---------------------
 * Preferências de acessibilidade persistidas em localStorage:
 *  - temaEscuro: alterna classe `dark` no <html>.
 *  - fundoBranco: desativa o fundo "grass" da Home (fundo neutro branco).
 *  - autoPlayAudio: se false (padrão), áudios/músicas (intros, jogo
 *    Para Além de Fronteiras, etc.) iniciam em mudo. Se true, tocam
 *    automaticamente.
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

type Prefs = {
  temaEscuro: boolean;
  fundoBranco: boolean;
  autoPlayAudio: boolean;
};

const STORAGE_KEY = "kwendi:acessibilidade";

const DEFAULTS: Prefs = {
  temaEscuro: false,
  fundoBranco: false,
  autoPlayAudio: false,
};

type Ctx = Prefs & {
  setTemaEscuro: (v: boolean) => void;
  setFundoBranco: (v: boolean) => void;
  setAutoPlayAudio: (v: boolean) => void;
};

const AcessibilidadeCtx = createContext<Ctx | null>(null);

const readStored = (): Prefs => {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
};

export const AcessibilidadeProvider = ({ children }: { children: ReactNode }) => {
  const [prefs, setPrefs] = useState<Prefs>(() => readStored());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    if (prefs.temaEscuro) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [prefs]);

  const setTemaEscuro = useCallback(
    (v: boolean) => setPrefs((p) => ({ ...p, temaEscuro: v })),
    [],
  );
  const setFundoBranco = useCallback(
    (v: boolean) => setPrefs((p) => ({ ...p, fundoBranco: v })),
    [],
  );
  const setAutoPlayAudio = useCallback(
    (v: boolean) => setPrefs((p) => ({ ...p, autoPlayAudio: v })),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({ ...prefs, setTemaEscuro, setFundoBranco, setAutoPlayAudio }),
    [prefs, setTemaEscuro, setFundoBranco, setAutoPlayAudio],
  );

  return (
    <AcessibilidadeCtx.Provider value={value}>{children}</AcessibilidadeCtx.Provider>
  );
};

export const useAcessibilidade = (): Ctx => {
  const ctx = useContext(AcessibilidadeCtx);
  if (!ctx) {
    // Fallback: retornar defaults + setters no-op para não crashar
    // caso o hook seja usado fora do provider.
    return {
      ...DEFAULTS,
      setTemaEscuro: () => undefined,
      setFundoBranco: () => undefined,
      setAutoPlayAudio: () => undefined,
    };
  }
  return ctx;
};