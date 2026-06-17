/**
 * ConquistaModal — detalhe da conquista com progresso e resgate.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Star, Package, X } from "lucide-react";
import { CATEGORIA_INFO, BADGE_IMAGENS, BADGE_BLOQUEADA } from "@/data/conquistas";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import type { ConquistaView } from "@/hooks/useMissoes";

interface Props {
  conquista: ConquistaView | null;
  onClose: () => void;
  onResgatar: (id: string) => void;
}

const ConquistaModal = ({ conquista, onClose, onResgatar }: Props) => (
  <AnimatePresence>
    {conquista && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl p-6 max-w-xs w-full text-center relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          {(() => {
            const cor = CATEGORIA_INFO[conquista.categoria].cor;
            const pct = Math.min(100, (conquista.progresso / conquista.meta) * 100);
            const badgeSrc = conquista.desbloqueada ? BADGE_IMAGENS[conquista.badge] : BADGE_BLOQUEADA;
            return (
              <>
                <div className="mx-auto w-28 h-28 mb-3 grid place-items-center">
                  <img
                    src={badgeSrc}
                    alt={conquista.titulo}
                    className="w-full h-full object-contain"
                    style={{
                      filter: conquista.desbloqueada
                        ? `drop-shadow(0 0 18px hsl(${cor} / 0.5))`
                        : "grayscale(0.2)",
                    }}
                  />
                </div>

                <span
                  className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: `hsl(${cor} / 0.18)`,
                    color: `hsl(${cor})`,
                  }}
                >
                  {CATEGORIA_INFO[conquista.categoria].label}
                </span>

                <h2 className="text-xl font-extrabold text-foreground mt-2">
                  {conquista.titulo}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {conquista.descricao}
                </p>

                <div className="mt-4">
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ background: `hsl(${cor})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground mt-1">
                    {conquista.progresso} / {conquista.meta}
                  </p>
                </div>

                <div className="mt-4 flex justify-center gap-2 flex-wrap text-xs font-extrabold">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted">
                    <Star className="w-3.5 h-3.5" style={{ color: "hsl(var(--kwendi-yellow))" }} />
                    {conquista.recompensa.xp}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted">
                    <DiamanteNegro className="w-3.5 h-3.5" />
                    {conquista.recompensa.diamantes}
                  </span>
                  {conquista.recompensa.bau && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted capitalize">
                      <Package className="w-3.5 h-3.5" style={{ color: "hsl(var(--kwendi-brown))" }} />
                      {conquista.recompensa.bau}
                    </span>
                  )}
                </div>

                {conquista.desbloqueada && !conquista.resgatada && (
                  <button
                    onClick={() => onResgatar(conquista.id)}
                    className="btn-duo btn-duo-green mt-5"
                  >
                    Resgatar recompensa
                  </button>
                )}
                {conquista.resgatada && (
                  <p className="mt-5 text-sm font-extrabold text-muted-foreground">
                    ✓ Recompensa resgatada
                  </p>
                )}
              </>
            );
          })()}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConquistaModal;