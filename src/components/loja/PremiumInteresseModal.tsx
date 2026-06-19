/**
 * PremiumInteresseModal — confirma o registo do lead Premium e mostra
 * a posição do utilizador na fila de interessados.
 */
import { AnimatePresence, motion } from "framer-motion";
import { X, Flame } from "lucide-react";

interface Props {
  posicao: number | null;
  onFechar: () => void;
}

const PremiumInteresseModal = ({ posicao, onFechar }: Props) => (
  <AnimatePresence>
    {posicao !== null && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFechar}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm rounded-3xl p-6 text-center text-white relative"
          style={{
            background:
              "linear-gradient(135deg, hsl(15 90% 50%), hsl(45 96% 53%))",
            boxShadow: "0 8px 0 hsl(15 80% 35%)",
          }}
        >
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/20 grid place-items-center"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 grid place-items-center mb-3">
            <Flame className="w-9 h-9" fill="#fff" />
          </div>

          <h3 className="text-xl font-extrabold mb-1">Ndapandula Calwa!</h3>
          <p className="text-sm font-semibold opacity-95">
            És o nº
          </p>
          <p className="text-5xl font-extrabold tabular-nums my-1">
            {posicao}
          </p>
          <p className="text-sm font-semibold opacity-95 mb-4">
            interessado no Pacote Premium.
          </p>

          <p className="text-[13px] font-semibold leading-snug bg-white/15 rounded-xl p-3 mb-4">
            Quando atingirmos massa crítica, ativamos o Premium e avisamos-te
            em primeiro lugar.
          </p>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onFechar}
            className="w-full rounded-2xl py-3 font-extrabold bg-white text-foreground"
            style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.18)" }}
          >
            Continuar
          </motion.button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default PremiumInteresseModal;