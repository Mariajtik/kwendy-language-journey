/**
 * Mini-mapa vivo de África usado no jogo Para Além de Fronteiras.
 * - Estado "perguntar": mapa completo, sem marcador.
 * - Estado "revelar":  faz zoom + centra o país. O marcador surge
 *   1 s depois da resposta marcada e desaparece automaticamente,
 *   ajudando o utilizador a localizar o país exato.
 */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import africaAsset from "@/assets/africa-bandeiras-hd.jpg.asset.json";
import type { PaisAfrica } from "@/data/paisesAfrica";

interface Props {
  pais: PaisAfrica;
  revelar: boolean;
  height?: number;
}

const MapaAfricaViva = ({ pais, revelar, height = 200 }: Props) => {
  const [mostrarMarcador, setMostrarMarcador] = useState(false);

  // Marcador surge 1 s após marcar a resposta e desaparece depois de 2 s,
  // ou imediatamente quando muda de pergunta.
  useEffect(() => {
    if (!revelar) {
      setMostrarMarcador(false);
      return;
    }
    const entrar = setTimeout(() => setMostrarMarcador(true), 1000);
    const sair = setTimeout(() => setMostrarMarcador(false), 3000);
    return () => {
      clearTimeout(entrar);
      clearTimeout(sair);
    };
  }, [revelar]);

  // Zoom centra-se no país usando transform-origin dinâmica, o que
  // mantém o país sempre dentro do enquadramento sem cortes nas bordas.
  const zoom = revelar ? 2.1 : 1;
  const originX = `${pais.x * 100}%`;
  const originY = `${pais.y * 100}%`;

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border-2 border-border bg-muted"
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: zoom, filter: revelar ? "saturate(1.15)" : "saturate(1)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${originX} ${originY}`, willChange: "transform" }}
      >
        <img
          src={africaAsset.url}
          alt="Mapa de África"
          className="h-full w-full object-contain select-none pointer-events-none"
          draggable={false}
          style={{ imageRendering: "auto" }}
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
            {mostrarMarcador && (
              <motion.div
                key="pulse"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.4, 0.9] }}
                exit={{ scale: 0.6, opacity: 0 }}
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