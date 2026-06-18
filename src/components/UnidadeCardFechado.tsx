/**
 * UnidadeCardFechado.tsx
 * Card compacto representando uma unidade que ainda não está activa.
 * Mostra módulo/unidade + título e um ícone de livro que abre o
 * popover com o zig-zag das lições (na mesma tela).
 */

import { BookOpen } from "lucide-react";
import type { Modulo, Unidade } from "@/data/curriculo";

type Props = {
  modulo: Modulo;
  unidade: Unidade;
  onAbrir: (unidadeId: string) => void;
};

const UnidadeCardFechado = ({ modulo, unidade, onAbrir }: Props) => {
  return (
    <div
      className="mt-3 w-full rounded-2xl px-4 py-3 flex items-center justify-between text-white"
      style={{
        background: "hsl(var(--primary))",
        boxShadow: "0 4px 0 hsl(var(--kwendi-red-dark))",
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
        onClick={() => onAbrir(unidade.id)}
        aria-label={`Ver lições: ${unidade.titulo}`}
        className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:translate-y-0.5"
      >
        <BookOpen className="w-5 h-5 text-white" strokeWidth={3} />
      </button>
    </div>
  );
};

export default UnidadeCardFechado;