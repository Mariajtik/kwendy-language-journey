/**
 * WelcomeScreen.tsx
 * ------------------
 * Main landing screen after the splash.
 * Shows logo, avatar GIF, greeting text in Umbundu/Portuguese,
 * and 3 action buttons inspired by Duolingo.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.jpg";
import avatar from "@/assets/avatar.jpg";

/* Staggered animation container */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

/* Each child fades up */
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="app-shell flex flex-col items-center px-6 py-8"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center w-full max-w-sm"
      >
        {/* Logo */}
        <motion.img
          variants={item}
          src={logo}
          alt="Kwendy"
          className="w-36 rounded-2xl shadow-lg mb-4"
        />

        {/* Animated avatar / mascot */}
        <motion.img
          variants={item}
          src={avatar}
          alt="Kwendy mascot"
          className="w-28 h-28 rounded-full shadow-md mb-6"
        />

        {/* Greeting text in Umbundu + Portuguese */}
        <motion.div variants={item} className="text-center mb-2">
          <p className="text-lg font-bold text-foreground leading-relaxed">
            Kalunga, ndati okasi?
          </p>
          <p className="text-lg font-bold text-foreground leading-relaxed">
            Onduko yange ame <span style={{ color: "hsl(var(--primary))" }}>Kwendy</span>!
          </p>
        </motion.div>

        <motion.div variants={item} className="text-center mb-2">
          <p className="text-muted-foreground font-semibold">
            Você já fala Umbundu?
          </p>
          <p className="text-muted-foreground font-semibold">Ou não?</p>
          <p className="text-muted-foreground font-semibold">
            A Kwendy irá te ensinar
          </p>
        </motion.div>

        {/* Cultural motivational quote */}
        <motion.p
          variants={item}
          className="text-center text-sm italic mt-2 mb-8"
          style={{ color: "hsl(var(--kwendy-gold))" }}
        >
          "É aqui que começa a sua jornada
          <br />
          pela língua e cultura de Angola."
        </motion.p>

        {/* ---- ACTION BUTTONS ---- */}
        <motion.div variants={item} className="w-full flex flex-col gap-3">
          {/* Primary: Start sign-up */}
          <button
            className="btn-duo btn-duo-primary"
            onClick={() => navigate("/signup")}
          >
            Começar
          </button>

          {/* Secondary: Already have account */}
          <button
            className="btn-duo btn-duo-outline"
            onClick={() => navigate("/login")}
          >
            Já tenho conta
          </button>

          {/* Accent: Stealth mode */}
          <button
            className="btn-duo btn-duo-gold"
            onClick={() => navigate("/stealth")}
          >
            Modo Furtivo
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
