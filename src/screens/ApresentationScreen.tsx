/**
 * ApresentationScreen.tsx
 * ------------------------
 * Tela de apresentação que aparece apenas na primeira abertura do app.
 *
 * - Vídeo `mountain.mp4` como background em fullscreen (mobile) e dentro
 *   do app-shell (desktop) preservando a sensação Duolingo-like.
 * - Botão "PULAR" no canto superior direito.
 * - Slides de texto (a Kwendi falando) numa caixa inferior verde suave
 *   com fade-in/fade-out via framer-motion.
 * - Controles por toque:
 *     • toque no lado direito → próximo slide
 *     • toque no lado esquerdo → slide anterior
 * - No último slide o texto faz fade-out e surge o botão "Vamos?"
 *   (verde da paleta). Ao clicar, muda para "Vamos!" enquanto processa
 *   e navega para /features.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import mountainAsset from "@/assets/mountain.mp4.asset.json";

/* ----- Conteúdo dos slides (resumido e fluido) ----- */
type Slide = { bold?: string; text: string };
const SLIDES: Slide[] = [
  {
    bold: "Olá, eu sou a Kwendi",
    text: "Vem comigo nesta viagem pela nossa língua.",
  },
  {
    text:
      "Este fundo relaxante é para refletirmos. As línguas são como a natureza, concordas comigo?",
  },
  {
    text:
      "Cada região tem fauna e flora únicas. É lindo, é majestoso — mas quando não cuidamos, entram em extinção.",
  },
  {
    text:
      "O mesmo acontece com as línguas: são a expressão mais perfeita da identidade cultural de um povo. «Línguas africanas são a base essencial para a descolonização da mente do africano.»",
  },
  {
    text:
      "Que ninguém poupe esforço! Angola precisa de ser igual a si mesma. Tenha orgulho da herança do seu povo.",
  },
];

/* Duração de cada slide (ms) */
const SLIDE_DURATION = 6500;

const ApresentationScreen = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* Auto-avanço */
  useEffect(() => {
    if (paused || finished) return;
    const t = setTimeout(() => {
      if (index < SLIDES.length - 1) setIndex(index + 1);
      else setFinished(true);
    }, SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [index, paused, finished]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Em alguns browsers mobile o autoplay só começa após interação.
      });
    }
  }, []);

  /** Lida com toque na área do vídeo */
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const side: "L" | "R" =
      e.clientX - rect.left < rect.width / 2 ? "L" : "R";

    setPaused(false);
    videoRef.current?.play().catch(() => undefined);

    if (side === "R") {
      if (index < SLIDES.length - 1) setIndex(index + 1);
      else setFinished(true);
    } else {
      if (finished) setFinished(false);
      if (index > 0) setIndex(index - 1);
    }
  };

  const handleSkip = () => {
    setFlag("kwendi_seen_apresentation");
    navigate("/features", { replace: true });
  };

  const handleGo = () => {
    setLoading(true);
    setTimeout(() => {
      setFlag("kwendi_seen_apresentation");
      navigate("/features", { replace: true });
    }, 900);
  };

  const current = SLIDES[index];

  return (
    <div
      className="relative w-full overflow-hidden"
      onPointerDown={() => videoRef.current?.play().catch(() => undefined)}
      style={{ minHeight: "100dvh" }}
    >
      {/* Wrapper centralizado em telas grandes (estilo mockup mobile) */}
      <div
        className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsl(var(--kwendi-green)) 0%, hsl(var(--kwendi-forest)) 100%)" }}
      >
        {/* Vídeo background */}
        <video
          ref={videoRef}
          src={mountainAsset.url}
          autoPlay
          preload="auto"
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay para legibilidade */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Área de toque (controla pausa/avanço/recuo) */}
        <div
          className="absolute inset-0"
          onClick={handleTap}
          aria-label="Área interativa: 1 toque pausa, duplo toque avança ou recua"
        />

        {/* ---- Top bar ---- */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          {/* Indicadores de progresso (stories) */}
          <div className="flex flex-1 gap-1 mr-3">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <div
                  className="h-full bg-white transition-all"
                  style={{
                    width:
                      i < index ? "100%" : i === index && !finished ? "60%" : i === index && finished ? "100%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>
          {/* Botão PULAR */}
          <button
            onClick={handleSkip}
            className="rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-white/30 transition"
          >
            Pular
          </button>
        </div>

        {/* Botão de som */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const v = videoRef.current;
            const next = !muted;
            setMuted(next);
            if (v) {
              v.muted = next;
              if (!next) v.play().catch(() => undefined);
            }
          }}
          aria-label={muted ? "Ativar som" : "Desativar som"}
          className="absolute top-14 right-4 z-20 rounded-full bg-white/20 backdrop-blur p-2.5 text-white hover:bg-white/30 transition"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        {/* Indicador de pausa */}
        <AnimatePresence>
          {paused && !finished && (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/40 p-4 backdrop-blur"
            >
              <div className="flex gap-1.5">
                <div className="h-6 w-1.5 rounded-sm bg-white" />
                <div className="h-6 w-1.5 rounded-sm bg-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Caixa inferior: texto ou CTA final ---- */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 pointer-events-none">
          <AnimatePresence mode="wait">
            {!finished ? (
              <motion.div
                key={`slide-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="rounded-2xl px-5 py-5 text-white shadow-lg"
                style={{ background: "hsl(var(--kwendi-green) / 0.78)", backdropFilter: "blur(6px)" }}
              >
                {current.bold && (
                  <p className="text-2xl leading-tight mb-1 font-semibold">
                    Olá, eu sou a <span className="font-black">Kwendi</span>
                  </p>
                )}
                <p className="text-base font-semibold leading-relaxed">
                  {current.text}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="pointer-events-auto flex flex-col items-center"
              >
                <button
                  className="btn-duo btn-duo-green max-w-xs flex items-center justify-center gap-2"
                  onClick={handleGo}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                        aria-hidden
                      />
                      Vamos!
                    </>
                  ) : (
                    "Vamos?"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ApresentationScreen;