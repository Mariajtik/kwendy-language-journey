/**
 * SupabaseDataSource.ts
 * ---------------------
 * Implementação `AdminDataSource` que lê o backend real.
 * As agregações críticas usam as RPCs `admin_overview` e `admin_sessions_stats`
 * (SECURITY DEFINER, protegidas por `has_role`).
 */

import type {
  AdminDataSource,
  AdminUser,
  ProgressStats,
  SessionStats,
  AchievementStats,
  OverviewStats,
  OverviewAlert,
} from "./dataSource";

/**
 * Fase 1 (Cloud novo): admin real fica para a Fase 4 (RPCs `admin_overview`,
 * `admin_sessions_stats` + tabelas `progresso`, `eventos`). Por agora retornamos
 * estruturas vazias para o build passar. As telas admin continuam a mostrar UI,
 * apenas sem dados.
 */
export class SupabaseDataSource implements AdminDataSource {
  readonly kind = "backend" as const;

  async listUsers(): Promise<AdminUser[]> {
    return [];
  }

  async getProgress(): Promise<ProgressStats> {
    return {
      xpTotal: 0,
      diamantes: 0,
      streak: 0,
      seccoesCompletas: 0,
      unidadeAtual: "—",
      moduloProgresso: [],
    };
  }

  async getSessions(): Promise<SessionStats> {
    return { totalSessoes: 0, tempoTotalMs: 0, tempoMedioMs: 0, ativosHoje: 0, porDia: [] };
  }

  async getAchievements(): Promise<AchievementStats> {
    return {
      ancao: false,
      premium: false,
      percentagemNivelamento: null,
      unidadeSugerida: null,
      missoesConcluidas: 0,
      cadernoGuardadas: 0,
    };
  }

  async getOverview(): Promise<OverviewStats> {
    const alertas: OverviewAlert[] = [];
    alertas.push({ nivel: "info", texto: "Admin real disponível na Fase 4." });
    return {
      totalUsuarios: 0,
      totalCadastrados: 0,
      totalStealth: 0,
      stealthAtivosAgora: 0,
      stealthExpirandoEm24h: 0,
      premiumAtivos: 0,
      ativosHoje: 0,
      porRegiao: [],
      porPais: [],
      porMotivacao: [],
      porTipo: [],
      novosPorDia: [],
      alertas,
    };
  }
}