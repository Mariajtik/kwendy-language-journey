/**
 * KwendiIcon — ícones oficiais do Kwendi (fornecidos pelo design).
 * Cada SVG é importado como URL (Vite) e renderizado via <img>,
 * preservando as cores originais do desenho.
 */
import bau from "@/assets/icons/bau.svg";
import chamaAcesa from "@/assets/icons/chama_acesa.svg";
import chamaApagada from "@/assets/icons/chama_apagada.svg";
import coracao from "@/assets/icons/coracao.svg";
import diamante from "@/assets/icons/diamante.svg";
import home from "@/assets/icons/home.svg";
import livro from "@/assets/icons/livro.svg";
import lupa from "@/assets/icons/lupa.svg";
import maisop from "@/assets/icons/maisop.svg";
import perfilComCoroa from "@/assets/icons/perfilcomcoroa.svg";
import perfilSemCoroa from "@/assets/icons/perfilsemcoroa.svg";
import raioxp from "@/assets/icons/raioxp.svg";

export const kwendiIcons = {
  bau,
  chamaAcesa,
  chamaApagada,
  coracao,
  diamante,
  home,
  livro,
  lupa,
  maisop,
  perfilComCoroa,
  perfilSemCoroa,
  raioxp,
} as const;

export type KwendiIconName = keyof typeof kwendiIcons;

interface Props {
  name: KwendiIconName;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

const KwendiIcon = ({ name, className = "", alt = "", style }: Props) => (
  <img
    src={kwendiIcons[name]}
    alt={alt}
    aria-hidden={alt ? undefined : true}
    draggable={false}
    className={className}
    style={{ display: "inline-block", objectFit: "contain", ...style }}
  />
);

export default KwendiIcon;