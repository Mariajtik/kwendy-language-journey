/**
 * FronteirasIntroScreen.tsx
 * --------------------------
 * Tela introdutória do jogo "Para Além de Fronteiras".
 * Mesma mecânica da ApresentationScreen: vídeo de fundo, slides estilo
 * stories com auto-avanço e CTA final "Vamos?". Acessada pelo ícone
 * AfricaPlane no header da Home. Após a primeira visualização (skip ou
 * conclusão), o flag `kwendi_seen_fronteiras_intro` faz a Home navegar
 * direto para `/para-alem-fronteiras`.
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import fronteirasAsset from "@/assets/fronteiras.mp4.asset.json";

type Slide = { bold?: string; text: string };
const SLIDES: Slide[] = [
  {
    bold: "Para Além de Fronteiras",
    text: "Um jogo para descobrir África pelos olhos de quem a vive.",
  },
  {
    text:
      "Cada país tem a sua história, os seus sabores, os seus heróis. Mas conhecemos mesmo os nossos vizinhos?",
  },
  {
    text:
      "«Sou angolano, conheço Angola.» E o Senegal? E o Quénia? E a Etiópia?",
  },
  {
    text:
      "Aqui vais responder a curiosidades de todo o continente — e ganhar diamantes a cada acerto.",
  },
  {
    text:
      "Vamos atravessar fronteiras juntos? A primeira escala já está marcada.",
  },
];

const SLIDE_DURATION = 6500;
const STORAGE_KEY = "kwendi_seen_fronteiras_intro";

const FronteirasIntroScreen = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (paused || finished) return;
    const t = setTimeout(() => {
      if (index < SLIDES.length - 1) setIndex(index + 1);
      else setFinished(true);
    }, SLIDE_DURATION);
    return () => clearTimeout(t);
  }, [index, paused, finished]);

  useEffect(() => {
    videoRef.current?.play().catch(() => undefined);
  }, []);

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
    localStorage.setItem(STORAGE_KEY, "1");
    navigate("/para-alem-fronteiras", { replace: true });
  };

  const handleGo = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1");
      navigate("/para-alem-fronteiras", { replace: true });
    }, 900);
  };

  const current = SLIDES[index];

  return (
    <div
      className="relative w-full overflow-hidden"
      onPointerDown={() => videoRef.current?.play().catch(() => undefined)}
      style={{ minHeight: "100dvh" }}
    >
      <div
        className="relative mx-auto h-[100dvh] w-full max-w-[480px] overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsl(var(--kwendi-green)) 0%, hsl(var(--kwendi-forest)) 100%)" }}
      >
        <video
          ref={videoRef}
          src={fronteirasAsset.url}
          autoPlay
          preload="auto"
          loop
          muted={muted}
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25" />

        <div
          className="absolute inset-0"
          onClick={handleTap}
          aria-label="Área interativa: toque à direita avança, à esquerda recua"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4">
          <div className="flex flex-1 gap-1 mr-3">
            {SLIDES.map((_, i) => (
              <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
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
          <button
            onClick={handleSkip}
            className="rounded-full bg-white/20 backdrop-blur px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-white/30 transition"
          >
            Pular
          </button>
        </div>

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

        {/* Bottom card */}
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
                    <span className="font-black">{current.bold}</span>
                  </p>
                )}
                <p className="text-base font-semibold leading-relaxed">{current.text}</p>
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

export default FronteirasIntroScreen;