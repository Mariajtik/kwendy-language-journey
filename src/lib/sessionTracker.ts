/**
 * sessionTracker.ts
 * -----------------
 * Regista sessões (start/end) em localStorage["kwendi_sessions"], capado a 200.
 * Uma sessão fecha quando a aba fica escondida ou após 5 min de inatividade.
 */

const KEY = "kwendi_sessions";
const MAX = 200;
const IDLE_MS = 5 * 60 * 1000;

function adminTesting(): boolean {
  try {
    return sessionStorage.getItem("kwendi_admin_testing") === "1";
  } catch {
    return false;
  }
}

// Import lazy para evitar ciclos.
let _remoteSessionId: string | null = null;
let _remoteUserId: string | null = null;

async function pushRemote(startedAt: number, endedAt: number, route: string) {
  if (adminTesting()) return;
  try {
    const mod = await import("@/integrations/supabase/client");
    const { supabase } = mod;
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user?.id ?? null;
    if (!uid) return;
    if (_remoteUserId && _remoteUserId !== uid) {
      _remoteSessionId = null;
    }
    _remoteUserId = uid;
    if (!_remoteSessionId) {
      const { data, error } = await supabase
        .from("sessoes")
        .insert({
          user_id: uid,
          iniciada_em: new Date(startedAt).toISOString(),
          terminada_em: new Date(endedAt).toISOString(),
          rota: route,
        })
        .select("id")
        .maybeSingle();
      if (!error && data) _remoteSessionId = data.id as string;
    } else {
      await supabase
        .from("sessoes")
        .update({ terminada_em: new Date(endedAt).toISOString(), rota: route })
        .eq("id", _remoteSessionId);
    }
  } catch {
    /* offline / RLS */
  }
}

type Entry = { startedAt: number; endedAt: number; route: string };

let current: Entry | null = null;
let idleTimer: number | null = null;

function readAll(): Entry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}

function persistCurrent() {
  if (!current) return;
  if (adminTesting()) return; // sessão do admin não conta para estatísticas
  const all = readAll();
  // Substitui última entrada se for a mesma sessão em curso.
  const last = all[all.length - 1];
  if (last && last.startedAt === current.startedAt) {
    all[all.length - 1] = { ...current };
  } else {
    all.push({ ...current });
  }
  while (all.length > MAX) all.shift();
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* noop */
  }
  // Best-effort remote sync.
  void pushRemote(current.startedAt, current.endedAt, current.route);
}

function endSession() {
  if (!current) return;
  current.endedAt = Date.now();
  persistCurrent();
  current = null;
  _remoteSessionId = null;
}

function ensureSession(route: string) {
  const now = Date.now();
  if (!current) {
    current = { startedAt: now, endedAt: now, route };
  }
  current.endedAt = now;
  current.route = route;
  persistCurrent();
  if (idleTimer) window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(endSession, IDLE_MS);
}

let installed = false;

export function installSessionTracker() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  if (adminTesting()) return; // não regista nada durante o modo teste do admin

  ensureSession(window.location.pathname);

  const onActivity = () => ensureSession(window.location.pathname);
  window.addEventListener("pointerdown", onActivity, { passive: true });
  window.addEventListener("keydown", onActivity);
  window.addEventListener("popstate", onActivity);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") endSession();
    else ensureSession(window.location.pathname);
  });

  window.addEventListener("beforeunload", endSession);
}