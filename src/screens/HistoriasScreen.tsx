/**
 * HistoriasScreen.tsx — placeholder "Histórias" tab.
 */
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const HistoriasScreen = () => (
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
      </div>
    </div>
    <BottomNav active="book" />
  </motion.div>
);

export default HistoriasScreen;