/**
 * VerifyOtpScreen.tsx
 * -------------------
 * Confirmação de e-mail via código OTP (6 dígitos) enviado pelo Supabase.
 * Recebe `email` via `location.state` ou `?email=`. Chama `verifyOtp` com
 * `type: 'signup'`. Também permite reenviar o código.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/assets/logo.jpg";

const VerifyOtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { email?: string; next?: string } };
  const [params] = useSearchParams();

  const initialEmail = location.state?.email || params.get("email") || "";
  const next = location.state?.next || "/home";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  const verify = async (token: string) => {
    if (!email || token.length !== 6) return;
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token,
      type: "signup",
    });
    setBusy(false);
    if (error) {
      const msg = `${error.message}`.toLowerCase();
      if (msg.includes("expired")) {
        toast.error("Código expirado. Pede um novo.");
      } else if (msg.includes("invalid") || msg.includes("token")) {
        toast.error("Código inválido. Verifica os 6 dígitos.");
      } else {
        toast.error(error.message);
      }
      setCode("");
      return;
    }
    if (!data.session) {
      toast.error("Sessão não estabelecida. Tenta iniciar sessão.");
      setCode("");
      return;
    }
    toast.success("E-mail confirmado!");
    navigate(next, { replace: true });
  };

  const resend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/home` },
    });
    setResending(false);
    if (error) {
      toast.error(error.message || "Não foi possível reenviar o código.");
      return;
    }
    toast.success("Novo código enviado.");
    setCooldown(45);
  };

  return (
    <motion.div
      className="app-shell flex flex-col px-6 py-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
    >
      <button onClick={() => navigate(-1)} className="mb-6 self-start" aria-label="Voltar">
        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
      </button>

      <div className="flex flex-col items-center mb-6">
        <img src={logo} alt="Kwendi" className="w-20 rounded-xl shadow mb-4" />
        <div
          className="w-14 h-14 rounded-full grid place-items-center mb-4"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
        >
          <MailCheck className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground text-center">
          Confirma o teu e-mail
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-2 max-w-xs">
          Enviámos um código de 6 dígitos para <b>{email || "o teu e-mail"}</b>. Insere-o abaixo para ativar a conta.
        </p>
      </div>

      {!initialEmail && (
        <input
          className="input-duo mb-4"
          type="email"
          placeholder="O teu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      )}

      <div className="flex justify-center my-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={(v) => {
            setCode(v);
            if (v.length === 6) verify(v);
          }}
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg font-extrabold" />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <button
        className="btn-duo btn-duo-primary disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
        onClick={() => verify(code)}
        disabled={busy || code.length !== 6 || !/\S+@\S+\.\S+/.test(email)}
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        Confirmar
      </button>

      <button
        type="button"
        onClick={resend}
        disabled={resending || cooldown > 0 || !/\S+@\S+\.\S+/.test(email)}
        className="text-sm font-bold text-primary mt-4 self-center disabled:opacity-50 flex items-center gap-2"
      >
        {resending && <Loader2 className="w-4 h-4 animate-spin" />}
        {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código"}
      </button>
    </motion.div>
  );
};

export default VerifyOtpScreen;