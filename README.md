# Smith Made

Custom wood event signage & décor — handbuilt in Greenville, SC.
Rent it for the weekend, or buy it forever.

This repository is the production website: a fast, static, single-page
site with no frameworks and no build step. The Processional uses semantic
HTML, native scrolling, an optional local GSAP/ScrollTrigger enhancement,
and existing optimized Smith Made renders with complete static fallbacks.

- `index.html` — the whole site (all sections, catalog, pricing, form)
- `css/styles.css` — rustic-warm design system (cream/walnut/caramel,
  self-hosted Cormorant Garamond + Great Vibes + Jost) and all styles
- `js/manifest.js` — **the only file the owner edits**: photos, video,
  gallery, form endpoint, contact details
- `js/main.js` — navigation, catalog photo swapping, filter chips, book
  buttons, gallery, date-hold wiring (reads the manifest)
- `js/scene.js` — the Processional arch story, section reveals, and scroll
  progress; reduced motion, missing libraries, media failure, and no JS all
  keep the complete site and inquiry path readable
- `js/form.js` — inquiry form (FormSubmit endpoint or pre-filled email)
- `assets/vendor/` — retained pinned local libraries; the current page loads
  only GSAP and ScrollTrigger and has no CDN dependency
- `assets/fonts/` — self-hosted woff2 fonts
- `assets/` — media drop folders (catalog, gallery, video)

**Owner instructions live in [OWNERS-GUIDE.md](OWNERS-GUIDE.md).**

To preview locally: open `index.html` in a browser, or run any static
server (for example `python -m http.server`) from the repo root.
