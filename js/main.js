/* Smith Made — site behavior. Reads owner settings from js/manifest.js
   (window.SMITH_MADE) and progressively enhances the static page. */

(function () {
  "use strict";

  var config = window.SMITH_MADE || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile navigation ------------------------------------------------ */

  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".site-nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
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
    var placeholder = img.src;
    img.addEventListener("error", function () { img.src = placeholder; }, { once: true });
    img.src = src;
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
  }
})();
