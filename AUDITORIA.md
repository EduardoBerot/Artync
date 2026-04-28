# Auditoria do projeto Artync

Levantamento de falhas, bugs e oportunidades de melhoria.
Base inicial: `main` @ `4792d90` (2026-04-27).

---

## 🔴 Críticos — afetam produção e conversão hoje

### ~~1. Form do ExitPopup não envia nada~~ ✅
- **Onde**: `js/components.jsx:703`.
- **Problema**: o `onSubmit` apenas executava `setSubmitted(true)`. Telefone digitado pelo lead era descartado.
- **Correção aplicada**: integrado com Formspree (`https://formspree.io/f/mgorjzpn`). Telefone, cidade, região e timestamp são enviados.

### 2. Babel Standalone compilando JSX em produção
- **Onde**: `index.html:59`.
- **Problema**: adiciona ~600KB de JS e atrasa o first paint em centenas de ms. Maior gargalo de performance do site.
- **Correção**: pré-compilar JSX num build leve (Vite/esbuild). Mantém o estilo "sem bundler para o dev" mas serve `.js` minificado em produção.

### 3. React em modo `development`
- **Onde**: `index.html:57-58`.
- **Problema**: `react.development.js` e `react-dom.development.js` são versões dev — mais lentas, com warnings em runtime.
- **Correção**: trocar para `react.production.min.js` e `react-dom.production.min.js`. Mudança de duas linhas.

### 4. Placeholders ainda em produção
- **CNPJ** `00.000.000/0001-00` em `js/components.jsx:615` (Footer).
- **E-mail** `contato@artync.com.br` no Footer com `href="#"` (sem `mailto:`) — `window.ARTYNC_CONTACT.email` já tem o valor; falta usar no Footer.
- **Risco**: JSON-LD/Footer com dados fakes prejudicam credibilidade e SEO local.

---

## 🟡 Bugs / código quebrado

### 5. `useReveal()` dentro de `.map()` viola Rules of Hooks
- **Onde**: `js/components.jsx:261` (Benefits), `:339` (Services), `:392` (HowItWorks step observer), `:443` e adjacentes (Testimonials).
- **Problema**: cada item da lista chama `useReveal()`, criando N hooks dependendo do tamanho do array. Funciona hoje porque as listas são fixas, mas é frágil — qualquer reorder/filter quebra.
- **Correção**: extrair um wrapper declarativo `<Reveal>` (já existe esboço em `js/utils.jsx:24`).

### 6. `<Testimonials/>` é código morto
- **Onde**: definido em `js/components.jsx:436`, mas `js/app.jsx` não o renderiza.
- **Decisão**: adicionar ao `<App/>` ou remover.

### 7. Footer mostra só 6 das 9 cidades
- **Onde**: `js/components.jsx:599` — `Object.values(allCities).slice(0, 6)`.
- **Impacto**: quebra a promessa de SEO regional para Teutônia, Vera Cruz e Rio Pardo (e quaisquer outras nas posições 7+).
- **Correção**: remover o `slice` ou paginar visualmente.

### 8. `js/utils.jsx` órfão
- Define `ScrollProgress`, `FloatingCTA`, `ExitPopup` duplicados das versões em `components.jsx`.
- Não é referenciado em nenhum HTML.
- **Decisão**: deletar o arquivo ou consolidar.

### 9. `nav--scrolled` aplicado estaticamente
- **Onde**: `js/components.jsx:53`.
- **Problema**: a classe nunca muda baseada em scroll. A nav sempre aparece no estado "rolado".
- **Correção**: alternar a classe via `useEffect` com listener de scroll (com RAF).

### 10. Listeners de scroll sem throttle
- **Onde**: `ScrollProgress` (`components.jsx:32`), `HowItWorks` (`components.jsx:370`).
- **Problema**: ambos rodam a cada evento de scroll, sem `requestAnimationFrame`. Em mobile pode causar jank perceptível.
- **Correção**: envolver em `requestAnimationFrame` com flag de throttling.

---

## 🟠 Acessibilidade

### 11. Faltam landmarks semânticos
- Não há `<main>`, `<header>`, `<footer>` no nível raiz (apesar de `<footer>` estar no Footer interno).
- **Correção**: envolver o conteúdo em `<main id="conteudo">`.

### 12. Sem skip-link
- Visitantes que navegam via teclado precisam tabular por toda a nav.
- **Correção**: link `Pular para o conteúdo` que aparece no primeiro foco.

### 13. FAQ sem ARIA
- **Onde**: `js/components.jsx:521`.
- **Problema**: o botão do acordeão não tem `aria-expanded`, `aria-controls` nem o painel `id` correspondente.

### 14. Sem mobile menu
- Em telas <720px, os links da nav apertam ou somem.
- **Correção**: hamburger com drawer/sheet padrão.

### 15. Botões só com ícone sem `aria-label` consistente
- Verificar todos os botões/ícones na `components.jsx`.

---

## 🟢 SEO / meta

### 16. `og:image` quebrado
- JSON-LD aponta para `https://artync.com.br/og.png` (`index.html:24`); o arquivo não existe em `assets/`.
- **Impacto**: preview quebrado em WhatsApp, LinkedIn, Slack.

### 17. Canonical inconsistente
- **Onde**: `index.html:15` — `canonical="https://artync.com.br/lajeado"`.
- **Problema**: a rota `/lajeado` não existe (HTML estático single-page); a URL real é `/` ou `/index.html`.

### 18. Faltam arquivos básicos
- Sem `sitemap.xml`, sem `robots.txt`.
- Sem `theme-color`, `manifest.json`.
- Sem `<link rel="icon">` (verificar — pode existir e eu não ter olhado).

---

## 🔵 UX / design

### 19. Hero com apenas 1 CTA
- **Onde**: `js/components.jsx:159`.
- Convencional ter primário (WhatsApp) + secundário ("Ver portfólio", "Como funciona") para quem ainda não está pronto.

### 20. Flash branco antes do React montar
- O usuário vê tela branca até Babel compilar e React renderizar.
- **Correção**: skeleton/HTML estático no `<div id="root">` para reduzir o LCP perceptual. Resolvido junto com o item 2 (pré-compilar JSX).

### 21. SVG do hero gerado em runtime
- **Onde**: `js/components.jsx:116` — 22 paths num `Array.from(...).map(...)`.
- **Impacto**: bloqueia o paint inicial até o React montar.
- **Correção**: SVG estático inline no HTML — renderiza antes do JS.

### 22. `index-print.html` duplicado
- 103 linhas vs. 67 do `index.html`. Manutenção dobrada.
- **Correção**: trocar por `?print=1` na mesma página, com `useEffect` chamando `window.print()`.

### 23. Sem dark mode real
- O tweak `heroStyle="dark"` muda só uma seção. O site inteiro continua claro.

---

## ⚙️ Pequenas pendências

- `data.js` menciona "Next.js 14" no copy — alinhar texto com a stack real (HTML+React via CDN) ou implementar de fato.
- Tweaks panel está sempre visível em produção — considerar gate por query param (`?edit=1`) ou env check.
- `JetBrains Mono` é carregada via Google Fonts (`index.html:48`) mas não vi uso óbvio em `styles.css` — verificar se vale o custo.

---

## Roadmap sugerido (ordem de impacto)

| # | Ação | Esforço | Impacto |
|---|------|---------|---------|
| ~~1~~ | ~~Form do ExitPopup envia (#1)~~ | ~~30min–1h~~ | ~~Captura de lead~~ |
| 2 | Trocar React dev → production + remover Babel via build leve (#2, #3) | ~1 dia | LCP cai em segundos |
| 3 | Preencher CNPJ, e-mail no Footer, og.png (#4, #16) | 1h | Credibilidade + SEO |
| 4 | Renderizar 9 cidades no Footer + adicionar `<Testimonials/>` (#6, #7) | 30min | Promessa SEO honrada |
| 5 | Refatorar `useReveal()` em loop para `<Reveal>` (#5) | 1h | Robustez |
| 6 | Mobile menu + landmarks + ARIA no FAQ (#11, #13, #14) | 2h | A11y + mobile UX |
| 7 | Throttle de scroll listeners + nav--scrolled dinâmica (#9, #10) | 1h | Suavidade mobile |
| 8 | Limpar `utils.jsx`, `index-print.html`, copy "Next.js" (#8, #22) | 30min | Higiene de código |

---

## Histórico

- **2026-04-27**
  - ExitPopup integrado com Formspree (`https://formspree.io/f/mgorjzpn`). Telefone, cidade, região e timestamp enviados (#1).
  - CTAs WhatsApp (`FinalCTA` e `FloatingCTA`) trocados de `<button>` morto para `<a href="wa.me/...">` com mensagem personalizada por cidade. Contato centralizado em `window.ARTYNC_CONTACT` (`js/data.js`).
  - Telefone real `+55 51 98954-0502` adicionado ao JSON-LD (`index.html:26`).

---

## Não estão na lista (intencionalmente)

- Reescrever em Next.js de verdade — é uma mudança grande e o spec original foi adaptado para HTML estático conscientemente.
- Adicionar testes — sem build tool, infra de teste é complicada e ROI baixo num site institucional.
- CMS para o conteúdo das cidades — `data.js` resolve bem para 9 cidades; só vira problema com 50+.
