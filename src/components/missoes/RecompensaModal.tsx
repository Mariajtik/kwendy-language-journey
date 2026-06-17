/**
 * RecompensaModal — modal de comemoração ao resgatar missão/conquista.
 */
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Coins, Star, Package } from "lucide-react";
import type { Recompensa } from "@/data/missoes";

interface Props {
  recompensa: Recompensa | null;
  titulo?: string;
  onClose: () => void;
}

const RecompensaModal = ({ recompensa, titulo = "Missão concluída!", onClose }: Props) => {
  useEffect(() => {
    if (!recompensa) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#FF4D4D", "#FBBD12", "#86D05D", "#78D0FF"],
    });
  }, [recompensa]);

  return (
    <AnimatePresence>
      {recompensa && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="bg-card rounded-3xl p-6 max-w-xs w-full text-center border-4"
            style={{ borderColor: "hsl(var(--kwendi-yellow))" }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -8, 8, 0] }}
              transition={{ duration: 0.8 }}
              className="text-5xl mb-2"
            >
              🎉
            </motion.div>
            <h2 className="text-xl font-extrabold text-foreground">{titulo}</h2>
            <p className="text-sm text-muted-foreground mt-1">Você recebeu:</p>

            <div className="mt-4 flex justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted">
                <Star className="w-5 h-5" style={{ color: "hsl(var(--kwendi-yellow))" }} />
                <span className="font-extrabold">+{recompensa.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted">
                <Coins className="w-5 h-5" style={{ color: "hsl(var(--kwendi-peach))" }} />
                <span className="font-extrabold">+{recompensa.kindeles}</span>
              </div>
              {recompensa.bau && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted">
                  <Package className="w-5 h-5" style={{ color: "hsl(var(--kwendi-brown))" }} />
                  <span className="font-extrabold capitalize">Baú {recompensa.bau}</span>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="mt-5 btn-duo btn-duo-primary"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecompensaModal;