# Auditoria do projeto Artync

Levantamento de falhas, bugs e oportunidades de melhoria.
Base inicial: `main` @ `4792d90` (2026-04-27).

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

### 16. `og:image` — fallback temporário aplicado 🟡
- **Aplicado**: `og:image` aponta para `assets/artync-logo.png` como fallback. Twitter card baixado para `summary` até existir arte dedicada.
- **Pendente**: criar `assets/og.png` 1200×630 com identidade visual + tagline, depois reverter `twitter:card` para `summary_large_image`.

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
- O usuário vê tela branca até React renderizar.
- **Correção**: skeleton/HTML estático no `<div id="root">` para reduzir o LCP perceptual. Mitigado parcialmente pela remoção do Babel (#2), mas ainda existe um flash.

### 21. SVG do hero gerado em runtime
- **Onde**: `js/components.jsx:116` — 22 paths num `Array.from(...).map(...)`.
- **Impacto**: bloqueia o paint inicial até o React montar.
- **Correção**: SVG estático inline no HTML — renderiza antes do JS.

### 23. Sem dark mode real
- O tweak `heroStyle="dark"` muda só uma seção. O site inteiro continua claro.

---

## ⚙️ Pequenas pendências

- Tweaks panel está sempre visível em produção — considerar gate por query param (`?edit=1`) ou env check.
- `JetBrains Mono` é carregada via Google Fonts (`index.html:48`) mas não vi uso óbvio em `styles.css` — verificar se vale o custo.

---

## Roadmap sugerido (ordem de impacto)

| # | Ação | Esforço | Impacto |
|---|------|---------|---------|
| 1 | Mobile menu + landmarks + ARIA no FAQ (#11, #13, #14) | 2h | A11y + mobile UX |

---

## Histórico

- **2026-04-28**
  - Refatorado `useReveal()` em loop para componente `<Reveal>` (#5) — `Benefits` e `Services` agora usam wrapper declarativo ao invés de chamar hook dentro de `.map()`.

  - Removido Babel Standalone do navegador (#2). Adicionado `build.mjs` com esbuild (única dev dep) que pré-compila `js/*.jsx` → `dist/*.js` minificado.
  - React trocado para `production.min` (#3). Scripts carregam com `defer`.
  - Total de JS de runtime caiu de ~600KB+ (Babel + dev React) para ~45KB (dist) + React min (~140KB).
  - Footer: removido CNPJ e cidade do bottom; Instagram aponta para `https://www.instagram.com/_artync/` com ícone SVG inline. E-mail/WhatsApp/LinkedIn ainda em `href="#"`.
  - Removido `<Testimonials/>` (#6) — função, dados, CSS e regras de print correspondentes deletados.
  - Removida a coluna "Cidades" do Footer (#7). Props `city`/`allCities` removidas — Footer virou stateless.
  - Deletado `js/utils.jsx` órfão (#8) — duplicava componentes já presentes em `components.jsx`.
  - Canonical (#17): trocado de `/lajeado` para `/`. Adicionado `og:url` no head.
  - `og:image` (#16): fallback temporário apontando para `assets/artync-logo.png`. Twitter card baixado para `summary` até existir arte 1200×630 dedicada.
  - Nav (#9): `nav--scrolled` agora é dinâmico — aplicado quando `scrollY > 24px` via `useEffect` + `requestAnimationFrame`. Antes ficava sempre no estado "rolado".
  - Throttle (#10): `ScrollProgress` e `HowItWorks` agora envolvem o trabalho em `requestAnimationFrame` com flag `ticking`. Mobile fica suave mesmo em scroll rápido.
  - Footer: removido o e-mail da coluna Contato (era placeholder com `href="#"`). Sobraram WhatsApp + Instagram (@_artync) + LinkedIn.
  - Removido `index-print.html` (#22) — duplicava o `index.html`. Regras de impressão migraram para `css/styles.css` em `@media print` (funcionam em qualquer Ctrl+P). `?print=1` dispara `window.print()` automaticamente via `useEffect` no `App`.
  - Copy "Next.js 14" no `data.js` substituído por descrições stack-agnostic (foco em outcomes — performance, SEO, modular). Funciona pra qualquer framework que entreguemos. Observação relacionada removida do CLAUDE.md.

- **2026-04-27**
  - ExitPopup integrado com Formspree (`https://formspree.io/f/mgorjzpn`). Telefone, cidade, região e timestamp enviados (#1).
  - CTAs WhatsApp (`FinalCTA` e `FloatingCTA`) trocados de `<button>` morto para `<a href="wa.me/...">` com mensagem personalizada por cidade. Contato centralizado em `window.ARTYNC_CONTACT` (`js/data.js`).
  - Telefone real `+55 51 98954-0502` adicionado ao JSON-LD (`index.html:26`).

---

## Não estão na lista (intencionalmente)

- Reescrever em Next.js de verdade — é uma mudança grande e o spec original foi adaptado para HTML estático conscientemente.
- Adicionar testes — sem build tool, infra de teste é complicada e ROI baixo num site institucional.
- CMS para o conteúdo das cidades — `data.js` resolve bem para 9 cidades; só vira problema com 50+.
