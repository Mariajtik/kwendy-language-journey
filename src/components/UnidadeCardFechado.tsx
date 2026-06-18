/**
 * UnidadeCardFechado.tsx
 * Card compacto representando uma unidade que ainda não está activa.
 * Mostra módulo/unidade + título e um ícone de livro que abre o
 * popover com o zig-zag das lições (na mesma tela).
 */

import { BookOpen, ChevronUp } from "lucide-react";
import type { Modulo, Unidade } from "@/data/curriculo";

type Props = {
  modulo: Modulo;
  unidade: Unidade;
  expandida?: boolean;
  onToggle: (unidadeId: string) => void;
};

const UnidadeCardFechado = ({ modulo, unidade, expandida, onToggle }: Props) => {
  return (
    <div
      className="mt-3 w-full rounded-2xl px-4 py-3 flex items-center justify-between text-white"
      style={{
        background: `hsl(${modulo.cor})`,
        boxShadow: `0 4px 0 hsl(${modulo.corEscura})`,
      }}
    >
      <div className="text-left">
        <p className="text-[10px] font-bold tracking-widest opacity-90">
          MÓDULO {modulo.numero}, UNIDADE {unidade.numero}
        </p>
        <p className="text-base font-extrabold leading-tight mt-0.5">
          {unidade.titulo}
        </p>
      </div>
      <button
        onClick={() => onToggle(unidade.id)}
        aria-label={expandida ? `Fechar ${unidade.titulo}` : `Ver lições: ${unidade.titulo}`}
        aria-expanded={!!expandida}
        className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:translate-y-0.5"
      >
        {expandida ? (
          <ChevronUp className="w-5 h-5 text-white" strokeWidth={3} />
        ) : (
          <BookOpen className="w-5 h-5 text-white" strokeWidth={3} />
        )}
      </button>
    </div>
  );
};

export default UnidadeCardFechado;