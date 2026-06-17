/**
 * CuriosidadesScreen — museu vivo interativo da cultura angolana.
 */
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import CuriosidadeCard from "@/components/CuriosidadeCard";
import CuriosidadeModal from "@/components/CuriosidadeModal";
import {
  CATEGORIAS,
  curiosidades,
  type Categoria,
  type Curiosidade,
} from "@/data/curiosidades";

type Filter = "todas" | Categoria;

const CuriosidadesScreen = () => {
  const [filter, setFilter] = useState<Filter>("todas");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Curiosidade | null>(null);

  const chips: { id: Filter; label: string; color: string }[] = useMemo(
    () => [
      { id: "todas", label: "Todas", color: "hsl(var(--muted-foreground))" },
      ...(Object.entries(CATEGORIAS).map(([id, c]) => ({
        id: id as Filter,
        label: c.label,
        color: `hsl(var(${c.token}))`,
      })) as { id: Filter; label: string; color: string }[]),
    ],
    [],
  );

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return curiosidades.filter((c) => {
      if (filter !== "todas" && c.categoria !== filter) return false;
      if (!q) return true;
      return (
        c.titulo.toLowerCase().includes(q) ||
        c.subtitulo.toLowerCase().includes(q) ||
        c.resumo.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-8 pb-32">
        <h1 className="text-3xl font-extrabold text-foreground leading-tight">
          Curiosidades de Angola
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-snug">
          Descubra histórias, símbolos, sabores e tradições que fazem parte da alma angolana.
        </p>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar curiosidades…"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-card border-2 border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto mt-4 -mx-5 px-5 pb-1 scrollbar-none">
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setFilter(chip.id)}
                className="relative px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors"
                style={{
                  color: active ? "hsl(var(--card))" : chip.color,
                  background: active ? chip.color : "hsl(var(--card))",
                  border: `2px solid ${chip.color}`,
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid gap-4 mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((c) => (
              <CuriosidadeCard key={c.id} item={c} onOpen={() => setOpen(c)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {items.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-bold">Nada encontrado.</p>
            <p className="text-sm mt-1">Tenta outra palavra ou categoria.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <CuriosidadeModal item={open} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>

      <BottomNav active="search" />
    </motion.div>
  );
};

export default CuriosidadesScreen;