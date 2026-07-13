/**
 * IdiomaScreen — permite trocar entre PT-AO, EN e FR em tempo real.
 */
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { definirIdioma, IDIOMAS_SUPORTADOS, type IdiomaSuportado } from "@/i18n";

type Opt = { code: IdiomaSuportado; bandeira: string; nativo: string };

const OPCOES: Opt[] = [
  { code: "pt-AO", bandeira: "🇦🇴", nativo: "Português (Angola)" },
  { code: "en", bandeira: "🇬🇧", nativo: "English" },
  { code: "fr", bandeira: "🇫🇷", nativo: "Français" },
];

const IdiomaScreen = () => {
  const { t, i18n } = useTranslation();
  const actual = (IDIOMAS_SUPORTADOS as readonly string[]).includes(i18n.language)
    ? (i18n.language as IdiomaSuportado)
    : "pt-AO";

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader
        titulo={t("idioma.titulo", "Idioma do App")}
        subtitulo={t("idioma.subtitulo", "Escolhe o idioma da interface")}
      />
      <div className="px-4 py-5 pb-32">
        <p className="text-sm text-muted-foreground mb-4">
          {t(
            "idioma.descricao",
            "As lições permanecem em Umbundu. Apenas o Português da interface muda para a língua escolhida.",
          )}
        </p>
        <div
          className="rounded-2xl border-2 border-border bg-card overflow-hidden"
          style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
        >
          {OPCOES.map((op, i) => {
            const escolhido = op.code === actual;
            return (
              <button
                key={op.code}
                onClick={() => definirIdioma(op.code)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
                style={{
                  borderBottom:
                    i < OPCOES.length - 1 ? "1px solid hsl(var(--border))" : "none",
                  background: escolhido ? "hsl(var(--primary) / 0.08)" : "transparent",
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden>
                    {op.bandeira}
                  </span>
                  <span className="font-extrabold text-foreground">{op.nativo}</span>
                </span>
                {escolhido && (
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={4} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default IdiomaScreen;