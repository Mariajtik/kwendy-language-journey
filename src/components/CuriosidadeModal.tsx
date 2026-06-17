/**
 * CuriosidadeModal — modal fullscreen estilo Airbnb/Apple Music.
 */
import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, Quote } from "lucide-react";
import { CATEGORIAS, type Curiosidade } from "@/data/curiosidades";
import { useMissoes } from "@/hooks/useMissoes";
import { setSaldo, getSaldo } from "@/hooks/useSaldo";

interface Props {
  item: Curiosidade;
  onClose: () => void;
}

const CuriosidadeModal = ({ item, onClose }: Props) => {
  const cat = CATEGORIAS[item.categoria];
  const color = `hsl(var(${cat.token}))`;
  const { registrarAcao } = useMissoes();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Conta como "curiosidade lida" (dedupe por id na sessão do utilizador)
  useEffect(() => {
    const sal = getSaldo();
    if (sal.curiosidadesLidas.includes(item.id)) return;
    setSaldo((s) => {
      const lidas = [...s.curiosidadesLidas, item.id];
      const cosmeticos = [...s.cosmeticos];
      // Recompensa: Chapéu de palha por ler Pensador + Agostinho Neto
      const temAmbos = lidas.includes("pensador") && lidas.includes("agostinho-neto");
      if (temAmbos && !cosmeticos.includes("chapeu-palha")) {
        cosmeticos.push("chapeu-palha");
      }
      return { ...s, curiosidadesLidas: lidas, cosmeticos };
    });
    registrarAcao("curiosidade_lida", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Hero */}
      <motion.div
        layoutId={`cur-hero-${item.id}`}
        className="relative w-full"
        style={{
          height: 320,
          background: `linear-gradient(135deg, ${color} 0%, hsl(var(${cat.token}) / 0.6) 100%)`,
        }}
      >
        {item.imagem && (
          <img
            src={item.imagem}
            alt={item.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform active:scale-90"
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title block */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <span
            className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase mb-2"
            style={{ background: color, color: "#fff" }}
          >
            {cat.label}
          </span>
          <h1 className="text-3xl font-extrabold leading-tight drop-shadow-md">
            {item.titulo}
          </h1>
          <p className="text-sm font-bold opacity-95 mt-1 drop-shadow">
            {item.subtitulo}
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="px-6 py-8 max-w-2xl mx-auto pb-24"
      >
        <p className="text-base text-foreground leading-relaxed font-medium mb-8">
          {item.resumo}
        </p>

        {item.sections.map((s) => (
          <section key={s.heading} className="mb-7">
            <h2
              className="text-xs font-extrabold tracking-widest uppercase mb-2"
              style={{ color }}
            >
              {s.heading}
            </h2>
            <p className="text-[15px] text-foreground leading-relaxed">
              {s.body}
            </p>
          </section>
        ))}

        {item.destaque && (
          <div
            className="mt-8 p-5 rounded-3xl flex items-start gap-3"
            style={{
              background: `hsl(var(${cat.token}) / 0.1)`,
              border: `2px solid hsl(var(${cat.token}) / 0.3)`,
            }}
          >
            <Quote
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color }}
            />
            <p
              className="text-base font-extrabold italic leading-snug"
              style={{ color }}
            >
              {item.destaque}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CuriosidadeModal;