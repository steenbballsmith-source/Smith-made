/* ScrollFilm — a self-contained scroll-driven "video transformation" hero.
   The effect from the @nomadatoast TikTok, without Emergent, in one file:

     phase 1  SCRUB     the visitor's scroll plays a video forward/backward
     phase 2  DISSOLVE  the picture shatters into thousands of glowing fibers
                        and embers that keep sampling the moving video
     phase 3  REFORM    (optional) the embers gather back into a shape — the
                        client's name or logo — the reference's signature move
     phase 4  HOLD      the points drift while the closing text sits

   Renderer (matched to the reference's look): three passes per frame —
   fiber trails (lines), a soft additive halo, and sharp cores — with flow
   turbulence and pseudo-depth parallax. No dependencies: CSS sticky
   pinning, raw WebGL1, a lerped currentTime seek.

   Degrades: no video -> Ken Burns + dissolve of the poster image · no
   WebGL -> scrub only · reduced motion / no JS / data-saver -> a static
   poster and readable text.

   Markup contract (see demo.html):
     <section data-scrollfilm data-sf-video="clip.mp4"
              data-sf-length="480" data-sf-accent="#d99a52"
              data-sf-scatter="burst|strands|rise"
              data-sf-blend="glow|solid"        (glow = additive, default)
              data-sf-form-text="YOUR|NAME"     (multiline with |; optional)
              data-sf-form-image="logo.png"     (alpha mask; wins over text)
              data-sf-form-color="#f2e9d8">
       <div class="sf-sticky sf-scrim">
         <img class="sf-poster" src="p.jpg" alt="...">
         <div class="sf-caption" data-sf-at="0.04" data-sf-until="0.38">...</div>
         <span class="sf-bar" data-sf-bar></span>
       </div>
     </section>

   Load scrollfilm.css beside this file. Every [data-scrollfilm] section
   mounts itself; window.ScrollFilm.mount(el) is there for later markup. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = (navigator.connection || {}).saveData === true;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function smooth(v) { v = clamp01(v); return v * v * (3 - 2 * v); }

  function hexToRgb(hex) {
    var m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
    if (!m) return null;
    var n = parseInt(m[1], 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  /* ---------------------------------------------------------------- WebGL */

  /* One program serves all three passes; the position math lives in a GLSL
     function so fiber tails can evaluate it a beat behind the heads. */
  var VERT = [
    "attribute vec2 aUV;",
    "attribute vec3 aSeed;",
    "attribute vec2 aTarget;",   /* clip-space slot in the formation */
    "attribute float aTargetOn;",/* 1 = has a slot, 0 = fades out on reform */
    "attribute float aEnd;",     /* 0 = head, 1 = fiber tail */
    "uniform float uProgress;",  /* dissolve: 0 intact -> 1 scattered */
    "uniform float uForm;",      /* reform: 0 scattered -> 1 formed */
    "uniform float uMode;",      /* scatter style: 0 burst, 1 strands, 2 rise */
    "uniform float uPass;",      /* 0 core, 1 fibers, 2 halo */
    "uniform float uTime;",
    "uniform vec2  uCover;",
    "uniform float uSize;",
    "varying vec2  vUV;",
    "varying float vT;",
    "varying float vForm;",
    "varying float vDepth;",
    "float easeT(float p) {",
    "  float order = aSeed.x * 0.55 + (1.0 - aUV.y) * 0.25;",
    "  float t = clamp((p * 1.8 - order) / 1.0, 0.0, 1.0);",
    "  return t * t * (3.0 - 2.0 * t);",
    "}",
    "vec2 place(float p, float form, float time, float t) {",
    "  vec2 pos = (aUV * 2.0 - 1.0) * uCover;",
    "  float a1 = aSeed.y * 6.28318 + time * 0.22;",
    "  float a2 = aSeed.z * 6.28318 - time * 0.17;",
    "  vec2 dir;",
    "  if (uMode < 0.5) {",           /* burst: everywhere, drifting up */
    "    dir = vec2(sin(a1) + 0.35 * cos(a2), cos(a1) * 0.6 + 0.55 + 0.35 * sin(a2));",
    "  } else if (uMode < 1.5) {",    /* strands: horizontal fiber streams */
    "    float side = aSeed.z > 0.5 ? 1.0 : -1.0;",
    "    dir = vec2(side * (0.9 + aSeed.y * 0.9), sin(a1) * 0.22 + (aSeed.y - 0.5) * 0.3);",
    "  } else {",                     /* rise: embers off a fire */
    "    dir = vec2(sin(a1) * 0.3, 0.9 + aSeed.y * 0.8);",
    "  }",
    "  vec2 sc = pos + dir * t * t * (0.55 + aSeed.z * 0.75);",
    /* flow turbulence: the cloud swims instead of coasting on rails */
    "  sc += vec2(sin(sc.y * 3.1 + time * 0.6 + aSeed.x * 9.0),",
    "             cos(sc.x * 2.6 - time * 0.5 + aSeed.y * 7.0)) * 0.02 * t;",
    /* pseudo-depth parallax: near points swing wider than far ones */
    "  sc.x += (aSeed.z - 0.5) * 0.12 * sin(p * 2.2 + time * 0.1) * t;",
    /* reform: pull to the slot with a light shimmer so it stays alive */
    "  vec2 slot = aTarget + vec2(sin(time * 0.9 + aSeed.x * 20.0), cos(time * 0.7 + aSeed.y * 20.0)) * 0.0035;",
    "  return mix(sc, slot, form * aTargetOn);",
    "}",
    "void main() {",
    "  vUV = aUV;",
    "  vDepth = aSeed.z;",
    "  float lagP = aEnd * 0.055;",   /* fiber tails trail the heads */
    "  float lagT = aEnd * 0.45;",
    "  float t = easeT(uProgress - lagP);",
    "  vT = easeT(uProgress);",
    "  vForm = uForm * aTargetOn;",
    "  vec2 fpos = place(uProgress - lagP, max(0.0, uForm - aEnd * 0.15), uTime - lagT, t);",
    "  gl_Position = vec4(fpos, 0.0, 1.0);",
    "  float sizeMul = uPass > 1.5 ? 3.4 : 1.0;",
    "  float depthMul = 0.7 + 0.6 * aSeed.z;",
    "  gl_PointSize = uSize * sizeMul * depthMul * (1.0 - 0.5 * vT) * (1.0 + vForm * 0.5);",
    "}",
  ].join("\n");

  var FRAG = [
    "precision mediump float;",
    "uniform sampler2D uTex;",
    "uniform vec3  uAccent;",
    "uniform vec3  uFormColor;",
    /* highp to match the vertex shader's default — a precision mismatch on a
       shared uniform is a LINK ERROR on some GL stacks (found the hard way) */
    "uniform highp float uForm;",
    "uniform highp float uPass;",
    "varying vec2  vUV;",
    "varying highp float vT;",
    "varying highp float vForm;",
    "varying highp float vDepth;",
    "void main() {",
    "  vec4 c = texture2D(uTex, vec2(vUV.x, 1.0 - vUV.y));",
    /* scattered material warms toward the accent, like sparks off a fire */
    "  vec3 col = mix(c.rgb, uAccent, vT * (0.35 + 0.4 * vDepth));",
    "  col = mix(col, uFormColor, vForm);",
    /* faint starfield survives the late scatter so the stage never dies */
    "  float life = (1.0 - smoothstep(0.5, 1.25, vT)) * (0.35 + 0.65 * (1.0 - vT));",
    "  float alpha;",
    "  if (uPass > 1.5) {",          /* halo: big, soft, additive */
    "    vec2 d = gl_PointCoord - 0.5;",
    "    float r = length(d) * 2.0;",
    "    if (r > 1.0) discard;",
    "    alpha = (1.0 - r) * (1.0 - r) * 0.16 * max(life, vForm);",
    "    col = mix(col, uAccent, 0.55);",
    "  } else if (uPass > 0.5) {",   /* fibers: thin trailing lines */
    "    alpha = life * 0.42 * (0.4 + 0.6 * vDepth);",
    "    alpha *= 1.0 - vForm * 0.85;", /* fibers retire as the shape sets */
    "  } else {",                    /* cores: sharp round points */
    "    vec2 d2 = gl_PointCoord - 0.5;",
    "    if (dot(d2, d2) > 0.25) discard;",
    "    alpha = max(life, vForm * 0.95);",
    "  }",
    "  alpha *= 1.0 - (uForm * (1.0 - vForm) * 0.85);",
    "  gl_FragColor = vec4(col, alpha);",
    "}",
  ].join("\n");

  function makeParticles(canvas, accent, formColor, blendGlow) {
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

    var target = Math.min(window.innerWidth, 900) < 640 ? 15000 : 32000;
    var aspect = window.innerWidth / Math.max(1, window.innerHeight);
    var cols = Math.max(40, Math.round(Math.sqrt(target * aspect)));
    var rows = Math.max(40, Math.round(target / cols));
    var count = cols * rows;

    /* point-pass arrays (N) and fiber-pass arrays (2N: head, tail) */
    var uvP = new Float32Array(count * 2);
    var seedP = new Float32Array(count * 3);
    var endP = new Float32Array(count);
    var uvL = new Float32Array(count * 4);
    var seedL = new Float32Array(count * 6);
    var endL = new Float32Array(count * 2);
    var x, y, i = 0;
    for (y = 0; y < rows; y++) {
      for (x = 0; x < cols; x++) {
        var u = (x + 0.5) / cols, v = (y + 0.5) / rows;
        var s1 = Math.random(), s2 = Math.random(), s3 = Math.random();
        uvP[i * 2] = u; uvP[i * 2 + 1] = v;
        seedP[i * 3] = s1; seedP[i * 3 + 1] = s2; seedP[i * 3 + 2] = s3;
        uvL[i * 4] = u; uvL[i * 4 + 1] = v; uvL[i * 4 + 2] = u; uvL[i * 4 + 3] = v;
        seedL[i * 6] = s1; seedL[i * 6 + 1] = s2; seedL[i * 6 + 2] = s3;
        seedL[i * 6 + 3] = s1; seedL[i * 6 + 4] = s2; seedL[i * 6 + 5] = s3;
        endL[i * 2] = 0; endL[i * 2 + 1] = 1;
        i++;
      }
    }

    function makeBuf(data, dynamic) {
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
      return buf;
    }
    var bufs = {
      points: {
        aUV: [makeBuf(uvP), 2], aSeed: [makeBuf(seedP), 3],
        aTarget: [makeBuf(new Float32Array(count * 2), true), 2],
        aTargetOn: [makeBuf(new Float32Array(count), true), 1],
        aEnd: [makeBuf(endP), 1],
        n: count, prim: gl.POINTS,
      },
      lines: {
        aUV: [makeBuf(uvL), 2], aSeed: [makeBuf(seedL), 3],
        aTarget: [makeBuf(new Float32Array(count * 4), true), 2],
        aTargetOn: [makeBuf(new Float32Array(count * 2), true), 1],
        aEnd: [makeBuf(endL), 1],
        n: count * 2, prim: gl.LINES,
      },
    };
    var loc = {};
    ["aUV", "aSeed", "aTarget", "aTargetOn", "aEnd"].forEach(function (name) {
      loc[name] = gl.getAttribLocation(prog, name);
      gl.enableVertexAttribArray(loc[name]);
    });
    function bindSet(set) {
      Object.keys(loc).forEach(function (name) {
        gl.bindBuffer(gl.ARRAY_BUFFER, set[name][0]);
        gl.vertexAttribPointer(loc[name], set[name][1], gl.FLOAT, false, 0, 0);
      });
    }

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([30, 24, 18, 255]));

    var U = {};
    ["uProgress", "uForm", "uMode", "uPass", "uTime", "uCover", "uSize", "uAccent", "uFormColor", "uTex"]
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    gl.uniform1i(U.uTex, 0);
    gl.uniform3fv(U.uAccent, new Float32Array(accent));
    gl.uniform3fv(U.uFormColor, new Float32Array(formColor || accent));
    gl.enable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);

    var texW = 0, texH = 0;

    return {
      count: count,
      upload: function (source, w, h) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        try {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
          texW = w; texH = h;
          return true;
        } catch (e) { return false; }
      },
      setTargets: function (positions, onFlags) {
        /* points get the slots directly; each fiber's head and tail share
           the slot, so fibers shrink away into the letters */
        var posL = new Float32Array(positions.length * 2);
        var onL = new Float32Array(onFlags.length * 2);
        for (var j = 0; j < onFlags.length; j++) {
          posL[j * 4] = positions[j * 2]; posL[j * 4 + 1] = positions[j * 2 + 1];
          posL[j * 4 + 2] = positions[j * 2]; posL[j * 4 + 3] = positions[j * 2 + 1];
          onL[j * 2] = onFlags[j]; onL[j * 2 + 1] = onFlags[j];
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.points.aTarget[0]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.points.aTargetOn[0]);
        gl.bufferData(gl.ARRAY_BUFFER, onFlags, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.lines.aTarget[0]);
        gl.bufferData(gl.ARRAY_BUFFER, posL, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufs.lines.aTargetOn[0]);
        gl.bufferData(gl.ARRAY_BUFFER, onL, gl.DYNAMIC_DRAW);
      },
      draw: function (progress, form, mode, time) {
        var W = canvas.width, H = canvas.height;
        gl.viewport(0, 0, W, H);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!texW) return;
        var ca = W / H, ta = texW / texH;
        var cover = ta > ca ? [ta / ca, 1] : [1, ca / ta];
        gl.uniform2fv(U.uCover, new Float32Array(cover));
        gl.uniform1f(U.uProgress, progress);
        gl.uniform1f(U.uForm, form);
        gl.uniform1f(U.uMode, mode);
        gl.uniform1f(U.uTime, time);
        gl.uniform1f(U.uSize, Math.max(2.5, (W / cols) * 1.45));

        function pass(id, set, additive) {
          gl.uniform1f(U.uPass, id);
          gl.blendFunc(gl.SRC_ALPHA, additive ? gl.ONE : gl.ONE_MINUS_SRC_ALPHA);
          bindSet(set);
          gl.drawArrays(set.prim, 0, set.n);
        }
        pass(1, bufs.lines, blendGlow);          /* fiber trails   */
        pass(2, bufs.points, true);              /* soft halo glow */
        pass(0, bufs.points, false);             /* sharp cores    */
      },
    };
  }

  /* --------------------------------------------- formation target sampling */

  /* Rasterize text (or an image's alpha) offscreen, sample the filled pixels,
     and hand every particle a clip-space slot in the shape. */
  function buildTargets(particles, viewW, viewH, spec) {
    var off = document.createElement("canvas");
    var W = 480, H = 240;
    off.width = W; off.height = H;
    var c = off.getContext("2d");

    function sampleAndSet() {
      var data = c.getImageData(0, 0, W, H).data;
      var slots = [];
      var px, py;
      for (py = 0; py < H; py += 1) {
        for (px = 0; px < W; px += 1) {
          if (data[(py * W + px) * 4 + 3] > 120) slots.push(px, py);
        }
      }
      var n = particles.count;
      var pos = new Float32Array(n * 2);
      var on = new Float32Array(n);
      var m = slots.length / 2;
      if (!m) return;
      /* the shape occupies ~76% of the width, centered a touch above middle */
      var box = 0.76 * 2;
      var scale = box / W;
      var yScale = scale * (viewW / viewH); /* clip space is square; correct */
      var cx = W / 2, cy = H / 2, yLift = 0.06;
      /* walk slots with a large co-prime stride so neighbours in the grid
         land far apart in the shape — the fill looks organic, not scanline */
      var stride = 104729 % m || 1;
      var idx = 0;
      for (var i = 0; i < n; i++) {
        if (i < Math.min(n, m * 3)) { /* up to 3 embers per slot pixel */
          idx = (idx + stride) % m;
          var sx = slots[idx * 2], sy = slots[idx * 2 + 1];
          pos[i * 2] = (sx - cx) * scale + (Math.random() - 0.5) * 0.006;
          pos[i * 2 + 1] = -(sy - cy) * yScale + yLift + (Math.random() - 0.5) * 0.006;
          on[i] = 1;
        } else {
          on[i] = 0;
        }
      }
      particles.setTargets(pos, on);
    }

    if (spec.image) {
      var img = new Image();
      img.onload = function () {
        var s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
        var dw = img.naturalWidth * s, dh = img.naturalHeight * s;
        c.clearRect(0, 0, W, H);
        c.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
        sampleAndSet();
      };
      img.src = spec.image;
      return;
    }
    var lines = String(spec.text || "").split("|").filter(Boolean);
    if (!lines.length) return;
    c.clearRect(0, 0, W, H);
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.textBaseline = "middle";
    var fontPx = Math.min(96, (H / lines.length) * 0.72);
    /* shrink to the longest line */
    for (var t = 0; t < 40; t++) {
      c.font = "800 " + fontPx + "px " + (spec.font || "system-ui, sans-serif");
      var widest = 0;
      lines.forEach(function (l) { widest = Math.max(widest, c.measureText(l).width); });
      if (widest <= W * 0.94) break;
      fontPx *= 0.94;
    }
    var lineH = fontPx * 1.12;
    var y0 = H / 2 - ((lines.length - 1) * lineH) / 2;
    lines.forEach(function (l, li) { c.fillText(l, W / 2, y0 + li * lineH); });
    sampleAndSet();
  }

  /* ------------------------------------------------------------- the film */

  function mount(section) {
    if (section.__sfMounted) return;
    section.__sfMounted = true;

    var sticky = section.querySelector(".sf-sticky");
    if (!sticky) return;

    var accent = hexToRgb(section.getAttribute("data-sf-accent")) || [1, 0.62, 0.35];
    var cfg = {
      video: section.getAttribute("data-sf-video") || "",
      image: section.getAttribute("data-sf-image") || "",
      length: parseInt(section.getAttribute("data-sf-length") || "480", 10),
      accent: accent,
      scatter: { burst: 0, strands: 1, rise: 2 }[section.getAttribute("data-sf-scatter")] || 0,
      blendGlow: (section.getAttribute("data-sf-blend") || "glow") !== "solid",
      formText: section.getAttribute("data-sf-form-text") || "",
      formImage: section.getAttribute("data-sf-form-image") || "",
      formFont: section.getAttribute("data-sf-form-font") || "",
      formColor: hexToRgb(section.getAttribute("data-sf-form-color")) || accent,
      scrubEnd: parseFloat(section.getAttribute("data-sf-scrub-end") || "0.5"),
      dissolveEnd: parseFloat(section.getAttribute("data-sf-dissolve-end") || "0.78"),
      formEnd: parseFloat(section.getAttribute("data-sf-form-end") || "0.94"),
    };
    var hasForm = !!(cfg.formText || cfg.formImage);
    /* with no formation the dissolve gets the reform's share of the scroll */
    if (!hasForm) { cfg.scrubEnd = parseFloat(section.getAttribute("data-sf-scrub-end") || "0.58"); cfg.dissolveEnd = parseFloat(section.getAttribute("data-sf-dissolve-end") || "0.92"); }

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

    var particles = makeParticles(glCanvas, cfg.accent, cfg.formColor, cfg.blendGlow);

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
      if (particles && hasForm) {
        buildTargets(particles, w, h, { text: cfg.formText, image: cfg.formImage, font: cfg.formFont });
      }
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

      var usingVideo = video && videoReady && video.readyState >= 2;

      if (video && videoReady && isFinite(video.duration)) {
        var span = clamp01(progress / cfg.dissolveEnd);
        vTarget = span * Math.max(0, video.duration - 0.05);
        vCurrent += (vTarget - vCurrent) * 0.2;
        if (Math.abs(vCurrent - vTarget) > 0.002 && !video.seeking && video.readyState >= 1) {
          video.currentTime = vCurrent;
        }
      }

      var dissolve = smooth((progress - cfg.scrubEnd) / (cfg.dissolveEnd - cfg.scrubEnd));
      var form = hasForm
        ? smooth((progress - cfg.dissolveEnd) / (cfg.formEnd - cfg.dissolveEnd))
        : 0;

      if (dissolve < 1) {
        var kb = 1 + progress * 0.08;
        if (usingVideo) { drawFlat(video, video.videoWidth, video.videoHeight, kb); goLive(); }
        else if (imgReady) { drawFlat(img, img.naturalWidth, img.naturalHeight, kb); goLive(); }
      }
      flat.style.opacity = String(1 - smooth(dissolve / 0.35));

      if (particles && dissolve > 0) {
        glCanvas.style.opacity = "1";
        var up = usingVideo
          ? particles.upload(video, video.videoWidth, video.videoHeight)
          : (imgReady ? particles.upload(img, img.naturalWidth, img.naturalHeight) : false);
        if (up) { particles.draw(dissolve, form, cfg.scatter, time); goLive(); }
      } else if (particles) {
        glCanvas.style.opacity = "0";
      }

      for (var i = 0; i < captions.length; i++) {
        var cpt = captions[i];
        var fade = 0.05;
        var o = Math.min(
          (progress - cpt.at + fade) / fade,
          (cpt.until - progress + fade) / fade
        );
        o = smooth(o);
        cpt.el.style.opacity = String(o);
        cpt.el.style.transform = "translate3d(0," + ((1 - o) * 26).toFixed(1) + "px,0)";
        cpt.el.style.pointerEvents = o > 0.5 ? "auto" : "none";
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
