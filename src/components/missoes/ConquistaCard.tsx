/**
 * ConquistaCard — badge circular para o grid de conquistas.
 */
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { CATEGORIA_INFO, type ConquistaDef } from "@/data/conquistas";
import type { ConquistaView } from "@/hooks/useMissoes";

interface Props {
  conquista: ConquistaView;
  onClick: () => void;
}

const ConquistaCard = ({ conquista, onClick }: Props) => {
  const { titulo, icone: Icone, categoria, meta, progresso, desbloqueada } = conquista;
  const cor = CATEGORIA_INFO[categoria].cor;
  const pct = Math.min(100, (progresso / meta) * 100);

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div className="relative">
        <motion.div
          className="w-20 h-20 rounded-full grid place-items-center border-[5px]"
          style={{
            background: desbloqueada
              ? `radial-gradient(circle at 30% 30%, hsl(${cor} / 1) 0%, hsl(${cor} / 0.7) 100%)`
              : "hsl(var(--muted))",
            borderColor: desbloqueada ? `hsl(${cor} / 0.5)` : "hsl(var(--border))",
            boxShadow: desbloqueada
              ? `0 4px 0 hsl(${cor} / 0.4), 0 0 24px hsl(${cor} / 0.35)`
              : "0 3px 0 hsl(var(--border))",
          }}
          animate={desbloqueada ? { y: [0, -2, 0] } : undefined}
          transition={desbloqueada ? { duration: 2.4, repeat: Infinity } : undefined}
        >
          {desbloqueada ? (
            <Icone className="w-9 h-9 text-white drop-shadow" strokeWidth={2.3} />
          ) : (
            <Lock className="w-7 h-7 text-muted-foreground/60" strokeWidth={2.3} />
          )}
        </motion.div>

        {!desbloqueada && progresso > 0 && (
          <div className="absolute -bottom-1 left-1 right-1 h-1.5 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: `hsl(${cor})` }}
            />
          </div>
        )}
      </div>
      <p
        className={`text-[11px] font-extrabold leading-tight text-center px-1 ${
          desbloqueada ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {titulo}
      </p>
    </motion.button>
  );
};

export default ConquistaCard;
export type { ConquistaDef };