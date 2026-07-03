/**
 * useNivelamento — persiste o resultado do teste de nivelamento.
 * Guarda em localStorage: `ancao` (100%), `unidadeSugerida`, `percentagem`,
 * `todosDesbloqueados` (true se ancião), e um flag `popupPendente` para
 * a HomeScreen mostrar a mensagem apenas uma vez após o teste.
 */
import { useCallback, useEffect, useState } from "react";

const KEY = "kwendi:nivelamento";
const EVT = "kwendi:nivelamento-changed";

export type NivelamentoEstado = {
  fez: boolean;
  ancao: boolean;
  percentagem: number;
  acertos: number;
  total: number;
  unidadeSugerida: string | null;
  todosDesbloqueados: boolean;
  popupPendente: null | "ancao" | "posicionado";
};

const DEFAULT: NivelamentoEstado = {
  fez: false,
  ancao: false,
  percentagem: 0,
  acertos: 0,
  total: 0,
  unidadeSugerida: null,
  todosDesbloqueados: false,
  popupPendente: null,
};

function load(): NivelamentoEstado {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function save(e: NivelamentoEstado) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(e));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getNivelamento(): NivelamentoEstado {
  return load();
}

export function setNivelamento(fn: (p: NivelamentoEstado) => NivelamentoEstado): NivelamentoEstado {
  const next = fn(load());
  save(next);
  return next;
}

export function todosDesbloqueadosStatic(): boolean {
  return load().todosDesbloqueados;
}

export function useNivelamento() {
  const [estado, setLocal] = useState<NivelamentoEstado>(load);

  useEffect(() => {
    const sync = () => setLocal(load());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const consumirPopup = useCallback(() => {
    setNivelamento((p) => ({ ...p, popupPendente: null }));
  }, []);

  return { estado, consumirPopup };
}