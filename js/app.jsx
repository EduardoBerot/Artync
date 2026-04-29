/* global React, ReactDOM, ArtyncSite, ARTYNC_CITIES, useTweaks, TweaksPanel, TweakSection, TweakSelect, TweakColor, TweakRadio, TweakToggle */
const { useEffect, useMemo } = React;
const { ScrollProgress, Nav, Hero, Benefits, Services, HowItWorks, FAQ, FinalCTA, Footer, FloatingCTA, ExitPopup } = window.ArtyncSite;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "city": "lajeado",
  "accent": "#6171EE",
  "heroStyle": "gradient",
  "displayFont": "Fraunces",
  "showFloatingCTA": true,
  "showExitPopup": true
}/*EDITMODE-END*/;

const FONT_STACKS = {
  "Fraunces": "'Fraunces', Georgia, serif",
  "Instrument Serif": "'Instrument Serif', Georgia, serif",
  "DM Serif Display": "'DM Serif Display', Georgia, serif",
  "Söhne (sans)": "'Söhne', 'Inter', system-ui, sans-serif",
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const cities = window.ARTYNC_CITIES;
  const city = cities[tweaks.city] || cities.lajeado;

  // Apply CSS var overrides from tweaks
  useEffect(() => {
    const r = document.documentElement.style;
    // accent — derive a soft palette from the chosen accent for headings/buttons
    r.setProperty('--indigo-500', tweaks.accent);
    // simple darken/lighten via mix-color fallback
    r.setProperty('--indigo-600', shade(tweaks.accent, -12));
    r.setProperty('--indigo-700', shade(tweaks.accent, -28));
    r.setProperty('--indigo-400', shade(tweaks.accent, 14));
    r.setProperty('--indigo-300', shade(tweaks.accent, 28));
    r.setProperty('--indigo-200', shade(tweaks.accent, 48));
    r.setProperty('--indigo-100', shade(tweaks.accent, 70));
    r.setProperty('--indigo-50', shade(tweaks.accent, 86));
    r.setProperty('--font-display', FONT_STACKS[tweaks.displayFont] || FONT_STACKS.Fraunces);
  }, [tweaks.accent, tweaks.displayFont]);

  // Hero style class on body
  useEffect(() => {
    document.body.dataset.hero = tweaks.heroStyle;
  }, [tweaks.heroStyle]);

  // Auto-print quando a URL tem ?print=1 (substitui index-print.html).
  useEffect(() => {
    if (new URLSearchParams(location.search).get('print') !== '1') return;
    let cancelled = false;
    (async () => {
      try { await document.fonts.ready; } catch {}
      if (cancelled) return;
      setTimeout(() => {
        document.querySelectorAll('.reveal, .timeline__step').forEach(el => el.classList.add('is-visible'));
        setTimeout(() => window.print(), 400);
      }, 600);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <ScrollProgress/>
      <Nav city={city}/>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <main id="conteudo">
        <Hero city={city}/>
        <Services/>
        <Benefits/>
        <HowItWorks/>
        <FAQ city={city}/>
        <FinalCTA city={city}/>
      </main>
      <Footer/>

      {tweaks.showFloatingCTA && <FloatingCTA city={city}/>}
      {tweaks.showExitPopup && <ExitPopup city={city}/>}

      <TweaksPanel title="Tweaks">
        <TweakSection title="Cidade (SEO regional)" hint="Cada cidade gera uma página independente com generateStaticParams() em produção.">
          <TweakSelect
            label="Cidade ativa"
            value={tweaks.city}
            options={Object.values(cities).map(c => ({ value: c.slug, label: `${c.name} — ${c.region}` }))}
            onChange={v => setTweak('city', v)}
          />
        </TweakSection>

        <TweakSection title="Visual">
          <TweakColor label="Cor de destaque" value={tweaks.accent} onChange={v => setTweak('accent', v)}/>
          <TweakSelect
            label="Fonte de display"
            value={tweaks.displayFont}
            options={Object.keys(FONT_STACKS).map(k => ({ value: k, label: k }))}
            onChange={v => setTweak('displayFont', v)}
          />
          <TweakRadio
            label="Estilo do hero"
            value={tweaks.heroStyle}
            options={[
              { value: 'gradient', label: 'Gradient' },
              { value: 'minimal',  label: 'Minimal' },
              { value: 'dark',     label: 'Dark' },
            ]}
            onChange={v => setTweak('heroStyle', v)}
          />
        </TweakSection>

        <TweakSection title="Conversão">
          <TweakToggle label="WhatsApp flutuante" value={tweaks.showFloatingCTA} onChange={v => setTweak('showFloatingCTA', v)}/>
          <TweakToggle label="Pop-up de saída" value={tweaks.showExitPopup} onChange={v => setTweak('showExitPopup', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// hex shade — positive = lighter, negative = darker
function shade(hex, percent) {
  const h = hex.replace('#', '');
  const num = parseInt(h.length === 3 ? h.split('').map(c => c+c).join('') : h, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  if (percent >= 0) {
    r = Math.round(r + (255 - r) * (percent / 100));
    g = Math.round(g + (255 - g) * (percent / 100));
    b = Math.round(b + (255 - b) * (percent / 100));
  } else {
    const f = 1 + percent / 100;
    r = Math.round(r * f);
    g = Math.round(g * f);
    b = Math.round(b * f);
  }
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
