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
import logo from "@/assets/logo.jpg";

const SplashScreen = () => {
  const navigate = useNavigate();

  /** false = pure red; true = red + logo */
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    /* Phase 1 → Phase 2 after 5 seconds */
    const logoTimer = setTimeout(() => setShowLogo(true), 5000);

    /* Navigate away 3 seconds after logo appears (total 8s) */
    const navTimer = setTimeout(() => {
      navigate("/welcome", { replace: true });
    }, 8000);

    return () => {
      clearTimeout(logoTimer);
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
        {showLogo && (
          <motion.img
            src={logo}
            alt="Kwendi logo"
            className="w-56 rounded-2xl shadow-2xl"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SplashScreen;
