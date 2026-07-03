import { useEffect, useMemo, useState } from "react";
import { getAdminDataSource, type AdminUser } from "@/admin/dataSource";
import { Download, Search } from "lucide-react";

const toCSV = (rows: AdminUser[]) => {
  const header = ["id", "nome", "email", "nivel", "xp", "diamantes", "streak", "premium", "cadastradoEm", "resultadoNivelamento"];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    header.join(","),
    ...rows.map((r) => header.map((k) => escape((r as any)[k])).join(",")),
  ].join("\n");
};

const AdminUsersScreen = () => {
  const ds = getAdminDataSource();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    ds.listUsers().then(setUsers);
  }, [ds]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) => u.nome.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.nivel.toLowerCase().includes(term),
    );
  }, [users, q]);

  const exportCSV = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kwendi-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Usuários</h1>
          <p className="text-sm text-white/50">{filtered.length} de {users.length} registados</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por nome, email ou nível…"
          className="w-full rounded-lg border border-white/10 bg-black/30 pl-9 pr-3 py-2 text-sm outline-none focus:border-white/30"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03] text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Nome</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Nível</th>
              <th className="text-right px-4 py-3">XP</th>
              <th className="text-right px-4 py-3">Diamantes</th>
              <th className="text-right px-4 py-3">Streak</th>
              <th className="text-center px-4 py-3">Premium</th>
              <th className="text-right px-4 py-3">Nivelamento</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3">{u.nome}</td>
                <td className="px-4 py-3 text-white/70">{u.email}</td>
                <td className="px-4 py-3 text-white/70">{u.nivel}</td>
                <td className="px-4 py-3 text-right font-mono">{u.xp}</td>
                <td className="px-4 py-3 text-right font-mono">{u.diamantes}</td>
                <td className="px-4 py-3 text-right font-mono">{u.streak}</td>
                <td className="px-4 py-3 text-center">
                  {u.premium ? (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">Sim</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {u.resultadoNivelamento != null ? `${u.resultadoNivelamento}%` : "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-white/40">
                  Sem resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersScreen;