# Smith Made

Custom wood wedding signage & décor — handbuilt in Greenville, SC.
Rent it for the weekend, buy it forever, or rent-to-own.

This repository is the production website: a fast, static, single-page
site with no frameworks and no build step.

- `index.html` — the whole site (all sections, catalog, pricing, form)
- `css/styles.css` — brand system (CSS custom properties) and all styles
- `js/manifest.js` — **the only file the owner edits**: photos, video,
  gallery, form endpoint, contact details
- `js/main.js` — navigation, hero video with graceful fallback, gallery,
  photo swapping
- `js/form.js` — inquiry form (Formspree endpoint or pre-filled email)
- `assets/` — media drop folders (catalog, gallery, video)

**Owner instructions live in [OWNERS-GUIDE.md](OWNERS-GUIDE.md).**

To preview locally: open `index.html` in a browser, or run any static
server (for example `python -m http.server`) from the repo root.
