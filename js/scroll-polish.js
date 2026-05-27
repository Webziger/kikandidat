window.addEventListener('error', function (e) {
  if (e.message === 'Script error.' && !e.filename) { e.preventDefault(); return false; }
}, true);
(function () { var orig = window.onerror; window.onerror = function (msg, src, line, col, err) { if (msg === 'Script error.' && !src) return true; return orig ? orig(msg, src, line, col, err) : false; }; })();
(function () {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  if (window.innerWidth > 900 && !reduced) {
    const dot  = document.createElement('div'); dot.id = 'kiq-cursor';
    const ring = document.createElement('div'); ring.id = 'kiq-cursor-ring';
    document.body.append(dot, ring);
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function followRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(followRing);
    })();
    document.querySelectorAll('a, button, .btn, .industry-tile, .glow-card, .pillar, .wf-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }
  const sectionLabel = document.createElement('div');
  sectionLabel.id = 'section-label';
  document.body.append(sectionLabel);
  const labeledSections = Array.from(document.querySelectorAll('section[data-screen-label]'));
  let labelTimer;
  function showLabel(text) {
    clearTimeout(labelTimer);
    sectionLabel.textContent = text;
    sectionLabel.classList.add('visible');
    labelTimer = setTimeout(() => sectionLabel.classList.remove('visible'), 2200);
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio > 0.3) {
          showLabel(e.target.dataset.screenLabel || '');
        }
      });
    }, { threshold: 0.3 });
    labeledSections.forEach(s => io.observe(s));
  }
  function initHeroSplit() {
    const h1 = document.querySelector('.hero h1.h-display');
    if (!h1 || reduced) return;
    const raw = h1.innerHTML;
    const parts = raw.split(/<br\s*\/?>/i);
    h1.innerHTML = parts.map((p, i) =>
      `<span class="hero-line" style="--hl:${0.85 + i * 0.18}s">${p}</span>`
    ).join('');
  }
  initHeroSplit();
  function splitWords(el, baseDelay) {
  }
  function onVisible(el, cb, threshold = 0.15) {
    if (!el) return;
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { cb(); io.unobserve(el); }
      });
    }, { threshold, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
  }
  function activateSplitWords(container) {  }
  document.querySelectorAll('.section-head').forEach(head => {
    head.style.opacity = '0';
    head.style.transform = 'translateY(24px)';
    head.style.transition = 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.22,1,0.36,1)';
    onVisible(head, () => {
      head.style.opacity = '1';
      head.style.transform = 'none';
      const ey = head.querySelector('.eyebrow');
      if (ey) { ey.classList.add('eyebrow-reveal'); setTimeout(() => ey.classList.add('in'), 80); }
    }, 0.08);
  });
  const testimonialsWrap = document.querySelector('.testimonials');
  if (testimonialsWrap) {
    onVisible(testimonialsWrap, () => testimonialsWrap.classList.add('in'), 0.1);
  }
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    statsBar.querySelectorAll('.stat').forEach(s => s.classList.remove('reveal'));
    onVisible(statsBar, () => statsBar.classList.add('in'), 0.1);
  }
  const compareTable = document.querySelector('.compare');
  if (compareTable) {
    onVisible(compareTable, () => compareTable.classList.add('in'), 0.1);
  }
  const faqList = document.querySelector('.faq-list');
  if (faqList) {
    onVisible(faqList, () => faqList.classList.add('in'), 0.05);
  }
  const sellCards = document.querySelectorAll('.sell-card');
  if (sellCards.length) {
    onVisible(document.querySelector('.sell-grid') || sellCards[0].parentElement, () => {
      sellCards.forEach(c => c.classList.add('in'));
    }, 0.1);
  }
  const beraterInner = document.querySelector('.berater-inner');
  if (beraterInner) {
    onVisible(beraterInner, () => beraterInner.classList.add('in'), 0.1);
  }
  const guaranteeBlock = document.querySelector('.guarantee');
  if (guaranteeBlock) {
    onVisible(guaranteeBlock, () => guaranteeBlock.classList.add('in'), 0.15);
  }
  document.querySelectorAll('.feature-panels .fp').forEach((fp, i) => {
    fp.style.transitionDelay = (i * 80) + 'ms';
    onVisible(fp, () => fp.classList.add('in'), 0.1);
  });
  ['quellen-copy', 'quellen-orbital-wrap'].forEach(cls => {
    const el = document.querySelector('.' + cls);
    if (el) onVisible(el, () => el.classList.add('in'), 0.1);
  });
  const finalCta = document.querySelector('.final-cta');
  if (finalCta) onVisible(finalCta, () => finalCta.classList.add('in'), 0.15);
  const footer = document.querySelector('.footer');
  if (footer) onVisible(footer, () => footer.classList.add('in'), 0.05);
  if (!reduced) {
    const heroBg = document.querySelector('.hero-photo-img');
    if (heroBg) {
      heroBg.classList.add('parallax-bg');
      window.addEventListener('scroll', () => {
        const p = Math.min(1, window.scrollY / (window.innerHeight * 1.2));
        heroBg.style.transform = `translateY(${p * 60}px) scale(1.06)`;
      }, { passive: true });
    }
    document.querySelectorAll('.section-photo-bg::before, .berater-bg-photo').forEach(el => {
    });
    const beraterBg = document.querySelector('.berater-bg-photo');
    if (beraterBg) {
      const updateBeraterParallax = () => {
        const rect = beraterBg.parentElement.getBoundingClientRect();
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        beraterBg.style.transform = `translateY(${(progress - 0.5) * 40}px) scale(1.06)`;
      };
      beraterBg.classList.add('parallax-bg');
      window.addEventListener('scroll', updateBeraterParallax, { passive: true });
    }
  }
  if (window.innerWidth > 900 && !reduced) {
    document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.25;
        const dy = (e.clientY - r.top - r.height / 2) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-1px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }
  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });
  document.querySelectorAll('.pillar').forEach(p => {
    p.addEventListener('mousemove', e => {
      const r = p.getBoundingClientRect();
      p.style.setProperty('--mouse-x', (e.clientX - r.left) + 'px');
      p.style.setProperty('--mouse-y', (e.clientY - r.top) + 'px');
    });
  });
  if (!reduced && window.innerWidth > 900) {
    document.querySelectorAll('.pillar-inner').forEach(inner => {
      const pillar = inner.closest('.pillar');
      if (!pillar) return;
      pillar.addEventListener('mousemove', e => {
        const r = pillar.getBoundingClientRect();
        const xPct = (e.clientX - r.left) / r.width  - 0.5;
        const yPct = (e.clientY - r.top)  / r.height - 0.5;
        inner.style.transform = `perspective(1200px) rotateY(${xPct * 4}deg) rotateX(${-yPct * 3}deg)`;
      });
      pillar.addEventListener('mouseleave', () => {
        inner.style.transform = '';
      });
    });
  }
  function updateActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    navLinks.forEach(a => {
      const href = (a.getAttribute('href') || '').split('#')[1] || '';
      a.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  function countUp(el, target, duration = 1600, format = true) {
    if (reduced) { el.textContent = format ? target.toLocaleString('de-DE') : target; return; }
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 4);
    (function tick(now) {
      const t = ease(Math.min(1, (now - start) / duration));
      const v = Math.floor(target * t);
      el.textContent = format ? v.toLocaleString('de-DE') : v;
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  if (statsBar) {
    const statEls = statsBar.querySelectorAll('[data-counter]');
    onVisible(statsBar, () => {
      statEls.forEach(el => {
        const val = parseInt(el.dataset.counter.replace(/\D/g, ''), 10);
        if (!isNaN(val)) countUp(el.querySelector('.num') || el, val);
      });
    }, 0.3);
  }
  const heroLiveCount = document.getElementById('heroLiveCount');
  if (heroLiveCount) {
    let n = 1041382;
    setInterval(() => {
      n += Math.floor(Math.random() * 3) + 1;
      heroLiveCount.textContent = n.toLocaleString('de-DE');
    }, 2100);
  }
  let lastScroll = 0;
  let marqueeSpeed = 40;
  const marqueeTracks = document.querySelectorAll('.marquee-track');
  window.addEventListener('scroll', () => {
    const dy = Math.abs(window.scrollY - lastScroll);
    lastScroll = window.scrollY;
    const target = Math.max(20, Math.min(15, 40 - dy * 0.5));
    marqueeTracks.forEach(t => {
      t.style.animationDuration = target + 's';
    });
  }, { passive: true });
  const industriesGrid = document.querySelector('.industries');
  if (industriesGrid) {
    const tiles = industriesGrid.querySelectorAll('.industry-tile');
    tiles.forEach((t, i) => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(24px)';
      t.style.transition = `opacity 0.5s ease ${i * 35}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 35}ms, border-color .5s ease, box-shadow .5s ease, transform .5s ease`;
    });
    onVisible(industriesGrid, () => {
      tiles.forEach(t => {
        t.style.opacity = '1';
        t.style.transform = '';
      });
    }, 0.05);
  }
  const wfItems = document.querySelectorAll('#wfList .wf-item');
  if (wfItems.length && !reduced) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = parseInt(e.target.dataset.step || '1', 10) - 1;
          e.target.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
        }
      });
    }, { threshold: 0.6 });
    wfItems.forEach(item => io.observe(item));
  }
  const painGrid = document.getElementById('painGrid');
  if (painGrid) {
    const cards = painGrid.querySelectorAll('.glow-card');
    cards.forEach((c, i) => {
      c.style.opacity = '0';
      c.style.transform = 'translateY(28px) scale(0.97)';
      c.style.transition = `opacity 0.6s ease ${i * 80}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, border-color 0.3s ease, transform 0.3s ease`;
    });
    onVisible(painGrid, () => {
      cards.forEach(c => {
        c.style.opacity = '1';
        c.style.transform = '';
      });
    }, 0.1);
  }
  document.querySelectorAll('.kiq-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.color = 'rgba(232,201,122,0.9)';
      node.style.textShadow = '0 0 20px rgba(232,201,122,0.4)';
    });
    node.addEventListener('mouseleave', () => {
      node.style.color = '';
      node.style.textShadow = '';
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
  window.addEventListener('resize', () => {
    updateProgress();
  });
})();