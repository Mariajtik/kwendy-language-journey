import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { consumeOAuthNext, getOAuthErrorFromUrl, normaliseAppPath } from "@/lib/authRedirect";
import { isDeviceTrusted, trustDevice } from "@/lib/deviceTrust";

const AuthCallbackScreen = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [message, setMessage] = useState("A concluir login...");

  useEffect(() => {
    const next = normaliseAppPath(params.get("next"), consumeOAuthNext("/home"));
    const urlError = getOAuthErrorFromUrl();

    if (urlError) {
      toast.error(urlError);
      navigate("/login", { replace: true });
      return;
    }

    let settled = false;
    const finish = async (userId?: string) => {
      if (settled) return;
      settled = true;
      if (userId) {
        const trusted = await isDeviceTrusted(userId);
        if (trusted) {
          await trustDevice(userId).catch(() => {});
          toast.success("Login concluído.");
          navigate(next, { replace: true });
          return;
        }
        navigate("/auth/otp", { state: { purpose: "login", next }, replace: true });
        return;
      }
      toast.success("Login concluído.");
      navigate(next, { replace: true });
    };

    const failTimer = window.setTimeout(() => {
      if (settled) return;
      setMessage("Não recebi a sessão do Supabase.");
      toast.error("Não foi possível concluir o login. Tenta novamente.");
      navigate("/login", { replace: true });
    }, 5000);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        window.clearTimeout(failTimer);
        void finish(session.user?.id);
      }
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        window.clearTimeout(failTimer);
        toast.error(error.message || "Erro ao ler a sessão.");
        navigate("/login", { replace: true });
        return;
      }
      if (data.session) {
        window.clearTimeout(failTimer);
        void finish(data.session.user?.id);
      }
    });

    return () => {
      window.clearTimeout(failTimer);
      sub.subscription.unsubscribe();
    };
  }, [navigate, params]);

  return (
    <motion.div
      className="app-shell flex flex-col items-center justify-center px-6"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img src={logo} alt="Kwendi" className="w-20 rounded-xl shadow mb-6" />
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-extrabold text-foreground text-center">{message}</h1>
    </motion.div>
  );
};

export default AuthCallbackScreen;
