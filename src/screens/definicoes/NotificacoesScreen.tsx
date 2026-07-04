/**
 * NotificacoesScreen — preferências locais de notificação (UI only).
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { Bell, Users, Mail, Clock } from "lucide-react";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { pushKey } from "@/lib/backend/mirror";

const KEY = "kwendi.def.notif";

type Notif = {
  lembretes: boolean;
  ofensiva: boolean;
  comunidade: boolean;
  marketing: boolean;
  horario: string;
};

const DEFAULT: Notif = {
  lembretes: true,
  ofensiva: true,
  comunidade: false,
  marketing: false,
  horario: "19:00",
};

const NotificacoesScreen = () => {
  const [n, setN] = useState<Notif>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setN({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {
      /* noop */
    }
  }, []);
  useEffect(() => {
    pushKey(KEY, n);
  }, [n]);

  const items: { key: keyof Notif; label: string; desc: string; Icon?: typeof Bell; kwendiIcon?: "chamaAcesa" }[] = [
    { key: "lembretes", label: "Lembretes diários", desc: "Empurra-te a praticar todos os dias.", Icon: Bell },
    { key: "ofensiva",  label: "Ofensiva em risco", desc: "Avisa-te antes da chama apagar.", kwendiIcon: "chamaAcesa" },
    { key: "comunidade",label: "Comunidade", desc: "Comentários e respostas no teu feed.", Icon: Users },
    { key: "marketing", label: "E-mail marketing", desc: "Novidades e promoções por e-mail.", Icon: Mail },
  ];

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Notificações" subtitulo="Como queres que te avisemos" />
      <div className="px-4 py-5 pb-32 space-y-3">
        {items.map(({ key, label, desc, Icon, kwendiIcon }) => (
          <label
            key={key}
            className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card p-4 cursor-pointer"
            style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
          >
            <div
              className="w-10 h-10 rounded-xl grid place-items-center flex-shrink-0"
              style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
            >
              {kwendiIcon ? (
                <KwendiIcon name={kwendiIcon} className="w-6 h-6" />
              ) : Icon ? (
                <Icon className="w-5 h-5" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-foreground leading-tight">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{desc}</p>
            </div>
            <Toggle
              on={!!n[key]}
              onChange={(v) => setN({ ...n, [key]: v as never })}
            />
          </label>
        ))}

        <div
          className="rounded-2xl border-2 border-border bg-card p-4 flex items-center gap-3"
          style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
        >
          <div
            className="w-10 h-10 rounded-xl grid place-items-center"
            style={{ background: "hsl(45 96% 53% / 0.2)", color: "hsl(40 90% 35%)" }}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-foreground leading-tight">Horário do lembrete</p>
            <p className="text-xs text-muted-foreground">Hora a que te lembramos.</p>
          </div>
          <input
            type="time"
            value={n.horario}
            onChange={(e) => setN({ ...n, horario: e.target.value })}
            className="rounded-xl border-2 border-border bg-background px-2 py-1.5 font-extrabold text-sm"
          />
        </div>
      </div>
    </motion.div>
  );
};

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onChange(!on);
    }}
    aria-pressed={on}
    className="relative w-11 h-6 rounded-full transition flex-shrink-0"
    style={{ background: on ? "hsl(160 60% 40%)" : "hsl(var(--muted))" }}
  >
    <span
      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform"
      style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
    />
  </button>
);

export default NotificacoesScreen;