/**
 * HistoriasScreen.tsx — placeholder "Histórias" tab.
 */
import { motion } from "framer-motion";
import { BookOpen, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useMissoes } from "@/hooks/useMissoes";
import { setSaldo } from "@/hooks/useSaldo";

const HistoriasScreen = () => {
  const { registrarAcao } = useMissoes();
  const concluirHistoria = () => {
    registrarAcao("historia_concluida", 1);
    setSaldo((s) => ({ ...s, xp: s.xp + 80, diamantes: s.diamantes + 20 }));
  };
  return (
  <motion.div
    className="app-shell relative bg-background"
    style={{ minHeight: "100dvh" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="px-6 pt-8 pb-32">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Histórias</h1>
      <p className="text-sm text-muted-foreground">
        Contos tradicionais angolanos para praticar Umbundu.
      </p>

      <div className="mt-12 flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{ background: "hsl(var(--kwendi-peach) / 0.2)" }}
        >
          <BookOpen className="w-12 h-12" style={{ color: "hsl(var(--kwendi-peach))" }} />
        </div>
        <p className="font-bold text-foreground">Em breve</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Os primeiros contos estão a ser narrados por anciãos das províncias.
        </p>
        <button
          onClick={concluirHistoria}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold text-white"
          style={{ background: "hsl(var(--kwendi-peach))", boxShadow: "0 3px 0 hsl(var(--kwendi-peach) / 0.6)" }}
        >
          <Check className="w-4 h-4" /> Marcar conto como concluído (demo)
        </button>
      </div>
    </div>
    <BottomNav active="book" />
  </motion.div>
  );
};

export default HistoriasScreen;