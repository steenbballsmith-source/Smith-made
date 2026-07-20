/* Smith Made — cinematic scroll scene.
   Three.js signs with procedural wood grain + engraving, a scroll-riding
   camera, dust motes, candlelight, Lenis smooth scroll, and GSAP reveals.
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

/* nav frosting on scroll */
const nav = document.getElementById('nav');
function updateNav() {
  if (nav) nav.classList.toggle('scrolled', (window.scrollY || 0) > 60);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ============================================================
   CONTENT REVEALS + PROCESS BEAM
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
}
bindReveals();

/* ============================================================
   PROCEDURAL WOOD TEXTURES (no image files)
============================================================ */
function makeWoodCanvas(w, h, palette) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const [c0, c1, c2] = palette;
  const g = ctx.createLinearGradient(0, 0, w, h * 0.25);
  g.addColorStop(0, c0); g.addColorStop(0.5, c1); g.addColorStop(1, c0);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  /* grain streaks */
  for (let i = 0; i < 140; i++) {
    const y0 = Math.random() * h;
    const amp = 4 + Math.random() * 14;
    const period = 180 + Math.random() * 420;
    const alpha = 0.04 + Math.random() * 0.09;
    const lw = 0.6 + Math.random() * 2.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 8) {
      const y = y0 + Math.sin((x / period) * Math.PI * 2 + i) * amp;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = Math.random() > 0.32 ? `rgba(58,36,18,${alpha})` : `rgba(255,226,180,${alpha * 0.8})`;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
  /* knots */
  const knots = 2 + Math.floor(Math.random() * 3);
  for (let k = 0; k < knots; k++) {
    const kx = Math.random() * w, ky = Math.random() * h;
    for (let r = 26; r > 2; r -= 4) {
      ctx.beginPath();
      ctx.ellipse(kx, ky, r * 1.5, r, 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(50,30,14,${0.05 + (26 - r) * 0.004})`;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }
  /* warm vignette */
  const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, w * 0.75);
  v.addColorStop(0, 'rgba(255,220,170,0.07)');
  v.addColorStop(1, 'rgba(40,22,8,0.16)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = c2; ctx.globalAlpha = 0.05; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
  return c;
}

function woodMaterial(palette, repX = 1, repY = 1) {
  const canvas = makeWoodCanvas(1024, 1024, palette);
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(repX, repY);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const bump = new THREE.CanvasTexture(canvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(repX, repY);
  return new THREE.MeshStandardMaterial({
    map, bumpMap: bump, bumpScale: 0.35, roughness: 0.72, metalness: 0.04
  });
}

/* engraving overlay: carved illusion = light highlight offset below,
   dark ink on top */
function engravingTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.save();
  ctx.translate(2.5, 3.5);
  ctx.fillStyle = 'rgba(255,232,196,0.5)';
  draw(ctx);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = 'rgba(34,18,6,0.92)';
  draw(ctx);
  ctx.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

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

const PAL_WALNUT = ['#7c4e26', '#956336', '#5e3a1c'];
const PAL_OAK    = ['#a8763f', '#c08f52', '#8a5e30'];
const PAL_HONEY  = ['#b98a4e', '#d2a76a', '#9a6f3c'];
const PAL_DARK   = ['#5d3d22', '#6b4930', '#48301d'];

/* ============================================================
   THREE.JS SCENE
============================================================ */
const canvas = document.getElementById('webgl');
const state = { w: window.innerWidth, h: window.innerHeight };
const isMobile = () => state.w < 841;

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
  const camGroup = new THREE.Group();          /* mouse-parallax layer */
  const camera = new THREE.PerspectiveCamera(34, state.w / state.h, 0.1, 100);
  camera.position.z = 7;
  camGroup.add(camera);
  scene.add(camGroup);

  /* warm, candlelit lighting */
  scene.add(new THREE.AmbientLight(0xfff1dd, 0.75));
  const key = new THREE.DirectionalLight(0xffe0b8, 1.5);
  key.position.set(3.5, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc98f, 0.5);
  rim.position.set(-4, -2, -3);
  scene.add(rim);
  const candle = new THREE.PointLight(0xffb36b, 8, 18, 1.6);
  candle.position.set(2.4, 0.5, 3.2);
  scene.add(candle);

  /* ---------- sign builders ---------- */
  const D = 0.11; /* board thickness */

  function archOutline(target, w, h) {
    const r = w / 2, hw = w / 2, hh = h / 2, br = 0.09;
    target.moveTo(-hw + br, -hh);
    target.lineTo(hw - br, -hh);
    target.quadraticCurveTo(hw, -hh, hw, -hh + br);
    target.lineTo(hw, hh - r);
    target.absarc(0, hh - r, r, 0, Math.PI, false);
    target.lineTo(-hw, -hh + br);
    target.quadraticCurveTo(-hw, -hh, -hw + br, -hh);
    return target;
  }

  function makeArchSign({ w = 2.05, h = 2.95, palette = PAL_WALNUT, engrave }) {
    const group = new THREE.Group();
    const shape = archOutline(new THREE.Shape(), w, h);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: D, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02,
      bevelSegments: 3, curveSegments: 48
    });
    geo.translate(0, 0, -D / 2);
    group.add(new THREE.Mesh(geo, woodMaterial(palette, 0.55, 0.42)));
    const eTex = engravingTexture(1024, Math.round(1024 * h / w), engrave);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: eTex, transparent: true, depthWrite: false })
    );
    plane.position.z = D / 2 + 0.022;
    group.add(plane);
    /* hanging dowel + ropes */
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xa98d63, roughness: 1 });
    const dowel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, w * 1.35, 20),
      woodMaterial(PAL_OAK, 1, 1)
    );
    dowel.rotation.z = Math.PI / 2;
    dowel.position.y = h / 2 + 0.62;
    group.add(dowel);
    [-1, 1].forEach((side) => {
      const len = 0.72;
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 8), ropeMat);
      rope.position.set(side * (w / 2 - 0.28), h / 2 + 0.62 - len / 2 + 0.03, 0);
      rope.rotation.z = side * -0.12;
      group.add(rope);
    });
    return group;
  }

  function makeRoundSign({ r = 1.18, palette = PAL_OAK, engrave }) {
    const group = new THREE.Group();
    const geo = new THREE.CylinderGeometry(r, r, D, 72);
    geo.rotateX(Math.PI / 2);
    group.add(new THREE.Mesh(geo, woodMaterial(palette, 0.8, 0.8)));
    const eTex = engravingTexture(1024, 1024, engrave);
    const plane = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.985, 72),
      new THREE.MeshBasicMaterial({ map: eTex, transparent: true, depthWrite: false })
    );
    plane.position.z = D / 2 + 0.02;
    group.add(plane);
    return group;
  }

  function makeHeartSign({ size = 1.5, palette = PAL_HONEY, engrave }) {
    const group = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0, 0.55);
    s.bezierCurveTo(0, 0.85, -0.45, 1.1, -0.85, 1.1);
    s.bezierCurveTo(-1.5, 1.1, -1.5, 0.35, -1.5, 0.35);
    s.bezierCurveTo(-1.5, -0.25, -0.9, -0.85, 0, -1.4);
    s.bezierCurveTo(0.9, -0.85, 1.5, -0.25, 1.5, 0.35);
    s.bezierCurveTo(1.5, 0.35, 1.5, 1.1, 0.85, 1.1);
    s.bezierCurveTo(0.45, 1.1, 0, 0.85, 0, 0.55);
    const geo = new THREE.ExtrudeGeometry(s, {
      depth: D, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02,
      bevelSegments: 3, curveSegments: 40
    });
    geo.translate(0, 0, -D / 2);
    group.add(new THREE.Mesh(geo, woodMaterial(palette, 0.6, 0.6)));
    const eTex = engravingTexture(1024, 900, engrave);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 2.1),
      new THREE.MeshBasicMaterial({ map: eTex, transparent: true, depthWrite: false })
    );
    plane.position.set(0, -0.06, D / 2 + 0.022);
    group.add(plane);
    group.scale.setScalar(size / 1.5);
    return group;
  }

  /* The Ceremony Arch Set (No. 08): three hollow arches stepping up,
     with a round engraved monogram hanging in the tallest frame. */
  function makeArchTrio({ engrave }) {
    const group = new THREE.Group();
    const frames = [
      { w: 1.35, h: 2.3, x: -0.95, z: -0.45, pal: PAL_HONEY },
      { w: 1.55, h: 2.75, x: 0.05, z: -0.22, pal: PAL_OAK },
      { w: 1.75, h: 3.2, x: 1.0, z: 0, pal: PAL_WALNUT }
    ];
    const tallest = frames[2];
    const baseY = -tallest.h / 2; /* align all feet on one floor line */
    frames.forEach((f) => {
      const t = 0.13; /* frame thickness */
      const shape = archOutline(new THREE.Shape(), f.w, f.h);
      const hole = archOutline(new THREE.Path(), f.w - t * 2, f.h - t * 2);
      shape.holes.push(hole);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: D * 1.4, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015,
        bevelSegments: 2, curveSegments: 40
      });
      geo.translate(0, 0, -D * 0.7);
      const mesh = new THREE.Mesh(geo, woodMaterial(f.pal, 0.5, 0.5));
      mesh.position.set(f.x, baseY + f.h / 2, f.z);
      group.add(mesh);
    });
    /* hanging monogram plaque inside the tallest arch */
    const plaque = new THREE.Group();
    const r = 0.4;
    const disc = new THREE.CylinderGeometry(r, r, D * 0.8, 56);
    disc.rotateX(Math.PI / 2);
    plaque.add(new THREE.Mesh(disc, woodMaterial(PAL_DARK, 0.9, 0.9)));
    const eTex = engravingTexture(512, 512, engrave);
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.97, 56),
      new THREE.MeshBasicMaterial({ map: eTex, transparent: true, depthWrite: false })
    );
    face.position.z = D * 0.4 + 0.018;
    plaque.add(face);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xa98d63, roughness: 1 });
    [-1, 1].forEach((side) => {
      const len = 0.62;
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 8), ropeMat);
      rope.position.set(side * r * 0.55, r + len / 2 - 0.05, 0);
      rope.rotation.z = side * -0.14;
      plaque.add(rope);
    });
    plaque.position.set(tallest.x, baseY + tallest.h - 0.62 - r, tallest.z);
    group.add(plaque);
    return group;
  }

  /* ---------- engraving layouts (drawn once fonts are ready) ---------- */
  function spaced(ctx, txt, x, y, tracking) {
    const widths = [...txt].map((ch) => ctx.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + tracking * (txt.length - 1);
    let cx = x - total / 2;
    [...txt].forEach((ch, i) => {
      ctx.fillText(ch, cx + widths[i] / 2, y);
      cx += widths[i] + tracking;
    });
  }
  function rule(ctx, x0, y, x1, w) {
    ctx.fillRect(Math.min(x0, x1), y - w / 2, Math.abs(x1 - x0), w);
  }
  function arcStroke(ctx, cx, cy, r, a0, a1, w) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.lineWidth = w;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
  }

  function heroEngrave(ctx) {
    const W = 1024, H = ctx.canvas.height;
    ctx.textAlign = 'center';
    ctx.font = '400 52px Georgia';
    ctx.fillText('♥', W / 2, H * 0.27);
    ctx.font = '400 46px Jost, sans-serif';
    spaced(ctx, 'HANDBUILT WEDDING SIGNS', W / 2, H * 0.345, 12);
    ctx.font = '400 190px "Great Vibes", cursive';
    ctx.fillText('Smith', W / 2, H * 0.505);
    ctx.fillText('Made', W / 2, H * 0.64);
    rule(ctx, W / 2 - 130, H * 0.708, W / 2 + 130, 3);
    ctx.font = '400 44px Jost, sans-serif';
    spaced(ctx, 'GREENVILLE · SC', W / 2, H * 0.778, 16);
  }
  function roundEngrave(ctx) {
    const W = 1024, H = 1024;
    ctx.textAlign = 'center';
    ctx.font = '400 168px "Great Vibes", cursive';
    ctx.fillText('Mr & Mrs', W / 2, H * 0.52);
    ctx.font = '400 58px Jost, sans-serif';
    spaced(ctx, 'THE SMITHS', W / 2, H * 0.66, 20);
    arcStroke(ctx, W / 2, H / 2, 360, Math.PI * 1.15, Math.PI * 1.85, 5);
    arcStroke(ctx, W / 2, H / 2, 360, Math.PI * 0.15, Math.PI * 0.85, 5);
  }
  function heartEngrave(ctx) {
    const W = 1024, H = 900;
    ctx.textAlign = 'center';
    ctx.font = '400 210px "Great Vibes", cursive';
    ctx.fillText('I do', W / 2, H * 0.5);
    ctx.font = '400 42px Jost, sans-serif';
    spaced(ctx, 'FOREVER & ALWAYS', W / 2, H * 0.66, 12);
  }
  function monogramEngrave(ctx) {
    const W = 512, H = 512;
    ctx.textAlign = 'center';
    ctx.font = '400 200px "Great Vibes", cursive';
    ctx.fillText('SM', W / 2, H * 0.62);
    arcStroke(ctx, W / 2, H / 2, 190, Math.PI * 1.2, Math.PI * 1.8, 4);
    arcStroke(ctx, W / 2, H / 2, 190, Math.PI * 0.2, Math.PI * 0.8, 4);
  }

  /* ---------- objects along the scroll journey ---------- */
  const UNIT = 6.4;                    /* world units per viewport height */
  const vh = () => state.h;
  const objects = [];
  /* outer groups ride the scroll journey (layout owns position/scale/rotY);
     inner groups belong to the intro + finale tweens so the two systems
     never write to the same property */
  let heroSign = null, finalSign = null;
  let heroInner = null, finalInner = null;

  function journeyDepth() {
    return (document.body.scrollHeight / vh()) * UNIT;
  }

  function buildScene() {
    heroInner = makeArchSign({ engrave: heroEngrave });
    heroSign = new THREE.Group();
    heroSign.add(heroInner);
    const round = makeRoundSign({ engrave: roundEngrave });
    const heart = makeHeartSign({ engrave: heartEngrave });
    const trio = makeArchTrio({ engrave: monogramEngrave });
    finalInner = makeArchSign({ palette: PAL_OAK, engrave: heroEngrave });
    finalSign = new THREE.Group();
    finalSign.add(finalInner);

    objects.push(
      { group: heroSign, sel: '#hero',        xDesk: 1.85,  xMob: 1.22,  anchor: 0.46, scale: 1,    scaleMob: 0.44, rotY: -0.16, spin: 1 },
      { group: round,    sel: '#craft',       xDesk: -2.15, xMob: -0.8,  anchor: 0.42, scale: 1,    scaleMob: 0.5,  rotY: 0.22,  spin: -1 },
      { group: heart,    sel: '#collection',  xDesk: 2.55,  xMob: 0.8,   anchor: 0.45, scale: 0.85, scaleMob: 0.42, rotY: -0.2,  spin: 1 },
      { group: trio,     sel: '#faq',         xDesk: -2.45, xMob: -0.85, anchor: 0.7,  scale: 0.78, scaleMob: 0.44, rotY: 0.18,  spin: -1 },
      { group: finalSign, sel: '#inquire',    xDesk: 0,     xMob: 0,     anchor: 0.12, scale: 0.94, scaleMob: 0.56, rotY: 0,     spin: 0.8 }
    );
    objects.forEach((o) => {
      o.el = document.querySelector(o.sel);
      scene.add(o.group);
    });

    /* sawdust / dust-mote particles down the whole journey */
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
      transparent: true, opacity: 0.6, depthWrite: false
    });
    scene.add(new THREE.Points(pGeo, pMat));

    layout();
    intro();
    bindScrollFX();
  }

  /* place each object so it's centered (per anchor) when its section
     is in view; recomputed on resize and content changes */
  function layout() {
    objects.forEach((o) => {
      if (!o.el) return;
      const targetScroll = o.el.offsetTop + o.el.offsetHeight * o.anchor - vh() * 0.5;
      o.baseY = -(Math.max(0, targetScroll) / vh()) * UNIT;
      o.baseX = isMobile() ? o.xMob : o.xDesk;
      o.group.scale.setScalar(isMobile() ? o.scaleMob : o.scale);
      o.group.position.x = o.baseX;
      o.group.position.y = o.baseY;
      o.group.rotation.y = o.rotY;
    });
  }

  function intro() {
    if (reduced || !hasGsap) return;
    const gsap = window.gsap;
    const heroObj = objects[0];
    /* tick() adds introY to the hero's y every frame, so this survives the
       per-frame position writes; rotation/scale ride the inner group, which
       the scroll scrub (outer) never touches */
    heroObj.introY = -1.6;
    gsap.to(heroObj, { introY: 0, duration: 1.6, ease: 'power3.out', delay: 0.15 });
    gsap.from(heroInner.rotation, { y: -0.85, duration: 1.8, ease: 'power3.out', delay: 0.15 });
    gsap.from(heroInner.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 1.6, ease: 'power3.out', delay: 0.15 });
  }

  /* scroll-scrubbed rotation as each section passes */
  function bindScrollFX() {
    if (reduced || !hasGsap) return;
    const gsap = window.gsap;
    objects.forEach((o) => {
      if (!o.el) return;
      gsap.to(o.group.rotation, {
        y: o.rotY + o.spin * 1.05,
        x: 0.06 * o.spin,
        ease: 'none',
        scrollTrigger: { trigger: o.el, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });
    /* the final sign grows slightly as the ending approaches — tweens the
       inner layer with fixed relative values, so breakpoint changes to the
       outer layout scale never fight it */
    gsap.fromTo(finalInner.scale,
      { x: 0.8, y: 0.8, z: 0.8 },
      { x: 1, y: 1, z: 1, ease: 'none',
        scrollTrigger: { trigger: '#inquire', start: 'top bottom', end: 'center center', scrub: 1.2 } });
  }

  /* mouse parallax */
  const cursor = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    cursor.x = e.clientX / state.w - 0.5;
    cursor.y = e.clientY / state.h - 0.5;
  }, { passive: true });

  /* render loop */
  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    const scrollY = window.scrollY || window.pageYOffset || 0;
    camera.position.y = -(scrollY / vh()) * UNIT;

    if (!reduced) {
      const px = cursor.x * 0.55, py = -cursor.y * 0.35;
      camGroup.position.x += (px - camGroup.position.x) * 0.045;
      camGroup.position.y += (py - camGroup.position.y) * 0.045;
    }

    objects.forEach((o, i) => {
      if (o.baseY === undefined) return;
      if (reduced) {
        o.group.position.y = o.baseY;
        o.group.position.x = o.baseX;
      } else {
        o.group.position.y = o.baseY + Math.sin(t * 0.75 + i * 1.7) * 0.075 + (o.introY || 0);
        o.group.position.x = o.baseX + Math.sin(t * 0.5 + i * 2.3) * 0.03;
      }
    });

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
    layout();
    if (hasGsap) window.ScrollTrigger.refresh();
  });

  /* main.js calls this after filters / gallery / photos change page height */
  window.__smRefresh = () => {
    layout();
    if (hasGsap) window.ScrollTrigger.refresh();
  };

  /* engravings use the script face — wait for fonts, then build */
  Promise.all([
    document.fonts.load('400 190px "Great Vibes"'),
    document.fonts.load('400 46px Jost'),
    document.fonts.ready
  ]).catch(() => {}).finally(() => {
    buildScene();
    tick();
    finishLoad();
  });
}
