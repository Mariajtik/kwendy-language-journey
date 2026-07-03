import { useEffect, useState } from "react";
import { getAdminDataSource, type SessionStats } from "@/admin/dataSource";
import { StatCard } from "@/components/admin/StatCard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h) return `${h}h ${m % 60}m`;
  if (m) return `${m}m ${s % 60}s`;
  return `${s}s`;
};

const AdminSessionsScreen = () => {
  const ds = getAdminDataSource();
  const [sess, setSess] = useState<SessionStats | null>(null);

  useEffect(() => {
    ds.getSessions().then(setSess);
  }, [ds]);

  const dataMin = (sess?.porDia ?? []).map((d) => ({ dia: d.dia.slice(5), minutos: Math.round(d.tempoMs / 60000) }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Sessões</h1>
        <p className="text-sm text-white/50">Tempo no app e frequência de uso.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total de sessões" value={sess?.totalSessoes ?? 0} />
        <StatCard label="Tempo total" value={fmt(sess?.tempoTotalMs ?? 0)} />
        <StatCard label="Tempo médio" value={fmt(sess?.tempoMedioMs ?? 0)} />
        <StatCard label="Ativos hoje" value={sess?.ativosHoje ?? 0} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/70 mb-4">Sessões por dia (30d)</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={sess?.porDia ?? []}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Line type="monotone" dataKey="sessoes" stroke="hsl(5 84% 62%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/70 mb-4">Minutos no app por dia</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={dataMin}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="dia" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Area type="monotone" dataKey="minutos" stroke="#60a5fa" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

export default AdminSessionsScreen;