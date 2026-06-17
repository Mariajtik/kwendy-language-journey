/**
 * CuriosidadeCard — card premium para a grid de Curiosidades.
 */
import { motion } from "framer-motion";
import {
  Trees,
  Crown,
  Sparkles,
  Rabbit,
  Flower2,
  UtensilsCrossed,
  BookOpen,
  Scissors,
  Languages,
  Mountain,
  TreePine,
  Waves,
  TreeDeciduous,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIAS, type Curiosidade } from "@/data/curiosidades";

const ICON_MAP: Record<string, LucideIcon> = {
  imbondeiro: Trees,
  nzinga: Crown,
  pensador: Sparkles,
  palanca: Rabbit,
  welwitschia: Flower2,
  mufete: UtensilsCrossed,
  "agostinho-neto": BookOpen,
  nontombi: Scissors,
  umbundu: Languages,
  tundavala: Mountain,
  maiombe: TreePine,
  kalandula: Waves,
  mussivi: TreeDeciduous,
};

interface Props {
  item: Curiosidade;
  onOpen: () => void;
}

const CuriosidadeCard = ({ item, onOpen }: Props) => {
  const cat = CATEGORIAS[item.categoria];
  const Icon = ICON_MAP[item.id] ?? Sparkles;
  const color = `hsl(var(${cat.token}))`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onOpen}
      className="cursor-pointer rounded-3xl overflow-hidden border-2 border-border bg-card"
      style={{ boxShadow: "0 4px 0 hsl(var(--border))" }}
    >
      {/* Hero */}
      <motion.div
        layoutId={`cur-hero-${item.id}`}
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, hsl(var(${cat.token}) / 0.6) 100%)`,
        }}
      >
        {item.imagem ? (
          <img src={item.imagem} alt={item.titulo} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Icon
            className="absolute -right-4 -bottom-4 w-40 h-40"
            style={{ color: "hsl(var(--card) / 0.35)" }}
            strokeWidth={1.5}
          />
        )}
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)",
          }}
        />
        {/* Badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase"
          style={{ background: "hsl(var(--card))", color }}
        >
          {cat.label}
        </span>
      </motion.div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-lg font-extrabold text-foreground leading-tight">
          {item.titulo}
        </h3>
        <p className="text-xs font-bold mt-0.5" style={{ color }}>
          {item.subtitulo}
        </p>
        <p
          className="text-sm text-muted-foreground mt-2 leading-relaxed"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.resumo}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="mt-3 px-4 py-2 rounded-full text-xs font-extrabold text-white transition-transform active:scale-95"
          style={{ background: color }}
        >
          Saber mais
        </button>
      </div>
    </motion.article>
  );
};

export default CuriosidadeCard;