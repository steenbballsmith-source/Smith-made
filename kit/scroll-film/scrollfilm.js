/* ScrollFilm — a self-contained scroll-driven "video transformation" hero.
   The effect from the @nomadatoast TikTok, without Emergent, in one file:

     phase 1  SCRUB     the visitor's scroll plays a video forward/backward
     phase 2  DISSOLVE  the picture shatters into thousands of WebGL points
                        that keep sampling the moving video while they scatter
     phase 3  HOLD      the points drift like embers while the closing text sits

   No dependencies. Pinning is CSS position:sticky, the particles are raw
   WebGL1, the scrub is a lerped currentTime seek. Works with:
     - a video  (data-sf-video)          -> full effect
     - only an image (data-sf-image)     -> Ken Burns + particle dissolve
     - no WebGL                          -> scrub/Ken Burns only
     - reduced motion / no JS / saveData -> a static poster and readable text

   Markup contract (see demo.html):
     <section data-scrollfilm data-sf-video="clip.mp4" data-sf-poster="p.jpg"
              data-sf-length="480" data-sf-accent="#d99a52">
       <div class="sf-sticky">
         <img class="sf-poster" src="p.jpg" alt="...">
         <div class="sf-caption" data-sf-at="0.04" data-sf-until="0.38">...</div>
         ...
         <span class="sf-bar" data-sf-bar></span>
       </div>
     </section>

   Load scrollfilm.css beside this file. Every [data-scrollfilm] section on
   the page mounts itself; window.ScrollFilm.mount(el) is there for markup
   added later. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = (navigator.connection || {}).saveData === true;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { v = clamp01(v); return v * v * (3 - 2 * v); }

  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return [1, 0.62, 0.35];
    var n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* ---------------------------------------------------------------- WebGL */

  var VERT = [
    "attribute vec2 aUV;",
    "attribute vec3 aSeed;",
    "uniform float uProgress;", /* 0 = intact picture, 1 = fully scattered */
    "uniform float uTime;",
    "uniform vec2  uCover;",    /* cover-fit scale of the picture quad */
    "uniform float uSize;",     /* base point size in device pixels */
    "varying vec2  vUV;",
    "varying float vT;",
    "void main() {",
    "  vUV = aUV;",
    /* each point starts dissolving at its own moment, top edge first */
    "  float order = aSeed.x * 0.55 + (1.0 - aUV.y) * 0.25;",
    "  float t = clamp((uProgress * 1.8 - order) / 1.0, 0.0, 1.0);",
    "  t = t * t * (3.0 - 2.0 * t);",
    "  vT = t;",
    "  vec2 pos = (aUV * 2.0 - 1.0) * uCover;",
    /* scatter: a per-point direction that swirls slowly with time */
    "  float a1 = aSeed.y * 6.28318 + uTime * 0.22;",
    "  float a2 = aSeed.z * 6.28318 - uTime * 0.17;",
    "  vec2 dir = vec2(sin(a1) + 0.35 * cos(a2), cos(a1) * 0.6 + 0.55 + 0.35 * sin(a2));",
    "  pos += dir * t * t * (0.55 + aSeed.z * 0.75);",
    "  pos.x += sin(uTime * 0.4 + aSeed.x * 12.0) * 0.012 * t;",
    "  gl_Position = vec4(pos, 0.0, 1.0);",
    "  gl_PointSize = uSize * (1.0 - 0.55 * t);",
    "}",
  ].join("\n");

  var FRAG = [
    "precision mediump float;",
    "uniform sampler2D uTex;",
    "uniform vec3  uAccent;",
    "varying vec2  vUV;",
    "varying float vT;",
    "void main() {",
    "  vec2 d = gl_PointCoord - 0.5;",
    "  if (dot(d, d) > 0.25) discard;", /* round points */
    "  vec4 c = texture2D(uTex, vec2(vUV.x, 1.0 - vUV.y));",
    /* scattering points warm up toward the accent, like sparks */
    "  vec3 col = mix(c.rgb, uAccent, vT * 0.55);",
    "  float alpha = 1.0 - smoothstep(0.55, 1.0, vT);",
    "  gl_FragColor = vec4(col, alpha * (0.35 + 0.65 * (1.0 - vT)));",
    "}",
  ].join("\n");

  function makeParticles(canvas, accent) {
    var gl = canvas.getContext("webgl", { alpha: true, antialias: false })
          || canvas.getContext("experimental-webgl", { alpha: true });
    if (!gl) return null;

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    /* point grid — denser on desktop, lighter on phones */
    var target = Math.min(window.innerWidth, 900) < 640 ? 16000 : 36000;
    var aspect = window.innerWidth / Math.max(1, window.innerHeight);
    var cols = Math.max(40, Math.round(Math.sqrt(target * aspect)));
    var rows = Math.max(40, Math.round(target / cols));
    var count = cols * rows;
    var uv = new Float32Array(count * 2);
    var seed = new Float32Array(count * 3);
    var i, x, y, k = 0, s = 0;
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        uv[k++] = (x + 0.5) / cols;
        uv[k++] = (y + 0.5) / rows;
        seed[s++] = Math.random();
        seed[s++] = Math.random();
        seed[s++] = Math.random();
      }
    }
    function attrib(name, data, size) {
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    attrib("aUV", uv, 2);
    attrib("aSeed", seed, 3);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    /* 1x1 placeholder until real pixels arrive */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([30, 24, 18, 255]));

    var U = {
      progress: gl.getUniformLocation(prog, "uProgress"),
      time: gl.getUniformLocation(prog, "uTime"),
      cover: gl.getUniformLocation(prog, "uCover"),
      size: gl.getUniformLocation(prog, "uSize"),
      accent: gl.getUniformLocation(prog, "uAccent"),
      tex: gl.getUniformLocation(prog, "uTex"),
    };
    gl.uniform1i(U.tex, 0);
    gl.uniform3fv(U.accent, new Float32Array(accent));
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var texW = 0, texH = 0;

    return {
      upload: function (source, w, h) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
          texW = w; texH = h;
          return true;
        } catch (e) { return false; }
      },
      draw: function (progress, time) {
        var W = canvas.width, H = canvas.height;
        gl.viewport(0, 0, W, H);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!texW) return;
        /* cover-fit: scale the unit quad so the picture fills the screen */
        var ca = W / H, ta = texW / texH;
        var cover = ta > ca ? [ta / ca, 1] : [1, ca / ta];
        gl.uniform2fv(U.cover, new Float32Array(cover));
        gl.uniform1f(U.progress, progress);
        gl.uniform1f(U.time, time);
        gl.uniform1f(U.size, Math.max(2.5, (W / cols) * 1.45));
        gl.drawArrays(gl.POINTS, 0, count);
      },
    };
  }

  /* ------------------------------------------------------------- the film */

  function mount(section) {
    if (section.__sfMounted) return;
    section.__sfMounted = true;

    var sticky = section.querySelector(".sf-sticky");
    if (!sticky) return;

    var cfg = {
      video: section.getAttribute("data-sf-video") || "",
      image: section.getAttribute("data-sf-image") || "",
      length: parseInt(section.getAttribute("data-sf-length") || "480", 10),
      accent: hexToRgb(section.getAttribute("data-sf-accent") || "#d99a52"),
      /* where each phase of the film ends, as a fraction of the scroll */
      scrubEnd: parseFloat(section.getAttribute("data-sf-scrub-end") || "0.58"),
      dissolveEnd: parseFloat(section.getAttribute("data-sf-dissolve-end") || "0.92"),
    };

    var captions = Array.prototype.slice.call(section.querySelectorAll(".sf-caption"))
      .map(function (el) {
        return {
          el: el,
          at: parseFloat(el.getAttribute("data-sf-at") || "0"),
          until: parseFloat(el.getAttribute("data-sf-until") || "1"),
        };
      });
    var bar = section.querySelector("[data-sf-bar]");
    var poster = section.querySelector(".sf-poster");

    /* static mode: poster + all text, no motion, no canvases */
    if (reduced) {
      section.classList.add("sf-static");
      return;
    }

    section.classList.add("sf-on");
    var flat = document.createElement("canvas");
    flat.className = "sf-flat";
    flat.setAttribute("aria-hidden", "true");
    var glCanvas = document.createElement("canvas");
    glCanvas.className = "sf-gl";
    glCanvas.setAttribute("aria-hidden", "true");
    sticky.insertBefore(glCanvas, sticky.firstChild);
    sticky.insertBefore(flat, glCanvas);
    var ctx = flat.getContext("2d");
    section.style.height = cfg.length + "vh";

    var particles = makeParticles(glCanvas, cfg.accent);

    /* picture sources: a video when given (and allowed), else the image */
    var img = null, imgReady = false;
    var srcImage = cfg.image || (poster ? poster.currentSrc || poster.src : "");
    if (srcImage) {
      img = new Image();
      img.onload = function () { imgReady = true; };
      img.src = srcImage;
    }

    var video = null, videoReady = false, vTarget = 0, vCurrent = 0;
    if (cfg.video && !saveData) {
      video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("aria-hidden", "true");
      video.addEventListener("loadedmetadata", function () {
        if (video.duration === Infinity) {
          /* screen-recorder files omit duration; poke the end to learn it */
          video.currentTime = 1e7;
          video.addEventListener("durationchange", function () {
            if (isFinite(video.duration)) { video.currentTime = 0; videoReady = true; }
          });
          return;
        }
        videoReady = true;
      });
      video.addEventListener("error", function () { video = null; videoReady = false; });
      video.src = cfg.video;
    }

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = sticky.clientWidth, h = sticky.clientHeight;
      flat.width = Math.round(w * dpr);
      flat.height = Math.round(h * dpr);
      glCanvas.width = Math.round(w * dpr);
      glCanvas.height = Math.round(h * dpr);
    }
    size();
    window.addEventListener("resize", size);

    function drawFlat(source, sw, sh, scale) {
      var W = flat.width, H = flat.height;
      if (!sw || !sh || !W || !H) return;
      var s = Math.max(W / sw, H / sh) * (scale || 1);
      var dw = sw * s, dh = sh * s;
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(source, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }

    /* run the loop only while the film is anywhere near the screen */
    var active = false, raf = 0, t0 = performance.now();
    var progress = 0, live = false;

    function goLive() {
      /* the film painted a real frame — the poster hands over */
      if (live) return;
      live = true;
      sticky.classList.add("sf-live");
    }

    function tick(now) {
      raf = active ? requestAnimationFrame(tick) : 0;
      var time = (now - t0) / 1000;

      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      progress = clamp01(-rect.top / Math.max(1, rect.height - vh));

      /* --- picture source of truth for this frame --- */
      var usingVideo = video && videoReady && video.readyState >= 2;

      /* the video is scrubbed across scrub+dissolve, so the points keep
         sampling a moving picture while they scatter */
      if (video && videoReady && isFinite(video.duration)) {
        var span = clamp01(progress / cfg.dissolveEnd);
        vTarget = span * Math.max(0, video.duration - 0.05);
        vCurrent += (vTarget - vCurrent) * 0.2;
        if (Math.abs(vCurrent - vTarget) > 0.002 && !video.seeking && video.readyState >= 1) {
          video.currentTime = vCurrent;
        }
      }

      /* --- phases --- */
      var dissolve = smooth((progress - cfg.scrubEnd) / (cfg.dissolveEnd - cfg.scrubEnd));

      if (dissolve < 1) {
        var kb = 1 + progress * 0.08; /* gentle push-in on the flat picture */
        if (usingVideo) { drawFlat(video, video.videoWidth, video.videoHeight, kb); goLive(); }
        else if (imgReady) { drawFlat(img, img.naturalWidth, img.naturalHeight, kb); goLive(); }
      }
      /* the flat picture yields to the points over the first stretch of the
         dissolve; keeping them stacked hides the grid snapping in */
      flat.style.opacity = String(1 - smooth(dissolve / 0.35));

      if (particles && dissolve > 0) {
        glCanvas.style.opacity = "1";
        var up = usingVideo
          ? particles.upload(video, video.videoWidth, video.videoHeight)
          : (imgReady ? particles.upload(img, img.naturalWidth, img.naturalHeight) : false);
        if (up) { particles.draw(dissolve, time); goLive(); }
      } else if (particles) {
        glCanvas.style.opacity = "0";
      }

      /* --- captions + progress bar --- */
      for (var i = 0; i < captions.length; i++) {
        var c = captions[i];
        var fade = 0.05;
        var o = Math.min(
          (progress - c.at + fade) / fade,
          (c.until - progress + fade) / fade
        );
        o = smooth(o);
        c.el.style.opacity = String(o);
        c.el.style.transform = "translate3d(0," + ((1 - o) * 26).toFixed(1) + "px,0)";
        c.el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (bar) bar.style.transform = "scaleX(" + progress + ")";

      section.dispatchEvent(new CustomEvent("sf:progress", { detail: { progress: progress } }));
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var near = entries[0].isIntersecting;
        if (near && !active) { active = true; raf = requestAnimationFrame(tick); }
        else if (!near && active) { active = false; if (raf) cancelAnimationFrame(raf); }
      }, { rootMargin: "60% 0px 60% 0px" }).observe(section);
    } else {
      active = true;
      raf = requestAnimationFrame(tick);
    }
  }

  function boot() {
    document.querySelectorAll("[data-scrollfilm]").forEach(mount);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.ScrollFilm = { mount: mount };
})();
