/* ============================================================
   KI-Kandidat — Page Polish (shared, alle Subpages)
   Scroll-Reveal · Cursor · Progress · Counter · Split-Text
   ============================================================ */
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Scroll-progress ──────────────────────────────────────── */
  const bar = document.createElement('div'); bar.id = 'scroll-progress';
  document.body.prepend(bar);
  function updateBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateBar, { passive: true });

  /* ── Custom cursor — disabled ─────────────────────────────── */

  /* ── IntersectionObserver helper ─────────────────────────── */
  function onVisible(el, cb, thr = 0.1) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { cb(); io.unobserve(el); }
    }, { threshold: thr, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
  }

  /* ── Stagger children ─────────────────────────────────────── */
  function staggerReveal(parent, selector, baseDelay = 0, step = 80) {
    if (!parent) return;
    const children = parent.querySelectorAll(selector);
    children.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(24px)';
      c.style.transition = `opacity .55s ease ${baseDelay + i * step}ms, transform .55s cubic-bezier(.22,1,.36,1) ${baseDelay + i * step}ms`;
    });
    onVisible(parent, () => {
      children.forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
    }, 0.05);
  }

  /* ── Section heads word-split ─────────────────────────────── */
  function splitHead(head) {
    head.style.opacity = '0';
    const headings = head.querySelectorAll('.h1,.h2,.h3,.h-display');
    headings.forEach(h => {
      if (h.dataset.split) return;
      h.dataset.split = '1';
      const parts = h.innerHTML.split(/(\s+|<br\s*\/?>)/i);
      let idx = 0;
      h.innerHTML = parts.map(w => {
        if (!w.trim() || /^<br/.test(w)) return w;
        return `<span class="split-parent"><span class="split-word" style="--wd:${idx++ * 60}ms">${w}</span></span>`;
      }).join('');
    });
    onVisible(head, () => {
      head.style.transition = 'opacity .01s';
      head.style.opacity = '1';
      head.querySelectorAll('.split-word').forEach(w => w.classList.add('in'));
      const ey = head.querySelector('.eyebrow');
      if (ey) { ey.classList.add('eyebrow-reveal'); setTimeout(() => ey.classList.add('in'), 40); }
    }, 0.08);
  }
  document.querySelectorAll('.section-head').forEach(splitHead);

  /* ── Reveal classes ───────────────────────────────────────── */
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    onVisible(el, () => el.classList.add('in'), 0.1);
  });

  /* ── Stats bar stagger ────────────────────────────────────── */
  const sb = document.querySelector('.stats-bar');
  if (sb) staggerReveal(sb, '.stat', 0, 90);

  /* ── Team grid stagger ────────────────────────────────────── */
  staggerReveal(document.querySelector('.team'), '.person', 0, 50);
  staggerReveal(document.querySelector('.values'), '.value', 0, 80);
  staggerReveal(document.querySelector('.locations'), '.loc', 0, 70);
  staggerReveal(document.querySelector('.why-grid'), '.why', 0, 80);
  staggerReveal(document.querySelector('.benefits'), '.benefit', 0, 50);
  staggerReveal(document.querySelector('.proc-stages'), '.ps', 0, 50);
  staggerReveal(document.querySelector('.contacts'), '.contact', 0, 80);
  staggerReveal(document.querySelector('.jobs'), '.job', 0, 40);
  staggerReveal(document.querySelector('.br-grid'), '.br-card', 0, 45);

  /* ── Timeline items ───────────────────────────────────────── */
  const tl = document.querySelector('.timeline');
  if (tl) {
    tl.querySelectorAll('.tl-item').forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-24px)';
      item.style.transition = `opacity .6s ease ${i * 100}ms, transform .6s cubic-bezier(.22,1,.36,1) ${i * 100}ms`;
    });
    onVisible(tl, () => {
      tl.querySelectorAll('.tl-item').forEach(item => { item.style.opacity = '1'; item.style.transform = 'none'; });
    }, 0.05);
  }

  /* ── Final CTA ────────────────────────────────────────────── */
  const cta = document.querySelector('.final-cta');
  if (cta) onVisible(cta, () => cta.classList.add('in'), 0.15);

  /* ── Footer ───────────────────────────────────────────────── */
  const footer = document.querySelector('.footer');
  if (footer) onVisible(footer, () => footer.classList.add('in'), 0.05);

  /* ── Magnetic buttons ─────────────────────────────────────── */
  if (window.innerWidth > 900 && !reduced) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width/2)*.22}px,${(e.clientY - r.top - r.height/2)*.22}px)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  }

  /* ── Smooth anchor scrolling ──────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const t = document.getElementById(id);
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });

})();
