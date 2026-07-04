/**
 * useInventario — power-ups ativos e desbloqueios (histórias, packs).
 * Persiste em localStorage. Compras passam por useLoja.
 */
import { useCallback, useEffect, useState } from "react";
import type { ItemId } from "@/data/loja";
import { premiumAtivoStatic } from "@/contexts/PremiumContext";
import { ITENS_LOJA } from "@/data/loja";
import { pushKey } from "@/lib/backend/mirror";

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
  pushKey(KEY, inv);
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
    (id: ItemId) => {
      if (inv.desbloqueios.includes(id)) return true;
      // Premium: todos os itens da categoria "cultura" ficam desbloqueados.
      if (premiumAtivoStatic()) {
        const item = ITENS_LOJA.find((i) => i.id === id);
        if (item?.categoria === "cultura") return true;
      }
      return false;
    },
    [inv.desbloqueios]
  );

  const temPowerUp = useCallback(
    (id: ItemId) => {
      const p = inv.powerUps.find((x) => x.itemId === id);
      if (!p || p.quantidade <= 0) return false;
      if (p.expiraEm && new Date(p.expiraEm).getTime() < Date.now()) return false;
      return true;
    },
    [inv.powerUps]
  );

  const tempoRestante = useCallback(
    (id: ItemId): number | null => {
      const p = inv.powerUps.find((x) => x.itemId === id);
      if (!p?.expiraEm) return null;
      const ms = new Date(p.expiraEm).getTime() - Date.now();
      return ms > 0 ? Math.ceil(ms / 60_000) : 0;
    },
    [inv.powerUps]
  );

  const usarPowerUp = useCallback(
    (id: ItemId) => {
      update((prev) => ({
        ...prev,
        powerUps: prev.powerUps
          .map((p) =>
            p.itemId === id ? { ...p, quantidade: Math.max(0, p.quantidade - 1) } : p
          )
          .filter((p) => p.quantidade > 0 || p.expiraEm),
      }));
    },
    [update]
  );

  return { inventario: inv, update, temDesbloqueio, temPowerUp, tempoRestante, usarPowerUp };
}

/** Helper estático (fora de React) para consumir power-ups. */
export function usarPowerUpStatic(id: ItemId) {
  setInventario((prev) => ({
    ...prev,
    powerUps: prev.powerUps
      .map((p) =>
        p.itemId === id ? { ...p, quantidade: Math.max(0, p.quantidade - 1) } : p
      )
      .filter((p) => p.quantidade > 0 || p.expiraEm),
  }));
}

/** Verifica se um dobrador de XP está ativo agora. */
export function dobradorXpAtivo(): boolean {
  if (premiumAtivoStatic()) return true;
  const inv = getInventario();
  const p = inv.powerUps.find((x) => x.itemId === "dobrador-xp");
  if (!p?.expiraEm) return false;
  return new Date(p.expiraEm).getTime() > Date.now();
}