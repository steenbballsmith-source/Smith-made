# Current handoff to Codex

**Written 2026-08-28 (second session of the day) by cloud Claude.** Steen
uploaded the original TikTok and re-aimed the goal: the effect goes on
**Jay's site (Yost Wood Design)** and **Smith Digital** — Smith Made is not
the focus right now. Everything you need is on branch
`claude/tiktok-video-transformation-64e1ja` (PR #35, still a draft).

---

## 🔴 NEW — SM-XP-002: the TikTok effect is built. Your job is to put it on Jay's site.

**First, read `kit/scroll-film/REFERENCE.md` on the branch.** It's the
frame-by-frame decode of the TikTok — what the effect actually is, so we're
all chasing the same target. Short version: the visitor's scroll plays a
video, and as they keep scrolling the picture **shatters into thousands of
embers that keep showing the moving frame**, then the closing pitch lands.
The creator built it with Emergent + a paid prompt + Claude. We are Claude,
so `kit/scroll-film/` is that result with no Emergent and no prompt to buy:

- `scrollfilm.js` + `scrollfilm.css` — drop-in engine, zero dependencies.
  Since the first handoff it also does the reference's signature move: after
  the dissolve the embers **re-gather and spell the client's name** (or form
  their logo), and there are three scatter styles so each site moves
  differently. `HOW-ITS-DONE.md` is the full tradecraft breakdown.
- `demo.html` — see it move (serve the folder, don't file:// it)
- **`yost-wood-design.html` — a full draft site for Jay already built on it**
  (rising embers form "YOST WOOD DESIGN")
- **`smith-digital-demo.html`** — the effect wearing smithdigitalco.com's
  real homepage copy (strands form "SMITH DIGITAL") — this is the preview
  Steen judges the splice by
- `README.md` — how to apply it to each site, and the photo→AI-video recipe
- `assets/` — placeholder footage for both looks so everything works before
  real clips exist

### Do this, in order

1. **Pull the branch, serve the kit folder, open `demo.html` in a real
   browser.** The one thing cloud QA physically cannot see is decoded video
   frames advancing during scrub (headless limitation — details in the LOG).
   Everything else is verified; this check is yours. Scroll slowly, both
   directions. Then open `yost-wood-design.html`, desktop and phone width.
2. **Report what you see on PR #35** — smooth, janky, wrong — before
   building on it.
3. **Apply it to Jay's project** (wherever his draft lives on the PC — cloud
   Claude verified it is NOT in GitHub/Netlify/Lovable): copy the kit folder
   in, start from `yost-wood-design.html`, fill every `[PLACEHOLDER]`
   (phone, email, services wording, project photos), keep the film chapters
   or rewrite them in Jay's voice.
4. **Footage.** The film is only as good as the clip. Ask Steen for either:
   a 10–20s phone clip from Jay (one slow steady move around a finished
   piece), OR one good photo — then use the README's AI-video recipe
   (photo → image-to-video tool → "cinematic transformation… START/END"
   prompt → mp4). Encode whatever you get:
   `ffmpeg -i clip.mp4 -g 12 -an -movflags +faststart out.mp4`
5. **Smith Digital:** propose the splice, don't ship it. Best candidates
   (README has details): the "Drone-Style Video" service page — the kit IS
   that service demonstrating itself — or the homepage hero. You have the
   real files on the PC; cloud Claude only saw the rendered site through a
   remote extractor.
6. **Deploys are Steen's say-so, every time** — Jay's site, smithdigitalco,
   and the PR #35 merge alike (`ops/AUTHORIZATION.md` §2).

### Also still on PR #35 from the morning session

The Smith Made `/experience.html` page (built before Steen re-aimed the
goal). It's finished and QA'd; it just isn't today's priority. When Steen
eventually says "merge," note the PR now also carries the kit (deploy-
excluded) and a one-line workflow change that keeps `kit/` off
smithmadesc.com.

---

## 👤 FOR STEEN — in plain words

**What the TikTok guy actually sells:** he feeds three things into an AI
builder — a written prompt (he charges for it), **a plain video**, and an
example link — and Claude builds a site where scrolling plays the video and
then explodes it into sparks. I watched your saved video frame by frame;
the full plain-English breakdown is in the branch at
`kit/scroll-film/REFERENCE.md`.

**What you have now:** that same effect, built and tested, plus a ready
draft of Jay's whole site using it. Nothing is live anywhere. Codex has
step-by-step instructions above.

**Your three things:**
1. **Get footage from Jay** — ONE slow, steady 10–20 second phone video
   (held sideways) of his best finished piece, or even just one good photo
   of it (I documented the TikTok's photo-to-video trick for Codex — that's
   also literally the "Drone-Style Video" service Smith Digital already
   sells, so this doubles as your own product demo).
2. **Tell Codex to start:** the exact sentence is at the bottom.
3. **Say "go" before anything goes live** — Jay's site, Smith Digital, or
   the Smith Made page from this morning. Until then it's all drafts.

---

## Still open from before (pointers, not repeats)

- **SM-FORM-001 last inch:** Will confirming a real inquiry landed in
  will.smithmade@gmail.com. Unchanged. Board: `SM-FORM-001`.
- **OPS-CALLERS-001** (shared do-not-contact list): decision is Steen's;
  agents recommend and record only.
- **OPS-PRIVACY-001:** repo is public — Jay's real phone/email go into the
  local project on the PC, never into this repo's committed files.
