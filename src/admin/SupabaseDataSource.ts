/**
 * SupabaseDataSource.ts
 * ---------------------
 * Implementação `AdminDataSource` que lê o backend real.
 * As agregações críticas usam as RPCs `admin_overview` e `admin_sessions_stats`
 * (SECURITY DEFINER, protegidas por `has_role`).
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  AdminDataSource,
  AdminUser,
  ProgressStats,
  SessionStats,
  AchievementStats,
  OverviewStats,
  OverviewAlert,
} from "./dataSource";

export class SupabaseDataSource implements AdminDataSource {
  readonly kind = "backend" as const;

  async listUsers(): Promise<AdminUser[]> {
    const { data: profiles, error } = await supabase
      .from("profiles")
      .select(
        "id, nome, email, provincia, pais, motivacao, tipo, stealth_expira_em, criado_em, nivel_declarado",
      )
      .order("criado_em", { ascending: false });
    if (error || !profiles) return [];

    const ids = profiles.map((p) => p.id);
    const { data: prog } = await supabase
      .from("progresso")
      .select("user_id, xp, diamantes, streak, premium, nivelamento_percentagem, ancao")
      .in("user_id", ids);
    const progMap = new Map((prog ?? []).map((p: any) => [p.user_id, p]));

    const now = Date.now();
    return profiles.map((p: any) => {
      const pr: any = progMap.get(p.id) ?? {};
      return {
        id: p.id,
        nome: p.nome ?? p.email?.split("@")[0] ?? "—",
        email: p.email ?? "—",
        nivel: p.nivel_declarado ?? (pr.ancao ? "avancado" : "iniciante"),
        xp: Number(pr.xp ?? 0),
        diamantes: Number(pr.diamantes ?? 0),
        streak: Number(pr.streak ?? 0),
        premium: !!pr.premium,
        cadastradoEm: p.criado_em ?? null,
        resultadoNivelamento:
          typeof pr.nivelamento_percentagem === "number" ? pr.nivelamento_percentagem : null,
        tipo: (p.tipo as "signup" | "stealth") ?? "signup",
        regiao: p.provincia ?? p.pais ?? null,
        pais: p.pais ?? null,
        motivacao: p.motivacao ?? null,
        stealthAtivo:
          p.tipo === "stealth" && !!p.stealth_expira_em && Date.parse(p.stealth_expira_em) > now,
        stealthExpiraEm: p.stealth_expira_em ?? null,
      } satisfies AdminUser;
    });
  }

  async getProgress(): Promise<ProgressStats> {
    const { data } = await supabase
      .from("progresso")
      .select("xp, diamantes, streak, seccoes_completas, unidade_atual");
    const rows = data ?? [];
    const xpTotal = rows.reduce((a: number, r: any) => a + Number(r.xp ?? 0), 0);
    const diamantes = rows.reduce((a: number, r: any) => a + Number(r.diamantes ?? 0), 0);
    const streak = rows.reduce((m: number, r: any) => Math.max(m, Number(r.streak ?? 0)), 0);
    const porModulo = new Map<string, number>();
    let seccoesCompletas = 0;
    for (const r of rows) {
      const arr: string[] = Array.isArray(r.seccoes_completas) ? r.seccoes_completas : [];
      seccoesCompletas += arr.length;
      for (const id of arr) {
        const mod = id.split("-")[0] ?? "?";
        porModulo.set(mod, (porModulo.get(mod) ?? 0) + 1);
      }
    }
    return {
      xpTotal,
      diamantes,
      streak,
      seccoesCompletas,
      unidadeAtual: rows[0]?.unidade_atual ?? "—",
      moduloProgresso: [...porModulo.entries()].map(([modulo, completas]) => ({ modulo, completas })),
    };
  }

  async getSessions(): Promise<SessionStats> {
    const { data } = await supabase.rpc("admin_sessions_stats");
    const d: any = data ?? {};
    return {
      totalSessoes: Number(d.totalSessoes ?? 0),
      tempoTotalMs: Number(d.tempoTotalMs ?? 0),
      tempoMedioMs: Number(d.tempoMedioMs ?? 0),
      ativosHoje: Number(d.ativosHoje ?? 0),
      porDia: Array.isArray(d.porDia)
        ? d.porDia.map((r: any) => ({
            dia: r.dia,
            sessoes: Number(r.sessoes ?? 0),
            tempoMs: Number(r.tempoMs ?? 0),
          }))
        : [],
    };
  }

  async getAchievements(): Promise<AchievementStats> {
    const { data } = await supabase
      .from("progresso")
      .select("premium, ancao, nivelamento_percentagem, unidade_atual");
    const rows = data ?? [];
    const premium = rows.filter((r: any) => r.premium).length > 0;
    const ancao = rows.filter((r: any) => r.ancao).length > 0;
    const withNiv = rows.filter((r: any) => typeof r.nivelamento_percentagem === "number");
    const avgNiv = withNiv.length
      ? Math.round(
          withNiv.reduce((a: number, r: any) => a + Number(r.nivelamento_percentagem), 0) /
            withNiv.length,
        )
      : null;
    const { count: missoesCount } = await supabase
      .from("eventos")
      .select("id", { count: "exact", head: true })
      .eq("tipo", "missao_concluida");
    const { count: cadernoCount } = await supabase
      .from("eventos")
      .select("id", { count: "exact", head: true })
      .eq("tipo", "caderno_guardar");
    return {
      ancao,
      premium,
      percentagemNivelamento: avgNiv,
      unidadeSugerida: rows[0]?.unidade_atual ?? null,
      missoesConcluidas: missoesCount ?? 0,
      cadernoGuardadas: cadernoCount ?? 0,
    };
  }

  async getOverview(): Promise<OverviewStats> {
    const { data } = await supabase.rpc("admin_overview");
    const d: any = data ?? {};
    const totalCadastrados = Number(d.totalCadastrados ?? 0);
    const totalStealth = Number(d.totalStealth ?? 0);
    const stealthAtivosAgora = Number(d.stealthAtivosAgora ?? 0);
    const stealthExpirandoEm24h = Number(d.stealthExpirandoEm24h ?? 0);
    const premiumAtivos = Number(d.premiumAtivos ?? 0);
    const ativosHoje = Number(d.ativosHoje ?? 0);

    const alertas: OverviewAlert[] = [];
    if (stealthExpirandoEm24h > 0) {
      alertas.push({
        nivel: "warn",
        texto: `${stealthExpirandoEm24h} conta(s) em modo furtivo expiram nas próximas 24h.`,
      });
    }
    const total = totalCadastrados + totalStealth;
    if (total > 0) {
      const pct = Math.round((totalStealth / total) * 100);
      if (pct > 40) {
        alertas.push({
          nivel: "warn",
          texto: `${pct}% dos utilizadores estão em modo furtivo (sem conta real).`,
        });
      }
    }
    if (total === 0) {
      alertas.push({
        nivel: "info",
        texto: "Ainda sem utilizadores registados no backend.",
      });
    }

    return {
      totalUsuarios: total,
      totalCadastrados,
      totalStealth,
      stealthAtivosAgora,
      stealthExpirandoEm24h,
      premiumAtivos,
      ativosHoje,
      porRegiao: Array.isArray(d.porRegiao) ? d.porRegiao : [],
      porPais: Array.isArray(d.porPais) ? d.porPais : [],
      porMotivacao: Array.isArray(d.porMotivacao) ? d.porMotivacao : [],
      porTipo: Array.isArray(d.porTipo) ? d.porTipo : [],
      novosPorDia: Array.isArray(d.novosPorDia) ? d.novosPorDia : [],
      alertas,
    };
  }
}