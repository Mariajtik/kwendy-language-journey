/**
 * LessonScreen.tsx
 * Tela de execução de lição estilo Duolingo (front-end apenas).
 * Barra de progresso, perguntas de múltipla escolha em Umbundu,
 * feedback verde/vermelho, tela de conclusão com XP.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Check, X as XIcon, Lightbulb, Zap } from "lucide-react";
import { useMissoes } from "@/hooks/useMissoes";
import { setSaldo } from "@/hooks/useSaldo";
import { useProgresso } from "@/hooks/useProgresso";
import { useInventario, dobradorXpAtivo } from "@/hooks/useInventario";

type Question = {
  prompt: string;
  pt: string;
  options: string[];
  correct: number;
};

const QUESTIONS: Question[] = [
  {
    prompt: 'Como se diz "Olá" em Umbundu?',
    pt: "Olá",
    options: ["Wakolele", "Tualumba", "Cikoko", "Mola"],
    correct: 0,
  },
  {
    prompt: 'O que significa "Tualumba ciwa"?',
    pt: "",
    options: ["Boa noite", "Bom dia", "Obrigado", "Como estás?"],
    correct: 1,
  },
  {
    prompt: 'Selecione a tradução de "Obrigado"',
    pt: "Obrigado",
    options: ["Cikoko", "Mola", "Akuenje", "Wakolele"],
    correct: 0,
  },
];

const LessonScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const total = QUESTIONS.length;
  const { registrarAcao } = useMissoes();
  const { concluirSeccao } = useProgresso();
  const { temPowerUp, usarPowerUp, tempoRestante } = useInventario();

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [dicaAtiva, setDicaAtiva] = useState(false);
  const dobradorMin = tempoRestante("dobrador-xp");
  const dobradorOn = dobradorMin !== null && dobradorMin > 0;

  const q = QUESTIONS[index];
  const isCorrect = selected === q?.correct;
  const progress = ((index + (checked ? 1 : 0)) / total) * 100;

  const handleCheck = () => {
    if (selected === null) return;
    setChecked(true);
    setDicaAtiva(false);
    if (selected === q.correct) {
      setCorrectCount((c) => c + 1);
      registrarAcao("resposta_correta_seguida", 1);
      registrarAcao("palavra_traduzida", 1);
    } else {
      setHearts((h) => {
        const next = Math.max(0, h - 1);
        if (next === 0 && temPowerUp("vida-extra")) {
          usarPowerUp("vida-extra");
          return 1;
        }
        return next;
      });
    }
  };

  // Ao concluir lição: registra ações e credita XP + diamantes
  useEffect(() => {
    if (!done) return;
    const dobrador = dobradorXpAtivo();
    const xp = correctCount * 4 * (dobrador ? 2 : 1);
    registrarAcao("licao_completa", 1);
    registrarAcao("minuto_pratica", 3);
    setSaldo((s) => ({
      ...s,
      xp: s.xp + xp,
      diamantes: s.diamantes + correctCount * 2,
    }));
    if (id) concluirSeccao(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const handleContinue = () => {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
  };

  if (done) {
    const dobrador = dobradorXpAtivo();
    const xp = correctCount * 4 * (dobrador ? 2 : 1);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="app-shell flex flex-col items-center justify-center px-6 text-center"
        style={{ minHeight: "100dvh", background: "#fff" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Check className="w-14 h-14 text-white" strokeWidth={4} />
        </motion.div>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#5E5C5C" }}>
          Lição completa!
        </h1>
        <p className="text-base text-muted-foreground mb-8">
          Acertaste {correctCount} de {total} perguntas.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8">
          <div
            className="rounded-2xl border-2 p-4 text-center"
            style={{ borderColor: "#FBBD12" }}
          >
            <p className="text-xs font-extrabold tracking-wider" style={{ color: "#FBBD12" }}>
              XP GANHO{dobrador ? " ×2" : ""}
            </p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: "#5E5C5C" }}>
              {xp}
            </p>
          </div>
          <div
            className="rounded-2xl border-2 p-4 text-center"
            style={{ borderColor: "hsl(var(--primary))" }}
          >
            <p
              className="text-xs font-extrabold tracking-wider"
              style={{ color: "hsl(var(--primary))" }}
            >
              PRECISÃO
            </p>
            <p className="text-2xl font-extrabold mt-1" style={{ color: "#5E5C5C" }}>
              {Math.round((correctCount / total) * 100)}%
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="btn-duo btn-duo-primary w-full max-w-xs"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="app-shell flex flex-col px-5 py-4"
      style={{ minHeight: "100dvh", background: "#fff" }}
    >
      {/* Header: close + progress + hearts */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/home")}
          aria-label="Sair da lição"
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#86D05D" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex items-center gap-1">
          <Heart
            className="w-5 h-5"
            fill="hsl(var(--primary))"
            color="hsl(var(--primary))"
          />
          <span className="font-extrabold text-sm" style={{ color: "hsl(var(--primary))" }}>
            {hearts}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col mt-8">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p
            className="text-xs font-extrabold tracking-widest"
            style={{ color: "#5E5C5C" }}
          >
            PERGUNTA {index + 1}/{total}
          </p>
          <div className="flex items-center gap-1.5">
            {dobradorOn && (
              <span
                className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white"
                style={{ background: "hsl(45 95% 50%)" }}
              >
                <Zap className="w-3 h-3 fill-current" />
                XP×2 · {dobradorMin}min
              </span>
            )}
            {temPowerUp("dica-extra") && !checked && (
              <button
                type="button"
                onClick={() => {
                  if (dicaAtiva) return;
                  usarPowerUp("dica-extra");
                  setDicaAtiva(true);
                }}
                className="flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{
                  background: "hsl(50 95% 60% / 0.18)",
                  color: "hsl(40 90% 35%)",
                  border: "1px solid hsl(50 95% 60%)",
                }}
              >
                <Lightbulb className="w-3 h-3 fill-current" />
                Dica
              </button>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-6" style={{ color: "#5E5C5C" }}>
          {q.prompt}
        </h2>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isSel = selected === i;
            const showCorrect = checked && i === q.correct;
            const showWrong = checked && isSel && i !== q.correct;
            const hint = dicaAtiva && !checked && i === q.correct;
            return (
              <button
                key={i}
                disabled={checked}
                onClick={() => setSelected(i)}
                className="rounded-2xl border-2 px-4 py-4 text-left font-bold text-base transition-colors"
                style={{
                  borderColor: showCorrect
                    ? "#86D05D"
                    : showWrong
                    ? "hsl(var(--primary))"
                    : hint
                    ? "#FBBD12"
                    : isSel
                    ? "hsl(var(--primary))"
                    : "#e5e5e5",
                  background: showCorrect
                    ? "#eaf7e0"
                    : showWrong
                    ? "#fdecec"
                    : hint
                    ? "#fff8e0"
                    : isSel
                    ? "#fff5f5"
                    : "#fff",
                  color: "#5E5C5C",
                  boxShadow: `0 3px 0 ${
                    showCorrect
                      ? "#5fae3a"
                      : showWrong
                      ? "hsl(var(--kwendi-red-dark))"
                      : hint
                      ? "#d99d00"
                      : isSel
                      ? "hsl(var(--kwendi-red-dark))"
                      : "#d4d4d4"
                  }`,
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback + footer button */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="rounded-t-2xl px-4 py-3 -mx-5 mb-3"
            style={{
              background: isCorrect ? "#eaf7e0" : "#fdecec",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: isCorrect ? "#86D05D" : "hsl(var(--primary))",
                }}
              >
                {isCorrect ? (
                  <Check className="w-5 h-5 text-white" strokeWidth={4} />
                ) : (
                  <XIcon className="w-5 h-5 text-white" strokeWidth={4} />
                )}
              </div>
              <p
                className="font-extrabold"
                style={{
                  color: isCorrect ? "#5fae3a" : "hsl(var(--kwendi-red-dark))",
                }}
              >
                {isCorrect
                  ? "Boa! Resposta certa."
                  : `Resposta correta: ${q.options[q.correct]}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={selected === null}
        onClick={checked ? handleContinue : handleCheck}
        className="btn-duo btn-duo-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checked ? "Continuar" : "Verificar"}
      </button>
    </motion.div>
  );
};

export default LessonScreen;