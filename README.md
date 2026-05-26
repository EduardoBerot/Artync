# Artync - Site Institucional

Landing page institucional da **Artync**, focada em conversao e SEO regional para empresas do **Vale do Taquari** e **Vale do Rio Pardo**.

O site e estatico, usa React via CDN e carrega os arquivos JavaScript pre-compilados em `dist/`. A cidade ativa pode ser ajustada pelo painel de tweaks em `?edit=1`.

## Stack

- HTML estatico servido como SPA
- React 18.3.1 + ReactDOM via CDN
- JSX pre-compilado por `esbuild`
- CSS puro com design tokens em `css/styles.css`
- Google Analytics e Schema.org/JSON-LD

## Estrutura

```txt
Artync/
├── index.html
├── package.json
├── README.md
├── scripts/
│   └── build.mjs
├── .claude/
│   ├── CLAUDE.md
│   └── AGENTS.md
├── docs/
│   └── politica-de-privacidade-kontrol.html
├── assets/
├── css/
├── js/
└── dist/
```

## Desenvolvimento

Edite os arquivos fonte em `js/` e gere os artefatos em `dist/`:

```bash
npm install
npm run build
npm run serve
```

Depois acesse `http://localhost:8000`.

Para modo de edicao visual, use `http://localhost:8000/?edit=1`.
Para impressao/PDF A4, use `http://localhost:8000/?print=1`.

## Documentos publicos

- `docs/politica-de-privacidade-kontrol.html`: politica de privacidade publica do app Kontrol.

## Contexto para IA

- `.claude/CLAUDE.md`: contexto tecnico para sessoes com Claude.
- `.claude/AGENTS.md`: contexto tecnico para agentes como Codex.

Esses arquivos ficam em `.claude/` para nao misturar contexto interno com documentacao publica do site.

## Licenca

Projeto proprietario. Todos os direitos reservados.
