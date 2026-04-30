# Auditoria do projeto Artync

Levantamento de falhas, bugs e oportunidades de melhoria.
Base inicial: `main` @ `4792d90` (2026-04-27).

**Auditoria concluída em 2026-04-29.**

## Histórico

- **2026-04-29**
  - `og:image` (#16): `assets/og-image.jpg` 1200×630 criado com identidade visual. `twitter:card` revertido para `summary_large_image`. Template salvo em `assets/og-template.html`.
  - `JetBrains Mono`: uso confirmado em `.bvisual-api__row` (`styles.css:808`) — fonte justificada, item fechado.

  - Flash branco (#20): `body{background:#FAFBFD}` inline no `<head>` + skeleton `.page-skeleton__nav` no `#root` com logo e altura da nav. React substitui ao montar sem flash visível.
  - Dark mode (#23): removido da lista — descartado (alto esforço, baixo ROI).
  - SVG hero (#21): 22 paths pré-computados como markup estático no JSX — removido `Array.from().map()` em runtime. Mover para HTML antes do `#root` exigiria reposicionamento externo sem ganho real de LCP (bottleneck é o React, não os paths).
  - Hero 2º CTA (#19): adicionado botão secundário "Como funciona" linkando para `#processo`. Wrapper `.hero__ctas` com flexbox e `flex-wrap` para mobile.
  - Botões ícone sem `aria-label` (#15): adicionado `aria-label="Fechar"` no botão de fechar do ExitPopup. Demais botões já tinham label ou texto visível.
  - Landmarks semânticos + skip-link (#11, #12): já estavam implementados — `<header>`, `<main id="conteudo">`, `<footer>`, skip-link com CSS de foco. Itens fechados na auditoria.
  - Arquivos básicos de SEO criados (#18): `sitemap.xml`, `robots.txt`, `theme-color` (#6171EE) e `<link rel="icon">` apontando para `assets/artync-icon.png`.
  - Gate `?edit=1` implementado: TweaksPanel só renderiza quando URL tem `?edit=1`. Visitante real não vê o painel.
  - FAQ ARIA (#13): adicionado `id={faq-btn-${i}}` no botão, fechando a referência `aria-labelledby` do painel. `aria-expanded` e `aria-controls` já existiam.
  - Mobile menu implementado (#14): hamburger animado (3 barras → X) aparece em <720px; drawer com links + CTA; fecha no `Escape` e no clique; body scroll bloqueado quando aberto; `aria-expanded` e `aria-controls` no botão.

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

- Dark mode real (#23) — alto esforço, baixo ROI para landing page institucional. Descartado.
- Reescrever em Next.js de verdade — é uma mudança grande e o spec original foi adaptado para HTML estático conscientemente.
- Adicionar testes — sem build tool, infra de teste é complicada e ROI baixo num site institucional.
- CMS para o conteúdo das cidades — `data.js` resolve bem para 9 cidades; só vira problema com 50+.

