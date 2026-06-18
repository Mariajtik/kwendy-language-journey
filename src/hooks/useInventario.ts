/**
 * useInventario — power-ups ativos e desbloqueios (histórias, packs).
 * Persiste em localStorage. Compras passam por useLoja.
 */
import { useCallback, useEffect, useState } from "react";
import type { ItemId } from "@/data/loja";

export interface PowerUpAtivo {
  itemId: ItemId;
  quantidade: number;
  expiraEm?: string; // ISO
}

export interface Inventario {
  powerUps: PowerUpAtivo[];
  desbloqueios: ItemId[];
}

const KEY = "kwendi.inventario";
const EVT = "kwendi:inventario-changed";

const DEFAULT: Inventario = { powerUps: [], desbloqueios: [] };

function load(): Inventario {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as Partial<Inventario>;
    return {
      powerUps: p.powerUps ?? [],
      desbloqueios: p.desbloqueios ?? [],
    };
  } catch {
    return DEFAULT;
  }
}

function save(inv: Inventario) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(inv));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function getInventario(): Inventario {
  return load();
}

export function setInventario(updater: (prev: Inventario) => Inventario) {
  const next = updater(load());
  save(next);
  return next;
}

export function useInventario() {
  const [inv, setLocal] = useState<Inventario>(load);

  useEffect(() => {
    const sync = () => setLocal(load());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (prev: Inventario) => Inventario) => {
    setLocal((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const temDesbloqueio = useCallback(
    (id: ItemId) => inv.desbloqueios.includes(id),
    [inv.desbloqueios]
  );

  return { inventario: inv, update, temDesbloqueio };
}