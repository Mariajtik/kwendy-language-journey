/**
 * CuriosidadesScreen.tsx — placeholder "Curiosidades" tab.
 */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const CuriosidadesScreen = () => (
  <motion.div
    className="app-shell relative bg-background"
    style={{ minHeight: "100dvh" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="px-6 pt-8 pb-32">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Curiosidades</h1>
      <p className="text-sm text-muted-foreground">
        Factos sobre cultura, língua e história de Angola.
      </p>

      <div className="mt-12 flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{ background: "hsl(var(--kwendi-blue) / 0.25)" }}
        >
          <Sparkles className="w-12 h-12" style={{ color: "hsl(var(--kwendi-blue))" }} />
        </div>
        <p className="font-bold text-foreground">Em breve</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Vamos surpreender-te com factos pouco conhecidos sobre o país.
        </p>
      </div>
    </div>
    <BottomNav active="search" />
  </motion.div>
);

export default CuriosidadesScreen;