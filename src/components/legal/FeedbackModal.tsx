/**
 * FeedbackModal — formulário para enviar feedback aos devs.
 * Chama a edge function `send-feedback`. O endereço de destino nunca é exposto.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  assunto: z.string().trim().min(3, "Assunto muito curto").max(120),
  mensagem: z.string().trim().min(10, "Escreve pelo menos 10 caracteres").max(2000),
});

type Props = { open: boolean; onClose: () => void };

const FeedbackModal = ({ open, onClose }: Props) => {
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const submit = async () => {
    const parsed = schema.safeParse({ assunto, mensagem });
    if (!parsed.success) {
      toast({ title: "Verifica os campos", description: parsed.error.issues[0].message });
      return;
    }
    setLoading(true);
    try {
      // Garante um access token válido (refresh automático se expirado).
      const { data: sessionData, error: sessErr } = await supabase.auth.getSession();
      if (sessErr || !sessionData.session) {
        toast({
          title: "Sessão expirada",
          description: "Volta a iniciar sessão para enviar feedback.",
        });
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.functions.invoke("send-feedback", {
        body: parsed.data,
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setSucesso(true);
      setTimeout(() => {
        setSucesso(false);
        setAssunto("");
        setMensagem("");
        onClose();
      }, 1600);
    } catch (e: any) {
      toast({
        title: "Não foi possível enviar",
        description: e?.message === "rate_limited"
          ? "Aguarda um minuto antes de enviar outra mensagem."
          : "Tenta novamente daqui a pouco.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-background rounded-t-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: "85vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Enviar feedback</h2>
                <p className="text-[11px] text-muted-foreground">
                  A tua mensagem chega diretamente aos devs.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              {sucesso ? (
                <div className="flex flex-col items-center py-8 gap-3">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                  <p className="font-extrabold text-foreground">Obrigado!</p>
                  <p className="text-sm text-muted-foreground text-center">
                    O teu feedback foi enviado com sucesso.
                  </p>
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="block text-xs font-extrabold text-muted-foreground mb-1">
                      Assunto
                    </span>
                    <input
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      maxLength={120}
                      placeholder="Ex.: Sugestão para lições"
                      className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 font-semibold text-sm outline-none focus:border-primary"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs font-extrabold text-muted-foreground mb-1">
                      Mensagem
                    </span>
                    <textarea
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      maxLength={2000}
                      rows={6}
                      placeholder="Conta-nos o que achas, dá sugestões ou reporta problemas."
                      className="w-full rounded-xl border-2 border-border bg-background px-3 py-2 font-semibold text-sm outline-none focus:border-primary resize-none"
                    />
                    <span className="block text-[10px] text-right text-muted-foreground mt-1">
                      {mensagem.length}/2000
                    </span>
                  </label>
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full py-3 rounded-2xl text-white font-extrabold flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{
                      background: "hsl(var(--primary))",
                      boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))",
                    }}
                  >
                    <Send className="w-4 h-4" />
                    {loading ? "A enviar…" : "Enviar"}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;