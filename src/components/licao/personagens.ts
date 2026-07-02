/**
 * Mapa de personagens para diálogos: nome + avatar.
 */
import type { Personagem } from "@/data/licoes/tipos";
import kwendi from "@/assets/characters/kwendi.jpg.asset.json";
import otchali from "@/assets/characters/otchali.jpg.asset.json";
import yellen from "@/assets/characters/yellen.jpg.asset.json";
import hossy from "@/assets/characters/hossy.jpg.asset.json";
import suzana from "@/assets/characters/suzana.jpg.asset.json";
import kiame from "@/assets/characters/kiame.jpg.asset.json";
import kekehan from "@/assets/characters/keke-han.jpg.asset.json";

export const PERSONAGENS: Record<
  Personagem,
  { nome: string; avatar: string | null }
> = {
  kwendi: { nome: "Kwendi", avatar: kwendi.url },
  otchali: { nome: "Otchali", avatar: otchali.url },
  yellen: { nome: "Yellen", avatar: yellen.url },
  hossy: { nome: "Hossy", avatar: hossy.url },
  suzana: { nome: "Vovó Suzana", avatar: suzana.url },
  kiame: { nome: "Kiame", avatar: kiame.url },
  kekehan: { nome: "Keke & Han", avatar: kekehan.url },
  kapt: { nome: "Kapt", avatar: null },
  kapo: { nome: "Kapo", avatar: null },
  laura: { nome: "Laura", avatar: null },
  cile: { nome: "Cile", avatar: null },
  narrador: { nome: "Narrador", avatar: null },
};