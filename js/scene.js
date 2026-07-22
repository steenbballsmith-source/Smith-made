/* Smith Made — page motion + ambient background.
   Lenis smooth scroll, GSAP reveals, process beam, fact counters, section
   spy, and a calm WebGL backdrop of drifting sawdust in warm candlelight.
   (The 3D signs live in the click-to-open viewer — js/viewer.js — only.)
   Degrades gracefully: no WebGL -> canvas hidden; reduced motion -> static
   page; GSAP/Lenis missing -> native scroll, content fully visible. */

import * as THREE from '../assets/vendor/three.module.min.js';

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

/* ============================================================
   AMBIENT BACKDROP — sawdust motes in warm candlelight
============================================================ */
const canvas = document.getElementById('webgl');
const state = { w: window.innerWidth, h: window.innerHeight };

let renderer = null;
try {
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
} catch (e) {
  renderer = null;
}

if (!renderer) {
  canvas.style.display = 'none';
  finishLoad();
} else {
  renderer.setSize(state.w, state.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camGroup = new THREE.Group();
  const camera = new THREE.PerspectiveCamera(34, state.w / state.h, 0.1, 100);
  camera.position.z = 7;
  camGroup.add(camera);
  scene.add(camGroup);

  const candle = new THREE.PointLight(0xffb36b, 8, 18, 1.6);
  candle.position.set(2.4, 0.5, 3.2);
  scene.add(candle);

  const UNIT = 6.4; /* world units per viewport height of scroll */
  const vh = () => state.h;
  const journeyDepth = () => (document.body.scrollHeight / vh()) * UNIT;

  const count = 240;
  const pos = new Float32Array(count * 3);
  const depth = journeyDepth();
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 14;
    pos[i * 3 + 1] = 4 - Math.random() * (depth + 10);
    pos[i * 3 + 2] = -3.5 + Math.random() * 5.5;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({
    color: 0xc9a26b, size: 0.045, sizeAttenuation: true,
    transparent: true, opacity: 0.55, depthWrite: false
  });
  scene.add(new THREE.Points(pGeo, pMat));

  const cursor = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    cursor.x = e.clientX / state.w - 0.5;
    cursor.y = e.clientY / state.h - 0.5;
  }, { passive: true });

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    camera.position.y = -(scrollY / vh()) * UNIT;

    if (!reduced) {
      const px = cursor.x * 0.4, py = -cursor.y * 0.25;
      camGroup.position.x += (px - camGroup.position.x) * 0.045;
      camGroup.position.y += (py - camGroup.position.y) * 0.045;
    }

    candle.intensity = reduced ? 8 : 8 + Math.sin(t * 7.3) * 0.7 + Math.sin(t * 13.7) * 0.45;
    candle.position.y = camera.position.y + 0.6;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => {
    state.w = window.innerWidth;
    state.h = window.innerHeight;
    camera.aspect = state.w / state.h;
    camera.updateProjectionMatrix();
    renderer.setSize(state.w, state.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (hasGsap) window.ScrollTrigger.refresh();
  });

  tick();
  finishLoad();
}
