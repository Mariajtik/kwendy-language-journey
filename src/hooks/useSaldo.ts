/**
 * useSaldo — fonte única do saldo do jogador (diamantes negros, XP, baús,
 * fragmentos, cosméticos, ofensiva). Persiste em localStorage e sincroniza
 * entre componentes via CustomEvent.
 *
 * Migrar para Supabase no futuro = trocar load/save por chamadas async.
 */
import { useCallback, useEffect, useState } from "react";

export type Raridade = "comum" | "raro" | "lendario";

export interface Saldo {
  xp: number;
  diamantes: number;
  baus: Record<Raridade, number>;
  fragmentos: number;
  ofensiva: number;
  ultimoDiaAtivo: string;
  curiosidadesLidas: string[];
}

const KEY = "kwendi_saldo_v1";
const EVT = "kwendi:saldo-changed";

const DEFAULT: Saldo = {
  xp: 0,
  diamantes: 1000,
  baus: { comum: 0, raro: 0, lendario: 0 },
  fragmentos: 0,
  ofensiva: 3,
  ultimoDiaAtivo: "",
  curiosidadesLidas: [],
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