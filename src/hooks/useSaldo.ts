/**
 * useSaldo — fonte única do saldo do jogador (diamantes negros, XP, baús,
 * fragmentos, cosméticos, ofensiva). Persiste em localStorage e sincroniza
 * entre componentes via CustomEvent.
 *
 * Migrar para Supabase no futuro = trocar load/save por chamadas async.
 */
import { useCallback, useEffect, useState } from "react";
import { premiumAtivoStatic } from "@/contexts/PremiumContext";

export type Raridade = "comum" | "raro" | "lendario";

export interface Saldo {
  xp: number;
  diamantes: number;
  baus: Record<Raridade, number>;
  fragmentos: number;
  ofensiva: number;
  ultimoDiaAtivo: string;
  curiosidadesLidas: string[];
  /** Vidas atuais (0..VIDAS_MAX) — partilhadas em todo o app */
  vidas: number;
  /** Vidas extra compradas na Loja (pool separado, sem limite) */
  vidasExtra: number;
}

const KEY = "kwendi_saldo_v1";
const EVT = "kwendi:saldo-changed";

export const VIDAS_MAX = 5;

const DEFAULT: Saldo = {
  xp: 0,
  diamantes: 1000,
  baus: { comum: 0, raro: 0, lendario: 0 },
  fragmentos: 0,
  ofensiva: 3,
  ultimoDiaAtivo: "",
  curiosidadesLidas: [],
  vidas: VIDAS_MAX,
  vidasExtra: 0,
};

function load(): Saldo {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as Partial<Saldo> & { kindeles?: number };
    return {
      ...DEFAULT,
      ...p,
      // migração: kindeles → diamantes (somando ao saldo padrão)
      diamantes: p.diamantes ?? (p.kindeles != null ? DEFAULT.diamantes + p.kindeles : DEFAULT.diamantes),
      baus: { ...DEFAULT.baus, ...(p.baus ?? {}) },
      curiosidadesLidas: p.curiosidadesLidas ?? [],
      vidas: typeof p.vidas === "number" ? Math.min(VIDAS_MAX, Math.max(0, p.vidas)) : VIDAS_MAX,
      vidasExtra: typeof p.vidasExtra === "number" ? Math.max(0, p.vidasExtra) : 0,
    };
  } catch {
    return DEFAULT;
  }
}

function save(s: Saldo) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getSaldo(): Saldo {
  return load();
}

export function setSaldo(updater: (prev: Saldo) => Saldo): Saldo {
  const next = updater(load());
  save(next);
  return next;
}

export function useSaldo() {
  const [saldo, setLocal] = useState<Saldo>(load);

  useEffect(() => {
    const sync = () => setLocal(load());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (prev: Saldo) => Saldo) => {
    setLocal((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  return { saldo, update };
}

/**
 * Consome uma vida: primeiro do pool de vidasExtra (comprado),
 * depois das vidas normais. Devolve o novo total combinado.
 */
export function perderVida(): number {
  // Premium (degustação): vidas infinitas — não consome nada.
  if (premiumAtivoStatic()) {
    const s = getSaldo();
    return s.vidas + s.vidasExtra;
  }
  const next = setSaldo((prev) => {
    if (prev.vidasExtra > 0) {
      return { ...prev, vidasExtra: prev.vidasExtra - 1 };
    }
    return { ...prev, vidas: Math.max(0, prev.vidas - 1) };
  });
  return next.vidas + next.vidasExtra;
}

/** Recupera vidas normais (até VIDAS_MAX). Não toca em vidasExtra. */
export function recuperarVidas(n = VIDAS_MAX): void {
  setSaldo((prev) => ({ ...prev, vidas: Math.min(VIDAS_MAX, prev.vidas + n) }));
}

/** Adiciona vidas extra ao pool comprado. */
export function adicionarVidaExtra(n = 1): void {
  setSaldo((prev) => ({ ...prev, vidasExtra: prev.vidasExtra + n }));
}