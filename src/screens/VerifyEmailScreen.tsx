/**
 * VerifyEmailScreen.tsx
 * ---------------------
 * Fluxo real de confirmação de e-mail com o Supabase:
 *  - Após signup, o Supabase envia um e-mail com um LINK de confirmação.
 *  - O utilizador clica no link → o Supabase valida e a app recebe a sessão
 *    via `onAuthStateChange`, e redirecionamos automaticamente para `next`.
 *  - Botão para reenviar o e-mail (cooldown 45s).
 *  - Suporte opcional a inserir um código de 6 dígitos (quando o e-mail
 *    incluir `{{ .Token }}` no template do Supabase).
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import logo from "@/assets/logo.jpg";

const VerifyEmailScreen = () => {
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
  const [showCodeInput, setShowCodeInput] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  // Se o utilizador clicar no link no e-mail e regressar já autenticado,
  // encaminhamos automaticamente para `next`.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      if (session) {
        toast.success("E-mail confirmado!");
        navigate(next, { replace: true });
      }
    });
    // Também verificar imediatamente caso já haja sessão
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(next, { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, next]);

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
        toast.error("Código inválido. Clica antes no link do e-mail.");
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
    if (!/\S+@\S+\.\S+/.test(email) || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/home` },
    });
    setResending(false);
    if (error) {
      toast.error(error.message || "Não foi possível reenviar o e-mail.");
      return;
    }
    toast.success("E-mail reenviado. Verifica a tua caixa de entrada.");
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
          Enviámos um e-mail para <b>{email || "o teu endereço"}</b>. Abre-o e
          clica no link "Confirm your mail" para ativar a conta. Volta aqui —
          entramos automaticamente assim que a confirmação for concluída.
        </p>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Não recebeste? Verifica a pasta de spam.
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

      <button
        type="button"
        onClick={resend}
        disabled={resending || cooldown > 0 || !/\S+@\S+\.\S+/.test(email)}
        className="btn-duo btn-duo-primary disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {resending && <Loader2 className="w-4 h-4 animate-spin" />}
        {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar e-mail"}
      </button>

      <button
        type="button"
        onClick={() => setShowCodeInput((v) => !v)}
        className="text-sm font-bold text-muted-foreground mt-6 self-center"
      >
        {showCodeInput ? "Ocultar código" : "Tenho um código de 6 dígitos"}
      </button>

      {showCodeInput && (
        <>
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
            className="btn-duo btn-duo-secondary disabled:opacity-50 flex items-center justify-center gap-2"
            onClick={() => verify(code)}
            disabled={busy || code.length !== 6 || !/\S+@\S+\.\S+/.test(email)}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmar código
          </button>
        </>
      )}
    </motion.div>
  );
};

export default VerifyEmailScreen;