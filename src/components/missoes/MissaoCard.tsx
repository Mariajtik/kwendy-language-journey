/**
 * MissaoCard — card individual de missão com barra de progresso e botão de resgate.
 */
import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import type { MissaoView } from "@/hooks/useMissoes";

interface Props {
  missao: MissaoView;
  onResgatar: () => void;
}

const MissaoCard = ({ missao, onResgatar }: Props) => {
  const { titulo, descricao, icone: Icone, cor, meta, progresso, concluida, resgatada, recompensa } = missao;
  const pct = Math.min(100, (progresso / meta) * 100);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border-2 p-3.5 transition-colors ${
        resgatada ? "bg-muted/40 border-border opacity-70" : "bg-card border-border"
      }`}
      style={{ boxShadow: resgatada ? "none" : "0 3px 0 hsl(var(--border))" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl grid place-items-center shrink-0"
          style={{ background: `hsl(${cor} / 0.18)`, color: `hsl(${cor})` }}
        >
          {resgatada ? <Check className="w-6 h-6" /> : <Icone className="w-6 h-6" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-extrabold text-foreground text-sm leading-tight truncate">
                {titulo}
              </h3>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                {descricao}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 text-xs font-bold">
              <span style={{ color: "hsl(var(--kwendi-yellow))" }}>⭐{recompensa.xp}</span>
              <span style={{ color: "hsl(var(--kwendi-peach))" }}>🪙{recompensa.kindeles}</span>
              {recompensa.bau && <span>📦</span>}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `hsl(${cor})` }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="text-[11px] font-extrabold text-muted-foreground tabular-nums">
              {progresso}/{meta}
            </span>
          </div>

          {concluida && !resgatada && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onResgatar}
              className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-extrabold text-white"
              style={{
                background: "hsl(var(--kwendi-green))",
                boxShadow: "0 3px 0 hsl(var(--kwendi-green-dark))",
              }}
            >
              <Gift className="w-4 h-4" /> Resgatar
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default MissaoCard;