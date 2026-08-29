/* Smith Made — The Experience (experience.html).
   A film the visitor plays with their scroll. Two picture sources, one engine:
   - sequence mode (default): the staged renders crossfade and drift as the
     visitor scrubs — no video file needed, works today.
   - film mode: when js/manifest.js names experienceFilm, that video is
     scrubbed frame-by-frame onto a canvas; the chapter captions ride on top.
   Degrades gracefully: no JS -> a readable editorial page; reduced motion or
   no GSAP -> the same static page (body.xp-static); data-saver -> no video. */

(function () {
  "use strict";

  var cfg = window.SMITH_MADE || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var saveData = (navigator.connection || {}).saveData === true;

  document.body.classList.remove("no-js");

  /* ---- dependency-free basics (mirrors js/main.js) ---------------------- */

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

  function updateNav() {
    if (nav) nav.classList.toggle("scrolled", (window.scrollY || 0) > 60);
  }
  window.addEventListener("scroll", updateNav, { passive: true });
  updateNav();

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  document.querySelectorAll("[data-contact-email]").forEach(function (link) {
    if (cfg.email) {
      link.href = "mailto:" + cfg.email;
      link.textContent = cfg.email;
    }
  });

  if (reduced || !hasGsap) {
    document.body.classList.add("xp-static");
    return; /* the static page is the whole experience — and it reads fine */
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("xp-on");

  /* ---- smooth scroll (same tuning as the home page) --------------------- */

  var lenis = null;
  if (typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  document.querySelectorAll("[data-scroll]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, "", id);
      if (lenis) lenis.scrollTo(el, { duration: 1.6 });
      else el.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---- content reveals -------------------------------------------------- */

  document.querySelectorAll("[data-reveal]").forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 42 },
      { opacity: 1, y: 0, duration: 1.05, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } });
  });

  /* ---- hero: parallax layers + pointer tilt ----------------------------- */

  var hero = document.getElementById("xp-hero");
  var heroWord = document.querySelector("[data-xp-word]");
  var heroFigure = document.querySelector("[data-xp-figure]");
  var heroCard = document.querySelector("[data-xp-tilt]");

  if (hero && heroWord) {
    gsap.to(heroWord, { yPercent: 32, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }
  if (hero && heroFigure) {
    gsap.to(heroFigure, { y: -70, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }
  if (hero && heroCard && window.matchMedia("(pointer: fine)").matches) {
    var tiltTarget = { rx: 0, ry: 0 };
    var tiltNow = { rx: 0, ry: 0 };
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      tiltTarget.rx = ny * -5;
      tiltTarget.ry = nx * 7;
    });
    hero.addEventListener("mouseleave", function () {
      tiltTarget.rx = 0;
      tiltTarget.ry = 0;
    });
    gsap.ticker.add(function () {
      tiltNow.rx += (tiltTarget.rx - tiltNow.rx) * 0.08;
      tiltNow.ry += (tiltTarget.ry - tiltNow.ry) * 0.08;
      heroCard.style.transform =
        "perspective(900px) rotateX(" + tiltNow.rx.toFixed(3) + "deg) rotateY(" + tiltNow.ry.toFixed(3) + "deg)";
    });
  }

  /* ---- the film --------------------------------------------------------- */

  var stage = document.querySelector("[data-xp-stage]");
  var stageInner = document.querySelector("[data-xp-pin]");
  var scenes = stageInner ? Array.prototype.slice.call(stageInner.querySelectorAll("[data-scene]")) : [];
  var fill = document.querySelector("[data-xp-fill]");
  var ticks = Array.prototype.slice.call(document.querySelectorAll("[data-xp-tick]"));

  var FADE = 0.35;         /* how much of a chapter the crossfade borrows   */
  var sceneImgs = scenes.map(function (s) { return s.querySelector("img"); });
  var chapters = scenes.map(function (s) { return s.querySelector(".xp-chapter"); });

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { return v * v * (3 - 2 * v); }

  /* film mode state (armed only if the manifest names a video) */
  var film = { video: null, ctx: null, canvas: null, on: false, target: 0, current: 0 };

  function setProgress(p) {
    var n = scenes.length;
    if (!n) return;

    for (var i = 0; i < n; i++) {
      var x = p * n - i; /* 0 = this chapter starts, 1 = it ends */
      var tIn = i === 0 ? 1 : (x + FADE) / FADE;
      var tOut = i === n - 1 ? 1 : (1 - x) / FADE;
      var o = smooth(clamp01(Math.min(tIn, tOut)));

      var scene = scenes[i];
      scene.style.opacity = o;
      scene.style.pointerEvents = o > 0.5 ? "auto" : "none";

      /* slow push-in with a hint of drift — the "3D-like" life in each frame */
      var life = clamp01((x + FADE) / (1 + FADE));
      var img = sceneImgs[i];
      if (img) {
        var scale = 1.14 - 0.1 * life;
        var pan = (i % 2 ? 1 : -1) * (life - 0.5) * 2.4;
        img.style.transform = "translate3d(" + pan.toFixed(3) + "%,0,0) scale(" + scale.toFixed(4) + ")";
      }

      var chapter = chapters[i];
      if (chapter) {
        chapter.style.opacity = o;
        chapter.style.transform = "translate3d(0," + ((1 - o) * 30).toFixed(2) + "px,0)";
      }
    }

    if (fill) fill.style.transform = "scaleY(" + p + ")";
    var active = Math.min(n - 1, Math.floor(p * n));
    ticks.forEach(function (t, idx) { t.classList.toggle("active", idx === active); });

    if (film.on && film.video && film.video.duration) {
      film.target = p * Math.max(0, film.video.duration - 0.05);
    }
  }

  if (stage && stageInner && scenes.length) {
    ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: "+=" + scenes.length * 120 + "%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: function (self) { setProgress(self.progress); },
      onRefresh: function (self) { setProgress(self.progress); },
    });
    setProgress(0);

    /* the scrub needs every frame ready before it's reached */
    sceneImgs.forEach(function (img) {
      if (!img) return;
      img.loading = "eager";
      if (img.decode) img.decode().catch(function () {});
    });
  }

  /* ---- film mode: scrub a real video when the owner supplies one -------- */

  function fitCanvas() {
    if (!film.canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    film.canvas.width = Math.round(film.canvas.clientWidth * dpr);
    film.canvas.height = Math.round(film.canvas.clientHeight * dpr);
  }

  function drawFilm() {
    var v = film.video;
    if (!v || v.readyState < 2 || !film.ctx) return;
    var W = film.canvas.width;
    var H = film.canvas.height;
    var vw = v.videoWidth;
    var vh = v.videoHeight;
    if (!vw || !vh || !W || !H) return;
    var scale = Math.max(W / vw, H / vh); /* cover */
    var dw = vw * scale;
    var dh = vh * scale;
    film.ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }

  function filmTick() {
    var v = film.video;
    if (!v) return;
    film.current += (film.target - film.current) * 0.18;
    if (Math.abs(film.current - film.target) > 0.002 && !v.seeking && v.readyState >= 1) {
      v.currentTime = film.current;
    }
    drawFilm();
  }

  if (stageInner && cfg.experienceFilm && !saveData) {
    var video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("aria-hidden", "true");
    video.tabIndex = -1;

    var armFilm = function () {
      if (film.on || !video.duration || !isFinite(video.duration)) return;
      film.canvas = stageInner.querySelector("[data-xp-canvas]");
      if (!film.canvas) return;
      film.ctx = film.canvas.getContext("2d");
      film.video = video;
      film.on = true;
      film.canvas.hidden = false;
      stageInner.classList.add("is-film");
      fitCanvas();
      video.currentTime = 0;
      gsap.ticker.add(filmTick);
    };
    video.addEventListener("loadedmetadata", function () {
      if (video.duration === Infinity) {
        /* screen-recorder files often omit duration; poke the end to learn it */
        video.currentTime = 1e7;
        video.addEventListener("durationchange", armFilm);
        return;
      }
      armFilm();
    });
    video.addEventListener("error", function () {
      /* bad path or codec -> quietly stay in sequence mode */
      if (film.canvas) film.canvas.hidden = true;
      stageInner.classList.remove("is-film");
      if (film.on) gsap.ticker.remove(filmTick);
      film.on = false;
      film.video = null;
    });
    window.addEventListener("resize", fitCanvas);
    video.src = cfg.experienceFilm;
  }

  /* ---- depth parallax: layers drift at their data-depth speed ----------- */

  document.querySelectorAll("[data-depth]").forEach(function (el) {
    var speed = parseFloat(el.getAttribute("data-depth")) || 0.2;
    var section = el.closest("section") || el.parentElement;
    gsap.fromTo(el, { y: speed * 130 }, { y: -speed * 130, ease: "none",
      scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
  });

  /* ---- the reel: vertical scroll drives the strip sideways -------------- */

  var reel = document.querySelector("[data-xp-reel]");
  var track = document.querySelector("[data-xp-track]");
  if (reel && track) {
    var distance = function () { return Math.max(0, track.scrollWidth - reel.clientWidth); };
    gsap.to(track, {
      x: function () { return -distance(); },
      ease: "none",
      scrollTrigger: {
        trigger: reel,
        start: "center center",
        end: function () { return "+=" + distance(); },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }

  /* late-loading images shift trigger positions; re-measure once settled */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
