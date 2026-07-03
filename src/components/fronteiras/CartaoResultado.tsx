/**
 * Cartão de resultado partilhável.
 * Desenha uma imagem PNG em <canvas> com pontuação, streak, países visitados
 * e frase da Kwendi — pronto para baixar ou partilhar.
 */
import { useEffect, useRef, useState } from "react";
import { Download, Share2, Users } from "lucide-react";
import { PAISES } from "@/data/paisesAfrica";
import africaAsset from "@/assets/africa-bandeiras-hd.jpg.asset.json";

interface Props {
  acertos: number;
  total: number;
  streak: number;
  paisesAcertados: string[]; // ISO codes
}

const W = 720;
const H = 1000;

/**
 * Desenha a silhueta dourada do continente e o rectângulo devolvido
 * é usado como referência para posicionar os alfinetes.
 */
function drawGoldenMap(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  maxW: number,
  maxH: number,
) {
  const ratio = img.width / img.height;
  let dw = maxW;
  let dh = maxW / ratio;
  if (dh > maxH) {
    dh = maxH;
    dw = maxH * ratio;
  }
  const dx = cx - dw / 2;
  const dy = cy - dh / 2;

  ctx.save();
  // Tinta cada pixel do mapa em tons dourados brilhantes, mantendo as
  // delimitações e bandeiras dos países visíveis (mais escuras/claras
  // conforme a luminância original). Fundo branco vira transparente.
  const off = document.createElement("canvas");
  off.width = dw;
  off.height = dh;
  const octx = off.getContext("2d")!;
  octx.drawImage(img, 0, 0, dw, dh);

  const imgData = octx.getImageData(0, 0, dw, dh);
  const d = imgData.data;
  // Alvos douradas — claro e escuro — para mapear luminância → dourado
  const goldHi = { r: 255, g: 224, b: 130 }; // dourado claro brilhante
  const goldLo = { r: 120, g: 72, b: 12 };   // dourado escuro / bronze
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    // Luminância percebida
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Fundo branco → transparente
    if (r > 236 && g > 236 && b > 236) {
      d[i + 3] = 0;
      continue;
    }
    // Boost do contraste para as bandeiras "aparecerem"
    const t = Math.pow(l, 0.85);
    d[i]     = Math.round(goldLo.r + (goldHi.r - goldLo.r) * t);
    d[i + 1] = Math.round(goldLo.g + (goldHi.g - goldLo.g) * t);
    d[i + 2] = Math.round(goldLo.b + (goldHi.b - goldLo.b) * t);
  }
  octx.putImageData(imgData, 0, 0);

  // Brilho dourado sobreposto (multiply suave) para ficar cintilante
  octx.globalCompositeOperation = "overlay";
  const shine = octx.createLinearGradient(0, 0, dw, dh);
  shine.addColorStop(0, "hsl(48 100% 70% / 0.55)");
  shine.addColorStop(1, "hsl(38 90% 40% / 0.25)");
  octx.fillStyle = shine;
  octx.fillRect(0, 0, dw, dh);
  octx.globalCompositeOperation = "source-over";

  // Sombra dourada suave à volta do continente
  ctx.shadowColor = "hsl(45 95% 55% / 0.55)";
  ctx.shadowBlur = 28;
  ctx.drawImage(off, dx, dy, dw, dh);
  ctx.restore();

  return { dx, dy, dw, dh };
}

function drawPin(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size = 10,
) {
  ctx.save();
  // Sombra sob o pin
  ctx.fillStyle = "hsl(0 0% 0% / 0.35)";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.9, size * 0.6, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo do pin (gota) branco com borda crimson
  ctx.fillStyle = "hsl(5 84% 48%)";
  ctx.strokeStyle = "hsl(0 0% 100%)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Centro branco
  ctx.fillStyle = "hsl(0 0% 100%)";
  ctx.beginPath();
  ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const CartaoResultado = ({ acertos, total, streak, paisesAcertados }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = W;
    canvas.height = H;

    let cancelled = false;

    const render = (mapImg: HTMLImageElement | null) => {
      if (cancelled) return;

      // ---------- Fundo cinemático ----------
      const bg = ctx.createRadialGradient(W / 2, H * 0.35, 60, W / 2, H * 0.5, H * 0.9);
      bg.addColorStop(0, "hsl(5 84% 45%)");
      bg.addColorStop(0.55, "hsl(350 65% 28%)");
      bg.addColorStop(1, "hsl(215 65% 14%)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Textura de pontos dourados (ruído procedural leve, determinístico)
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = "hsl(45 90% 65%)";
      let seed = 42;
      const rnd = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      for (let i = 0; i < 220; i++) {
        const x = rnd() * W;
        const y = rnd() * H;
        const r = rnd() * 1.4 + 0.3;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Vinheta
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
      vignette.addColorStop(0, "hsl(0 0% 0% / 0)");
      vignette.addColorStop(1, "hsl(0 0% 0% / 0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // ---------- Cabeçalho ----------
      ctx.textAlign = "center";
      ctx.fillStyle = "hsl(45 90% 65%)";
      ctx.font = "900 14px system-ui, -apple-system, sans-serif";
      ctx.fillText("K W E N D I", W / 2, 62);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "800 22px system-ui, -apple-system, sans-serif";
      ctx.fillText("PARA ALÉM DE FRONTEIRAS", W / 2, 94);

      // Divisor dourado
      ctx.strokeStyle = "hsl(45 90% 55%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 40, 108);
      ctx.lineTo(W / 2 + 40, 108);
      ctx.stroke();

      // ---------- Pontuação ----------
      ctx.fillStyle = "#fff";
      ctx.font = "900 140px system-ui, -apple-system, sans-serif";
      ctx.fillText(`${acertos}/${total}`, W / 2, 240);

      // Sublinhado dourado
      ctx.fillStyle = "hsl(45 90% 55%)";
      ctx.fillRect(W / 2 - 90, 255, 180, 4);

      ctx.font = "700 22px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText("respostas certas", W / 2, 290);

      // Selo carimbado de streak (rodado)
      ctx.save();
      ctx.translate(W / 2, 340);
      ctx.rotate((-6 * Math.PI) / 180);
      ctx.strokeStyle = "hsl(45 90% 55%)";
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.roundRect(-140, -26, 280, 52, 26);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "hsl(45 90% 55%)";
      ctx.font = "900 22px system-ui, -apple-system, sans-serif";
      ctx.fillText(`MELHOR STREAK · ${streak}`, 0, 8);
      ctx.restore();

      // ---------- Mapa dourado com alfinetes ----------
      const mapCX = W / 2;
      const mapCY = 560;
      const mapMaxW = 360;
      const mapMaxH = 340;

      if (mapImg) {
        const { dx, dy, dw, dh } = drawGoldenMap(ctx, mapImg, mapCX, mapCY, mapMaxW, mapMaxH);
        // Alfinetes nas coordenadas reais dos países
        paisesAcertados.forEach((iso) => {
          const p = PAISES[iso];
          if (!p || p.iso === "AFR") return;
          // As coords (p.x, p.y) estão normalizadas sobre a imagem inteira,
          // que ocupa o rect (dx, dy, dw, dh).
          const px = dx + p.x * dw;
          const py = dy + p.y * dh;
          drawPin(ctx, px, py, 9);
        });
      } else {
        // Fallback: aro dourado
        ctx.strokeStyle = "hsl(45 90% 55%)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(mapCX, mapCY, 140, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ---------- Contagem ----------
      ctx.font = "800 20px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "hsl(45 90% 65%)";
      const nP = paisesAcertados.length;
      ctx.fillText(
        `${nP} ${nP === 1 ? "país visitado" : "países visitados"}`,
        W / 2,
        780,
      );

      // ---------- Frase da Kwendi ----------
      ctx.font = "italic 700 24px 'Georgia', serif";
      ctx.fillStyle = "#fff";
      ctx.fillText("« Kwenda ciwa! »", W / 2, 830);
      ctx.font = "600 14px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillText("Vai bem — em umbundu", W / 2, 855);

      // ---------- Wordmark ----------
      ctx.font = "900 30px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText("Kwendi", W / 2, 920);
      ctx.font = "700 12px system-ui, -apple-system, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText("kwendi.xyz", W / 2, 942);

      setDataUrl(canvas.toDataURL("image/png"));
    };

    // Carrega o mapa e desenha
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => render(img);
    img.onerror = () => render(null);
    img.src = africaAsset.url;

    return () => {
      cancelled = true;
    };
    // Silencia o eslint sobre a MAP_BOX_* (usadas via posição p.x/p.y)
    // Nada mais depende dessas constantes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acertos, total, streak, paisesAcertados]);

  const filename = `kwendi-fronteiras-${acertos}-${total}.png`;

  const baixar = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  const partilhar = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], filename, { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        try {
          await nav.share({
            files: [file],
            title: "Kwendi · Para Além de Fronteiras",
            text: `Acertei ${acertos}/${total} no quiz Kwendi! 🌍`,
          });
          return;
        } catch { /* utilizador cancelou */ }
      }
      // Fallback: WhatsApp com texto
      const url = "https://kwendi.xyz";
      const msg = encodeURIComponent(
        `Acertei ${acertos}/${total} no quiz "Para Além de Fronteiras" da Kwendi! 🌍 ${url}`,
      );
      window.open(`https://wa.me/?text=${msg}`, "_blank");
    }, "image/png");
  };

  const partilharComunidade = async () => {
    const text = `Vem jogar "Para Além de Fronteiras" comigo na Kwendi! Acertei ${acertos}/${total}.`;
    const url = "https://kwendi.xyz";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Kwendi", text, url });
        return;
      } catch { /* ignore */ }
    }
    await navigator.clipboard.writeText(`${text} ${url}`).catch(() => {});
  };

  return (
    <div className="mt-6">
      <div className="overflow-hidden rounded-3xl border-2 border-border bg-muted/40">
        {dataUrl ? (
          <img src={dataUrl} alt="Cartão de resultado" className="h-auto w-full" />
        ) : null}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          onClick={baixar}
          className="flex flex-col items-center gap-1 rounded-2xl bg-card border-2 border-border px-3 py-3 text-xs font-black text-foreground active:translate-y-0.5"
          style={{ boxShadow: "0 3px 0 hsl(0 0% 80%)" }}
        >
          <Download className="h-5 w-5" />
          Baixar
        </button>
        <button
          onClick={partilhar}
          className="flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-xs font-black text-white active:translate-y-0.5"
          style={{
            background: "hsl(142 65% 42%)",
            boxShadow: "0 3px 0 hsl(142 70% 28%)",
          }}
        >
          <Share2 className="h-5 w-5" />
          WhatsApp
        </button>
        <button
          onClick={partilharComunidade}
          className="flex flex-col items-center gap-1 rounded-2xl px-3 py-3 text-xs font-black text-white active:translate-y-0.5"
          style={{
            background: "hsl(215 65% 45%)",
            boxShadow: "0 3px 0 hsl(215 65% 28%)",
          }}
        >
          <Users className="h-5 w-5" />
          Comunidade
        </button>
      </div>
    </div>
  );
};

export default CartaoResultado;