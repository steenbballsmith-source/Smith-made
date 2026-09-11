/* Finish viewer: keep the current image visible until the next one is ready. */
(function () {
  'use strict';
  var opener = null, looks = [], index = 0, requestId = 0, closeTimer = 0;
  var displayedLook = null;
  var pieceName = 'Smith Made piece', bookButton = null;
  var background = [];
  var box = document.createElement('div');
  box.className = 'staged';
  box.id = 'staged';
  box.id = 'staged';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Piece shown staged');
  box.hidden = true;
  box.innerHTML =
    '<div class="staged-backdrop" data-staged-close></div>' +
    '<div class="staged-panel">' +
      '<button class="staged-close" type="button" data-staged-close aria-label="Close image viewer">&times;</button>' +
      '<div class="staged-frame" aria-busy="false">' +
        '<img class="staged-img" alt="" decoding="async">' +
        '<button class="staged-arrow prev" type="button" data-staged-step="-1" aria-label="Previous finish">&#8249;</button>' +
        '<button class="staged-arrow next" type="button" data-staged-step="1" aria-label="Next finish">&#8250;</button>' +
      '</div>' +
      '<p class="staged-finish" aria-live="polite"></p>' +
      '<p class="staged-note">Styled design render. Your quote confirms the finish and included items.</p>' +
      '<div class="staged-dots" role="group" aria-label="Choose a finish"></div>' +
      '<button class="btn staged-inquire" type="button" data-staged-inquire>Ask about this finish</button>' +
    '</div>';
  document.body.appendChild(box);
  var img = box.querySelector('.staged-img');
  var frame = box.querySelector('.staged-frame');
  var finishLine = box.querySelector('.staged-finish');
  var dots = box.querySelector('.staged-dots');
  var arrows = box.querySelectorAll('.staged-arrow');
  function noMotion() {
    return matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-paused');
  }
  function show(i) {
    index = (i + looks.length) % looks.length;
    var look = looks[index];
    if (look === displayedLook && !img.classList.contains('is-loading') && !img.classList.contains('is-failed')) return;
    var currentRequest = ++requestId;
    var loader = new Image();
    var fallback = false;
    img.classList.add('is-loading');
    frame.setAttribute('aria-busy', 'true');
    finishLine.textContent = look.finish + ' · Loading…';
    dots.querySelectorAll('button').forEach(function (dot, n) {
      dot.setAttribute('aria-pressed', String(n === index));
      dot.classList.toggle('is-active', n === index);
    });
    loader.onload = function () {
      var decoded = loader.decode ? loader.decode().catch(function () {}) : Promise.resolve();
      decoded.then(function () {
        if (currentRequest !== requestId || box.hidden) return;
        img.src = loader.src;
        img.alt = look.alt || ('Smith Made piece staged in ' + look.finish);
        img.classList.remove('is-loading', 'is-failed');
        displayedLook = look;
        frame.setAttribute('aria-busy', 'false');
        finishLine.textContent = pieceName + ' · ' + look.finish;
        if (window.smTrack) {
          var piece = opener && opener.closest('li.piece');
          window.smTrack('finish_view', { piece: piece && piece.id ? piece.id.replace(/^piece-/, '') : '', finish: look.finish });
        }
      });
    };
    loader.onerror = function () {
      if (currentRequest !== requestId) return;
      if (!fallback && look.src && look.webp && look.src !== look.webp) {
        fallback = true;
        loader.src = look.src;
        return;
      }
      img.classList.remove('is-loading');
      img.classList.add('is-failed');
      frame.setAttribute('aria-busy', 'false');
      finishLine.textContent = 'This image did not load. Try another finish or close the viewer.';
    };
    loader.src = look.webp || look.src;
  }
  function open(trigger) {
    var nextLooks;
    try { nextLooks = JSON.parse(trigger.getAttribute('data-staged')); } catch (_) { return; }
    if (!Array.isArray(nextLooks)) return;
    nextLooks = nextLooks.filter(function (look) { return look && (look.src || look.webp); });
    if (!nextLooks.length) return;
    nextLooks.forEach(function (look) { if (!look.finish) look.finish = 'Design view'; });
    clearTimeout(closeTimer);
    looks = nextLooks;
    displayedLook = null;
    opener = trigger;
    dots.innerHTML = '';
    looks.forEach(function (look, n) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', look.finish || 'Finish ' + (n + 1));
      dot.addEventListener('click', function () { show(n); });
      dots.appendChild(dot);
    });
    dots.hidden = looks.length < 2;
    arrows.forEach(function (a) { a.hidden = looks.length < 2; });
    var piece = trigger.closest('li.piece');
    var heading = piece && piece.querySelector('h3');
    pieceName = heading ? heading.textContent.trim() : 'Smith Made piece';
    bookButton = piece && piece.querySelector('[data-book]');
    box.querySelector('[data-staged-inquire]').hidden = !bookButton;
    box.setAttribute('aria-label', pieceName + ' design finishes');
    img.classList.add('is-failed');
    box.hidden = false;
    box.inert = false;
    document.body.classList.add('staged-open');
    background = Array.from(document.body.children).filter(function (el) {
      return el !== box && !['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName);
    }).map(function (el) { return { element: el, inert: el.inert }; });
    box.querySelector('.staged-close').focus({ preventScroll: true });
    background.forEach(function (item) { item.element.inert = true; });
    box.getBoundingClientRect();
    box.classList.add('is-open');
    show(0);
  }
  function finishClose() {
    clearTimeout(closeTimer);
    box.hidden = true;
    box.inert = false;
    document.body.classList.remove('staged-open');
    background.forEach(function (item) { item.element.inert = item.inert; });
    background = [];
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  }
  window.addEventListener('pagehide', function () {
    if (box.hidden) return;
    ++requestId;
    box.classList.remove('is-open');
    finishClose();
  });
  function close(immediate) {
    if (!box.classList.contains('is-open')) return;
    ++requestId;
    box.classList.remove('is-open');
    box.inert = true;
    if (immediate || noMotion()) finishClose();
    else closeTimer = setTimeout(finishClose, 300);
  }
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-staged]');
    if (trigger && !box.contains(trigger) && box.hidden) open(trigger);
  });
  box.addEventListener('click', function (event) {
    if (event.target.closest('[data-staged-close]')) return close();
    if (event.target.closest('[data-staged-inquire]') && bookButton) {
      var target = bookButton;
      var note = 'Interested in finish: ' + pieceName + ' — ' + looks[index].finish;
      // Restore the page before moving focus. Reopen a completed form before adding its new finish.
      close(true);
      target.click();
      var message = document.querySelector('[data-inquiry-form] #f-message');
      if (message && message.value.indexOf(note) === -1) {
        message.value += (message.value ? '\n' : '') + note;
        message.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    var step = event.target.closest('[data-staged-step]');
    if (step) show(index + Number(step.getAttribute('data-staged-step')));
  });
  document.addEventListener('keydown', function (event) {
    if (box.hidden || box.inert) return;
    if (event.key === 'Escape') { event.preventDefault(); return close(); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      return show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key !== 'Tab') return;
    var stops = Array.from(box.querySelectorAll('button:not([hidden])')).filter(function (el) { return el.offsetParent !== null; });
    var first = stops[0], last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  var startTouch = null;
  frame.addEventListener('touchstart', function (event) {
    var touch = event.touches[0];
    startTouch = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  frame.addEventListener('touchend', function (event) {
    if (!startTouch || looks.length < 2) { startTouch = null; return; }
    var touch = event.changedTouches[0];
    var dx = touch.clientX - startTouch.x, dy = touch.clientY - startTouch.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.25) show(index + (dx < 0 ? 1 : -1));
    startTouch = null;
  }, { passive: true });
  frame.addEventListener('touchcancel', function () { startTouch = null; }, { passive: true });
})();
