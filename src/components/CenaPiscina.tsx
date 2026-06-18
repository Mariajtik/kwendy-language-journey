/**
 * CenaPiscina.tsx
 * Cena decorativa (não interativa) com a piscina + Yellen e Otchali
 * a brincar à beira da água. Usada como ornamento lateral no zig-zag
 * de um módulo específico.
 */

import { motion } from "framer-motion";
import cena from "@/assets/cenas/cena-piscina.png.asset.json";

type Props = {
  className?: string;
};

/** Cena decorativa coesa: piscina com Yellen e Otchali a brincar.
 *  Tudo numa só ilustração — sem colagem de avatares. */
const CenaPiscina = ({ className = "" }: Props) => {
  return (
    <motion.figure
      aria-hidden
      className={`pointer-events-none select-none mx-auto my-4 ${className}`}
      style={{ width: "min(260px, 75%)" }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.img
        src={cena.url}
        alt=""
        loading="lazy"
        className="w-full h-auto"
        draggable={false}
        style={{
          filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.25))",
          transform: "rotate(-4deg)",
        }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.figure>
  );
};

export default CenaPiscina;