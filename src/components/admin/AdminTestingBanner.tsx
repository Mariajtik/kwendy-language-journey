/**
 * AdminTestingBanner.tsx
 * ----------------------
 * Barra flutuante visível quando o admin está a navegar o app em "modo teste".
 * Permite voltar rapidamente ao painel; nenhuma métrica é registada enquanto ativo.
 */

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { isAdminTesting, stopAdminTesting } from "@/lib/adminTesting";

export const AdminTestingBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isAdminTesting());
  }, [location.pathname]);

  // Não mostra dentro das próprias rotas admin.
  if (!active) return null;
  if (location.pathname.startsWith("/grupo16Kwendi")) return null;

  const back = () => {
    stopAdminTesting();
    navigate("/grupo16Kwendi/dashboard");
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-amber-500/40 bg-black/85 px-3 py-2 shadow-lg backdrop-blur"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center gap-2 text-xs text-amber-200">
        <ShieldAlert className="h-4 w-4" />
        <span>Modo teste do admin — sessão não contabilizada</span>
        <button
          onClick={back}
          className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-3 w-3" />
          Voltar ao admin
        </button>
      </div>
    </div>
  );
};