/**
 * CompraSucessoModal — confirmação visual de compra.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import type { ItemLoja } from "@/data/loja";
import { playAchievement } from "@/lib/streakFx";

interface Props {
  item: ItemLoja | null;
  onFechar: () => void;
}

const CompraSucessoModal = ({ item, onFechar }: Props) => {
  useEffect(() => {
    if (item) playAchievement();
  }, [item?.id ?? null]);
  return (
  <AnimatePresence>
    {item && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
        onClick={onFechar}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card rounded-3xl p-6 max-w-sm w-full text-center border-2 border-border"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-4"
            style={{ background: `hsl(${item.cor} / 0.15)` }}
          >
            {item.imagem ? (
              <img src={item.imagem} alt="" className="h-20 w-20 object-contain" />
            ) : (
              <span className="text-6xl">{item.emoji}</span>
            )}
          </motion.div>
          <div className="flex items-center justify-center gap-1.5 text-primary font-extrabold mb-1">
            <Sparkles className="w-4 h-4" /> Compra concluída
          </div>
          <h3 className="text-xl font-extrabold text-foreground">{item.nome}</h3>
          <p className="text-sm text-muted-foreground mt-1">Já está no teu inventário.</p>
          <button
            onClick={onFechar}
            className="mt-5 w-full rounded-2xl py-3 font-extrabold text-white"
            style={{
              background: `hsl(${item.cor})`,
              boxShadow: `0 3px 0 hsl(${item.cor} / 0.5)`,
            }}
          >
            Continuar
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default CompraSucessoModal;