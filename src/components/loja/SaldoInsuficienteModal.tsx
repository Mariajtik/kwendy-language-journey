import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DiamanteNegro from "@/components/icons/DiamanteNegro";

interface Props {
  faltam: number;
  aberto: boolean;
  onFechar: () => void;
}

const SaldoInsuficienteModal = ({ faltam, aberto, onFechar }: Props) => {
  const nav = useNavigate();
  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6"
          onClick={onFechar}
        >
          <motion.div
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-3xl p-6 max-w-sm w-full text-center border-2 border-border"
          >
            <div className="text-5xl mb-2">😅</div>
            <h3 className="font-extrabold text-foreground text-lg">
              Diamantes insuficientes
            </h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              Faltam <DiamanteNegro className="w-3.5 h-3.5" />
              <span className="font-bold">{faltam.toLocaleString()}</span>
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={onFechar}
                className="flex-1 rounded-2xl py-3 font-bold border-2 border-border text-muted-foreground"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  onFechar();
                  nav("/missoes");
                }}
                className="flex-1 rounded-2xl py-3 font-extrabold text-white bg-primary"
                style={{ boxShadow: "0 3px 0 hsl(var(--primary) / 0.5)" }}
              >
                Ganhar mais
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaldoInsuficienteModal;