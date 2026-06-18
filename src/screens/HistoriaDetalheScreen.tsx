/**
 * HistoriaDetalheScreen.tsx — capa e sinopse de uma história antes da leitura.
 */
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, MapPin, Sparkles, Calendar } from "lucide-react";
import { getHistoria } from "@/data/historias";

const HistoriaDetalheScreen = () => {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const h = getHistoria(id);

  if (!h) {
    return (
      <div className="app-shell p-8">
        <p>História não encontrada.</p>
        <button onClick={() => nav("/historias")} className="underline mt-4">Voltar</button>
      </div>
    );
  }

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative h-72 w-full overflow-hidden"
        style={{ background: `linear-gradient(135deg, hsl(${h.cor}), hsl(${h.corEscura}))` }}
      >
        {h.imagem && (
          <img src={h.imagem} alt={h.titulo} className="absolute inset-0 w-full h-full object-cover opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <button
          onClick={() => nav("/historias")}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 -mt-8 pb-32 relative">
        <h1 className="text-3xl font-extrabold text-foreground leading-tight">{h.titulo}</h1>
        <p className="text-sm text-muted-foreground mt-1">{h.subtitulo}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Chip icon={<MapPin className="w-3.5 h-3.5" />} text={h.regiao} />
          <Chip icon={<Calendar className="w-3.5 h-3.5" />} text={h.epoca} />
          <Chip icon={<Clock className="w-3.5 h-3.5" />} text={`${h.duracaoMin} min`} />
          <Chip icon={<Sparkles className="w-3.5 h-3.5" />} text={h.nivel} />
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-card border border-border">
          <p className="text-sm leading-relaxed text-foreground/90">{h.sinopse}</p>
        </div>

        <div className="mt-4 p-4 rounded-2xl border border-dashed border-border text-xs text-muted-foreground">
          <p className="font-bold text-foreground mb-1">Recompensa</p>
          <p>+{h.recompensa.xp} XP &middot; +{h.recompensa.diamantes} diamantes ao concluir.</p>
        </div>

        <button
          onClick={() => nav(`/historias/${h.id}/ler`)}
          className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-extrabold text-white text-base"
          style={{
            background: `hsl(${h.cor})`,
            boxShadow: `0 5px 0 hsl(${h.corEscura})`,
          }}
        >
          <BookOpen className="w-5 h-5" /> Começar a ler
        </button>

        {h.referencia && (
          <p className="text-[10px] text-muted-foreground mt-4 italic leading-relaxed">
            {h.referencia}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const Chip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-semibold text-foreground/80">
    {icon}
    {text}
  </span>
);

export default HistoriaDetalheScreen;