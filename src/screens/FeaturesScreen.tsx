/**
 * FeaturesScreen.tsx
 * -------------------
 * Tela que apresenta — de forma sucinta — as principais funcionalidades
 * do Kwendi e as personagens que acompanham o utilizador ao longo das
 * lições. Aparece apenas na primeira abertura do app.
 */

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { setFlag } from "@/lib/backend/prefsFlags";
import RouteSeo from "@/components/seo/RouteSeo";
import {
  ArrowLeft,
} from "lucide-react";

/* Personagens */
import kwendiImg from "@/assets/characters/kwendi.jpg.asset.json";
import suzanaImg from "@/assets/characters/suzana.jpg.asset.json";
import kiameImg from "@/assets/characters/kiame.jpg.asset.json";
import otchaliImg from "@/assets/characters/otchali.jpg.asset.json";
import hossyImg from "@/assets/characters/hossy.jpg.asset.json";
import yellenImg from "@/assets/characters/yellen.jpg.asset.json";
import kekeHanImg from "@/assets/characters/keke-han.jpg.asset.json";

/* ---- Funcionalidades (6 cards organizados) ----
 * Emojis curados (estilo "papel/sticker") em vez de ícones lineares,
 * para combinar com a estética calorosa e infantil do app — o mesmo
 * espírito do baú/HomeScreen. Nada de cards lineares genéricos. */
const FEATURES = [
  {
    emoji: "🛡️",
    title: "Conta & Modo Furtivo",
    desc: "Cria conta e guarda o teu progresso, ou testa 7 dias sem compromisso.",
    color: "hsl(var(--kwendi-yellow))",
    tilt: -6,
  },
  {
    emoji: "📖",
    title: "Aprende Umbundu",
    desc: "Abecedário, lições, missões diárias e ofensivas para manter o ritmo.",
    color: "hsl(var(--kwendi-green))",
    tilt: 5,
  },
  {
    emoji: "🔎",
    title: "Dicionário Vivo",
    desc: "Pesquisa por voz ou texto, vê tradução, sinónimos e ouve a pronúncia.",
    color: "hsl(var(--kwendi-blue))",
    tilt: -4,
  },
  {
    emoji: "🥁",
    title: "Cultura Angolana",
    desc: "Curiosidades, gastronomia, música e festas das províncias Umbundu.",
    color: "hsl(var(--kwendi-peach))",
    tilt: 6,
  },
  {
    emoji: "💎",
    title: "Gemas & Loja",
    desc: "Ganha gemas a completar missões e decora a tua casa no estilo mwangolé.",
    color: "hsl(var(--kwendi-purple))",
    tilt: -5,
  },
  {
    emoji: "👑",
    title: "Premium",
    desc: "Sem anúncios, lições exclusivas, IA de conversação e modo offline.",
    color: "hsl(var(--kwendi-pink))",
    tilt: 4,
  },
];

/* ---- Personagens ---- */
const CHARACTERS = [
  { name: "Kwendi", img: kwendiImg.url, bg: "#F8B5BD" },
  { name: "Avó Suzana", img: suzanaImg.url, bg: "#E8A88E" },
  { name: "Kiame", img: kiameImg.url, bg: "#F5F5F5" },
  { name: "Otchali", img: otchaliImg.url, bg: "#78D0FF" },
  { name: "Hossy", img: hossyImg.url, bg: "#FBBD12" },
  { name: "Yellen", img: yellenImg.url, bg: "#86D05D" },
  { name: "Keke & Han", img: kekeHanImg.url, bg: "#F8B5BD" },
];

const FeaturesScreen = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    setFlag("kwendi_seen_features");
    navigate("/welcome", { replace: true });
  };

  return (
    <>
    <RouteSeo
      title="Funcionalidades do Kwendi — Lições, personagens e IA"
      description="Descubra as funcionalidades do Kwendi: lições curtas de Umbundu, personagens angolanas, histórias culturais e a IA Kwendi para tirar dúvidas."
      path="/features"
    />
    <motion.div
      className="app-shell flex flex-col"
      style={{
        minHeight: "100dvh",
        background: "hsl(var(--kwendi-red))",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="rounded-full bg-white/20 backdrop-blur p-2 text-white hover:bg-white/30 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* ---- Título ---- */}
      <div className="px-6 pt-2 pb-6 text-white">
        <h1 className="text-3xl font-black leading-tight">
          Aqui, você aprende
          <br />
          Umbundu de verdade!
        </h1>
        <p className="mt-2 text-white/85 font-semibold">
          Conhece o que o Kwendi tem para ti.
        </p>
      </div>

      {/* ---- Cards de funcionalidades (grid 2 col) ---- */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {FEATURES.map((f, i) => {
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative rounded-2xl bg-white p-3 pt-5 shadow-md border-b-4 border-black/5"
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.08 }}
                style={{
                  background: f.color,
                  rotate: f.tilt,
                  boxShadow:
                    "inset 0 -3px 0 rgba(0,0,0,0.12), 0 3px 0 rgba(0,0,0,0.08)",
                }}
                className="w-12 h-12 rounded-[18px] flex items-center justify-center mb-2 text-2xl select-none"
              >
                <span>{f.emoji}</span>
              </motion.div>
              <h3 className="text-sm font-extrabold text-foreground leading-tight">
                {f.title}
              </h3>
              <p className="text-[11px] mt-1 text-muted-foreground font-semibold leading-snug">
                {f.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ---- Personagens ---- */}
      <div className="mt-6 text-white">
        <h2 className="px-6 text-lg font-extrabold mb-3">
          Conhece a tua família Kwendi
        </h2>
        <div className="flex gap-3 overflow-x-auto px-6 pb-2 scrollbar-none">
          {CHARACTERS.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="shrink-0 flex flex-col items-center"
            >
              <div
                className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md flex items-center justify-center"
                style={{ background: c.bg }}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-xs font-bold mt-2 max-w-[80px] text-center leading-tight">
                {c.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ---- CTA ---- */}
      <div className="mt-auto p-6">
        <button
          className="btn-duo"
          style={{
            background: "white",
            color: "hsl(var(--kwendi-red))",
            boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
          }}
          onClick={handleContinue}
        >
          Continuar
        </button>
        <p className="mt-4 text-center text-xs text-white/90 font-semibold">
          <Link to="/privacy" className="underline hover:text-white">
            Política de Privacidade
          </Link>
          {"  ·  "}
          <Link to="/terms" className="underline hover:text-white">
            Termos de Uso
          </Link>
        </p>
      </div>
    </motion.div>
    </>
  );
};

export default FeaturesScreen;