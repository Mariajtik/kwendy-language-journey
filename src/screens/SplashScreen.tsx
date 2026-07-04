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
import { getLegacyFlag } from "@/lib/backend/prefsFlags";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { consumeOAuthNext, getOAuthErrorFromUrl } from "@/lib/authRedirect";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  /** false = vermelho puro; true = vermelho + palavra "Kwendi" */
  const [showWordmark, setShowWordmark] = useState(false);

  useEffect(() => {
    const oauthError = getOAuthErrorFromUrl();
    if (oauthError) {
      toast.error(oauthError);
      navigate("/login", { replace: true });
      return;
    }

    if (loading) return;

    if (session) {
      navigate(consumeOAuthNext("/home"), { replace: true });
      return;
    }

    /* Fase 1 (1s vermelho puro) → Fase 2 (1s com wordmark). */
    const wordmarkTimer = setTimeout(() => setShowWordmark(true), 1000);

    /* Após mais 1s, segue para a próxima tela.
       Primeira visita → /apresentation; depois → /welcome. */
    const navTimer = setTimeout(() => {
      const seenApresentation = getLegacyFlag("kwendi_seen_apresentation");
      const next = seenApresentation ? "/welcome" : "/apresentation";
      navigate(next, { replace: true });
    }, 2000);

    return () => {
      clearTimeout(wordmarkTimer);
      clearTimeout(navTimer);
    };
  }, [loading, navigate, session]);

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
