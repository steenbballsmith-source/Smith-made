/* Smith Made — 360° piece viewer.
   Click "View in 3D" on any catalog card and the piece opens in a modal
   you can spin (drag / touch) and zoom (wheel / pinch). Every model is
   procedural wood — no files. Degrades: no WebGL -> the buttons remove
   themselves; reduced motion -> no auto-spin, drag still works. */

import * as THREE from '../assets/vendor/three.module.min.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- capability probe: no WebGL, no buttons ---------- */
function webglOK() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

const buttons = Array.from(document.querySelectorAll('[data-view3d]'));
if (!webglOK()) {
  buttons.forEach((b) => b.remove());
} else {
  buttons.forEach((b) => b.addEventListener('click', () => open(b)));
}

/* ============================================================
   WOOD KIT (compact twin of the scene helpers)
============================================================ */
const PAL = {
  walnut: ['#7c4e26', '#956336', '#5e3a1c'],
  oak:    ['#a8763f', '#c08f52', '#8a5e30'],
  honey:  ['#b98a4e', '#d2a76a', '#9a6f3c'],
  dark:   ['#5d3d22', '#6b4930', '#48301d'],
  lime:   ['#d8c9ae', '#e6dcc6', '#c4b294']
};

function woodCanvas(palette) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  const [c0, c1] = palette;
  const g = x.createLinearGradient(0, 0, 512, 128);
  g.addColorStop(0, c0); g.addColorStop(0.5, c1); g.addColorStop(1, c0);
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 90; i++) {
    const y0 = Math.random() * 512, amp = 3 + Math.random() * 9;
    const per = 120 + Math.random() * 260, a = 0.05 + Math.random() * 0.08;
    x.beginPath();
    for (let px = 0; px <= 512; px += 8) {
      const py = y0 + Math.sin((px / per) * Math.PI * 2 + i) * amp;
      px === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
    }
    x.strokeStyle = Math.random() > 0.3 ? `rgba(58,36,18,${a})` : `rgba(255,226,180,${a * 0.7})`;
    x.lineWidth = 0.6 + Math.random() * 2;
    x.stroke();
  }
  return c;
}

function wood(palette) {
  const canvas = woodCanvas(palette);
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  const bump = new THREE.CanvasTexture(canvas);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 0.3, roughness: 0.74, metalness: 0.04 });
}

function engraving(w, h, draw, ink = 'rgba(34,18,6,0.92)') {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.save(); x.translate(2, 3); x.fillStyle = 'rgba(255,232,196,0.5)'; draw(x); x.restore();
  x.save(); x.fillStyle = ink; draw(x); x.restore();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function overlay(w, h, tex) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
  );
  return m;
}

function archShape(target, w, h, br = 0.07) {
  const r = w / 2, hw = w / 2, hh = h / 2;
  target.moveTo(-hw + br, -hh);
  target.lineTo(hw - br, -hh);
  target.quadraticCurveTo(hw, -hh, hw, -hh + br);
  target.lineTo(hw, hh - r);
  target.absarc(0, hh - r, r, 0, Math.PI, false);
  target.lineTo(-hw, -hh + br);
  target.quadraticCurveTo(-hw, -hh, -hw + br, -hh);
  return target;
}

function extrude(shape, depth, curve = 36) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015,
    bevelSegments: 2, curveSegments: curve
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function rod(r, len, mat, seg = 14) { return new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg), mat); }

function spaced(x, txt, cx, cy, tracking) {
  const widths = [...txt].map((ch) => x.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (txt.length - 1);
  let px = cx - total / 2;
  [...txt].forEach((ch, i) => { x.fillText(ch, px + widths[i] / 2, cy); px += widths[i] + tracking; });
}

/* ============================================================
   THE TEN PIECES (each fits roughly in a 3-unit box, y-centered)
============================================================ */
const BUILD = {

  'arched-welcome'() {
    const g = new THREE.Group();
    const sign = new THREE.Mesh(extrude(archShape(new THREE.Shape(), 1.5, 2.2), 0.09), wood(PAL.walnut));
    const eng = engraving(512, 750, (x) => {
      x.textAlign = 'center';
      x.font = '400 30px Jost, sans-serif';
      spaced(x, 'WELCOME', 256, 190, 10);
      x.font = '400 84px "Great Vibes", cursive';
      x.fillText('Emily', 256, 300);
      x.font = '400 42px "Great Vibes", cursive';
      x.fillText('&', 256, 356);
      x.font = '400 84px "Great Vibes", cursive';
      x.fillText('Jacob', 256, 448);
      x.font = '400 24px Jost, sans-serif';
      spaced(x, '06 · 14 · 2026', 256, 540, 8);
    }, 'rgba(246,239,226,0.95)');
    const face = overlay(1.5, 2.2, eng);
    face.position.z = 0.065;
    sign.add(face);
    sign.position.y = 0.28;
    sign.rotation.x = -0.06;
    g.add(sign);
    /* easel */
    const legMat = wood(PAL.oak);
    [-1, 1].forEach((s) => {
      const leg = rod(0.035, 2.6, legMat);
      leg.position.set(s * 0.62, -0.25, -0.1);
      leg.rotation.z = s * 0.14;
      g.add(leg);
    });
    const back = rod(0.035, 2.5, legMat);
    back.position.set(0, -0.3, -0.5);
    back.rotation.x = 0.32;
    g.add(back);
    const tray = box(1.5, 0.07, 0.16, legMat);
    tray.position.set(0, -0.84, 0.06);
    g.add(tray);
    return g;
  },

  'seating-chart-wall'() {
    const g = new THREE.Group();
    const wall = box(2.2, 2.7, 0.1, wood(PAL.oak));
    const eng = engraving(700, 860, (x) => {
      x.textAlign = 'center';
      x.font = '400 92px "Great Vibes", cursive';
      x.fillText('find your seat', 350, 150);
      x.font = '400 22px Jost, sans-serif';
      for (let col = 0; col < 2; col++) {
        for (let row = 0; row < 9; row++) {
          const cx = 190 + col * 320, cy = 260 + row * 60;
          x.fillRect(cx - 105, cy, 210, 2.5);
        }
        x.font = '500 26px Jost, sans-serif';
        spaced(x, 'TABLE ' + (col + 1), 190 + col * 320, 235, 6);
        x.font = '400 22px Jost, sans-serif';
      }
    });
    const face = overlay(2.2, 2.7, eng);
    face.position.z = 0.06;
    wall.add(face);
    g.add(wall);
    [-1, 1].forEach((s) => {
      const foot = box(0.5, 0.08, 0.7, wood(PAL.dark));
      foot.position.set(s * 0.8, -1.39, 0);
      g.add(foot);
    });
    return g;
  },

  'family-round'() {
    const g = new THREE.Group();
    const geo = new THREE.CylinderGeometry(1.1, 1.1, 0.09, 64);
    geo.rotateX(Math.PI / 2);
    const disc = new THREE.Mesh(geo, wood(PAL.dark));
    const eng = engraving(512, 512, (x) => {
      x.textAlign = 'center';
      x.font = '400 36px Jost, sans-serif';
      spaced(x, 'THE', 256, 168, 14);
      x.font = '400 96px "Great Vibes", cursive';
      x.fillText('Smiths', 256, 280);
      x.fillRect(196, 322, 120, 2.5);
      x.font = '400 30px Jost, sans-serif';
      spaced(x, 'EST. 2026', 256, 382, 10);
      x.beginPath(); x.arc(256, 256, 200, Math.PI * 1.15, Math.PI * 1.85); x.lineWidth = 3.5; x.strokeStyle = x.fillStyle; x.stroke();
      x.beginPath(); x.arc(256, 256, 200, Math.PI * 0.15, Math.PI * 0.85); x.stroke();
    }, 'rgba(246,239,226,0.9)');
    const face = new THREE.Mesh(
      new THREE.CircleGeometry(1.08, 64),
      new THREE.MeshBasicMaterial({ map: eng, transparent: true, depthWrite: false })
    );
    face.position.z = 0.055;
    disc.add(face);
    g.add(disc);
    return g;
  },

  'champagne-wall'() {
    const g = new THREE.Group();
    const wall = box(2.1, 2.6, 0.12, wood(PAL.lime));
    g.add(wall);
    const eng = engraving(600, 160, (x) => {
      x.textAlign = 'center';
      x.font = '400 88px "Great Vibes", cursive';
      x.fillText('pop the bubbly', 300, 105);
    });
    const head = overlay(1.9, 0.5, eng);
    head.position.set(0, 0.95, 0.07);
    g.add(head);
    const shelfMat = wood(PAL.walnut);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0xfff3d8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 });
    for (let row = 0; row < 3; row++) {
      const shelf = box(1.8, 0.05, 0.22, shelfMat);
      shelf.position.set(0, 0.45 - row * 0.62, 0.14);
      g.add(shelf);
      for (let i = 0; i < 5; i++) {
        const glass = new THREE.Group();
        const bowl = rod(0.05, 0.16, glassMat, 10);
        bowl.position.y = 0.13;
        const stem = rod(0.012, 0.1, glassMat, 8);
        stem.position.y = 0.0;
        const foot = rod(0.04, 0.015, glassMat, 10);
        foot.position.y = -0.055;
        glass.add(bowl, stem, foot);
        glass.position.set(-0.72 + i * 0.36, 0.53 - row * 0.62, 0.14);
        g.add(glass);
      }
    }
    [-1, 1].forEach((s) => {
      const foot = box(0.46, 0.08, 0.66, shelfMat);
      foot.position.set(s * 0.75, -1.34, 0);
      g.add(foot);
    });
    return g;
  },

  'unplugged-ceremony'() {
    const g = new THREE.Group();
    const mat = wood(PAL.honey);
    const eng = engraving(460, 620, (x) => {
      x.textAlign = 'center';
      x.font = '500 44px Jost, sans-serif';
      spaced(x, 'UNPLUGGED', 230, 160, 10);
      x.font = '400 96px "Great Vibes", cursive';
      x.fillText('ceremony', 230, 300);
      x.font = '400 24px Jost, sans-serif';
      x.fillText('please put the phones away —', 230, 400);
      x.fillText('the photographer has it covered', 230, 440);
      x.fillText('♥', 230, 520);
    });
    [-1, 1].forEach((s) => {
      const panel = box(1.35, 1.9, 0.06, mat);
      panel.position.set(0, 0, s * -0.28);
      panel.rotation.x = s * 0.24;
      if (s === -1) {
        const face = overlay(1.35, 1.9, eng);
        face.position.z = 0.035;
        panel.add(face);
      }
      g.add(panel);
    });
    const hinge = rod(0.03, 1.4, wood(PAL.dark));
    hinge.rotation.z = Math.PI / 2;
    hinge.position.y = 0.92;
    g.add(hinge);
    g.rotation.y = 0.2;
    const lift = new THREE.Group();
    lift.add(g);
    g.position.y = 0.1;
    return lift;
  },

  'bar-menu'() {
    const g = new THREE.Group();
    const frameMat = wood(PAL.walnut);
    const W = 1.5, H = 2.1, T = 0.12;
    [[0, H / 2 - T / 2, W], [0, -H / 2 + T / 2, W]].forEach(([px, py, len]) => {
      const bar = box(len, T, 0.09, frameMat);
      bar.position.set(px, py, 0);
      g.add(bar);
    });
    [[-W / 2 + T / 2, 0], [W / 2 - T / 2, 0]].forEach(([px, py]) => {
      const bar = box(T, H - T * 2, 0.09, frameMat);
      bar.position.set(px, py, 0);
      g.add(bar);
    });
    const board = box(W - T * 2, H - T * 2, 0.05, new THREE.MeshStandardMaterial({ color: 0x2e2622, roughness: 0.92 }));
    g.add(board);
    const eng = engraving(440, 620, (x) => {
      x.textAlign = 'center';
      x.font = '400 72px "Great Vibes", cursive';
      x.fillText('bar menu', 220, 110);
      x.font = '400 24px Jost, sans-serif';
      const items = ['THE SWEETHEART SPRITZ', 'OLD FASHIONED, NEW NAME', 'SOMETHING BORROWED BREW', 'MRS & MRS MARGARITA'];
      items.forEach((it, i) => {
        x.fillText(it, 220, 220 + i * 90);
        x.fillRect(140, 250 + i * 90, 160, 1.5);
      });
    }, 'rgba(246,239,226,0.85)');
    const face = overlay(W - T * 2, H - T * 2, eng);
    face.position.z = 0.045;
    g.add(face);
    return g;
  },

  'grand-arch-welcome-wall'() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(extrude(archShape(new THREE.Shape(), 1.9, 2.9), 0.14, 48), wood(PAL.lime));
    const eng = engraving(512, 780, (x) => {
      x.textAlign = 'center';
      x.font = '400 100px "Great Vibes", cursive';
      x.fillText('welcome', 256, 300);
      x.font = '400 26px Jost, sans-serif';
      spaced(x, 'TO THE WEDDING OF', 256, 380, 8);
      x.font = '400 60px "Great Vibes", cursive';
      x.fillText('Sarah & Michael', 256, 480);
    });
    const face = overlay(1.9, 2.9, eng);
    face.position.z = 0.09;
    panel.add(face);
    g.add(panel);
    const trimMat = wood(PAL.walnut);
    [-1, 1].forEach((s) => {
      const foot = box(0.55, 0.1, 0.8, trimMat);
      foot.position.set(s * 0.62, -1.5, 0);
      g.add(foot);
      const brace = box(0.09, 1.0, 0.09, trimMat);
      brace.position.set(s * 0.62, -1.0, -0.28);
      brace.rotation.x = -0.5;
      g.add(brace);
    });
    return g;
  },

  'ceremony-arch-set'() {
    const g = new THREE.Group();
    const frames = [
      { w: 1.05, h: 1.85, x: -0.8, z: -0.4, pal: PAL.honey },
      { w: 1.2, h: 2.2, x: 0, z: -0.18, pal: PAL.oak },
      { w: 1.35, h: 2.6, x: 0.82, z: 0, pal: PAL.walnut }
    ];
    const base = -frames[2].h / 2;
    frames.forEach((f) => {
      const t = 0.11;
      const s = archShape(new THREE.Shape(), f.w, f.h);
      s.holes.push(archShape(new THREE.Path(), f.w - t * 2, f.h - t * 2));
      const mesh = new THREE.Mesh(extrude(s, 0.12, 40), wood(f.pal));
      mesh.position.set(f.x, base + f.h / 2, f.z);
      g.add(mesh);
    });
    const eng = engraving(256, 256, (x) => {
      x.textAlign = 'center';
      x.font = '400 104px "Great Vibes", cursive';
      x.fillText('SM', 128, 165);
    }, 'rgba(246,239,226,0.9)');
    const plaque = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 40);
    discGeo.rotateX(Math.PI / 2);
    plaque.add(new THREE.Mesh(discGeo, wood(PAL.dark)));
    const pf = new THREE.Mesh(new THREE.CircleGeometry(0.29, 40), new THREE.MeshBasicMaterial({ map: eng, transparent: true, depthWrite: false }));
    pf.position.z = 0.035;
    plaque.add(pf);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xa98d63, roughness: 1 });
    [-1, 1].forEach((s) => {
      const rope = rod(0.01, 0.45, ropeMat, 8);
      rope.position.set(s * 0.16, 0.5, 0);
      rope.rotation.z = s * -0.15;
      plaque.add(rope);
    });
    plaque.position.set(frames[2].x, base + frames[2].h - 0.85, frames[2].z);
    g.add(plaque);
    g.position.y = 0.15;
    return g;
  },

  'slat-backdrop'() {
    const g = new THREE.Group();
    const slatMat = wood(PAL.honey);
    for (let i = 0; i < 9; i++) {
      const slat = box(0.2, 2.7, 0.09, slatMat);
      slat.position.x = -1.04 + i * 0.26;
      g.add(slat);
    }
    const eng = engraving(256, 256, (x) => {
      x.textAlign = 'center';
      x.font = '400 96px "Great Vibes", cursive';
      x.fillText('SM', 128, 160);
    });
    const plaque = new THREE.Group();
    const discGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 44);
    discGeo.rotateX(Math.PI / 2);
    plaque.add(new THREE.Mesh(discGeo, wood(PAL.lime)));
    const pf = new THREE.Mesh(new THREE.CircleGeometry(0.41, 44), new THREE.MeshBasicMaterial({ map: eng, transparent: true, depthWrite: false }));
    pf.position.z = 0.032;
    plaque.add(pf);
    plaque.position.set(0, 0.25, 0.1);
    g.add(plaque);
    [-1, 1].forEach((s) => {
      const foot = box(0.5, 0.08, 0.7, wood(PAL.walnut));
      foot.position.set(s * 0.8, -1.39, 0);
      g.add(foot);
    });
    return g;
  },

  'mobile-bar'() {
    const g = new THREE.Group();
    const body = box(2.2, 1.35, 0.7, wood(PAL.lime));
    body.position.y = -0.25;
    g.add(body);
    /* fluted front */
    const fluteMat = wood(PAL.lime);
    for (let i = 0; i < 11; i++) {
      const flute = rod(0.09, 1.3, fluteMat, 12);
      flute.position.set(-1.0 + i * 0.2, -0.25, 0.36);
      g.add(flute);
    }
    const counter = box(2.5, 0.1, 0.9, wood(PAL.walnut));
    counter.position.y = 0.48;
    g.add(counter);
    const eng = engraving(500, 200, (x) => {
      x.textAlign = 'center';
      x.font = '400 110px "Great Vibes", cursive';
      x.fillText('cheers', 250, 135);
    });
    const head = overlay(1.5, 0.6, eng);
    head.position.set(0, 1.05, 0.1);
    g.add(head);
    [-1, 1].forEach((s) => {
      const post = rod(0.03, 1.0, wood(PAL.walnut));
      post.position.set(s * 0.65, 0.98, 0.1);
      g.add(post);
    });
    g.position.y = 0.15;
    return g;
  }
};

/* ============================================================
   MODAL + RENDER LOOP
============================================================ */
const modal = document.getElementById('viewer');
const canvas = document.getElementById('viewer-canvas');
const titleEl = document.getElementById('viewer-title');
let renderer = null, scene = null, camera = null, current = null, raf = 0;
let opener = null;
const cache = new Map();
const spin = {
  ry: 0.4, rx: -0.06, vy: 0, vx: 0,
  zoom: 5, zMin: 3.2, zMax: 8, cy: 0,
  dragging: false, lastX: 0, lastY: 0, pinch: 0
};

/* frame the model: distance from its bounding sphere + canvas aspect */
function fitCamera() {
  if (!current) return;
  const sphere = new THREE.Box3().setFromObject(current).getBoundingSphere(new THREE.Sphere());
  const vHalf = (camera.fov * Math.PI / 180) / 2;
  const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
  const dist = (sphere.radius * 1.15) / Math.sin(Math.min(vHalf, hHalf));
  spin.cy = sphere.center.y;
  spin.zoom = dist;
  spin.zMin = dist * 0.6;
  spin.zMax = dist * 1.9;
}

function initGL() {
  if (renderer) return true;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (e) { return false; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  scene.add(new THREE.AmbientLight(0xfff1dd, 0.8));
  const key = new THREE.DirectionalLight(0xffe0b8, 1.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc98f, 0.6);
  rim.position.set(-4, -1, -3);
  scene.add(rim);
  const warm = new THREE.PointLight(0xffb36b, 6, 16, 1.8);
  warm.position.set(2, 1.5, 3);
  scene.add(warm);
  return true;
}

function size() {
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function open(btn) {
  const id = btn.getAttribute('data-view3d');
  if (!BUILD[id]) return;
  if (!initGL()) { buttons.forEach((b) => b.remove()); return; }
  opener = btn;
  Promise.all([
    document.fonts.load('400 96px "Great Vibes"'),
    document.fonts.load('400 24px Jost')
  ]).catch(() => {}).finally(() => {
    if (current) scene.remove(current);
    if (!cache.has(id)) cache.set(id, BUILD[id]());
    current = cache.get(id);
    scene.add(current);
    titleEl.textContent = btn.getAttribute('data-title') || '';
    spin.ry = 0.4; spin.rx = -0.06; spin.vy = 0; spin.vx = 0;
    modal.hidden = false;
    document.body.classList.add('viewer-open');
    if (window.__smLenis) window.__smLenis.stop();
    size();
    fitCamera();
    loop();
    modal.querySelector('.viewer-close').focus();
  });
}

function close() {
  modal.hidden = true;
  document.body.classList.remove('viewer-open');
  if (window.__smLenis) window.__smLenis.start();
  cancelAnimationFrame(raf);
  if (opener) opener.focus();
}

function loop() {
  cancelAnimationFrame(raf);
  const tick = () => {
    if (modal.hidden) return;
    if (!spin.dragging) {
      spin.ry += spin.vy + (reduced ? 0 : 0.004);
      spin.rx += spin.vx;
      spin.vy *= 0.94; spin.vx *= 0.9;
    }
    spin.rx = Math.max(-0.7, Math.min(0.7, spin.rx));
    if (current) {
      current.rotation.y = spin.ry;
      current.rotation.x = spin.rx;
    }
    camera.position.set(0, spin.cy + 0.12, spin.zoom);
    camera.lookAt(0, spin.cy, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();
}

/* drag / touch / pinch / wheel */
const pointers = new Map();
canvas.addEventListener('pointerdown', (e) => {
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, e);
  spin.dragging = true;
  spin.lastX = e.clientX; spin.lastY = e.clientY;
});
canvas.addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, e);
  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (spin.pinch) spin.zoom = Math.max(spin.zMin, Math.min(spin.zMax, spin.zoom * (spin.pinch / d)));
    spin.pinch = d;
    return;
  }
  const dx = e.clientX - spin.lastX, dy = e.clientY - spin.lastY;
  spin.lastX = e.clientX; spin.lastY = e.clientY;
  spin.ry += dx * 0.011;
  spin.rx += dy * 0.007;
  spin.vy = dx * 0.0022;
  spin.vx = dy * 0.0012;
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (!pointers.size) { spin.dragging = false; spin.pinch = 0; }
}
canvas.addEventListener('pointerup', endPointer);
canvas.addEventListener('pointercancel', endPointer);
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  spin.zoom = Math.max(spin.zMin, Math.min(spin.zMax, spin.zoom + e.deltaY * 0.004));
}, { passive: false });

modal.querySelectorAll('[data-viewer-close]').forEach((el) => el.addEventListener('click', close));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) close(); });
window.addEventListener('resize', () => { if (!modal.hidden && renderer) { size(); fitCamera(); } });
