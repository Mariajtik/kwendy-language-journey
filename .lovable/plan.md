## Objectivo

Editar **apenas** o ficheiro `INTRODUÇAO.docx` enviado, sem alterar o conteúdo já existente. As alterações limitam-se a: paginação, legendas em falta de figuras/tabelas/gráficos/apêndices, e preenchimento das listas (Figuras, Tabelas, Gráficos) com os respectivos números de página.

Este trabalho é num artefacto Word — não modifica a aplicação Kwendi nem o repositório do GitHub.

## 1. Paginação (campos PAGE em rodapé)

O documento será dividido em **três secções** via quebras de secção (Section Breaks – Next Page), cada uma com rodapé desvinculado da anterior (`Link to Previous` = OFF):

| Secção | Páginas físicas | Conteúdo | Numeração apresentada |
|---|---|---|---|
| 1 | 1, 2, 3 | Capa, contracapa, folha de aprovação | **Sem número** (rodapé vazio) |
| 2 | 4 → 13 | Dedicatória, Agradecimentos, Epígrafe, Resumo, Abstract, Lista de Abreviaturas, Lista de Figuras, Lista de Gráficos, Índice | **Romanos minúsculos**, começando em `iv` (Dedicatória=iv, Agradecimentos=v, … Índice=xiii) |
| 3 | 14 em diante | Capítulo I — Introdução até ao fim (Apêndices inclusive) | **Árabes contínuos** começando em `14` (Cap. I=14, 1.1 Problemática=15, … até ao fim) |

Implementação: editar `word/document.xml` para inserir `<w:sectPr>` com `w:pgNumType w:start` e `w:fmt` (`upperRoman`/`lowerRoman`/`decimal`/`none`); criar/editar `word/footer1.xml`, `footer2.xml`, `footer3.xml` com o campo `PAGE` centrado; actualizar `word/_rels/document.xml.rels` e `[Content_Types].xml`.

## 2. Legendas e descrições em falta

Preencher apenas onde houver lacuna, **reutilizando texto que já existe no documento** (sem inventar conteúdo novo). Estilo: mesmo padrão das legendas existentes (`**Gráfico N** — descrição`).

- **Figuras** (Figura 1 a 11): adicionar legenda por baixo da imagem com o título exacto já registado na Lista de Figuras (ex.: "Figura 1 — Diagrama do Modelo Relacional (DER) do aplicativo Kwendi").
- **Gráficos** (1 a 11): as descrições já existem no corpo do capítulo 1.8; apenas garantir que a legenda **"Gráfico N — …"** está formatada de forma consistente abaixo de cada imagem.
- **Tabelas** dos questionários (pág. 23–27): adicionar título "Tabela N — Respostas à questão: <texto da pergunta>" usando a pergunta já presente acima de cada tabela.
- **Apêndices A, B, C, D**: na página de abertura de cada apêndice, garantir o título completo já presente no Índice (ex.: "APÊNDICE A — QUESTIONÁRIO APLICADO"). Não é adicionado conteúdo novo aos apêndices em si — apenas a sua identificação/legenda.

## 3. Listas (Figuras, Tabelas, Gráficos)

Após a renumeração, recalcular e gravar manualmente os números de página em cada item:

- **Lista de Figuras** (actualmente vazia/desactualizada para várias entradas): preencher cada `Figura N — …` com o nº da página onde a figura aparece no documento renumerado.
- **Lista de Gráficos**: actualizar os números (págs. 22–28 conforme a renumeração árabe que mantém estes valores, já que a renumeração árabe começa em 14 e continua sequencial).
- **Lista de Tabelas**: criar a lista (ainda não existe) com as tabelas dos questionários (pág. 23–27) usando o mesmo formato das outras listas.

Os números serão escritos como texto fixo (não campos TOC) para garantir consistência entre Word e Google Docs.

## 4. O que NÃO será alterado

- Texto de qualquer capítulo, parágrafo, citação ou tabela existente.
- Estilos, fontes, espaçamento, margens.
- Capa, folha de aprovação, dedicatória, agradecimentos, epígrafe, resumo, abstract.
- Conteúdo do código SQL, requisitos, casos de uso, etc.

## Entrega

Ficheiro final `INTRODUCAO_editado.docx` disponibilizado em `/mnt/documents/` para download, mantendo todo o conteúdo original e contendo apenas as alterações acima descritas. Após a geração será feita validação visual (conversão para PDF/imagens) para confirmar a paginação correcta nas três secções e a presença das legendas/listas.

## Detalhes técnicos

- Descompactar o `.docx` (zip XML), editar `word/document.xml`, criar `word/footerN.xml`, actualizar relacionamentos e `[Content_Types].xml`, recompactar e validar com `office/validate_document.py`.
- Validação final: `libreoffice --convert-to pdf` + `pdftoppm` para inspeccionar páginas 1, 4, 13, 14 e 15 e confirmar respectivamente: sem nº, `iv`, `xiii`, `14`, `15`.
