# Auditoria 2 — Artync

Varredura minuciosa de bugs, código morto, SEO, performance, acessibilidade e UX.
Base: `main` @ `45c4a83` (2026-04-29).

Severidade: 🔴 Bug real · 🟡 Importante · 🟢 Polimento

---

## 🐛 Bugs

### B1. `TweakSection` recebe `title` mas espera `label` 🔴
`app.jsx` usa `<TweakSection title="Cidade (SEO regional)" hint="...">` mas o componente em `tweaks-panel.jsx` só aceita `label` e ignora `title` e `hint`. As seções do painel renderizam sem título.
- `app.jsx:82,91,111` → mudar `title=` para `label=`, remover `hint=`.

### B2. Footer: WhatsApp e LinkedIn com `href="#"` morto 🔴
`components.jsx:649` — link WhatsApp aponta para `#`. Usar `window.ARTYNC_CONTACT.whatsappUrl()`.
`components.jsx:655` — link LinkedIn sem URL real. Adicionar URL ou remover o item.

### B3. Skip link posicionado depois da Nav 🔴
`app.jsx:67` — `<a className="skip-link">` vem após `<Nav>`, então o primeiro Tab do teclado entra na nav antes de oferecer o skip. Mover para antes de `<Nav>` (idealmente primeiro filho do `<>` fragment).

### B4. `heroStyle` tweaks não têm efeito visual 🟡
`app.jsx:44-46` define `document.body.dataset.hero = tweaks.heroStyle` mas não existe CSS que use `[data-hero]`, e o componente `Hero` sempre renderiza `hero--light` independente do tweak. As opções `minimal` e `dark` do painel são funcionalmente mortas.
- Ou implementar as variantes, ou remover essas opções do TweakRadio.

### B5. `alert()` bloqueante no ExitPopup 🟡
`components.jsx:767,770` — falha de envio ao Formspree dispara `alert(...)`. Bloqueia o UI e é UX péssima em mobile.
- Substituir por estado `error` inline abaixo do form.

### B6. Copy menciona `next/image` no benefício de performance 🟡
`data.js:103` — `"imagens otimizadas com next/image"`. O stack atual é HTML estático sem Next.js. Vestigio da versão anterior.

### B7. Footer "Serviços" todos linkam para `#beneficios` 🟢
`components.jsx:640-644` — Criação de sites, Landing pages, Sistemas web, SEO local apontam todos para `#beneficios`. Deveriam apontar para `#servicos`.

### B8. `Söhne (sans)` no FONT_STACKS não está carregada 🟢
`app.jsx:18` — `"Söhne (sans)"` referencia uma fonte não carregada (não está no Google Fonts do site). Se selecionada no tweak, cai silenciosamente para Inter sem aviso.

---

## 🗑️ Código Morto ✅ Resolvido em 2026-04-29

- **M1** `styles.css`: removidos `.hero__bg`, `.hero__noise`, `.hero__rays`, `.hero__pill`, `.hero__pill-dot`, `.hero__title`, `.hero__sub`, `.hero__ctas` (duplicata), `.hero__meta*`, `.hero__widget*`, `@keyframes heroIn`, `@keyframes float` e seletores de animação.
- **M2** `hero-light.css`: removidos `.btn--block`, `.btn--block__arrow`, `.hero__trust*` e regras correspondentes nos media queries.
- **M3** `styles.css`: removidos `.section--ink`, `.nav__city`, `.btn--primary`.
- **M4** `icons.jsx`: removidos `Icon.trend`, `Icon.star`, `Icon.pin`, `Icon.chevron`.
- **M5** `styles.css`: `.hero__ctas` duplicata removida junto com o bloco M1.

---

## 🔍 SEO / Metadata

### S1. `<title>` e `<meta description>` hardcoded para Lajeado 🟡
`index.html:6-7` — título e descrição são genéricos/Lajeado. Para as rotas de cidade (quando implementadas), cada uma precisa de `<title>` e `<meta description>` únicos. Mesmo agora, o título poderia ser mais rico em palavras-chave.
- Sugestão: `"Artync — Criação de Sites em [Cidade] | SEO Local e Performance"`.

### S2. FAQPage JSON-LD com 3 de 6 perguntas 🟡
`index.html:41-46` — structured data tem só as 3 primeiras perguntas. As outras 3 (tempo de entrega, edição do site, Wix vs código próprio) são valiosas para featured snippets. Adicionar todas ao JSON-LD.

### S3. `aggregateRating` sem fonte verificável 🟡
`index.html:34` — `"ratingValue": "4.9", "reviewCount": "38"` sem um link para página de reviews real (Google Meu Negócio, etc.). Google pode invalidar e penalizar dados estruturados não verificáveis.
- Remover o bloco `aggregateRating` até ter reviews reais linkadas, ou adicionar `"url"` apontando para o perfil do Google Meu Negócio.

### S4. `og:image` sem dimensões e tipo declarados 🟢
`index.html:15` — faltam:
```html
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:type" content="image/jpeg"/>
```
Redes sociais usam isso para evitar reflow ao renderizar o preview.

### S5. Fontes críticas sem `preload` 🟢
`index.html:50-52` — apenas `preconnect` para Google Fonts. Inter e Fraunces são as fontes above-the-fold; adicionar `rel="preload"` para o subset crítico melhora FCP/LCP.

---

## ⚡ Performance

### P1. 5 famílias de fontes carregadas para visitante real 🟡
`index.html:52` — `Instrument Serif` e `DM Serif Display` só são usadas se o usuário muda o tweak `displayFont`. Para 100% dos visitantes reais (sem `?edit=1`), essas duas fontes são peso morto (~20-40KB extras).
- Carregar Instrument Serif e DM Serif Display só quando `?edit=1` (via JS), ou remover do link padrão.

### P2. Imagens sem `width` e `height` — CLS 🟡
Todos os `<img>` nos componentes (`Nav`, `Footer`, skeleton) omitem `width` e `height`. Sem essas dimensões, o browser não reserva espaço e ocorre layout shift (piora o CLS, métrica do Core Web Vitals).
- `components.jsx:94` — logo na nav: `width="120" height="26"` (ajustar ao tamanho real).
- `components.jsx:632` — logo no footer: `width="120" height="28"`.
- `index.html:63` — skeleton: já tem `height="26"`, adicionar `width`.

### P3. Footer logo sem `loading="lazy"` 🟢
O logo no footer está abaixo do fold. Adicionar `loading="lazy"` para não competir com recursos críticos no load inicial.

### P4. React CDN sem Subresource Integrity (SRI) 🟢
`index.html:68-69` — scripts do unpkg sem atributo `integrity`. Se o CDN for comprometido, JS malicioso pode ser injetado sem detecção.
- Gerar hashes SHA-384 dos arquivos e adicionar `integrity="sha384-..."` + `crossorigin="anonymous"`.

---

## ♿ Acessibilidade

### A1. Nav drawer com `role="dialog"` sem focus trap 🟡
`components.jsx:120` — `role="dialog"` implica que o foco deve ficar preso dentro do drawer enquanto aberto. Atualmente não há focus trap; usuário de teclado pode Tab para fora do drawer sem fechar.
- Implementar focus trap (primeiro/último elemento focável do drawer em loop) ou mudar para `role="navigation"` que não exige trap.

### A2. Dois `<h2>` no mesmo `<section>` do FAQ 🟡
`components.jsx:542-550` — o FAQ renderiza um `<h2>` visível ("Perguntas que todo mundo faz") e um `<h2 id="faq-title" className="visually-hidden">`. Dois h2 no mesmo section confunde a hierarquia para leitores de tela.
- Mudar o visually-hidden para `<span id="faq-title">` — o `role="region"` ainda pode usar `aria-labelledby` com qualquer elemento.

### A3. "Política de privacidade · Termos" sem link 🟢
`components.jsx:661` — texto no footer sem `href`. Se são links futuros, usar `<a href="#">` com aviso ou remover. Se são só texto decorativo, ok, mas pode confundir SR.

### A4. `bvisual-team__people` usa `Array.from` anônimo sem aria 🟢
`components.jsx:311-313` — os 4 avatares coloridos renderizam `<div>` sem texto ou `aria-label`. Como estão dentro de um `bcard` com `aria-hidden` implícito na visual, não é grave, mas adicionar `aria-hidden="true"` na div pai `.bvisual-team__people` é mais explícito.

---

## 💡 UX / Conversão

### U1. Mobile menu sem overlay de fundo 🟡
O drawer de navegação abre mas não há backdrop que o usuário possa clicar para fechar. Usuário móvel que abre o menu e quer fechar precisa clicar no hamburguer — comportamento não óbvio.
- Adicionar `div.nav__overlay` atrás do drawer com `onClick={close}`.

### U2. FAQ começa com primeiro item aberto 🟢
`components.jsx:537` — `useState(0)` abre o item 0 ("Quanto custa um site?") por padrão. Se é intencional para engajamento, ok. Mas o padrão de FAQ é começar todos fechados (`useState(-1)`).

### U3. ExitPopup: input sem `inputmode` 🟢
`components.jsx:776` — `type="tel"` funciona, mas `inputmode="tel"` garante o teclado numérico em todos os dispositivos móveis modernos.

### U4. FloatingCTA aparece após 6 segundos sem condição de scroll 🟢
`components.jsx:673` — bubble aparece após 6s independente de o usuário ter rolado ou lido algo. Considerar disparar só após scroll de 30%+ da página (mais qualificado).

---

## 📝 Qualidade de Código

### Q1. `useReveal()` chamado inline no JSX 🟢
`components.jsx:337,414,433` — `ref={useReveal()}` dentro do `return` dos componentes `Benefits` e `Services`. Tecnicamente funciona (a ordem de chamada é mantida), mas é inconsistente com o componente `<Reveal>` criado exatamente para evitar esse padrão. Converter os headings para `<Reveal>`.

### Q2. Inline styles extensos no `BVisual` 🟢
`components.jsx:308-326` — os visuals `scale` e `team` usam `style={{ ... }}` com gradientes, bordas e layouts hardcoded. Mover para classes CSS em `styles.css` para manutenibilidade.

### Q3. `TweakSection hint` prop silenciosamente ignorada 🟢
`app.jsx:82` passa `hint="Cada cidade gera..."` mas `TweakSection` não a renderiza. Remover a prop.

---

## Histórico

- **2026-04-29**
  - Código morto (M1–M5): removidos ~210 linhas de CSS morto (`styles.css` + `hero-light.css`) e 4 ícones sem uso (`icons.jsx`). Build passa sem erro.
  - Deploy Vercel: criado `vercel.json` com `buildCommand` e `outputDirectory: "."` — corrige Vercel servindo `dist/` em vez da raiz.
  - B1/Q3: `TweakSection title=` → `label=`, `hint=` removido (`app.jsx`).
  - B2: Footer WhatsApp usa `ARTYNC_CONTACT.whatsappUrl()`; LinkedIn removido (sem URL real).
  - B3: Skip link movido para antes da `<Nav>` — primeiro foco de teclado correto.
  - B5: `alert()` no ExitPopup substituído por estado `formError` inline.
  - B6: Menção a `next/image` removida do copy de benefício (`data.js`).
  - B7: Links de Serviços no footer apontam para `#servicos`.
  - B8: `"Söhne (sans)"` removido do `FONT_STACKS` — fonte não carregada.
  - S2: FAQPage JSON-LD expandido de 3 para 6 perguntas (`index.html`).
  - S3: `aggregateRating` sem fonte verificável removido; substituído por `priceRange`.
  - S4: `og:image:width`, `og:image:height`, `og:image:type` adicionados.
