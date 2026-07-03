import type { ReactNode } from "react";

export const StatCard = ({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
    <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/50">
      <span>{label}</span>
      {icon}
    </div>
    <div className="mt-2 font-mono text-3xl font-semibold text-white">{value}</div>
    {hint && <div className="mt-1 text-xs text-white/40">{hint}</div>}
  </div>
);