/**
 * MochilaSheet — bottom sheet com o inventário do jogador.
 * Power-ups ativos, desbloqueios e atalho para a Loja.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Backpack, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useInventario } from "@/hooks/useInventario";
import { ITENS_LOJA, getItem, type ItemId } from "@/data/loja";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

const POWERUP_IDS: ItemId[] = ["manter-chama", "dobrador-xp", "dica-extra", "vida-extra"];

const MochilaSheet = ({ aberto, onFechar }: Props) => {
  const nav = useNavigate();
  const { inventario, tempoRestante } = useInventario();

  const linhas = POWERUP_IDS.map((id) => {
    const item = getItem(id);
    const p = inventario.powerUps.find((x) => x.itemId === id);
    return { item, qtd: p?.quantidade ?? 0, restante: tempoRestante(id) };
  }).filter((l) => l.item);

  const desbloqueios = inventario.desbloqueios
    .map((id) => ITENS_LOJA.find((i) => i.id === id))
    .filter(Boolean);

  const vazio =
    linhas.every((l) => l.qtd === 0) && desbloqueios.length === 0;

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
        >
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl border-2 border-border p-5 max-h-[80dvh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                <Backpack className="w-5 h-5" style={{ color: "hsl(160 60% 35%)" }} />
                Mochila
              </h2>
              <button
                onClick={onFechar}
                aria-label="Fechar"
                className="w-9 h-9 rounded-xl border-2 border-border grid place-items-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {vazio ? (
              <div className="text-center py-8">
                <Backpack
                  className="w-12 h-12 mx-auto mb-2"
                  style={{ color: "hsl(160 60% 35%)" }}
                />
                <p className="text-sm text-muted-foreground mb-4">
                  A tua mochila está vazia. Visita a loja!
                </p>
              </div>
            ) : (
              <>
                <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-2">
                  POWER-UPS
                </p>
                <div className="space-y-2 mb-4">
                  {linhas.map(({ item, qtd, restante }) => (
                    <div
                      key={item!.id}
                      className="flex items-center gap-3 rounded-2xl border-2 border-border p-3"
                      style={{ opacity: qtd === 0 ? 0.45 : 1 }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl grid place-items-center text-xl"
                        style={{ background: `hsl(${item!.cor} / 0.15)` }}
                      >
                        {item!.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm text-foreground leading-tight">
                          {item!.nome}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {qtd === 0
                            ? "não tens"
                            : restante !== null && restante > 0
                            ? `ativo · ${restante} min restantes`
                            : "pronto a usar"}
                        </p>
                      </div>
                      <span
                        className="font-extrabold text-sm tabular-nums px-2 py-1 rounded-lg"
                        style={{
                          background: `hsl(${item!.cor} / 0.18)`,
                          color: `hsl(${item!.cor})`,
                        }}
                      >
                        ×{qtd}
                      </span>
                    </div>
                  ))}
                </div>

                {desbloqueios.length > 0 && (
                  <>
                    <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-2">
                      DESBLOQUEIOS
                    </p>
                    <div className="space-y-2 mb-4">
                      {desbloqueios.map((d) => (
                        <div
                          key={d!.id}
                          className="flex items-center gap-3 rounded-2xl border-2 border-border p-3"
                        >
                          <div
                            className="w-10 h-10 rounded-xl grid place-items-center text-xl"
                            style={{ background: `hsl(${d!.cor} / 0.15)` }}
                          >
                            {d!.emoji ?? "✓"}
                          </div>
                          <p className="flex-1 font-extrabold text-sm text-foreground leading-tight">
                            {d!.nome}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <button
              onClick={() => {
                onFechar();
                nav("/loja");
              }}
              className="w-full rounded-2xl py-3 font-extrabold text-white flex items-center justify-center gap-2"
              style={{
                background: "hsl(var(--primary))",
                boxShadow: "0 3px 0 hsl(var(--kwendi-red-dark))",
              }}
            >
              <ShoppingBag className="w-4 h-4" /> Abrir loja
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MochilaSheet;