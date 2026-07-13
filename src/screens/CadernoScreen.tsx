/**
 * CadernoScreen — o acervo pessoal de palavras do utilizador.
 * 3 tabs:
 *   - Guardadas: palavras favoritadas no Dicionário
 *   - Aprendidas: derivadas de secções concluídas (useProgresso + currículo)
 *   - Rever: palavras marcadas para revisão (placeholder por agora)
 */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, BookmarkCheck, NotebookPen, GraduationCap, RotateCcw } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { DICIONARIO, type EntradaDic } from "@/data/dicionario";
import { useProgresso } from "@/hooks/useProgresso";
import { CURRICULO } from "@/data/curriculo";
import { falarKwendi } from "@/lib/kwendiVoice";

const FAV_KEY = "kwendi.caderno.guardadas";
const REVER_KEY = "kwendi.caderno.rever";

type Tab = "guardadas" | "aprendidas" | "rever";

const TABS: { id: Tab; label: string; Icon: typeof NotebookPen }[] = [
  { id: "guardadas", label: "Guardadas", Icon: BookmarkCheck },
  { id: "aprendidas", label: "Aprendidas", Icon: GraduationCap },
  { id: "rever", label: "Rever", Icon: RotateCcw },
];

const falar = (texto: string) => {
  void falarKwendi(texto, { contexto: "vocab" });
};

const CadernoScreen = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("guardadas");
  const { estado } = useProgresso();

  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favoritos));
  }, [favoritos]);

  const guardadas: EntradaDic[] = useMemo(
    () => DICIONARIO.filter((d) => favoritos.includes(d.id)),
    [favoritos]
  );

  /** Secções concluídas → títulos como "palavras aprendidas" */
  const aprendidas = useMemo(() => {
    const out: { id: string; titulo: string; modulo: string }[] = [];
    for (const m of CURRICULO) {
      for (const u of m.unidades) {
        for (const s of u.seccoes) {
          if (estado.seccoesCompletas.includes(s.id) && s.tipo === "licao") {
            out.push({ id: s.id, titulo: s.titulo, modulo: `M${m.numero} · ${u.titulo}` });
          }
        }
      }
    }
    return out;
  }, [estado.seccoesCompletas]);

  const rever: string[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(REVER_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);

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
            aria-label="Voltar"
            className="w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <NotebookPen className="w-5 h-5" style={{ color: "hsl(160 60% 35%)" }} />
            <div>
              <h1 className="text-xl font-extrabold text-foreground leading-none">Caderno</h1>
              <p className="text-[11px] text-muted-foreground mt-1">
                O teu vocabulário, sempre à mão.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {TABS.map((t) => {
            const ativo = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 rounded-full py-2 text-xs font-extrabold transition flex items-center justify-center gap-1.5"
                style={{
                  background: ativo ? "hsl(160 60% 35%)" : "hsl(var(--card))",
                  color: ativo ? "#fff" : "hsl(var(--muted-foreground))",
                  border: `2px solid ${ativo ? "hsl(160 60% 35%)" : "hsl(var(--border))"}`,
                  boxShadow: ativo ? "0 3px 0 hsl(160 60% 25%)" : undefined,
                }}
              >
                <t.Icon className="w-3.5 h-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-4 pb-28">
        <AnimatePresence mode="wait">
          {tab === "guardadas" && (
            <motion.div
              key="g"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {guardadas.length === 0 ? (
                <EmptyState
                  titulo="Ainda nada guardado."
                  desc="Marca palavras como favoritas no Dicionário para as veres aqui."
                  cta="Abrir Dicionário"
                  onCta={() => nav("/dicionario")}
                />
              ) : (
                guardadas.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-2xl border-2 border-border bg-card p-3 flex items-center gap-3"
                    style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-foreground leading-tight">{e.umbundu}</p>
                      <p className="text-sm text-muted-foreground leading-tight">{e.pt}</p>
                    </div>
                    <button
                      onClick={() => falar(e.umbundu)}
                      aria-label="Ouvir"
                      className="w-10 h-10 rounded-xl grid place-items-center"
                      style={{ background: "hsl(202 100% 74% / 0.2)", color: "hsl(202 80% 45%)" }}
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setFavoritos((p) => p.filter((x) => x !== e.id))}
                      aria-label="Remover"
                      className="w-10 h-10 rounded-xl grid place-items-center"
                      style={{ background: "hsl(45 96% 53% / 0.25)", color: "hsl(40 90% 35%)" }}
                    >
                      <BookmarkCheck className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {tab === "aprendidas" && (
            <motion.div
              key="a"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {aprendidas.length === 0 ? (
                <EmptyState
                  titulo="Ainda nenhuma lição concluída."
                  desc="Termina secções no Início para acumulares conhecimento aqui."
                  cta="Ir para Início"
                  onCta={() => nav("/home")}
                />
              ) : (
                aprendidas.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-2xl border-2 border-border bg-card p-3"
                    style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
                  >
                    <p className="text-[10px] font-extrabold tracking-widest text-muted-foreground">
                      {a.modulo}
                    </p>
                    <p className="font-extrabold text-foreground mt-0.5">{a.titulo}</p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {tab === "rever" && (
            <motion.div
              key="r"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {rever.length === 0 ? (
                <EmptyState
                  titulo="Sem palavras para rever."
                  desc="Quando errares numa lição, a palavra aparece aqui para treinares."
                  cta="Treinar uma lição"
                  onCta={() => nav("/home")}
                />
              ) : (
                <p className="text-sm text-foreground">{rever.length} palavras para rever.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </motion.div>
  );
};

const EmptyState = ({
  titulo,
  desc,
  cta,
  onCta,
}: {
  titulo: string;
  desc: string;
  cta: string;
  onCta: () => void;
}) => (
  <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
    <p className="text-sm font-extrabold text-foreground">{titulo}</p>
    <p className="text-xs text-muted-foreground mt-1 mb-4">{desc}</p>
    <button
      onClick={onCta}
      className="rounded-xl px-4 py-2 font-extrabold text-white text-sm"
      style={{ background: "hsl(160 60% 35%)", boxShadow: "0 3px 0 hsl(160 60% 25%)" }}
    >
      {cta}
    </button>
  </div>
);

export default CadernoScreen;