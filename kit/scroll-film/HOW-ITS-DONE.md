# How these sites are actually made

This is the complete answer to "how are these people making these kinds of
sites, and what do we need to recreate it." `REFERENCE.md` decodes the one
TikTok; this decodes the whole genre. Plain-words first, technical detail
after, and at the end: exactly which pieces we now own.

## The one-sentence secret

**Almost none of it is real 3D.** These sites feel three-dimensional because
of three tricks, usually combined — and the "skill" the sellers charge for
is mostly knowing that:

## The three tricks behind every site in the video

### Trick 1 — Scrubbed footage (the workhorse)

The site pins one screen in place and maps your scroll position to a
timestamp in a video. Scroll = the playhead. Forward plays, backward
rewinds. The "3D camera move" was **filmed or generated in advance** — the
browser is just showing frames.

- This is how Apple product pages have worked for years.
- The fridge site in the TikTok: an AI-generated clip of the fridge opening,
  scrubbed by scroll. The "Terminal" logistics site's truck-yard flythrough:
  same idea, fancier footage (and its footage was *rendered from a 3D
  scene*, which is why it can crossfade to a wireframe look — that's two
  aligned renders of the same camera move, blended).
- **Where the footage comes from is the real trade secret, and it's cheap:**
  a phone clip, or one photo fed to an AI video model (Kling via
  higgsfield.ai in the TikTok; Runway, Luma, etc. all work) with a
  transformation prompt:
  > "Cinematic transformation, organic motion, continuous evolution from
  > frame 1. START: [what the photo shows]. END: [the reveal you want]."
- One encoding rule makes scrubbing feel liquid instead of chunky:
  keyframe-dense export — `ffmpeg -i in.mp4 -g 12 -an -movflags +faststart out.mp4`.

### Trick 2 — A particle field wearing the picture (the "wow")

The screen is secretly a grid of tens of thousands of tiny points drawn by
the graphics card (WebGL). Each point samples its pixel of the picture —
so at rest the grid IS the picture. Then you push the points around with
math and the picture shatters, flows, and **re-gathers into a new shape**
(his face → fibers → a ball; our version: your footage → embers → your
name). Because each point keeps sampling the *moving* video while it
travels, it reads as impossible 3D magic. It's ~200 lines of shader code.

### Trick 3 — True realtime 3D (the rare one)

An actual 3D model in the browser (three.js): the katana site, the DNA
helix. Needs a modeled, textured asset (bought from a 3D marketplace, paid
for, or AI-generated and cleaned up) and real 3D-dev time. **This is the
only trick that needs skills we haven't packaged** — and notice the TikTok
creator's own "BOOM" result doesn't use it either.

### The seasoning on all three

Scroll-timed copy blocks fading in and out, a progress indicator, oversized
type, a dark stage with one accent color, smooth (lerped) scroll response.
Cheap individually; together they're most of the "premium" feel.

## What the TikTok seller's pipeline really is

1. You give Emergent (an AI builder running Claude) your video, his prompt
   file, and an inspiration link.
2. Claude writes tricks 1 + 2 around your video.
3. He monetizes the prompt file through a comment funnel.

We skipped the middleman: the same Claude wrote `scrollfilm.js` directly,
and the prompt file's job is done by this folder.

## What we now own, mapped to what's on screen

| Seen in the reference | Trick | Status in `kit/scroll-film/` |
|---|---|---|
| Scroll plays/rewinds the hero video | 1 | ✅ built, QA'd |
| Picture shatters into drifting embers that keep playing | 2 | ✅ built, QA'd, pixel-verified |
| Particles flow as horizontal fibers (his face site) | 2 | ✅ `data-sf-scatter="strands"` |
| Particles re-gather into a structured shape | 2 | ✅ `data-sf-form-text` / `data-sf-form-image` — embers spell the client's name or form their logo |
| Scroll-timed copy + progress rail | seasoning | ✅ built |
| Photo → transformation footage | 1 | ✅ recipe documented (README); it's also Smith Digital's own "Drone-Style Video" product |
| Truck yard → wireframe x-ray | 1 (dual footage) or 3 | ◻ doable as two aligned AI clips crossfaded — documented, not built |
| Katana / DNA helix realtime objects | 3 | ◻ not built; needs a 3D asset + three.js work — the honest edge of the kit |

## The recipe per site (what "implementing it" means)

Every implementation is the same four steps:

1. **Footage** — a 10–20s clip (or photo → AI video). This is 90% of the
   final quality. Nothing else matters as much.
2. **Drop in the kit** — two files + one `<section>` of markup.
3. **Write the chapters** — 3–4 short copy blocks in the client's voice,
   timed to the scroll (`data-sf-at` / `data-sf-until`).
4. **Set the identity** — accent color, scatter style
   (`burst`/`strands`/`rise`), and the formation (`data-sf-form-text` =
   their name, or `data-sf-form-image` = their logo file).

Working examples in this folder: `demo.html` (neutral),
`yost-wood-design.html` (Jay — rising embers form "YOST WOOD DESIGN"),
`smith-digital-demo.html` (real homepage copy — strands form
"SMITH DIGITAL").

## What still needs a human

- **Real footage** per site (or a photo + one AI-video generation run —
  an account on higgsfield/Runway/Kling is the only paid thing anywhere in
  this pipeline).
- **One real-browser look** at the video scrub (headless QA verifies
  timestamps, not decoded frames — see README limits).
- **Taste calls** — chapter copy, accent color, which scatter style fits
  the brand. Five-minute decisions once you've scrolled the three examples.
