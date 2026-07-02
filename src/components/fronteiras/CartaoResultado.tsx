/**
 * Cartão de resultado partilhável.
 * Desenha uma imagem PNG em <canvas> com pontuação, streak, países visitados
 * e frase da Kwendi — pronto para baixar ou partilhar.
 */
import { useEffect, useRef, useState } from "react";
import { Download, Share2, Users } from "lucide-react";
import { PAISES } from "@/data/paisesAfrica";

interface Props {
  acertos: number;
  total: number;
  streak: number;
  paisesAcertados: string[]; // ISO codes
}

const W = 720;
const H = 900;

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

    // Fundo gradiente crimson → azul profundo
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "hsl(5, 84%, 42%)");
    grad.addColorStop(1, "hsl(215, 65%, 22%)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Título
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "700 22px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PARA ALÉM DE FRONTEIRAS", W / 2, 70);

    // Pontuação grande
    ctx.fillStyle = "#fff";
    ctx.font = "900 160px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${acertos}/${total}`, W / 2, 250);

    ctx.font = "700 26px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText("respostas certas", W / 2, 290);

    // Streak badge
    ctx.fillStyle = "hsl(45, 90%, 55%)";
    ctx.beginPath();
    ctx.roundRect(W / 2 - 130, 330, 260, 60, 30);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "900 26px system-ui, -apple-system, sans-serif";
    ctx.fillText(`🔥 Melhor streak: ${streak}`, W / 2, 370);

    // Mini-mapa: círculo com pontos nos países acertados
    const cx = W / 2, cy = 570, r = 150;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fill();
    // Pontos
    paisesAcertados.forEach((iso) => {
      const p = PAISES[iso];
      if (!p || p.iso === "AFR") return;
      const dx = cx + (p.x - 0.5) * 2 * r * 0.85;
      const dy = cy + (p.y - 0.5) * 2 * r * 0.85;
      ctx.fillStyle = "hsl(45, 90%, 60%)";
      ctx.beginPath();
      ctx.arc(dx, dy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Contagem de países
    ctx.font = "700 22px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(
      `${paisesAcertados.length} ${paisesAcertados.length === 1 ? "país visitado" : "países visitados"}`,
      W / 2,
      760,
    );

    // Frase da Kwendi
    ctx.font = "italic 700 24px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fillText("« Kwenda ciwa! »", W / 2, 810);
    ctx.font = "600 16px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("Vai bem — em umbundu", W / 2, 835);

    // Wordmark
    ctx.font = "900 28px system-ui, -apple-system, sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("Kwendi", W / 2, 875);

    setDataUrl(canvas.toDataURL("image/png"));
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