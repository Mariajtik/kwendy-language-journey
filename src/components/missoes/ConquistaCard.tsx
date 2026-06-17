/**
 * ConquistaCard — badge circular para o grid de conquistas.
 */
import { motion } from "framer-motion";
import { CATEGORIA_INFO, type ConquistaDef } from "@/data/conquistas";
import type { ConquistaView } from "@/hooks/useMissoes";
import BadgeStar from "./BadgeStar";

interface Props {
  conquista: ConquistaView;
  onClick: () => void;
}

const ConquistaCard = ({ conquista, onClick }: Props) => {
  const { titulo, categoria, meta, progresso, desbloqueada, badge } = conquista;
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
          className="w-20 h-20 grid place-items-center"
          animate={desbloqueada ? { y: [0, -2, 0] } : undefined}
          transition={desbloqueada ? { duration: 2.4, repeat: Infinity } : undefined}
          style={{
            filter: desbloqueada
              ? `drop-shadow(0 4px 6px hsl(${cor} / 0.45))`
              : "drop-shadow(0 2px 3px rgba(0,0,0,0.15))",
          }}
        >
          <BadgeStar cor={badge} locked={!desbloqueada} className="w-full h-full" />
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