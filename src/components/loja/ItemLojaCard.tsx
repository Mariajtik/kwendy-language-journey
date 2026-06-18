/**
 * ItemLojaCard — card 3D arredondado com imagem/emoji, nome, descrição,
 * preço em diamantes e CTA de compra.
 */
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import type { ItemLoja } from "@/data/loja";

interface Props {
  item: ItemLoja;
  desbloqueado?: boolean;
  onComprar: () => void;
}

const ItemLojaCard = ({ item, desbloqueado, onComprar }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl bg-card border-2 border-border p-4 flex flex-col"
    style={{ boxShadow: `0 4px 0 hsl(${item.cor} / 0.4)` }}
  >
    <div
      className="w-full h-24 rounded-2xl mb-3 flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(135deg, hsl(${item.cor} / 0.18), hsl(${item.cor} / 0.06))` }}
    >
      {item.imagem ? (
        <img src={item.imagem} alt={item.nome} className="h-20 w-20 object-contain" />
      ) : (
        <span className="text-5xl">{item.emoji}</span>
      )}
    </div>

    <h3 className="font-extrabold text-foreground text-sm leading-tight">{item.nome}</h3>
    <p className="text-xs text-muted-foreground mt-1 flex-1 line-clamp-3">{item.descricao}</p>

    <button
      onClick={onComprar}
      disabled={desbloqueado}
      className="mt-3 rounded-2xl py-2.5 font-extrabold text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
      style={{
        background: desbloqueado ? "hsl(var(--muted))" : `hsl(${item.cor})`,
        color: desbloqueado ? "hsl(var(--muted-foreground))" : "#fff",
        boxShadow: desbloqueado ? "none" : `0 3px 0 hsl(${item.cor} / 0.5)`,
      }}
    >
      {desbloqueado ? (
        <>
          <Check className="w-4 h-4" /> Já tens
        </>
      ) : (
        <>
          <DiamanteNegro className="w-4 h-4" />
          <span className="tabular-nums">{item.preco.toLocaleString()}</span>
        </>
      )}
    </button>
  </motion.div>
);

export default ItemLojaCard;