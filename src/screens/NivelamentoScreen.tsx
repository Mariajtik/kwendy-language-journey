/**
 * NivelamentoScreen.tsx
 * Teste de nivelamento baseado no Módulo 1 (~15 exercícios difíceis).
 * Reutiliza os componentes de PassoComponents. Ao final, calcula
 * acertos reais e navega para /processing com o payload.
 */

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  AprenderPasso,
  DialogoPasso,
  EscutaPasso,
  TraduzirPUPasso,
  TraduzirUPPasso,
  MontarFrasePasso,
  EscreverPasso,
  FalarPasso,
  EmparelharPasso,
  PreencherLacunaPasso,
  EscutaEscreverPasso,
  EscutaMontarPasso,
  PreencherLetrasPasso,
} from "@/components/licao/PassoComponents";
import type { Passo } from "@/data/licoes/tipos";
import {
  construirTesteNivelamento,
  calcularUnidadeSugerida,
} from "@/data/nivelamento";

const DURACAO_MIN = 10;

const NivelamentoScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { level?: string; username?: string }) || {};
  const level = state.level || "Intermediário";

  // Flags de acessibilidade só para esta sessão (mesmo padrão da LessonScreen).
  const [semFala, setSemFala] = useState(false);
  const [semEscuta, setSemEscuta] = useState(false);

  const exercicios = useMemo(
    () => construirTesteNivelamento({ semFala, semEscuta }),
    [semFala, semEscuta],
  );
  const total = exercicios.length;

  const [index, setIndex] = useState(0);
  const [acertosPorUnidade, setAcertosPorUnidade] = useState<Record<string, number>>({});
  const [totalPorUnidade, setTotalPorUnidade] = useState<Record<string, number>>({});
  const [acertos, setAcertos] = useState(0);

  // Cronómetro de 10 min. Ao esgotar, submete com o estado atual.
  const [segRestantes, setSegRestantes] = useState(DURACAO_MIN * 60);
  useEffect(() => {
    if (segRestantes <= 0) {
      finalizar(acertos, acertosPorUnidade, totalPorUnidade);
      return;
    }
    const t = setTimeout(() => setSegRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segRestantes]);

  const mm = String(Math.floor(segRestantes / 60)).padStart(2, "0");
  const ss = String(segRestantes % 60).padStart(2, "0");

  const registrar = (uId: string, certo: boolean) => {
    setTotalPorUnidade((p) => ({ ...p, [uId]: (p[uId] ?? 0) + 1 }));
    if (certo) {
      setAcertos((a) => a + 1);
      setAcertosPorUnidade((p) => ({ ...p, [uId]: (p[uId] ?? 0) + 1 }));
    }
  };

  const finalizar = (
    acertosFinal: number,
    aPU: Record<string, number>,
    tPU: Record<string, number>,
  ) => {
    const percentagem = total > 0 ? Math.round((acertosFinal / total) * 100) : 0;
    const unidadeSugerida =
      percentagem === 100 ? null : calcularUnidadeSugerida(aPU, tPU);
    navigate("/processing", {
      state: {
        level,
        username: state.username,
        acertos: acertosFinal,
        total,
        percentagem,
        unidadeSugerida,
        acertosPorUnidade: aPU,
      },
    });
  };

  const avancar = (certo: boolean) => {
    const uId = exercicios[index].unidadeId;
    registrar(uId, certo);
    if (index + 1 >= total) {
      // Usa valores atualizados via callback pattern.
      const nextAcertos = certo ? acertos + 1 : acertos;
      const nextTotalPU = { ...totalPorUnidade, [uId]: (totalPorUnidade[uId] ?? 0) + 1 };
      const nextAcertosPU = certo
        ? { ...acertosPorUnidade, [uId]: (acertosPorUnidade[uId] ?? 0) + 1 }
        : acertosPorUnidade;
      finalizar(nextAcertos, nextAcertosPU, nextTotalPU);
      return;
    }
    setIndex((i) => i + 1);
  };

  const sair = () => {
    if (confirm("Sair do teste? O progresso será perdido.")) {
      navigate(-1);
    }
  };

  const passo: Passo = exercicios[index].passo;
  const progresso = (index / total) * 100;

  const renderPasso = () => {
    switch (passo.tipo) {
      case "escuta_escolha":
        return <EscutaPasso passo={passo} onResolved={avancar} />;
      case "traduzir_pt_umbundu":
        return <TraduzirPUPasso passo={passo} onResolved={avancar} />;
      case "traduzir_umbundu_pt":
        return <TraduzirUPPasso passo={passo} onResolved={avancar} />;
      case "montar_frase":
        return <MontarFrasePasso passo={passo} onResolved={avancar} />;
      case "escrever":
        return <EscreverPasso passo={passo} onResolved={avancar} />;
      case "falar":
        return <FalarPasso passo={passo} onResolved={avancar} />;
      case "emparelhar":
        return <EmparelharPasso passo={passo} onResolved={avancar} />;
      case "preencher_lacuna":
        return <PreencherLacunaPasso passo={passo} onResolved={avancar} />;
      case "escuta_escrever":
        return <EscutaEscreverPasso passo={passo} onResolved={avancar} />;
      case "escuta_montar":
        return <EscutaMontarPasso passo={passo} onResolved={avancar} />;
      case "preencher_letras":
        return <PreencherLetrasPasso passo={passo} onResolved={avancar} />;
      case "aprender":
        return <AprenderPasso passo={passo} onContinuar={() => avancar(true)} />;
      case "dialogo":
        return <DialogoPasso passo={passo} onContinuar={() => avancar(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell flex flex-col px-5 py-4" style={{ minHeight: "100dvh", background: "#fff" }}>
      {/* Header: sair + progresso + cronómetro */}
      <div className="flex items-center gap-3 mb-4">
        <button aria-label="Sair" onClick={sair} className="p-1">
          <X className="w-6 h-6 text-muted-foreground" />
        </button>
        <div className="flex-1 h-3 rounded-full" style={{ background: "hsl(var(--muted))" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "hsl(var(--primary))" }}
            animate={{ width: `${progresso}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex items-center gap-1 text-xs font-extrabold text-muted-foreground tabular-nums">
          <Clock className="w-4 h-4" />
          {mm}:{ss}
        </div>
      </div>

      {/* Banner explicativo (só na 1ª questão) */}
      {index === 0 && (
        <div
          className="rounded-2xl border-2 border-border bg-card p-3 mb-3 text-xs text-muted-foreground"
          style={{ boxShadow: "0 2px 0 hsl(var(--border))" }}
        >
          <strong className="text-foreground">Teste de nivelamento</strong> · {total} exercícios difíceis
          do Módulo 1 · até {DURACAO_MIN} minutos. Faz o teu melhor.
        </div>
      )}

      <div className="flex-1 flex flex-col">{renderPasso()}</div>

      {/* Atalhos "não posso falar/ouvir" */}
      {(passo.tipo === "falar" || passo.tipo === "escuta_escolha" || passo.tipo === "escuta_escrever" || passo.tipo === "escuta_montar") && (
        <div className="mt-3 flex justify-center gap-4 text-[11px] font-bold">
          {passo.tipo === "falar" && !semFala && (
            <button
              onClick={() => {
                setSemFala(true);
                toast.info("Exercícios de fala vão virar escrita neste teste.");
              }}
              className="text-muted-foreground underline"
            >
              Não posso falar agora
            </button>
          )}
          {passo.tipo !== "falar" && !semEscuta && (
            <button
              onClick={() => {
                setSemEscuta(true);
                toast.info("Exercícios de escuta vão virar escrita neste teste.");
              }}
              className="text-muted-foreground underline"
            >
              Não posso ouvir agora
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NivelamentoScreen;