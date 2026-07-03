/**
 * LocalStorageDataSource.ts
 * -------------------------
 * Lê dados do dispositivo atual. Como o app hoje não regista uma lista de
 * utilizadores, expõe o utilizador ativo como um único registo. Preparado
 * para ser substituído pelo backend real depois.
 */

import type {
  AdminDataSource,
  AdminUser,
  ProgressStats,
  SessionStats,
  AchievementStats,
  SessionEntry,
  OverviewStats,
  OverviewAlert,
} from "./dataSource";
import { getLocalUsers, getStealthActive, type RegistryEntry } from "@/lib/adminRegistry";

const K = {
  auth: "kwendi.auth.user",
  progresso: "kwendi:progresso",
  saldo: "kwendi_saldo_v1",
  inventario: "kwendi.inventario",
  nivelamento: "kwendi:nivelamento",
  premium: "kwendi.premium.ativo",
  missoes: "kwendi_missoes_v1",
  sessoes: "kwendi_sessions",
  caderno: "kwendi:caderno",
} as const;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readAuthUser(): { id: string; nome: string; email: string; nivel?: string; cadastradoEm?: string } | null {
  const u = readJSON<any>(K.auth, null);
  if (!u) return null;
  return {
    id: u.id ?? u.email ?? "local",
    nome: u.nome ?? u.name ?? "Utilizador local",
    email: u.email ?? "—",
    nivel: u.nivel ?? u.level,
    cadastradoEm: u.cadastradoEm ?? u.createdAt,
  };
}

export class LocalStorageDataSource implements AdminDataSource {
  readonly kind = "localStorage" as const;

  async listUsers(): Promise<AdminUser[]> {
    const auth = readAuthUser();
    const saldo = readJSON<any>(K.saldo, {});
    const niv = readJSON<any>(K.nivelamento, {});
    const premium = localStorage.getItem(K.premium) === "1";
    const stealthAtivo = getStealthActive();
    const registry = getLocalUsers();

    const mapEntry = (e: RegistryEntry): AdminUser => ({
      id: e.id,
      nome: e.nome,
      email: e.email ?? "—",
      nivel: e.nivel ?? (e.tipo === "stealth" ? "furtivo" : "iniciante"),
      xp: 0,
      diamantes: 0,
      streak: 0,
      premium: false,
      cadastradoEm: e.criadoEm,
      resultadoNivelamento: null,
      tipo: e.tipo,
      regiao: e.provincia ?? e.pais ?? null,
      pais: e.pais ?? null,
      motivacao: e.motivacao ?? null,
      stealthAtivo:
        e.tipo === "stealth" && !!e.expiraEm && Date.parse(e.expiraEm) > Date.now(),
      stealthExpiraEm: e.expiraEm ?? null,
    });

    const users: AdminUser[] = registry.map(mapEntry);

    // Adiciona também o "dispositivo atual" com métricas em tempo real (XP/diamantes/streak).
    const deviceUser: AdminUser = {
      id: auth?.id ?? "device",
      nome: auth?.nome ?? "Dispositivo atual",
      email: auth?.email ?? "—",
      nivel: auth?.nivel ?? (niv.ancao ? "avancado" : "iniciante"),
      xp: Number(saldo.xp ?? 0),
      diamantes: Number(saldo.diamantes ?? 0),
      streak: Number(saldo.ofensiva ?? saldo.streak ?? 0),
      premium,
      cadastradoEm: auth?.cadastradoEm ?? null,
      resultadoNivelamento: typeof niv.percentagem === "number" ? niv.percentagem : null,
      tipo: auth ? "signup" : "device",
      regiao: null,
      pais: null,
      motivacao: null,
      stealthAtivo: !!stealthAtivo,
      stealthExpiraEm: stealthAtivo?.expiraEm ?? null,
    };

    // Evita duplicar se o auth user já constar no registry (mesmo email).
    const exists = auth && users.some((u) => u.email === auth.email);
    if (!exists) users.unshift(deviceUser);

    return users;
  }

  async getProgress(): Promise<ProgressStats> {
    const progresso = readJSON<any>(K.progresso, { seccoesCompletas: [], unidadeAtual: "" });
    const saldo = readJSON<any>(K.saldo, {});
    const seccoes: string[] = Array.isArray(progresso.seccoesCompletas) ? progresso.seccoesCompletas : [];

    // Agrupa por prefixo do id da secção (ex.: "m1-u2-s3" -> "m1").
    const porModulo = new Map<string, number>();
    for (const id of seccoes) {
      const mod = id.split("-")[0] ?? "?";
      porModulo.set(mod, (porModulo.get(mod) ?? 0) + 1);
    }

    return {
      xpTotal: Number(saldo.xp ?? 0),
      diamantes: Number(saldo.diamantes ?? 0),
      streak: Number(saldo.ofensiva ?? saldo.streak ?? 0),
      seccoesCompletas: seccoes.length,
      unidadeAtual: progresso.unidadeAtual ?? "—",
      moduloProgresso: [...porModulo.entries()].map(([modulo, completas]) => ({ modulo, completas })),
    };
  }

  async getSessions(): Promise<SessionStats> {
    const sess = readJSON<SessionEntry[]>(K.sessoes, []);
    const total = sess.length;
    const durs = sess.map((s) => Math.max(0, s.endedAt - s.startedAt));
    const tempoTotal = durs.reduce((a, b) => a + b, 0);
    const tempoMedio = total ? tempoTotal / total : 0;

    const hoje = new Date().toISOString().slice(0, 10);
    const ativosHoje = sess.filter((s) => new Date(s.startedAt).toISOString().slice(0, 10) === hoje).length;

    // Últimos 30 dias
    const dias = new Map<string, { sessoes: number; tempoMs: number }>();
    const now = Date.now();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      dias.set(d, { sessoes: 0, tempoMs: 0 });
    }
    for (const s of sess) {
      const d = new Date(s.startedAt).toISOString().slice(0, 10);
      const cur = dias.get(d);
      if (cur) {
        cur.sessoes += 1;
        cur.tempoMs += Math.max(0, s.endedAt - s.startedAt);
      }
    }

    return {
      totalSessoes: total,
      tempoMedioMs: tempoMedio,
      tempoTotalMs: tempoTotal,
      ativosHoje,
      porDia: [...dias.entries()].map(([dia, v]) => ({ dia, sessoes: v.sessoes, tempoMs: v.tempoMs })),
    };
  }

  async getAchievements(): Promise<AchievementStats> {
    const niv = readJSON<any>(K.nivelamento, {});
    const missoes = readJSON<any>(K.missoes, {});
    const caderno = readJSON<any[]>(K.caderno, []);
    const missoesConcluidas = Array.isArray(missoes?.concluidas)
      ? missoes.concluidas.length
      : Object.values(missoes ?? {}).filter((v: any) => v?.concluida).length;

    return {
      ancao: !!niv.ancao,
      premium: localStorage.getItem(K.premium) === "1",
      percentagemNivelamento: typeof niv.percentagem === "number" ? niv.percentagem : null,
      unidadeSugerida: niv.unidadeSugerida ?? null,
      missoesConcluidas: Number(missoesConcluidas ?? 0),
      cadernoGuardadas: Array.isArray(caderno) ? caderno.length : 0,
    };
  }

  async getOverview(): Promise<OverviewStats> {
    const users = await this.listUsers();
    const sess = await this.getSessions();

    const cadastrados = users.filter((u) => u.tipo === "signup");
    const stealthAll = users.filter((u) => u.tipo === "stealth");
    const stealthAtivos = stealthAll.filter((u) => u.stealthAtivo);
    const now = Date.now();
    const stealthExpirandoEm24h = stealthAll.filter(
      (u) =>
        u.stealthExpiraEm &&
        Date.parse(u.stealthExpiraEm) > now &&
        Date.parse(u.stealthExpiraEm) - now <= 86400000,
    ).length;
    const premiumAtivos = users.filter((u) => u.premium).length;

    const bucket = <T>(arr: T[], key: (t: T) => string | null | undefined) => {
      const m = new Map<string, number>();
      for (const it of arr) {
        const k = key(it);
        if (!k) continue;
        m.set(k, (m.get(k) ?? 0) + 1);
      }
      return [...m.entries()]
        .map(([k, total]) => ({ k, total }))
        .sort((a, b) => b.total - a.total);
    };

    const porRegiao = bucket(users, (u) => u.regiao).map((x) => ({ regiao: x.k, total: x.total }));
    const porPais = bucket(users, (u) => u.pais).map((x) => ({ pais: x.k, total: x.total }));
    const porMotivacao = bucket(users, (u) => u.motivacao).map((x) => ({ motivo: x.k, total: x.total }));
    const porTipo = bucket(users, (u) => (u.tipo === "device" ? null : u.tipo)).map((x) => ({
      tipo: x.k === "signup" ? "Cadastrados" : "Modo furtivo",
      total: x.total,
    }));

    // Novos por dia (30 dias) baseado em cadastradoEm.
    const dias = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000).toISOString().slice(0, 10);
      dias.set(d, 0);
    }
    for (const u of users) {
      if (!u.cadastradoEm) continue;
      const d = u.cadastradoEm.slice(0, 10);
      if (dias.has(d)) dias.set(d, (dias.get(d) ?? 0) + 1);
    }
    const novosPorDia = [...dias.entries()].map(([dia, total]) => ({ dia, total }));

    // Alertas condicionais.
    const alertas: OverviewAlert[] = [];
    if (stealthExpirandoEm24h > 0) {
      alertas.push({
        nivel: "warn",
        texto: `${stealthExpirandoEm24h} conta(s) em modo furtivo expiram nas próximas 24h.`,
      });
    }
    const totalNaoDispositivo = cadastrados.length + stealthAll.length;
    if (totalNaoDispositivo > 0) {
      const pctStealth = Math.round((stealthAll.length / totalNaoDispositivo) * 100);
      if (pctStealth > 40) {
        alertas.push({
          nivel: "warn",
          texto: `${pctStealth}% dos utilizadores estão em modo furtivo (sem conta real).`,
        });
      }
    }
    if (sess.totalSessoes === 0) {
      alertas.push({ nivel: "info", texto: "Ainda sem dados de sessão registados neste dispositivo." });
    }
    if (sess.ativosHoje === 0 && sess.totalSessoes > 0) {
      alertas.push({ nivel: "info", texto: "Nenhum utilizador ativo hoje." });
    }
    if (cadastrados.length === 0 && stealthAll.length === 0) {
      alertas.push({
        nivel: "info",
        texto: "Nenhum registo local ainda — os dados aparecem após um signup ou ativação do modo furtivo.",
      });
    }

    return {
      totalUsuarios: users.length,
      totalCadastrados: cadastrados.length,
      totalStealth: stealthAll.length,
      stealthAtivosAgora: stealthAtivos.length,
      stealthExpirandoEm24h,
      premiumAtivos,
      ativosHoje: sess.ativosHoje,
      porRegiao,
      porPais,
      porMotivacao,
      porTipo,
      novosPorDia,
      alertas,
    };
  }
}