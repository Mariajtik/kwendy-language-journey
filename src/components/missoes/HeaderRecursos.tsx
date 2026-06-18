/**
 * HeaderRecursos — pílula com XP, Kindeles, baús e streak.
 */
import { Flame, Zap, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DiamanteNegro from "@/components/icons/DiamanteNegro";

interface Props {
  xp: number;
  diamantes: number;
  baus: number;
  streak?: number;
}

const Item = ({
  icon,
  value,
  color,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
  onClick?: () => void;
  ariaLabel?: string;
}) => {
  const inner = (
    <>
      <div
        className="w-7 h-7 rounded-full grid place-items-center"
        style={{ background: `hsl(${color} / 0.18)`, color: `hsl(${color})` }}
      >
        {icon}
      </div>
      <span className="font-extrabold text-foreground tabular-nums text-sm">
        {value}
      </span>
    </>
  );
  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        whileTap={{ scale: 0.92 }}
        className="flex items-center gap-1.5 rounded-full px-1 py-0.5 hover:bg-black/5 transition-colors"
      >
        {inner}
      </motion.button>
    );
  }
  return <div className="flex items-center gap-1.5">{inner}</div>;
};

const HeaderRecursos = ({ xp, diamantes, baus, streak = 0 }: Props) => {
  const navigate = useNavigate();
  return (
  <motion.div
    initial={{ y: -8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-2xl bg-card border-2 border-border"
    style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
  >
    <Item icon={<Zap className="w-4 h-4 fill-current" />} value={xp} color="var(--kwendi-yellow)" />
    <Item
      icon={<DiamanteNegro className="w-4 h-4" />}
      value={diamantes}
      color="0 0% 12%"
      onClick={() => navigate("/loja")}
      ariaLabel="Abrir loja"
    />
    <Item icon={<Package className="w-4 h-4" />} value={baus} color="var(--kwendi-brown)" />
    <Item icon={<Flame className="w-4 h-4" />} value={streak} color="var(--kwendi-red)" />
  </motion.div>
  );
};

export default HeaderRecursos;