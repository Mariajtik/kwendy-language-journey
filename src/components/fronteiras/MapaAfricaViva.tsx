/**
 * Mini-mapa vivo de África usado no jogo Para Além de Fronteiras.
 * - Estado "perguntar": pin do país da pergunta a pulsar sobre o mapa completo.
 * - Estado "revelar":  faz zoom + centra o país + alfinete cai com bounce.
 */
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import africaAsset from "@/assets/africa.png.asset.json";
import type { PaisAfrica } from "@/data/paisesAfrica";

interface Props {
  pais: PaisAfrica;
  revelar: boolean;
  height?: number;
}

const MapaAfricaViva = ({ pais, revelar, height = 200 }: Props) => {
  // Zoom que centra o país sobre o viewport quando `revelar` é true.
  const zoom = revelar ? 2.4 : 1;
  // Desloca a imagem para que (pais.x, pais.y) fique no centro (0.5, 0.5).
  const tx = revelar ? (0.5 - pais.x) * 100 : 0;
  const ty = revelar ? (0.5 - pais.y) * 100 : 0;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-2 border-border bg-muted"
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: zoom, x: `${tx}%`, y: `${ty}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "center center" }}
      >
        <img
          src={africaAsset.url}
          alt="Mapa de África"
          className="h-full w-full object-contain select-none pointer-events-none"
          draggable={false}
        />

        {/* Alfinete posicionado sobre o país */}
        <div
          className="absolute"
          style={{
            left: `${pais.x * 100}%`,
            top: `${pais.y * 100}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <AnimatePresence>
            {revelar ? (
              <motion.div
                key="drop"
                initial={{ y: -80, opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.35 }}
                className="flex flex-col items-center"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                  style={{
                    background: `hsl(${pais.bandeira[1]})`,
                    boxShadow: "0 4px 8px hsl(0 0% 0% / 0.35)",
                  }}
                >
                  <MapPin className="h-5 w-5" fill="currentColor" />
                </div>
                <motion.div
                  initial={{ scaleX: 0.2, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.6 }}
                  transition={{ delay: 0.55, duration: 0.3 }}
                  className="mt-0.5 h-1.5 w-6 rounded-full bg-black/40 blur-[1px]"
                />
              </motion.div>
            ) : (
              <motion.div
                key="pulse"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.4, 0.9] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="h-4 w-4 rounded-full"
                style={{
                  background: `hsl(${pais.bandeira[1]})`,
                  boxShadow: `0 0 0 4px hsl(${pais.bandeira[1]} / 0.35)`,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Etiqueta do país no canto */}
      <AnimatePresence>
        {revelar && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-2 left-2 rounded-full bg-background/90 px-3 py-1 text-xs font-black text-foreground shadow"
          >
            {pais.emoji} {pais.nome}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapaAfricaViva;