/**
 * ResetPasswordScreen.tsx
 * -----------------------
 * Aterrissagem do link de recuperação de senha. Supabase redireciona para
 * `${origin}/reset-password` com `type=recovery` no hash. Aqui o utilizador
 * define a nova senha via `supabase.auth.updateUser({ password })`.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import PasswordInput, { getPasswordStrength } from "@/components/PasswordInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (getPasswordStrength(newPwd) < 2) {
      toast.error("A senha está fraca demais");
      return;
    }
    if (newPwd !== confirmPwd) {
      toast.error("As senhas não coincidem");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: newPwd });
    setBusy(false);
    if (error) {
      toast.error("Não foi possível redefinir. Peça um novo link.");
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <motion.div
        className="app-shell flex flex-col items-center justify-center px-6"
        style={{ minHeight: "100dvh" }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "hsl(var(--kwendi-green))" }}
        >
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-2 text-center">
          Senha atualizada com sucesso.
        </h1>
        <button className="btn-duo btn-duo-primary max-w-xs mt-8" onClick={() => navigate("/login")}>
          Ir para o login
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={() => navigate("/login")} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>
      <h1 className="text-2xl font-extrabold mb-2">Nova senha</h1>
      <p className="text-muted-foreground mb-6">Escolha uma senha forte.</p>
      <PasswordInput value={newPwd} onChange={setNewPwd} placeholder="Nova senha" className="mb-4" />
      <PasswordInput
        value={confirmPwd}
        onChange={setConfirmPwd}
        placeholder="Confirmar senha"
        showStrength={false}
        className="mb-6"
      />
      <button
        className="btn-duo btn-duo-primary mt-auto disabled:opacity-50 flex items-center justify-center gap-2"
        onClick={submit}
        disabled={busy || getPasswordStrength(newPwd) < 2 || newPwd !== confirmPwd}
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        Redefinir senha
      </button>
    </motion.div>
  );
};

export default ResetPasswordScreen;