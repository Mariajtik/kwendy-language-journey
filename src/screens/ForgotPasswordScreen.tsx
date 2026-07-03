/**
 * ForgotPasswordScreen.tsx
 * Front-end only flow:
 *  step 0: pede email + envia "código"
 *  step 1: 6 inputs OTP estilizados
 *  step 2: nova senha + confirmar
 *  step 3: sucesso
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordScreen = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<0 | 1>(0);

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSendLink = async () => {
    if (!email.includes("@")) {
      toast.error("Insira um email válido");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message || "Não foi possível enviar o email.");
      return;
    }
    setStep(1);
  };

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => (step === 0 ? navigate(-1) : navigate("/login"))}
        className="mb-6 self-start"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {step === 0 && (
            <>
              <h1 className="text-2xl font-extrabold mb-2">Esqueceu a senha?</h1>
              <p className="text-muted-foreground mb-6">
                Enviaremos um link seguro para o seu email. Basta abri-lo para redefinir a senha.
              </p>
              <input
                className="input-duo mb-6"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="btn-duo btn-duo-primary mt-auto disabled:opacity-50 flex items-center justify-center gap-2"
                onClick={handleSendLink}
                disabled={busy || !/\S+@\S+\.\S+/.test(email)}
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                Enviar link
              </button>
            </>
          )}

          {step === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ background: "hsl(var(--kwendi-green))" }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl font-extrabold mb-2">
                Link enviado.
              </h1>
              <p className="text-muted-foreground mb-8">
                Verifique o seu email <strong>{email}</strong> e abra o link para redefinir a senha.
              </p>
              <button
                className="btn-duo btn-duo-primary max-w-xs"
                onClick={() => navigate("/login")}
              >
                Voltar ao login
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ForgotPasswordScreen;