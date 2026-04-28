# Site Artync — Contexto do Projeto

Landing page institucional da **Artync** (desenvolvimento web) com foco em SEO regional para o Vale do Taquari e Vale do Rio Pardo (RS). Cidade ativa configurável via painel de tweaks; cada cidade renderiza copy/headline próprios.

## Stack

- **HTML estático** servido como SPA — sem build, sem bundler, sem `package.json`.
- **React 18.3.1** + **ReactDOM** carregados via CDN (unpkg).
- **Babel Standalone 7.29.0** compila JSX no navegador (`type="text/babel"`).
- **CSS puro** com design tokens via CSS variables (`:root` em `css/styles.css`).
- **Google Fonts**: Inter, Fraunces, Instrument Serif, DM Serif Display, JetBrains Mono.
- **Google Analytics** já integrado (commit `1b0b23c`).

> Observação: `data.js` menciona "Next.js 14" no copy de marketing, mas o site **não** usa Next.js — é HTML estático com React via CDN.

## Estrutura de pastas

```
Site Artync/
├── index.html              # Entry point principal
├── index-print.html        # Versão para impressão A4 (auto window.print)
├── README.md               # Visão geral pública do projeto
├── CLAUDE.md               # Este arquivo
├── assets/                 # Imagens e logos
│   ├── artync-logo.png
│   └── Logo Artync Nova.png
├── css/
│   ├── styles.css          # Tokens, reset, layout, componentes globais
│   ├── services.css        # Estilos da seção Services
│   └── hero-light.css      # Variante "light" do hero
└── js/
    ├── data.js             # window.ARTYNC_CITIES, BENEFITS, STEPS, TESTIMONIALS, FAQ
    ├── icons.jsx           # window.Icon — set de ícones SVG inline
    ├── tweaks-panel.jsx    # useTweaks + TweaksPanel + controles (Slider, Toggle, etc.)
    ├── components.jsx      # window.ArtyncSite — Nav, Hero, Benefits, Services, FAQ, etc.
    ├── app.jsx             # <App/> raiz, monta tudo via ReactDOM.createRoot
    └── utils.jsx           # ⚠️ ÓRFÃO — não carregado pelo index.html (ver "Pendências")
```

## Ordem de carregamento (crítica)

`index.html` carrega scripts nesta ordem — qualquer mudança quebra o site:

1. React + ReactDOM (CDN)
2. Babel Standalone (CDN)
3. `js/data.js` — popula `window.ARTYNC_*`
4. `js/icons.jsx` — define `window.Icon`
5. `js/tweaks-panel.jsx` — define `useTweaks`, `TweaksPanel`, controles
6. `js/components.jsx` — define `window.ArtyncSite` (precisa de `Icon`)
7. `js/app.jsx` — usa `ArtyncSite` + `useTweaks` + `ARTYNC_CITIES`

**Não há módulos ES** — tudo se comunica via `window.*`. Ao adicionar componentes novos, expor em `window` e carregar antes de quem consome.

## Painel de Tweaks (edit mode)

`app.jsx` define `TWEAK_DEFAULTS` dentro de marcadores `/*EDITMODE-BEGIN*/...{ }.../*EDITMODE-END*/`. O host (Claude artifacts/preview) reescreve esse bloco em disco quando o usuário ajusta o painel — não remover os marcadores.

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

Não há servidor de dev. Abrir `index.html` direto no navegador funciona, mas para evitar problemas com `file://` e CORS de fontes/CDN:

```bash
# qualquer servidor estático na raiz do projeto
python -m http.server 8000
# ou
npx serve .
```

`index-print.html` dispara `window.print()` automaticamente após o React montar — usar para gerar PDF A4.

## Pendências / atenções

- **`js/utils.jsx` é órfão**: define `ScrollProgress`, `FloatingCTA`, `ExitPopup` duplicados (versões já existem em `components.jsx`). Não é referenciado por nenhum HTML. Decidir se remove ou consolida.
- Placeholders ainda em produção:
  - Telefone `+55 51 0000-0000` em `index.html` (JSON-LD `ProfessionalService`).
  - CNPJ `00.000.000/0001-00` em `js/components.jsx` (Footer).
  - E-mail `contato@artync.com.br` no Footer com `href="#"` (sem `mailto:`).
- `og:image` (referenciado pelo JSON-LD como `https://artync.com.br/og.png`) — arquivo ainda não existe em `assets/`.
- Branch atual e principal: `main`.
