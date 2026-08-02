/* Smith Made — site behavior. Reads owner settings from js/manifest.js
   (window.SMITH_MADE) and progressively enhances the static page.
   The 3D scene and scroll animation live in js/scene.js; this file stays
   dependency-free so contact details and booking work no matter what. */

(function () {
  "use strict";

  var config = window.SMITH_MADE || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Ask the scene (if it booted) to re-measure section anchors after
     anything that changes page height — gallery updates or photo swaps. */
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

  /* Skip the preload-and-swap when the manifest names the file the markup
     already ships: the fetch is redundant (340 KB of JPEG the <picture> never
     displays) and the fade would replay over an already-visible hero. Mirrors
     the guard inside dropWebpSources(). */
  if (heroPoster && config.heroPoster && heroPoster.getAttribute("src") !== config.heroPoster) {
    var poster = new Image();
    poster.onload = function () {
      dropWebpSources(heroPoster, config.heroPoster);
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
  /* A <picture> carrying a WebP source, or a plain fragment when there
     isn't one — so callers can append the <img> either way. */
  function webpFrame(webpSrc) {
    if (!webpSrc) return document.createDocumentFragment();
    var picture = document.createElement("picture");
    var source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = webpSrc;
    picture.appendChild(source);
    return picture;
  }

  /* A <picture> would keep serving our WebP over an owner's uploaded photo,
     so drop the <source> before swapping in a file from the manifest. */
  function dropWebpSources(img, nextSrc) {
    /* If the manifest points at the same file the markup already has, leave
       the <source> alone — dropping it there would throw away the WebP (and
       waste the hero preload) for no reason. */
    if (nextSrc && img.getAttribute("src") === nextSrc) return;
    var parent = img.parentElement;
    if (parent && parent.tagName === "PICTURE") {
      parent.querySelectorAll("source").forEach(function (source) { source.remove(); });
    }
  }

  document.querySelectorAll("[data-piece-photo]").forEach(function (img) {
    var src = photos[img.getAttribute("data-piece-photo")];
    if (!src) return;
    /* Preload, then swap — the placeholder stays visible until the real
       photo is ready, so there's never a blank card. */
    var real = new Image();
    real.onload = function () {
      dropWebpSources(img, src);
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

  /* ---- Phone action bar: appears once the hero is behind you ------------- */

  var actionBar = document.querySelector("[data-action-bar]");
  var actionCall = document.querySelector("[data-action-call]");
  if (actionBar) {
    if (actionCall && config.phone) {
      actionCall.href = "tel:" + config.phone.replace(/[^+\d]/g, "");
      actionCall.hidden = false;
    }
    var hero = document.getElementById("hero");
    if (hero && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        /* visible hero -> no bar; the opening screen stays uncluttered */
        actionBar.hidden = entries[0].isIntersecting;
      }, { rootMargin: "-70% 0px 0px 0px" }).observe(hero);
    } else {
      actionBar.hidden = false;
    }
  }

  /* ---- Reviews: real ones only, straight from the manifest --------------- */

  var reviewsSection = document.querySelector("[data-reviews-section]");
  var reviewsList = document.querySelector("[data-reviews-list]");
  var reviews = Array.isArray(config.reviews) ? config.reviews.filter(Boolean) : [];

  if (reviewsSection && reviewsList && reviews.length) {
    reviews.forEach(function (review) {
      if (!review.text) return;
      var item = document.createElement("li");
      var quote = document.createElement("blockquote");
      quote.textContent = review.text;
      item.appendChild(quote);

      var credit = [review.name, review.venue, review.date].filter(Boolean).join(" · ");
      if (credit) {
        var cite = document.createElement("cite");
        cite.textContent = credit;
        item.appendChild(cite);
      }
      reviewsList.appendChild(item);
    });

    if (reviewsList.children.length) {
      reviewsSection.hidden = false;
      document.querySelectorAll("[data-reviews-link]").forEach(function (link) {
        link.hidden = false;
      });
      refreshScene();
    }
  }

  /* ---- Gallery: built entirely from the manifest ------------------------- */

  var gallerySection = document.querySelector("[data-gallery-section]");
  var galleryList = document.querySelector("[data-gallery-list]");
  var galleryPhotos = Array.isArray(config.gallery) ? config.gallery.filter(Boolean) : [];

  if (gallerySection && galleryList && galleryPhotos.length) {
    galleryPhotos.forEach(function (entry, index) {
      /* an entry is either "path/to.jpg" or { src: "...", finish: "..." } */
      var src = typeof entry === "string" ? entry : entry.src;
      var finish = typeof entry === "string" ? "" : entry.finish || "";
      if (!src) return;

      var item = document.createElement("li");
      var figure = document.createElement("figure");

      /* Our own staged-*.jpg renders ship with a WebP sibling; offer it. An
         owner-uploaded photo gets a plain <img>, so a file we never made
         can't 404 inside a <source> and break their picture. */
      var ours = /\/staged-[^/]+\.jpg$/.test(src);
      var webp = ours ? src.replace(/\.jpg$/, ".webp") : "";
      var frame = webpFrame(webp);
      var img = document.createElement("img");
      img.src = src;
      img.alt = finish
        ? "Smith Made design render — " + finish
        : "Smith Made design render — lookbook image " + (index + 1);
      img.loading = "lazy";
      img.width = 600;
      img.height = 450;
      img.addEventListener("error", function () { item.remove(); }, { once: true });

      /* Visitors try to tap a photo this size, so let them: the same staged
         viewer the collection cards use opens with this one image. */
      var opener = document.createElement("button");
      opener.type = "button";
      opener.className = "gallery-open";
      opener.setAttribute("data-staged", JSON.stringify([
        { src: src, webp: webp, finish: finish || "Styled design render" },
      ]));
      opener.setAttribute("aria-label", "See this render larger"
        + (finish ? " — " + finish : ""));
      frame.appendChild(img);
      opener.appendChild(frame);
      figure.appendChild(opener);
      if (finish) {
        var caption = document.createElement("figcaption");
        caption.textContent = finish;
        figure.appendChild(caption);
      }
      item.appendChild(figure);
      galleryList.appendChild(item);
    });

    gallerySection.hidden = false;
    document.querySelectorAll("[data-gallery-link]").forEach(function (link) {
      link.hidden = false;
    });
    refreshScene();
  }
})();
