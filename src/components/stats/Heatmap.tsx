/**
 * Heatmap — grelha estilo GitHub, 7 linhas × N semanas, cor por XP diário.
 */
import type { DiaResumo } from "@/hooks/useEstatisticas";

function cor(xp: number): string {
  if (xp <= 0) return "hsl(var(--muted) / 0.5)";
  if (xp < 20) return "hsl(var(--primary) / 0.25)";
  if (xp < 50) return "hsl(var(--primary) / 0.45)";
  if (xp < 100) return "hsl(var(--primary) / 0.7)";
  return "hsl(var(--primary))";
}

const Heatmap = ({ dias }: { dias: DiaResumo[] }) => {
  // 20 semanas × 7 dias = 140 entradas em ordem cronológica (segunda→domingo).
  const semanas = Math.ceil(dias.length / 7);
  const cell = 12;
  const gap = 3;
  const width = semanas * (cell + gap);
  const height = 7 * (cell + gap);

  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <svg width={width} height={height} role="img" aria-label="Mapa de calor de actividade">
        {dias.map((d, i) => {
          const semana = Math.floor(i / 7);
          const linha = i % 7;
          return (
            <rect
              key={d.data}
              x={semana * (cell + gap)}
              y={linha * (cell + gap)}
              width={cell}
              height={cell}
              rx={2}
              fill={cor(d.xp)}
            >
              <title>{`${d.data} · ${d.xp} XP · ${Math.round(d.minutos)} min`}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
};

export default Heatmap;