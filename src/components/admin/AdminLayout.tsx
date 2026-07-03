import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getAdminDataSource } from "@/admin/dataSource";
import { LayoutDashboard, Users, TrendingUp, Clock, Trophy, LogOut } from "lucide-react";

const nav = [
  { to: "/grupo16Kwendi/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/grupo16Kwendi/usuarios", label: "Usuários", icon: Users },
  { to: "/grupo16Kwendi/progresso", label: "Progresso", icon: TrendingUp },
  { to: "/grupo16Kwendi/sessoes", label: "Sessões", icon: Clock },
  { to: "/grupo16Kwendi/conquistas", label: "Conquistas", icon: Trophy },
];

export const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const ds = getAdminDataSource();

  const handleLogout = () => {
    logout();
    navigate("/grupo16Kwendi/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[hsl(220_20%_10%)] text-white font-sans">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-white/5 bg-black/30 flex flex-col">
          <div className="p-6 border-b border-white/5">
            <div className="text-xs uppercase tracking-widest text-white/40">Kwendi</div>
            <div className="mt-1 text-lg font-semibold" style={{ color: "hsl(5 84% 62%)" }}>
              Painel Admin
            </div>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-white/5">
            <div className="mb-3 rounded-md bg-white/5 px-3 py-2 text-[10px] uppercase tracking-wider text-white/50">
              Fonte: {ds.kind === "localStorage" ? "LocalStorage (dispositivo atual)" : "Backend"}
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};