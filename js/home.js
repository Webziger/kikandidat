/* Homepage interactions: counters, funnel reveal, stepper, KI bars */
(function(){
  // ===== Funnel counter animation when hero is visible =====
  function animateFunnel() {
    const stages = document.querySelectorAll('.funnel-stage');
    stages.forEach((s, i) => {
      const target = parseInt((s.querySelector('.stage-count').dataset.count || '0').replace(/\./g,''), 10);
      setTimeout(() => {
        s.classList.add('fill', 'active');
        animateNumber(s.querySelector('.stage-count'), target, 1400);
        if (i > 0) setTimeout(()=> stages[i-1].classList.remove('active'), 200);
      }, i * 350);
    });
  }
  function animateNumber(el, target, dur) {
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const v = Math.floor(target * ease(t));
      el.textContent = v.toLocaleString('de-DE');
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ===== Cloud counter ticking =====
  function startCloudCounter() {
    const v = document.getElementById('cloudV');
    const fill = document.getElementById('cloudFill');
    const grid = document.getElementById('cloudGrid');
    if (!v) return;
    let n = 1041382;
    setInterval(() => {
      n += Math.floor(Math.random() * 3) + 1;
      v.textContent = n.toLocaleString('de-DE');
    }, 1700);
    setTimeout(()=> fill.style.width = '74%', 200);

    // build grid
    if (grid && grid.children.length === 0) {
      for (let i = 0; i < 64; i++) {
        const c = document.createElement('div');
        c.className = 'cell';
        const r = Math.random();
        if (r > 0.92) c.classList.add('hot');
        else if (r > 0.78) c.classList.add('warm');
        grid.appendChild(c);
      }
      // pulse new cells
      setInterval(() => {
        const cells = grid.querySelectorAll('.cell');
        const idx = Math.floor(Math.random() * cells.length);
        cells[idx].classList.add('hot');
        setTimeout(() => cells[idx].classList.remove('hot'), 800);
      }, 600);
    }
  }

  // ===== KI bar animation =====
  function animateKiBars() {
    const fills = document.querySelectorAll('#vizKi .ki-row .f');
    fills.forEach((f, i) => {
      setTimeout(() => {
        f.style.width = (f.dataset.pct || 0) + '%';
      }, i * 180);
    });
  }

  // ===== Stepper =====
  const stepData = [
    { n:'01', meta:'PHASE 1 · KICKOFF', t:'Briefing & Suchauftrag', d:'In einem 30-min Call klären wir Ihre offene Stelle, Anforderungen, Region, Gehaltsspanne und Cultural-Fit-Kriterien. Sie geben uns das "Wonach", wir definieren das "Wie".' , kpi:[{l:'AUFWAND FÜR SIE',v:'30 Min'},{l:'PHASE-DAUER',v:'Tag 0'}]},
    { n:'02', meta:'PHASE 2 · CLOUD', t:'Talent-Cloud auslesen', d:'Unser System filtert die 1.000.000+ Fachkräfte nach Qualifikation, Region und Mobilität. Wir erhalten eine erste, große Vorauswahl der grundsätzlich passenden Profile.' , kpi:[{l:'GEPRÜFT',v:'1M+ Profile'},{l:'PHASE-DAUER',v:'< 1 h'}]},
    { n:'03', meta:'PHASE 3 · KI-SCAN', t:'100+ Signale auswerten', d:'Pro Kandidat prüft unsere KI über 100 Datenpunkte: Gehalt, Schichten, Wechselsignale, Reaktionsmuster, Bewertungen des aktuellen Arbeitgebers, Fahrzeit. So entsteht ein präzises Bild.' , kpi:[{l:'DATENPUNKTE',v:'100+'},{l:'IN ECHTZEIT',v:'Täglich'}]},
    { n:'04', meta:'PHASE 4 · MARKT', t:'Markt & Wettbewerb prüfen', d:'Wir scannen Ihre regionale Konkurrenz: neue Stellen, Bewertungen, Benefits. Wir erkennen, wo Unzufriedenheit entsteht und wo Ihr Angebot besser ist.' , kpi:[{l:'MITBEWERBER',v:'Tagesaktuell'},{l:'BEWERTUNGEN',v:'Echtzeit'}]},
    { n:'05', meta:'PHASE 5 · TRIGGER', t:'Wechselimpulse erfassen', d:'Wenn sich beim Kandidaten etwas ändert (Schichtmodell, Gehalt, Pendelzeit), reagieren wir sofort. Wir kennen den Grund hinter dem Wechsel — nicht nur die Tatsache.' , kpi:[{l:'REAKTIONSZEIT',v:'< 60 sec'},{l:'TRIGGER ARTEN',v:'12+'}]},
    { n:'06', meta:'PHASE 6 · MATCH', t:'Matching & Priorisierung', d:'Ihr Angebot wird mit jedem Profil abgeglichen. Der Algorithmus priorisiert Fachkräfte mit höchster Wechselwahrscheinlichkeit — bei denen Ihre Stärken die Schwächen des Wettbewerbs kompensieren.' , kpi:[{l:'TOP-PRIORITÄT',v:'Top 5%'},{l:'MATCH-SCORE',v:'> 85/100'}]},
    { n:'07', meta:'PHASE 7 · SELLCRUITING', t:'Persönlicher Erstkontakt', d:'Unsere Recruiter — unterstützt durch automatisierte Systeme ergänzend — sprechen jeden Top-Kandidaten persönlich an. Wir prüfen Motivation, Cultural Fit und sichern Ihr Vorstellungsgespräch.' , kpi:[{l:'PERSÖNLICH',v:'Recruiter + Automatisierung'},{l:'GESPRÄCHE/TAG',v:'~ 1.200'}]},
    { n:'08', meta:'PHASE 8 · ÜBERGABE', t:'Vorqualifizierte Kandidaten', d:'Sie erhalten ausschließlich Kandidaten, die fachlich passen, regional verfügbar sind, Ihr Angebot akzeptiert haben und ein Vorstellungsgespräch zugesagt haben. Auf Wunsch terminieren wir direkt.' , kpi:[{l:'AKZEPTIERT',v:'100%'},{l:'BEREIT',v:'Vorstellungsgespräch'}]}
  ];

  function renderStep(i) {
    const data = stepData[i];
    if (!data) return;
    const el = document.getElementById('stepContent');
    if (!el) return;
    el.innerHTML = `
      <div class="step-meta">${data.meta}</div>
      <h3 class="h3">${data.t}</h3>
      <p style="color:var(--fg-muted);line-height:1.6;max-width:60ch">${data.d}</p>
      <div style="margin-top:auto;display:flex;gap:24px;padding-top:20px;border-top:1px solid var(--line)">
        ${data.kpi.map(k => `
          <div>
            <div class="mono" style="font-size:11px;color:var(--fg-dim);letter-spacing:0.1em">${k.l}</div>
            <div style="font-family:var(--font-display);font-size:22px;font-weight:600;letter-spacing:-0.02em;margin-top:4px">${k.v}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function initStepper() {
    const list = document.getElementById('stepList');
    if (!list) return;
    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        list.querySelectorAll('li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        renderStep(parseInt(li.dataset.step,10) - 1);
      });
      li.addEventListener('mouseenter', () => {
        list.querySelectorAll('li').forEach(x => x.classList.remove('active'));
        li.classList.add('active');
        renderStep(parseInt(li.dataset.step,10) - 1);
      });
    });
    renderStep(0);
  }

  // ===== Init when in viewport =====
  function whenVisible(selector, cb) {
    const el = document.querySelector(selector);
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { cb(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(el);
  }

  // ===== KI Scoring section: live queue + match panel =====
  function initKiScoring() {
    // Animate match panel bars
    const panel = document.getElementById('matchPanelFull');
    if (!panel) return;

    // Animate match score counter
    const scoreEl = panel.querySelector('[data-count2]');
    if (scoreEl) {
      const target = parseInt(scoreEl.dataset.count2, 10);
      let start = null;
      function tickScore(ts) {
        if (!start) start = ts;
        const t = Math.min(1, (ts - start) / 1600);
        const e = 1 - Math.pow(1 - t, 3);
        scoreEl.textContent = Math.floor(target * e);
        if (t < 1) requestAnimationFrame(tickScore);
      }
      requestAnimationFrame(tickScore);
    }

    // Animate match bars
    panel.querySelectorAll('.match-row .f').forEach((f, i) => {
      setTimeout(() => {
        f.style.width = (f.dataset.mpct || 0) + '%';
      }, i * 160);
    });

    // Live scoring counter ticker
    const countEl = document.getElementById('ls-count');
    const cpsEl = document.getElementById('ls-cps');
    if (countEl) {
      let scored = 412;
      setInterval(() => {
        scored += Math.floor(Math.random() * 8 + 3);
        countEl.textContent = scored.toLocaleString('de-DE');
      }, 400);
    }
    if (cpsEl) {
      setInterval(() => {
        cpsEl.textContent = (150 + Math.floor(Math.random() * 80)).toString();
      }, 1200);
    }

    // Animate ls-row bars on scroll into view
    const queue = document.getElementById('ls-queue');
    if (queue) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            queue.querySelectorAll('.ls-row:not(.scoring)').forEach((row, i) => {
              const pct = parseInt(row.dataset.pct || '0', 10);
              setTimeout(() => {
                const bar = row.querySelector('.ls-bar-fill');
                if (bar) bar.style.width = pct + '%';
              }, i * 200);
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(queue);
    }
  }

  // ===== Reveal animation for .reveal elements =====
  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  // ===== Photo mosaic background — auto-scrolling marquee columns =====
  function buildMosaic() {
    const root = document.getElementById('mosaicCols');
    if (!root || root.children.length) return;
    const imgs = [
      '1521737604893-d14cc237f11d', '1600880292203-757bb62b4baf', '1504307651254-35680f356dfd',
      '1581092918056-0c4c3acd3789', '1518770660439-4636190af475', '1461749280684-dccba630e2f6',
      '1576091160399-112ba8d25d1d', '1587293852726-70cdb56c2866', '1486406146926-c627a92ad1ab',
      '1556761175-5973dc0f32e7', '1497032628192-86f99bcd76bc', '1560518883-ce09059eeffa',
      '1553877522-43269d4ea984', '1573497019418-b400bb3ab074', '1600880292089-90a7e086ee0c',
      '1497366858455-9c87cdf41d6f', '1521737852567-6949f3f9f2b5', '1611974789855-9c2a0a7236a3',
      '1466611653911-95081537e5b7', '1566073771259-6a8506099945', '1551836022-aadb801c60ae',
      '1497366216548-37526070297c', '1486325212027-8081e485255e', '1559136555-9303baea8ebd',
      '1557804506-669a67965ba0', '1517048676732-d65bc937f952', '1561489413-985b06da5bee',
      '1554224155-6726b3ff858f', '1497435334941-8c899ee9e8e9', '1517248135467-4c7edcad34c4',
      '1454165804606-c3d57bc86b40', '1563013544-824ae1b704d3'
    ];
    const cols = window.matchMedia('(max-width: 700px)').matches ? 3
               : window.matchMedia('(max-width: 1200px)').matches ? 4 : 6;
    const perCol = 7;
    for (let c = 0; c < cols; c++) {
      const col = document.createElement('div');
      col.className = 'mosaic-col';
      const track = document.createElement('div');
      track.className = 'mosaic-track';
      const dir = c % 2 === 0 ? 'marqueeUp' : 'marqueeDown';
      const dur = 48 + ((c * 7) % 16); // 48–64s spread per column for organic rhythm
      track.style.animation = `${dir} ${dur}s linear infinite`;
      // Build tile set TWICE — duplicate is what makes the -50% loop seamless
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < perCol; i++) {
          const idx = (c * 5 + i) % imgs.length;
          const tile = document.createElement('div');
          tile.className = 'mosaic-tile';
          const tbg = document.createElement('div');
          tbg.className = 'tile-bg';
          tbg.style.backgroundImage = `url('https://images.unsplash.com/photo-${imgs[idx]}?w=600&q=70&fit=crop&crop=center')`;
          tile.appendChild(tbg);
          track.appendChild(tile);
        }
      }
      col.appendChild(track);
      col.style.opacity = '0';
      col.style.transition = `opacity 0.9s ease ${c * 80}ms`;
      root.appendChild(col);
    }
    const section = root.closest('section');
    if (section && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        Array.from(root.children).forEach(c => { c.style.opacity = '1'; });
      }, { threshold: 0.05 });
      io.observe(section);
    }
  }

  // ===== Workflow mockup animation — Apple-look live dashboard =====
  function initWorkflow() {
    const items = document.querySelectorAll('#wfList .wf-item');
    const mainTitle = document.getElementById('wfMainTitle');
    const cloudStatus = document.getElementById('wfCloudStatus');
    const activeName = document.getElementById('wfActiveName');
    const activePct = document.getElementById('wfActivePct');
    const progressBar = document.getElementById('wfProgressBar');
    const feed = document.getElementById('wfFeed');
    const sparkLine = document.getElementById('wfSparkLine');
    const sparkArea = document.getElementById('wfSparkArea');
    if (!items.length || !activeName) return;

    const stepData = [
      { title: 'Neue Analyse', cloud: 'Suchprofil-Setup',
        active: 'Suchprofil wird erstellt', pct: 8,
        metrics: { profiles: 0, signals: 0, score: 0 },
        events: [
          { tone:'blue',  txt:'Suchauftrag empfangen',    time:'jetzt' }
        ],
        spark: [50,50,50,50,50,50,50,50,50,50,50,50] },

      { title: 'Cloud-Sync', cloud: 'Cloud laden...',
        active: 'Lade KI-Kandidat Cloud', pct: 24,
        metrics: { profiles: 12500, signals: 0, score: 0 },
        events: [
          { tone:'blue',  txt:'Cloud-Verbindung aktiv',  time:'jetzt' },
          { tone:'gold',  txt:'Suchprofil eingelesen',   time:'vor 2s' }
        ],
        spark: [50,52,55,58,60,62,64,66,68,70,72,74] },

      { title: 'Signal-Auswertung', cloud: 'KI-Scan läuft',
        active: '100+ Signale auswerten', pct: 42,
        metrics: { profiles: 29121, signals: 318, score: 71 },
        events: [
          { tone:'green', txt:'Wechselbereitschaft +18%',   time:'jetzt' },
          { tone:'gold',  txt:'318 Signal-Treffer',         time:'vor 1s' },
          { tone:'blue',  txt:'29.121 Profile gescannt',    time:'vor 4s' }
        ],
        spark: [55,58,60,62,65,68,70,72,75,78,80,82] },

      { title: 'Marktanalyse', cloud: 'Wettbewerb Scan',
        active: 'Wettbewerber beobachten', pct: 56,
        metrics: { profiles: 29121, signals: 612, score: 79 },
        events: [
          { tone:'gold',  txt:'612 Top-Profile gefiltert',  time:'jetzt' },
          { tone:'green', txt:'24 Wettbewerber tracked',    time:'vor 3s' },
          { tone:'blue',  txt:'Region · DACH erweitert',    time:'vor 7s' }
        ],
        spark: [60,62,65,68,72,75,78,80,82,84,86,87] },

      { title: 'Wechselimpulse', cloud: 'Trigger erkannt',
        active: 'Wechsel-Impulse erfassen', pct: 68,
        metrics: { profiles: 29121, signals: 612, score: 83 },
        events: [
          { tone:'green', txt:'Pendelzeit-Trigger erkannt', time:'jetzt' },
          { tone:'gold',  txt:'48 Wechsel-Signale',         time:'vor 2s' },
          { tone:'blue',  txt:'Gehaltsabweichung +12%',     time:'vor 6s' }
        ],
        spark: [65,68,70,72,75,78,80,82,84,86,88,90] },

      { title: 'Top-Kandidaten', cloud: 'Matching aktiv',
        active: 'Top-Kandidaten priorisieren', pct: 81,
        metrics: { profiles: 29121, signals: 612, score: 91 },
        events: [
          { tone:'green', txt:'Top-Match identifiziert',    time:'jetzt' },
          { tone:'gold',  txt:'22 Profile · Score > 87%',   time:'vor 2s' },
          { tone:'blue',  txt:'Cultural-Fit-Prüfung',       time:'vor 5s' }
        ],
        spark: [70,72,75,78,80,82,85,88,90,92,93,94] },

      { title: 'Sellcruiting', cloud: 'Erstkontakt läuft',
        active: 'Sellcruiting · Erstkontakt', pct: 92,
        metrics: { profiles: 29121, signals: 612, score: 94 },
        events: [
          { tone:'green', txt:'12 Gespräche terminiert',    time:'jetzt' },
          { tone:'gold',  txt:'22 Top-Kandidaten kontaktiert', time:'vor 3s' },
          { tone:'blue',  txt:'Motivations-Check läuft',    time:'vor 8s' }
        ],
        spark: [78,80,82,85,88,90,92,94,95,96,97,97] },

      { title: 'Übergabe', cloud: '✓ 7 Kandidaten bereit',
        active: '7 vorqualifizierte Profile übergeben', pct: 100,
        metrics: { profiles: 29121, signals: 612, score: 97 },
        events: [
          { tone:'green', txt:'✓ Übergabe abgeschlossen',   time:'jetzt' },
          { tone:'gold',  txt:'7 Profile · 100% qualifiziert', time:'vor 1s' },
          { tone:'blue',  txt:'Terminvorschläge inklusive', time:'vor 4s' }
        ],
        spark: [85,87,90,92,94,95,96,97,97,98,98,99] }
    ];

    // Easing-cubic tweened counter
    function tweenNumber(el, to) {
      const from = parseFloat(el.dataset.val || 0);
      if (from === to) return;
      const start = performance.now();
      const dur = 900;
      const suffix = el.dataset.suffix || '';
      function tick(now) {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const v = from + (to - from) * eased;
        el.textContent = (suffix === '%')
          ? Math.round(v) + suffix
          : Math.round(v).toLocaleString('de-DE');
        if (t < 1) requestAnimationFrame(tick);
        else el.dataset.val = to;
      }
      requestAnimationFrame(tick);
    }

    // Build sparkline SVG path strings
    function buildSparkPath(values, w = 260, h = 50, pad = 2) {
      const max = Math.max(...values), min = Math.min(...values);
      const range = max - min || 1;
      const step = (w - pad * 2) / (values.length - 1);
      let line = '';
      values.forEach((v, i) => {
        const x = pad + i * step;
        const y = pad + (h - pad * 2) * (1 - (v - min) / range);
        line += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      const area = line + ' L' + (w - pad).toFixed(1) + ' ' + (h - pad).toFixed(1) + ' L' + pad + ' ' + (h - pad).toFixed(1) + ' Z';
      return { line, area };
    }

    function setStep(i) {
      const data = stepData[i];
      if (!data) return;
      items.forEach(el => el.classList.remove('active'));
      items[i]?.classList.add('active');
      if (mainTitle) mainTitle.textContent = data.title;
      if (cloudStatus) cloudStatus.textContent = data.cloud;
      if (activeName) activeName.textContent = data.active;
      if (activePct) activePct.textContent = data.pct + '%';
      if (progressBar) progressBar.style.width = data.pct + '%';
      // metrics — tween smoothly
      document.querySelectorAll('.wf-metric').forEach(metric => {
        const key = metric.dataset.key;
        const val = metric.querySelector('.wf-metric-val');
        if (val && data.metrics[key] != null) tweenNumber(val, data.metrics[key]);
      });
      // feed — rebuild with stagger
      if (feed) {
        feed.innerHTML = '';
        data.events.forEach((e, idx) => {
          const el = document.createElement('div');
          el.className = 'wf-feed-item tone-' + e.tone;
          el.style.animationDelay = (idx * 90) + 'ms';
          el.innerHTML = '<span class="dot"></span><span class="txt">' + e.txt + '</span><span class="time">' + e.time + '</span>';
          feed.appendChild(el);
        });
      }
      // sparkline
      if (sparkLine && sparkArea) {
        const paths = buildSparkPath(data.spark);
        sparkLine.setAttribute('d', paths.line);
        sparkArea.setAttribute('d', paths.area);
      }
    }

    items.forEach((item, i) => {
      item.addEventListener('mouseenter', () => setStep(i));
      item.addEventListener('click', () => setStep(i));
    });
    setStep(2);

    // Auto-cycle when section is in view
    let autoIdx = 2;
    let autoTimer = null;
    const section = document.querySelector('.workflow-section');
    if (section) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            if (!autoTimer) {
              autoTimer = setInterval(() => {
                autoIdx = (autoIdx + 1) % stepData.length;
                setStep(autoIdx);
              }, 3500);
            }
          } else if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
          }
        });
      }, { threshold: 0.3 });
      io.observe(section);
    }
  }

  // ===== KI-Modul "AI in action" flow — canvas particles + lens flash + match chips =====
  function initKiFlow() {
    const stage  = document.getElementById('kiFlowStage');
    const canvas = document.getElementById('kiFlowCanvas');
    const orb    = document.getElementById('kiCenterOrb');
    if (!stage || !canvas || !orb) return;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const inputs  = ['kic-pool','kic-data','kic-region'].map(id => document.getElementById(id)).filter(Boolean);
    const outputs = ['kic-match','kic-wechsel','kic-contact'].map(id => document.getElementById(id)).filter(Boolean);
    if (!inputs.length || !outputs.length) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    let orbPt = { x: 0, y: 0 };
    let inputPaths = [];   // {p0,p1,p2}
    let outputPaths = [];
    let particles = [];
    let visible = false;
    let frame = 0;
    let nextEmit = inputs.map((_, i) => performance.now() + 600 + i * 700);
    const SCORES = ['92%','87%','94%','89%','96%','91%','88%','93%'];
    let scoreIdx = 0;

    function rectToStageCoords(el) {
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        cx: (r.left + r.right) / 2 - s.left,
        cy: (r.top + r.bottom) / 2 - s.top,
        right: r.right - s.left,
        left:  r.left  - s.left,
        top:   r.top   - s.top,
        bottom:r.bottom - s.top
      };
    }

    function recompute() {
      const s = stage.getBoundingClientRect();
      W = s.width; H = s.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const o = rectToStageCoords(orb);
      orbPt = { x: o.cx, y: o.cy };

      inputPaths = inputs.map(el => {
        const r = rectToStageCoords(el);
        const p0 = { x: r.right - 6, y: r.cy };
        const p2 = { x: orbPt.x,     y: orbPt.y };
        // Control point: pull toward orb, slight vertical offset
        const p1 = { x: (p0.x + p2.x) / 2 + (p2.x - p0.x) * 0.10, y: (p0.y + p2.y) / 2 - 18 };
        return { el, p0, p1, p2 };
      });
      outputPaths = outputs.map(el => {
        const r = rectToStageCoords(el);
        const p0 = { x: orbPt.x,    y: orbPt.y };
        const p2 = { x: r.left + 6, y: r.cy };
        const p1 = { x: (p0.x + p2.x) / 2 - (p2.x - p0.x) * 0.10, y: (p0.y + p2.y) / 2 - 18 };
        return { el, p0, p1, p2 };
      });
    }

    function bezierAt(p, t) {
      const u = 1 - t;
      return {
        x: u*u*p.p0.x + 2*u*t*p.p1.x + t*t*p.p2.x,
        y: u*u*p.p0.y + 2*u*t*p.p1.y + t*t*p.p2.y
      };
    }

    function emitInput(i) {
      if (particles.length >= 14) return;
      particles.push({ kind: 'in', pathIdx: i, t: 0, speed: 0.0011 + Math.random() * 0.0004, born: performance.now() });
    }
    function emitOutput(targetIdx) {
      if (particles.length >= 14) return;
      particles.push({ kind: 'out', pathIdx: targetIdx, t: 0, speed: 0.0010 + Math.random() * 0.0004, born: performance.now() });
    }

    function spawnChip(card, label) {
      const r = card.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      const chip = document.createElement('div');
      chip.className = 'ki-match-chip';
      chip.textContent = label;
      chip.style.left = ((r.left + r.right) / 2 - s.left) + 'px';
      chip.style.top  = (r.top - s.top - 8) + 'px';
      stage.appendChild(chip);
      setTimeout(() => chip.remove(), 1500);
    }

    function flashOrb() {
      orb.classList.add('scanning', 'focused');
      setTimeout(() => orb.classList.remove('scanning'), 600);
      setTimeout(() => orb.classList.remove('focused'),  500);
    }

    function drawConnections() {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(232,201,122,0.10)';
      [...inputPaths, ...outputPaths].forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.p0.x, p.p0.y);
        ctx.quadraticCurveTo(p.p1.x, p.p1.y, p.p2.x, p.p2.y);
        ctx.stroke();
      });
    }

    function drawParticle(p) {
      const path = p.kind === 'in' ? inputPaths[p.pathIdx] : outputPaths[p.pathIdx];
      if (!path) return;
      // Trail: a few prior positions
      for (let i = 0; i < 5; i++) {
        const tt = Math.max(0, p.t - i * 0.025);
        const pos = bezierAt(path, tt);
        const a = (1 - i / 5) * (p.kind === 'in' ? 0.65 : 0.75);
        ctx.beginPath();
        ctx.fillStyle = p.kind === 'in'
          ? `rgba(232,201,122,${a * 0.5})`
          : `rgba(255,200,120,${a * 0.6})`;
        ctx.arc(pos.x, pos.y, 2.2 - i * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      // Head
      const head = bezierAt(path, p.t);
      ctx.beginPath();
      ctx.fillStyle = p.kind === 'in' ? 'rgba(255,230,170,0.95)' : 'rgba(255,210,140,1)';
      ctx.shadowColor = 'rgba(232,201,122,0.9)';
      ctx.shadowBlur = 8;
      ctx.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function tick(now) {
      if (!visible) return;
      frame++;
      window.__kiFrameCount = (window.__kiFrameCount || 0) + 1;
      ctx.clearRect(0, 0, W, H);
      drawConnections();

      // Spawn inputs on per-card schedule
      for (let i = 0; i < inputs.length; i++) {
        if (now >= nextEmit[i]) {
          emitInput(i);
          nextEmit[i] = now + 1800 + Math.random() * 800;
        }
      }

      // Advance & render particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.t += p.speed * 16; // ~60fps assumption; ok for visual
        if (p.t >= 1) {
          if (p.kind === 'in') {
            flashOrb();
            // queue an output particle 500-800ms later toward a random output
            setTimeout(() => emitOutput(Math.floor(Math.random() * outputs.length)), 500 + Math.random() * 300);
          } else {
            // arrived at output card: ping + chip
            const card = outputs[p.pathIdx];
            card.classList.add('pinged');
            setTimeout(() => card.classList.remove('pinged'), 800);
            spawnChip(card, SCORES[scoreIdx++ % SCORES.length]);
          }
          particles.splice(i, 1);
          continue;
        }
        drawParticle(p);
      }
      requestAnimationFrame(tick);
    }

    recompute();
    window.addEventListener('resize', () => requestAnimationFrame(recompute), { passive: true });
    window.addEventListener('scroll', () => requestAnimationFrame(recompute), { passive: true });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          const wasVisible = visible;
          visible = e.isIntersecting;
          if (visible && !wasVisible) {
            recompute();
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.15 });
      io.observe(stage);
    } else {
      visible = true;
      requestAnimationFrame(tick);
    }
  }

  // chromaKeyKiqLogo — removed: logo is now a transparent PNG

  // ===== kiQ Constellation: nodes spread from center + lines draw progressively =====
  function initKiqConstellation() {
    const section = document.querySelector('.kiq-section');
    if (!section) return;
    const svg = section.querySelector('.kiq-svg-lines');
    if (!svg) return;
    const nodes = Array.from(section.querySelectorAll('.kiq-node'));
    if (!nodes.length) return;

    let activated = false;

    // Compute spread vectors: translate each node FROM its position TO center so it starts at center
    function setupSpread() {
      const sr = section.getBoundingClientRect();
      const cx = sr.width / 2, cy = sr.height / 2;
      nodes.forEach((n, i) => {
        const nr = n.getBoundingClientRect();
        const nx = nr.left - sr.left + nr.width / 2;
        const ny = nr.top - sr.top + nr.height / 2;
        n.style.setProperty('--spread-x', `${Math.round(cx - nx)}px`);
        n.style.setProperty('--spread-y', `${Math.round(cy - ny)}px`);
        n.style.setProperty('--node-delay', `${i * 35}ms`);
      });
    }

    function drawLines(animate) {
      const NS = 'http://www.w3.org/2000/svg';
      const sr = section.getBoundingClientRect();
      const cx = sr.width / 2, cy = sr.height / 2;
      svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      // ── Shared defs: glow filter for particles ─────────────────
      const defs = document.createElementNS(NS, 'defs');
      const filt = document.createElementNS(NS, 'filter');
      filt.id = 'kiqPGlow';
      filt.setAttribute('x', '-200%'); filt.setAttribute('y', '-200%');
      filt.setAttribute('width', '500%'); filt.setAttribute('height', '500%');
      const blur = document.createElementNS(NS, 'feGaussianBlur');
      blur.setAttribute('in', 'SourceGraphic'); blur.setAttribute('stdDeviation', '3');
      filt.appendChild(blur); defs.appendChild(filt);
      svg.appendChild(defs);

      nodes.forEach((n, i) => {
        const nr = n.getBoundingClientRect();
        const x2 = nr.left - sr.left + nr.width / 2;
        const y2 = nr.top - sr.top + nr.height / 2;
        const len = Math.hypot(x2 - cx, y2 - cy);
        const isBig = n.classList.contains('big');
        const delay = i * 35 + 150;

        // ── Per-line gold gradient: bright at center, fades to node ─
        const gradId = `kiqLg${i}`;
        const grad = document.createElementNS(NS, 'linearGradient');
        grad.id = gradId;
        grad.setAttribute('gradientUnits', 'userSpaceOnUse');
        grad.setAttribute('x1', cx); grad.setAttribute('y1', cy);
        grad.setAttribute('x2', x2); grad.setAttribute('y2', y2);
        const s1 = document.createElementNS(NS, 'stop');
        s1.setAttribute('offset', '0%');
        s1.setAttribute('stop-color', `rgba(232,201,122,${isBig ? 0.65 : 0.35})`);
        const s2 = document.createElementNS(NS, 'stop');
        s2.setAttribute('offset', '100%');
        s2.setAttribute('stop-color', 'rgba(232,201,122,0.04)');
        grad.appendChild(s1); grad.appendChild(s2);
        defs.appendChild(grad);

        // ── Line ────────────────────────────────────────────────────
        const line = document.createElementNS(NS, 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', cy);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('stroke-linecap', 'round');
        line.style.stroke = `url(#${gradId})`;
        line.style.strokeWidth = isBig ? '1.2' : '0.7';
        line.style.fill = 'none';

        if (animate) {
          line.style.strokeDasharray = len;
          line.style.strokeDashoffset = len;
          line.style.transition = `stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}ms`;
          svg.appendChild(line);
          requestAnimationFrame(() => requestAnimationFrame(() => { line.style.strokeDashoffset = '0'; }));

          // ── Flowing particle ──────────────────────────────────────
          const particleDur = Math.max(1.4, len / 165).toFixed(2);
          const particleBegin = ((delay + 970) / 1000).toFixed(2);

          const particle = document.createElementNS(NS, 'circle');
          particle.setAttribute('r', isBig ? '2.8' : '1.8');
          particle.setAttribute('fill', `rgba(232,201,122,${isBig ? 1 : 0.85})`);
          particle.setAttribute('filter', 'url(#kiqPGlow)');
          particle.setAttribute('opacity', '0');

          const motionEl = document.createElementNS(NS, 'animateMotion');
          motionEl.setAttribute('dur', `${particleDur}s`);
          motionEl.setAttribute('repeatCount', 'indefinite');
          motionEl.setAttribute('begin', `${particleBegin}s`);
          motionEl.setAttribute('calcMode', 'spline');
          motionEl.setAttribute('keyTimes', '0;1');
          motionEl.setAttribute('keySplines', '0.4 0 0.6 1');
          motionEl.setAttribute('path', `M${cx},${cy} L${x2},${y2}`);
          particle.appendChild(motionEl);

          // Fade particle in once its line has drawn
          const fadeIn = document.createElementNS(NS, 'animate');
          fadeIn.setAttribute('attributeName', 'opacity');
          fadeIn.setAttribute('values', '0;1');
          fadeIn.setAttribute('dur', '0.4s');
          fadeIn.setAttribute('begin', `${particleBegin}s`);
          fadeIn.setAttribute('fill', 'freeze');
          particle.appendChild(fadeIn);
          svg.appendChild(particle);

          // ── Endpoint glow dot for big nodes ──────────────────────
          if (isBig) {
            const dot = document.createElementNS(NS, 'circle');
            dot.setAttribute('cx', x2); dot.setAttribute('cy', y2);
            dot.setAttribute('r', '4');
            dot.setAttribute('fill', 'rgba(232,201,122,0.45)');
            dot.setAttribute('filter', 'url(#kiqPGlow)');
            dot.setAttribute('opacity', '0');
            const dotAnim = document.createElementNS(NS, 'animate');
            dotAnim.setAttribute('attributeName', 'opacity');
            dotAnim.setAttribute('values', '0;0.9;0.5');
            dotAnim.setAttribute('dur', '0.7s');
            dotAnim.setAttribute('begin', `${((delay + 900) / 1000).toFixed(2)}s`);
            dotAnim.setAttribute('fill', 'freeze');
            dot.appendChild(dotAnim);
            svg.appendChild(dot);
          }
        } else {
          svg.appendChild(line);
        }
      });
    }

    function activate() {
      if (activated) return;
      activated = true;
      setupSpread();
      drawLines(true);
      // Slight delay before adding class so CSS vars are applied first
      requestAnimationFrame(() => requestAnimationFrame(() => section.classList.add('kiq-active')));
    }

    // Initial static draw + spread vector setup
    setupSpread();
    drawLines(false);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { activate(); io.disconnect(); }
      }, { threshold: 0.15 });
      io.observe(section);
    } else {
      activate();
    }

    window.addEventListener('resize', () => requestAnimationFrame(() => {
      setupSpread();
      drawLines(false);
    }));
    setTimeout(() => { setupSpread(); drawLines(activated); }, 500);
  }

  // ===== Hero Scroll Effect: disabled — hero is now full-bleed photo =====
  function initHeroScrollEffect() {
    return; // photo hero — no zoom needed
    const wrapper = document.getElementById('heroScrollWrapper');
    const textLayer = document.getElementById('heroTextLayer');
    const scene = document.getElementById('kiqScanScene');
    const overlay = document.getElementById('heroScrollOverlay');
    if (!wrapper || !textLayer || !scene) return;

    let initialRect = null;

    function easeOut(t)    { return 1 - (1-t)*(1-t); }
    function easeInOut(t)  { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    function lerp(a, b, t) { return a + (b - a) * t; }

    function computeInitial() {
      // Hero is sticky so scene is always at same viewport position — safe to read any time
      initialRect = scene.getBoundingClientRect();
    }

    function update() {
      const scrolled = window.scrollY;
      const maxScroll = wrapper.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const p = Math.min(1, Math.max(0, scrolled / maxScroll));

      // === TEXT: fade + slide up in first 35% of scroll ===
      const textP = easeOut(Math.min(1, p / 0.35));
      textLayer.style.opacity = (1 - textP).toFixed(3);
      textLayer.style.transform = `translateY(${(-textP * 48).toFixed(1)}px)`;

      // === SCAN SCENE: start expanding at 15%, fill viewport at 100% ===
      const sceneStart = 0.15;
      const rawSceneP = Math.max(0, (p - sceneStart) / (1 - sceneStart));
      const sceneP = easeInOut(rawSceneP);

      // Once animation is complete (p=1), sticky releases — clear all transforms so
      // the scene goes back to normal flow and doesn't occlude sections below
      if (p >= 1) {
        scene.style.transform    = '';
        scene.style.borderRadius = '';
        scene.style.zIndex       = '';
        scene.style.boxShadow    = '';
        if (overlay) overlay.style.opacity = '0';
        return;
      }

      if (sceneP > 0.001 && initialRect) {
        const vw = window.innerWidth, vh = window.innerHeight;
        // Target: fill entire viewport
        const maxScale = Math.max(vw / initialRect.width, vh / initialRect.height);
        const scale = lerp(1, maxScale, sceneP);

        // Move scene center to viewport center (screen-space translation)
        const cx = initialRect.left + initialRect.width / 2;
        const cy = initialRect.top + initialRect.height / 2;
        const tx = lerp(0, vw / 2 - cx, sceneP);
        const ty = lerp(0, vh / 2 - cy, sceneP);

        const radius = lerp(28, 0, Math.min(1, sceneP * 1.4));

        scene.style.transform     = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(4)})`;
        scene.style.borderRadius  = `${radius.toFixed(1)}px`;
        scene.style.zIndex        = sceneP > 0.05 ? '20' : '';
        scene.style.boxShadow     = sceneP > 0.8 ? 'none' : '';
      } else {
        scene.style.transform    = '';
        scene.style.borderRadius = '';
        scene.style.zIndex       = '';
      }

      // === OVERLAY: very subtle vignette only (peaks ~15% at mid-expansion, fades to 0 when scene fills) ===
      if (overlay) overlay.style.opacity = (Math.sin(sceneP * Math.PI) * 0.15).toFixed(3);
    }

    // Init on DOMContentLoaded (hero is already rendered)
    requestAnimationFrame(() => {
      computeInitial();
      update();
    });

    window.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', () => { computeInitial(); requestAnimationFrame(update); });
  }

  // ===== Mehr Bento: animate timeline bars when in view =====
  function initMehrBento() {
    const timeCard = document.querySelector('.mb-card[data-mehr="time"]');
    if (!timeCard || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        timeCard.classList.add('bars-active');
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(timeCard);
  }

  // ===== kiQ Scan Scene: radar sweep + match cycling =====
  function initKiqScanScene() {
    const scene = document.getElementById('kiqScanScene');
    if (!scene) return;
    const chips = Array.from(scene.querySelectorAll('.ks-chip'));
    const matchEl = document.getElementById('ksMatch');
    const matchName = document.getElementById('ksMatchName');
    const beamEl = scene.querySelector('.ks-beam');
    if (!chips.length || !matchEl) return;

    const profiles = [
      { idx: 0, name: 'M. Huber', score: '94 %' },
      { idx: 2, name: 'T. Richter', score: '91 %' },
      { idx: 1, name: 'A. Schneider', score: '88 %' },
      { idx: 3, name: 'K. Wagner', score: '87 %' },
    ];
    let step = 0;

    function runCycle() {
      // Clear all
      chips.forEach(c => c.classList.remove('active'));
      matchEl.classList.remove('visible');

      const p = profiles[step % profiles.length];
      // After beam completes one revolution (~4s via CSS), highlight
      setTimeout(() => {
        chips[p.idx] && chips[p.idx].classList.add('active');
        if (matchName) matchName.textContent = p.name;
        const scoreEl = matchEl.querySelector('strong');
        if (scoreEl) scoreEl.textContent = p.score + ' Fit';
        matchEl.classList.add('visible');
      }, 2800);

      // Hide match after 2s
      setTimeout(() => matchEl.classList.remove('visible'), 5200);
      step++;
    }

    runCycle();
    setInterval(runCycle, 6500);
  }

  // ===== Constellation continuous drift (starts after spread animation) =====
  function startConstellationDrift() {
    const section = document.querySelector('.kiq-section');
    if (!section) return;
    const nodes = Array.from(section.querySelectorAll('.kiq-node'));
    if (!nodes.length) return;

    // Wait for spread to finish, then start live drift
    setTimeout(() => {
      // Remove transform transition so RAF can drive it smoothly
      nodes.forEach(n => { n.style.transition = 'color 0.3s ease, text-shadow 0.3s ease, opacity 0.6s ease'; });

      const driftParams = nodes.map((_, i) => ({
        ax: 2 + (i % 3) * 1.5,
        ay: 2 + (i % 4) * 1.2,
        fx: 0.4 + (i % 5) * 0.08,
        fy: 0.35 + (i % 6) * 0.07,
        phase: i * 0.42,
      }));
      let t = 0;
      function tick() {
        t += 0.012;
        nodes.forEach((n, i) => {
          if (!section.classList.contains('kiq-active')) return;
          const p = driftParams[i];
          const dx = Math.sin(t * p.fx + p.phase) * p.ax;
          const dy = Math.cos(t * p.fy + p.phase * 0.7) * p.ay;
          n.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(1)`;
        });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, 2200); // wait for spread transitions
  }

  document.addEventListener('DOMContentLoaded', () => {
    // ── MagicRings hero animation ──────────────────────────────
    (function initMagicRings() {
      const wrap = document.getElementById('heroRings');
      if (!wrap || typeof MagicRingsEffect === 'undefined') return;
      /* Outer atmospheric halo — 900×900px container inside kiqScanScene.
         Rings at ~243–567 px from center bleed into the hero background. */
      new MagicRingsEffect(wrap, {
        color:          '#E8C97A',
        colorTwo:       '#C7A24A',   /* warm gold, matches inner rings */
        speed:          0.36,        /* slow drift — atmospheric */
        ringCount:      7,
        attenuation:    7,           /* softer fall-off → wider visible arcs */
        lineThickness:  1.3,
        baseRadius:     0.27,        /* 0.27 × 900 = 243 px — just past scan scene edge */
        radiusStep:     0.070,       /* 63 px steps */
        scaleRate:      0.09,
        opacity:        0.68,
        noiseAmount:    0.012,
        ringGap:        1.68,
        fadeIn:         0.60,
        fadeOut:        0.52,
        followMouse:    false,
        mouseInfluence: 0,
        hoverScale:     1.0,
        parallax:       0,
        clickBurst:     false,
      });
    })();

    // ── MagicRings radar halo ──────────────────────────────────
    (function initRadarRings() {
      const wrap = document.getElementById('ksMagicRings');
      if (!wrap || typeof MagicRingsEffect === 'undefined') return;
      new MagicRingsEffect(wrap, {
        color:          '#E8C97A',
        colorTwo:       '#C7A24A',
        speed:          0.45,
        ringCount:      5,
        attenuation:    9,
        lineThickness:  1.6,
        baseRadius:     0.28,
        radiusStep:     0.09,
        scaleRate:      0.08,
        opacity:        0.90,
        noiseAmount:    0.014,
        ringGap:        1.6,
        fadeIn:         0.65,
        fadeOut:        0.50,
        followMouse:    false,
        mouseInfluence: 0,
        hoverScale:     1.0,
        parallax:       0,
        clickBurst:     false,
      });
    })();

    // ── 3-D scroll reveal for all sections after hero ──────────
    (function init3DScroll() {
      /* Hero lives inside .hero-scroll-wrapper — traverse from that */
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const anchor = hero.closest('.hero-scroll-wrapper') || hero;

      const sections = [];
      let el = anchor.nextElementSibling;
      while (el) {
        if (el.tagName === 'SECTION') sections.push(el);
        el = el.nextElementSibling;
      }

      if (!sections.length) return;

      /* Add animation class; will-change only while invisible */
      sections.forEach(function(s) {
        s.classList.add('s3d');
        s.style.willChange = 'transform, opacity';
      });

      const io = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (!e.isIntersecting) return;
          const s = e.target;
          s.classList.add('s3d-in');
          io.unobserve(s);
          /* After animation ends: clear transform so sticky children work */
          s.addEventListener('transitionend', function cleanup(ev) {
            if (ev.propertyName !== 'opacity') return;
            s.style.willChange = 'auto';
            s.removeEventListener('transitionend', cleanup);
          });
        });
      }, { threshold: 0.04, rootMargin: '0px 0px -24px 0px' });

      sections.forEach(function(s) { io.observe(s); });
    })();

    initHeroScrollEffect();
    initMehrBento();
    startCloudCounter();
    whenVisible('#vizKi', animateKiBars);
    whenVisible('#matchPanelFull', initKiScoring);
    initStepper();
    initReveal();
    buildMosaic();
    initWorkflow();
    initKiFlow();
    initKiqConstellation();
    startConstellationDrift();
    initKiqScanScene();
  });
})();
