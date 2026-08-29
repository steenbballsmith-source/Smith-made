# ScrollFilm kit

The scroll-driven "video transformation" hero from the reference TikTok
(`REFERENCE.md`), as a drop-in kit for any plain website. No build step, no
dependencies, no accounts.

**See it move:** serve this folder (`python -m http.server`) and open
`demo.html`. Then open `yost-wood-design.html` — a full draft site for Jay
built on the same kit.

## Files

| File | What it is |
|---|---|
| `scrollfilm.js` | The engine: scrub → particle dissolve → **reform into a name/logo** → drift |
| `scrollfilm.css` | Structural styles only (pinning, canvases, caption timing) |
| `demo.html` | Neutral demo + usage notes in view-source (embers form "SCROLL FILM") |
| `yost-wood-design.html` | Draft site for Jay — rising embers form "YOST WOOD DESIGN" |
| `smith-digital-demo.html` | The effect wearing smithdigitalco.com's real homepage copy — strands form "SMITH DIGITAL" |
| `his-look.html` | The reference creator's exact art direction: light stage, solid blending, rotating fiber-ball finale |
| `HOW-ITS-DONE.md` | The complete tradecraft: the three tricks behind every site in the genre |
| `REFERENCE.md` | What the TikTok actually shows, effect by effect |
| `assets/demo-film.mp4` / `demo-poster.jpg` | Placeholder wood clip (generated, keyframe-dense) |
| `assets/digital-film.mp4` / `digital-poster.jpg` | Placeholder abstract clip for the Smith Digital preview |

## Dropping it into a page

```html
<link rel="stylesheet" href="scrollfilm.css">

<section data-scrollfilm
         data-sf-video="assets/your-clip.mp4"   <!-- omit to use the image -->
         data-sf-image="assets/your-poster.jpg"
         data-sf-length="480"                   <!-- scroll distance, vh -->
         data-sf-accent="#d99a52">              <!-- ember color -->
  <div class="sf-sticky sf-scrim">
    <img class="sf-poster" src="assets/your-poster.jpg" alt="...">
    <div class="sf-caption" data-sf-at="0.02" data-sf-until="0.3">
      ...your headline, your styles...
    </div>
    <!-- more captions; data-sf-align="top" or "center" reposition them -->
    <span class="sf-bar" data-sf-bar></span>
  </div>
</section>

<script src="scrollfilm.js"></script>
```

The kit styles nothing visible — captions inherit the host site's type and
colors. Timing: each caption shows between `data-sf-at` and `data-sf-until`
(progress 0..1).

**Identity attributes** (this is where each site stops looking like the
others):

- `data-sf-scatter` — how the picture breaks apart: `burst` (everywhere,
  default), `strands` (horizontal fiber streams — the reference site's face
  look), `rise` (embers off a fire — right for a wood shop).
- `data-sf-blend` — `glow` (default: additive fibers + halo passes, the
  reference's luminous look, made for dark stages) or `solid` (for light
  backgrounds: the halo is dropped, the round cores are held back, and the
  strand bodies darken so they stay visible on a pale ground). The renderer
  draws fiber trails, a soft halo, and sharp cores each frame, with flow
  turbulence and pseudo-depth parallax.

**Captions look after themselves.** Windows are sorted and any gap between
one and the next is closed at mount — a stretch of film with no words on it
reads as a broken page. The handoff overlaps just enough to never show an
empty stage, and the outgoing and incoming blocks travel in opposite
directions while they cross, so two of them are never printed on top of
each other. Put a `sf-scrim` (dark stage) or `sf-scrim-light` (light stage)
class on `.sf-sticky` to keep text legible over the footage.
- `data-sf-form-text="YOUR|NAME"` — after the dissolve, the embers gather
  and **spell this** (multiline with `|`). `data-sf-form-image="logo.png"`
  forms the logo's silhouette instead (alpha mask; wins over text).
  `data-sf-form-shape="orb"` forms the reference's dandelion finale
  instead: a **rotating 3D fiber ball with radial spikes** (see
  `his-look.html`). `data-sf-form-color` sets the formed color,
  `data-sf-form-font` the face used for rasterizing text. Omit all of
  these and the film ends on the drifting embers like before.
- Phase boundaries: `data-sf-scrub-end` (default 0.5 with a formation,
  0.58 without), `data-sf-dissolve-end` (0.78 / 0.92), `data-sf-form-end`
  (0.94).

Built-in degrade paths, nothing to configure: no video → Ken Burns on the
image + the same dissolve · no WebGL → scrub only · reduced motion, no JS,
or data-saver → static poster with all text readable.

## The clip (this is 90% of the result)

- 10–20 seconds, phone held sideways, **one slow steady move** — a slow walk
  around a finished piece, a push toward a doorway, a pan across the shop.
- Encode it seek-friendly before shipping:
  `ffmpeg -i clip.mp4 -g 12 -an -movflags +faststart out.mp4`
  (`-g 12` = a keyframe every 12 frames, which is what makes scrubbing
  smooth; `-an` drops audio the film never plays.)
- **No clip? Use the TikTok's own trick:** take one good photo, feed it to an
  AI video generator (the video used higgsfield.ai's Kling model; any
  image-to-video tool works) with a prompt in this shape:
  > Cinematic transformation, organic motion, continuous evolution from
  > frame 1. START: [exactly what the photo shows]. END: [the reveal you
  > want — doors open, piece assembled, room furnished].
  Then encode as above. Smith Digital already sells this exact move as
  "Drone-Style Video," so the pipeline doubles as the product demo.

## Applying it to each site

**Jay — Yost Wood Design.** `yost-wood-design.html` is the head start: copy
this whole folder into the site project, replace the two files in `assets/`
with Jay's real clip + poster, fill every `[PLACEHOLDER]` (phone, email,
service wording, project photos), restyle to taste, drop the `noindex` line.
The film chapters are already written for a cabinet shop.

**Smith Digital (smithdigitalco.com).** Candidate spots, Codex's call on the
PC where the real files are: the "Drone-Style Video" service page (show the
product doing the selling), or the homepage hero above the presence-check
widget. Splice = copy the `<section data-scrollfilm>` block + the two file
includes; keep page CSS below it untouched. Needs a clip that shows Smith
Digital's own work (e.g. a screen-recorded scroll of a client site run
through the image-to-video trick, or any real footage Steen has).

**Smith Made.** Already has its own richer page on this branch
(`/experience.html`, PR #35) — built before this kit existed. If the kit
look is preferred there later, the film section drops in the same way.

## Honest limits

- The wireframe-morph and 3D-object scenes from the reference video (the
  logistics site, the katana) are modeled-3D work, not video work — out of
  scope for this kit. `REFERENCE.md` row 5–6.
- Frame-accurate scrubbing was verified by timestamps in a headless browser;
  the headless build won't advance decoded frames on paused seeks, so **look
  at demo.html once in a normal browser** before showing anyone. (The
  particle phase is verified pixel-level headlessly with the image path.)
- Very old phones get the scrub without the particles — that's the designed
  fallback, not a bug.
