/* Kontrol LP — interações (sem dependências) */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav: fundo ao rolar ---------- */
  const nav = document.getElementById("nav");
  const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Contadores animados ---------- */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const animateCount = (el) => {
    const to = parseInt(el.dataset.to, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(easeOut(p) * to);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animateCount(e.target);
          countObserver.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll(".count").forEach((el) => {
    if (reduceMotion) el.textContent = el.dataset.to;
    else countObserver.observe(el);
  });

  /* ---------- Tilt 3D do celular (mouse + scroll) ---------- */
  const stage = document.getElementById("phoneStage");
  const tilt = document.getElementById("phoneTilt");
  if (stage && tilt && !reduceMotion && matchMedia("(pointer: fine)").matches) {
    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let raf = null;

    const loop = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      tilt.style.transform = `rotateX(${curY}deg) rotateY(${curX}deg)`;
      if (Math.abs(targetX - curX) > 0.01 || Math.abs(targetY - curY) > 0.01) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

    window.addEventListener(
      "mousemove",
      (e) => {
        const r = stage.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        targetX = ((e.clientX - cx) / innerWidth) * 22;
        targetY = (-(e.clientY - cy) / innerHeight) * 14;
        kick();
      },
      { passive: true }
    );

  }

  /* ---------- Hero pinned: scroll dirige texto → celular ----------
     O hero tem 340svh; a parte visível fica presa (sticky) enquanto o
     progresso do scroll anima: 0–30% texto sai, 25–70% celular sobe e
     satélites aparecem. De 70–100% tudo fica renderizado e parado
     (hold) — só então o documento volta a rolar normalmente. */
  const heroWrap = document.querySelector(".hero");
  const heroContent = document.getElementById("heroContent");
  const heroStage = document.getElementById("phoneStage");
  const scrollHint = document.getElementById("scrollHint");
  if (reduceMotion) {
    document.body.classList.add("no-pin");
  } else if (heroWrap && heroContent && heroStage) {
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    let pinTicking = false;

    const updateHero = () => {
      pinTicking = false;
      const range = heroWrap.offsetHeight - innerHeight;
      const p = range > 0 ? clamp01(window.scrollY / range) : 1;

      // Texto: some nos primeiros 30% do progresso
      const tp = clamp01(p / 0.3);
      heroContent.style.opacity = String(1 - tp);
      heroContent.style.transform = `translateY(${-90 * tp}px) scale(${1 - 0.06 * tp})`;
      heroContent.style.pointerEvents = tp >= 1 ? "none" : "";

      // Celular: entra de 25% a 70% (ease-out), escalado para caber na tela.
      // De 70% a 100% nada muda — hold com tudo renderizado antes de soltar.
      const pp = clamp01((p - 0.25) / 0.45);
      const ease = 1 - Math.pow(1 - pp, 3);
      // espaço útil = viewport menos a navbar (84px compensados no stage)
      const fit = Math.min(1, ((innerHeight - 84) * 0.94) / 700);
      heroStage.style.transform = `translateY(${(1 - ease) * 108}vh) scale(${fit})`;

      // Satélites: aparecem no final da subida
      heroStage.style.setProperty("--satop", String(clamp01((pp - 0.7) / 0.3)));

      if (scrollHint) scrollHint.style.opacity = String(1 - clamp01(p / 0.18));
    };

    const requestHero = () => {
      if (!pinTicking) {
        pinTicking = true;
        requestAnimationFrame(updateHero);
      }
    };
    window.addEventListener("scroll", requestHero, { passive: true });
    window.addEventListener("resize", requestHero, { passive: true });
    updateHero();
  }

  /* ---------- Spotlight nos bento cards ---------- */
  document.querySelectorAll(".bento-card").forEach((card) => {
    card.addEventListener(
      "mousemove",
      (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      },
      { passive: true }
    );
  });
})();
