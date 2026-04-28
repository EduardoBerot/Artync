// Reveal-on-scroll hook + helpers
const { useState, useEffect, useRef, useCallback } = React;

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.unobserve(el);
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ as: Tag = 'div', delay = 0, children, className = '', ...rest }) {
  const [ref, visible] = useReveal();
  const cls = `reveal ${delay ? 'reveal--delay-' + delay : ''} ${visible ? 'is-visible' : ''} ${className}`.trim();
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}

// Scroll progress bar
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setPct(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="scroll-progress">
      <div className="scroll-progress__bar" style={{ width: pct + '%' }} />
    </div>
  );
}

// Floating WhatsApp CTA
function FloatingCTA({ city }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 4000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="fab">
      {open && (
        <div className="fab__bubble">
          <button className="fab__close" onClick={() => setOpen(false)} aria-label="fechar">×</button>
          <strong>Oi, sou da Artync 👋</strong>
          Quer um orçamento rápido para {city.name}? Chama no WhatsApp.
        </div>
      )}
      <button className="fab__btn" aria-label="WhatsApp" onClick={() => alert('Abrindo WhatsApp...')}>
        <Icon.whatsapp />
      </button>
    </div>
  );
}

// Exit intent popup
function ExitPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('artync_exit_seen')) {
      setDismissed(true);
      return;
    }
    let timer;
    const onLeave = (e) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
        sessionStorage.setItem('artync_exit_seen', '1');
        document.removeEventListener('mouseleave', onLeave);
      }
    };
    document.addEventListener('mouseleave', onLeave);
    // mobile fallback: 25s
    timer = setTimeout(() => {
      if (!dismissed && !sessionStorage.getItem('artync_exit_seen')) {
        setShow(true);
        sessionStorage.setItem('artync_exit_seen', '1');
      }
    }, 25000);
    return () => {
      document.removeEventListener('mouseleave', onLeave);
      clearTimeout(timer);
    };
  }, [dismissed]);

  if (!show) return null;
  return (
    <div className="exit-overlay" onClick={() => setShow(false)}>
      <div className="exit-modal" onClick={(e) => e.stopPropagation()}>
        <button className="exit-modal__close" onClick={() => setShow(false)}><Icon.close /></button>
        <span className="exit-modal__pill">Espera aí ✋</span>
        <h3 className="exit-modal__title">Antes de sair, <em>orçamento grátis</em> em 24h.</h3>
        <p className="exit-modal__sub">Deixa seu WhatsApp e eu te mando uma proposta personalizada para o seu negócio. Sem custo, sem compromisso.</p>
        <form className="exit-modal__form" onSubmit={(e) => { e.preventDefault(); alert('Enviado!'); setShow(false); }}>
          <input className="exit-modal__input" placeholder="(51) 99999-9999" required />
          <button className="btn btn--accent" type="submit">Quero a proposta <Icon.arrow size={14} /></button>
        </form>
        <div className="exit-modal__assure">🔒 Resposta em até 24h úteis · Sem spam, sem cadastro.</div>
      </div>
    </div>
  );
}

window.useReveal = useReveal;
window.Reveal = Reveal;
window.ScrollProgress = ScrollProgress;
window.FloatingCTA = FloatingCTA;
window.ExitPopup = ExitPopup;
