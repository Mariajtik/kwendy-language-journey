/**
 * SairConfirmModal — diálogo de confirmação para "Sair" da conta.
 * Limpa estado local relevante e leva o utilizador ao Splash.
 */
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  aberto: boolean;
  onFechar: () => void;
}

const SairConfirmModal = ({ aberto, onFechar }: Props) => {
  const nav = useNavigate();

  const confirmar = () => {
    try {
      localStorage.removeItem("kwendi.auth.user");
    } catch {
      /* noop */
    }
    onFechar();
    nav("/");
  };

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
          className="fixed inset-0 z-50 bg-black/55 grid place-items-center p-4"
        >
          <motion.div
            initial={{ scale: 0.92, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 16 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-card p-6 text-center border-2 border-border relative"
            style={{ boxShadow: "0 6px 0 hsl(var(--border))" }}
          >
            <button
              onClick={onFechar}
              aria-label="Fechar"
              className="absolute top-3 right-3 w-9 h-9 rounded-xl grid place-items-center text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div
              className="w-14 h-14 mx-auto rounded-2xl grid place-items-center mb-3"
              style={{ background: "hsl(var(--destructive) / 0.15)" }}
            >
              <LogOut className="w-7 h-7" style={{ color: "hsl(var(--destructive))" }} />
            </div>
            <h3 className="text-lg font-extrabold text-foreground">Queres mesmo sair?</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-5">
              Os teus dados ficam guardados. Podes voltar quando quiseres.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onFechar}
                className="flex-1 rounded-2xl py-3 font-extrabold border-2 border-border text-foreground"
              >
                Ficar
              </button>
              <button
                onClick={confirmar}
                className="flex-1 rounded-2xl py-3 font-extrabold text-white"
                style={{
                  background: "hsl(var(--destructive))",
                  boxShadow: "0 4px 0 hsl(var(--destructive) / 0.6)",
                }}
              >
                Sair
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SairConfirmModal;