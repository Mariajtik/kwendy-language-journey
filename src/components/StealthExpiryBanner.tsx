/**
 * StealthExpiryBanner — Banner de aviso para contas em Modo Furtivo.
 * Aparece ao topo quando faltam ≤24h para expirar. Ao clicar, envia o
 * utilizador para /signup para converter a conta e guardar o progresso.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

function horasRestantes(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.floor(ms / 3_600_000));
}

export default function StealthExpiryBanner() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [expiraEm, setExpiraEm] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    if (!user) {
      setExpiraEm(null);
      return;
    }
    supabase
      .from("profiles")
      .select("tipo, stealth_expira_em")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancel) return;
        if (data?.tipo === "stealth" && data.stealth_expira_em) {
          setExpiraEm(data.stealth_expira_em);
        } else {
          setExpiraEm(null);
        }
      });
    return () => {
      cancel = true;
    };
  }, [user]);

  if (!expiraEm) return null;
  const horas = horasRestantes(expiraEm);
  if (horas > 24) return null;

  return (
    <button
      onClick={() => nav("/signup")}
      className="w-full flex items-center gap-2 px-3 py-2 text-left"
      style={{
        background: "hsl(45 96% 53%)",
        color: "hsl(20 90% 22%)",
        borderBottom: "2px solid hsl(20 80% 40%)",
      }}
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span className="text-xs font-extrabold leading-tight">
        A tua conta de degustação expira em {horas <= 1 ? "menos de 1h" : `${horas}h`}.
        Toca aqui para criar conta e guardar o teu progresso.
      </span>
    </button>
  );
}