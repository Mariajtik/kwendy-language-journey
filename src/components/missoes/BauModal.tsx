/**
 * BauModal — animação de abertura de baú e listagem de drops.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Package } from "lucide-react";
import { BAUS, emojiDrop, rotuloDrop, type DropItem } from "@/data/recompensas";
import type { Raridade } from "@/data/missoes";

interface Props {
  raridade: Raridade | null;
  drops: DropItem[] | null;
  onClose: () => void;
}

const BauModal = ({ raridade, drops, onClose }: Props) => {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!raridade) {
      setAberto(false);
      return;
    }
    const t = setTimeout(() => {
      setAberto(true);
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#FBBD12", "#FFA767", "#FF4D4D"],
      });
    }, 1100);
    return () => clearTimeout(t);
  }, [raridade]);

  if (!raridade) return null;
  const config = BAUS[raridade];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-6"
        onClick={aberto ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.7, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-card rounded-3xl p-6 max-w-xs w-full text-center border-4"
          style={{ borderColor: `hsl(${config.cor})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-extrabold text-foreground">{config.label}</h2>

          <div className="my-6 grid place-items-center">
            <motion.div
              animate={
                aberto
                  ? { scale: [1, 1.15, 1], rotate: 0 }
                  : { rotate: [0, -8, 8, -8, 8, 0] }
              }
              transition={
                aberto
                  ? { duration: 0.5 }
                  : { duration: 0.6, repeat: Infinity }
              }
              className="w-24 h-24 rounded-3xl grid place-items-center"
              style={{ background: `hsl(${config.cor} / 0.2)` }}
            >
              <Package
                className="w-14 h-14"
                style={{ color: `hsl(${config.cor})` }}
                strokeWidth={2.2}
              />
            </motion.div>
          </div>

          {!aberto && (
            <p className="text-sm font-bold text-muted-foreground">A abrir…</p>
          )}

          {aberto && drops && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <p className="text-sm font-bold text-muted-foreground mb-2">Você recebeu:</p>
              {drops.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted"
                >
                  <span className="text-xl">{emojiDrop(d)}</span>
                  <span className="font-extrabold text-foreground text-sm">
                    {rotuloDrop(d)}
                  </span>
                </motion.div>
              ))}
              <button onClick={onClose} className="btn-duo btn-duo-primary mt-4">
                Ótimo!
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BauModal;