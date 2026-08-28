# Current handoff to Codex

**Written 2026-08-28 by cloud Claude.** Previous inbox items from 08-01 are
resolved or moved — see "Still open from before" at the bottom. This file is
the inbox: what's open right now, nothing else.

---

## 🟡 NEW — SM-XP-001: "The Experience" page is built and waiting for your review

Steen sent a TikTok (@nomadatoast — scroll-driven "video transformation"
sites) and asked for the same thing for Smith Made. It's built, QA'd, and
sitting on a draft PR. **Nothing is live.** The page:

- `experience.html` — scroll it and a wedding day plays like a film: five
  full-screen chapters (Welcome arch → Ceremony arches → Champagne wall →
  Slat backdrop → Keepsake heart) that crossfade under your scroll, then a
  parallax collage, a sideways-sliding reel of the collection, and a
  "Check Your Date" finale. Scroll back and it rewinds.
- Two new links on the home page (nav + footer: "The Experience"). Nothing
  else on the home page changed.
- One new owner switch in `js/manifest.js`: `experienceFilm`. Empty today.
  When a real shop video exists, one line turns the chapter backdrop into
  the actual video scrubbed frame-by-frame by the visitor's scroll — the
  exact trick from the TikTok.

### What Claude asks of you

1. **Pull the branch and look at it in a real browser.**
   ```
   git fetch origin claude/tiktok-video-transformation-64e1ja
   git checkout claude/tiktok-video-transformation-64e1ja
   python -m http.server 8000    (any static server works)
   ```
   Open `http://localhost:8000/experience.html`. Check: the film scrubs both
   directions, chapters read on top of every image, the reel slides, phone
   width behaves (DevTools device mode), and the home page still works.
2. **The one check Claude could not do:** the container's headless browser
   refuses to advance decoded video frames on paused seeks, for any video —
   so film mode was verified down to "arms, draws the canvas, seeks the
   right timestamps" but a human has never *seen* it scrub a real clip.
   Drop any 10–20s landscape mp4 at `assets/video/experience.mp4`, set
   `experienceFilm: "assets/video/experience.mp4"` in `js/manifest.js`
   locally (don't commit your test clip), reload, and watch it. If frames
   stutter, encode with denser keyframes
   (`ffmpeg -i in.mp4 -g 12 -an out.mp4`) — note what worked in the log.
3. **Comment on the PR / log what you find.** Take, amend, or reject —
   review comments on the PR or a LOG.md entry both work.
4. **Do not merge.** Merging to `main` deploys the live site; that say-so is
   Steen's (AUTHORIZATION.md §2 named exception). When Steen says go, merge
   the PR — the Pages workflow deploys in ~20s.

Full evidence and the QA numbers: `ops/LOG.md`, entry 2026-08-28.
Board: `SM-XP-001`.

---

## 👤 FOR STEEN — in plain words

**What you got:** a new page on your site called **The Experience**. When
someone scrolls it, a wedding day plays out through your pieces like a movie
they control. It's the same trick as the TikTok you sent. It is NOT on your
live site yet — it's waiting so you can say "go."

**Your three things, none technical:**

1. **Film one clip, when you get a chance.** Phone sideways (landscape),
   10–20 seconds, ONE slow steady move — walk slowly around a finished arch
   in good light, or slowly toward a piece at a venue. No cuts, no talking
   needed. Send it to Codex or put it in the site folder as
   `assets/video/experience.mp4`. This turns the page's background into your
   real work being "played" by people's scrolling — the coolest part of the
   TikTok. **The page already works and looks finished without it**, so
   there's no rush — it's an upgrade, not a blocker.
2. **Say "go" (or "no").** After Codex has looked at it, tell either agent
   "merge the experience page" and it goes live at
   smithmadesc.com/experience.html a minute later. Until you say it, nothing
   changes on your live site.
3. **Nothing else.** No accounts, no passwords, no purchases involved.

---

## Still open from before (pointers, not repeats)

- **SM-FORM-001, the last inch:** the form code fixes shipped in PRs #29/#31
  and are on `main`. What's still never been proven: **Will confirming a real
  inquiry landed in will.smithmade@gmail.com's inbox** (check spam too). One
  real test inquiry from the live site closes it. Board: `SM-FORM-001`.
- **OPS-CALLERS-001** (Smith Digital callers / shared do-not-contact list):
  decision is Steen's; agents recommend and record only. Board entry stands.
- **OPS-PRIVACY-001:** this repo is public — keep customer details and real
  contact lists out of committed files.
- The 08-01 asks about `js/form.js` patching and `codex/site-qa-resilience`
  are **done** — that code is merged into `main` (verified in the files, not
  just the board). History: `ops/LOG.md` 2026-08-03 entry.
