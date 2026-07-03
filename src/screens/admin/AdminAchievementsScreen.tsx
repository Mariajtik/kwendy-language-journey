import { useEffect, useState } from "react";
import { getAdminDataSource, type AchievementStats } from "@/admin/dataSource";
import { StatCard } from "@/components/admin/StatCard";
import { Trophy, Sparkles, BookMarked, Target } from "lucide-react";

const AdminAchievementsScreen = () => {
  const ds = getAdminDataSource();
  const [ach, setAch] = useState<AchievementStats | null>(null);

  useEffect(() => {
    ds.getAchievements().then(setAch);
  }, [ds]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Conquistas & Premium</h1>
        <p className="text-sm text-white/50">Nivelamento, marcos e assinatura.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Ancião"
          value={ach?.ancao ? "Sim" : "Não"}
          icon={<Trophy className="h-4 w-4" />}
          hint="Desbloqueia com 100% no nivelamento"
        />
        <StatCard
          label="Premium"
          value={ach?.premium ? "Ativo" : "Inativo"}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="Missões concluídas"
          value={ach?.missoesConcluidas ?? 0}
          icon={<Target className="h-4 w-4" />}
        />
        <StatCard
          label="Caderno"
          value={ach?.cadernoGuardadas ?? 0}
          icon={<BookMarked className="h-4 w-4" />}
          hint="Palavras guardadas"
        />
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-medium text-white/70 mb-4">Teste de nivelamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/40">Percentagem</div>
            <div className="font-mono text-2xl">
              {ach?.percentagemNivelamento != null ? `${ach.percentagemNivelamento}%` : "Não realizado"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-white/40">Unidade sugerida</div>
            <div className="font-mono text-2xl">{ach?.unidadeSugerida ?? "—"}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAchievementsScreen;