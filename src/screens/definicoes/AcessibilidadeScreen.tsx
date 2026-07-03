/**
 * AcessibilidadeScreen — preferências de acessibilidade.
 *  - Tema claro / escuro
 *  - Fundo branco (desativa o fundo grass da Home)
 *  - Reprodução automática de áudio (padrão: mudo)
 */
import { motion } from "framer-motion";
import { Eye, Moon, Volume2 } from "lucide-react";
import DefHeader from "@/screens/definicoes/_DefHeader";
import { useAcessibilidade } from "@/contexts/AcessibilidadeContext";

type LinhaProps = {
  icon: typeof Eye;
  titulo: string;
  descricao: string;
  valor: boolean;
  onToggle: (v: boolean) => void;
};

const Linha = ({ icon: Icon, titulo, descricao, valor, onToggle }: LinhaProps) => (
  <div className="flex items-start gap-3 px-4 py-4">
    <Icon
      className="w-5 h-5 mt-0.5 flex-shrink-0"
      style={{ color: "hsl(var(--muted-foreground))" }}
      aria-hidden
    />
    <div className="flex-1 min-w-0">
      <div className="font-extrabold text-foreground text-sm">{titulo}</div>
      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
        {descricao}
      </p>
    </div>
    <button
      role="switch"
      aria-checked={valor}
      aria-label={titulo}
      onClick={() => onToggle(!valor)}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5"
      style={{
        background: valor ? "hsl(var(--primary))" : "hsl(var(--muted))",
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: valor ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  </div>
);

const AcessibilidadeScreen = () => {
  const {
    temaEscuro,
    fundoBranco,
    autoPlayAudio,
    setTemaEscuro,
    setFundoBranco,
    setAutoPlayAudio,
  } = useAcessibilidade();

  return (
    <motion.div
      className="app-shell bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <DefHeader titulo="Acessibilidade" subtitulo="Aparência, fundo e áudio" />
      <main className="px-4 py-5 pb-32">
        <div className="rounded-2xl border-2 border-border bg-card overflow-hidden divide-y divide-border">
          <Linha
            icon={Moon}
            titulo="Tema escuro"
            descricao="Muda a app do tema claro para escuro."
            valor={temaEscuro}
            onToggle={setTemaEscuro}
          />
          <Linha
            icon={Eye}
            titulo="Fundo branco"
            descricao="Substitui o fundo com relva do início por um branco simples, mais legível."
            valor={fundoBranco}
            onToggle={setFundoBranco}
          />
          <Linha
            icon={Volume2}
            titulo="Reprodução automática de áudio"
            descricao="Quando desligado, todos os áudios (intros, música do jogo Para Além de Fronteiras, etc.) começam mudos. Ligue para tocar automaticamente."
            valor={autoPlayAudio}
            onToggle={setAutoPlayAudio}
          />
        </div>
      </main>
    </motion.div>
  );
};

export default AcessibilidadeScreen;