/**
 * KwendiChatScreen — Chat com Kwendi IA (tutor de Umbundu e cultura angolana).
 * Feature Premium. Threads persistidas em `public.chat_threads` / `chat_mensagens`.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Send, MessageSquare, Trash2, ChevronLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { usePremium } from "@/contexts/PremiumContext";
import { toast } from "sonner";

type Thread = { id: string; titulo: string; atualizado_em: string };
type Msg = { id: string; role: "user" | "assistant"; parts: { type: "text"; text: string }[] };

export default function KwendiChatScreen() {
  const { user } = useAuth();
  const { ativo: premium } = usePremium();
  const nav = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carrega lista de threads
  useEffect(() => {
    if (!user) return;
    supabase
      .from("chat_threads")
      .select("id, titulo, atualizado_em")
      .eq("user_id", user.id)
      .order("atualizado_em", { ascending: false })
      .then(({ data }) => setThreads((data as Thread[]) ?? []));
  }, [user, threadId]);

  // Carrega mensagens do thread ativo
  useEffect(() => {
    if (!threadId || !user) {
      setMessages([]);
      return;
    }
    supabase
      .from("chat_mensagens")
      .select("id, role, parts")
      .eq("thread_id", threadId)
      .order("criado_em", { ascending: true })
      .then(({ data }) => setMessages((data as Msg[]) ?? []));
  }, [threadId, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const criarThread = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, titulo: "Nova conversa" })
      .select()
      .single();
    if (error) return toast.error("Não foi possível criar conversa");
    nav(`/kwendi-ia/${data.id}`);
  };

  const apagarThread = async (id: string) => {
    await supabase.from("chat_threads").delete().eq("id", id);
    if (threadId === id) nav("/kwendi-ia");
    setThreads((t) => t.filter((x) => x.id !== id));
  };

  const enviar = async () => {
    if (!user || sending) return;
    const text = input.trim();
    if (!text) return;

    let tid = threadId;
    if (!tid) {
      const { data } = await supabase
        .from("chat_threads")
        .insert({ user_id: user.id, titulo: text.slice(0, 40) })
        .select()
        .single();
      if (!data) return toast.error("Erro a iniciar conversa");
      tid = data.id;
      nav(`/kwendi-ia/${tid}`, { replace: true });
    }

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text }],
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    // Persistir mensagem do utilizador
    await supabase.from("chat_mensagens").insert({
      thread_id: tid,
      user_id: user.id,
      role: "user",
      parts: userMsg.parts,
    });

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kwendi-chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
        },
        body: JSON.stringify({
          thread_id: tid,
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.parts.map((p) => p.text).join(""),
          })),
        }),
      });

      if (!res.ok) throw new Error(`http ${res.status}`);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      const assistantId = crypto.randomUUID();
      let acc = "";
      setMessages((m) => [...m, { id: assistantId, role: "assistant", parts: [{ type: "text", text: "" }] }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((x) => (x.id === assistantId ? { ...x, parts: [{ type: "text", text: acc }] } : x)),
        );
      }
      // Persistir resposta
      await supabase.from("chat_mensagens").insert({
        thread_id: tid,
        user_id: user.id,
        role: "assistant",
        parts: [{ type: "text", text: acc }],
      });
      await supabase.from("chat_threads").update({ atualizado_em: new Date().toISOString() }).eq("id", tid);
    } catch (e) {
      toast.error("Erro a falar com o Kwendi. Tenta de novo.");
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <p className="font-bold mb-3">Faz login para conversar com o Kwendi.</p>
          <button onClick={() => nav("/login")} className="rounded-2xl px-4 py-2 text-white" style={{ background: "hsl(var(--primary))" }}>Iniciar sessão</button>
        </div>
      </div>
    );
  }

  if (!premium) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div className="max-w-sm">
          <Lock className="w-8 h-8 mx-auto mb-2" />
          <h2 className="text-xl font-extrabold mb-2">Chat Kwendi IA é Premium</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ativa o Pacote Premium na Loja para conversar com o teu tutor pessoal de Umbundu.
          </p>
          <button onClick={() => nav("/loja")} className="rounded-2xl px-4 py-2 text-white font-extrabold" style={{ background: "hsl(var(--primary))" }}>Ir para a Loja</button>
        </div>
      </div>
    );
  }

  return (
    <motion.div className="app-shell bg-background flex flex-col" style={{ minHeight: "100dvh" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: "hsl(var(--primary))" }}>
        <button onClick={() => nav("/home")} className="p-2 text-white"><ChevronLeft /></button>
        <h1 className="text-white font-extrabold flex-1">Kwendi IA</h1>
        <button onClick={criarThread} className="p-2 text-white" aria-label="Nova conversa"><Plus /></button>
      </div>

      {/* Threads bar */}
      {threads.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b bg-muted/30">
          {threads.map((t) => (
            <div key={t.id} className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => nav(`/kwendi-ia/${t.id}`)}
                className={`rounded-full px-3 py-1 text-xs font-bold ${threadId === t.id ? "text-white" : "bg-muted"}`}
                style={threadId === t.id ? { background: "hsl(var(--primary))" } : {}}
              >
                <MessageSquare className="w-3 h-3 inline mr-1" />
                {t.titulo}
              </button>
              {threadId === t.id && (
                <button onClick={() => apagarThread(t.id)} className="p-1 text-red-500"><Trash2 className="w-3 h-3" /></button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Olá! Sou o Kwendi. Pergunta-me qualquer coisa sobre a língua Umbundu ou cultura angolana.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2 text-sm"
              style={
                m.role === "user"
                  ? { background: "hsl(var(--primary))", color: "white" }
                  : { background: "hsl(var(--muted))" }
              }
            >
              {m.parts.map((p) => p.text).join("")}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="p-3 border-t flex gap-2 bg-background pb-[env(safe-area-inset-bottom)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          placeholder="Pergunta ao Kwendi…"
          className="flex-1 rounded-2xl border-2 border-border px-3 py-2 font-medium"
          disabled={sending}
        />
        <button
          onClick={enviar}
          disabled={sending || !input.trim()}
          className="rounded-2xl px-4 text-white font-extrabold disabled:opacity-50"
          style={{ background: "hsl(var(--primary))" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}