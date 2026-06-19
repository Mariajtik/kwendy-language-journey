/**
 * LojaScreen — Loja Kwendi.
 * 3 tabs: Power-ups, Baús, Cultura. Compras via useLoja.
 */
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Backpack } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import ItemLojaCard from "@/components/loja/ItemLojaCard";
import ConfirmarCompraModal from "@/components/loja/ConfirmarCompraModal";
import CompraSucessoModal from "@/components/loja/CompraSucessoModal";
import SaldoInsuficienteModal from "@/components/loja/SaldoInsuficienteModal";
import MochilaSheet from "@/components/inventario/MochilaSheet";
import { CATEGORIAS, ITENS_LOJA, type CategoriaLoja, type ItemLoja } from "@/data/loja";
import { useLoja } from "@/hooks/useLoja";
import PremiumPackCard from "@/components/loja/PremiumPackCard";
import PremiumInteresseModal from "@/components/loja/PremiumInteresseModal";
import { toast } from "sonner";

const PREMIUM_KEY = "kwendi.premium.interessados";
const PREMIUM_EU_KEY = "kwendi.premium.eu";

const LojaScreen = () => {
  const nav = useNavigate();
  const { comprar, saldo, inventario } = useLoja();
  const [tab, setTab] = useState<CategoriaLoja>("powerup");
  const [confirmar, setConfirmar] = useState<ItemLoja | null>(null);
  const [sucesso, setSucesso] = useState<ItemLoja | null>(null);
  const [faltam, setFaltam] = useState<number | null>(null);
  const [mochilaAberta, setMochilaAberta] = useState(false);
  const [premiumPos, setPremiumPos] = useState<number | null>(null);
  const [jaInteressado, setJaInteressado] = useState<boolean>(
    () => localStorage.getItem(PREMIUM_EU_KEY) === "1"
  );
  const totalMochila =
    inventario.powerUps.reduce((s, p) => s + p.quantidade, 0) +
    inventario.desbloqueios.length +
    saldo.vidasExtra;

  const itens = useMemo(() => ITENS_LOJA.filter((i) => i.categoria === tab), [tab]);

  const togglePremiumInteresse = () => {
    const atual = Number(localStorage.getItem(PREMIUM_KEY) ?? "0");
    if (jaInteressado) {
      const novo = Math.max(0, atual - 1);
      localStorage.setItem(PREMIUM_KEY, String(novo));
      localStorage.removeItem(PREMIUM_EU_KEY);
      setJaInteressado(false);
      toast("Interesse retirado", {
        description: "Já não estás na fila do Pacote Premium.",
      });
    } else {
      const pos = atual + 1;
      localStorage.setItem(PREMIUM_KEY, String(pos));
      localStorage.setItem(PREMIUM_EU_KEY, "1");
      setJaInteressado(true);
      setPremiumPos(pos);
    }
  };

  const handleComprar = () => {
    if (!confirmar) return;
    const item = confirmar;
    const r = comprar(item);
    setConfirmar(null);
    if (r.ok) {
      setSucesso(item);
    } else {
      const motivo = (r as { motivo: string }).motivo;
      if (motivo === "saldo-insuficiente") {
        setFaltam(item.preco - saldo.diamantes);
      }
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
          <motion.button
            type="button"
            onClick={() => setMochilaAberta(true)}
            whileTap={{ scale: 0.92 }}
            aria-label="Abrir mochila"
            className="relative w-10 h-10 rounded-xl border-2 border-border bg-card grid place-items-center"
          >
            <Backpack className="w-5 h-5" style={{ color: "hsl(160 60% 35%)" }} />
            {totalMochila > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full text-[10px] font-extrabold text-white"
                style={{ background: "hsl(160 60% 40%)" }}
              >
                {totalMochila}
              </span>
            )}
          </motion.button>
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
            {tab === "premium" ? (
              <PremiumPackCard
                onInteresse={togglePremiumInteresse}
                jaInteressado={jaInteressado}
              />
            ) : (
              itens.map((it) => (
                <ItemLojaCard
                  key={it.id}
                  item={it}
                  desbloqueado={
                    it.categoria === "cultura" && inventario.desbloqueios.includes(it.id)
                  }
                  onComprar={() => setConfirmar(it)}
                />
              ))
            )}
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
      <MochilaSheet aberto={mochilaAberta} onFechar={() => setMochilaAberta(false)} />
      <PremiumInteresseModal posicao={premiumPos} onFechar={() => setPremiumPos(null)} />
    </motion.div>
  );
};

export default LojaScreen;