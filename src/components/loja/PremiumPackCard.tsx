/**
 * PremiumPackCard — destaque exclusivo da Loja para o Pacote Premium ($5).
 * Não consome diamantes: regista intenção de compra (lead) em localStorage
 * e mostra a posição do utilizador na fila de interessados.
 */
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const BULLETS = [
  { emoji: "🔥", txt: "Chama eterna — nunca perdes ofensiva" },
  { emoji: "❤️", txt: "Vidas infinitas — pratica sem parar" },
  { emoji: "⚡", txt: "XP em dobro, para sempre" },
  { emoji: "🎵", txt: "Todas as músicas e histórias desbloqueadas" },
  { emoji: "🧠", txt: "Dicionário IA ilimitado" },
  { emoji: "🇦🇴", txt: "IA Kwendi com sotaque angolano — fala e escrita mais nossa" },
  { emoji: "🌍", txt: "Inglês e espanhol além do português" },
  { emoji: "💬", txt: "Conversa, chama e troca msgs com a IA Kwendi" },
  { emoji: "📸", txt: "Posta com foto na comunidade" },
  { emoji: "🎉", txt: "Acesso a mais eventos exclusivos" },
  { emoji: "📊", txt: "Estatísticas avançadas do teu progresso" },
  { emoji: "👑", txt: "Badge Premium no teu perfil" },
  { emoji: "🚫", txt: "Sem anúncios. Para sempre." },
];

interface Props {
  onInteresse: () => void;
  jaInteressado?: boolean;
}

const PremiumPackCard = ({ onInteresse, jaInteressado = false }: Props) => (
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
    {/* Decorações */}
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
      <div className="flex items-center gap-3 mb-3">
        <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center backdrop-blur">
          <Flame className="w-8 h-8" fill="#fff" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[11px] font-extrabold tracking-widest opacity-90">
            EXCLUSIVO · $5
          </p>
          <h2 className="text-xl font-extrabold leading-tight">Pacote Premium</h2>
        </div>
      </div>

      <p className="text-sm font-bold leading-snug mb-3">
        Desbloqueia o teu poder total. <span className="underline">$5 que mudam tudo</span>.
        Mais controle, mais opções, zero limites. A IA Kwendi ganha
        <b> sotaque angolano</b> — fala e escreve como em Luanda, Huambo, Benguela.
      </p>

      <ul className="space-y-1.5 mb-4">
        {BULLETS.map((b) => (
          <li
            key={b.txt}
            className="flex items-start gap-2 text-[13px] font-semibold leading-snug"
          >
            <span className="text-base leading-none">{b.emoji}</span>
            <span>{b.txt}</span>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl bg-white/15 backdrop-blur p-3 mb-3 border border-white/25">
        <p className="text-[11px] font-extrabold tracking-wider uppercase opacity-95">
          ⚠️ Importante
        </p>
        <p className="text-[12px] font-semibold leading-snug mt-1">
          Só toca em <b>"Tenho interesse"</b> se realmente compravas agora por
          $5. Estamos a medir o desejo real do mercado.
        </p>
      </div>

      {jaInteressado ? (
        <>
          <motion.button
            type="button"
            onClick={onInteresse}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-2xl py-3.5 font-extrabold text-[14px] bg-white/15 text-white border border-white/40"
          >
            Pensei melhor, retirar interesse
          </motion.button>
          <p className="text-[11px] font-semibold text-white/85 text-center mt-2">
            Já pertences à família — podes sair quando quiseres.
          </p>
        </>
      ) : (
        <>
          <motion.button
            type="button"
            onClick={onInteresse}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-2xl py-3.5 font-extrabold text-[15px] bg-white text-foreground"
            style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.18)" }}
          >
            Tenho interesse — avisem-me 🔥
          </motion.button>
          <p className="text-[11px] font-semibold text-white/85 text-center mt-2">
            Quanto mais pessoas querem, mais rápido construímos.
          </p>
        </>
      )}
    </div>
  </motion.div>
);

export default PremiumPackCard;