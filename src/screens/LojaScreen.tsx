/**
 * LojaScreen — Loja Kwendi.
 * 3 tabs: Power-ups, Baús, Cultura. Compras via useLoja.
 */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import ItemLojaCard from "@/components/loja/ItemLojaCard";
import ConfirmarCompraModal from "@/components/loja/ConfirmarCompraModal";
import CompraSucessoModal from "@/components/loja/CompraSucessoModal";
import SaldoInsuficienteModal from "@/components/loja/SaldoInsuficienteModal";
import { CATEGORIAS, ITENS_LOJA, type CategoriaLoja, type ItemLoja } from "@/data/loja";
import { useLoja } from "@/hooks/useLoja";

const LojaScreen = () => {
  const nav = useNavigate();
  const { comprar, saldo, inventario } = useLoja();
  const [tab, setTab] = useState<CategoriaLoja>("powerup");
  const [confirmar, setConfirmar] = useState<ItemLoja | null>(null);
  const [sucesso, setSucesso] = useState<ItemLoja | null>(null);
  const [faltam, setFaltam] = useState<number | null>(null);

  const itens = useMemo(() => ITENS_LOJA.filter((i) => i.categoria === tab), [tab]);

  const handleComprar = () => {
    if (!confirmar) return;
    const item = confirmar;
    const r = comprar(item);
    setConfirmar(null);
    if (r.ok) {
      setSucesso(item);
      return;
    }
    if (r.motivo === "saldo-insuficiente") {
      setFaltam(item.preco - saldo.diamantes);
    }
  };

  return (
    <motion.div
      className="app-shell relative"
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(circle at top, hsl(45 80% 92%) 0%, hsl(var(--background)) 60%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/90 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav(-1)}
            className="w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground leading-none">Loja Kwendi</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Power-ups, baús e cultura
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border-2 border-border">
            <DiamanteNegro className="w-4 h-4" />
            <span className="font-extrabold tabular-nums text-sm">
              {saldo.diamantes.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {CATEGORIAS.map((c) => {
            const ativo = tab === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setTab(c.id)}
                className="flex-1 rounded-full py-2 text-xs font-extrabold transition"
                style={{
                  background: ativo ? `hsl(${c.cor})` : "hsl(var(--card))",
                  color: ativo ? "#fff" : "hsl(var(--muted-foreground))",
                  border: `2px solid ${ativo ? `hsl(${c.cor})` : "hsl(var(--border))"}`,
                  boxShadow: ativo ? `0 3px 0 hsl(${c.cor} / 0.5)` : undefined,
                }}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-5 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {itens.map((it) => (
              <ItemLojaCard
                key={it.id}
                item={it}
                desbloqueado={
                  it.categoria === "cultura" && inventario.desbloqueios.includes(it.id)
                }
                onComprar={() => setConfirmar(it)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <ConfirmarCompraModal
        item={confirmar}
        saldoAtual={saldo.diamantes}
        onCancelar={() => setConfirmar(null)}
        onConfirmar={handleComprar}
      />
      <CompraSucessoModal item={sucesso} onFechar={() => setSucesso(null)} />
      <SaldoInsuficienteModal
        aberto={faltam !== null}
        faltam={faltam ?? 0}
        onFechar={() => setFaltam(null)}
      />
    </motion.div>
  );
};

export default LojaScreen;