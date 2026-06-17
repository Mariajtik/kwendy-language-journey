/**
 * DiamanteNegro — gem cinza facetado, moeda oficial do Kwendi.
 * Reutilizado em Home, Perfil, Missões.
 */
interface Props { className?: string }

const DiamanteNegro = ({ className = "" }: Props) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
    <path
      d="M6 3h12l4 6-10 12L2 9l4-6z"
      fill="#1a1a1a"
      stroke="#000000"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path
      d="M6 3l3 6h6l3-6M2 9h20M9 9l3 12M15 9l-3 12"
      stroke="#000000"
      strokeWidth="1"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M9 9l1.5-4h2L14 9z" fill="#2e2e2e" />
  </svg>
);

export default DiamanteNegro;