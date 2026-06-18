/**
 * HistoriaFimScreen.tsx — quiz + curiosidade + recompensa ao fim de uma história.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X, Sparkles, Trophy, Home } from "lucide-react";
import { getHistoria } from "@/data/historias";
import { useMissoes } from "@/hooks/useMissoes";
import { setSaldo } from "@/hooks/useSaldo";

type Etapa = "quiz" | "curiosidade" | "recompensa";

const HistoriaFimScreen = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const h = getHistoria(id);
  const { registrarAcao } = useMissoes();

  const [etapa, setEtapa] = useState<Etapa>("quiz");
  const [qIdx, setQIdx] = useState(0);
  const [selecionada, setSelecionada] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [recompensado, setRecompensado] = useState(false);

  if (!h || h.quiz.length === 0) {
    return (
      <div className="app-shell p-8">
        <p>História indisponível.</p>
        <button onClick={() => nav("/historias")} className="underline mt-4">Voltar</button>
      </div>
    );
  }

  const q = h.quiz[qIdx];
  const total = h.quiz.length;
  const respondeu = selecionada !== null;
  const acertou = selecionada === q.correta;

  const responder = (i: number) => {
    if (respondeu) return;
    setSelecionada(i);
    if (i === q.correta) setAcertos((a) => a + 1);
  };

  const prox = () => {
    if (qIdx < total - 1) {
      setQIdx(qIdx + 1);
      setSelecionada(null);
    } else {
      setEtapa("curiosidade");
    }
  };

  const concluir = () => {
    if (!recompensado) {
      registrarAcao("historia_concluida", 1);
      setSaldo((s) => ({
        ...s,
        xp: s.xp + h.recompensa.xp,
        diamantes: s.diamantes + h.recompensa.diamantes,
      }));
      setRecompensado(true);
    }
    setEtapa("recompensa");
  };

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <AnimatePresence mode="wait">
        {etapa === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6 pt-10 pb-32"
          >
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: `hsl(${h.cor})` }}>
              Pergunta {qIdx + 1} de {total}
            </p>
            <h2 className="text-2xl font-extrabold text-foreground mt-2 mb-6 leading-tight">
              {q.pergunta}
            </h2>

            <div className="flex flex-col gap-3">
              {q.opcoes.map((op, i) => {
                const isSel = selecionada === i;
                const isCorreta = i === q.correta;
                const stateClass = !respondeu
                  ? "bg-card border-border"
                  : isCorreta
                  ? "bg-green-50 border-green-500 text-green-900"
                  : isSel
                  ? "bg-red-50 border-red-500 text-red-900"
                  : "bg-card border-border opacity-60";
                return (
                  <button
                    key={i}
                    onClick={() => responder(i)}
                    disabled={respondeu}
                    className={`text-left p-4 rounded-2xl border-2 font-bold transition ${stateClass}`}
                  >
                    {op}
                  </button>
                );
              })}
            </div>

            {respondeu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${
                  acertou ? "bg-green-50 text-green-900" : "bg-red-50 text-red-900"
                }`}
              >
                {acertou ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
                <p className="font-extrabold">
                  {acertou ? "Boa! Acertaste." : "Quase! A resposta certa estava destacada."}
                </p>
              </motion.div>
            )}

            {respondeu && (
              <button
                onClick={prox}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-white"
                style={{ background: `hsl(${h.cor})`, boxShadow: `0 4px 0 hsl(${h.corEscura})` }}
              >
                {qIdx === total - 1 ? "Ver curiosidade" : "Próxima pergunta"}
              </button>
            )}
          </motion.div>
        )}

        {etapa === "curiosidade" && (
          <motion.div
            key="cur"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-32"
          >
            {h.curiosidade.imagem && (
              <div className="h-56 w-full overflow-hidden">
                <img src={h.curiosidade.imagem} alt={h.curiosidade.titulo} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="px-6 pt-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold text-white"
                style={{ background: `hsl(${h.cor})` }}
              >
                <Sparkles className="w-3.5 h-3.5" /> Curiosidade
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mt-3 leading-tight">
                {h.curiosidade.titulo}
              </h2>
              <p className="text-base leading-relaxed text-foreground/90 mt-3">
                {h.curiosidade.texto}
              </p>

              <button
                onClick={concluir}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-white"
                style={{ background: `hsl(${h.cor})`, boxShadow: `0 4px 0 hsl(${h.corEscura})` }}
              >
                <Trophy className="w-5 h-5" /> Receber recompensa
              </button>
            </div>
          </motion.div>
        )}

        {etapa === "recompensa" && (
          <motion.div
            key="rec"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 pt-16 pb-32 flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
              style={{ background: `hsl(${h.cor})`, boxShadow: `0 6px 0 hsl(${h.corEscura})` }}
            >
              <Trophy className="w-14 h-14 text-white" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-foreground">Parabéns!</h2>
            <p className="text-muted-foreground mt-2 max-w-xs">
              Concluíste <span className="font-bold text-foreground">{h.titulo}</span>. Acertaste {acertos} de {total} perguntas.
            </p>

            <div className="flex gap-4 mt-8">
              <div className="px-5 py-3 rounded-2xl bg-card border border-border">
                <p className="text-xs text-muted-foreground">XP</p>
                <p className="text-2xl font-extrabold" style={{ color: `hsl(${h.cor})` }}>
                  +{h.recompensa.xp}
                </p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-card border border-border">
                <p className="text-xs text-muted-foreground">Diamantes</p>
                <p className="text-2xl font-extrabold text-sky-500">+{h.recompensa.diamantes}</p>
              </div>
            </div>

            <button
              onClick={() => nav("/historias")}
              className="mt-10 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-white"
              style={{ background: `hsl(${h.cor})`, boxShadow: `0 4px 0 hsl(${h.corEscura})` }}
            >
              <Home className="w-5 h-5" /> Voltar às histórias
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HistoriaFimScreen;