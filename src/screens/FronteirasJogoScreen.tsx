/**
 * FronteirasJogoScreen.tsx
 * -------------------------
 * Jogo interativo de perguntas e respostas sobre Angola, PALOPs e África.
 * - Embaralha perguntas e opções a cada partida (10 perguntas).
 * - Marca correto/errado, mostra explicação e dá XP + Diamantes.
 * - Conquistas locais por tempo, constância e respostas certas.
 * - Música de fundo (Perola-Omboio.mp3) em loop, com botão dourado de play/pause.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, Pause, Check, X, Trophy, Flame } from "lucide-react";
import { PERGUNTAS, type Pergunta } from "@/data/fronteirasPerguntas";
import musicAsset from "@/assets/perola-omboio.mp3.asset.json";
import { useSaldo } from "@/hooks/useSaldo";
import { useMissoes } from "@/hooks/useMissoes";
import { CONQUISTAS, type ConquistaDef } from "@/data/conquistas";

const TRACK_URL = musicAsset.url;
const TOTAL_POR_PARTIDA = 10;
const STATS_KEY = "kwendi:fronteiras:stats";

interface FronteirasStats {
  partidas: number;
  acertosTotais: number;
  melhorStreak: number;
  tempoTotalMs: number;
  diasJogados: string[];
  conquistas: string[];
}

const DEFAULT_STATS: FronteirasStats = {
  partidas: 0,
  acertosTotais: 0,
  melhorStreak: 0,
  tempoTotalMs: 0,
  diasJogados: [],
  conquistas: [],
};

function loadStats(): FronteirasStats {
  if (typeof window === "undefined") return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...(JSON.parse(raw) as Partial<FronteirasStats>) };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(s: FronteirasStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Embaralha as opções e ajusta o índice da resposta correta */
function shuffleOpcoes(p: Pergunta): Pergunta {
  const indices = shuffle(p.opcoes.map((_, i) => i));
  return {
    ...p,
    opcoes: indices.map((i) => p.opcoes[i]),
    respostaCorreta: indices.indexOf(p.respostaCorreta),
  };
}

const FronteirasJogoScreen = () => {
  const navigate = useNavigate();
  const { update } = useSaldo();
  const { desbloquearConquista } = useMissoes();

  /* ---------- Música de fundo ---------- */
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.5;
    a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    return () => a.pause();
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  /* ---------- Estado do jogo ---------- */
  const [perguntas, setPerguntas] = useState<Pergunta[]>(() =>
    shuffle(PERGUNTAS).slice(0, TOTAL_POR_PARTIDA).map(shuffleOpcoes)
  );
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [melhorStreak, setMelhorStreak] = useState(0);
  const [terminou, setTerminou] = useState(false);
  const [xpGanho, setXpGanho] = useState(0);
  const [diaGanho, setDiaGanho] = useState(0);
  const [novasConquistas, setNovasConquistas] = useState<ConquistaDef[]>([]);
  const startRef = useRef<number>(performance.now());

  const perguntaAtual = perguntas[indice];
  const progresso = ((indice + (escolha != null ? 1 : 0)) / TOTAL_POR_PARTIDA) * 100;

  const handleEscolher = (i: number) => {
    if (escolha != null) return;
    setEscolha(i);
    const certo = i === perguntaAtual.respostaCorreta;
    if (certo) {
      setAcertos((a) => a + 1);
      setStreak((s) => {
        const ns = s + 1;
        setMelhorStreak((m) => Math.max(m, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const proxima = () => {
    if (indice + 1 >= perguntas.length) {
      finalizar();
    } else {
      setIndice((i) => i + 1);
      setEscolha(null);
    }
  };

  const finalizar = () => {
    const tempoMs = performance.now() - startRef.current;
    const hoje = new Date().toISOString().slice(0, 10);

    // calcula XP e diamantes
    let xp = acertos * 10 + 20; // 10 por acerto + 20 por completar
    let dia = acertos * 1;
    if (melhorStreak >= 3) {
      xp += 15;
      dia += 2;
    }
    if (melhorStreak >= 5) {
      xp += 30;
      dia += 5;
    }
    if (acertos === TOTAL_POR_PARTIDA) {
      xp += 50;
      dia += 10;
    }

    // atualiza stats persistentes e conquistas
    const prev = loadStats();
    const diasJogados = prev.diasJogados.includes(hoje)
      ? prev.diasJogados
      : [...prev.diasJogados, hoje];
    const next: FronteirasStats = {
      partidas: prev.partidas + 1,
      acertosTotais: prev.acertosTotais + acertos,
      melhorStreak: Math.max(prev.melhorStreak, melhorStreak),
      tempoTotalMs: prev.tempoTotalMs + tempoMs,
      diasJogados,
      conquistas: prev.conquistas.slice(),
    };

    // Avalia conquistas centrais (categoria "fronteiras")
    const desbloqueadas: ConquistaDef[] = [];
    const tentar = (id: string, condicao: boolean, progresso?: number) => {
      const def = CONQUISTAS.find((c) => c.id === id);
      if (!def) return;
      if (condicao) {
        // se ainda não estava marcada localmente, mostramos na lista de novas
        if (!next.conquistas.includes(id)) {
          next.conquistas.push(id);
          desbloqueadas.push(def);
        }
        desbloquearConquista(id, progresso ?? def.meta);
      } else if (progresso != null) {
        // só atualiza progresso parcial sem desbloquear
        desbloquearConquista(id, Math.min(progresso, def.meta - 1));
      }
    };

    tentar("fr1", next.partidas >= 1, next.partidas);
    tentar("fr2", next.acertosTotais >= 10, next.acertosTotais);
    tentar("fr3", next.acertosTotais >= 50, next.acertosTotais);
    tentar("fr4", melhorStreak >= 5);
    tentar("fr5", acertos === TOTAL_POR_PARTIDA);
    tentar("fr6", diasJogados.length >= 3, diasJogados.length);
    tentar("fr7", next.tempoTotalMs >= 10 * 60 * 1000);

    saveStats(next);
    update((s) => ({ ...s, xp: s.xp + xp, diamantes: s.diamantes + dia }));

    setXpGanho(xp);
    setDiaGanho(dia);
    setNovasConquistas(desbloqueadas);
    setTerminou(true);
  };

  const jogarNovamente = () => {
    setPerguntas(shuffle(PERGUNTAS).slice(0, TOTAL_POR_PARTIDA).map(shuffleOpcoes));
    setIndice(0);
    setEscolha(null);
    setAcertos(0);
    setStreak(0);
    setMelhorStreak(0);
    setXpGanho(0);
    setDiaGanho(0);
    setNovasConquistas([]);
    setTerminou(false);
    startRef.current = performance.now();
  };

  /* ---------- Render ---------- */
  return (
    <div className="relative mx-auto min-h-[100dvh] w-full max-w-[480px] overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        <button
          aria-label="Voltar"
          onClick={() => navigate("/para-alem-fronteiras")}
          className="rounded-full bg-muted p-2 text-foreground hover:bg-muted/80 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
          Para Além de Fronteiras
        </span>
        <div className="w-9" />
      </div>

      {/* Botão dourado de play/pause */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pausar música" : "Tocar música"}
        className="absolute top-4 right-4 z-30 flex items-center justify-center w-12 h-12 rounded-full transition active:translate-y-0.5"
        style={{ background: "hsl(45 90% 55%)", boxShadow: "0 4px 0 hsl(38 80% 38%)" }}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white fill-white" />
        ) : (
          <Play className="w-5 h-5 text-white fill-white translate-x-[1px]" />
        )}
      </button>

      <audio ref={audioRef} src={TRACK_URL} loop preload="auto" />

      {/* Barra de progresso */}
      {!terminou && (
        <div className="px-6 mt-4">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-1">
            <span>
              {indice + 1}/{TOTAL_POR_PARTIDA}
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" /> {acertos}
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" /> {streak}
              </span>
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "hsl(var(--kwendi-blue))" }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="px-5 pb-10 pt-4">
        <AnimatePresence mode="wait">
          {!terminou ? (
            <motion.div
              key={perguntaAtual.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="rounded-3xl px-5 py-5 mb-5 text-white shadow-[0_6px_0_hsl(var(--kwendi-blue-dark,210_70%_30%))]"
                style={{ background: "hsl(var(--kwendi-blue))" }}
              >
                <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                  {perguntaAtual.categoria}
                </span>
                <h2 className="mt-1 text-lg font-black leading-snug">
                  {perguntaAtual.enunciado}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {perguntaAtual.opcoes.map((op, i) => {
                  const certo = i === perguntaAtual.respostaCorreta;
                  const isEscolhida = escolha === i;
                  const mostrarResultado = escolha != null;

                  let stateClass = "bg-card text-foreground border-border";
                  let shadow = "0 4px 0 hsl(0 0% 80%)";
                  if (mostrarResultado && certo) {
                    stateClass = "bg-green-500 text-white border-green-700";
                    shadow = "0 4px 0 hsl(142 70% 30%)";
                  } else if (mostrarResultado && isEscolhida && !certo) {
                    stateClass = "bg-red-500 text-white border-red-700";
                    shadow = "0 4px 0 hsl(0 70% 30%)";
                  } else if (mostrarResultado) {
                    stateClass = "bg-muted text-muted-foreground border-border opacity-70";
                  }

                  return (
                    <button
                      key={i}
                      disabled={escolha != null}
                      onClick={() => handleEscolher(i)}
                      className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition active:translate-y-0.5 ${stateClass}`}
                      style={{ boxShadow: shadow }}
                    >
                      <span>{op}</span>
                      {mostrarResultado && certo && <Check className="w-5 h-5" />}
                      {mostrarResultado && isEscolhida && !certo && <X className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>

              {escolha != null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 rounded-2xl bg-muted px-4 py-4"
                >
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-1">
                    {escolha === perguntaAtual.respostaCorreta
                      ? "Boa! Resposta certa"
                      : "Quase! Resposta correta:"}
                  </p>
                  {escolha !== perguntaAtual.respostaCorreta && (
                    <p className="font-bold text-foreground mb-1">
                      {perguntaAtual.opcoes[perguntaAtual.respostaCorreta]}
                    </p>
                  )}
                  <p className="text-sm text-foreground leading-relaxed">
                    {perguntaAtual.explicacao}
                  </p>
                  <button
                    onClick={proxima}
                    className="btn-duo btn-duo-blue mt-4 w-full"
                  >
                    {indice + 1 >= perguntas.length ? "Ver resultados" : "Continuar"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="resultados"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-6"
            >
              <div className="text-center">
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ background: "hsl(45 90% 55%)", boxShadow: "0 5px 0 hsl(38 80% 38%)" }}
                >
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="mt-4 text-2xl font-black text-foreground">
                  Partida concluída!
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  Acertaste {acertos} de {TOTAL_POR_PARTIDA} perguntas
                </p>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-muted px-3 py-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase text-muted-foreground">XP</p>
                  <p className="text-xl font-black text-foreground">+{xpGanho}</p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Diamantes</p>
                  <p className="text-xl font-black text-foreground">+{diaGanho}</p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-3 text-center">
                  <p className="text-[10px] font-extrabold uppercase text-muted-foreground">Streak</p>
                  <p className="text-xl font-black text-foreground">{melhorStreak}</p>
                </div>
              </div>

              {novasConquistas.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">
                    Conquistas desbloqueadas
                  </p>
                  <div className="flex flex-col gap-2">
                     {novasConquistas.map((c) => {
                       const Icone = c.icone;
                      return (
                        <div
                          key={c.id}
                          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-white"
                          style={{ background: "hsl(45 90% 50%)", boxShadow: "0 4px 0 hsl(38 80% 35%)" }}
                        >
                          <Icone className="w-6 h-6 shrink-0" />
                          <div>
                            <p className="font-black text-sm">{c.titulo}</p>
                            <p className="text-xs opacity-90">{c.descricao}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <button onClick={jogarNovamente} className="btn-duo btn-duo-blue w-full">
                  Jogar novamente
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="rounded-2xl border-2 border-border bg-card px-5 py-3 font-bold text-foreground"
                >
                  Voltar à Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FronteirasJogoScreen;
