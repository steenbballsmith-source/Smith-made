# Smith Made

Custom wood wedding signage & décor — handbuilt in Greenville, SC.
Rent it for the weekend, or buy it forever.

This repository is the production website: a fast, static, single-page
site with no frameworks and no build step — now a scroll-based 3D
experience (Three.js signs with procedural wood grain, GSAP ScrollTrigger
animation, Lenis smooth scrolling), all self-hosted.

- `index.html` — the whole site (all sections, catalog, pricing, form)
- `css/styles.css` — rustic-warm design system (cream/walnut/caramel,
  self-hosted Cormorant Garamond + Great Vibes + Jost) and all styles
- `js/manifest.js` — **the only file the owner edits**: photos, video,
  gallery, form endpoint, contact details
- `js/main.js` — navigation, catalog photo swapping, filter chips, book
  buttons, gallery, date-hold wiring (reads the manifest)
- `js/scene.js` — the 3D scene: procedural wooden signs, scroll camera,
  dust motes, candlelight, reveals; degrades gracefully (reduced motion,
  no WebGL, no JS all keep the site readable)
- `js/form.js` — inquiry form (FormSubmit endpoint or pre-filled email)
- `assets/vendor/` — pinned local copies of Three.js, GSAP, ScrollTrigger,
  Lenis (no CDN dependency)
- `assets/fonts/` — self-hosted woff2 fonts
- `assets/` — media drop folders (catalog, gallery, video)

**Owner instructions live in [OWNERS-GUIDE.md](OWNERS-GUIDE.md).**

To preview locally: open `index.html` in a browser, or run any static
server (for example `python -m http.server`) from the repo root.
