/**
 * DevelopersModal — apresenta a equipa por trás da Kwendi.
 */
import { AnimatePresence, motion } from "framer-motion";
import { X, Users } from "lucide-react";
import { DEVELOPERS } from "@/data/legal";

type Props = { open: boolean; onClose: () => void };

const DevelopersModal = ({ open, onClose }: Props) => (
  <AnimatePresence>
    {open && (
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
              <h2 className="text-xl font-extrabold text-foreground">
                Conhece a equipa Kwendi
              </h2>
              <p className="text-[11px] text-muted-foreground">
                As pessoas que fazem esta app acontecer.
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
          <div className="overflow-y-auto px-5 py-4 space-y-3">
            {DEVELOPERS.map((d) => (
              <div
                key={d.nome}
                className="rounded-2xl border-2 border-border bg-card p-4 flex gap-3"
                style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
              >
                <div
                  className="w-12 h-12 rounded-full grid place-items-center flex-shrink-0"
                  style={{
                    background: "hsl(var(--primary) / 0.15)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-foreground leading-tight">
                    {d.nome}
                  </p>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-primary mt-0.5">
                    {d.papel}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-snug">
                    {d.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DevelopersModal;