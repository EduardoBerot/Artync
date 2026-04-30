/* global React, Icon */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ---------------------------------------
// Reveal-on-scroll hook
// ---------------------------------------
function useReveal(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          if (options.once !== false) io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12, ...options });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// ---------------------------------------
// Scroll Progress Bar
// ---------------------------------------
function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        setW(Math.min(100, Math.max(0, pct)));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" style={{ width: `${w}%` }} />
    </div>
  );
}

// ---------------------------------------
// Nav
// ---------------------------------------
function Nav({ city }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} aria-label="Principal">
        <div className="nav__inner">
          <a href="#top" className="nav__logo" onClick={close}>
            <img src="assets/artync-logo.png" alt="Artync" />
          </a>
          <div className="nav__links">
            <a href="#servicos">Serviços</a>
            <a href="#beneficios">Benefícios</a>
            <a href="#processo">Processo</a>
            <a href="#faq">Dúvidas</a>
          </div>
          <div className="nav__cta">
            <a href="#contato" className="btn btn--accent btn--pulse nav__cta-btn" style={{ padding: '10px 18px', fontSize: 13 }}>
              Solicitar orçamento
            </a>
            <button
              className={`nav__hamburger${open ? ' nav__hamburger--open' : ''}`}
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
              aria-controls="nav-drawer"
              onClick={() => setOpen(o => !o)}
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="nav__drawer" id="nav-drawer" role="dialog" aria-label="Menu de navegação">
          <a href="#servicos"  onClick={close}>Serviços</a>
          <a href="#beneficios" onClick={close}>Benefícios</a>
          <a href="#processo"  onClick={close}>Processo</a>
          <a href="#faq"       onClick={close}>Dúvidas</a>
          <a href="#contato" className="btn btn--accent" onClick={close} style={{ marginTop: 8, justifyContent: 'center' }}>
            Solicitar orçamento
          </a>
        </div>
      )}
    </header>
  );
}

// ---------------------------------------
// Hero
// ---------------------------------------
function Hero({ city }) {
  return (
    <section className="hero hero--light" id="top">
      <div className="hero__bg-light" />
      <div className="hero__noise-light" />

      {/* Flowing wisp/ribbon — Protocol-inspired keystone visual */}
      <svg className="hero__wisp" viewBox="0 0 1200 800" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="wispCore" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="rgba(123,141,247,0)"/>
            <stop offset="40%" stopColor="rgba(155,170,255,.45)"/>
            <stop offset="65%" stopColor="rgba(195,205,255,.7)"/>
            <stop offset="100%" stopColor="rgba(123,141,247,0)"/>
          </linearGradient>
          <linearGradient id="wispEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
            <stop offset="50%" stopColor="rgba(255,255,255,.85)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </linearGradient>
          <linearGradient id="wispWarm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(190,200,255,0)"/>
            <stop offset="60%" stopColor="rgba(140,160,255,.35)"/>
            <stop offset="100%" stopColor="rgba(140,160,255,0)"/>
          </linearGradient>
          <radialGradient id="wispGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(190,200,255,.55)"/>
            <stop offset="100%" stopColor="rgba(190,200,255,0)"/>
          </radialGradient>
          <filter id="wispBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.4"/>
          </filter>
        </defs>

        {/* soft glow halo */}
        <ellipse cx="780" cy="400" rx="420" ry="240" fill="url(#wispGlow)"/>

        {/* fine threads — pre-computed static paths (no runtime iteration) */}
        <g filter="url(#wispBlur)" opacity=".95" stroke="url(#wispCore)" strokeWidth="1" fill="none">
          <path opacity=".46" d="M -50 284 Q 350 200 700 326 T 1300 476"/>
          <path opacity=".46" d="M -50 287.6 Q 350 206 700 331.4 T 1300 478.4"/>
          <path opacity=".46" d="M -50 291.2 Q 350 212 700 336.8 T 1300 480.8"/>
          <path opacity=".46" d="M -50 294.8 Q 350 218 700 342.2 T 1300 483.2"/>
          <path opacity=".46" d="M -50 298.4 Q 350 224 700 347.6 T 1300 485.6"/>
          <path opacity=".46" d="M -50 302 Q 350 230 700 353 T 1300 488"/>
          <path opacity=".46" d="M -50 305.6 Q 350 236 700 358.4 T 1300 490.4"/>
          <path opacity=".46" d="M -50 309.2 Q 350 242 700 363.8 T 1300 492.8"/>
          <path opacity=".73" d="M -50 312.8 Q 350 248 700 369.2 T 1300 495.2"/>
          <path opacity=".73" d="M -50 316.4 Q 350 254 700 374.6 T 1300 497.6"/>
          <path opacity=".73" d="M -50 320 Q 350 260 700 380 T 1300 500"/>
          <path opacity=".73" d="M -50 323.6 Q 350 266 700 385.4 T 1300 502.4"/>
          <path opacity=".73" d="M -50 327.2 Q 350 272 700 390.8 T 1300 504.8"/>
          <path opacity=".73" d="M -50 330.8 Q 350 278 700 396.2 T 1300 507.2"/>
          <path opacity=".73" d="M -50 334.4 Q 350 284 700 401.6 T 1300 509.6"/>
          <path opacity=".46" d="M -50 338 Q 350 290 700 407 T 1300 512"/>
          <path opacity=".46" d="M -50 341.6 Q 350 296 700 412.4 T 1300 514.4"/>
          <path opacity=".46" d="M -50 345.2 Q 350 302 700 417.8 T 1300 516.8"/>
          <path opacity=".46" d="M -50 348.8 Q 350 308 700 423.2 T 1300 519.2"/>
          <path opacity=".46" d="M -50 352.4 Q 350 314 700 428.6 T 1300 521.6"/>
          <path opacity=".46" d="M -50 356 Q 350 320 700 434 T 1300 524"/>
          <path opacity=".46" d="M -50 359.6 Q 350 326 700 439.4 T 1300 526.4"/>
        </g>

        {/* highlight bright thread */}
        <path d="M -50 360 Q 350 290 700 410 T 1300 520" stroke="url(#wispEdge)" strokeWidth="1.4" fill="none" opacity=".9"/>
        <path d="M -50 380 Q 350 310 700 430 T 1300 540" stroke="url(#wispEdge)" strokeWidth="1" fill="none" opacity=".7"/>

        {/* outer wider wash */}
        <path d="M -100 200 Q 400 100 800 320 T 1400 580" stroke="url(#wispWarm)" strokeWidth="120" fill="none" opacity=".5"/>
        <path d="M -100 540 Q 400 460 800 580 T 1400 680" stroke="url(#wispWarm)" strokeWidth="80" fill="none" opacity=".35"/>

        {/* sparkles */}
        <g fill="#fff" opacity=".9">
          <circle cx="640" cy="220" r="1.4"/>
          <circle cx="900" cy="350" r="1.2"/>
          <circle cx="420" cy="500" r="1"/>
          <circle cx="1080" cy="180" r="1.2"/>
        </g>
      </svg>

      <div className="hero__inner">
        <h1 className="hero__title--light">
          Sites que <em>vendem.</em><br/>
          Não que só existem.
        </h1>

        <p className="hero__sub--light">
          {city.sub} Desenvolvimento web focado em conversão, performance e SEO local — para o seu negócio aparecer onde o cliente procura.
        </p>

        <div className="hero__ctas">
          <a href="#contato" className="btn btn--accent btn--pulse">
            Quero meu orçamento <Icon.arrow size={15}/>
          </a>
          <a href="#processo" className="btn btn--ghost">
            Como funciona
          </a>
        </div>
      </div>

      <a href="#servicos" className="hero__scroll hero__scroll--light">
        <span>Role para descobrir</span>
        <span className="hero__scroll-line"/>
      </a>
    </section>
  );
}

// ---------------------------------------
// Reveal wrapper component (avoids useReveal() in .map())
// ---------------------------------------
function Reveal({ children, className, delay }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className || ''}${delay ? ` reveal--delay-${delay}` : ''}`}>
      {children}
    </div>
  );
}

// ---------------------------------------
// Benefits
// ---------------------------------------
function BVisual({ kind }) {
  if (kind === 'flow') {
    return (
      <div className="bvisual-flow">
        <div className="bvisual-flow__node">VOCÊ</div>
        <div className="bvisual-flow__line"/>
        <div className="bvisual-flow__node bvisual-flow__node--center">
          <Icon.spark size={18}/>
        </div>
        <div className="bvisual-flow__line"/>
        <div className="bvisual-flow__node">GOOGLE</div>
      </div>
    );
  }
  if (kind === 'slider') {
    return (
      <div className="bvisual-slider">
        <div className="bvisual-slider__track">
          <div className="bvisual-slider__pill">0,8s</div>
          <div className="bvisual-slider__thumb"/>
        </div>
      </div>
    );
  }
  if (kind === 'bars') {
    return (
      <div className="bvisual-bars">
        <div className="bvisual-bars__bar" style={{ height: '40%' }}/>
        <div className="bvisual-bars__bar" style={{ height: '60%' }}/>
        <div className="bvisual-bars__bar" style={{ height: '85%' }}>
          <div className="bvisual-bars__label">+312%</div>
        </div>
      </div>
    );
  }
  if (kind === 'api') {
    return (
      <div className="bvisual-api">
        <div className="bvisual-api__row"><span className="bvisual-api__verb">CRM</span> <span style={{ color: '#9AA3B2' }}>lead.create</span></div>
        <div className="bvisual-api__row bvisual-api__row--active"><span className="bvisual-api__verb bvisual-api__verb--active">WPP</span> <span>contato direto</span></div>
        <div className="bvisual-api__row"><span className="bvisual-api__verb">ADS</span> <span style={{ color: '#9AA3B2' }}>conversion</span></div>
      </div>
    );
  }
  if (kind === 'team') {
    return (
      <div className="bvisual-team">
        <div className="bvisual-team__hub">
          <img src="assets/artync-icon.png" alt="" style={{ width: '70%', height: 'auto', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', filter: 'brightness(0) invert(1)' }}/>
        </div>
        <div className="bvisual-team__people">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ background: ['linear-gradient(135deg, #C9CFF6, #6171EE)', 'linear-gradient(135deg, #FBBF24, #F59E0B)', 'linear-gradient(135deg, #34D399, #059669)', 'linear-gradient(135deg, #F472B6, #BE185D)'][i] }}/>
          ))}
        </div>
      </div>
    );
  }
  if (kind === 'scale') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#fff', border: '1px solid #DDE3FF', display: 'flex', alignItems:'center', justifyContent:'center', fontSize: 11, fontWeight: 700, color: '#3A41AE' }}>v1</div>
        <Icon.arrow size={14}/>
        <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, #7C8DF7, #3A41AE)', display: 'flex', alignItems:'center', justifyContent:'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>v2</div>
        <Icon.arrow size={14}/>
        <div style={{ width: 72, height: 72, borderRadius: 12, background: 'linear-gradient(135deg, #4B55D6, #1A1F4E)', display: 'flex', alignItems:'center', justifyContent:'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>v3</div>
      </div>
    );
  }
  return null;
}

function Benefits() {
  const benefits = window.ARTYNC_BENEFITS;
  return (
    <section className="section" id="beneficios">
      <div className="section__inner">
        <div ref={useReveal()} className="reveal">
          <span className="section__eyebrow">Benefícios</span>
          <h2 className="section__title">Tudo que um site profissional <em>precisa ter</em>.</h2>
          <p className="section__lede">
            Não vendemos "site bonito". Vendemos um ativo digital que ranqueia, carrega rápido e transforma visitante em cliente. Cada item abaixo já vem incluso.
          </p>
        </div>
        <div className="benefits">
          {benefits.map((b, i) => (
            <Reveal key={i} delay={(i % 3) + 1}>
              <article className="bcard">
                <div className="bcard__visual">
                  <BVisual kind={b.visual}/>
                  <div className="bcard__shimmer"/>
                </div>
                <h3 className="bcard__title">{b.title}</h3>
                <p className="bcard__body">{b.body}</p>
                <div className="bcard__glow"/>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------
// Services
// ---------------------------------------
const SERVICES = [
  {
    title: "Landing Pages",
    body: "Páginas focadas em conversão para transformar visitantes em clientes.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M3 9h18"/><path d="M8 14h6"/><path d="M8 17h4"/>
      </svg>
    ),
  },
  {
    title: "Sites Institucionais",
    body: "Presença profissional para fortalecer sua marca e gerar confiança.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/>
        <path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M11 21v-4h2v4"/>
      </svg>
    ),
  },
  {
    title: "E-commerce",
    body: "Lojas virtuais rápidas e otimizadas para vender todos os dias.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/>
        <circle cx="9" cy="20" r="1.6"/><circle cx="17" cy="20" r="1.6"/>
      </svg>
    ),
  },
  {
    title: "Sistemas Personalizados",
    body: "Soluções sob medida para automatizar e escalar seu negócio.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/>
        <path d="M12 11l8-4.5"/><path d="M12 11L4 6.5"/><path d="M12 11v9"/>
      </svg>
    ),
  },
];

function Services() {
  return (
    <section className="section" id="servicos">
      <div className="section__inner">
        <div ref={useReveal()} className="reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <span className="section__eyebrow">Serviços</span>
          <h2 className="section__title" style={{ margin: '0 auto 18px' }}>Tudo que seu negócio precisa para <em>crescer online</em>.</h2>
          <p className="section__lede" style={{ margin: '0 auto 56px' }}>
            Escolha o formato certo para o momento da sua empresa — ou combine vários em um projeto único.
          </p>
        </div>
        <div className="services">
          {SERVICES.map((s, i) => (
            <Reveal key={i} delay={(i % 4) + 1}>
              <article className="scard">
                <div className="scard__icon">{s.icon}</div>
                <h3 className="scard__title">{s.title}</h3>
                <p className="scard__body">{s.body}</p>
                <div className="scard__glow"/>
              </article>
            </Reveal>
          ))}
        </div>
        <div ref={useReveal()} className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
          <a href="#contato" className="btn btn--accent btn--pulse">
            Solicitar Orçamento <Icon.arrow size={15}/>
          </a>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------
// How it works
// ---------------------------------------
function HowItWorks() {
  const steps = window.ARTYNC_STEPS;
  const railRef = useRef(null);
  const stepRefs = useRef([]);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const start = rect.top;
      // 0% when section top hits 70% viewport, 100% when bottom hits 40% viewport
      const progress = Math.min(1, Math.max(0, (vh * 0.7 - start) / (total + vh * 0.3)));
      setFillPct(progress * 100);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      });
    }, { threshold: 0.3 });
    stepRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section section--tinted" id="processo">
      <div className="section__inner">
        <div ref={useReveal()} className="reveal">
          <span className="section__eyebrow">Como funciona</span>
          <h2 className="section__title">Do briefing ao Google em <em>4 passos</em>.</h2>
          <p className="section__lede">
            Processo enxuto, sem reuniões intermináveis. Você sabe exatamente em que etapa estamos, com prazos firmes e checkpoints claros.
          </p>
        </div>

        <div className="timeline" ref={railRef}>
          <div className="timeline__rail">
            <div className="timeline__rail-line">
              <div className="timeline__rail-fill" style={{ height: `${fillPct}%` }}/>
            </div>
          </div>
          <div>
            {steps.map((s, i) => (
              <div key={i} ref={el => stepRefs.current[i] = el} className="timeline__step" style={{ gridTemplateColumns: 'unset' }}>
                <div className="timeline__node">{s.n}</div>
                <div className="timeline__body">
                  <h3 className="timeline__title">{s.title}</h3>
                  <p className="timeline__desc">{s.desc}</p>
                  <div className="timeline__chips">
                    {s.chips.map((c, j) => <span key={j} className="timeline__chip">{c}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------
// FAQ
// ---------------------------------------
function FAQ({ city }) {
  const baseFaq = window.ARTYNC_FAQ;
  // inject city-specific answer for "atendem minha cidade"
  const faq = baseFaq.map(f => {
    if (f.q.includes("Vocês atendem")) {
      return { ...f, a: `Sim — ${city.name} está dentro da nossa área de atendimento principal (${city.region}). Atendo presencialmente toda a região e também 100% online. Cidades vizinhas como ${city.nearby.join(', ')} também são atendidas com a mesma proximidade.` };
    }
    return f;
  });
  const [open, setOpen] = useState(0);
  const refs = useRef([]);
  return (
    <section className="section" id="faq">
      <div className="section__inner">
        <div ref={useReveal()} className="reveal" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <span className="section__eyebrow">Dúvidas frequentes</span>
          <h2 className="section__title" style={{ margin: '0 auto 18px' }}>Perguntas que <em>todo mundo faz</em>.</h2>
          <p className="section__lede" style={{ margin: '0 auto 56px' }}>
            E que merecem resposta direta antes de qualquer reunião.
          </p>
        </div>
        <div className="faq" role="region" aria-labelledby="faq-title">
          <h2 id="faq-title" className="visually-hidden">Dúvidas frequentes</h2>
          {faq.map((f, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const panelRef = el => refs.current[i] = el;
            return (
              <div key={i} className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
                <button
                  id={`faq-btn-${i}`}
                  className="faq__btn"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span>{f.q}</span>
                  <span className="faq__icon"><Icon.plus size={14}/></span>
                </button>
                <div
                  id={panelId}
                  className="faq__panel"
                  ref={panelRef}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  style={{ maxHeight: isOpen && refs.current[i] ? refs.current[i].scrollHeight + 'px' : '0px' }}
                >
                  <div className="faq__panel-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------
// Final CTA
// ---------------------------------------
function FinalCTA({ city }) {
  return (
    <section className="fcta" id="contato">
      <div className="fcta__bg"/>
      <div className="fcta__noise"/>
      <div className="fcta__inner">
        <div ref={useReveal()} className="reveal">
          <h2 className="fcta__title">
            Pronto para um site que<br/>
            <em>realmente trabalha</em> por você?
          </h2>
          <p className="fcta__sub">
            Orçamento gratuito em 24h. Conversamos pelo WhatsApp, eu entendo seu negócio em {city.name} e mando uma proposta sob medida. Sem cobrança, sem compromisso.
          </p>
          <a
            className="fcta__btn"
            href={window.ARTYNC_CONTACT.whatsappUrl(city.name)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon.whatsapp size={18}/>
            Quero meu orçamento agora
            <Icon.arrow size={16}/>
          </a>
          <div className="fcta__assure">
            <span><Icon.check size={12}/> Resposta em até 24h</span>
            <span><Icon.shield size={12}/> Sem compromisso</span>
            <span><Icon.bolt size={12}/> Atendimento direto</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------
// Footer
// ---------------------------------------
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <img src="assets/artync-logo.png" alt="Artync"/>
          <p className="footer__tag">
            Desenvolvimento web focado em conversão para empresas do Vale do Taquari e Vale do Rio Pardo.
          </p>
        </div>
        <div className="footer__col">
          <h4>Serviços</h4>
          <ul>
            <li><a href="#beneficios">Criação de sites</a></li>
            <li><a href="#beneficios">Landing pages</a></li>
            <li><a href="#beneficios">Sistemas web</a></li>
            <li><a href="#beneficios">SEO local</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Contato</h4>
          <ul>
            <li><a href="#">WhatsApp</a></li>
            <li>
              <a href="https://www.instagram.com/_artync/" target="_blank" rel="noopener noreferrer" className="footer__social">
                <Icon.instagram size={14}/> @_artync
              </a>
            </li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© 2026 Artync.</span>
        <span>Política de privacidade · Termos</span>
      </div>
    </footer>
  );
}

// ---------------------------------------
// Floating CTA
// ---------------------------------------
function FloatingCTA({ city }) {
  const [bubble, setBubble] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBubble(true), 6000);
    return () => clearTimeout(t);
  }, []);
  const href = window.ARTYNC_CONTACT.whatsappUrl(city && city.name);
  return (
    <div className="fab">
      {bubble && (
        <div className="fab__bubble">
          <button className="fab__close" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBubble(false); }} aria-label="Fechar"><Icon.close size={10}/></button>
          <strong>Olá! 👋</strong>
          Podemos te mandar um orçamento gratuito em até 24h.
        </div>
      )}
      <a className="fab__btn" aria-label="Falar no WhatsApp" href={href} target="_blank" rel="noopener noreferrer">
        <Icon.whatsapp size={28}/>
      </a>
    </div>
  );
}

// ---------------------------------------
// Exit Intent Popup
// ---------------------------------------
function ExitPopup({ city }) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const shownRef = useRef(false);

  useEffect(() => {
    if (sessionStorage.getItem('artync_exit_shown') === '1') {
      shownRef.current = true;
      return;
    }
    const trigger = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      sessionStorage.setItem('artync_exit_shown', '1');
      setOpen(true);
    };
    const isMobile = window.matchMedia('(max-width: 720px)').matches;
    let mobileTimer;
    const onMouseLeave = (e) => {
      if (e.clientY <= 0) trigger();
    };
    const onContact = () => trigger();
    window.addEventListener('open-contact', onContact);
    if (isMobile) {
      mobileTimer = setTimeout(trigger, 25000);
    } else {
      document.addEventListener('mouseleave', onMouseLeave);
    }
    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('open-contact', onContact);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  if (!open) return null;
  return (
    <div className="exit-overlay" onClick={() => setOpen(false)}>
      <div className="exit-modal" onClick={e => e.stopPropagation()}>
        <button className="exit-modal__close" onClick={() => setOpen(false)} aria-label="Fechar"><Icon.close size={14}/></button>
        {!submitted ? (
          <>
            <span className="exit-modal__pill">Espera aí · {city.name}</span>
            <h3 className="exit-modal__title">Antes de sair, que tal um <em>orçamento gratuito</em>?</h3>
            <p className="exit-modal__sub">
              Deixa o WhatsApp que a gente manda uma proposta em até 24h. Sem custo, sem compromisso e direto com a nossa equipe.
            </p>
            <form className="exit-modal__form" onSubmit={async e => {
              e.preventDefault();
              setLoading(true);
              try {
                // Envia para Formspree (substitua FORMSPREE_ID pelo seu ID real)
                const formData = {
                  phone,
                  city: city.name,
                  region: city.region,
                  source: 'exit-popup',
                  timestamp: new Date().toISOString()
                };
                const response = await fetch('https://formspree.io/f/mgorjzpn', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });
                if (response.ok) {
                  setSubmitted(true);
                  // Opcional: abrir WhatsApp após envio
                  // window.open(ARTYNC_CONTACT.whatsappUrl(city.name), '_blank');
                } else {
                  alert('Erro ao enviar. Tente novamente ou chame no WhatsApp.');
                }
              } catch (err) {
                console.error('ExitPopup submit error:', err);
                alert('Erro ao enviar. Tente novamente ou chame no WhatsApp.');
              } finally {
                setLoading(false);
              }
            }}>
              <input
                className="exit-modal__input"
                type="tel"
                placeholder="(51) 9 0000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn--accent"
                style={{ padding: '14px 22px' }}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar'} <Icon.arrow size={14}/>
              </button>
            </form>
            <p className="exit-modal__assure">
              <Icon.shield size={11}/> &nbsp;Seus dados ficam seguros. Não compartilhamos com ninguém.
            </p>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#22C55E', color: '#fff', display: 'inline-flex', alignItems:'center', justifyContent:'center', marginBottom: 16 }}>
              <Icon.check size={26}/>
            </div>
            <h3 className="exit-modal__title">Recebido! 🎉</h3>
            <p className="exit-modal__sub">Em até 24h enviamos uma proposta sob medida pelo WhatsApp.</p>
          </div>
        )}
      </div>
    </div>
  );
}

window.ArtyncSite = { ScrollProgress, Nav, Hero, Benefits, Services, HowItWorks, FAQ, FinalCTA, Footer, FloatingCTA, ExitPopup };
