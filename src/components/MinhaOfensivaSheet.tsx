/**
 * MinhaOfensivaSheet — bottom sheet mostrando a chama do utilizador e da sua Tribo.
 * Sem premium: mostra apenas a própria + convite a subscrever.
 * Com premium: mostra a lista de amigos (na Iteração 3 será preenchida por dados reais).
 */
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Snowflake, Users, Flame, BarChart3, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import KwendiIcon from "@/components/icons/KwendiIcon";
import { useNavigate } from "react-router-dom";
import { usePremium } from "@/contexts/PremiumContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import SemanaOfensiva from "@/components/stats/SemanaOfensiva";

interface Props {
  aberto: boolean;
  onFechar: () => void;
  ofensiva: number;
  chamaAcesa: boolean;
  chamasCongeladas: number;
}

const MinhaOfensivaSheet = ({ aberto, onFechar, ofensiva, chamaAcesa, chamasCongeladas }: Props) => {
  const { t } = useTranslation();
  const { ativo: premium } = usePremium();
  const { user } = useAuth();
  const nav = useNavigate();
  const nome = ((user?.user_metadata as any)?.nome as string) || user?.email?.split("@")[0] || t("chama.tu", "TU");
  const [tribo, setTribo] = useState<
    { user_id: string; nome: string | null; avatar_url: string | null; ofensiva: number; ofensiva_hoje: boolean }[]
  >([]);

  useEffect(() => {
    if (!aberto || !user || !premium) return;
    (async () => {
      const { data: fs } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id, status")
        .eq("status", "accepted");
      const ids = new Set<string>();
      (fs ?? []).forEach((f: any) => {
        if (f.requester_id === user.id) ids.add(f.addressee_id);
        else if (f.addressee_id === user.id) ids.add(f.requester_id);
      });
      if (ids.size === 0) return setTribo([]);
      const { data } = await supabase
        .from("public_streaks")
        .select("user_id, nome, avatar_url, ofensiva, ofensiva_hoje")
        .in("user_id", Array.from(ids));
      setTribo(((data ?? []) as any).sort((a: any, b: any) => b.ofensiva - a.ofensiva));
    })();
  }, [aberto, user, premium]);

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-end sm:place-items-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onFechar}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="w-full sm:max-w-md bg-background rounded-t-3xl sm:rounded-3xl p-5 border-t-2 sm:border-2 border-border max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-extrabold text-foreground">{t("chama.titulo", "Minha chama")}</h3>
              <button onClick={onFechar} aria-label={t("comum.fechar", "Fechar")} className="p-1.5">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Card próprio */}
            <div
              className="rounded-2xl border-2 border-border p-4 mb-4 flex items-center gap-4"
              style={{ boxShadow: "0 4px 0 hsl(var(--border))" }}
            >
              <KwendiIcon
                name={chamaAcesa ? "chamaAcesa" : "chamaApagada"}
                className="w-14 h-14"
              />
              <div className="flex-1">
                <p className="text-xs font-extrabold tracking-wider text-muted-foreground">{t("chama.tu", "TU")} · {nome.toUpperCase()}</p>
                <p className="text-3xl font-extrabold tabular-nums" style={{ color: chamaAcesa ? "hsl(var(--kwendi-red))" : "hsl(var(--muted-foreground))" }}>
                  {ofensiva}
                  <span className="text-sm ml-1 font-bold">{ofensiva === 1 ? t("chama.dia", "dia") : t("chama.dias", "dias")}</span>
                </p>
                {chamasCongeladas > 0 && (
                  <p className="mt-1 text-xs font-bold text-muted-foreground inline-flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5" style={{ color: "hsl(200 90% 55%)" }} />
                    {chamasCongeladas} {chamasCongeladas === 1 ? t("chama.chamaCongelada", "chama congelada") : t("chama.chamasCongeladas", "chamas congeladas")}
                  </p>
                )}
                {!chamaAcesa && ofensiva === 0 && (
                  <p className="mt-1 text-[11px] text-muted-foreground">{t("chama.acender", "Completa uma lição hoje para acender.")}</p>
                )}
              </div>
            </div>

            {/* Faixa semanal de dias com chama (S T Q Q S S D) */}
            <div className="mb-4">
              <SemanaOfensiva />
            </div>

            {/* Acesso a Estatísticas (bloqueado sem Premium) */}
            <button
              onClick={() => {
                onFechar();
                nav(premium ? "/profile/estatisticas" : "/loja");
              }}
              className="w-full flex items-center gap-3 rounded-2xl border-2 border-border p-3 mb-4 text-left"
              style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "hsl(var(--primary) / 0.12)" }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-foreground">{t("chama.estatisticas", "Estatísticas")}</p>
                <p className="text-xs text-muted-foreground">
                  {premium ? t("chama.estatisticasVer", "Ver painel completo") : t("chama.estatisticasDesc", "XP, tempo, precisão e mapa de calor")}
                </p>
              </div>
              {premium ? (
                <Flame className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={3} />
              )}
            </button>

            {/* Tribo */}
            <div className="mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h4 className="text-sm font-extrabold text-foreground">{t("chama.tribo", "Minha Tribo")}</h4>
            </div>

            {!premium ? (
              <div className="rounded-2xl border-2 border-dashed border-border p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {t("chama.premiumConvite", "Vê a chama dos teus amigos e desafia a Tribo com o Kwendi Premium.")}
                </p>
                <button
                  onClick={() => { onFechar(); nav("/loja"); }}
                  className="w-full rounded-2xl py-3 font-extrabold text-white"
                  style={{ background: "hsl(var(--kwendy-gold))", boxShadow: "0 4px 0 hsl(var(--kwendi-brown))" }}
                >
                  {t("chama.ativarPremium", "Ativar Premium")}
                </button>
              </div>
            ) : (
              tribo.length === 0 ? (
                <div className="rounded-2xl border-2 border-border p-4 text-center text-sm text-muted-foreground">
                  {t("chama.semAmigos", "Ainda não tens amigos na Tribo. Adiciona-os em Comunidade → Ranking.")}
                </div>
              ) : (
                <div className="space-y-2">
                  {tribo.map((t) => (
                    <div key={t.user_id} className="flex items-center gap-3 rounded-2xl border-2 border-border p-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold overflow-hidden"
                        style={{ background: "hsl(var(--primary))" }}
                      >
                        {t.avatar_url ? (
                          <img src={t.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (t.nome ?? "K")[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-foreground truncate">{t.nome ?? "Kwendian"}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.ofensiva} dia{t.ofensiva === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Flame
                        className="w-5 h-5"
                        style={{ color: t.ofensiva_hoje && t.ofensiva > 0 ? "hsl(var(--kwendi-red))" : "hsl(var(--muted-foreground))" }}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinhaOfensivaSheet;