/**
 * dataSource.ts
 * -------------
 * Abstração que o painel admin consome para obter dados. Hoje há apenas a
 * implementação LocalStorage (dispositivo atual). Quando o backend estiver
 * pronto, criar `SupabaseDataSource` e trocar via flag `VITE_ADMIN_USE_BACKEND`.
 */

import { LocalStorageDataSource } from "./LocalStorageDataSource";
import { SupabaseDataSource } from "./SupabaseDataSource";

function hasSupabaseSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("sb-") || !key.endsWith("-auth-token")) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      if (parsed?.access_token) return true;
    }
  } catch {
    /* noop */
  }
  return false;
}

export type AdminUser = {
  id: string;
  nome: string;
  email: string;
  nivel: string;
  xp: number;
  diamantes: number;
  streak: number;
  premium: boolean;
  cadastradoEm: string | null;
  resultadoNivelamento: number | null;
  tipo: "signup" | "stealth" | "device";
  regiao: string | null;
  pais: string | null;
  motivacao: string | null;
  stealthAtivo: boolean;
  stealthExpiraEm: string | null;
};

export type SessionEntry = {
  startedAt: number;
  endedAt: number;
  route: string;
};

export type ProgressStats = {
  xpTotal: number;
  diamantes: number;
  streak: number;
  seccoesCompletas: number;
  unidadeAtual: string;
  moduloProgresso: { modulo: string; completas: number }[];
};

export type SessionStats = {
  totalSessoes: number;
  tempoMedioMs: number;
  tempoTotalMs: number;
  ativosHoje: number;
  porDia: { dia: string; sessoes: number; tempoMs: number }[];
};

export type AchievementStats = {
  ancao: boolean;
  premium: boolean;
  percentagemNivelamento: number | null;
  unidadeSugerida: string | null;
  missoesConcluidas: number;
  cadernoGuardadas: number;
};

export type OverviewAlert = { nivel: "warn" | "info" | "danger"; texto: string };

export type OverviewStats = {
  totalUsuarios: number;
  totalCadastrados: number;
  totalStealth: number;
  stealthAtivosAgora: number;
  stealthExpirandoEm24h: number;
  premiumAtivos: number;
  ativosHoje: number;
  porRegiao: { regiao: string; total: number }[];
  porPais: { pais: string; total: number }[];
  porMotivacao: { motivo: string; total: number }[];
  porTipo: { tipo: string; total: number }[];
  novosPorDia: { dia: string; total: number }[];
  alertas: OverviewAlert[];
};

export interface AdminDataSource {
  readonly kind: "localStorage" | "backend";
  listUsers(): Promise<AdminUser[]>;
  getProgress(): Promise<ProgressStats>;
  getSessions(): Promise<SessionStats>;
  getAchievements(): Promise<AchievementStats>;
  getOverview(): Promise<OverviewStats>;
}

let _instance: AdminDataSource | null = null;

/**
 * Devolve o datasource ativo. Se houver sessão Supabase autenticada com role
 * admin (verificado por `useAdminAuth`), usamos o backend. Caso contrário,
 * fallback para o dispositivo local (útil em modo teste sem backend).
 */
export function getAdminDataSource(): AdminDataSource {
  if (_instance) return _instance;
  _instance = hasSupabaseSession()
    ? new SupabaseDataSource()
    : new LocalStorageDataSource();
  return _instance;
}

/** Força a criação de uma instância específica (usada após login admin). */
export function setAdminDataSource(kind: "localStorage" | "backend") {
  _instance = kind === "backend" ? new SupabaseDataSource() : new LocalStorageDataSource();
}

/** Reset (chamar em logout). */
export function resetAdminDataSource() {
  _instance = null;
}