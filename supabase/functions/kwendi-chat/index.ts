/**
 * KwendiChatScreen — Chat com Kwendi IA (Tutor de Umbundu).
 * Usa streaming via Edge Function `kwendi-chat`.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Message = { role: "user" | "assistant"; content: string };

export default function KwendiChatScreen() {
  const nav = useNavigate();
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading || !session) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const token = session.access_token;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kwendi-chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Erro ao conectar com Kwendi");
        setLoading(false);
        return;
      }

      if (!response.body) {
        toast.error("Erro ao processar resposta");
        setLoading(false);
        return;
      }

      // Processar stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: assistantMessage,
          };
          return updated;
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Erro ao enviar mensagem");
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="app-shell flex flex-col"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <button onClick={() => nav(-1)} className="p-1.5 rounded-lg hover:bg-secondary" aria-label="Voltar">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-lg">Kwendi Chat IA</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: "hsl(var(--kwendi-red) / 0.12)" }}
            >
              <span className="text-3xl">🧑‍🏫</span>
            </div>
            <h2 className="font-extrabold text-foreground mb-2">Bem-vindo ao Kwendi Chat</h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              Conversa comigo sobre Umbundu e cultura angolana. Estou aqui para te ajudar a aprender! 🇦🇴
            </p>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${
                      msg.role === "user" ? "bg-primary text-white" : "bg-card border-2 border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-card border-2 border-border rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Kwendi está a pensar...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-4 bg-background">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunta a Kwendi..."
            disabled={loading}
            className="flex-1 bg-card border-2 border-border rounded-2xl px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
