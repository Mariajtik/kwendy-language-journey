/**
 * HistoriasScreen.tsx — Biblioteca de histórias / contos angolanos.
 * Lista cards de cada história. Clique abre o detalhe.
 */
import { motion } from "framer-motion";
import { Lock, Clock, MapPin, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import DiamanteNegro from "@/components/icons/DiamanteNegro";
import { HISTORIAS } from "@/data/historias";
import { ITENS_LOJA, type ItemId } from "@/data/loja";
import { useInventario } from "@/hooks/useInventario";

const PRECO_POR_HISTORIA: Record<string, ItemId> = {
  kianda: "desbloqueio-kianda",
  sumbi: "desbloqueio-sumbi",
};

const HistoriasScreen = () => {
  const nav = useNavigate();
  const { temDesbloqueio } = useInventario();
  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-6 pt-8 pb-32">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Histórias</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Contos e lendas tradicionais para praticar Umbundu.
        </p>

        <div className="flex flex-col gap-5">
          {HISTORIAS.map((h, i) => {
            const itemId = PRECO_POR_HISTORIA[h.id];
            const itemLoja = itemId ? ITENS_LOJA.find((x) => x.id === itemId) : undefined;
            const comprada = itemId ? temDesbloqueio(itemId) : false;
            const acessivel = h.desbloqueada || comprada;
            return (
            <motion.button
              key={h.id}
              onClick={() => {
                if (acessivel) nav(`/historias/${h.id}`);
                else nav("/loja");
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              className="relative text-left rounded-3xl overflow-hidden shadow-lg disabled:opacity-70"
              style={{
                background: `linear-gradient(135deg, hsl(${h.cor}) 0%, hsl(${h.corEscura}) 100%)`,
                boxShadow: `0 6px 0 hsl(${h.corEscura})`,
              }}
            >
              {h.imagem ? (
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={h.imagem}
                    alt={h.titulo}
                    className="w-full h-full object-cover"
                    style={{ filter: acessivel ? "none" : "grayscale(0.8)" }}
                  />
                </div>
              ) : (
                <div className="h-40 w-full flex items-center justify-center bg-black/20">
                  <Lock className="w-10 h-10 text-white/60" />
                </div>
              )}

              <div className="p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h2 className="text-lg font-extrabold leading-tight">{h.titulo}</h2>
                    <p className="text-xs text-white/80 mt-0.5">{h.subtitulo}</p>
                  </div>
                  {!acessivel && itemLoja ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 text-white text-xs font-extrabold shrink-0">
                      <DiamanteNegro className="w-3.5 h-3.5" />
                      {itemLoja.preco.toLocaleString()}
                    </span>
                  ) : !acessivel ? (
                    <Lock className="w-5 h-5 text-white/70 shrink-0" />
                  ) : null}
                </div>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-white/90">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {h.regiao}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {h.duracaoMin} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {h.nivel}
                  </span>
                </div>
              </div>
            </motion.button>
            );
          })}
        </div>
      </div>
      <BottomNav active="book" />
    </motion.div>
  );
};

export default HistoriasScreen;