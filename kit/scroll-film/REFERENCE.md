# The reference video, decoded

**Source:** TikTok by @nomadatoast (Jo Mendes), 36 seconds, saved by Steen
2026-08-28. Analyzed frame-by-frame by cloud Claude the same day (73 frames
extracted at 2 fps; contact sheets in the session log evidence).

This is the shared definition of "the cool stuff" so nobody is chasing a
different target. When Steen says *"like the TikTok,"* he means the things on
this page.

## What is actually on screen

**Hook (0–6s).** Caption: *"I feel useless… beginners can sell 3D sites like
this now. I'll show you."* He opens his own site: the hero is **his own
face, life-size**. As he scrolls, the portrait **shatters into thousands of
particles** that blow away, reform into **flowing fiber strands with glowing
amber tips**, then gather into a **dandelion-like ball around a glowing
core**. Copy beside it: "Creating content that connects" · "Over one million
curious people" · "Helping creators grow and monetise with AI" · "Made by
NomadaToast using Emergent."

**Example sites (6–14s).** Voiceover: *"Websites don't require coding
knowledge or 3D skills anymore… even your grandma can make websites like
these."* He scrolls three other sites of the genre:
- **Terminal** (logistics): cinematic yard footage of trucks — scrolling
  turns the whole scene into a **glowing wireframe/x-ray view** ("We have
  reinvented the future of logistics… through the yard").
- **StringTune**: a katana on black; scroll slides the blade and swaps
  oversized text ("Master Your Skills… Concentrate… Keep Sharp").
- A **DNA-testing site**: a jeweled 3D helix that rotates and advances with
  scroll ("How will DNA testing change you?").

**The recipe (14–27s).** In **Emergent** (app.emergent.sh, an AI app
builder): choose Full Stack App / Landing Page → model **Claude 4.7 Opus** →
agent **E-1 "Stable & thorough"** → (optional) connect GitHub. Then he drags
three things into the prompt box:
1. a **prompt file** — `NT Scroll Video Hero Prompt.txt` (his own written
   prompt; he sells/gives it via his "comment AI" ManyChat funnel, alongside
   an `Emergent Step-by-Step Guide.pdf`),
2. **his own video** — an ordinary clip of himself (`Emergent 2 Hero Vid.mp4`),
3. an **inspiration link** — `https://fine-n7vljkp34f.peachworlds.com/`
   (an example site with this aesthetic).
"BOOM" — the result is the face site from the hook: **the video becomes the
hero, scrubbed by scroll, dissolving into particles.**

**No video? (27–34s).** He photographs his **fridge**, feeds the photo to
**higgsfield.ai** (Kling 3.0 video model) with a written motion prompt —
*"Cinematic transformation, organic motion, continuous evolution from frame
1. START: [what the first frame shows]. END: [what the last frame shows]"* —
gets back an AI-generated **transformation video** (fridge opens, groceries
fly out), and runs the same Emergent recipe. Result: a "Virtual Fridge"
landing page where scrolling opens the fridge ("Track meals, macros, and
ingredients in one connected flow" · "Food tracking that fits real life").

**Close (34–36s).** *"Claude handles the execution… you could literally sell
this as a service. Comment AI for the links and the assets."*

## The effects, named

| # | Effect on screen | In our kit |
|---|---|---|
| 1 | **Scroll-scrubbed video hero** — scroll plays/rewinds the clip | ✅ `scrollfilm.js` phase 1 |
| 2 | **Particle dissolve** — the picture shatters into drifting embers that keep showing the moving frame | ✅ phase 2 (raw WebGL, ~16–36k points) |
| 3 | **Ember drift + closing pitch** — particles float while the CTA lands | ✅ phase 3 |
| 4 | Scroll-timed copy blocks riding the film | ✅ `.sf-caption` windows |
| 5 | Wireframe/x-ray scene swap (Terminal) | ❌ not built — needs a real 3D scene, different class of work |
| 6 | 3D object showcase (katana, DNA helix) | ❌ not built — same reason |
| 7 | Photo → AI "transformation video" (fridge) | ✍️ recipe documented in README; generation happens in an AI video tool, then the clip drops into #1–3 |

Rows 1–4 are what makes the demo sites feel alive, and they're covered.
Rows 5–6 are true WebGL scene work (a modeled object, not a video) — possible
later, but not what the recipe in the video produces either: **his own
"BOOM" result is rows 1–4.**

## What the seller's pipeline was, honestly

Emergent + a prompt file + Claude wrote *an implementation of rows 1–4*
around the uploaded video. We are Claude. The kit in this folder **is** that
implementation — no Emergent subscription, no ManyChat funnel, no prompt
file to buy. What the pipeline still needs from a human is the same thing
his needed: **a decent 10–20 second clip** (or a photo run through an AI
video generator using the START/END prompt pattern above).
