/**
 * Cabeçalho partilhado das telas de Definições.
 */
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DefHeader = ({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) => {
  const nav = useNavigate();
  return (
    <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3">
        <button
          onClick={() => nav(-1)}
          aria-label="Voltar"
          className="w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-foreground leading-none">{titulo}</h1>
          {subtitulo && (
            <p className="text-[11px] text-muted-foreground mt-1">{subtitulo}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefHeader;