/**
 * MagicRings — Vanilla JS / Three.js port
 * Original: React Bits (react-bits.dev)
 * Ported for KI-Kandidat (plain HTML/CSS/JS, Three.js via CDN)
 *
 * Usage:
 *   const rings = new MagicRingsEffect(containerEl, { color: '#E8C97A', ... });
 *   rings.destroy(); // cleanup
 */
(function (global) {
  'use strict';

  /* ─── Shaders (identical to React original) ──────────────────────── */
  const vertexShader = `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    precision highp float;

    uniform float uTime, uAttenuation, uLineThickness;
    uniform float uBaseRadius, uRadiusStep, uScaleRate;
    uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
    uniform float uFadeIn, uFadeOut;
    uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
    uniform vec2  uResolution, uMouse;
    uniform vec3  uColor, uColorTwo;
    uniform int   uRingCount;

    const float HP    = 1.5707963;
    const float CYCLE = 3.45;

    float fade(float t) {
      return t < uFadeIn
        ? smoothstep(0.0, uFadeIn, t)
        : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t);
    }

    float ring(vec2 p, float ri, float cut, float t0, float px) {
      float t  = mod(uTime + t0, CYCLE);
      float r  = ri + t / CYCLE * uScaleRate;
      float d  = abs(length(p) - r);
      float a  = atan(abs(p.y), abs(p.x)) / HP;
      float th = max(1.0 - a, 0.5) * px * uLineThickness;
      float h  = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
      d += pow(cut * a, 3.0) * r;
      return h * exp(-uAttenuation * d) * fade(t);
    }

    void main() {
      float px = 1.0 / min(uResolution.x, uResolution.y);
      vec2 p   = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;

      float cr = cos(uRotation), sr = sin(uRotation);
      p = mat2(cr, -sr, sr, cr) * p;
      p -= uMouse * uMouseInfluence;

      float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
      p /= sc;

      vec3  c   = vec3(0.0);
      float rcf = max(float(uRingCount) - 1.0, 1.0);

      for (int i = 0; i < 10; i++) {
        if (i >= uRingCount) break;
        float fi  = float(i);
        vec2  pr  = p - fi * uParallax * uMouse;
        vec3  rc  = mix(uColor, uColorTwo, fi / rcf);
        c = mix(c, rc, vec3(
          ring(pr, uBaseRadius + fi * uRadiusStep,
               pow(uRingGap, fi),
               i == 0 ? 0.0 : 2.95 * fi, px)
        ));
      }

      c *= 1.0 + uBurst * 2.0;

      /* subtle film grain */
      float n = fract(
        sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453
      );
      c += (n - 0.5) * uNoiseAmount;

      gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
    }
  `;

  /* ─── Defaults ────────────────────────────────────────────────────── */
  const DEFAULTS = {
    color:          '#E8C97A',   /* KI-Kandidat gold */
    colorTwo:       '#F5DFA0',   /* lighter gold */
    speed:          0.65,
    ringCount:      6,
    attenuation:    11,
    lineThickness:  1.8,
    baseRadius:     0.30,
    radiusStep:     0.11,
    scaleRate:      0.10,
    opacity:        0.92,
    blur:           0,
    noiseAmount:    0.025,
    rotation:       0,
    ringGap:        1.55,
    fadeIn:         0.7,
    fadeOut:        0.5,
    followMouse:    true,
    mouseInfluence: 0.12,
    hoverScale:     1.08,
    parallax:       0.04,
    clickBurst:     true,
  };

  /* ─── MagicRingsEffect class ──────────────────────────────────────── */
  function MagicRingsEffect(container, opts) {
    this.container   = container;
    this.opts        = Object.assign({}, DEFAULTS, opts || {});
    this.mousePos    = [0, 0];
    this.smoothMouse = [0, 0];
    this.hoverAmount = 0;
    this.isHovered   = false;
    this.burst       = 0;
    this.frameId     = null;
    this.renderer    = null;

    this._init();
  }

  MagicRingsEffect.prototype._init = function () {
    // Skip expensive WebGL animation on small screens (mobile perf)
    if (window.innerWidth < 768) return;
    var THREE = global.THREE;
    if (!THREE) { console.warn('MagicRings: THREE.js not loaded'); return; }

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); }
    catch (e) { console.warn('MagicRings: WebGL init failed', e); return; }

    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    var scene  = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    this.uniforms = {
      uTime:          { value: 0 },
      uAttenuation:   { value: 11 },
      uResolution:    { value: new THREE.Vector2() },
      uColor:         { value: new THREE.Color() },
      uColorTwo:      { value: new THREE.Color() },
      uLineThickness: { value: 1.8 },
      uBaseRadius:    { value: 0.30 },
      uRadiusStep:    { value: 0.11 },
      uScaleRate:     { value: 0.10 },
      uRingCount:     { value: 6 },
      uOpacity:       { value: 0.92 },
      uNoiseAmount:   { value: 0.025 },
      uRotation:      { value: 0 },
      uRingGap:       { value: 1.55 },
      uFadeIn:        { value: 0.7 },
      uFadeOut:       { value: 0.5 },
      uMouse:         { value: new THREE.Vector2() },
      uMouseInfluence:{ value: 0.12 },
      uHoverAmount:   { value: 0 },
      uHoverScale:    { value: 1.08 },
      uParallax:      { value: 0.04 },
      uBurst:         { value: 0 },
    };

    var mat  = new THREE.ShaderMaterial({
      vertexShader:   vertexShader,
      fragmentShader: fragmentShader,
      uniforms:       this.uniforms,
      transparent:    true,
    });
    var quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    scene.add(quad);

    this.scene    = scene;
    this.camera   = camera;
    this.material = mat;

    this._resize();

    this._resizeBound = this._resize.bind(this);
    window.addEventListener('resize', this._resizeBound);

    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(this._resizeBound);
      this._ro.observe(this.container);
    }

    this._bindEvents();

    var self = this;
    var animFn = function (t) {
      self.frameId = requestAnimationFrame(animFn);
      self._tick(t);
    };
    this.frameId = requestAnimationFrame(animFn);
  };

  MagicRingsEffect.prototype._resize = function () {
    var w = this.container.clientWidth;
    var h = this.container.clientHeight;
    if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.uniforms.uResolution.value.set(w * dpr, h * dpr);
  };

  MagicRingsEffect.prototype._bindEvents = function () {
    var c    = this.container;
    var self = this;

    this._onMove  = function (e) {
      var r = c.getBoundingClientRect();
      self.mousePos[0] =  (e.clientX - r.left) / r.width  - 0.5;
      self.mousePos[1] = -((e.clientY - r.top)  / r.height - 0.5);
    };
    this._onEnter = function () { self.isHovered = true; };
    this._onLeave = function () {
      self.isHovered   = false;
      self.mousePos[0] = 0;
      self.mousePos[1] = 0;
    };
    this._onClick = function () { self.burst = 1; };

    /* Make the PARENT element interactive so clicks pass through the canvas */
    c.addEventListener('mousemove',  this._onMove);
    c.addEventListener('mouseenter', this._onEnter);
    c.addEventListener('mouseleave', this._onLeave);
    c.addEventListener('click',      this._onClick);
  };

  MagicRingsEffect.prototype._tick = function (t) {
    var p = this.opts;
    var u = this.uniforms;

    /* Smooth mouse */
    this.smoothMouse[0] += (this.mousePos[0] - this.smoothMouse[0]) * 0.08;
    this.smoothMouse[1] += (this.mousePos[1] - this.smoothMouse[1]) * 0.08;
    this.hoverAmount    += ((this.isHovered ? 1 : 0) - this.hoverAmount) * 0.08;
    this.burst          *= 0.95;
    if (this.burst < 0.001) this.burst = 0;

    u.uTime.value           = t * 0.001 * p.speed;
    u.uAttenuation.value    = p.attenuation;
    u.uColor.value.set(p.color);
    u.uColorTwo.value.set(p.colorTwo);
    u.uLineThickness.value  = p.lineThickness;
    u.uBaseRadius.value     = p.baseRadius;
    u.uRadiusStep.value     = p.radiusStep;
    u.uScaleRate.value      = p.scaleRate;
    u.uRingCount.value      = p.ringCount;
    u.uOpacity.value        = p.opacity;
    u.uNoiseAmount.value    = p.noiseAmount;
    u.uRotation.value       = (p.rotation * Math.PI) / 180;
    u.uRingGap.value        = p.ringGap;
    u.uFadeIn.value         = p.fadeIn;
    u.uFadeOut.value        = p.fadeOut;
    u.uMouse.value.set(this.smoothMouse[0], this.smoothMouse[1]);
    u.uMouseInfluence.value = p.followMouse ? p.mouseInfluence : 0;
    u.uHoverAmount.value    = this.hoverAmount;
    u.uHoverScale.value     = p.hoverScale;
    u.uParallax.value       = p.parallax;
    u.uBurst.value          = p.clickBurst ? this.burst : 0;

    this.renderer.render(this.scene, this.camera);
  };

  MagicRingsEffect.prototype.destroy = function () {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this._resizeBound);
    if (this._ro) this._ro.disconnect();

    var c = this.container;
    c.removeEventListener('mousemove',  this._onMove);
    c.removeEventListener('mouseenter', this._onEnter);
    c.removeEventListener('mouseleave', this._onLeave);
    c.removeEventListener('click',      this._onClick);

    if (this.renderer) {
      if (this.renderer.domElement.parentNode === c) {
        c.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
    if (this.material) this.material.dispose();
  };

  /* Export */
  global.MagicRingsEffect = MagicRingsEffect;

})(window);
