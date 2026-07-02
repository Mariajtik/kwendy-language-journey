/**
 * Cronómetro dramático — 12s por pergunta.
 * Verde → laranja → vermelho e chama `onTimeout` quando esgota.
 */
import { useEffect, useRef, useState } from "react";

interface Props {
  active: boolean;
  durationMs?: number;
  onTimeout: () => void;
  onTick?: (msLeft: number) => void;
}

const Cronometro = ({ active, durationMs = 12000, onTimeout, onTick }: Props) => {
  const [pct, setPct] = useState(100);
  const raf = useRef<number | null>(null);
  const start = useRef<number>(0);
  const disparado = useRef(false);

  useEffect(() => {
    if (!active) {
      setPct(100);
      disparado.current = false;
      if (raf.current) cancelAnimationFrame(raf.current);
      return;
    }
    start.current = performance.now();
    disparado.current = false;
    const step = (now: number) => {
      const elapsed = now - start.current;
      const p = Math.max(0, 1 - elapsed / durationMs);
      setPct(p * 100);
      onTick?.(Math.max(0, durationMs - elapsed));
      if (p <= 0) {
        if (!disparado.current) {
          disparado.current = true;
          onTimeout();
        }
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, durationMs, onTimeout, onTick]);

  const cor =
    pct > 60 ? "142 70% 45%" : pct > 30 ? "35 90% 55%" : "0 75% 55%";
  const pulsar = pct < 30 && pct > 0;

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={pulsar ? "h-full rounded-full animate-pulse" : "h-full rounded-full"}
        style={{
          width: `${pct}%`,
          background: `hsl(${cor})`,
          transition: "background-color 0.3s",
        }}
      />
    </div>
  );
};

export default Cronometro;