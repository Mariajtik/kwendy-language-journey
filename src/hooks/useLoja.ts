/**
 * useLoja — orquestra compras: valida saldo, debita diamantes,
 * aplica efeito no inventário ou no saldo conforme o tipo do item.
 */
import { useCallback } from "react";
import { useSaldo } from "./useSaldo";
import { setInventario, useInventario } from "./useInventario";
import type { ItemLoja, Raridade } from "@/data/loja";

export type ResultadoCompra =
  | { ok: true }
  | { ok: false; motivo: "saldo-insuficiente" | "ja-possui" };

export function useLoja() {
  const { saldo, update: updateSaldo } = useSaldo();
  const { inventario } = useInventario();

  const comprar = useCallback(
    (item: ItemLoja): ResultadoCompra => {
      // Cultura: já desbloqueado?
      if (item.categoria === "cultura" && inventario.desbloqueios.includes(item.id)) {
        return { ok: false, motivo: "ja-possui" };
      }
      if (saldo.diamantes < item.preco) {
        return { ok: false, motivo: "saldo-insuficiente" };
      }

      // Debita
      updateSaldo((prev) => ({ ...prev, diamantes: prev.diamantes - item.preco }));

      // Aplica efeito
      if (item.categoria === "bau") {
        if (item.id === "pacote-fragmentos") {
          updateSaldo((prev) => ({ ...prev, fragmentos: prev.fragmentos + 10 }));
        } else {
          const map: Record<string, Raridade> = {
            "bau-comum": "comum",
            "bau-raro": "raro",
            "bau-lendario": "lendario",
          };
          const rar = map[item.id];
          if (rar) {
            updateSaldo((prev) => ({
              ...prev,
              baus: { ...prev.baus, [rar]: prev.baus[rar] + 1 },
            }));
          }
        }
      } else if (item.categoria === "cultura") {
        setInventario((prev) => ({
          ...prev,
          desbloqueios: [...prev.desbloqueios, item.id],
        }));
      } else if (item.categoria === "powerup") {
        const expiraEm = item.duracaoMin
          ? new Date(Date.now() + item.duracaoMin * 60_000).toISOString()
          : undefined;
        setInventario((prev) => {
          const existente = prev.powerUps.find((p) => p.itemId === item.id);
          const powerUps = existente
            ? prev.powerUps.map((p) =>
                p.itemId === item.id
                  ? { ...p, quantidade: p.quantidade + 1, expiraEm: expiraEm ?? p.expiraEm }
                  : p
              )
            : [...prev.powerUps, { itemId: item.id, quantidade: 1, expiraEm }];
          return { ...prev, powerUps };
        });
      }

      return { ok: true };
    },
    [saldo.diamantes, inventario.desbloqueios, updateSaldo]
  );

  return { comprar, saldo, inventario };
}