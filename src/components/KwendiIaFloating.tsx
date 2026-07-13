/**
 * KwendiIaFloating — FAB de chat na Home usando Gemini (beta).
 * Streaming de texto puro via edge function `kwendi-ia-beta`.
 */
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

export default function KwendiIaFloating() {
  const { user, session, isStealth } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);

  // Ocultar em modo furtivo para poupar quota Gemini.
  if (!user || isStealth) return null;

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || busy) return;
    setInput("");
    const novo = [...msgs, { role: "user" as const, content: texto }];
    setMsgs([...novo, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/kwendi-ia-beta`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token ?? ""}`,
          },
          body: JSON.stringify({ messages: novo }),
        },
      );
      if (!res.ok || !res.body) {
        const err = await res.text();
        throw new Error(err || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMsgs((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      console.error("[kwendi-ia] error", e);
      toast.error("Kwendi IA indisponível de momento. Tenta novamente.");
      setMsgs((prev) => prev.slice(0, -1));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed z-40 rounded-full shadow-xl flex items-center justify-center"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 92px)",
          right: 18,
          width: 60,
          height: 60,
          background: "hsl(var(--kwendi-red))",
          color: "white",
        }}
        aria-label="Abrir Kwendi IA (beta)"
      >
        <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
        <span
          className="absolute -top-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
          style={{ background: "hsl(var(--kwendi-gold, 45 96% 55%))", color: "#000" }}
        >
          BETA
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl shadow-2xl flex flex-col"
              style={{ maxHeight: "80dvh", height: "80dvh" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(var(--kwendi-red) / 0.12)", color: "hsl(var(--kwendi-red))" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold leading-tight">Kwendi IA</p>
                    <p className="text-[10px] text-muted-foreground">Powered by Gemini · Beta</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className="px-4 py-2 text-[11px] text-center"
                style={{ background: "hsl(45 96% 90%)", color: "hsl(30 60% 25%)" }}
              >
                🧪 Versão beta — as respostas podem conter erros.
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {msgs.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Olá! Sou o Kwendi. Pergunta-me algo sobre Umbundu ou Angola. 🇦🇴
                  </div>
                )}
                {msgs.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {m.content || (busy && i === msgs.length - 1 ? "…" : "")}
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  enviar();
                }}
                className="flex items-center gap-2 p-3 border-t"
                style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escreve a tua pergunta…"
                  disabled={busy}
                  className="flex-1 rounded-full border px-4 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50"
                  style={{ background: "hsl(var(--kwendi-red))", color: "white" }}
                  aria-label="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}