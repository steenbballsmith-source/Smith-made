/* Static content stays visible while cinema progressively enhances the page. */
(() => {
  'use strict';
  const hero = document.querySelector('[data-cinema-hero]');
  const video = document.querySelector('[data-cinema-video]');
  const control = document.querySelector('[data-motion-toggle]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = matchMedia('(max-width: 760px)');
  const connection = navigator.connection;
  let preference = null;
  function readPreference() {
    try { preference = sessionStorage.getItem('smith-cinema-motion'); } catch (_) {}
  }
  readPreference();
  const constrained = () => connection && (connection.saveData || /(^|-)2g$|^3g$/.test(connection.effectiveType || ''));
  const permitted = () => !reduce.matches && preference !== 'off' && (preference === 'on' || !constrained());
  function syncPagePreference() {
    document.documentElement.classList.toggle('motion-paused', !permitted());
  }
  syncPagePreference();
  if (!hero || !video || !control) {
    reduce.addEventListener('change', syncPagePreference);
    if (connection && connection.addEventListener) connection.addEventListener('change', syncPagePreference);
    window.addEventListener('pageshow', () => { readPreference(); syncPagePreference(); });
    return;
  }
  let inView = true, requestedFrame = 0, ready = false, failed = false;
  let pointerX = 0, pointerY = 0, playPending = false, lastFrame = 0;
  let playbackRequest = 0, loadedSource = '';
  const state = { progress: 0, x: 0, y: 0 };
  const animations = new Map();
  const enabled = () => !failed && permitted();
  const stopAnimations = () => { animations.forEach(a => a.cancel()); animations.clear(); };
  function stopFrame() {
    if (requestedFrame) cancelAnimationFrame(requestedFrame);
    requestedFrame = lastFrame = 0;
  }
  function renderMotion(time) {
    requestedFrame = 0;
    if (!enabled() || document.hidden || !inView) { lastFrame = 0; return; }
    const rect = hero.getBoundingClientRect();
    const target = {
      progress: mobile.matches ? 0 : Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height))),
      x: fine.matches && !mobile.matches ? pointerX : 0,
      y: fine.matches && !mobile.matches ? pointerY : 0
    };
    const elapsed = lastFrame ? Math.min(48, time - lastFrame) : 16;
    const blend = 1 - Math.exp(-elapsed / 145);
    lastFrame = time;
    let unsettled = false;
    Object.keys(state).forEach(key => {
      state[key] += (target[key] - state[key]) * blend;
      if (Math.abs(target[key] - state[key]) < .0005) state[key] = target[key];
      else unsettled = true;
    });
    hero.style.setProperty('--scene-lift', (-state.progress * 22).toFixed(2) + 'px');
    hero.style.setProperty('--scene-scale', (1 + state.progress * .04).toFixed(4));
    hero.style.setProperty('--scene-rx', (-state.y * 1.2).toFixed(3) + 'deg');
    hero.style.setProperty('--scene-ry', (state.x * 1.6).toFixed(3) + 'deg');
    if (unsettled) requestedFrame = requestAnimationFrame(renderMotion);
    else lastFrame = 0;
  }
  function schedule() {
    if (!requestedFrame && enabled() && inView && !document.hidden) requestedFrame = requestAnimationFrame(renderMotion);
  }
  function updateLabel() {
    control.hidden = false;
    control.disabled = reduce.matches || failed;
    control.textContent = reduce.matches ? 'Reduced motion' : failed ? 'Still view' : enabled() ? 'Pause motion' : 'Play motion';
    control.setAttribute('aria-pressed', String(enabled()));
    control.setAttribute('aria-label', reduce.matches ? 'Motion follows your reduced motion setting' : failed ? 'Background film is unavailable. Still image shown.' : enabled() ? 'Pause background video and visual motion' : 'Play background video and visual motion');
  }
  function playbackFailed(error) {
    playPending = false;
    if (error && error.name === 'AbortError') {
      if (ready && enabled() && inView && !document.hidden) requestAnimationFrame(syncVideo);
      return;
    }
    preference = 'off';
    hero.classList.remove('film-playing');
    policyChanged();
  }
  function syncVideo() {
    if (!ready || !enabled() || !inView || document.hidden) { video.pause(); return; }
    const nextSource = mobile.matches ? video.dataset.mobileSrc : video.dataset.desktopSrc;
    if (loadedSource !== nextSource) {
      ++playbackRequest;
      playPending = false;
      video.pause();
      hero.classList.remove('film-playing');
      video.muted = video.defaultMuted = true;
      video.src = loadedSource = nextSource;
      video.load();
    }
    if (video.paused && !playPending) {
      playPending = true;
      const request = ++playbackRequest;
      try {
        const attempt = video.play();
        if (attempt && attempt.then) attempt.then(() => {
          if (request !== playbackRequest) return;
          playPending = false;
          if (!enabled() || document.hidden || !inView) video.pause();
        }).catch(error => { if (request === playbackRequest) playbackFailed(error); });
        else playPending = false;
      } catch (error) { if (request === playbackRequest) playbackFailed(error); }
    }
  }
  function policyChanged() {
    hero.classList.toggle('motion-off', !enabled());
    syncPagePreference();
    if (!enabled()) {
      video.pause(); stopAnimations(); stopFrame();
      state.progress = state.x = state.y = 0;
      ['--scene-lift','--scene-scale','--scene-rx','--scene-ry'].forEach(key => hero.style.removeProperty(key));
    }
    updateLabel(); syncVideo(); schedule();
  }
  control.addEventListener('click', () => {
    preference = enabled() ? 'off' : 'on';
    try { sessionStorage.setItem('smith-cinema-motion', preference); } catch (_) {}
    ready = true; policyChanged();
  });
  video.addEventListener('playing', () => {
    if (enabled() && !document.hidden && inView) hero.classList.add('film-playing');
    else video.pause();
  });
  video.addEventListener('error', () => { failed = true; hero.classList.remove('film-playing'); policyChanged(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stopFrame(); stopAnimations(); }
    syncVideo(); schedule();
  });
  window.addEventListener('pagehide', () => {
    ++playbackRequest;
    playPending = false;
    video.pause();
    stopFrame();
    stopAnimations();
  });
  window.addEventListener('pageshow', event => {
    readPreference();
    if (event.persisted) ready = true;
    const bounds = hero.getBoundingClientRect();
    inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
    policyChanged();
  });
  document.addEventListener('focusin', event => animations.forEach((animation, element) => {
    if (element.contains(event.target)) { animation.cancel(); animations.delete(element); }
  }));
  reduce.addEventListener('change', policyChanged);
  fine.addEventListener('change', schedule);
  mobile.addEventListener('change', () => { syncVideo(); schedule(); });
  if (connection && connection.addEventListener) connection.addEventListener('change', policyChanged);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || mobile.matches || !enabled()) return;
    const r = hero.getBoundingClientRect();
    pointerX = (event.clientX - r.left) / r.width - .5;
    pointerY = (event.clientY - r.top) / r.height - .5;
    schedule();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (!inView) stopFrame();
      syncVideo(); schedule();
    }, { threshold: 0 }).observe(hero);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (!enabled() || document.hidden || entry.boundingClientRect.top < 80 || !entry.target.animate || entry.target.contains(document.activeElement)) return;
      const animation = entry.target.animate([
        { opacity: 0, transform: 'translateY(14px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'none' });
      animations.set(entry.target, animation);
      animation.finished.then(() => animations.delete(entry.target)).catch(() => animations.delete(entry.target));
    }), { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('[data-cinema-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top >= window.innerHeight) observer.observe(el);
    });
  }
  function begin() {
    const start = () => { ready = true; syncVideo(); };
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 250);
  }
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, { once: true });
  policyChanged();
})();
