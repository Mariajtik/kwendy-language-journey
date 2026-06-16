/**
 * MissoesScreen.tsx — placeholder "Missões" tab.
 */
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const MissoesScreen = () => (
  <motion.div
    className="app-shell relative bg-background"
    style={{ minHeight: "100dvh" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="px-6 pt-8 pb-32">
      <h1 className="text-2xl font-extrabold text-foreground mb-1">Missões</h1>
      <p className="text-sm text-muted-foreground">
        Desafios diários e semanais para ganhar XP extra.
      </p>

      <div className="mt-12 flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
          style={{ background: "hsl(var(--kwendi-brown) / 0.15)" }}
        >
          <Target className="w-12 h-12" style={{ color: "hsl(var(--kwendi-brown))" }} />
        </div>
        <p className="font-bold text-foreground">Em breve</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          O baú de missões está a ser preparado pela equipa Kwendi.
        </p>
      </div>
    </div>
    <BottomNav active="chest" />
  </motion.div>
);

export default MissoesScreen;