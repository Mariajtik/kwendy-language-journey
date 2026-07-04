/**
 * LoginScreen.tsx
 * -----------------
 * Simple login screen with email + password fields.
 * On "Entrar" shows a success message.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import logo from "@/assets/logo.jpg";
import PasswordInput from "@/components/PasswordInput";
import SocialAuthButtons from "@/components/SocialAuthButtons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      const msg = `${error.message}`.toLowerCase();
      if (msg.includes("confirm") || msg.includes("not confirmed")) {
        toast.error("O teu e-mail ainda não foi confirmado. Insere o código.");
        navigate("/verify-otp", { state: { email, next: "/home" } });
        return;
      }
      toast.error(error.message || "Credenciais inválidas.");
      return;
    }
    if (!data.session) {
      toast.error("Sessão não estabelecida. Tente novamente.");
      return;
    }
    setSuccess(true);
    // Navegar automaticamente após breve feedback
    setTimeout(() => navigate("/home", { replace: true }), 600);
  };

  /* ---- SUCCESS STATE ---- */
  if (success) {
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
          Autenticação concluída com sucesso.
        </h1>
        <button
          className="btn-duo btn-duo-primary max-w-xs mt-8"
          onClick={() => navigate("/home")}
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <button onClick={() => navigate(-1)} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="Kwendi" className="w-24 rounded-xl shadow mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground">Entrar na conta</h1>
      </div>

      {/* Social auth */}
      <SocialAuthButtons mode="login" />

      {/* Separator */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Form fields */}
      <input
        className="input-duo mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput value={password} onChange={setPassword} showStrength={false} className="mb-3" />

      <button
        type="button"
        onClick={() => navigate("/forgot-password")}
        className="text-sm font-bold text-primary self-end mb-6"
      >
        Esqueceu a senha?
      </button>

      {/* Login button */}
      <button
        className="btn-duo btn-duo-primary disabled:opacity-50 flex items-center justify-center gap-2"
        onClick={handleLogin}
        disabled={busy || !/\S+@\S+\.\S+/.test(email) || password.length < 6}
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        Entrar
      </button>
    </motion.div>
  );
};

export default LoginScreen;
