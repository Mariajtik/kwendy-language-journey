/**
 * Confetes leves em canvas, com cores da bandeira do país acertado.
 * Sem dependências externas — apenas requestAnimationFrame.
 */
import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
  colors: string[]; // HSL strings sem `hsl()`
  onDone?: () => void;
}

interface Particle {
  x: number; y: number; vx: number; vy: number; rot: number; vr: number; size: number; color: string; life: number;
}

const Confetes = ({ active, colors, onDone }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const parts: Particle[] = Array.from({ length: 70 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 80,
      y: H / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: -Math.random() * 8 - 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      size: 5 + Math.random() * 5,
      color: `hsl(${colors[Math.floor(Math.random() * colors.length)]})`,
      life: 0,
    }));

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p) => {
        p.vy += 0.3; // gravidade
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = elapsed / 1300;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, 1 - p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      });
      if (elapsed < 1400) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, W, H);
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, colors, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-40 h-full w-full"
    />
  );
};

export default Confetes;