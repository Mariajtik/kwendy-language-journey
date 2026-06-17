/**
 * FronteirasScreen.tsx
 * ---------------------
 * Placeholder do jogo "Para Além de Fronteiras". O banco de perguntas
 * ainda não existe — esta tela apenas anuncia o jogo e dá um caminho
 * de volta para a Home. O avião orbita suavemente o mapa de África
 * enquanto aguardamos as primeiras escalas.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Play, X } from "lucide-react";
import africa from "@/assets/africa.png.asset.json";
import plane from "@/assets/plane.png.asset.json";

const FronteirasScreen = () => {
  const navigate = useNavigate();
  const [playerOpen, setPlayerOpen] = useState(false);

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
          className="btn-duo btn-duo-blue mt-8 mx-auto"
        >
          Voltar à Home
        </button>

        {/* Trilha sonora — Apple Music */}
        <button
          onClick={() => setPlayerOpen(true)}
          className="mt-6 mx-auto flex items-center gap-3 rounded-full bg-[hsl(var(--kwendi-blue))] px-5 py-3 text-white shadow-md hover:opacity-90 transition"
          aria-label="Tocar África Minha de Bonga e Plutónio"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/25">
            <Play className="w-4 h-4 fill-white" />
          </span>
          <span className="text-left">
            <span className="block text-[11px] uppercase tracking-wider font-extrabold opacity-80">Trilha sonora</span>
            <span className="block text-sm font-black leading-tight">África Minha · Bonga & Plutónio</span>
          </span>
        </button>
      </div>

      {/* Modal do player Apple Music */}
      {playerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setPlayerOpen(false)}
        >
          <div
            className="relative w-full max-w-[460px] rounded-t-3xl sm:rounded-3xl bg-card p-4 pt-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlayerOpen(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 rounded-full bg-muted p-2 hover:bg-muted/80"
            >
              <X className="w-4 h-4" />
            </button>
            <iframe
              title="África Minha — Bonga & Plutónio"
              allow="autoplay *; encrypted-media *;"
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              height={175}
              style={{ width: "100%", overflow: "hidden", borderRadius: 12, background: "transparent" }}
              src="https://embed.music.apple.com/ao/song/%C3%A1frica-minha-feat-bonga/1177428682"
            />
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Pré-visualização via Apple Music. Toca o ▶ para começar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FronteirasScreen;