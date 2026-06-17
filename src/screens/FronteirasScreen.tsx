/**
 * FronteirasScreen.tsx
 * ---------------------
 * Placeholder do jogo "Para Além de Fronteiras". O banco de perguntas
 * ainda não existe — esta tela apenas anuncia o jogo e dá um caminho
 * de volta para a Home. O avião orbita suavemente o mapa de África
 * enquanto aguardamos as primeiras escalas.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Play, Pause } from "lucide-react";
import africa from "@/assets/africa.png.asset.json";
import plane from "@/assets/plane.png.asset.json";
import musicAsset from "@/assets/perola-omboio.mp3.asset.json";
const TRACK_URL = musicAsset.url;

const FronteirasScreen = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tentativa de autoplay silenciosa — muitos browsers exigem gesto do utilizador,
  // por isso ignoramos a rejeição e deixamos o botão tratar do início.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !TRACK_URL) return;
    audio.volume = 0.6;
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    return () => {
      audio.pause();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

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

      {/* Botão dourado de play/pause no canto superior direito */}
      <button
        onClick={toggle}
        aria-label={isPlaying ? "Pausar música de fundo" : "Tocar música de fundo"}
        className="absolute top-4 right-4 z-30 flex items-center justify-center w-12 h-12 rounded-full transition active:translate-y-0.5"
        style={{
          background: "hsl(45 90% 55%)",
          boxShadow: "0 4px 0 hsl(38 80% 38%)",
        }}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white fill-white" />
        ) : (
          <Play className="w-5 h-5 text-white fill-white translate-x-[1px]" />
        )}
      </button>

      {/* Áudio de fundo (loop) */}
      <audio ref={audioRef} src={TRACK_URL} loop preload="auto" />

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
          Testa o que sabes sobre Angola, África e os PALOPs.
        </p>

        <div className="mt-6 rounded-2xl bg-muted px-5 py-4 text-left">
          <p className="text-sm leading-relaxed text-foreground">
            10 perguntas embaralhadas por partida, com explicações,
            XP, Diamantes e conquistas para desbloquear.
          </p>
        </div>

        <button
          onClick={() => navigate("/para-alem-fronteiras/jogo")}
          className="btn-duo btn-duo-blue mt-6 mx-auto"
        >
          Começar jogo
        </button>

        <button
          onClick={() => navigate("/home")}
          className="mt-3 mx-auto block text-sm font-bold text-muted-foreground hover:text-foreground"
        >
          Voltar à Home
        </button>
      </div>
    </div>
  );
};

export default FronteirasScreen;