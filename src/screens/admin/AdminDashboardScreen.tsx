import { useEffect, useState } from "react";
import {
  getAdminDataSource,
  type AdminUser,
  type SessionStats,
  type ProgressStats,
  type AchievementStats,
  type OverviewStats,
} from "@/admin/dataSource";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Clock, Sparkles, Flame, EyeOff, AlertTriangle, TrendingUp, Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const fmtDuration = (ms: number) => {
  if (!ms) return "0m";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h) return `${h}h ${m % 60}m`;
  if (m) return `${m}m ${s % 60}s`;
  return `${s}s`;
};

const AXIS = { stroke: "rgba(255,255,255,0.4)", fontSize: 11 };
const GRID = "rgba(255,255,255,0.06)";
const CRIMSON = "hsl(5 84% 62%)";
const COLORS = [CRIMSON, "#60a5fa", "#34d399", "#fbbf24", "#a78bfa"];

const AdminDashboardScreen = () => {
  const ds = getAdminDataSource();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [prog, setProg] = useState<ProgressStats | null>(null);
  const [sess, setSess] = useState<SessionStats | null>(null);
  const [ach, setAch] = useState<AchievementStats | null>(null);
  const [ov, setOv] = useState<OverviewStats | null>(null);

  useEffect(() => {
    (async () => {
      const [u, p, s, a, o] = await Promise.all([
        ds.listUsers(),
        ds.getProgress(),
        ds.getSessions(),
        ds.getAchievements(),
        ds.getOverview(),
      ]);
      setUsers(u);
      setProg(p);
      setSess(s);
      setAch(a);
      setOv(o);
    })();
  }, [ds]);

  const nivelDist = (() => {
    const map = new Map<string, number>();
    for (const u of users) map.set(u.nivel, (map.get(u.nivel) ?? 0) + 1);
    return [...map.entries()].map(([nivel, valor]) => ({ nivel, valor }));
  })();

  const retencao = ov && ov.totalCadastrados > 0
    ? Math.round((ov.ativosHoje / ov.totalCadastrados) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Visão geral</h1>
        <p className="text-sm text-white/50">Estatísticas do app em tempo real.</p>
      </header>

      {/* Cards críticos */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Cadastrados" value={ov?.totalCadastrados ?? 0} icon={<Users className="h-4 w-4" />} />
        <StatCard
          label="Modo furtivo"
          value={`${ov?.stealthAtivosAgora ?? 0} / ${ov?.totalStealth ?? 0}`}
          hint="ativos / total"
          icon={<EyeOff className="h-4 w-4" />}
        />
        <StatCard label="Premium ativos" value={ov?.premiumAtivos ?? 0} icon={<Sparkles className="h-4 w-4" />} />
        <StatCard label="Ativos hoje" value={sess?.ativosHoje ?? 0} icon={<Flame className="h-4 w-4" />} />
        <StatCard
          label="Tempo médio"
          value={fmtDuration(sess?.tempoMedioMs ?? 0)}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard label="Retenção" value={`${retencao}%`} hint="ativos hoje ÷ cadastrados" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      {/* Faixa de alertas */}
      {ov && ov.alertas.length > 0 && (
        <section className="space-y-2">
          {ov.alertas.map((a, i) => {
            const styles =
              a.nivel === "warn"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                : a.nivel === "danger"
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-white/10 bg-white/[0.03] text-white/70";
            const Icon = a.nivel === "info" ? Info : AlertTriangle;
            return (
              <div key={i} className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles}`}>
                <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{a.texto}</span>
              </div>
            );
          })}
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Sessões — últimos 30 dias</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={sess?.porDia ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="dia" tick={AXIS} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={AXIS} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="sessoes" stroke={CRIMSON} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Signup vs Modo furtivo</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ov?.porTipo ?? []} dataKey="total" nameKey="tipo" outerRadius={80} label>
                  {(ov?.porTipo ?? []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Top províncias / países</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={(ov?.porRegiao ?? []).slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={AXIS} allowDecimals={false} />
                <YAxis type="category" dataKey="regiao" tick={AXIS} width={110} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="total" fill={CRIMSON} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Motivações de aprendizagem</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={ov?.porMotivacao ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="motivo" tick={AXIS} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={AXIS} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="total" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Novos registos — últimos 30 dias</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={ov?.novosPorDia ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="dia" tick={AXIS} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={AXIS} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Line type="monotone" dataKey="total" stroke="#fbbf24" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Distribuição por nível</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={nivelDist} dataKey="valor" nameKey="nivel" outerRadius={80} label>
                  {nivelDist.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">XP por usuário (top 10)</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={[...users].sort((a, b) => b.xp - a.xp).slice(0, 10)}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="nome" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="xp" fill={CRIMSON} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Secções completas por módulo</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={prog?.moduloProgresso ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="modulo" tick={AXIS} />
                <YAxis tick={AXIS} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="completas" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {ach && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Conquistas globais</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-white/50 text-xs uppercase">Ancião</div>
              <div className="font-mono text-lg">{ach.ancao ? "Desbloqueado" : "Bloqueado"}</div>
            </div>
            <div>
              <div className="text-white/50 text-xs uppercase">Nivelamento</div>
              <div className="font-mono text-lg">
                {ach.percentagemNivelamento != null ? `${ach.percentagemNivelamento}%` : "—"}
              </div>
            </div>
            <div>
              <div className="text-white/50 text-xs uppercase">Missões</div>
              <div className="font-mono text-lg">{ach.missoesConcluidas}</div>
            </div>
            <div>
              <div className="text-white/50 text-xs uppercase">Caderno</div>
              <div className="font-mono text-lg">{ach.cadernoGuardadas}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboardScreen;