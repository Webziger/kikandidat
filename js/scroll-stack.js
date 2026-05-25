/* ============================================================
   KI-Kandidat — ScrollStack Vanilla JS Engine
   Ported from React Bits ScrollStack component (react-bits.dev)
   No dependencies — pure requestAnimationFrame + scrollY
   ============================================================ */
(function () {
  'use strict';

  class ScrollStack {
    constructor(container, options) {
      this.container = container;
      this.options = Object.assign({
        itemDistance:      80,   /* px gap between stacked cards   */
        itemScale:         0.03, /* scale decrement per depth       */
        itemStackDistance: 28,   /* px offset per stacked depth     */
        stackPosition:     0.18, /* fraction of vh — pin trigger    */
        scaleEndPosition:  0.08, /* fraction of vh — scale done     */
        baseScale:         0.88, /* minimum scale for deepest card  */
        rotationAmount:    0,
        blurAmount:        0,
      }, options || {});

      this.cards   = [];
      this.endEl   = null;
      this.lastY   = -1;
      this.raf     = null;
      this.bound   = this._onScroll.bind(this);
    }

    init() {
      this.cards = [...this.container.querySelectorAll('.scroll-stack-card')];
      this.endEl = this.container.querySelector('.scroll-stack-end');
      if (!this.cards.length) return;

      /* Initial card setup */
      this.cards.forEach((card, i) => {
        if (i < this.cards.length - 1) {
          card.style.marginBottom = this.options.itemDistance + 'px';
        }
        card.style.transformOrigin  = 'top center';
        card.style.willChange       = 'transform';
        card.style.backfaceVisibility = 'hidden';
      });

      window.addEventListener('scroll', this.bound, { passive: true });
      window.addEventListener('resize', this.bound, { passive: true });
      this._tick();
    }

    destroy() {
      window.removeEventListener('scroll', this.bound);
      window.removeEventListener('resize', this.bound);
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    }

    _onScroll() { this._tick(); }

    _tick() {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = null;
        this._update();
      });
    }

    _update() {
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;
      const { itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount } = this.options;

      const stackPx    = stackPosition    * vh;
      const scaleEndPx = scaleEndPosition * vh;
      const endTop     = this.endEl
        ? this.endEl.getBoundingClientRect().top + scrollY
        : 0;

      /* Find which card is "on top" (deepest in view) for blur */
      let topCardIdx = 0;
      if (blurAmount) {
        this.cards.forEach((card, i) => {
          const cTop = card.getBoundingClientRect().top + scrollY;
          const trig = cTop - stackPx - itemStackDistance * i;
          if (scrollY >= trig) topCardIdx = i;
        });
      }

      this.cards.forEach((card, i) => {
        const cardTop    = card.getBoundingClientRect().top + scrollY;
        const trigStart  = cardTop - stackPx - itemStackDistance * i;
        const trigEnd    = cardTop - scaleEndPx;
        const pinStart   = trigStart;
        const pinEnd     = endTop - vh / 2;

        /* Progress 0→1 as card enters "pinned" region */
        const rawProg  = (scrollY - trigStart) / (Math.max(1, trigEnd - trigStart));
        const progress = Math.max(0, Math.min(1, rawProg));

        /* Scale */
        const targetScale = baseScale + i * itemScale;
        const scale = 1 - progress * (1 - targetScale);

        /* Rotation */
        const rotation = rotationAmount ? i * rotationAmount * progress : 0;

        /* Blur */
        let blur = 0;
        if (blurAmount && i < topCardIdx) {
          blur = (topCardIdx - i) * blurAmount;
        }

        /* Pin translateY */
        let tY = 0;
        if (scrollY >= pinStart && scrollY <= pinEnd) {
          tY = scrollY - cardTop + stackPx + itemStackDistance * i;
        } else if (scrollY > pinEnd) {
          tY = pinEnd - cardTop + stackPx + itemStackDistance * i;
        }

        /* Apply */
        const tf = 'translate3d(0,' + tY.toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')' +
          (rotation ? ' rotate(' + rotation.toFixed(2) + 'deg)' : '');
        card.style.transform = tf;
        if (blur > 0) card.style.filter = 'blur(' + blur.toFixed(1) + 'px)';
        else card.style.filter = '';

        /* Active class for styling top card */
        const isPinned = scrollY >= pinStart && scrollY <= pinEnd;
        card.classList.toggle('ss-active', isPinned && i === Math.min(topCardIdx, this.cards.length - 1));
      });
    }
  }

  /* ── Auto-init on DOMContentLoaded ─────────────────────── */
  function initAllStacks() {
    document.querySelectorAll('[data-scroll-stack]').forEach(el => {
      const opts = {};
      if (el.dataset.itemDistance)      opts.itemDistance      = +el.dataset.itemDistance;
      if (el.dataset.itemScale)         opts.itemScale         = +el.dataset.itemScale;
      if (el.dataset.itemStackDistance) opts.itemStackDistance = +el.dataset.itemStackDistance;
      if (el.dataset.stackPosition)     opts.stackPosition     = +el.dataset.stackPosition;
      if (el.dataset.baseScale)         opts.baseScale         = +el.dataset.baseScale;
      if (el.dataset.blurAmount)        opts.blurAmount        = +el.dataset.blurAmount;

      const stack = new ScrollStack(el, opts);
      stack.init();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllStacks);
  } else {
    initAllStacks();
  }

  window.ScrollStack = ScrollStack;
})();
