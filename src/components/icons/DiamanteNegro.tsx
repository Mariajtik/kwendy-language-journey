/**
 * DiamanteNegro — mantido como shim para os call sites existentes.
 * Agora renderiza o ícone oficial de diamante do Kwendi.
 */
import KwendiIcon from "@/components/icons/KwendiIcon";

interface Props { className?: string }

const DiamanteNegro = ({ className = "" }: Props) => (
  <KwendiIcon name="diamante" className={className} />
);

export default DiamanteNegro;