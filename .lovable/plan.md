## O que muda

### 1. Separadores entre módulos (alternados)

Substituir o `TotemSeparador` SVG actual por **imagens reais** das pedras enviadas. Alternar conforme a posição:

- Entre M1↔M2: **arco de pedra** (portal)
- Entre M2↔M3: **pilha de pedras** (cairn)
- Entre M3↔M4: arco
- Entre M4↔M5: pilha

### 2. Piscina decorativa no Módulo 4

Aparece como **cena lateral** dentro do zig-zag do Módulo 4: piscina + Yellen + Otchali flutuando ao lado das lições (não interativa, decorativa).

---

## Passos técnicos

1. **Upload dos 2 PNGs como assets CDN** (arco + piscina + pilha já vão como assets):
  - `src/assets/separadores/arco-pedra.png.asset.json`
  - `src/assets/separadores/pilha-pedras.png.asset.json`
  - `src/assets/cenas/piscina.png.asset.json`
   Usar `lovable-assets create --file /mnt/user-uploads/<file>`.
2. **Reescrever `src/components/TotemSeparador.tsx**`: remover o SVG actual; aceitar nova prop `variante: "arco" | "pilha"`; renderizar `<img>` com a respectiva asset (largura ~140-180px, sombra ao chão, número do próximo módulo sobreposto em chip branco/castanho no topo do arco ou na pedra superior da pilha).
3. `**HomeScreen.tsx**` — onde renderiza `<TotemSeparador numeroProximoModulo={mod.numero} />`, calcular variante:
  ```ts
   variante={mi % 2 === 1 ? "arco" : "pilha"}
  ```
4. **Nova `CenaPiscina.tsx**` (componente decorativo): `<div>` absoluto/relativo com a piscina ao fundo + Yellen (avatar sem background) + Otchali (o mesmo). `aria-hidden`. Posicionado à direita do zig-zag. Como se estivessem brincando à beira da piscina.
5. `HomeScreen.tsx` **(renderZigZag ou wrapper do Módulo 4)** — quando `mod.id === "m4"`, envolver o bloco do módulo num container relativo e injectar `<CenaPiscina />` sobreposta numa posição lateral (ex.: `top: 40%`, `right: -20px`, `opacity: 0.95`, atrás dos botões com `pointer-events: none`).

## Fora de escopo

- Animação da água (estática por agora).
- Mudanças no zig-zag, banner ou nav.

## Ficheiros tocados

- Criar: 3 `.asset.json`, `src/components/CenaPiscina.tsx`
- Editar: `src/components/TotemSeparador.tsx`, `src/screens/HomeScreen.tsx`