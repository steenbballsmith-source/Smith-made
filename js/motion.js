/* Progressive cinema. Static HTML remains usable if media or JavaScript fails. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-cinema-hero]');
  const video = document.querySelector('[data-cinema-video]');
  const control = document.querySelector('[data-motion-toggle]');
  if (!hero || !video || !control) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = matchMedia('(max-width: 760px)');
  const connection = navigator.connection;
  let preference = null;
  try { preference = sessionStorage.getItem('smith-cinema-motion'); } catch (_) {}
  let inView = true, requestedFrame = 0, ready = false, failed = false;
  let pointerX = 0, pointerY = 0, playPending = false;
  const animations = new Set();
  const constrained = () => connection && (connection.saveData || /(^|-)2g$|^3g$/.test(connection.effectiveType || ''));
  const enabled = () => !failed && !reduce.matches && preference !== 'off' && (preference === 'on' || !constrained());
  const stopAnimations = () => { animations.forEach(a => a.cancel()); animations.clear(); };
  function renderMotion() {
    requestedFrame = 0;
    if (!enabled() || document.hidden || !inView) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
    hero.style.setProperty('--scene-progress', progress.toFixed(4));
    hero.style.setProperty('--scene-lift', (-progress * (mobile.matches ? 12 : 48)).toFixed(2) + 'px');
    hero.style.setProperty('--scene-scale', (1 + progress * (mobile.matches ? .035 : .10)).toFixed(4));
    hero.style.setProperty('--scene-radius', (progress * 36).toFixed(2) + 'px');
    hero.style.setProperty('--scene-rx', (-pointerY * 2).toFixed(2) + 'deg');
    hero.style.setProperty('--scene-ry', (pointerX * 2.8).toFixed(2) + 'deg');
  }
  function schedule() {
    if (!requestedFrame && enabled()) requestedFrame = requestAnimationFrame(renderMotion);
  }
  function updateLabel() {
    control.hidden = false;
    control.disabled = reduce.matches || failed;
    control.textContent = reduce.matches ? 'Reduced motion' : failed ? 'Still view' : enabled() ? 'Pause motion' : 'Play motion';
    control.setAttribute('aria-pressed', String(enabled() && !failed));
    control.setAttribute('aria-label', reduce.matches ? 'Motion follows your reduced motion setting' : failed ? 'Background film is unavailable. Still image shown.' : enabled() ? 'Pause background video and visual motion' : 'Play background video and visual motion');
  }
  function syncVideo() {
    if (!ready || !enabled() || !inView || document.hidden || failed) {
      video.pause();
      return;
    }
    if (!video.hasAttribute('src')) {
      video.muted = true;
      video.defaultMuted = true;
      video.src = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
      video.load();
    }
    if (video.paused && !playPending) {
      playPending = true;
      const attempt = video.play();
      if (attempt && attempt.then) attempt.then(() => { playPending = false; if (!enabled() || document.hidden || !inView) video.pause(); }).catch(() => {
        playPending = false;
        preference = 'off';
        hero.classList.add('motion-off');
        hero.classList.remove('film-playing');
        stopAnimations();
        updateLabel();
      });
      else playPending = false;
    }
  }
  function policyChanged() {
    hero.classList.toggle('motion-off', !enabled());
    if (!enabled()) {
      video.pause(); stopAnimations();
      if (requestedFrame) cancelAnimationFrame(requestedFrame);
      requestedFrame = 0;
      ['--scene-progress','--scene-lift','--scene-scale','--scene-radius','--scene-rx','--scene-ry'].forEach(key => hero.style.removeProperty(key));
    }
    updateLabel(); syncVideo(); schedule();
  }
  control.addEventListener('click', () => {
    preference = enabled() ? 'off' : 'on';
    try { sessionStorage.setItem('smith-cinema-motion', preference); } catch (_) {}
    ready = true; policyChanged();
  });
  video.addEventListener('playing', () => { if (enabled() && !document.hidden && inView) hero.classList.add('film-playing'); else video.pause(); });
  video.addEventListener('error', () => { failed = true; hero.classList.remove('film-playing'); policyChanged(); });
  document.addEventListener('visibilitychange', () => { syncVideo(); schedule(); });
  reduce.addEventListener('change', policyChanged);
  if (connection && connection.addEventListener) connection.addEventListener('change', policyChanged);
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', schedule, {passive:true});
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || !enabled()) return;
    const r = hero.getBoundingClientRect();
    pointerX = (event.clientX-r.left)/r.width-.5;
    pointerY = (event.clientY-r.top)/r.height-.5;
    schedule();
  }, {passive:true});
  hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncVideo(); schedule(); }, {threshold:0}).observe(hero);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!enabled() || !entry.target.animate) return;
      const animation = entry.target.animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}], {duration:650,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});
      animations.add(animation);
      animation.finished.then(() => animations.delete(animation)).catch(() => animations.delete(animation));
    }), {threshold:.08});
    document.querySelectorAll('[data-cinema-reveal]').forEach(el => observer.observe(el));
  }
  function begin() {
    const start = () => { ready = true; syncVideo(); };
    if ('requestIdleCallback' in window) requestIdleCallback(start, {timeout:1200});
    else setTimeout(start, 250);
  }
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, {once:true});
  policyChanged();
})();
