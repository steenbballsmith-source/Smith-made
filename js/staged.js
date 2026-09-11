/* ============================================================
   SMITH MADE — STAGED VIEWER
   Tap a piece to see it staged, larger, in each finish we build
   it in. No dependencies; the page works fine without this file.
   ============================================================ */
(function () {
  "use strict";

  var opener = null;
  var looks = [];
  var index = 0;
  var pieceName = "Smith Made piece";
  var bookButton = null;

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
      '<p class="staged-note">Styled design render &middot; finish, lettering, included items, ' +
        'and availability are confirmed in your written quote.</p>' +
      '<div class="staged-dots" role="group" aria-label="Choose a finish"></div>' +
      '<button class="btn staged-inquire" type="button" data-staged-inquire>Ask about this finish</button>' +
    '</div>';
  document.body.appendChild(box);

  var img = box.querySelector(".staged-img");
  var finishLine = box.querySelector(".staged-finish");
  var dots = box.querySelector(".staged-dots");
  var arrows = box.querySelectorAll(".staged-arrow");
  var inquire = box.querySelector("[data-staged-inquire]");

  function show(i) {
    index = (i + looks.length) % looks.length;
    var look = looks[index];
    /* Prefer the WebP; if it is missing for any reason, drop back to the
       JPEG once rather than showing a broken frame. */
    img.onerror = function () {
      img.onerror = null;
      if (look.src && img.getAttribute("src") !== look.src) img.src = look.src;
    };
    img.src = look.webp || look.src;
    img.alt = look.alt || ("Smith Made piece staged — " + look.finish);
    finishLine.textContent = pieceName + " · " + look.finish;
    /* Analytics (no personal data): which piece + finish was viewed. */
    if (window.smTrack) {
      var pieceLi = opener && opener.closest("li.piece");
      window.smTrack("finish_view", {
        piece: pieceLi && pieceLi.id ? pieceLi.id.replace(/^piece-/, "") : "",
        finish: look.finish
      });
    }
    dots.querySelectorAll("button").forEach(function (dot, n) {
      dot.setAttribute("aria-pressed", String(n === index));
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
    var piece = trigger.closest("li.piece");
    var heading = piece && piece.querySelector("h3");
    pieceName = heading ? heading.textContent.trim() : "Smith Made piece";
    bookButton = piece && piece.querySelector("[data-book]");
    box.setAttribute("aria-label", pieceName + " design finishes");
    inquire.hidden = !bookButton;
    dots.innerHTML = "";
    looks.forEach(function (look, n) {
      var dot = document.createElement("button");
      dot.type = "button";
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
    box.querySelector(".staged-close").focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("staged-open");
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
    if (event.target.closest("[data-staged-inquire]") && bookButton) {
      var target = bookButton;
      var note = "Interested in finish: " + pieceName + " — " + looks[index].finish;
      var message = document.querySelector("[data-inquiry-form] #f-message");
      if (message && message.value.indexOf(note) === -1) {
        message.value += (message.value ? "\n" : "") + note;
      }
      close();
      target.click(); // Selects the existing inquiry category; never submits.
      return;
    }
    var step = event.target.closest("[data-staged-step]");
    if (step) show(index + Number(step.getAttribute("data-staged-step")));
  });

  document.addEventListener("keydown", function (event) {
    if (box.hidden) return;
    if (event.key === "Escape") { event.preventDefault(); return close(); }
    if (event.key === "ArrowRight") { event.preventDefault(); return show(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); return show(index - 1); }

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
