# Plano: AI Home Hub — portal de Casa Inteligente + IA

## Visão geral

Criar um **novo projeto Lovable** separado do Kwendi, com repositório próprio no GitHub, domínio customizado e foco em tráfego orgânico de língua inglesa (EUA/Canadá). O site será um blog/portal com ferramentas leves de IA, otimizado para SEO e pronto para Google AdSense e afiliados.

## Objetivos de negócio

- Meta inicial: US$ 600/mês em AdSense + afiliados.
- Potencial: US$ 1.000+/mês com tráfego orgânico qualificado.
- Público: proprietários de casa, entusiastas de smart home, jardineiros e DIY nos EUA/Canadá.

## Fase 1 — Setup e infraestrutura

### 1.1 Novo projeto Lovable

- Criar novo projeto no Lovable (não afeta o Kwendi).
- Nome sugerido: `ai-home-hub` ou `smarthome-ai`.
- Publicar para obter URL `.lovable.app`.

### 1.2 GitHub

- Conectar o novo projeto a um novo repositório no GitHub via **Plus (+) → GitHub → Connect project**.
- Isso ativa sync automático e backup independente do Kwendi.

### 1.3 Domínio customizado

- Comprar domínio via Lovable ou registrar externamente (Namecheap/Cloudflare).
- Sugestões de domínio: `aihomehub.com`, `smarthomecompass.com`, `smartyardguru.com`.
- Conectar domínio em **Project Settings → Domains**.
- Configurar `www` e root.

### 1.4 Conteúdo legal obrigatório para AdSense

- Criar páginas públicas: **About**, **Contact**, **Privacy Policy**, **Terms of Service**.
- Adicionar cookie consent banner (obrigatório para tráfego EUA/Canadá e AdSense).
- Adicionar link para políticas no footer de todas as páginas.

### 1.5 Configurações técnicas iniciais

- Definir `lang="en"` no `index.html`.
- Configurar meta tags SEO (title, description, canonical, og, JSON-LD Organization/WebSite).
- Criar `robots.txt` e `sitemap.xml` dinâmico.
- Implementar `react-helmet-async` para SEO por rota.
- Configurar Google Analytics 4 e Google Search Console.

## Fase 2 — Arquitetura e funcionalidades do site

### 2.1 Estrutura do site

```text
/                    → Homepage com hero + categorias + artigos em destaque
/blog                → Lista de artigos paginada
/blog/:slug          → Artigo individual
/calculators         → Ferramentas de cálculo (energia, ROI smart home, etc.)
/ai-tools            → Ferramentas de IA (design de divisão, jardim, decoração)
/compare             → Comparações de produtos (tabelas SEO-friendly)
/about               → Sobre
/contact             → Contato
/privacy             → Política de privacidade
/terms               → Termos de uso
```

### 2.2 CMS / gestão de conteúdo

- Usar Lovable Cloud (Supabase) como backend.
- Tabela `public.articles` com campos: `slug`, `title`, `excerpt`, `content`, `category`, `tags`, `featured_image`, `meta_title`, `meta_description`, `published_at`, `author`, `status`.
- Tabela `public.categories` com: `slug`, `name`, `description`.
- RLS ativada: leitura pública (anon), escrita apenas admin.
- GRANT adequados em todas as tabelas públicas.

### 2.3 Ferramentas de IA (MVP leve)

Para evitar custos altos de API e manter velocidade:

- **AI Room Designer**: formulário que recebe estilo, orçamento e dimensões; chama Lovable AI Gateway (GPT-4o-mini) para gerar uma sugestão de decoração em texto + lista de produtos.
- **AI Garden Planner**: mesma lógica, mas para jardim (clima, tipo de solo, espaço).
- **Energy Savings Calculator**: calculadora client-side (sem IA) para estimar economia com termostatos inteligentes e lâmpadas LED.
- **Smart Home ROI Calculator**: calculadora client-side para payback de investimento em automação.

### 2.4 Sistema de afiliados

- Adicionar botões de CTA com links de afiliados Amazon/lojas de smart home.
- Campo `affiliate_links` na tabela de produtos/comparações.
- Disclaimer obrigatório de afiliados em posts.

### 2.5 Newsletter (futuro)

- Captura de e-mails para futura monetização.
- Tabela `public.newsletter_subscribers`.

## Fase 3 — Estratégia de conteúdo (10-25 artigos iniciais)

### 3.1 Categorias e exemplos de títulos

- **Smart Home**: "Best Smart Thermostats for Large Homes in 2026", "How to Build a Smart Home on a Budget"
- **Smart Garden**: "Smart Irrigation Systems for Small Gardens", "Best Robot Lawn Mowers Compared"
- **AI Tools**: "Best AI Tools for Home Design in 2026", "AI Interior Design Apps: Which One Is Best?"
- **DIY & Energy**: "How AI Can Help You Save Energy at Home", "Common Smart Home Mistakes to Avoid"
- **Reviews**: "10 Smart Garden Gadgets Worth Buying", "Smart Plugs Compared: TP-Link vs Kasa vs Wemo"

### 3.2 SEO por artigo

- Keyword research com Semrush.
- Título otimizado (H1), meta description, schema Article/FAQ/BreadcrumbList.
- Imagens com alt text e lazy loading.
- Links internos entre artigos.
- URLs limpas: `/blog/best-smart-thermostats-2026`.

### 3.3 Páginas de comparação (money pages)

- Tabelas comparativas de produtos com links de afiliados.
- Gerar conteúdo original, não apenas copiar specs.
- Adicionar schema `Product` e `Review` quando aplicável.

## Fase 4 — Monetização

### 4.1 Google AdSense

- Requisitos: conteúdo original, navegação clara, políticas legais, domínio próprio, tráfego real.
- Aplicar somente após publicar 10-15 artigos de qualidade.
- Adicionar slots de anúncios: header, sidebar, in-article, sticky footer.
- Respeitar políticas de placements: não colocar anúncios perto de botões interativos ou em pop-ups.

### 4.2 Afiliados

- Amazon Associates (EUA/Canadá).
- Programas de afiliados de marcas: Ecobee, Nest, Ring, Philips Hue, Rachio, etc.
- Incluir disclaimer: "As an Amazon Associate I earn from qualifying purchases."

### 4.3 Receitas futuras

- Premium subscription (ferramentas IA avançadas, sem anúncios).
- Conteúdo patrocinado (só quando tiver tráfego significativo).

## Fase 5 — Design e UX

### 5.1 Identidade visual

- Estilo clean, moderno, confiável (tech + home).
- Cores: verde (jardim), azul/cinza (tech), branco (limpo).
- Tipografia: sans-serif (Inter ou similar).
- Layout responsivo, mobile-first.

### 5.2 Componentes principais

- Header com logo, busca, categorias.
- Hero section com CTA para artigos em destaque.
- Article cards com imagem, categoria, título, excerpt, data.
- Sidebar com newsletter, anúncios, artigos populares.
- Footer com links legais, categorias, newsletter.

## Fase 6 — Lançamento e crescimento

### 6.1 Pre-launch

- 10-15 artigos publicados.
- Páginas legais, cookie banner, sitemap, GSC.
- Velocidade e Core Web Vitals otimizados.

### 6.2 Aplicação AdSense

- Aplicar somente após ter conteúdo sólido e tráfego inicial.
- Se rejeitado, corrigir feedback do Google e reaplicar.

### 6.3 Crescimento contínuo

- Publicar 2-4 artigos/semana.
- Criar conteúdo evergreen + conteúdo sazonal (ex: "Black Friday smart home deals").
- Backlinks via guest posts, Pinterest, YouTube (futuro).
- Email marketing para retenção.

## Notas importantes

- **Novo projeto**: o Kwendi continua intacto e independente. Cada projeto Lovable tem seu próprio backend, domínio e GitHub.
- **AdSense não é garantido**: depende de qualidade de conteúdo, tráfego e conformidade com políticas do Google.
- **Custo de IA**: as ferramentas de IA devem começar simples (texto) para controlar custos de API. Geração de imagens pode ser adicionada depois.
- **Inglês primeiro**: todo conteúdo inicial em inglês. Conversão para português pode ser uma segunda versão ou subdomínio `pt.`.
- **Responsabilidade**: afirmações de economia de energia, comparações de produtos e recomendações de afiliados precisam de disclaimer e precisão factual.

## Próximo passo recomendado

1. Criar o novo projeto Lovable.
2. Conectar ao GitHub.
3. Definir o domínio.
4. Publicar a landing page inicial + páginas legais.
5. Começar a publicar os primeiros artigos.