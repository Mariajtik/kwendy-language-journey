/**
 * WelcomeScreen.tsx
 * ------------------
 * Main landing screen after the splash.
 * Shows logo, scenic nature image, greeting in Umbundu/Portuguese,
 * motivational quote, and 3 action buttons.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import logo from "@/assets/logo.jpg";
import natureRoad from "@/assets/nature-road.jpg";
import { useAuth } from "@/contexts/AuthContext";
import RouteSeo from "@/components/seo/RouteSeo";

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
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && session) navigate("/home", { replace: true });
  }, [loading, navigate, session]);

  return (
    <>
    <RouteSeo
      title="Bem-vindo ao Kwendi — Comece a aprender Umbundu"
      description="Crie a sua conta ou entre no modo furtivo para começar a aprender Umbundu e explorar a cultura angolana com o Kwendi."
      path="/welcome"
    />
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
        {/* Greeting text in Umbundu + Portuguese */}
        <motion.div variants={item} className="text-center mb-1">
          <p className="text-lg font-bold text-foreground leading-relaxed">
            Kalunga, ndati okasi?
          </p>
          <p className="text-lg font-bold text-foreground leading-relaxed">
            Onduko yange ame <span className="text-primary">Kwendi</span>.
          </p>
        </motion.div>

        <motion.div variants={item} className="text-center mb-4">
          <p className="text-muted-foreground font-semibold">
            Você já fala Umbundu?
          </p>
          <p className="text-muted-foreground font-semibold">Ou não?</p>
          <p className="text-muted-foreground font-semibold">
            Junte-se a nós!
          </p>
        </motion.div>

        {/* Scenic nature road image */}
        <motion.div
          variants={item}
          className="w-full rounded-2xl overflow-hidden shadow-lg mb-4"
        >
          <img
            src={natureRoad}
            alt="Estrada entre árvores — o caminho para a descoberta"
            className="w-full h-44 object-cover"
          />
        </motion.div>

        {/* Cultural motivational quote — placed after the image */}
        <motion.p
          variants={item}
          className="text-center text-sm italic mb-6 px-2 font-semibold"
          style={{ color: "hsl(var(--kwendi-forest))" }}
        >
          "Cada caminho começa com um primeiro passo.
          <br />
          Este é o teu rumo pela língua e cultura de Angola."
        </motion.p>

        {/* ---- ACTION BUTTONS ---- */}
        <motion.div variants={item} className="w-full flex flex-col gap-3">
          <button
            className="btn-duo btn-duo-primary"
            onClick={() => navigate("/signup")}
          >
            Começar
          </button>

          <button
            className="btn-duo btn-duo-outline"
            onClick={() => navigate("/login")}
          >
            Já tenho conta
          </button>

          <button
            className="btn-duo btn-duo-gold"
            onClick={() => navigate("/stealth")}
          >
            Modo Furtivo
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
    </>
  );
};

export default WelcomeScreen;
