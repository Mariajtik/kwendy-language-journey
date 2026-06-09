/**
 * SplashScreen.tsx
 * ----------------
 * Two-phase splash:
 *  Phase 1 (0–5s): Solid crimson red screen — brand immersion.
 *  Phase 2 (5–8s): Logo fades in on the red background.
 * After phase 2 → navigate to /welcome with a smooth exit.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = () => {
  const navigate = useNavigate();

  /** false = vermelho puro; true = vermelho + palavra "Kwendi" */
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    /* Fase 1 → Fase 2 após 5 segundos: aparece a wordmark "Kwendi" */
    const wordmarkTimer = setTimeout(() => setShowWordmark(true), 5000);

    /* Após mais 3s, segue para a próxima tela.
       Primeira visita → /apresentation; depois → /welcome. */
    const navTimer = setTimeout(() => {
      const seenApresentation = localStorage.getItem("kwendi_seen_apresentation");
      const next = seenApresentation ? "/welcome" : "/apresentation";
      navigate(next, { replace: true });
    }, 8000);

    return () => {
      clearTimeout(wordmarkTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <motion.div
      className="app-shell flex items-center justify-center"
      style={{ background: "hsl(var(--primary))", minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence>
        {showWordmark && (
          <motion.h1
            key="wordmark"
            className="text-white font-black tracking-tight text-center select-none"
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(3.5rem, 18vw, 6rem)",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Kwendi
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SplashScreen;
