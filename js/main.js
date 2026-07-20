/* Smith Made — site behavior. Reads owner settings from js/manifest.js
   (window.SMITH_MADE) and progressively enhances the static page.
   The 3D scene and scroll animation live in js/scene.js; this file stays
   dependency-free so contact details and booking work no matter what. */

(function () {
  "use strict";

  var config = window.SMITH_MADE || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ask the scene (if it booted) to re-measure section anchors after
     anything that changes page height — filters, gallery, photo swaps. */
  function refreshScene() {
    if (typeof window.__smRefresh === "function") window.__smRefresh();
  }

  /* ---- Mobile navigation ------------------------------------------------ */

  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Footer year ------------------------------------------------------ */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Contact details from the manifest -------------------------------- */

  document.querySelectorAll("[data-contact-email]").forEach(function (link) {
    if (config.email) {
      link.href = "mailto:" + config.email;
      link.textContent = config.email;
    }
  });

  var phone = document.querySelector("[data-contact-phone]");
  if (phone && config.phone) {
    phone.href = "tel:" + config.phone.replace(/[^+\d]/g, "");
    phone.textContent = config.phone;
    phone.hidden = false;
  }

  var instagram = document.querySelector("[data-contact-instagram]");
  if (instagram && config.instagram) {
    instagram.href = config.instagram;
    instagram.hidden = false;
  }

  /* ---- Hero: poster upgrade + optional background video ------------------ */

  var heroMedia = document.querySelector("[data-hero-media]");
  var heroPoster = document.querySelector("[data-hero-poster]");

  /* No real photo or video yet? Hide the card — the 3D sign carries the
     hero until the owner drops a real shot into the manifest. */
  if (heroMedia && !config.heroPoster && !config.heroVideo) {
    heroMedia.hidden = true;
  }

  if (heroPoster && config.heroPoster) {
    var poster = new Image();
    poster.onload = function () {
      heroPoster.src = config.heroPoster;
      heroPoster.classList.add("has-photo");
    };
    poster.src = config.heroPoster;
  }

  /* Only attempt video when the owner has supplied one, the visitor hasn't
     asked for reduced motion, and they aren't on a data-saver connection. */
  var connection = navigator.connection || {};
  if (heroMedia && config.heroVideo && !reducedMotion && !connection.saveData) {
    var video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "metadata";
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;
    if (config.heroPoster) video.poster = config.heroPoster;

    video.addEventListener("canplay", function () {
      video.classList.add("is-playing");
    });
    video.addEventListener("error", function () {
      video.remove(); /* fall back to the still image, no fuss */
    });

    video.src = config.heroVideo;
    heroMedia.appendChild(video);

    var playing = video.play();
    if (playing && playing.catch) {
      playing.catch(function () { video.remove(); });
    }
  }

  /* ---- Catalog photos: swap in real photos from the manifest ------------- */

  var photos = config.photos || {};
  document.querySelectorAll("[data-piece-photo]").forEach(function (img) {
    var src = photos[img.getAttribute("data-piece-photo")];
    if (!src) return;
    /* Preload, then swap — the placeholder stays visible until the real
       photo is ready, so there's never a blank card. */
    var real = new Image();
    real.onload = function () {
      img.src = src;
      img.classList.add("has-photo");
    };
    real.src = src;
  });

  /* ---- Booking: date-hold payment link + per-piece Book buttons ---------- */

  var holdCallout = document.querySelector("[data-hold-callout]");
  var holdLink = document.querySelector("[data-hold-link]");
  if (holdCallout && holdLink && config.dateHoldUrl) {
    holdLink.href = config.dateHoldUrl;
    holdCallout.hidden = false;
  }

  function scrollToEl(el) {
    if (window.__smLenis) window.__smLenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  }

  var inquiryForm = document.querySelector("[data-inquiry-form]");
  document.querySelectorAll("[data-book]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!inquiryForm) return;
      var box = inquiryForm.querySelector('input[name="pieces"][value="' + button.getAttribute("data-book") + '"]');
      if (box) box.checked = true;
      var message = inquiryForm.querySelector("#f-message");
      var note = "Booking: " + button.getAttribute("data-piece");
      if (message && message.value.indexOf(note) === -1) {
        message.value = (message.value ? message.value + "\n" : "") + note;
      }
      scrollToEl(document.getElementById("inquire"));
      var names = inquiryForm.querySelector("#f-names");
      if (names) names.focus({ preventScroll: true });
    });
  });

  /* ---- Catalog filter chips ---------------------------------------------- */

  var chips = document.querySelectorAll(".chip[data-filter]");
  var catalogPieces = document.querySelectorAll(".piece[data-cats]");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      catalogPieces.forEach(function (piece) {
        piece.hidden = filter !== "all" &&
          piece.getAttribute("data-cats").split(" ").indexOf(filter) === -1;
      });
      refreshScene();
    });
  });

  /* ---- Gallery: built entirely from the manifest ------------------------- */

  var gallerySection = document.querySelector("[data-gallery-section]");
  var galleryList = document.querySelector("[data-gallery-list]");
  var galleryPhotos = Array.isArray(config.gallery) ? config.gallery.filter(Boolean) : [];

  if (gallerySection && galleryList && galleryPhotos.length) {
    galleryPhotos.forEach(function (src, index) {
      var item = document.createElement("li");
      var img = document.createElement("img");
      img.src = src;
      img.alt = "Smith Made piece at a wedding — gallery photo " + (index + 1);
      img.loading = "lazy";
      img.width = 600;
      img.height = 600;
      img.addEventListener("error", function () { item.remove(); }, { once: true });
      item.appendChild(img);
      galleryList.appendChild(item);
    });

    gallerySection.hidden = false;
    document.querySelectorAll("[data-gallery-link]").forEach(function (link) {
      link.hidden = false;
    });
    refreshScene();
  }
})();
