/**
 * DefinicoesScreen — lista principal de definições.
 * Acessível apenas via o ícone de engrenagem no Perfil.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Accessibility, Bell, ChevronRight, Info, LogOut, User as UserIcon } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import SairConfirmModal from "@/screens/definicoes/SairConfirmModal";

const DefinicoesScreen = () => {
  const nav = useNavigate();
  const [sairAberto, setSairAberto] = useState(false);

  const items = [
    { icon: UserIcon, label: "Conta", onClick: () => nav("/profile/conta") },
    { icon: Bell, label: "Notificações", onClick: () => nav("/profile/notificacoes") },
    { icon: Accessibility, label: "Acessibilidade", onClick: () => nav("/profile/acessibilidade") },
    { icon: Info, label: "Sobre o Kwendi", onClick: () => nav("/profile/sobre") },
    { icon: LogOut, label: "Sair", destructive: true, onClick: () => setSairAberto(true) },
  ] as const;

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Definições" subtitulo="Preferências e conta" />
      <div className="px-4 py-5 pb-32">
        <div className="rounded-2xl border-2 border-border bg-card overflow-hidden">
          {items.map((item, i, arr) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full flex items-center justify-between px-4 py-4 text-left"
              style={{
                borderBottom: i < arr.length - 1 ? "1px solid hsl(var(--border))" : "none",
              }}
            >
              <span className="flex items-center gap-3 font-bold">
                <item.icon
                  className="w-5 h-5"
                  style={{
                    color: "destructive" in item && item.destructive
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--muted-foreground))",
                  }}
                />
                <span
                  style={{
                    color: "destructive" in item && item.destructive
                      ? "hsl(var(--destructive))"
                      : "hsl(var(--foreground))",
                  }}
                >
                  {item.label}
                </span>
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <SairConfirmModal aberto={sairAberto} onFechar={() => setSairAberto(false)} />
    </motion.div>
  );
};

export default DefinicoesScreen;