/**
 * PremiumSwitchCard — card exclusivo da tab "Premium" na Loja.
 * Um único switch global (persistido) liga/desliga todos os benefícios
 * viáveis do Pacote Premium. Está em degustação gratuita por tempo
 * indeterminado, portanto sem preço.
 */
import { motion } from "framer-motion";
import { Crown, Sparkles } from "lucide-react";
import { usePremium } from "@/contexts/PremiumContext";

const BENEFICIOS_ATIVOS = [
  { emoji: "❤️", txt: "Vidas infinitas — pratica sem parar" },
  { emoji: "⚡", txt: "XP em dobro para sempre" },
  { emoji: "🔥", txt: "Chama eterna — a tua ofensiva nunca cai" },
  { emoji: "💡", txt: "Dicas ilimitadas nas lições" },
  { emoji: "🎵", txt: "Todas as músicas, histórias e itens de cultura desbloqueados" },
  { emoji: "📸", txt: "Posta com foto na comunidade" },
  { emoji: "👑", txt: "Badge Premium no teu perfil" },
];

const EM_BREVE = [
  "IA Kwendi com sotaque angolano",
  "Conversa, chama e mensagens com a IA Kwendi",
  "Dicionário IA ilimitado",
  "Inglês e espanhol além do português",
  "Eventos exclusivos",
  "Estatísticas avançadas do progresso",
];

const PremiumSwitchCard = () => {
  const { ativo, toggle } = usePremium();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-2 rounded-3xl p-5 text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, hsl(15 90% 50%) 0%, hsl(35 95% 55%) 60%, hsl(45 96% 53%) 100%)",
        boxShadow: "0 6px 0 hsl(15 80% 35%)",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full"
        style={{ background: "rgba(255,255,255,0.12)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full"
        style={{ background: "rgba(0,0,0,0.08)" }}
        aria-hidden
      />

      <div className="relative">
        {/* Faixa de promoção */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[11px] font-extrabold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Grátis em degustação · tempo indeterminado
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center backdrop-blur">
            <Crown className="w-8 h-8" fill="#fff" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold leading-tight">Pacote Premium</h2>
            <p className="text-[12px] font-semibold opacity-90 leading-tight">
              Ativa e desativa a qualquer momento.
            </p>
          </div>
        </div>

        {/* Switch grande */}
        <button
          type="button"
          onClick={toggle}
          role="switch"
          aria-checked={ativo}
          className="w-full rounded-2xl bg-white/15 backdrop-blur border border-white/30 p-4 flex items-center justify-between mb-4"
        >
          <span className="text-left">
            <span className="block text-[12px] font-extrabold tracking-widest uppercase opacity-90">
              {ativo ? "Premium ligado" : "Premium desligado"}
            </span>
            <span className="block text-[13px] font-semibold opacity-90 mt-0.5">
              {ativo
                ? "Todos os benefícios ativos agora."
                : "Toca para experimentar grátis."}
            </span>
          </span>
          <span
            className="relative w-14 h-8 rounded-full flex-shrink-0 transition-colors"
            style={{ background: ativo ? "#ffffff" : "rgba(0,0,0,0.25)" }}
          >
            <span
              className="absolute top-1 left-1 w-6 h-6 rounded-full shadow transition-transform"
              style={{
                background: ativo ? "hsl(15 85% 50%)" : "#ffffff",
                transform: ativo ? "translateX(24px)" : "translateX(0)",
              }}
            />
          </span>
        </button>

        {/* Benefícios ativos */}
        <p className="text-[11px] font-extrabold tracking-widest uppercase opacity-90 mb-2">
          O que fica ativo
        </p>
        <ul className="space-y-1.5 mb-4">
          {BENEFICIOS_ATIVOS.map((b) => (
            <li
              key={b.txt}
              className="flex items-start gap-2 text-[13px] font-semibold leading-snug"
              style={{ opacity: ativo ? 1 : 0.7 }}
            >
              <span className="text-base leading-none">{b.emoji}</span>
              <span>{b.txt}</span>
            </li>
          ))}
        </ul>

        {/* Em breve */}
        <div className="rounded-2xl bg-white/10 p-3 border border-white/20">
          <p className="text-[11px] font-extrabold tracking-widest uppercase opacity-90 mb-1.5">
            Em breve
          </p>
          <ul className="space-y-1">
            {EM_BREVE.map((t) => (
              <li
                key={t}
                className="text-[12px] font-semibold leading-snug opacity-80 before:content-['•'] before:mr-1.5 before:opacity-70"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] font-semibold text-white/85 text-center mt-3">
          Enquanto durar a degustação, aproveita sem limites.
        </p>
      </div>
    </motion.div>
  );
};

export default PremiumSwitchCard;