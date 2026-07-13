/**
 * LegalModal — apresenta um LegalDoc (Termos ou Privacidade) num bottom-sheet
 * com scroll. Sem dependências externas de UI.
 */
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { LegalDoc } from "@/data/legal";

type Props = { open: boolean; onClose: () => void; doc: LegalDoc | null };

const LegalModal = ({ open, onClose, doc }: Props) => {
  return (
    <AnimatePresence>
      {open && doc && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md bg-background rounded-t-3xl overflow-hidden flex flex-col"
            style={{ maxHeight: "85vh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">{doc.titulo}</h2>
                <p className="text-[11px] text-muted-foreground">
                  Versão {doc.versao} · {doc.atualizado}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar"
                className="p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-4">
              <p className="text-sm text-foreground leading-relaxed">{doc.intro}</p>
              {doc.seccoes.map((s) => (
                <section key={s.titulo}>
                  <h3 className="font-extrabold text-foreground mb-1.5">{s.titulo}</h3>
                  {s.paragrafos.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm text-muted-foreground leading-relaxed mb-2"
                    >
                      {p}
                    </p>
                  ))}
                </section>
              ))}
              <div className="h-4" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;