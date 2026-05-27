(function(){
  function buildNav(active) {
    return `
    <nav class="nav">
      <div class="nav-inner">
        <a href="index.html" class="logo" aria-label="KI-Kandidat Home">
          <img src="assets/kiq-logo.png" class="nav-kiq-logo" alt="kiQ" width="80" height="32" />
        </a>
        <div class="nav-sep"></div>
        <div class="nav-links">
          <a href="index.html#pillars" class="${active==='product'?'active':''}">Plattform</a>
          <a href="branchen.html" class="${active==='industries'?'active':''}">Branchen</a>
          <a href="about.html" class="${active==='about'?'active':''}">Über uns</a>
          <a href="karriere.html" class="${active==='career'?'active':''}">Karriere</a>
          <a href="kontakt.html" class="${active==='contact'?'active':''}">Kontakt</a>
        </div>
        <div class="nav-sep"></div>
        <div class="nav-cta">
          <a href="kontakt.html" class="btn btn-primary btn-arrow">Demo anfragen</a>
        </div>
        <button class="nav-hamburger" aria-label="Menü öffnen" aria-expanded="false" aria-controls="mobileNav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="mobile-nav" id="mobileNav" role="dialog" aria-label="Navigation">
      <button class="mobile-nav-close" aria-label="Menü schließen">&#x2715;</button>
      <a href="index.html#pillars">Plattform</a>
      <a href="branchen.html">Branchen</a>
      <a href="about.html">Über uns</a>
      <a href="karriere.html">Karriere</a>
      <a href="kontakt.html">Kontakt</a>
      <a href="kontakt.html" class="btn btn-primary btn-arrow" style="margin-top:8px">Demo anfragen</a>
    </div>`;
  }
  function buildFooter() {
    return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <a href="index.html" class="logo" style="margin-bottom:16px">
              <img src="assets/kiq-logo.png" alt="KI-Kandidat" width="80" height="32" style="height:28px;width:auto;object-fit:contain;display:block" />
            </a>
            <p style="color:rgba(250,248,244,0.70);font-size:14px;max-width:36ch;margin:0 0 24px 0">
              Die digitale Recruiting-Agentur für den Mittelstand. Talent-Cloud, eigene Matching-KI, persönliche Beratung — in einer Plattform.
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="kontakt.html" class="btn btn-ghost" style="padding:8px 12px;font-size:12px">Demo anfragen</a>
              <a href="karriere.html" class="btn btn-ghost" style="padding:8px 12px;font-size:12px">Karriere</a>
            </div>
          </div>
          <div class="footer-col">
            <h4>Plattform</h4>
            <ul>
              <li><a href="index.html#pillars">Talent-Cloud</a></li>
              <li><a href="index.html#pillars">KI-Matching</a></li>
              <li><a href="index.html#pillars">Sellcruiting</a></li>
              <li><a href="index.html#pillars">Karriereseiten</a></li>
              <li><a href="index.html#pillars">Employer Branding</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Branchen</h4>
            <ul>
              <li><a href="branche-bau.html">Bau</a></li>
              <li><a href="branchen.html">Handwerk</a></li>
              <li><a href="branchen.html">Industrie</a></li>
              <li><a href="branchen.html">IT &amp; Tech</a></li>
              <li><a href="branchen.html">Pflege &amp; Soziales</a></li>
              <li><a href="branchen.html">Logistik</a></li>
              <li><a href="branchen.html">Alle 12 Branchen →</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Unternehmen</h4>
            <ul>
              <li><a href="about.html">Über uns</a></li>
              <li><a href="karriere.html">Karriere</a></li>
              <li><a href="kontakt.html">Kontakt</a></li>
              <li><a href="#">Presse</a></li>
              <li><a href="#">Partner</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Standorte</h4>
            <ul>
              <li><a href="#">München</a></li>
              <li><a href="#">Hamburg</a></li>
              <li><a href="#">Wien</a></li>
              <li><a href="#">Zürich</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <div>© 2026 KI-Kandidat GmbH. Alle Rechte vorbehalten.</div>
          <div style="display:flex;gap:24px">
            <a href="impressum.html">Impressum</a>
            <a href="impressum.html#datenschutz">Datenschutz</a>
            <a href="impressum.html#agb">AGB</a>
          </div>
        </div>
      </div>
    </footer>`;
  }
  window.RG = window.RG || {};
  window.RG.mountChrome = function(activeKey) {
    const navMount = document.getElementById('nav-mount');
    const footMount = document.getElementById('footer-mount');
    if (navMount) navMount.outerHTML = buildNav(activeKey);
    if (footMount) {
      footMount.outerHTML = buildFooter();
      var foot = document.querySelector('.footer');
      if (foot) {
        if ('IntersectionObserver' in window) {
          new IntersectionObserver(function(entries, obs) {
            if (entries[0].isIntersecting) { foot.classList.add('in'); obs.disconnect(); }
          }, { threshold: 0.05 }).observe(foot);
        } else {
          foot.classList.add('in');
        }
      }
    }
    const btn = document.querySelector('.nav-hamburger');
    const drawer = document.getElementById('mobileNav');
    const closeBtn = drawer && drawer.querySelector('.mobile-nav-close');
    if (btn && drawer) {
      btn.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      if (closeBtn) closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
      drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }));
    }
  };
  function initReveals() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.01, rootMargin: '0px 0px 120px 0px' });
    els.forEach(e => io.observe(e));
  }
  function applyTweaks(t) {
    const root = document.documentElement;
    if (t.accent) {
      const presets = {
        cyan:   { a: '#E8C97A', a2: '#C7A24A', soft: 'rgba(232,201,122,0.10)', glow: 'rgba(232,201,122,0.40)' },
        indigo: { a: '#6366F1', a2: '#4F46E5', soft: 'rgba(99,102,241,0.12)', glow: 'rgba(99,102,241,0.4)' },
        green:  { a: '#34D399', a2: '#10B981', soft: 'rgba(52,211,153,0.12)', glow: 'rgba(52,211,153,0.35)' },
        orange: { a: '#FB923C', a2: '#F97316', soft: 'rgba(251,146,60,0.12)', glow: 'rgba(251,146,60,0.35)' },
      };
      const p = presets[t.accent] || presets.cyan;
      root.style.setProperty('--accent', p.a);
      root.style.setProperty('--accent-2', p.a2);
      root.style.setProperty('--accent-soft', p.soft);
      root.style.setProperty('--accent-glow', p.glow);
    }
    if (t.density === 'compact') {
      root.style.setProperty('--s-9', '64px');
      root.style.setProperty('--s-10', '80px');
    } else {
      root.style.removeProperty('--s-9');
      root.style.removeProperty('--s-10');
    }
  }
  window.RG.applyTweaks = applyTweaks;
  document.addEventListener('DOMContentLoaded', () => {
    initReveals();
  });
})();