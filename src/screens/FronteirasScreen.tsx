/**
 * FronteirasScreen.tsx
 * ---------------------
 * Placeholder do jogo "Para Além de Fronteiras". O banco de perguntas
 * ainda não existe — esta tela apenas anuncia o jogo e dá um caminho
 * de volta para a Home. O avião orbita suavemente o mapa de África
 * enquanto aguardamos as primeiras escalas.
 */

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import africa from "@/assets/africa.png.asset.json";
import plane from "@/assets/plane.png.asset.json";

const FronteirasScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Voltar"
          onClick={() => navigate("/home")}
          className="rounded-full bg-muted p-2 text-foreground hover:bg-muted/80 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Jogo
        </span>
        <div className="w-9" />
      </div>

      {/* Mapa + avião orbital */}
      <div className="relative mx-auto mt-10 h-64 w-64">
        <img
          src={africa.url}
          alt="Mapa de África"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <motion.img
          src={plane.url}
          alt=""
          aria-hidden
          className="absolute top-1/2 left-1/2 w-12 h-12 object-contain"
          style={{ originX: 0.5, originY: 0.5 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          // Posiciona o avião num raio fixo do centro
          initial={false}
        >
        </motion.img>
        {/* Avião posicionado via container orbital */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-0 h-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <img
            src={plane.url}
            alt=""
            aria-hidden
            className="absolute w-12 h-12 object-contain"
            style={{ transform: "translate(110px, -28px) rotate(60deg)" }}
          />
        </motion.div>
      </div>

      {/* Texto */}
      <div className="px-6 mt-8 text-center">
        <h1 className="text-2xl font-black text-foreground">
          Para Além de Fronteiras
        </h1>
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          Em breve — aguarda as primeiras escalas.
        </p>

        <div className="mt-6 rounded-2xl bg-muted px-5 py-4 text-left">
          <p className="text-sm leading-relaxed text-foreground">
            As perguntas estão a ser preparadas pelo Soba. Volta em breve
            para descobrir curiosidades de todo o continente.
          </p>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="btn-duo btn-duo-green mt-8 mx-auto"
        >
          Voltar à Home
        </button>
      </div>
    </div>
  );
};

export default FronteirasScreen;