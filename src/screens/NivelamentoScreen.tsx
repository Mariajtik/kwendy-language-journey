/**
 * NivelamentoScreen.tsx
 * Teste de nivelamento **adaptativo** (10–15 questões, ≤5 min).
 * Usa MotorAdaptativo (staircase CEFR A1..C2). Reutiliza PassoComponents.
 * Ao final, envia o resumo CEFR + categorias para /processing.
 */

import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  MotorAdaptativo,
  nivelInicialDeclarado,
  MIN_PERGUNTAS,
  MAX_PERGUNTAS,
} from "@/data/nivelamento";
import type { ItemNivelamento } from "@/data/nivelamento/banco";

const DURACAO_MIN = 5;

const NivelamentoScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as { level?: string; username?: string }) || {};
  const level = state.level || "Intermediário";

  const [semFala, setSemFala] = useState(false);
  const [semEscuta, setSemEscuta] = useState(false);

  // Motor persistente entre renders — recriado se as flags mudarem.
  const motorRef = useRef<MotorAdaptativo | null>(null);
  if (!motorRef.current) {
    motorRef.current = new MotorAdaptativo({
      nivelInicial: nivelInicialDeclarado(level),
      semFala,
      semEscuta,
    });
  }
  const motor = motorRef.current;

  // Item corrente + tick para forçar re-render após registrar resposta.
  const [tick, setTick] = useState(0);
  const itemAtual = useMemo<ItemNivelamento | null>(
    () => motor.proximo(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick, semFala, semEscuta],
  );

  // Cronómetro de 5 min. Ao esgotar, finaliza com o estado actual.
  const [segRestantes, setSegRestantes] = useState(DURACAO_MIN * 60);
  useEffect(() => {
    if (segRestantes <= 0) {
      finalizar();
      return;
    }
    const t = setTimeout(() => setSegRestantes((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segRestantes]);

  const mm = String(Math.floor(segRestantes / 60)).padStart(2, "0");
  const ss = String(segRestantes % 60).padStart(2, "0");

  const finalizar = () => {
    const resumo = motor.resumo();
    navigate("/processing", {
      state: {
        level,
        username: state.username,
        acertos: resumo.acertos,
        total: resumo.total,
        percentagem: resumo.percentagem,
        unidadeSugerida: resumo.unidadeSugerida,
        cefr: resumo.cefr,
        pontosFortes: resumo.pontosFortes,
        pontosFracos: resumo.pontosFracos,
        trilhaSugerida: resumo.trilhaSugerida,
        categorias: resumo.categorias,
      },
    });
  };

  const avancar = (certo: boolean) => {
    if (!itemAtual) return;
    motor.registrar(itemAtual, certo);
    if (motor.terminou()) {
      finalizar();
      return;
    }
    setTick((t) => t + 1);
  };

  const sair = () => {
    if (confirm("Sair do teste? O progresso será perdido.")) {
      navigate(-1);
    }
  };

  if (!itemAtual) {
    // Banco esgotou-se antes do mínimo — finaliza defensivamente.
    finalizar();
    return null;
  }

  const passo = itemAtual.passo;
  // Progresso baseado no mínimo esperado (10 questões). Se ultrapassar 10, mostra 100%.
  const feitas = motor.respondidas;
  const progresso = Math.min(100, (feitas / MIN_PERGUNTAS) * 100);

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
        <div
          className="px-2 py-0.5 rounded-full text-[10px] font-extrabold"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
          aria-label={`Nível actual: ${motor.nivelAtual}`}
        >
          {motor.nivelAtual}
        </div>
        <div className="flex items-center gap-1 text-xs font-extrabold text-muted-foreground tabular-nums">
          <Clock className="w-4 h-4" />
          {mm}:{ss}
        </div>
      </div>

      {/* Banner explicativo (só na 1ª questão) */}
      {feitas === 0 && (
        <div
          className="rounded-2xl border-2 border-border bg-card p-3 mb-3 text-xs text-muted-foreground"
          style={{ boxShadow: "0 2px 0 hsl(var(--border))" }}
        >
          <strong className="text-foreground">Teste adaptativo</strong> · {MIN_PERGUNTAS}–{MAX_PERGUNTAS} questões
          · escala CEFR A1–C2 · ≤{DURACAO_MIN} min. Sobe de nível a cada acerto.
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