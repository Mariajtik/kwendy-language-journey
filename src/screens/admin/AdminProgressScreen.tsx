import { useEffect, useState } from "react";
import { getAdminDataSource, type ProgressStats } from "@/admin/dataSource";
import { StatCard } from "@/components/admin/StatCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const AdminProgressScreen = () => {
  const ds = getAdminDataSource();
  const [prog, setProg] = useState<ProgressStats | null>(null);

  useEffect(() => {
    ds.getProgress().then(setProg);
  }, [ds]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Progresso</h1>
        <p className="text-sm text-white/50">XP, diamantes, streak e conclusão de secções.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="XP total" value={prog?.xpTotal ?? 0} />
        <StatCard label="Diamantes" value={prog?.diamantes ?? 0} />
        <StatCard label="Streak" value={prog?.streak ?? 0} hint="ofensiva atual" />
        <StatCard label="Secções completas" value={prog?.seccoesCompletas ?? 0} hint={`Unidade: ${prog?.unidadeAtual ?? "—"}`} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/70 mb-4">Secções completas por módulo</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={prog?.moduloProgresso ?? []}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="modulo" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Bar dataKey="completas" fill="hsl(5 84% 62%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AdminProgressScreen;