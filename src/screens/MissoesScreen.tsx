/**
 * MissoesScreen — tela principal de Missões & Conquistas.
 * Duas abas: Missões (diárias/semanais/especiais) e Conquistas (grid de badges).
 */
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, Wand2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import suzanaAsset from "@/assets/characters/suzana.jpg.asset.json";
import bauComum from "@/assets/missoes/bau-comum-fechado.png.asset.json";
import bauRaro from "@/assets/missoes/bau-raro-fechado.png.asset.json";
import bauLendario from "@/assets/missoes/bau-lendario-fechado.png.asset.json";
import HeaderRecursos from "@/components/missoes/HeaderRecursos";
import MissaoCard from "@/components/missoes/MissaoCard";
import RecompensaModal from "@/components/missoes/RecompensaModal";
import BauModal from "@/components/missoes/BauModal";
import ConquistaCard from "@/components/missoes/ConquistaCard";
import ConquistaModal from "@/components/missoes/ConquistaModal";
import { useMissoes, type ConquistaView } from "@/hooks/useMissoes";
import {
  proximoResetDiario,
  proximoResetSemanal,
  formatarTempoRestante,
  type Recompensa,
  type Raridade,
} from "@/data/missoes";
import {
  CATEGORIA_INFO,
  type ConquistaCategoria,
} from "@/data/conquistas";
import type { DropItem } from "@/data/recompensas";

type Aba = "missoes" | "conquistas";

const Secao = ({
  titulo,
  badge,
  children,
}: {
  titulo: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="mb-6">
    <div className="flex items-center justify-between mb-2 px-1">
      <h2 className="font-extrabold text-foreground text-base">{titulo}</h2>
      {badge}
    </div>
    <div className="space-y-2.5">{children}</div>
  </section>
);

const TimerBadge = ({ alvo, label }: { alvo: Date; label: string }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(i);
  }, []);
  const restante = useMemo(() => formatarTempoRestante(alvo), [alvo, tick]);
  return (
    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-muted-foreground">
      <Clock className="w-3.5 h-3.5" /> {label} {restante}
    </span>
  );
};

const MissoesScreen = () => {
  const m = useMissoes();
  const [aba, setAba] = useState<Aba>("missoes");
  const [recompensa, setRecompensa] = useState<{ r: Recompensa; titulo: string } | null>(null);
  const [bau, setBau] = useState<{ raridade: Raridade; drops: DropItem[] } | null>(null);
  const [conquista, setConquista] = useState<ConquistaView | null>(null);

  const handleResgatarMissao = (id: string, titulo: string) => {
    const r = m.resgatarRecompensa(id);
    if (r) setRecompensa({ r, titulo });
  };

  const abrirBau = (raridade: Raridade) => {
    const drops = m.abrirBau(raridade);
    if (drops) setBau({ raridade, drops });
  };

  const handleResgatarConquista = (id: string) => {
    const c = m.conquistas.find((x) => x.id === id);
    if (!c) return;
    m.resgatarConquista(id);
    setConquista(null);
    setRecompensa({ r: c.recompensa, titulo: c.titulo });
  };

  // Sincroniza conquista aberta com novo estado pós-resgate
  useEffect(() => {
    if (!conquista) return;
    const atualizada = m.conquistas.find((c) => c.id === conquista.id);
    if (
      atualizada &&
      (atualizada.progresso !== conquista.progresso ||
        atualizada.desbloqueada !== conquista.desbloqueada ||
        atualizada.resgatada !== conquista.resgatada)
    ) {
      setConquista(atualizada);
    }
  }, [m.conquistas, conquista]);

  // Simulação rápida para demonstrar o sistema sem lições integradas
  const simularProgresso = () => {
    m.registrarAcao("licao_completa", 1);
    m.registrarAcao("audio_ouvido", 1);
    m.registrarAcao("palavra_traduzida", 3);
    m.registrarAcao("resposta_correta_seguida", 1);
    m.registrarAcao("minuto_pratica", 5);
    // desbloquear primeiras conquistas conforme avanço
    const c1 = m.conquistas.find((c) => c.id === "c1");
    if (c1 && !c1.desbloqueada) m.desbloquearConquista("c1");
  };

  const totalBaus = m.saldo.baus.comum + m.saldo.baus.raro + m.saldo.baus.lendario;

  return (
    <motion.div
      className="app-shell relative bg-background"
      style={{ minHeight: "100dvh" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-5 pt-6 pb-32">
        <header className="mb-4">
          <h1 className="text-2xl font-extrabold text-foreground">Missões</h1>
          <p className="text-sm text-muted-foreground">
            Desafios diários, semanais e culturais.
          </p>
        </header>

        <HeaderRecursos
          xp={m.saldo.xp}
          diamantes={m.saldo.diamantes}
          baus={totalBaus}
          streak={m.saldo.ofensiva}
        />

        {/* Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted">
          {(["missoes", "conquistas"] as Aba[]).map((k) => (
            <button
              key={k}
              onClick={() => setAba(k)}
              className={`py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all ${
                aba === k
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
              style={
                aba === k
                  ? { boxShadow: "0 2px 0 hsl(var(--border))" }
                  : undefined
              }
            >
              {k === "missoes" ? "Missões" : "Conquistas"}
            </button>
          ))}
        </div>

        {/* Baús disponíveis (CTA quando houver) */}
        {totalBaus > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 p-3 rounded-2xl border-2 border-dashed"
            style={{ borderColor: "hsl(var(--kwendi-yellow))" }}
          >
            <Sparkles className="w-5 h-5 shrink-0" style={{ color: "hsl(var(--kwendi-yellow))" }} />
            <p className="text-sm font-extrabold text-foreground flex-1">
              Você tem baús para abrir!
            </p>
            <div className="flex gap-1.5">
              {(
                [
                  ["comum", bauComum.url],
                  ["raro", bauRaro.url],
                  ["lendario", bauLendario.url],
                ] as [Raridade, string][]
              ).map(([r, url]) =>
                m.saldo.baus[r] > 0 ? (
                  <button
                    key={r}
                    onClick={() => abrirBau(r)}
                    className="relative w-11 h-11 grid place-items-center"
                    aria-label={`Abrir baú ${r}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-contain" />
                    <span className="absolute -top-1 -right-1 text-[10px] font-extrabold bg-foreground text-background rounded-full w-4 h-4 grid place-items-center">
                      {m.saldo.baus[r]}
                    </span>
                  </button>
                ) : null
              )}
            </div>
          </motion.div>
        )}

        {/* Conteúdo de abas */}
        <div className="mt-5">
          {aba === "missoes" ? (
            <>
              <Secao
                titulo="Diárias"
                badge={<TimerBadge alvo={proximoResetDiario()} label="reseta em" />}
              >
                {m.diarias.map((mi) => (
                  <MissaoCard
                    key={mi.id}
                    missao={mi}
                    onResgatar={() => handleResgatarMissao(mi.id, mi.titulo)}
                  />
                ))}
              </Secao>

              <Secao
                titulo="Semanais"
                badge={<TimerBadge alvo={proximoResetSemanal()} label="reseta em" />}
              >
                {m.semanais.map((mi) => (
                  <MissaoCard
                    key={mi.id}
                    missao={mi}
                    onResgatar={() => handleResgatarMissao(mi.id, mi.titulo)}
                  />
                ))}
              </Secao>

              <Secao titulo="Especiais">
                {m.especiais.map((mi) => (
                  <MissaoCard
                    key={mi.id}
                    missao={mi}
                    onResgatar={() => handleResgatarMissao(mi.id, mi.titulo)}
                  />
                ))}
              </Secao>

              {/* Botão demo discreto */}
              <button
                onClick={simularProgresso}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-muted-foreground py-2 rounded-xl border border-dashed border-border hover:text-foreground hover:border-foreground transition"
              >
                <Wand2 className="w-3.5 h-3.5" /> Simular progresso (demo)
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="px-1">
                <h2 className="text-lg font-extrabold text-foreground">Conquistas culturais</h2>
                <p className="text-xs text-muted-foreground">
                  Feitos de longo prazo — distintos das badges de missão.
                </p>
              </div>

              {/* Mascote Soba apresenta a aba */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border-2 border-border" style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}>
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: "#E8A48C" }}>
                  <img src={suzanaAsset.url} alt="Avó Suzana" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-foreground leading-tight">Avó Suzana</p>
                  <p className="text-xs text-muted-foreground leading-snug mt-0.5">
                    "Cada badge é uma história. Coleciona, Kwendi!"
                  </p>
                </div>
              </div>

              {(Object.keys(CATEGORIA_INFO) as ConquistaCategoria[]).map((cat) => {
                const itens = m.conquistas.filter((c) => c.categoria === cat);
                const desb = itens.filter((c) => c.desbloqueada).length;
                return (
                  <section key={cat}>
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h2 className="font-extrabold text-foreground text-base">
                        {CATEGORIA_INFO[cat].label}
                      </h2>
                      <span
                        className="text-xs font-extrabold px-2 py-0.5 rounded-full"
                        style={{
                          background: `hsl(${CATEGORIA_INFO[cat].cor} / 0.18)`,
                          color: `hsl(${CATEGORIA_INFO[cat].cor})`,
                        }}
                      >
                        {desb}/{itens.length}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-y-4">
                      {itens.map((c) => (
                        <ConquistaCard
                          key={c.id}
                          conquista={c}
                          onClick={() => setConquista(c)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <RecompensaModal
        recompensa={recompensa?.r ?? null}
        titulo={recompensa?.titulo ? `${recompensa.titulo} ✓` : "Recompensa!"}
        onClose={() => setRecompensa(null)}
      />
      <BauModal
        raridade={bau?.raridade ?? null}
        drops={bau?.drops ?? null}
        onClose={() => setBau(null)}
      />
      <ConquistaModal
        conquista={conquista}
        onClose={() => setConquista(null)}
        onResgatar={handleResgatarConquista}
      />

      <BottomNav active="chest" />
    </motion.div>
  );
};

export default MissoesScreen;