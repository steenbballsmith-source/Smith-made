/* Smith Made — page motion + ambient background.
   Lenis smooth scroll, GSAP reveals, process beam, fact counters, section
   and scrollspy. Degrades gracefully: no JS -> the page still reads; reduced
   motion -> static
   page; GSAP/Lenis missing -> native scroll, content fully visible. */


const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

document.body.classList.remove('no-js');
if (reduced) document.body.classList.add('reduced');
if (!hasGsap) document.body.classList.add('no-motion-lib');

/* ============================================================
   SMOOTH SCROLL (Lenis) + anchor links
============================================================ */
let lenis = null;
if (hasGsap) window.gsap.registerPlugin(window.ScrollTrigger);

if (!reduced && hasGsap && typeof window.Lenis === 'function') {
  lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
  window.__smLenis = lenis;
  lenis.on('scroll', window.ScrollTrigger.update);
  window.gsap.ticker.add((time) => lenis.raf(time * 1000));
  window.gsap.ticker.lagSmoothing(0);
}

/* keep keyboard + history behavior when we hijack anchor clicks */
function focusScrollTarget(el) {
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
document.querySelectorAll('[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    history.replaceState(null, '', id);
    if (lenis) lenis.scrollTo(el, { duration: 1.6, onComplete: () => focusScrollTarget(el) });
    else {
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      focusScrollTarget(el);
    }
  });
});

/* nav frosting + section spy on scroll */
const nav = document.getElementById('nav');
const spyLinks = Array.from(document.querySelectorAll('.nav-links a:not(.nav-cta)'))
  .map((a) => ({ a, el: document.querySelector(a.getAttribute('href') || '') }))
  .filter((x) => x.el);
function updateNav() {
  if (nav) nav.classList.toggle('scrolled', (window.scrollY || 0) > 60);
  const probe = (window.scrollY || 0) + window.innerHeight * 0.35;
  let current = null;
  spyLinks.forEach((x) => {
    if (!x.a.hidden && x.el.offsetTop <= probe) current = x;
  });
  spyLinks.forEach((x) => x.a.classList.toggle('active', x === current));
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ============================================================
   THE PROCESSIONAL — one reversible, normalized story
============================================================ */
function bindProcessional() {
  const root = document.querySelector('[data-processional]');
  if (!root) return;

  const chapterEls = Array.from(root.querySelectorAll('[data-processional-chapter]'));
  const imageEls = Array.from(root.querySelectorAll('[data-processional-image]'));
  const finishEls = Array.from(root.querySelectorAll('[data-processional-finish]'));
  const states = [
    { id: 'threshold', start: 0, end: 0.18, image: 'choose-form' },
    { id: 'choose-form', start: 0.18, end: 0.42, image: 'choose-form' },
    { id: 'choose-finish', start: 0.42, end: 0.66, image: 'choose-finish' },
    { id: 'place-it', start: 0.66, end: 0.84, image: 'place-it' },
    { id: 'check-date', start: 0.84, end: 1.001, image: 'place-it' }
  ];
  let lastState = '';
  let lastProgress = 0;
  let nativeFrame = 0;
  let resizeTimer = 0;

  function clamp(value) { return Math.max(0, Math.min(1, value)); }
  function compactMode() {
    return reduced || window.innerWidth <= 840 || window.innerHeight < 720;
  }

  function applyProcessionalState(value) {
    const progress = clamp(Number.isFinite(value) ? value : 0);
    const state = states.find((candidate) => progress >= candidate.start && progress < candidate.end) || states[states.length - 1];
    const easedOpen = 1 - Math.pow(1 - progress, 2);
    lastProgress = progress;

    root.style.setProperty('--processional-progress', `${(progress * 100).toFixed(2)}%`);
    root.style.setProperty('--portal-width', `${(58 + easedOpen * 34).toFixed(2)}%`);
    root.style.setProperty('--portal-lift', `${(18 * (1 - progress)).toFixed(2)}px`);
    root.style.setProperty('--portal-scale', (1.065 - progress * 0.045).toFixed(4));

    if (state.id === lastState) return;
    lastState = state.id;
    root.dataset.processionalState = state.id;

    chapterEls.forEach((chapter) => {
      const active = chapter.dataset.processionalChapter === state.id;
      chapter.classList.toggle('is-active', active);
      if (active) chapter.setAttribute('aria-current', 'step');
      else chapter.removeAttribute('aria-current');
    });
    imageEls.forEach((layer) => {
      layer.classList.toggle('is-active', layer.dataset.processionalImage === state.image);
    });
    finishEls.forEach((finish) => {
      finish.classList.toggle('is-active', finish.dataset.processionalFinish === state.image);
    });
  }

  /* Network failure tries the admitted JPEG once, then exposes an authored
     text surface instead of leaving a broken-image hole. */
  root.querySelectorAll('.portal-layer img').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.dataset.fallbackTried !== 'true') {
        img.dataset.fallbackTried = 'true';
        const picture = img.closest('picture');
        if (picture) picture.querySelectorAll('source').forEach((source) => source.remove());
        img.src = fallback;
        return;
      }
      const layer = img.closest('.portal-layer');
      if (layer) layer.classList.add('is-media-failed');
    });
  });

  function nativeProgress() {
    nativeFrame = 0;
    if (compactMode()) return applyProcessionalState(1);
    const rect = root.getBoundingClientRect();
    const travel = Math.max(1, root.offsetHeight - window.innerHeight);
    applyProcessionalState(clamp(-rect.top / travel));
  }
  function scheduleNativeProgress() {
    if (!nativeFrame) nativeFrame = window.requestAnimationFrame(nativeProgress);
  }

  if (reduced) {
    applyProcessionalState(1);
  } else if (hasGsap) {
    window.ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      invalidateOnRefresh: true,
      onUpdate: (self) => applyProcessionalState(compactMode() ? 1 : self.progress),
      onRefresh: (self) => applyProcessionalState(compactMode() ? 1 : self.progress)
    });
    applyProcessionalState(compactMode() ? 1 : 0);
  } else {
    window.addEventListener('scroll', scheduleNativeProgress, { passive: true });
    scheduleNativeProgress();
  }

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (hasGsap) window.ScrollTrigger.refresh();
      if (compactMode()) applyProcessionalState(1);
      else if (!hasGsap) scheduleNativeProgress();
      else applyProcessionalState(lastProgress);
    }, 120);
  }, { passive: true });
}
bindProcessional();

/* ============================================================
   CONTENT REVEALS + PROCESS BEAM + FACT COUNTERS
============================================================ */
function bindReveals() {
  if (reduced || !hasGsap) return;
  const gsap = window.gsap;
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 42 },
      { opacity: 1, y: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' } });
  });
  const beam = document.querySelector('.steps .beam');
  if (beam) {
    gsap.to(beam, { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 1 } });
  }
  /* shop facts count up as they enter */
  document.querySelectorAll('.facts strong').forEach((el) => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const end = Number(m[1]), suffix = m[2];
    const counter = { v: 0 };
    gsap.to(counter, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => { el.textContent = Math.round(counter.v) + suffix; }
    });
  });
}
bindReveals();

/* ============================================================
   LOADER (declared before the renderer branch — the no-WebGL
   path calls finishLoad() during module evaluation)
============================================================ */
let loaderDone = false;
function finishLoad() {
  if (loaderDone) return;
  loaderDone = true;
  const l = document.getElementById('loader');
  if (l) setTimeout(() => l.classList.add('done'), 250);
  if (hasGsap) setTimeout(() => window.ScrollTrigger.refresh(), 900);
}

/* main.js calls this after filters / gallery change page height */
window.__smRefresh = () => {
  if (hasGsap) window.ScrollTrigger.refresh();
};

/* ==============================================================
   AMBIENT BACKDROP — removed
   The three.js backdrop cost 670 KB (166 KB gzipped) to draw a few
   sub-pixel motes and a light that never reached the page: toggling the
   canvas within one page load changed 17-130 pixels of 1.3 million, a
   max delta of 38/255. The warm gradients and film grain in the CSS are
   what the page's atmosphere was actually coming from.
   ============================================================== */
const canvas = document.getElementById('webgl');
if (canvas) canvas.style.display = 'none';
finishLoad();
