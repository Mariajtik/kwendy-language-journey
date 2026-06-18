/**
 * ConfirmarCompraModal — bottom sheet com saldo antes/depois.
 */
import { motion, AnimatePresence } from "framer-motion";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import type { ItemLoja } from "@/data/loja";

interface Props {
  item: ItemLoja | null;
  saldoAtual: number;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ConfirmarCompraModal = ({ item, saldoAtual, onConfirmar, onCancelar }: Props) => (
  <AnimatePresence>
    {item && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
        onClick={onCancelar}
      >
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl p-6 border-2 border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ background: `hsl(${item.cor} / 0.15)` }}
            >
              {item.imagem ? (
                <img src={item.imagem} alt="" className="h-12 w-12 object-contain" />
              ) : (
                <span className="text-3xl">{item.emoji}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-foreground">{item.nome}</h3>
              <p className="text-xs text-muted-foreground">{item.descricao}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-muted p-3 text-sm space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Saldo atual</span>
              <span className="font-bold flex items-center gap-1">
                <DiamanteNegro className="w-3.5 h-3.5" /> {saldoAtual.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Custo</span>
              <span className="font-bold text-primary">- {item.preco.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 mt-1">
              <span className="text-muted-foreground">Depois</span>
              <span className="font-extrabold flex items-center gap-1">
                <DiamanteNegro className="w-3.5 h-3.5" /> {(saldoAtual - item.preco).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancelar}
              className="flex-1 rounded-2xl py-3 font-bold border-2 border-border text-muted-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              className="flex-1 rounded-2xl py-3 font-extrabold text-white"
              style={{
                background: `hsl(${item.cor})`,
                boxShadow: `0 3px 0 hsl(${item.cor} / 0.5)`,
              }}
            >
              Comprar
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmarCompraModal;