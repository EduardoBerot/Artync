# Artync — Site Institucional

Landing page da **Artync**, especializada em desenvolvimento web focado em conversão e SEO regional para empresas do **Vale do Taquari** e **Vale do Rio Pardo** (RS).

A cidade ativa é configurável em tempo real pelo painel de tweaks, e cada uma renderiza headline, copy e FAQ próprios — pensado para ranquear em buscas locais como "site Lajeado", "site Santa Cruz do Sul", etc.

## Tecnologias

- **HTML estático** — sem build, sem bundler, sem `node_modules`
- **React 18.3.1** + **ReactDOM** via CDN (unpkg)
- **Babel Standalone** — compila JSX direto no navegador
- **CSS puro** com design tokens via CSS variables
- **Google Analytics** integrado
- **Schema.org / JSON-LD** para `ProfessionalService` e `FAQPage`

## Estrutura

```
Site Artync/
├── index.html              # Entry point principal
├── index-print.html        # Versão otimizada para impressão A4
├── CLAUDE.md               # Contexto técnico para sessões com IA
├── assets/                 # Imagens e logos
├── css/
│   ├── styles.css          # Tokens, reset, layout, componentes
│   ├── services.css        # Seção de serviços
│   └── hero-light.css      # Variante "light" do hero
└── js/
    ├── data.js             # Cidades, benefícios, depoimentos, FAQ
    ├── icons.jsx           # Ícones SVG inline
    ├── tweaks-panel.jsx    # Painel de tweaks + controles
    ├── components.jsx      # Nav, Hero, Benefits, Services, FAQ, Footer...
    └── app.jsx             # Componente raiz <App/>
```

## Como rodar

Como tudo é estático, qualquer servidor HTTP local funciona:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Depois acesse `http://localhost:8000`.

> Abrir o `index.html` direto via `file://` pode bloquear o carregamento de algumas CDNs e fontes — prefira o servidor local.

## Cidades suportadas

Lajeado · Santa Cruz do Sul · Arroio do Meio · Estrela · Venâncio Aires · Teutônia · Encantado · Vera Cruz · Rio Pardo

## Funcionalidades

- Hero com SVG animado (estilo "wisp")
- Seção de benefícios com visuais customizados por card
- Timeline de processo com preenchimento progressivo no scroll
- Marquee de depoimentos
- FAQ acordeão com resposta dinâmica por cidade
- Botão flutuante de WhatsApp
- Pop-up de saída (exit intent)
- Painel de tweaks ao vivo (cor, fonte, estilo do hero, cidade ativa)
- Versão de impressão A4

## Licença

Projeto proprietário — todos os direitos reservados.
