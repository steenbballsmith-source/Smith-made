/* Smith Made — site behavior. Reads owner settings from js/manifest.js
   (window.SMITH_MADE) and progressively enhances the static page.
   The Processional scene and scroll animation live in js/scene.js; this file stays
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
    var menu = document.getElementById("nav-menu");
    var compactNav = window.matchMedia("(max-width: 1100px)");
    function fitMenu() {
      if (!menu || !compactNav.matches || !nav.classList.contains("menu-open")) return;
      var viewport = window.visualViewport;
      var top = menu.getBoundingClientRect().top - (viewport ? viewport.offsetTop : 0);
      menu.style.maxHeight = Math.max(0, (viewport ? viewport.height : window.innerHeight) - top - 12) + "px";
    }
    function setMenu(open) {
      nav.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      if (menu) menu.inert = compactNav.matches && !open;
      if (open) fitMenu();
      else if (menu) menu.style.maxHeight = "";
    }
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("menu-open")); });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !nav.classList.contains("menu-open")) return;
      setMenu(false);
      toggle.focus();
    });
    compactNav.addEventListener("change", function () { setMenu(false); });
    nav.addEventListener("focusout", function (event) {
      if (event.relatedTarget && !nav.contains(event.relatedTarget)) setMenu(false);
    });
    window.addEventListener("resize", fitMenu, { passive: true });
    window.addEventListener("scroll", fitMenu, { passive: true });
    if (window.visualViewport) window.visualViewport.addEventListener("resize", fitMenu, { passive: true });
    setMenu(false);
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

  /* No real photo or video yet? Hide the card — the built-in scene carries the
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
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("motion-paused") ? "instant" : "smooth" });
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

  // Product pages can prefill an inquiry without submitting it.
  var productChoices = {"arched-welcome": {"category": "Welcome sign", "name": "The Arched Welcome"}, "seating-chart-wall": {"category": "Seating chart", "name": "Seating Chart Wall"}, "champagne-wall": {"category": "Champagne wall", "name": "Champagne Wall"}, "grand-arch-welcome-wall": {"category": "Welcome sign", "name": "Grand Arch Welcome Wall"}, "ceremony-arch-set": {"category": "Arch set", "name": "Ceremony Arch Set"}, "slat-backdrop": {"category": "Backdrop", "name": "Slat Monogram Backdrop"}, "mobile-bar": {"category": "Bar", "name": "The Mobile Bar"}, "display-wall": {"category": "Backdrop", "name": "The Display Wall"}};
  var selectedPiece = new URLSearchParams(window.location.search).get("piece");
  if (inquiryForm && Object.prototype.hasOwnProperty.call(productChoices, selectedPiece)) {
    var choice = productChoices[selectedPiece];
    inquiryForm.querySelectorAll('input[name="pieces"]').forEach(function (box) {
      if (box.value === choice.category) box.checked = true;
    });
    var inquiryMessage = inquiryForm.querySelector("#f-message");
    if (inquiryMessage && !inquiryMessage.value) inquiryMessage.value = "Interested in: " + choice.name;
  }

  // A planner link selects a role only. Never replace a visitor's entry or send.
  var inquiryKind = new URLSearchParams(window.location.search).get("inquiry");
  if (inquiryForm && (inquiryKind === "planner" || inquiryKind === "venue")) {
    var planningRole = inquiryForm.querySelector("#f-role");
    if (planningRole && !planningRole.value) {
      planningRole.value = inquiryKind === "planner" ? "Planner / coordinator" : "Venue team";
    }
  }

  /* ---- Email action bar: appears once the hero is behind you ------------- */

  var actionBar = document.querySelector("[data-action-bar]");
  var actionEmail = document.querySelector("[data-action-email]");
  if (actionBar) {
    if (actionEmail && config.email) {
      actionEmail.href = "mailto:" + config.email;
    }
    var hero = document.getElementById("hero");
    var inquirySection = document.getElementById("inquire");
    if (hero && "IntersectionObserver" in window) {
      var heroVisible = true, inquiryVisible = false;
      function syncActionBar() { actionBar.hidden = heroVisible || inquiryVisible; }
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        syncActionBar();
      }, { threshold: 0 }).observe(hero);
      if (inquirySection) new IntersectionObserver(function (entries) {
        inquiryVisible = entries[0].isIntersecting;
        syncActionBar();
      }, { threshold: 0 }).observe(inquirySection);
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
