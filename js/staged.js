/* ============================================================
   SMITH MADE — STAGED VIEWER
   Tap a piece to see it staged, larger, in each finish we build
   it in. No dependencies; the page works fine without this file.
   ============================================================ */
(function () {
  "use strict";

  var lenis = null;
  var opener = null;
  var looks = [];
  var index = 0;

  /* ---- the overlay, built once, on first use --------------------------- */
  var box = document.createElement("div");
  box.className = "staged";
  box.id = "staged";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Piece shown staged");
  box.hidden = true;
  box.innerHTML =
    '<div class="staged-backdrop" data-staged-close></div>' +
    '<div class="staged-panel">' +
      '<button class="staged-close" type="button" data-staged-close aria-label="Close">&times;</button>' +
      '<div class="staged-frame">' +
        '<img class="staged-img" alt="">' +
        '<button class="staged-arrow prev" type="button" data-staged-step="-1" aria-label="Previous finish">&#8249;</button>' +
        '<button class="staged-arrow next" type="button" data-staged-step="1" aria-label="Next finish">&#8250;</button>' +
      '</div>' +
      '<p class="staged-finish" aria-live="polite"></p>' +
      '<p class="staged-note">Styled design render &middot; every piece is built new to order, ' +
        'in the finish you choose</p>' +
      '<div class="staged-dots" role="tablist" aria-label="Finishes"></div>' +
    '</div>';
  document.body.appendChild(box);

  var img = box.querySelector(".staged-img");
  var finishLine = box.querySelector(".staged-finish");
  var dots = box.querySelector(".staged-dots");
  var arrows = box.querySelectorAll(".staged-arrow");

  function show(i) {
    index = (i + looks.length) % looks.length;
    var look = looks[index];
    img.src = look.src;
    img.alt = "Smith Made piece staged — " + look.finish;
    finishLine.textContent = look.finish;
    dots.querySelectorAll("button").forEach(function (dot, n) {
      dot.setAttribute("aria-selected", String(n === index));
      dot.classList.toggle("is-active", n === index);
    });
  }

  function open(trigger) {
    try {
      looks = JSON.parse(trigger.getAttribute("data-staged"));
    } catch (err) {
      return;                                  /* never break the page */
    }
    if (!looks || !looks.length) return;

    opener = trigger;
    dots.innerHTML = "";
    looks.forEach(function (look, n) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", look.finish);
      dot.addEventListener("click", function () { show(n); });
      dots.appendChild(dot);
    });
    var many = looks.length > 1;
    dots.hidden = !many;
    arrows.forEach(function (a) { a.hidden = !many; });

    show(0);
    box.hidden = false;
    document.body.classList.add("staged-open");
    lenis = window.__smLenis || null;
    if (lenis && lenis.stop) lenis.stop();
    box.querySelector(".staged-close").focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("staged-open");
    if (lenis && lenis.start) lenis.start();
    if (opener) opener.focus();
    opener = null;
  }

  /* Delegated, so gallery items built later by main.js work too. */
  document.addEventListener("click", function (event) {
    var trigger = event.target.closest("[data-staged]");
    if (trigger && !box.contains(trigger)) open(trigger);
  });

  box.addEventListener("click", function (event) {
    if (event.target.closest("[data-staged-close]")) return close();
    var step = event.target.closest("[data-staged-step]");
    if (step) show(index + Number(step.getAttribute("data-staged-step")));
  });

  document.addEventListener("keydown", function (event) {
    if (box.hidden) return;
    if (event.key === "Escape") return close();
    if (event.key === "ArrowRight") return show(index + 1);
    if (event.key === "ArrowLeft") return show(index - 1);

    /* Keep Tab inside the dialog — otherwise focus wanders onto the page
       behind the backdrop, where a keyboard user can't see where they are. */
    if (event.key !== "Tab") return;
    var stops = [].slice.call(box.querySelectorAll("button:not([hidden])"))
      .filter(function (el) { return el.offsetParent !== null; });
    if (!stops.length) return;
    var first = stops[0];
    var last = stops[stops.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* swipe, for the phones this is mostly used on */
  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX === null || looks.length < 2) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();
