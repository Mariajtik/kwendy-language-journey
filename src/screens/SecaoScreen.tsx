/**
 * SecaoScreen.tsx — generic placeholder for Fala / Escuta / Palavras / Alfabeto.
 * Reached from the bottom-nav "..." popover.
 */
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, Ear, Type, AudioLines } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const config: Record<
  string,
  { title: string; subtitle: string; color: string; Icon: typeof Mic }
> = {
  fala: {
    title: "Fala",
    subtitle: "Pratica a tua pronúncia em Umbundu.",
    color: "hsl(var(--kwendi-pink))",
    Icon: Mic,
  },
  escuta: {
    title: "Escuta",
    subtitle: "Treina o ouvido com áudios de falantes nativos.",
    color: "hsl(var(--kwendi-blue))",
    Icon: Ear,
  },
  palavras: {
    title: "Palavras",
    subtitle: "Aprende e revê o teu vocabulário.",
    color: "hsl(var(--kwendi-peach))",
    Icon: Type,
  },
  alfabeto: {
    title: "Alfabeto / Pronúncia",
    subtitle: "Sons, sílabas e regras do Umbundu.",
    color: "hsl(var(--kwendi-yellow))",
    Icon: AudioLines,
  },
};

const SecaoScreen = () => {
  const { tipo } = useParams<{ tipo: string }>();
  const navigate = useNavigate();
  const data = (tipo && config[tipo]) || {
    title: "Secção",
    subtitle: "",
    color: "hsl(var(--primary))",
    Icon: Mic,
  };
  const { Icon } = data;

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-6 pb-32">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 self-start"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-muted-foreground" />
        </button>

        <h1 className="text-2xl font-extrabold text-foreground">{data.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{data.subtitle}</p>

        <div className="mt-12 flex flex-col items-center text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${data.color.replace(")", " / 0.18)")}` }}
          >
            <Icon className="w-12 h-12" style={{ color: data.color }} />
          </div>
          <p className="font-bold text-foreground">Em breve</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Estamos a preparar exercícios específicos para esta secção.
          </p>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
};

export default SecaoScreen;