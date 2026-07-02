/**
 * Mapa de personagens para diálogos: nome, avatar redondo (JPG) e
 * recorte de corpo inteiro em PNG transparente (usado nas cenas dos báus).
 */
import type { Personagem } from "@/data/licoes/tipos";
import kwendi from "@/assets/characters/kwendi.jpg.asset.json";
import otchali from "@/assets/characters/otchali.jpg.asset.json";
import yellen from "@/assets/characters/yellen.jpg.asset.json";
import hossy from "@/assets/characters/hossy.jpg.asset.json";
import suzana from "@/assets/characters/suzana.jpg.asset.json";
import kiame from "@/assets/characters/kiame.jpg.asset.json";
import kekehan from "@/assets/characters/keke-han.jpg.asset.json";
import kwendiCutout from "@/assets/characters/kwendi-cutout.png";
import otchaliCutout from "@/assets/characters/otchali-cutout.png";
import yellenCutout from "@/assets/characters/yellen-cutout.png";
import hossyCutout from "@/assets/characters/hossy-cutout.png";
import suzanaCutout from "@/assets/characters/suzana-cutout.png";
import kiameCutout from "@/assets/characters/kiame-cutout.png";
import kekehanCutout from "@/assets/characters/kekehan-cutout.png";
import kwendiBlink from "@/assets/characters/kwendi-cutout-blink.png";
import otchaliBlink from "@/assets/characters/otchali-cutout-blink.png";
import yellenBlink from "@/assets/characters/yellen-cutout-blink.png";
import hossyBlink from "@/assets/characters/hossy-cutout-blink.png";
import suzanaBlink from "@/assets/characters/suzana-cutout-blink.png";
import kiameBlink from "@/assets/characters/kiame-cutout-blink.png";
import kekehanBlink from "@/assets/characters/kekehan-cutout-blink.png";

export const PERSONAGENS: Record<
  Personagem,
  { nome: string; avatar: string | null; cutout: string | null; cutoutBlink: string | null }
> = {
  kwendi: { nome: "Kwendi", avatar: kwendi.url, cutout: kwendiCutout, cutoutBlink: kwendiBlink },
  otchali: { nome: "Otchali", avatar: otchali.url, cutout: otchaliCutout, cutoutBlink: otchaliBlink },
  yellen: { nome: "Yellen", avatar: yellen.url, cutout: yellenCutout, cutoutBlink: yellenBlink },
  hossy: { nome: "Hossy", avatar: hossy.url, cutout: hossyCutout, cutoutBlink: hossyBlink },
  suzana: { nome: "Vovó Suzana", avatar: suzana.url, cutout: suzanaCutout, cutoutBlink: suzanaBlink },
  kiame: { nome: "Kiame", avatar: kiame.url, cutout: kiameCutout, cutoutBlink: kiameBlink },
  kekehan: { nome: "Keke & Han", avatar: kekehan.url, cutout: kekehanCutout, cutoutBlink: kekehanBlink },
  kapt: { nome: "Kapt", avatar: null, cutout: null, cutoutBlink: null },
  kapo: { nome: "Kapo", avatar: null, cutout: null, cutoutBlink: null },
  laura: { nome: "Laura", avatar: null, cutout: null, cutoutBlink: null },
  cile: { nome: "Cile", avatar: null, cutout: null, cutoutBlink: null },
  // chac/kapit ficam como aliases de Kwendi/Otchali (sem arte própria).
  chac: { nome: "Kwendi", avatar: kwendi.url, cutout: kwendiCutout, cutoutBlink: kwendiBlink },
  kapit: { nome: "Otchali", avatar: otchali.url, cutout: otchaliCutout, cutoutBlink: otchaliBlink },
  narrador: { nome: "Narrador", avatar: null, cutout: null, cutoutBlink: null },
};