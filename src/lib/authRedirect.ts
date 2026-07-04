const OAUTH_NEXT_KEY = "kwendi.oauth.next";

export const normaliseAppPath = (path?: string | null, fallback = "/home") => {
  if (!path) return fallback;
  if (!path.startsWith("/")) return fallback;
  if (path.startsWith("//")) return fallback;
  return path;
};

export const rememberOAuthNext = (next: string) => {
  try {
    sessionStorage.setItem(OAUTH_NEXT_KEY, normaliseAppPath(next));
  } catch {
    /* noop */
  }
};

export const consumeOAuthNext = (fallback = "/home") => {
  try {
    const stored = sessionStorage.getItem(OAUTH_NEXT_KEY);
    sessionStorage.removeItem(OAUTH_NEXT_KEY);
    return normaliseAppPath(stored, fallback);
  } catch {
    return fallback;
  }
};

export const peekOAuthNext = (fallback = "/home") => {
  try {
    return normaliseAppPath(sessionStorage.getItem(OAUTH_NEXT_KEY), fallback);
  } catch {
    return fallback;
  }
};

export const buildOAuthRedirectTo = (next: string) => {
  const appNext = normaliseAppPath(next);
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(appNext)}`;
};

export const getOAuthErrorFromUrl = () => {
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const raw =
    search.get("error_description") ||
    search.get("error") ||
    hash.get("error_description") ||
    hash.get("error");

  if (!raw) return null;
  const decoded = raw.replace(/\+/g, " ");
  if (decoded.toLowerCase().includes("access_denied")) {
    return "Login cancelado no Google.";
  }
  return decoded;
};
