/**
 * EstatisticasScreen — painel Premium com XP semanal, tempo estudado,
 * precisão, heatmap e exportação CSV. Se o utilizador não for premium,
 * mostra pré-visualização borrada com CTA para a loja.
 */
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { useEstatisticas } from "@/hooks/useEstatisticas";
import { useOfensiva } from "@/hooks/useOfensiva";
import { useNivelamento } from "@/hooks/useNivelamento";
import { usePremium } from "@/contexts/PremiumContext";
import Heatmap from "@/components/stats/Heatmap";
import SemanaOfensiva from "@/components/stats/SemanaOfensiva";
import { useTranslation } from "react-i18next";

function exportarCsv(dias: { data: string; xp: number; minutos: number; acertos: number; erros: number }[]) {
  const linhas = [
    "data,xp,minutos,precisao",
    ...dias.map((d) => {
      const total = d.acertos + d.erros;
      const prec = total === 0 ? "" : ((d.acertos / total) * 100).toFixed(1);
      return `${d.data},${d.xp},${d.minutos.toFixed(1)},${prec}`;
    }),
  ];
  const blob = new Blob([linhas.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const d = new Date();
  const iso = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  a.download = `stats-kwendi-${iso}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const StatCard = ({ label, valor, sub }: { label: string; valor: string; sub?: string }) => (
  <div
    className="rounded-2xl border-2 border-border bg-card p-4"
    style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
  >
    <p className="text-[10px] font-extrabold tracking-wider uppercase text-muted-foreground">{label}</p>
    <p className="text-2xl font-extrabold mt-1" style={{ color: "hsl(var(--foreground))" }}>{valor}</p>
    {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const EstatisticasScreen = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const { dados } = useEstatisticas();
  const { estado: of } = useOfensiva();
  const { estado: niv } = useNivelamento();
  const { ativo: premium } = usePremium();

  const delta = useMemo(() => {
    if (dados.xpSemanaAnterior === 0) return dados.xpSemanaAtual === 0 ? 0 : 100;
    return Math.round(
      ((dados.xpSemanaAtual - dados.xpSemanaAnterior) / dados.xpSemanaAnterior) * 100,
    );
  }, [dados]);

  const tempoLegivel = useMemo(() => {
    const min = Math.round(dados.tempoTotal7d / 60);
    if (min < 60) return `${min} min`;
    const h = Math.floor(min / 60);
    const rem = min % 60;
    return rem === 0 ? `${h}h` : `${h}h ${rem}m`;
  }, [dados.tempoTotal7d]);

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader
        titulo={t("stats.titulo", "Estatísticas")}
        subtitulo={t("stats.subtitulo", "Progresso e ofensiva")}
      />
      <div className="px-4 py-5 pb-32 space-y-4 relative">
        <SemanaOfensiva titulo={t("stats.semana", "Esta semana")} />

        <div className={premium ? "space-y-4" : "space-y-4 pointer-events-none blur-sm select-none"}>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label={t("stats.ofensiva", "Ofensiva")}
              valor={String(of.ofensiva)}
              sub={t("stats.dias", "dias")}
            />
            <StatCard
              label={t("stats.chamas", "Chamas")}
              valor={String(of.chamasCongeladas)}
              sub={t("stats.congeladas", "congeladas")}
            />
            <StatCard
              label={t("stats.nivel", "Nível")}
              valor={niv.cefr ?? "—"}
              sub={t("stats.cefr", "CEFR")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label={t("stats.xpSemana", "XP semana")}
              valor={String(dados.xpSemanaAtual)}
              sub={delta === 0 ? "±0%" : `${delta > 0 ? "+" : ""}${delta}% vs. anterior`}
            />
            <StatCard
              label={t("stats.tempo", "Tempo 7d")}
              valor={tempoLegivel}
              sub={t("stats.tempoSub", "estudado")}
            />
            <StatCard
              label={t("stats.precisao", "Precisão")}
              valor={`${Math.round(dados.precisao7d * 100)}%`}
              sub={t("stats.7dias", "7 dias")}
            />
          </div>

          <div
            className="rounded-2xl border-2 border-border bg-card p-4"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-extrabold tracking-widest uppercase text-muted-foreground">
                {t("stats.heatmap", "Actividade (20 semanas)")}
              </p>
              <button
                onClick={() => exportarCsv(dados.heatmap)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={3} />
                {t("stats.exportar", "Exportar CSV")}
              </button>
            </div>
            <Heatmap dias={dados.heatmap} />
          </div>
        </div>

        {!premium && (
          <div className="absolute inset-x-4 top-32 rounded-3xl bg-white p-6 text-center border-2 border-border shadow-lg">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3"
              style={{ background: "hsl(var(--primary) / 0.12)" }}>
              <Lock className="w-7 h-7" style={{ color: "hsl(var(--primary))" }} strokeWidth={3} />
            </div>
            <h2 className="text-lg font-extrabold" style={{ color: "hsl(var(--foreground))" }}>
              {t("stats.gateTitulo", "Painel Premium")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              {t(
                "stats.gateDesc",
                "Desbloqueia o painel completo: XP semanal, tempo estudado, precisão e mapa de calor.",
              )}
            </p>
            <button
              onClick={() => nav("/loja")}
              className="btn-duo btn-duo-primary w-full"
            >
              {t("stats.gateCta", "Obter Premium")}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EstatisticasScreen;