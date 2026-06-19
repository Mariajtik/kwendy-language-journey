## Objectivo

Produzir documentação técnico-académica completa do Kwendi e propor um **modelo relacional ideal para futuro backend Supabase**, mantendo coerência com o que já existe em código (hooks `useSaldo`, `useProgresso`, `useMissoes`, `useInventario`, `useLoja`, currículo, loja, missões, conquistas, recompensas, fronteiras, histórias, curiosidades, dicionário, fala-escuta).

A entrega tem duas partes:

1. **Ficheiro `Kwendi_Analise_Tecnica.docx**` em `/mnt/documents/` — entregável formal, com todas as secções pedidas em texto corrido, tabelas e descrições.
2. **Diagramas Mermaid renderizados no chat** (artifacts `.mmd`) — para reveres visualmente o modelo lógico, diagrama de classes, casos de uso (sistema e negócio) e fluxo de funcionamento.

## Estrutura do documento (.docx)

11 secções numeradas, todas em Português (Angola/Portugal):

1. **Identificação do Projecto** — público-alvo, stack actual (React 18 + Vite + Tailwind + Framer Motion + localStorage), stack-alvo proposta (Lovable Cloud / Supabase: Auth, Postgres, Storage, Edge Functions).
2. **Funcionamento do Sistema** — Descrição narrativa do fluxo: Splash → Welcome → Apresentação → Features → Fronteiras (intro/quiz) → Signup/Login/Stealth → Processing → Home (mapa de lições) → Lição (exercícios: completar palavra, escolha múltipla, pares, certo/errado, fala/escuta) → Recompensas → Missões/Loja/Perfil/Histórias/Curiosidades/Dicionário/Caderno. Inclui regras: 5 vidas máx, 5 dicas grátis/dia, dica paga 15 💎, ofensiva, dobrador XP, baús (comum/raro/lendário), fragmentos.
3. **Descrição das Entidades do Modelo Relacional** — ficha textual de cada entidade com finalidade, atributos-chave e relações. Entidades propostas:
  - `utilizador` (perfil, idade, motivo, nível-actual)
  - `sessao_stealth` (acesso 7 dias sem conta)
  - `modulo`, `unidade`, `seccao` (currículo)
  - `progresso_seccao` (utilizador × secção)
  - `licao` (cabeçalho) e `exercicio` (tipo: completar / escolha / pares / certo-errado / fala / escuta)
  - `tentativa_exercicio` (resposta, correcto, tempo)
  - `saldo` (xp, diamantes, fragmentos, ofensiva, vidas, vidas_extra, ultimo_dia_activo)
  - `dica_diaria` (contador de dicas grátis usadas no dia)
  - `bau_inventario` (utilizador × raridade × quantidade) e `bau_abertura` (histórico de drops)
  - `item_loja`, `categoria_loja`, `compra` (transacção em diamantes), `precoreal_pack` (futuro Stripe/Paddle)
  - `powerup_activo` (utilizador × item × quantidade × expira_em)
  - `desbloqueio_cultura` (histórias/packs comprados)
  - `missao` (def), `missao_progresso`, `conquista` (def), `conquista_progresso`
  - `historia`, `historia_leitura`
  - `curiosidade`, `curiosidade_lida`
  - `palavra_dicionario`, `busca_dicionario`, `caderno_guardada`
  - `fala_escuta_pool`, `gravacao_fala`
  - `fronteiras_pergunta`, `fronteiras_partida`
  - `notificacao_pref`, `audit_log`
4. **Modelo Conceitual (ER)** — diagrama Entidade-Relação de alto nível (Chen/UML simplificado em ASCII + descrição das cardinalidades 1:N e N:N). Não tem PK/FK nem tipos.
5. **Modelo Lógico (Relacional)** — tabelas com PKs, FKs, restrições (UNIQUE, NOT NULL, CHECK, ENUMs), normalizado até 3FN. Apresentado como tabela "Tabela | Colunas | PK | FK | Restrições".
6. **Modelo Físico (SQL Postgres / Supabase)** — DDL completo (`CREATE TYPE`, `CREATE TABLE`, índices, `GRANT`, `ENABLE RLS`, políticas `auth.uid()`, função `has_role` + tabela `user_roles` para admins do conteúdo) **apenas como anexo SQL no documento** — não executado, é uma proposta.
7. **Diagrama de Classes (UML)** — classes que representam as entidades e os principais serviços (`SaldoService`, `ProgressoService`, `MissoesService`, `LojaService`, `LicaoService`, `DicaService`, `BauService`) com atributos, métodos públicos e relações (associação, composição, herança onde aplicável: `Missao` ← `MissaoDiaria`/`Semanal`/`Especial`).
8. **Diagrama de Casos de Uso do Sistema (UML)** — Actores: *Visitante*, *Utilizador Stealth*, *Aprendiz Registado*, *Sistema Temporal* (resets diários/semanais), *Administrador de Conteúdo*. Casos: registar-se, entrar como furtivo, fazer lição, usar dica grátis/paga, perder vida, comprar item, abrir baú, completar missão, resgatar conquista, ler história, ler curiosidade, jogar Fronteiras, etc., com relações `<<include>>` e `<<extend>>`.
9. **Diagrama de Casos de Uso de Negócio** — visão de mais alto nível, sem detalhe técnico: *Aprender Umbundu*, *Reter o aprendiz*, *Monetizar via Loja/Premium*, *Promover cultura angolana*, *Recolher feedback*. Actores de negócio: *Aprendiz*, *Equipa de Conteúdo*, *Equipa Comercial*, *Parceiros culturais*.
10. **Funcionamento Detalhado por Módulo** — fluxos passo-a-passo: aprendizagem, economia (diamantes/vidas/dicas), gamificação (XP/ofensiva/baús), conteúdo cultural, jogo Fronteiras.
11. **Programa para Implementação (Roadmap)** — fases: (F1) activar Lovable Cloud + Auth, (F2) migrar `useSaldo`/`useProgresso` para tabelas, (F3) missões/conquistas server-side com cron de reset, (F4) loja com pagamento real Stripe, (F5) painel admin de conteúdo, (F6) ranking social e amigos. Cada fase com entregáveis e dependências.

## Diagramas Mermaid no chat (artifacts)

Quatro ficheiros `.mmd` em `/mnt/documents/`, cada um inserido com `<lov-artifact mime_type="text/vnd.mermaid">`:

- `Kwendi_ER.mmd` — `erDiagram` com todas as tabelas e relações (modelo lógico visual).
- `Kwendi_Classes.mmd` — `classDiagram` das classes/serviços.
- `Kwendi_CasosUso_Sistema.mmd` — casos de uso técnicos (flowchart com actores e elipses).
- `Kwendi_CasosUso_Negocio.mmd` — casos de uso de negócio.
- `Kwendi_Fluxo.mmd` — `flowchart TD` do funcionamento (Splash → Home → Lição → Recompensa).

## Detalhes técnicos de geração

- Gerar `.docx` com **docx-js** (script Node em `/tmp`), página A4, fonte Arial, títulos Heading1/2/3 com `outlineLevel`, tabelas com `WidthType.DXA`, listas com `LevelFormat.BULLET`/`DECIMAL`.
- Diagramas no .docx: inserir como blocos de código pré-formatados (ASCII) **e** como `tabelas`. 
- Após gerar, **converter o .docx para PDF + tabelas** com LibreOffice e inspeccionar cada página (overflow, fontes, tabelas cortadas) antes de entregar.
- Sem alterações a código-fonte do app — é puramente documentação.

## Entregáveis finais

- `<presentation-artifact path="Kwendi_Analise_Tecnica.docx" ...>` (documento principal)
- 5 `<lov-artifact ... text/vnd.mermaid>` com os diagramas
- Mensagem curta a confirmar conteúdo e listar o que foi verificado nas páginas do .docx