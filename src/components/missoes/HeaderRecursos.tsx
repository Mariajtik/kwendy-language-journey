/**
 * HeaderRecursos — pílula com XP, Kindeles, baús e streak.
 */
import { Flame, Star, Package } from "lucide-react";
import { motion } from "framer-motion";
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
}: {
  icon: React.ReactNode;
  value: number;
  color: string;
}) => (
  <div className="flex items-center gap-1.5">
    <div
      className="w-7 h-7 rounded-full grid place-items-center"
      style={{ background: `hsl(${color} / 0.18)`, color: `hsl(${color})` }}
    >
      {icon}
    </div>
    <span className="font-extrabold text-foreground tabular-nums text-sm">
      {value}
    </span>
  </div>
);

const HeaderRecursos = ({ xp, diamantes, baus, streak = 0 }: Props) => (
  <motion.div
    initial={{ y: -8, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-card border-2 border-border"
    style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
  >
    <Item icon={<Star className="w-4 h-4" />} value={xp} color="var(--kwendi-yellow)" />
    <Item icon={<DiamanteNegro className="w-4 h-4" />} value={diamantes} color="var(--kwendi-gray)" />
    <Item icon={<Package className="w-4 h-4" />} value={baus} color="var(--kwendi-brown)" />
    <Item icon={<Flame className="w-4 h-4" />} value={streak} color="var(--kwendi-red)" />
  </motion.div>
);

export default HeaderRecursos;