/**
 * ProcessingResultsScreen.tsx
 * Tela de "processamento" pós-onboarding: Kwendi pensando 4s,
 * depois revela pontuação, nível e botão Continuar.
 * Front-end apenas — valores mockados.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import kwendiImg from "@/assets/characters/kwendi-cutout.png";

const ProcessingResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { level?: string; username?: string }) || {};
  const level = state.level || "Iniciante";

  const [phase, setPhase] = useState<"thinking" | "done">("thinking");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 4000);
    return () => clearTimeout(t);
  }, []);

  /* Rabisco animado: path com strokeDasharray "desenhando e apagando" */
  const Scribble = ({
    d,
    delay = 0,
  }: {
    d: string;
    delay?: number;
  }) => (
    <motion.path
      d={d}
      fill="none"
      stroke="#1a1a1a"
      strokeWidth={2}
      strokeLinecap="round"
      strokeDasharray="60"
      initial={{ strokeDashoffset: 60 }}
      animate={{ strokeDashoffset: [60, 0, 0, -60] }}
      transition={{
        duration: 1.6,
        times: [0, 0.4, 0.6, 1],
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <div
      className="flex flex-col items-center px-6 py-10"
      style={{ minHeight: "100dvh", background: "#ffffff" }}
    >
      {/* Kwendi + nuvem de pensamento, com linha sob os pés */}
      <div className="relative w-full flex flex-col items-center">
        <div className="relative" style={{ width: 220, height: 280 }}>
          {/* Nuvem de pensamento, posicionada acima/à esquerda da cabeça */}
          <svg
            viewBox="0 0 200 140"
            className="absolute"
            style={{ width: 150, height: 105, top: -30, left: -70 }}
          >
            {/* Bolhinhas conectando à cabeça */}
            <circle cx="160" cy="120" r="5" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
            <circle cx="145" cy="108" r="7" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
            {/* Nuvem principal */}
            <path
              d="M 70 90
                 C 50 90, 40 70, 60 60
                 C 55 40, 80 30, 95 45
                 C 105 25, 140 30, 145 50
                 C 170 50, 180 75, 160 90
                 C 165 105, 140 110, 125 100
                 C 115 115, 85 110, 80 100
                 C 70 105, 60 100, 70 90 Z"
              fill="#ffffff"
              stroke="#1a1a1a"
              strokeWidth="2.5"
            />
            <AnimatePresence mode="wait">
              {phase === "thinking" ? (
                <motion.g
                  key="scribbles"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Scribble d="M 80 65 Q 95 55, 110 65 T 140 65" delay={0} />
                  <Scribble d="M 85 75 Q 105 70, 125 78 T 150 75" delay={0.3} />
                  <Scribble d="M 90 85 Q 110 80, 130 88" delay={0.6} />
                </motion.g>
              ) : (
                <motion.text
                  key="bang"
                  x="110"
                  y="92"
                  textAnchor="middle"
                  fontSize="56"
                  fontWeight="900"
                  fill="hsl(5 84% 42%)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  !
                </motion.text>
              )}
            </AnimatePresence>
          </svg>

          {/* Kwendi de corpo inteiro */}
          <img
            src={kwendiImg}
            alt="Kwendi"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-full w-auto object-contain"
          />
          {/* Linha preta sob os pés (a Kwendi pisa nela) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 h-px bg-black"
            style={{ bottom: 6, width: "70%" }}
          />
        </div>
      </div>

      {/* Conteúdo dinâmico */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mt-6 text-center">
        <AnimatePresence mode="wait">
          {phase === "thinking" ? (
            <motion.p
              key="wait"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-base text-foreground font-bold"
            >
              Aguarde um pouco, está bem? Daqui a nada receberá os resultados!
            </motion.p>
          ) : (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.6 } },
              }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {[
                <>A sua pontuação: <strong>78/100</strong></>,
                <>O seu nível: <strong>{level}</strong></>,
                <>Você acertou a maioria das saudações e cumprimentos, mas ainda há espaço para melhorar a pronúncia.</>,
              ].map((content, i) => (
                <motion.p
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  className="text-base text-foreground"
                >
                  {content}
                </motion.p>
              ))}
              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                onClick={() => navigate("/home")}
                className="btn-duo btn-duo-primary w-full mt-4"
              >
                Continuar
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessingResultsScreen;