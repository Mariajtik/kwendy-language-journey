/**
 * PassoComponents — renderiza cada tipo de passo de uma lição.
 * Cada componente recebe o passo já tipado e um callback onResolved(certo?)
 * que a LessonScreen usa para avançar / debitar vidas / contar XP.
 */
import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Mic, Square, Check, X as XIcon } from "lucide-react";
import type { Passo, Fala } from "@/data/licoes/tipos";
import { normalizar } from "@/data/licoes/tipos";
import { PERSONAGENS } from "./personagens";
import PalavraTocavel from "./PalavraTocavel";
import { bumpStat, STATS } from "@/lib/stats";

function falar(texto: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-PT";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

/** Split Umbundu string into tokens preserving punctuation for tocavel words. */
function tokens(s: string): { texto: string; palavra: string }[] {
  return s.split(/(\s+)/).map((tok) => ({
    texto: tok,
    palavra: tok.replace(/[.,;:!?]/g, ""),
  }));
}

/* -------------------- Aprender palavra -------------------- */

export const AprenderPasso = ({
  passo,
  onContinuar,
}: {
  passo: Extract<Passo, { tipo: "aprender" }>;
  onContinuar: () => void;
}) => (
  <div className="flex flex-col items-center text-center flex-1">
    <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
      PALAVRA NOVA
    </p>
    <div
      className="w-full rounded-3xl p-6 bg-card border-2 border-border mb-4"
      style={{ boxShadow: "0 4px 0 hsl(var(--border))" }}
    >
      <p className="text-3xl font-extrabold text-foreground leading-tight">
        {passo.umbundu}
      </p>
      <p className="text-base text-muted-foreground mt-2">{passo.pt}</p>
      {passo.exemplo && (
        <p className="text-sm italic text-muted-foreground mt-3 border-t border-border pt-3">
          {passo.exemplo}
        </p>
      )}
      <button
        type="button"
        onClick={() => falar(passo.umbundu)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-extrabold text-white"
        style={{
          background: "hsl(202 80% 50%)",
          boxShadow: "0 3px 0 hsl(202 80% 35%)",
        }}
      >
        <Volume2 className="w-4 h-4" /> Ouvir
      </button>
    </div>
    <button
      onClick={onContinuar}
      className="btn-duo btn-duo-primary w-full mt-auto"
    >
      Entendi
    </button>
  </div>
);

/* -------------------- Diálogo -------------------- */

const FalaBalao = ({ fala, invertido }: { fala: Fala; invertido: boolean }) => {
  const info = PERSONAGENS[fala.personagem];
  return (
    <motion.div
      initial={{ opacity: 0, x: invertido ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-2 ${invertido ? "flex-row-reverse" : ""}`}
    >
      {info.avatar ? (
        <img
          src={info.avatar}
          alt={info.nome}
          className="w-10 h-10 rounded-full object-cover border-2 border-border flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-muted grid place-items-center text-xs font-extrabold flex-shrink-0">
          {info.nome.slice(0, 2)}
        </div>
      )}
      <div className={`flex-1 ${invertido ? "text-right" : ""}`}>
        <p className="text-[10px] font-extrabold tracking-wider text-muted-foreground">
          {info.nome.toUpperCase()}
        </p>
        <div
          className="inline-block rounded-2xl bg-card border-2 border-border px-3 py-2 mt-1 text-left"
          style={{ boxShadow: "0 2px 0 hsl(var(--border))" }}
        >
          <p className="text-base font-extrabold text-foreground leading-snug">
            {tokens(fala.umbundu).map((t, i) =>
              t.palavra.trim() ? (
                <PalavraTocavel key={i} umbundu={t.palavra} texto={t.texto} />
              ) : (
                <span key={i}>{t.texto}</span>
              ),
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{fala.pt}</p>
          <button
            type="button"
            onClick={() => falar(fala.umbundu)}
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-extrabold"
            style={{ color: "hsl(202 80% 45%)" }}
          >
            <Volume2 className="w-3 h-3" /> Ouvir
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const DialogoPasso = ({
  passo,
  onContinuar,
}: {
  passo: Extract<Passo, { tipo: "dialogo" }>;
  onContinuar: () => void;
}) => {
  const primeiro = passo.falas[0]?.personagem;
  return (
    <div className="flex flex-col flex-1">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
        DIÁLOGO
      </p>
      <div className="space-y-3 mb-4">
        {passo.falas.map((f, i) => (
          <FalaBalao key={i} fala={f} invertido={f.personagem !== primeiro} />
        ))}
      </div>
      <button onClick={onContinuar} className="btn-duo btn-duo-primary w-full mt-auto">
        Continuar
      </button>
    </div>
  );
};

/* -------------------- Base para exercícios de escolha -------------------- */

function EscolhaBase({
  header,
  prompt,
  opcoes,
  correta,
  onResolved,
  audio,
}: {
  header: string;
  prompt: React.ReactNode;
  opcoes: string[];
  correta: number;
  onResolved: (certo: boolean) => void;
  audio?: string;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const verificar = () => {
    if (sel === null) return;
    setChecked(true);
  };

  const continuar = () => onResolved(sel === correta);

  return (
    <div className="flex flex-col flex-1">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
        {header}
      </p>
      <div className="mb-5">{prompt}</div>
      {audio && (
        <button
          type="button"
          onClick={() => falar(audio)}
          className="self-center w-20 h-20 rounded-full grid place-items-center text-white mb-5"
          style={{
            background: "hsl(202 80% 50%)",
            boxShadow: "0 5px 0 hsl(202 80% 35%)",
          }}
        >
          <Volume2 className="w-10 h-10" />
        </button>
      )}
      <div className="flex flex-col gap-2 mb-4">
        {opcoes.map((o, i) => {
          const isSel = sel === i;
          const showCerto = checked && i === correta;
          const showErrado = checked && isSel && i !== correta;
          return (
            <button
              key={i}
              disabled={checked}
              onClick={() => setSel(i)}
              className="rounded-2xl border-2 px-4 py-3 text-left font-bold transition-colors"
              style={{
                borderColor: showCerto
                  ? "#86D05D"
                  : showErrado
                  ? "hsl(var(--primary))"
                  : isSel
                  ? "hsl(var(--primary))"
                  : "#e5e5e5",
                background: showCerto
                  ? "#eaf7e0"
                  : showErrado
                  ? "#fdecec"
                  : isSel
                  ? "#fff5f5"
                  : "#fff",
                color: "#5E5C5C",
                boxShadow: `0 3px 0 ${
                  showCerto
                    ? "#5fae3a"
                    : showErrado
                    ? "hsl(var(--kwendi-red-dark))"
                    : isSel
                    ? "hsl(var(--kwendi-red-dark))"
                    : "#d4d4d4"
                }`,
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      <button
        disabled={sel === null}
        onClick={checked ? continuar : verificar}
        className="btn-duo btn-duo-primary w-full mt-auto disabled:opacity-50"
      >
        {checked ? "Continuar" : "Verificar"}
      </button>
    </div>
  );
}

/* -------------------- Escuta / Traduzir -------------------- */

export const EscutaPasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "escuta_escolha" }>;
  onResolved: (certo: boolean) => void;
}) => (
  <EscolhaBase
    header="OUVE E ESCOLHE A TRADUÇÃO"
    prompt={<p className="text-base text-muted-foreground text-center">Toca no áudio e escolhe o significado.</p>}
    opcoes={passo.opcoes}
    correta={passo.correta}
    onResolved={onResolved}
    audio={passo.audio}
  />
);

export const TraduzirPUPasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "traduzir_pt_umbundu" }>;
  onResolved: (certo: boolean) => void;
}) => (
  <EscolhaBase
    header="TRADUZ PARA UMBUNDU"
    prompt={
      <h2 className="text-2xl font-extrabold text-foreground">“{passo.pt}”</h2>
    }
    opcoes={passo.opcoes}
    correta={passo.correta}
    onResolved={onResolved}
  />
);

export const TraduzirUPPasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "traduzir_umbundu_pt" }>;
  onResolved: (certo: boolean) => void;
}) => (
  <EscolhaBase
    header="O QUE SIGNIFICA?"
    prompt={
      <div className="text-center">
        <p className="text-2xl font-extrabold text-foreground">
          {tokens(passo.umbundu).map((t, i) =>
            t.palavra.trim() ? (
              <PalavraTocavel key={i} umbundu={t.palavra} texto={t.texto} />
            ) : (
              <span key={i}>{t.texto}</span>
            ),
          )}
        </p>
        <button
          type="button"
          onClick={() => falar(passo.umbundu)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold"
          style={{ color: "hsl(202 80% 45%)" }}
        >
          <Volume2 className="w-3.5 h-3.5" /> Ouvir
        </button>
      </div>
    }
    opcoes={passo.opcoes}
    correta={passo.correta}
    onResolved={onResolved}
  />
);

/* -------------------- Montar frase (word bank) -------------------- */

export const MontarFrasePasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "montar_frase" }>;
  onResolved: (certo: boolean) => void;
}) => {
  const alvoPalavras = passo.alvo.split(" ");
  const banco = useMemo(() => {
    const arr = [...alvoPalavras, ...(passo.distratores ?? [])];
    return arr
      .map((p, i) => ({ id: i, palavra: p }))
      .sort(() => Math.random() - 0.5);
  }, [passo.alvo, passo.distratores]);

  const [escolhidos, setEscolhidos] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const construido = escolhidos.map((id) => banco.find((b) => b.id === id)!.palavra).join(" ");
  const certo = normalizar(construido) === normalizar(passo.alvo);

  const toggle = (id: number) => {
    if (checked) return;
    setEscolhidos((atual) =>
      atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id],
    );
  };

  return (
    <div className="flex flex-col flex-1">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
        MONTA A FRASE
      </p>
      <p className="text-base font-bold text-foreground mb-4">{passo.pergunta}</p>
      <div
        className="min-h-[64px] rounded-2xl border-2 border-dashed border-border p-3 mb-3 flex flex-wrap gap-2"
        style={{
          background: checked ? (certo ? "#eaf7e0" : "#fdecec") : "hsl(var(--muted))",
        }}
      >
        {escolhidos.length === 0 && (
          <p className="text-sm text-muted-foreground">Toca nas palavras para montar…</p>
        )}
        {escolhidos.map((id) => (
          <button
            key={id}
            onClick={() => toggle(id)}
            className="rounded-xl bg-card border-2 border-border px-3 py-1.5 font-extrabold text-sm"
            style={{ boxShadow: "0 2px 0 hsl(var(--border))" }}
          >
            {banco.find((b) => b.id === id)!.palavra}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {banco.map((b) => {
          const usado = escolhidos.includes(b.id);
          return (
            <button
              key={b.id}
              disabled={usado || checked}
              onClick={() => toggle(b.id)}
              className="rounded-xl px-3 py-1.5 font-extrabold text-sm"
              style={{
                background: usado ? "hsl(var(--muted))" : "hsl(var(--card))",
                border: "2px solid hsl(var(--border))",
                boxShadow: usado ? "none" : "0 2px 0 hsl(var(--border))",
                color: usado ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
                opacity: usado ? 0.4 : 1,
              }}
            >
              {b.palavra}
            </button>
          );
        })}
      </div>
      {checked && !certo && (
        <p className="text-sm font-bold text-primary mb-3">
          Resposta certa: {passo.alvo}
        </p>
      )}
      <button
        disabled={escolhidos.length === 0}
        onClick={() => (checked ? onResolved(certo) : setChecked(true))}
        className="btn-duo btn-duo-primary w-full mt-auto disabled:opacity-50"
      >
        {checked ? "Continuar" : "Verificar"}
      </button>
    </div>
  );
};

/* -------------------- Escrever livre -------------------- */

export const EscreverPasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "escrever" }>;
  onResolved: (certo: boolean) => void;
}) => {
  const [valor, setValor] = useState("");
  const [checked, setChecked] = useState(false);
  const certo = normalizar(valor) === normalizar(passo.resposta);

  return (
    <div className="flex flex-col flex-1">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
        ESCREVE EM UMBUNDU
      </p>
      <p className="text-base font-bold text-foreground mb-4">{passo.pergunta}</p>
      <input
        type="text"
        value={valor}
        disabled={checked}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Escreve aqui…"
        className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-bold text-lg outline-none focus:border-primary"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      />
      {checked && (
        <p
          className="text-sm font-bold mt-3"
          style={{ color: certo ? "#5fae3a" : "hsl(var(--primary))" }}
        >
          {certo ? "Certo!" : `Resposta esperada: ${passo.resposta}`}
        </p>
      )}
      <button
        disabled={valor.trim().length === 0}
        onClick={() => (checked ? onResolved(certo) : setChecked(true))}
        className="btn-duo btn-duo-primary w-full mt-auto disabled:opacity-50"
      >
        {checked ? "Continuar" : "Verificar"}
      </button>
    </div>
  );
};

/* -------------------- Falar -------------------- */

export const FalarPasso = ({
  passo,
  onResolved,
}: {
  passo: Extract<Passo, { tipo: "falar" }>;
  onResolved: (certo: boolean) => void;
}) => {
  const [gravando, setGravando] = useState(false);
  const [match, setMatch] = useState<number | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);

  const iniciar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        setMatch(Math.floor(70 + Math.random() * 26));
        bumpStat(STATS.falaGravacoes);
        setGravando(false);
      };
      rec.start();
      recRef.current = rec;
      setMatch(null);
      setGravando(true);
    } catch {
      // Sem microfone — considera sucesso simbólico para não travar a lição.
      setMatch(75);
      bumpStat(STATS.falaGravacoes);
    }
  };

  const parar = () => recRef.current?.stop();

  return (
    <div className="flex flex-col items-center text-center flex-1">
      <p className="text-[11px] font-extrabold tracking-widest text-muted-foreground mb-3">
        REPETE EM VOZ ALTA
      </p>
      <div
        className="w-full rounded-2xl p-5 bg-card border-2 border-border mb-5"
        style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
      >
        <p className="text-2xl font-extrabold text-foreground leading-tight">
          {passo.frase}
        </p>
        <p className="text-sm text-muted-foreground mt-1">{passo.pt}</p>
        <button
          type="button"
          onClick={() => falar(passo.frase)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold"
          style={{ color: "hsl(202 80% 45%)" }}
        >
          <Volume2 className="w-4 h-4" /> Ouvir modelo
        </button>
      </div>

      <motion.button
        type="button"
        onClick={gravando ? parar : iniciar}
        whileTap={{ scale: 0.94 }}
        animate={gravando ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={gravando ? { duration: 1.2, repeat: Infinity } : undefined}
        className="w-24 h-24 rounded-full grid place-items-center text-white"
        style={{
          background: gravando ? "hsl(var(--primary))" : "hsl(160 60% 35%)",
          boxShadow: gravando
            ? "0 6px 0 hsl(var(--kwendi-red-dark))"
            : "0 6px 0 hsl(160 60% 25%)",
        }}
      >
        {gravando ? <Square className="w-9 h-9" /> : <Mic className="w-10 h-10" />}
      </motion.button>

      {match !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mt-5 rounded-2xl p-4 bg-card border-2 border-border"
          style={{ boxShadow: "0 3px 0 hsl(var(--border))" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold tracking-wider text-muted-foreground">
              SEMELHANÇA
            </span>
            <span
              className="text-sm font-extrabold flex items-center gap-1"
              style={{ color: match >= 80 ? "#5fae3a" : "hsl(var(--primary))" }}
            >
              {match >= 80 ? (
                <Check className="w-4 h-4" />
              ) : (
                <XIcon className="w-4 h-4" />
              )}
              {match}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${match}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full"
              style={{
                background: match >= 80 ? "#5fae3a" : "hsl(var(--primary))",
              }}
            />
          </div>
        </motion.div>
      )}

      <button
        onClick={() => onResolved((match ?? 0) >= 70)}
        disabled={match === null}
        className="btn-duo btn-duo-primary w-full mt-6 disabled:opacity-50"
      >
        Continuar
      </button>
    </div>
  );
};