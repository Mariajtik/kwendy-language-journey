/**
 * ProcessingResultsScreen.tsx
 * Tela pós-teste: Kwendi pensa 4s e revela o resumo CEFR + trilha.
 * A lógica de redirecionamento depende do (nível declarado × CEFR detectado).
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import kwendiImg from "@/assets/characters/kwendi-cutout.png";
import { setNivelamento } from "@/hooks/useNivelamento";
import { setSaldo } from "@/hooks/useSaldo";
import { rotularUnidade } from "@/data/nivelamento";
import { ehCefrAvancado, ehCefrIniciante } from "@/data/nivelamento/motor";
import {
  CATEGORIAS_LABEL,
  type Categoria,
  type Cefr,
} from "@/data/nivelamento/banco";

const ProcessingResultsScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state =
    (location.state as {
      level?: string;
      username?: string;
      acertos?: number;
      total?: number;
      percentagem?: number;
      unidadeSugerida?: string | null;
      cefr?: Cefr;
      pontosFortes?: Categoria[];
      pontosFracos?: Categoria[];
      trilhaSugerida?: string[];
      categorias?: Record<Categoria, { acertos: number; total: number }>;
    }) || {};
  const declarado = state.level || "Iniciante";
  const acertos = state.acertos;
  const total = state.total;
  const percentagem = state.percentagem;
  const cefr = state.cefr ?? null;
  const pontosFortes = state.pontosFortes ?? [];
  const pontosFracos = state.pontosFracos ?? [];
  const trilhaSugerida = state.trilhaSugerida ?? [];
  const categorias = state.categorias ?? null;
  const temResultado = typeof acertos === "number" && typeof total === "number";

  // Regra de posicionamento: nome amigável do declarado.
  const declaradoIsAvancado =
    declarado.toLowerCase().startsWith("avan") || declarado.toLowerCase().startsWith("inter");
  // Se declarou avançado/intermédio mas foi detectado iniciante → força bloqueio.
  const forcarIniciante = !!(cefr && ehCefrIniciante(cefr) && declaradoIsAvancado);
  const detectadoAvancado = !!(cefr && ehCefrAvancado(cefr));
  const unidadeSugerida = forcarIniciante ? "m1u1" : state.unidadeSugerida ?? null;
  const ancao = percentagem === 100 && temResultado;

  const [phase, setPhase] = useState<"thinking" | "done">("thinking");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 4000);
    return () => clearTimeout(t);
  }, []);

  const aoContinuar = () => {
    if (temResultado) {
      if (ancao) {
        setSaldo((s) => ({ ...s, xp: s.xp + 250, diamantes: s.diamantes + 500 }));
      }
      setNivelamento(() => ({
        fez: true,
        ancao,
        percentagem: percentagem ?? 0,
        acertos: acertos ?? 0,
        total: total ?? 0,
        unidadeSugerida: ancao ? null : unidadeSugerida,
        // Ancião ou detectado C1/C2 desbloqueiam todo o curso.
        todosDesbloqueados: ancao || detectadoAvancado,
        popupPendente: ancao ? "ancao" : "posicionado",
        cefr,
        pontosFortes,
        pontosFracos,
        trilhaSugerida,
      }));
    }
    // A HomeScreen já reage a `popupPendente=posicionado` e faz
    // `completarAteUnidade(unidadeSugerida)`, colocando o utilizador na
    // unidade certa da árvore do currículo.
    navigate("/home");
  };

  /** Texto principal do resultado consoante (declarado × detectado). */
  const mensagemResultado = () => {
    if (!temResultado || !cefr) return null;
    if (ancao) return <>Acertou tudo! Você executou uma proeza de poucos. 🏆</>;
    if (forcarIniciante) {
      return (
        <>
          Detectámos <strong>nível Iniciante ({cefr})</strong>. Recomendamos começar do básico
          — segue-nos pela primeira unidade.
        </>
      );
    }
    if (detectadoAvancado) {
      return (
        <>
          <strong>Nível Avançado ({cefr})</strong> detectado! Vamos abrir o curso todo para
          revisão e começar aqui: <strong>{rotularUnidade(unidadeSugerida!)}</strong>.
        </>
      );
    }
    return (
      <>
        <strong>Nível {cefr}</strong> detectado. Começamos por aqui:{" "}
        <strong>{rotularUnidade(unidadeSugerida!)}</strong>.
      </>
    );
  };

  const rotuloBotao =
    forcarIniciante || (unidadeSugerida && !ancao)
      ? "Começar a aprender"
      : ancao
      ? "Explorar o curso"
      : "Continuar";

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
          {/* Linha preta encostada nas botas (a Kwendi pisa nela) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 h-px bg-black"
            style={{ bottom: 24, width: "70%" }}
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
                visible: { transition: { staggerChildren: 0.35 } },
              }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {/* Badge CEFR grande */}
              {temResultado && cefr && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.7 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.6 } },
                  }}
                  className="rounded-full px-5 py-1.5 text-lg font-extrabold"
                  style={{
                    background: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 3px 0 hsl(var(--primary) / 0.5)",
                  }}
                >
                  {cefr}
                </motion.div>
              )}

              {(temResultado
                ? [
                    <>A sua pontuação: <strong>{acertos}/{total} ({percentagem}%)</strong></>,
                    <>O seu nível declarado: <strong>{declarado}</strong></>,
                    mensagemResultado(),
                  ]
                : [
                    <>A sua pontuação: <strong>78/100</strong></>,
                    <>O seu nível: <strong>{declarado}</strong></>,
                    <>Você acertou a maioria das saudações e cumprimentos, mas ainda há espaço para melhorar a pronúncia.</>,
                  ]
              ).map((content, i) => (
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

              {/* Categorias — pontos fortes / a melhorar */}
              {categorias && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                  }}
                  className="w-full rounded-2xl border-2 border-border bg-card p-3 text-left"
                  style={{ boxShadow: "0 2px 0 hsl(var(--border))" }}
                >
                  <p className="text-xs font-extrabold text-muted-foreground mb-2">
                    Desempenho por área
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {(Object.keys(categorias) as Categoria[])
                      .filter((c) => categorias[c].total > 0)
                      .map((c) => {
                        const cat = categorias[c];
                        const pct = Math.round((cat.acertos / cat.total) * 100);
                        const forte = pontosFortes.includes(c);
                        const fraco = pontosFracos.includes(c);
                        return (
                          <div key={c} className="flex items-center gap-2 text-xs">
                            <span className="flex-1 truncate">{CATEGORIAS_LABEL[c]}</span>
                            <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  background: forte
                                    ? "hsl(142 70% 45%)"
                                    : fraco
                                    ? "hsl(5 84% 55%)"
                                    : "hsl(var(--primary))",
                                }}
                              />
                            </div>
                            <span className="w-8 text-right tabular-nums font-bold text-muted-foreground">
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                onClick={aoContinuar}
                className="btn-duo btn-duo-primary w-full mt-4"
              >
                {rotuloBotao}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessingResultsScreen;