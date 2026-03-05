/**
 * SplashScreen.tsx
 * ----------------
 * The very first screen the user sees.
 * Shows the Kwendy logo on a solid red background for 3 seconds,
 * then navigates to the Welcome screen with a fade animation.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";

const SplashScreen = () => {
  const navigate = useNavigate();

  /**
   * After 3 seconds, navigate to the welcome screen.
   * The AnimatePresence in App.tsx handles the exit animation.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome", { replace: true });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      /* Full-screen red background */
      className="app-shell flex items-center justify-center"
      style={{ background: "hsl(var(--primary))", minHeight: "100dvh" }}
      /* Fade-in on mount */
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      /* Fade-out on exit */
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Kwendy logo — animated scale-in */}
      <motion.img
        src={logo}
        alt="Kwendy logo"
        className="w-56 rounded-2xl shadow-2xl"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
      />
    </motion.div>
  );
};

export default SplashScreen;
