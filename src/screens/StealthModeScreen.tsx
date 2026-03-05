/**
 * StealthModeScreen.tsx
 * -----------------------
 * Explains the "Modo Furtivo" (stealth mode) feature.
 * Shows avatar, editable username, explanation, and an "Avançar" button
 * that activates stealth mode for 7 days.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import avatar from "@/assets/avatar.jpg";

const StealthModeScreen = () => {
  const navigate = useNavigate();

  /* Editable username — defaults to "Angola" */
  const [username, setUsername] = useState("Angola");

  /* Whether stealth mode has been activated */
  const [activated, setActivated] = useState(false);

  /* ---- ACTIVATED STATE ---- */
  if (activated) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--kwendy-gold))" }}
        >
          <Check className="w-10 h-10" style={{ color: "hsl(var(--primary-foreground))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">
          Modo furtivo ativado por 7 dias.
        </h1>
        <button
          className="btn-duo btn-duo-primary max-w-xs mt-8"
          onClick={() => navigate("/")}
        >
          Voltar ao início
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex flex-col items-center">
        {/* Avatar */}
        <img
          src={avatar}
          alt="Avatar"
          className="w-28 h-28 rounded-full shadow-lg mb-4 object-cover"
        />

        {/* Editable username */}
        <label className="text-sm text-muted-foreground font-semibold mb-1">
          Nome de usuário
        </label>
        <input
          className="input-duo text-center mb-8 max-w-[200px]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Explanation text */}
        <div className="text-center mb-8 px-2">
          <p className="text-foreground font-semibold leading-relaxed">
            O modo furtivo permite usar o Kwendy por 7 dias
            <br />
            sem criar conta.
          </p>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Explore o aplicativo, aprenda algumas palavras
            <br />
            e descubra a cultura antes de se comprometer.
          </p>
        </div>

        {/* Avançar button */}
        <button
          className="btn-duo btn-duo-gold w-full max-w-xs"
          onClick={() => setActivated(true)}
        >
          Avançar
        </button>
      </div>
    </motion.div>
  );
};

export default StealthModeScreen;
