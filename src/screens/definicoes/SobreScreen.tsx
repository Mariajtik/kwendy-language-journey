/**
 * SobreScreen — versão, equipa, termos, privacidade e feedback.
 * Todas as ações abrem modais internos; nada de links externos ou emails visíveis.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { Users, Mail, FileText, Shield, ChevronRight } from "lucide-react";
import KwendiIcon from "@/components/icons/KwendiIcon";
import LegalModal from "@/components/legal/LegalModal";
import FeedbackModal from "@/components/legal/FeedbackModal";
import DevelopersModal from "@/components/legal/DevelopersModal";
import { TERMOS, PRIVACIDADE, type LegalDoc } from "@/data/legal";

const SobreScreen = () => {
  const { t } = useTranslation();
  const [legalDoc, setLegalDoc] = useState<LegalDoc | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [devsOpen, setDevsOpen] = useState(false);

  return (
  <motion.div
    className="app-shell bg-background"
    style={{ minHeight: "100dvh" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <DefHeader titulo={t("sobre.titulo", "Sobre o Kwendi")} subtitulo={t("sobre.subtitulo", "Versão, créditos e contacto")} />
    <div className="px-4 py-5 pb-32 space-y-4">
      <div
        className="rounded-3xl p-5 text-white text-center"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)), hsl(15 90% 50%))",
          boxShadow: "0 5px 0 hsl(var(--kwendi-red-dark))",
        }}
      >
        <p className="text-[11px] font-extrabold tracking-widest opacity-90">
          {t("sobre.versao", "KWENDI · v0.1.0 (beta)")}
        </p>
        <h2 className="text-2xl font-extrabold mt-1 leading-tight">
          {t("sobre.slogan1", "Aprenda Umbundu")}
          <br />
          {t("sobre.slogan2", "de forma simples e divertida.")}
        </h2>
        <p className="text-sm font-semibold opacity-95 mt-3">
          {t(
            "sobre.descricao",
            "Aplicação educacional para preservar e promover a riqueza linguística e cultural de Angola.",
          )}
        </p>
        <p className="text-xs font-semibold opacity-90 mt-3 inline-flex items-center gap-1">
          {t("sobre.feitoCom", "Feito com")}{" "}
          <KwendiIcon name="coracao" className="w-4 h-4 inline -mt-0.5" />{" "}
          {t("sobre.feitoResto", "em Angola.")}
        </p>
      </div>

      <div
        className="rounded-2xl border-2 border-border bg-card divide-y divide-border"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <ActionRow
          icon={<Users className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />}
          label={t("sobre.equipaLabel", "Conhece a equipa Kwendi")}
          desc={t("sobre.equipaDesc", "As pessoas que constroem esta viagem.")}
          onClick={() => setDevsOpen(true)}
        />
        <ActionRow
          icon={<Mail className="w-5 h-5" style={{ color: "hsl(160 60% 35%)" }} />}
          label={t("sobre.feedbackLabel", "Enviar feedback")}
          desc={t("sobre.feedbackDesc", "Fala diretamente com os desenvolvedores.")}
          onClick={() => setFeedbackOpen(true)}
        />
        <ActionRow
          icon={<FileText className="w-5 h-5 text-muted-foreground" />}
          label={t("sobre.termos", "Termos de uso")}
          onClick={() => setLegalDoc(TERMOS)}
        />
        <ActionRow
          icon={<Shield className="w-5 h-5 text-muted-foreground" />}
          label={t("sobre.privacidade", "Política de privacidade")}
          onClick={() => setLegalDoc(PRIVACIDADE)}
        />
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        {t("sobre.rodape", "© 2026 Kwendi · Wakolelepo!")}
      </p>
    </div>

    <LegalModal open={!!legalDoc} onClose={() => setLegalDoc(null)} doc={legalDoc} />
    <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    <DevelopersModal open={devsOpen} onClose={() => setDevsOpen(false)} />
  </motion.div>
  );
};

const ActionRow = ({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  desc?: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block font-extrabold text-foreground leading-tight">{label}</span>
      {desc && (
        <span className="block text-xs text-muted-foreground leading-tight">{desc}</span>
      )}
    </span>
    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
  </button>
);

export default SobreScreen;