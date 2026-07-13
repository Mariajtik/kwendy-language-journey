/**
 * KwendiChatScreen — Placeholder de Fase 1.
 * A funcionalidade completa (threads em `chat_threads` + `chat_mensagens`,
 * streaming via Lovable AI Gateway) volta na Fase 3.
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, MessageSquare } from "lucide-react";

export default function KwendiChatScreen() {
  const nav = useNavigate();
  return (
    <motion.div
      className="app-shell flex flex-col items-center justify-center px-6 text-center"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button
        onClick={() => nav(-1)}
        className="self-start mb-6 flex items-center gap-1 text-muted-foreground"
        aria-label="Voltar"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: "hsl(var(--kwendi-red) / 0.12)", color: "hsl(var(--kwendi-red))" }}
      >
        <MessageSquare className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-extrabold mb-2">Kwendi Chat IA</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        A conversar com o Kwendi voltará em breve — estamos a migrar as tuas conversas
        para o novo backend.
      </p>
    </motion.div>
  );
}
