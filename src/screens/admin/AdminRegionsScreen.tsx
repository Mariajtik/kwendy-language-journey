import { useEffect, useMemo, useState } from "react";
import { getAdminDataSource, type OverviewStats } from "@/admin/dataSource";
import { StatCard } from "@/components/admin/StatCard";
import { MapPin, Globe2, Flag } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const AXIS = { stroke: "rgba(255,255,255,0.4)", fontSize: 11 };
const GRID = "rgba(255,255,255,0.06)";
const CRIMSON = "hsl(5 84% 62%)";

const AdminRegionsScreen = () => {
  const ds = getAdminDataSource();
  const [ov, setOv] = useState<OverviewStats | null>(null);

  useEffect(() => {
    ds.getOverview().then(setOv);
  }, [ds]);

  const provincias = ov?.porRegiao ?? [];
  const paises = ov?.porPais ?? [];

  const stats = useMemo(() => {
    const totalPaises = paises.length;
    const angola = paises.find((p) => p.pais === "Angola")?.total ?? 0;
    const outrosPaises = paises.filter((p) => p.pais !== "Angola");
    const totalOutros = outrosPaises.reduce((a, b) => a + b.total, 0);
    const totalGeo = angola + totalOutros;
    const pctAngola = totalGeo ? Math.round((angola / totalGeo) * 100) : 0;
    return { totalPaises, pctAngola, outrosPaises, totalGeo };
  }, [paises]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Regiões</h1>
        <p className="text-sm text-white/50">Distribuição geográfica dos utilizadores.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Províncias distintas" value={provincias.length} icon={<MapPin className="h-4 w-4" />} />
        <StatCard label="Países distintos" value={stats.totalPaises} icon={<Globe2 className="h-4 w-4" />} />
        <StatCard label="% Angola" value={`${stats.pctAngola}%`} hint="vs diáspora" icon={<Flag className="h-4 w-4" />} />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/70 mb-4">Utilizadores por região</h2>
        <div className="h-96">
          <ResponsiveContainer>
            <BarChart data={provincias} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={AXIS} allowDecimals={false} />
              <YAxis type="category" dataKey="regiao" tick={AXIS} width={130} />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
              <Bar dataKey="total" fill={CRIMSON} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {stats.outrosPaises.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-sm font-medium text-white/70 mb-4">Diáspora — utilizadores por país (excluindo Angola)</h2>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={stats.outrosPaises}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="pais" tick={AXIS} interval={0} angle={-25} textAnchor="end" height={70} />
                <YAxis tick={AXIS} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="total" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03] text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3">Região</th>
              <th className="text-right px-4 py-3">Utilizadores</th>
              <th className="text-right px-4 py-3">% do total</th>
            </tr>
          </thead>
          <tbody>
            {provincias.map((r) => {
              const total = provincias.reduce((a, b) => a + b.total, 0);
              const pct = total ? Math.round((r.total / total) * 100) : 0;
              return (
                <tr key={r.regiao} className="border-t border-white/5">
                  <td className="px-4 py-3">{r.regiao}</td>
                  <td className="px-4 py-3 text-right font-mono">{r.total}</td>
                  <td className="px-4 py-3 text-right font-mono text-white/60">{pct}%</td>
                </tr>
              );
            })}
            {provincias.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-white/40">
                  Ainda sem dados de região.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegionsScreen;