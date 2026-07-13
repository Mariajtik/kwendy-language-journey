/**
 * i18n — configuração react-i18next.
 * Idiomas: pt-AO (fonte de verdade), en, fr.
 * Detecta: user_preferencias.idioma_app → localStorage → navigator → pt-AO.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { pushKey } from "@/lib/backend/mirror";
import ptAO from "./pt-AO.json";
import en from "./en.json";
import fr from "./fr.json";

export const IDIOMAS_SUPORTADOS = ["pt-AO", "en", "fr"] as const;
export type IdiomaSuportado = (typeof IDIOMAS_SUPORTADOS)[number];

const LS_KEY = "kwendi.idioma";

export function detectarIdioma(): IdiomaSuportado {
  if (typeof window === "undefined") return "pt-AO";
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      // pushKey guarda JSON; leitura antiga podia ser string crua.
      const salvo = raw.startsWith('"') ? JSON.parse(raw) : raw;
      if ((IDIOMAS_SUPORTADOS as readonly string[]).includes(salvo)) {
        return salvo as IdiomaSuportado;
      }
    }
  } catch {
    /* noop */
  }
  const nav = (typeof navigator !== "undefined" && navigator.language) || "";
  const low = nav.toLowerCase();
  if (low.startsWith("pt")) return "pt-AO";
  if (low.startsWith("fr")) return "fr";
  if (low.startsWith("en")) return "en";
  return "pt-AO";
}

export function definirIdioma(l: IdiomaSuportado) {
  // Persiste local + espelha em `user_preferencias.idioma_app`.
  try {
    pushKey(LS_KEY, l);
  } catch {
    /* noop */
  }
  void i18n.changeLanguage(l);
  try {
    window.dispatchEvent(new CustomEvent("kwendi:idioma-changed", { detail: l }));
  } catch {
    /* noop */
  }
}

i18n.use(initReactI18next).init({
  resources: {
    "pt-AO": { translation: ptAO },
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: detectarIdioma(),
  fallbackLng: "pt-AO",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;