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

export const PERSONAGENS: Record<
  Personagem,
  { nome: string; avatar: string | null; cutout: string | null }
> = {
  kwendi: { nome: "Kwendi", avatar: kwendi.url, cutout: kwendiCutout },
  otchali: { nome: "Otchali", avatar: otchali.url, cutout: otchaliCutout },
  yellen: { nome: "Yellen", avatar: yellen.url, cutout: yellenCutout },
  hossy: { nome: "Hossy", avatar: hossy.url, cutout: hossyCutout },
  suzana: { nome: "Vovó Suzana", avatar: suzana.url, cutout: suzanaCutout },
  kiame: { nome: "Kiame", avatar: kiame.url, cutout: kiameCutout },
  kekehan: { nome: "Keke & Han", avatar: kekehan.url, cutout: kekehanCutout },
  kapt: { nome: "Kapt", avatar: null, cutout: null },
  kapo: { nome: "Kapo", avatar: null, cutout: null },
  laura: { nome: "Laura", avatar: null, cutout: null },
  cile: { nome: "Cile", avatar: null, cutout: null },
  // chac/kapit ficam como aliases de Kwendi/Otchali (sem arte própria).
  chac: { nome: "Kwendi", avatar: kwendi.url, cutout: kwendiCutout },
  kapit: { nome: "Otchali", avatar: otchali.url, cutout: otchaliCutout },
  narrador: { nome: "Narrador", avatar: null, cutout: null },
};