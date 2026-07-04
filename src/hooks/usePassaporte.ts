/**
 * Passaporte de África — persistência local dos países já "carimbados"
 * pelo utilizador no jogo Para Além de Fronteiras.
 */
import { useCallback, useEffect, useState } from "react";
import { pushKey } from "@/lib/backend/mirror";

const KEY = "kwendi:fronteiras:passaporte";

export interface Carimbo {
  iso: string;
  data: string;   // ISO date
  acertos: number;
}

export type PassaporteState = Record<string, Carimbo>;

function load(): PassaporteState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PassaporteState;
  } catch {
    return {};
  }
}

function save(s: PassaporteState) {
  if (typeof window === "undefined") return;
  pushKey(KEY, s);
}

export function usePassaporte() {
  const [carimbados, setCarimbados] = useState<PassaporteState>(() => load());

  useEffect(() => {
    save(carimbados);
  }, [carimbados]);

  const carimbar = useCallback((iso: string) => {
    if (!iso || iso === "AFR") return;
    setCarimbados((prev) => {
      const existente = prev[iso];
      return {
        ...prev,
        [iso]: {
          iso,
          data: existente?.data ?? new Date().toISOString(),
          acertos: (existente?.acertos ?? 0) + 1,
        },
      };
    });
  }, []);

  return { carimbados, carimbar, total: Object.keys(carimbados).length };
}