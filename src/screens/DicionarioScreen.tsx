/**
 * DicionarioScreen — tradutor PT ⇄ Umbundu.
 * Pesquisa local fuzzy + opção "Pedir à IA" (placeholder local, futuramente
 * edge function `dicionario-ia`). Ditado por voz via Web Speech API.
 * Salva favoritos em localStorage.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Mic,
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  X,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import AvaliadorPronuncia from "@/components/AvaliadorPronuncia";
import { DICIONARIO, pesquisar, type EntradaDic } from "@/data/dicionario";
import { bumpStat, STATS } from "@/lib/stats";
import { toast } from "sonner";
import { falarKwendi } from "@/lib/kwendiVoice";

const FAV_KEY = "kwendi.caderno.guardadas";
const LEGACY_FAV_KEY = "kwendi.dicionario.favoritos";

/** Type lightweight para Web Speech API */
type SR = {
  start: () => void;
  stop: () => void;
  onresult: (e: { results: { 0: { transcript: string } }[] }) => void;
  onerror: (e: unknown) => void;
  onend: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
};

const DicionarioScreen = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      const atual = localStorage.getItem(FAV_KEY);
      if (atual) return JSON.parse(atual);
      // Migra chave antiga (uma vez)
      const legacy = localStorage.getItem(LEGACY_FAV_KEY);
      if (legacy) {
        localStorage.setItem(FAV_KEY, legacy);
        localStorage.removeItem(LEGACY_FAV_KEY);
        return JSON.parse(legacy);
      }
      return [];
    } catch {
      return [];
    }
  });
  const [escutando, setEscutando] = useState(false);
  const [iaResposta, setIaResposta] = useState<string | null>(null);
  const [jaContou, setJaContou] = useState(false);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favoritos));
  }, [favoritos]);

  const resultados = useMemo(() => pesquisar(query), [query]);

  // Antes de pesquisar, sugere uma amostra para explorar.
  // Os guardados vivem agora em Caderno.
  const amostra = useMemo(() => DICIONARIO.slice(0, 12), []);
  const lista: EntradaDic[] = query.trim() ? resultados : amostra;

  // Conta a primeira pesquisa significativa (usado pela conquista "Curioso").
  useEffect(() => {
    if (!jaContou && query.trim().length >= 2) {
      bumpStat(STATS.dicionarioBuscas);
      setJaContou(true);
    }
  }, [query, jaContou]);

  const toggleFav = (id: string) =>
    setFavoritos((prev) => {
      if (prev.includes(id)) {
        toast(t("dicionario.removida"));
        return prev.filter((x) => x !== id);
      }
      toast(t("dicionario.guardada"), {
        description: t("dicionario.guardadaDesc"),
        action: { label: t("dicionario.abrir"), onClick: () => nav("/secao/caderno") },
      });
      return [...prev, id];
    });

  const falar = (texto: string) => {
    void falarKwendi(texto, { contexto: "vocab" });
  };

  const iniciarVoz = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const SRClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SRClass) {
      alert("O teu navegador não suporta ditado por voz.");
      return;
    }
    const rec = new SRClass();
    rec.lang = "pt-PT";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setQuery(t);
    };
    rec.onend = () => setEscutando(false);
    rec.onerror = () => setEscutando(false);
    recRef.current = rec;
    setEscutando(true);
    rec.start();
  };

  const pararVoz = () => {
    recRef.current?.stop();
    setEscutando(false);
  };

  const pedirIA = () => {
    const opcoes = [
      `Tradução aproximada: "${query}" pode ser semelhante a uma palavra do registo do Wambu. Verifica com um falante.`,
      `Não percebi bem o que disseste — quiseste dizer "${DICIONARIO[Math.floor(Math.random() * DICIONARIO.length)].umbundu}"?`,
      `Esta palavra ainda não está na nossa base de dados. Em breve adicionamos.`,
    ];
    setIaResposta(opcoes[Math.floor(Math.random() * opcoes.length)]);
  };

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => nav(-1)}
            aria-label={t("comum.voltar")}
            className="w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-none">{t("dicionario.titulo")}</h1>
            <p className="text-[11px] text-muted-foreground mt-1">
              {t("dicionario.subtitulo")}
            </p>
          </div>
        </div>

        {/* Search bar grande */}
        <div
          className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-3 py-3"
          style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
        >
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("dicionario.placeholder")}
            className="flex-1 bg-transparent outline-none text-base font-semibold placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label={t("comum.fechar")}
              className="w-7 h-7 rounded-lg grid place-items-center text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={escutando ? pararVoz : iniciarVoz}
            aria-label={t("dicionario.praticar")}
            className="w-10 h-10 rounded-xl grid place-items-center text-white flex-shrink-0"
            style={{
              background: escutando ? "hsl(var(--primary))" : "hsl(160 60% 35%)",
              boxShadow: escutando
                ? "0 3px 0 hsl(var(--kwendi-red-dark))"
                : "0 3px 0 hsl(160 60% 25%)",
            }}
          >
            <Mic className={`w-5 h-5 ${escutando ? "animate-pulse" : ""}`} />
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="px-4 py-4 pb-28 space-y-3">
        {query.trim() && resultados.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-border p-4 text-center">
            <p className="text-sm font-bold text-foreground">
              {t("dicionario.semResultados")} “{query}”
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              {t("dicionario.iaSugerir")}
            </p>
            <button
              onClick={pedirIA}
              className="rounded-xl px-4 py-2 font-extrabold text-white text-sm inline-flex items-center gap-2"
              style={{
                background: "hsl(280 70% 55%)",
                boxShadow: "0 3px 0 hsl(280 70% 40%)",
              }}
            >
              <Sparkles className="w-4 h-4" /> {t("dicionario.pedirIa")}
            </button>
            {iaResposta && (
              <p className="text-sm text-foreground mt-3 italic">{iaResposta}</p>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground">
              {t("dicionario.explorar")}
            </p>
            <button
              onClick={() => nav("/secao/caderno")}
              className="text-[11px] font-extrabold text-foreground/70 underline"
            >
              {t("dicionario.verCaderno")}
            </button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {lista.map((e) => {
            const fav = favoritos.includes(e.id);
            return (
              <motion.div
                key={e.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border-2 border-border bg-card p-3 flex items-center gap-3"
                style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-foreground leading-tight">
                    {e.umbundu}
                  </p>
                  <p className="text-sm text-muted-foreground leading-tight">
                    {e.pt}
                  </p>
                </div>
                <button
                  onClick={() => falar(e.umbundu)}
                  aria-label={t("dicionario.ouvir")}
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{ background: "hsl(202 100% 74% / 0.2)", color: "hsl(202 80% 45%)" }}
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <AvaliadorPronuncia alvo={e.umbundu} compact />
                <button
                  onClick={() => toggleFav(e.id)}
                  aria-label={fav ? t("dicionario.removida") : t("dicionario.guardada")}
                  className="w-10 h-10 rounded-xl grid place-items-center"
                  style={{
                    background: fav ? "hsl(45 96% 53% / 0.25)" : "hsl(var(--muted))",
                    color: fav ? "hsl(40 90% 35%)" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {fav ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <BottomNav />
    </motion.div>
  );
};

export default DicionarioScreen;