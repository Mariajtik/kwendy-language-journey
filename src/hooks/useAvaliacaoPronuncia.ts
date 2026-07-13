/**
 * useAvaliacaoPronuncia — grava áudio, envia para `kwendi-stt`
 * e devolve o resultado da avaliação.
 */
import { useCallback, useRef, useState } from "react";
import { WavRecorder } from "@/lib/wavRecorder";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type EstadoPronuncia = "idle" | "a-ouvir" | "a-avaliar" | "pronto" | "erro";

export interface ResultadoPronuncia {
  transcricao: string;
  alvo: string;
  score: number;
  acertos: string[];
  erros: string[];
}

export function useAvaliacaoPronuncia() {
  const [estado, setEstado] = useState<EstadoPronuncia>("idle");
  const [resultado, setResultado] = useState<ResultadoPronuncia | null>(null);
  const recRef = useRef<WavRecorder | null>(null);
  const alvoRef = useRef<string>("");

  const iniciar = useCallback(async (alvo: string) => {
    setResultado(null);
    alvoRef.current = alvo;
    try {
      const rec = new WavRecorder();
      await rec.start();
      recRef.current = rec;
      setEstado("a-ouvir");
    } catch (e) {
      console.error("[pronuncia] mic denied", e);
      toast.error("Sem acesso ao microfone");
      setEstado("erro");
    }
  }, []);

  const parar = useCallback(async () => {
    const rec = recRef.current;
    if (!rec) return;
    recRef.current = null;
    setEstado("a-avaliar");
    try {
      const blob = await rec.stop();
      if (blob.size < 2048) {
        toast("Não ouvi nada — tenta outra vez");
        setEstado("idle");
        return;
      }
      const form = new FormData();
      form.append("audio", new File([blob], "pronuncia.wav", { type: "audio/wav" }));
      form.append("alvo", alvoRef.current);
      const { data, error } = await supabase.functions.invoke("kwendi-stt", { body: form });
      if (error) throw error;
      const r = data as ResultadoPronuncia;
      if (!r || typeof r.score !== "number") throw new Error("resposta inválida");
      setResultado(r);
      setEstado("pronto");
    } catch (e) {
      console.error("[pronuncia] falhou", e);
      toast.error("Não consegui avaliar. Tenta outra vez.");
      setEstado("erro");
    }
  }, []);

  const limpar = useCallback(() => {
    setResultado(null);
    setEstado("idle");
  }, []);

  return { estado, resultado, iniciar, parar, limpar };
}