# Site Artync — Contexto do Projeto

Landing page institucional da **Artync** (desenvolvimento web) com foco em SEO regional para o Vale do Taquari e Vale do Rio Pardo (RS). Cidade ativa configurável via painel de tweaks; cada cidade renderiza copy/headline próprios.

## Stack

- **HTML estático** servido como SPA — sem framework, sem bundler de runtime.
- **React 18.3.1 production** + **ReactDOM** carregados via CDN (unpkg).
- **JSX pré-compilado** por `esbuild` → `dist/*.js` minificado. Nada de Babel no navegador.
- **CSS puro** com design tokens via CSS variables (`:root` em `css/styles.css`).
- **Google Fonts**: Inter, Fraunces, Instrument Serif, DM Serif Display, JetBrains Mono.
- **Google Analytics** já integrado (commit `1b0b23c`).

## Estrutura de pastas

```
Site Artync/
├── index.html              # Entry point — carrega dist/*.js. `?print=1` dispara window.print() automaticamente.
├── package.json            # Dev dep única: esbuild (build do JSX)
├── build.mjs               # Compila js/*.jsx → dist/*.js (minificado)
├── README.md               # Visão geral pública do projeto
├── CLAUDE.md               # Este arquivo
├── assets/                 # Imagens e logos
├── css/
│   ├── styles.css          # Tokens, reset, layout, componentes globais
│   ├── services.css        # Estilos da seção Services
│   └── hero-light.css      # Variante "light" do hero
├── js/                     # ✏️ FONTE — editar aqui
│   ├── data.js             # window.ARTYNC_CITIES, BENEFITS, STEPS, FAQ, CONTACT
│   ├── icons.jsx           # window.Icon — set de ícones SVG inline
│   ├── tweaks-panel.jsx    # useTweaks + TweaksPanel + controles
│   ├── components.jsx      # window.ArtyncSite — Nav, Hero, Benefits, Services, FAQ, etc.
│   └── app.jsx             # <App/> raiz, monta tudo via ReactDOM.createRoot
└── dist/                   # 🛠️ ARTEFATO — gerado por `npm run build`, commitado
    ├── data.js             # cópia de js/data.js
    └── *.js                # JSX pré-compilado e minificado
```

> **Workflow**: edita `js/*.jsx` → roda `npm run build` (ou `npm run watch`) → commita `dist/`.
> O `dist/` fica versionado para que o site funcione em qualquer host estático sem build step no servidor.

## Ordem de carregamento (crítica)

`index.html` carrega scripts com `defer`, nesta ordem — qualquer mudança quebra o site:

1. React + ReactDOM (CDN, production min)
2. `dist/data.js` — popula `window.ARTYNC_*`
3. `dist/icons.js` — define `window.Icon`
4. `dist/tweaks-panel.js` — define `useTweaks`, `TweaksPanel`, controles
5. `dist/components.js` — define `window.ArtyncSite` (precisa de `Icon`)
6. `dist/app.js` — usa `ArtyncSite` + `useTweaks` + `ARTYNC_CITIES`

**Não há módulos ES** — tudo se comunica via `window.*`. Ao adicionar componentes novos, expor em `window`, carregar antes de quem consome, e adicionar a `JSX_FILES` em `build.mjs`.

## Painel de Tweaks (edit mode)

`js/app.jsx` define `TWEAK_DEFAULTS` dentro de marcadores `/*EDITMODE-BEGIN*/...{ }.../*EDITMODE-END*/`. O host (Claude artifacts/preview) reescreve esse bloco no **source `.jsx`** quando o usuário ajusta o painel — não remover os marcadores. Após edit, é preciso rodar `npm run build` para refletir no `dist/`.

Tweaks atuais: `city`, `accent` (cor), `heroStyle` (gradient/minimal/dark), `displayFont`, `showFloatingCTA`, `showExitPopup`.

A cor de destaque deriva uma paleta (`--indigo-50` a `--indigo-700`) via função `shade()` em `app.jsx`.

## Cidades / SEO regional

`window.ARTYNC_CITIES` em `js/data.js` define 9 cidades (Lajeado, Santa Cruz do Sul, Arroio do Meio, Estrela, Venâncio Aires, Teutônia, Encantado, Vera Cruz, Rio Pardo). Cada uma tem `slug`, `name`, `region`, `headlinePrefix`, `sub`, `population`, `nearby[]`. `Hero`, `FAQ`, `FinalCTA` e `Footer` recebem `city` por prop.

Em produção (Next.js no spec original, não implementado aqui), cada cidade vira uma rota estática via `generateStaticParams()`. No HTML atual a cidade é trocada apenas pelo painel de tweaks.

## Convenções

- **Imagens**: sempre referenciar como `assets/...` (caminho relativo ao `index.html`).
- **CSS**: tokens em `:root`; cor de destaque via `--indigo-*`; classes BEM (`bcard__title`, `timeline__step--active`).
- **Reveal on scroll**: usar o hook `useReveal()` em `components.jsx`; aplicar classe `reveal` + `reveal--delay-N`.
- **Idioma**: pt-BR em todo conteúdo, copy de marketing e comentários do usuário.
- **Sem comentários** triviais no código a não ser que expliquem o *porquê*.

## Como rodar localmente

```bash
# instalar esbuild (uma vez)
npm install

# build one-shot
npm run build

# ou build em watch (rebuild ao editar js/*)
npm run watch

# servir a raiz (em outro terminal)
npm run serve   # python -m http.server 8000
```

Abrir `index.html` direto no navegador via `file://` quebra CORS das CDNs — usar o servidor.

Para gerar PDF A4: acessar `http://localhost:8000/?print=1`. Após o React montar e fontes carregarem, `window.print()` dispara automaticamente. As regras de impressão (`@media print`) ficam em `css/styles.css` — funcionam em qualquer Ctrl+P.

## Pendências / atenções

- Placeholders ainda em produção:
  - Telefone `+55 51 0000-0000` em `index.html` (JSON-LD `ProfessionalService`).
  - CNPJ `00.000.000/0001-00` em `js/components.jsx` (Footer).
  - E-mail `contato@artync.com.br` no Footer com `href="#"` (sem `mailto:`).
- `og:image` (referenciado pelo JSON-LD como `https://artync.com.br/og.png`) — arquivo ainda não existe em `assets/`.
- Branch atual e principal: `main`.
