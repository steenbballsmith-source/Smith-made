/* Smith Made — page motion + ambient background.
   Lenis smooth scroll, GSAP reveals, process beam, fact counters, section
   and scrollspy. Degrades gracefully: no JS -> the page still reads; reduced
   motion -> static
   page; GSAP/Lenis missing -> native scroll, content fully visible. */


const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

document.body.classList.remove('no-js');
if (reduced || !hasGsap) document.body.classList.add('reduced');

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
