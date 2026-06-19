/**
 * SobreScreen — versão, contactos, links institucionais.
 */
import { motion } from "framer-motion";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { Heart, MessageCircle, Mail, FileText, Shield, ExternalLink } from "lucide-react";

const SobreScreen = () => (
  <motion.div
    className="app-shell bg-background"
    style={{ minHeight: "100dvh" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <DefHeader titulo="Sobre o Kwendi" subtitulo="Versão, créditos e contacto" />
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
          KWENDI · v0.1.0 (beta)
        </p>
        <h2 className="text-2xl font-extrabold mt-1">Aprende Umbundu, vive Angola</h2>
        <p className="text-sm font-semibold opacity-95 mt-2">
          Feito com <Heart className="w-4 h-4 inline -mt-1" fill="#fff" /> para preservar e
          partilhar a língua e a cultura ovimbundu.
        </p>
      </div>

      <div
        className="rounded-2xl border-2 border-border bg-card divide-y divide-border"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <LinkRow
          icon={<MessageCircle className="w-5 h-5" style={{ color: "#5865F2" }} />}
          label="Comunidade no Discord"
          desc="Junta-te à conversa e dá feedback em direto."
          href="https://discord.gg/kwendi"
        />
        <LinkRow
          icon={<Mail className="w-5 h-5" style={{ color: "hsl(160 60% 35%)" }} />}
          label="Enviar feedback"
          desc="kwendi.xyz@gmail.com"
          href="mailto:kwendi.xyz@gmail.com"
        />
        <LinkRow
          icon={<FileText className="w-5 h-5 text-muted-foreground" />}
          label="Termos de uso"
          href="https://kwendi.xyz/termos"
        />
        <LinkRow
          icon={<Shield className="w-5 h-5 text-muted-foreground" />}
          label="Política de privacidade"
          href="https://kwendi.xyz/privacidade"
        />
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        © 2026 Kwendi · Wakolelepo!
      </p>
    </div>
  </motion.div>
);

const LinkRow = ({
  icon,
  label,
  desc,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  desc?: string;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-3 px-4 py-3.5"
  >
    <span className="flex-shrink-0">{icon}</span>
    <span className="flex-1 min-w-0">
      <span className="block font-extrabold text-foreground leading-tight">{label}</span>
      {desc && (
        <span className="block text-xs text-muted-foreground leading-tight">{desc}</span>
      )}
    </span>
    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
  </a>
);

export default SobreScreen;