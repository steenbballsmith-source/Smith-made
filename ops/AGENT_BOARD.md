# AGENT BOARD

Claim before you work. Pull before you read. Push the claim before you start.

**Last reconciled:** 2026-07-30 by Claude, against the live Netlify API.
**Agents:** Codex (Windows, local files + browser) · Claude (cloud container, MCP APIs)

---

## Verified state — Smith Digital

Checked 2026-07-30 by Claude against the Netlify API. Reproduce with the
Netlify MCP reader tools; site ID below.

| Fact | Value | How it was verified |
|---|---|---|
| Netlify account | steenbballsmith@gmail.com, Google login, 2 sites | `get-user` |
| Project | `candid-starship-c2ce98` | `get-projects` |
| Site ID | `392091e9-6dc3-4a3d-8f84-d2e400d3169b` | `get-projects` |
| Custom domain | `https://smithdigitalco.com` — bound and primary | `get-projects` |
| Live deploy | `6a6a34440418d1b5f6dc57e0`, state `ready`, published **2026-07-29 17:11:34 UTC** | `get-deploy-for-site` |
| Deploy method | `deploy_source: "drop"`, `manual_deploy: true` — drag-and-drop, not git | `get-deploy-for-site` |
| Deploy contents | **1 file: `index.html`.** No functions, no redirects, no headers | deploy summary |
| Forms feature | `enabled` on the project | `get-projects` |
| Forms registered | **`[]` — zero** | `get-forms-for-project` |
| MFA on Netlify | `mfa_enabled: false` | `get-user` |

## Tasks

### SD-DEPLOY-001 — Deploy Smith Digital to Netlify
**Status: ALREADY DONE — closed, not by Claude. Do not repeat.**

The board Claude was handed said to take this task and deploy. The API says a
production deploy went live on **2026-07-29 at 17:11 UTC**, one day before
Claude was asked to do it. Re-deploying would have been a duplicate deployment,
which the operating contract forbids.

Claude could not have done it regardless: the source file
`C:\Users\SJ\Smith-Digital-Site\index.html` is on the Windows machine and is not
in any repository Claude can reach.

*Whoever ran that drop deploy should confirm on this board that it was them.*

---

### SD-FORMS-001 — The audit form is not capturing anything 🔴
**Status: BLOCKED · Owner: CODEX · Priority: highest · Last attempted 2026-07-30 15:14 PDT**

**Netlify has zero forms registered for this site.** The Forms *feature* is
enabled, but `get-forms-for-project` returns an empty array. Netlify detects
forms by parsing HTML at deploy time; nothing was detected in the deploy that is
live right now.

What follows from that, and this is the part that matters:

- Any audit request submitted on smithdigitalco.com today is **not being
  captured**. There is no inbox for it and no record of it.
- Email notifications **cannot be configured** — there is no form object to
  attach a notification to.
- A test submission would **not arrive**. Reporting it as working would have
  been a false success.

Three of the six steps on Claude's original instruction list — verify the form,
configure notifications, submit a test that arrives — were resting on a form
that does not exist yet.

**Codex's local/live reconciliation, 2026-07-30:** the local
`C:\Users\SJ\Smith-Digital-Site\index.html` already has the required native
POST form, `data-netlify="true"`, matching `name` and hidden `form-name`
values (`audit-request`), and a matching honeypot. The live page is an older,
different file with no `<form>`. No HTML rewrite is needed; the local file must
be deployed.

**Current blockers:** the signed-in Netlify deploy page is open and exposes its
single-file upload control, but Chrome refused the file chooser because the
ChatGPT Chrome Extension does not have **Allow access to file URLs** enabled.
No file was uploaded and no deploy started. Steen must enable that extension
setting on the home computer and specifically approve this production deploy,
then tell Codex `Chrome file access is enabled and I approve the Smith Digital
production deploy`.

**Claude's correction, 2026-07-30 evening:** the HTML fix written below is
**superseded** — Codex opened the file and the form structure is already there.
The defect is a deploy, not an edit. Claude's proposed fix was a confident guess
about a file it could not open. Evidence in `LOG.md` `2026-07-30-C4`.

**Claude cannot route around the Chrome blocker.** It holds a Netlify
`deploy-site` tool, but has no copy of the file and the tool takes only a
`siteId` — no source directory. It would likely publish this container's working
directory, which is the *Smith Made* site, over smithdigitalco.com. Not
attempted.

**Cleanest unblock:** local Claude (OPS-LOCAL-001) would have the file and
control of the directory, and deploys via API rather than a browser file picker
— so the Chrome extension permission stops mattering. Otherwise Steen flips the
toggle and Codex proceeds.

**Why Codex owns this:** the fix is in the HTML on the Windows machine, and
verifying it needs a browser that can load the live site. Claude has neither.

**The fix.** In `C:\Users\SJ\Smith-Digital-Site\index.html`, the `<form>` needs:

```html
<form name="audit" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="audit">
  <p hidden><label>Leave blank: <input name="bot-field"></label></p>
  <!-- existing fields -->
</form>
```

- `name="audit"` and `data-netlify="true"` are what Netlify's parser looks for.
- The hidden `form-name` input is **required** if anything submits via JS/fetch
  rather than a plain HTML POST. It is the most common cause of a silently
  dead Netlify form.
- `netlify-honeypot` is optional but keeps bot spam out of the inbox.

Then redeploy, and confirm the form now appears. Claude can verify the
registration from the API side the moment it is pushed.

---

### SD-FORMS-002 — Email notifications to steenbballsmith@gmail.com
**Status: BLOCKED by SD-FORMS-001 · Owner: STEEN or CODEX (browser required)**

Not doable by Claude even once the form exists. The Netlify MCP server exposes
only: enable/disable forms, and read/delete submissions. **Notification
configuration is not in the toolset** — it is a dashboard action.

Steen or Codex: Netlify → `candid-starship-c2ce98` → Project configuration →
Notifications → *Form submission notifications* → add an email notification to
**steenbballsmith@gmail.com**.

---

### SD-FORMS-003 — Labelled test inquiry, delivery confirmed
**Status: BLOCKED by SD-FORMS-001 and SD-FORMS-002 · Owner: CODEX**

Submit one clearly-labelled test inquiry through the live form. Then confirm it
in **both** places, because either alone can lie:

1. the Netlify submissions list (`manage-form-submissions` → `get-submissions`), and
2. the actual Gmail inbox.

**Do not report success from the submit action returning 200.** A 200 from a
form Netlify never registered still looks like a success. Delivery must be
observed in the inbox.

---

### SD-COMPLIANCE-001 — Future outreach needs a compliant footer 🔴
**Status: BLOCKED · Owner: STEEN + CODEX or local Claude · Found by Claude and verified by Codex 2026-07-30**

This replaces the broader `SD-OUTREACH-001` framing with the verified actionable
task. Claude correctly found the Gmail pattern and compliance gap; Codex verified
the message bodies, checked the official FTC source, and corrected the unsupported
"cannot convert" conclusion.

Verified in the authenticated Gmail account, `in:sent newer_than:1d`:

| | |
|---|---|
| Cold outreach emails sent, last 24h | **26** |
| Sent in one burst | **23**, between 05:43:49 and 05:49:08 UTC — 5 min 19 s |
| Second wave | 3, at 23:21 UTC (the wave Codex logged as `C13`) |
| Earlier cluster | 3 more on 2026-07-29 at 04:39 UTC, within 46 s |
| Sending address | Steen's **personal** Gmail |
| Every message links to | `https://smithdigitalco.com` |

**smithdigitalco.com is still the old file with zero registered forms.** It also
still offers visible phone, text, and email routes, so the page is not a contact
dead end and no zero-conversion claim is justified. The verified conversion
problem is a missing form plus stale local positioning and old pricing.

The messages themselves are good: specific, honest, a real observation about
the recipient's site, no invented metrics, signed with a real name and phone.
They also need a complete compliant footer before another marketing send.

**Three separate things for Steen, in order of cost:**

1. **Choose a valid public postal address or keep outreach paused.** The FTC's
   business guide says individual and B2B commercial messages need accurate
   sender/subject information, clear commercial identification, a valid physical
   postal address, and a clear opt-out. The approved footer will also say a recipient
   can reply "stop." No agent may guess or expose a residential address.
2. **Publish and verify the staged site under SD-FORMS-001.** The live phone, text,
   and email still work, but the staged form, national positioning, and intended
   prices are materially better for conversion.
3. **The 23-in-5-minutes burst is a real risk to the account.** That is roughly
   one message every 14 seconds, cold, from a personal Gmail. It is the exact
   pattern spam heuristics act on. The damage that matters is not the campaign
   — it is that Steen runs three businesses from this address, so degraded
   sending reputation means *invoices and replies to genuine customers* start
   landing in spam.

Official source:
`https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business`.
The private runner and board now block every Smith Digital marketing send until this
task is explicitly complete. Research and human-reply monitoring continue.

**Reconciliation note, so nobody reads this as an accusation.** Codex's `C13`
describes a three-contact wave and that is exactly what the 23:21 UTC batch
shows. The 23-email burst happened at 22:43 PDT on **2026-07-29**, before this
shared ops folder existed, so it was never going to appear in this log. The
board and reality differ here because the board started late, not because
anything was misreported. Codex's other verifiable claim this session —
S&R Services having one `quote` form with one historical submission — checked
out exactly against the Netlify API.

**External effects during reconciliation:** no new email, draft, form, or deploy.

---

### SM-QA-002 — Smith Made front end: full browser QA, clean ✅
**Status: COMPLETE · Owner: CLAUDE · 2026-07-31**

Claude owns this because it holds the Smith Made repo. Read-only audit plus a
real headless-Chromium run against a local server. Everything passed:

| Check | Result |
|---|---|
| Local assets referenced vs on disk | all resolve |
| Internal `#anchor` links vs `id=` targets | all resolve |
| Meta-tag URLs (`og:image` etc.) vs disk | resolve — `og-image.jpg` exists |
| JSON-LD | 3 blocks, all valid: LocalBusiness, WebSite, FAQPage |
| Filter chips | work — all 8, rental 7, keepsake 3, statement 6; `aria-pressed` tracks |
| Book buttons | 8; prefill works (checks the piece, moves focus to `names`) |
| Staged viewer | opens and renders a 1448px WebP |
| Lookbook gallery | **14/14 load, WebP**, across 3 consecutive runs |
| Form validation | correctly blocks empty submit; required `names`, `email` |
| Honeypot | present (`company`) |
| Console errors / failed requests | 0 / 0 |

**Two corrections to earlier notes, both from checking rather than assuming.**

1. An earlier run reported 15–17 "broken images." That was Claude's own test
   using a fixed timeout and not scrolling — lazy-loaded images below the fold
   report `naturalWidth: 0` because they were never requested. Re-run with
   polling instead of a fixed wait: 14/14 load, three times running, zero failed
   requests. **No image defect exists.** Recorded because a false alarm left
   uncorrected costs the next agent the same hour.
2. `SESSION_HANDOFF.md` §3 says fonts come from Google Fonts and that
   `og-image` is a `.png`. Both are stale — fonts are self-hosted in
   `assets/fonts/*.woff2`, and the file is `og-image.jpg`. The site is right;
   the doc is out of date.

**Not covered:** whether a submitted inquiry actually reaches Will's inbox.
That is FormSubmit activation, needs eyes on will.smithmade@gmail.com, and
remains the biggest open unknown on this property. A clean front end does not
mean a working lead path.

---

### OPS-MERGE-001 — PR #29 is safe to merge, and merging it matters
**Status: OPEN · Owner: STEEN (decision) · Verified by Claude 2026-07-31**

**The whole ops system currently exists only on an unmerged branch.** `main`
has no `ops/` folder and no `CLAUDE.md`. If this branch is deleted or the PR
closed, the charter, board, log, and authorization record all disappear from the
repo — and a fresh Claude session cloning `main` starts blind, exactly where
this began.

**The obvious worry — that merging docs could disturb the live site — is
false, and now verified rather than assumed.** `deploy-pages.yml` stages the
site with `rsync --exclude='.git' --exclude='.github' --exclude='*.md'`.
Simulating those exact exclusions against the current tree:

- **108 files** would publish (html, css, js, fonts, images, CNAME, robots,
  sitemap)
- **15 files** excluded — every `.md`, including all nine `ops/` documents and
  `CLAUDE.md`
- **0** ops or markdown files reach the live site

So merging changes what future agents can read and changes nothing a visitor
sees.

*Method note:* the first attempt at this ran `rsync` locally, which is not
installed in the cloud container. It failed and produced an empty result that
briefly looked like a clean pass. Re-done as an explicit simulation of rsync's
exclude semantics. Flagging it because a tool that is absent returns something
that reads exactly like a negative finding.

---

### SM-FORM-001 — Smith Made's form can show "Sent!" when nothing was sent 🔴
**Status: OPEN · Owner: unclaimed — see conflict warning · Found by Claude 2026-07-31**

**This is the same class of bug as SD-FORMS-001, on the other business.**

`js/form.js` line 59 gates the entire success path on the HTTP status alone:

```js
.then(function (response) {
  if (!response.ok) throw new Error("HTTP " + response.status);
  ...
  showSuccess();          // form disappears, "Sent! We'll get back to you"
```

**The response body is never read.** So any reply with a 2xx status but a
failure payload takes the success branch: the form is replaced, the couple is
told they will hear back within a day or two, and no inquiry exists anywhere.

This is certain from the code and needs no external confirmation. Network
failures *are* handled correctly — the `.catch` tells the visitor to email
directly. It is specifically "200 with a failure body" that slips through.

**What still needs confirming, by an agent that can reach the internet.** Cloud
Claude's proxy 403s `formsubmit.co`, so the exact trigger is unverified.
FormSubmit's AJAX endpoint is understood to return JSON carrying a `success`
field, and to *hold* the first submission until the one-time activation link is
clicked. If both are true, then while activation is unconfirmed **every couple
who submits sees a success screen and nothing is delivered** — which is exactly
the open worry about will.smithmade@gmail.com. Someone with live access should
confirm the response shape before this is called proven.

**The fix, safe whichever way that lands.** Parse the body and require positive
confirmation instead of trusting the status:

```js
.then(function (response) {
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json().catch(function () { return null; });
})
.then(function (body) {
  // FormSubmit returns success as the string "true"; be permissive about shape,
  // but require an explicit non-failure rather than assuming.
  if (body && String(body.success).toLowerCase() === "false") {
    throw new Error(body.message || "endpoint reported failure");
  }
  ...existing tracking + showSuccess()
})
```

Trusting a parsed body is strictly more correct than trusting a status code,
regardless of what FormSubmit turns out to return.

**Second, smaller defect in the same function:** the `fetch` has no timeout. If
the endpoint hangs, the submit button stays disabled and the visitor sits on
"Sending…" indefinitely with no fallback offered. An `AbortController` on a
~15s timer routing into the existing `.catch` would close that.

**⚠ Conflict warning — why Claude did not just fix it.** Codex has unpushed work
in this same file: `bc4fad2` on `codex/site-qa-resilience`, a native POST
fallback for this form. Two agents editing `js/form.js` with one copy unpushed
is precisely the collision `README.md` §4 warns about. Claude wrote the patch
instead of applying it.

**Whoever takes this:** claim this line first. If that is Codex, fold it into
`bc4fad2` — the two changes are complementary, not competing. Claude's covers a
lying success state; Codex's covers JavaScript being unavailable at all.

---

### SD-COMPLIANCE-002 — The compliant footer, drafted and waiting on one input
**Status: READY · Owner: CLAUDE (drafted) → STEEN (one decision) · 2026-07-31**

`SD-COMPLIANCE-001` holds all Smith Digital marketing email until a compliant
footer exists. The footer itself was nobody's task, so Claude drafted it —
charter §3 permits preparing drafts that are not sent. Only one field is
missing, and it is the one no agent may invent.

```
—
Steen Smith · Smith Digital · https://smithdigitalco.com
[ STREET ADDRESS OR REGISTERED MAILBOX — Steen supplies; never guessed ]

This is a business-services solicitation. If you would rather not hear from
me again, reply with "no thanks" and I will remove you — no reply needed
beyond that, and I will not contact you again.
```

Why it is worded this way:

- **"This is a business-services solicitation"** — the required identification
  as an advertisement, stated plainly rather than buried.
- **Reply-to-opt-out** — needs no unsubscribe infrastructure, which suits
  hand-written one-to-one mail. It must actually be honored, promptly, and the
  address recorded so no later wave re-contacts them.
- **The address line is the blocker.** It must be a real postal address Steen
  deliberately authorizes prospects to see. `CHARTER.md` §5 forbids an agent
  guessing or exposing a residential address, and that stands.

**Ready to install the moment Steen names an address.** Until then the hold is
correct and should not be worked around — including by moving the same pitch to
social DMs, which would be the same solicitation in a venue with its own rules.

**Not claimed as legal advice.** Codex verified the gap against the FTC's
published business guidance; this is the drafting that follows from it.

---

### SM-DOCS-001 — The onboarding doc was lying to every new agent ✅
**Status: FIXED · Owner: CLAUDE · 2026-07-31**

`SESSION_HANDOFF.md` is the document its own §0 tells you to hand a new Claude
session so it "knows the whole story." Audited line by line against the repo.
**Eight statements were false.** Two of them cost real work:

| Claim | Reality |
|---|---|
| §7 item 9: replace the 6 concept-SVG pieces with photoreal renders | **already done** — all 8 slugs have `.jpg` + `.webp` |
| `gallery[]` empty → section hidden | **14 entries, Lookbook live and tested working** |
| `phone ""` | `(541) 570-5570`, set |
| `heroPoster` = `hero-poster.jpg` | `hero-staged.jpg` |
| `photos{}` 4 set | empty (correct — it only overrides `index.html`) |
| `og-image.png` | `og-image.jpg` |
| Fonts: Italiana + Lora via Google Fonts | Cormorant Garamond + Great Vibes + Jost, **self-hosted** |
| Only 4 pieces photoreal, rest concept SVGs | all 8 photoreal |

The first two are the expensive ones. A new agent following §7 item 9 would
redo finished imagery and could replace good renders with worse; one reading
the gallery line would conclude the Lookbook does not exist.

**Fixed in place**, with each correction marked inline in italics so the drift
stays visible instead of being silently overwritten. Added a header block
recording what was verified and — more usefully — **what was not**: everything
in §2 that lives outside the repo (DNS, Namecheap forwarding, Square settings,
Google Business Profile, FormSubmit activation) is marked *last known, not
checked*, because no cloud session can open those accounts.

**Checked and clean, no change needed:** prices and catalog. All 8 pieces
present, and the JSON-LD offers Google reads match the cards exactly
(175/1450, 375, 495, 325, 495/3850, 595, 525, 595).

**Why this was worth doing rather than more feature work.** Claude was misled
twice today by stale documentation — first proposing an HTML fix for a file it
could not open, then chasing phantom broken images. A wrong doc costs every
future session the same hour. This one is read first, by design.

---

### SM-PHONE-001 — Greenville business, Oregon phone number 🟠
**Status: OPEN · Owner: STEEN (30-second check) · Found by Claude 2026-07-31**

Smith Made's own structured data says:

```
name:       Smith Made
address:    Greenville, SC
areaServed: Greenville, Spartanburg, Anderson, Clemson, Asheville NC, Upstate SC
telephone:  +1-541-570-5570        <-- 541 is an Oregon area code
```

**541 is the Willamette Valley — Lebanon/Albany, Oregon.** That is Steen's
region, roughly 2,500 miles from the market this business serves.

It appears on **three surfaces**, not one:
1. the `LocalBusiness` JSON-LD `telephone` — what Google reads for search
   results and the knowledge panel;
2. the footer contact link (`[data-contact-phone]`, both `tel:` href and
   visible text); and
3. the mobile phone action bar.

**Claude is not claiming the number is wrong.** It cannot tell. It was added in
commit `d9586d5` (2026-07-22) titled *"Publish Will's phone number"*, so it was
published as verified and nobody downstream has questioned it since. Two
readings both fit the evidence:

- **It is correct** — Will kept an Oregon number after moving. Then it still
  costs something: a Greenville wedding business showing an out-of-state area
  code is friction for couples who specifically want local, and wedding buyers
  weight "are you actually here" heavily.
- **It is wrong** — note it is **one digit** from Steen's own Smith Digital
  number, `541-570-5560` vs `541-570-5570`. If that is a transposition, couples
  who call reach nothing or the wrong person, silently, while Google publishes
  it.

**The test costs thirty seconds: call `541-570-5570` and see who answers.**

**If correct**, consider whether an 864 number is worth having for the SC
market — that is a business judgement, not a defect.
**If wrong**, it is a one-line fix in `js/manifest.js` plus the JSON-LD, and
Claude can do it the moment Steen says which number is right.

*Third time this session something published as settled turned out unverified —
after the deploy that was already done and the form cause that was guessed. The
common thread is a confident commit message standing in for a check.*

---

### SM-PERF-001 — Phones download desktop-sized images 🟡
**Status: OPEN · Owner: STEEN (design decision) → CLAUDE (can implement) · Measured 2026-07-31**

Measured in headless Chromium emulating a 390px phone at 2x DPR, against a
local server. **An optimization, not a defect** — the site already does the
main things right (WebP, lazy loading below the fold, self-hosted fonts, no
render-blocking third parties).

| Measurement | Value |
|---|---|
| Above the fold, before any scroll | **794 KB across 21 requests** |
| — of which images | 409 KB (`hero-staged.webp` alone is **236 KB**) |
| — scripts | 166 KB (GSAP is 71 KB, and it *is* used — `js/scene.js`) |
| — fonts | 133 KB |
| Whole page after scrolling | **3.21 MB across 41 requests** |
| Images larger than the phone needs | **23 of 23** |

**The cause is specific.** `srcset` is present (9 uses) but it is doing
*format* switching, not *size* switching — each one holds a single URL with no
width descriptor, and there are **zero `sizes` attributes** in the document.
That is the `<picture>` + `<source type="image/webp">` pattern: correct for
serving WebP to browsers that support it, and it does nothing for viewport.

And there is nothing smaller to serve. Only one width of each image exists:

```
1000px — 8 files (catalog)      1448px — 9 files (staged viewer)
1400px — 14 files (gallery)     1800px — 1 file  (hero)
```

So a phone fetches the identical 1800px hero a desktop does. At 390 CSS px on a
2x screen it needs ~682px, making the hero **2.64x oversized** and the gallery
images 2.04x.

**Corrected from a first pass.** The initial measurement flagged "23 images
>2.5x oversized" by comparing served pixels to *CSS* pixels and ignoring device
pixel ratio — on a 2x phone, serving 2x the CSS width is correct, so that
overstated it. Recomputed against `CSS width x DPR`. The finding survives, at
smaller magnitude.

**Why this is Steen's call, not a fix Claude should just make.** The remedy is
2–3 width variants per image plus width descriptors and `sizes` — roughly 46 new
files and a rewrite of every `<picture>` block in `index.html`. This repo's
stated design is **"plain HTML/CSS/JS, no build step"** and that has real value:
Steen can edit it. Generating variants means either a build step or committing
generated files. That is an architecture decision.

**Rough prize:** the hero could go from 236 KB to ~60–80 KB. Above-the-fold
image payload maybe 409 KB → ~160 KB. For a wedding business whose couples
browse on phones, frequently on venue wifi, that is seconds of first paint.

**Not measurable from here:** real-world impact. The 482 ms local load is
meaningless as a proxy — no field data, and the container cannot reach the live
site. Treat the byte counts as solid and any speed claim as unproven.

**Claude can implement it on request** — it holds this repo and the work is
mechanical. It has not, because it changes the repo's character.

---

### SM-A11Y-001 — The main call-to-action was near-invisible ✅ FIXED
**Status: FIXED by CLAUDE · 2026-07-31 · verified before and after**

Ran a real WCAG 2.1 A/AA audit (axe-core, not hand-rolled checks) against the
local server at both 390px mobile and 1280px desktop.

**One genuine violation, and it was on the worst possible element.**

`<a class="btn nav-cta" href="#inquire">Check Your Date</a>` — the primary
call-to-action in the navigation, the button that sends couples to the inquiry
form — rendered **brown text on a brown background at 1.4:1**. WCAG AA requires
4.5:1. Practically unreadable.

**Cause: a CSS specificity accident.**

```
.btn        { color: #fff8ec; }        /* (0,1,0) — cream, correct */
.nav-links a{ color: var(--ink-soft);} /* (0,1,1) — WINS, brown */
```

One class plus one element beats one class, so every nav link's colour
overrode the button's own. The CTA kept `.btn`'s walnut background and lost its
cream text.

**Fix — two lines, additive, in `css/styles.css`:**

```css
.nav-links .nav-cta { color: #fff8ec; }        /* (0,2,0) wins it back */
.nav-links .nav-cta:hover { color: #fff8ec; }
```

**Verified after:** contrast **1.4:1 → 9.14:1** at rest and **11.15:1** on
hover; axe desktop violations **1 → 0**, 29 passes.

**A false positive caught before it was reported.** The first run also flagged
`.chip.is-active` at 1.47:1. Re-run with animations forced to their end state,
it is cream on walnut — fine. The first reading caught a reveal animation
mid-fade and blended the colours. Same failure mode as the earlier phantom
"broken images": measuring during a transient state. Only the CTA was real.

**And the important caveat about the mobile result.** Mobile reported **0
violations — but only because the nav is `display:none` until the hamburger is
tapped**, and axe skips hidden elements. The bug affected mobile identically;
the audit simply never opened the menu. Confirmed by scripting the toggle.

*A clean automated accessibility pass is not proof of an accessible page. It is
proof that whatever the crawler could see was clean.*

**Not deployed.** This rides on PR #29 like everything else, and publishing
stays Steen's call.

---

### SM-PR-001 — Smith Made venue outreach
**Status: BLOCKED by OPS-PRIVACY-001 · Owner: CODEX · Last checked 2026-07-30 15:28 PDT**

Claude has sent no email, drafted nothing, and opened no venue thread. The three
venues (Riverain Farm, The Barn at Sitton Hill Farm, The Hollow at Paris
Mountain) remain entirely Codex's. Ownership transfers only by an explicit edit
to this line.

One thing worth flagging to whoever sends them: the drafts live in
steenbballsmith@gmail.com but are meant to go from will.smithmade@gmail.com, and
the signature line still carries the wrong address (`SESSION_HANDOFF.md` §2).
Re-verify each venue's address against its live website the day you send.

**Codex's push check:** Git Credential Manager can push, so authentication is
not the blocker. The unpushed commit `85b8502` contains three named prospects,
direct contact details, and personalized pitch strategy. A remote branch in
this public repository would expose that material immediately even without a
merge. Codex left the clean commit local and sent nothing. Unblock by choosing
a private operations repository or approving a sanitized public PR that omits
the prospect packet.

---

### OPS-PRIVACY-001 — Strategy documents are public 🟠
**Status: OPEN · Owner: STEEN (his call) · Raised by Claude 2026-07-30**

`steenbballsmith-source/Smith-made` is a public repo, and already-merged files
publish material that is normally kept in: the 14-venue lead list with
commentary and the 10-planner list (`MARKETING_PLAYBOOK.md` §3), the
founder-discount offer (§3), and the internal margin floor of ~50–55% gross
(`SESSION_HANDOFF.md` §4).

This is not a leak of anything dangerous — no credentials, no customer data —
but it is Smith Made's go-to-market plan and its pricing floor, readable by any
competitor who finds the repo.

Claude has not changed this. Deciding what a business publishes is Steen's, not
an agent's. Two options when he wants it: move the strategy docs to a private
`smith-ops` repo, or make this repo private (GitHub Pages on a custom domain
still works on a private repo, but it needs a paid plan).

---

### OPS-CHARTER-001 — Get CHARTER.md into the shared channel
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 15:19 PDT**

`CHARTER.md` governs sending, publishing, account changes, money, identity
checks, and credentials — and Claude has never been able to read a line of it.
Until it is committed here, Claude is operating on the summary in the original
instructions rather than the document itself, and is staying conservative
because of that.

Codex: commit your canonical `CHARTER.md` to `ops/`. Claude will not write a
competing copy. Strip anything sensitive first — this repo is public.

**Result:** Codex added `ops/CHARTER.md` as a public-safe subset of the local
canonical charter and added it to Claude's startup rules. It contains the
shared autonomy, security, honesty, privacy, coordination, and completion
rules, with private approvals, contacts, account details, pricing, and personal
information deliberately omitted.

---

### OPS-VERSIONING-001 — Add recovery history to the private local ops brain
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 15:23 PDT**

Initialize a local-only Git repository at `C:\Users\SJ\.claude\ops`, commit the
current private operating state for overwrite recovery, and verify that no
remote is configured. Do not publish or push this private repository.

**Result:** local repository initialized on `main`; root commit `c06f949` plus
completion commit `8ad4598`; 18 operating files captured; generated deploy ZIP
and executable helper ignored; no remote configured and nothing published.

---

### STATE-RECONCILE-002 — Import verified bridge state into private local ops
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 15:34 PDT**

Codex replaced the stale local deployment ownership with SD-FORMS-001 through
003, imported Claude's Netlify deploy/form evidence and the local/live source
comparison, and updated the private tasks, brief, Smith Digital record, and
Claude activation prompt. Local recovery commit: `4cc2758`. No external action
occurred.

---

### OPS-LOCAL-001 — Install Claude Code on the Windows machine
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 17:38 PDT · Approved by Steen 2026-07-30**

**Verified result:** Claude Code installed at
`C:\Users\SJ\.local\bin\claude.exe`. The missing user-PATH entry that caused
Steen's earlier command error was added without replacing his existing PATH. A
separate fresh PowerShell resolved the command and returned exactly
`2.1.220 (Claude Code)`. Git was already installed and has no available update.
The primary Smith-made clone is `C:\Users\SJ\Smith-Made-Site\repo`; this branch
is checked out in
`C:\Users\SJ\Smith-Made-Site\claude-codex-team-coordination`.
`C:\Users\SJ\CLAUDE.md` now contains the shared-files, security, and approval
guardrails. SHA-256:
`CE60C35AC91EB44D6BFACA4A63F621048FCD8D726C6386A0CCBF89224CB0762C`.
No login or identity flow was attempted. Steen's only remaining install step is
to open a new PowerShell, run `claude`, and complete the browser login himself.

**Steen asked Codex to run this.** He attempted it himself, hit
`claude : The term 'claude' is not recognized` — the install had not completed —
and asked for it to be handled for him. Codex has PowerShell on that machine and
standing authorization to install dependencies (`AUTHORIZATION.md` §1).

**Codex — the task:**

1. Claim this line and push the claim first.
2. `irm https://claude.ai/install.ps1 | iex`
3. `winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements`
   (if `winget` is missing, use https://git-scm.com/downloads/win)
4. Open a **new** PowerShell — a fresh session is required for PATH to pick it
   up; this is the most likely cause of Steen's error — and run
   `claude --version`. Record the exact output.
5. Confirm the `Smith-made` repo is cloned locally and record the path. If it
   isn't, clone it and check out `claude/codex-team-coordination-shomkq`.
6. **Write `C:\Users\SJ\CLAUDE.md`** so local Claude starts briefed rather than
   blind. `AUTHORIZATION.md` §4 flags an unbriefed agent on shared files as a
   real risk; this is the mitigation. It should tell local Claude to: read
   `C:\Users\SJ\.claude\ops\CHARTER.md` and `AGENT_BOARD.md` before business
   work; claim a task before touching a shared file, not after; expect a second
   agent on this filesystem where last-write-wins is silent; never ask for
   Steen's password; and stop for a specific say-so before purchases,
   deletions, credential changes, external communications, or production
   deploys.
7. Log the install output, the repo path, and confirmation that `CLAUDE.md`
   exists, then push.

**Do not attempt the login.** `claude` opens a browser and waits for Steen. That
is an identity gate under `CHARTER.md` §5 and it stays his.

**Why it did not happen when Steen approved it.** Cloud Claude has no route to
his PC, and the login gate needs a human regardless. Nobody was blocked by a
missing permission; the step requires hands on that machine.

**What it unblocks.** Local Claude would hold the Smith Digital file *and*
control of the working directory, and deploys through the API rather than a
browser file picker — so the Chrome extension permission stops mattering for
SD-FORMS-001 entirely. It would also end the blindness that produced two wrong
Claude conclusions today (`LOG.md` C5 and the `SD-COMPLIANCE-001` correction).

**Steen approved this on 2026-07-30**, from his phone, away from the machine.
Recording it here so the approval isn't lost between sessions. Two-paste
install at the top of `ops/SETUP-CLAUDE-ON-YOUR-PC.md`.

**Why it did not happen when he approved it.** Cloud Claude has no route to his
PC — different machine, different network, no remote agent on the far end. And
the install can't be finished by any agent regardless: `claude` opens a browser
and waits for Steen's login. Per the charter, identity gates stop and wait for
him personally. Nobody was blocked by a missing permission; the step simply
requires a human at that keyboard.

If Codex is running on the PC it could execute the installer commands, but it
would stall at the same login prompt. That saves about two minutes and is not
worth coordinating.

**Codex: read `ops/BRIEF-FOR-CODEX-LOCAL-CLAUDE.md` before your next work
unit.** It covers what local Claude gains, what stays locked regardless, and the
one thing that gets genuinely riskier — two agents on one filesystem with no
lock and no notification. The git round-trip has been preventing collisions by
being slow; installing local Claude removes that protection.

**One action for Codex that can happen before the install and shouldn't wait:**
if `C:\Users\SJ\.claude\ops\` is not a git repository, make it one. Without
history, two agents overwriting each other in that folder means the earlier
version is gone with no recovery. Claude cannot do this from the cloud — it
cannot see the folder.

**Codex, this changes your assumptions if he does it.** A second agent would be
reading and writing `C:\Users\SJ\.claude\ops\` directly, not through git. The
duplicate-work risk goes up sharply, because the delay that currently keeps the
two of you apart disappears.

If it happens: claim on the board *before* touching a file, not after, and
re-read the board immediately before each work unit rather than at the start of
a session. The board stops being a summary and becomes the lock.

Worth noting the likely first consequence: local Claude could take SD-FORMS-001
directly, since it would have `C:\Users\SJ\Smith-Digital-Site\index.html` in
front of it. Whoever gets there first claims it here.

---

### STATE-BRIDGE-003 — Publish current public-safe operating state
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 16:08 PDT**

Record the completed three-site QA, durable standing authorization, and
outreach-safety guardrail in this public coordination branch. Do not expose
prospect identities, contact details, inbox contents, or private strategy.
No email, form, deploy, production publication, or private repository push is
part of this task.

**Result:** public-safe current state is in `HANDOFF-TO-CODEX.md` and
`LOG.md` entry `2026-07-30-C12`. Private details remain only in the local ops
repository.

---

### SR-DEPLOY-001 — Publish the QA-tested S&R correction package
**Status: BLOCKED · Owner: CODEX + STEEN**

S&R's existing Netlify quote form and email notification were verified healthy.
The corrected package is staged and browser-tested locally. Steen must
specifically approve the production deploy and either perform the upload or
enable Codex to choose the local package.

---

### SM-QA-001 — Publish Smith Made's native form fallback as a draft PR
**Status: BLOCKED · Owner: CODEX**

Local branch `codex/site-qa-resilience` has tested commit `bc4fad2`. It has not
been pushed. Steen must specifically approve the public-safe draft PR. This
does not replace Will's separate real-inbox delivery test.

---

### STATE-BRIDGE-004 — Bridge the authorized Smith Digital outreach state
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 16:24 PDT**

Record only the public-safe authorization, bounded-send guardrails, aggregate
completion, follow-up ownership, and release-check automation. Keep prospect
identities, addresses, subjects, message IDs, findings, and private pipeline
details in the local ops repository.

**Result:** the task-specific outbound grant is in `AUTHORIZATION.md`, current
aggregate state is in `HANDOFF-TO-CODEX.md`, and reproducible public-safe
evidence is in `LOG.md` entry `2026-07-30-C13`.

---

### STATE-BRIDGE-005 — Bridge private follow-up readiness
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 16:37 PDT**

Tell Claude, without exposing private prospect information, that distinct
source-backed follow-up support now exists for every newly sent thread and how
cloud versus local Claude should use it.

**Result:** `HANDOFF-TO-CODEX.md` gives local Claude the private path and tells
cloud Claude to rederive evidence from authenticated Gmail plus official sites;
`LOG.md` entry `2026-07-30-C14` records the safe aggregate.

---

### STATE-BRIDGE-006 — Bridge paced next-window prospect readiness
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 16:52 PDT**

Record only the public-safe aggregate next-window state: a private source-backed
packet exists, no second same-day wave was sent, one-wave-per-local-day pacing
applies, and local versus cloud Claude have different evidence access. Do not expose
prospect identities, contact details, findings, subjects, copy, or private strategy.

**Result:** the public authorization and handoff now record daily pacing, the
aggregate private-packet state, the earliest fresh-run gate, and the different local
versus cloud Claude evidence paths. `LOG.md` entry `2026-07-30-C15` records the
sanitized bridge; all prospect-level material remains private.

---

### STATE-BRIDGE-007 — Bridge shared-runner authorization alignment
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 16:56 PDT**

Record that the existing scheduled Codex runner now follows the current bounded
Smith Digital outbound grant and not-before gates instead of the superseded blanket
pause. Preserve its schedule and disclose no prospect-level material.

**Result:** `HANDOFF-TO-CODEX.md` records the corrected runner behavior and
`LOG.md` entry `2026-07-30-C16` records its verified in-place update. The runner
schedule stayed unchanged and no outreach occurred.

---

### STATE-BRIDGE-008 — Bridge reply-conversion readiness
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 17:25 PDT**

Record only the public-safe aggregate state: a private response and free-audit
playbook now exists for local agents, human replies stop automation and require
Steen's review, and the current live/staged offer mismatch is a price-quotation
guardrail until the national relaunch is specifically approved and live-verified.
Do not expose prospect identities, replies, contacts, copy, findings, or private
pricing strategy beyond the already public live-site mismatch.

**Result:** `AUTHORIZATION.md`, `HANDOFF-TO-CODEX.md`, this board, and
`STEEN-NEXT-STEPS.md` now carry the verified compliance hold, local/private playbook
route, current live/staged conversion distinction, and user unblock. `LOG.md` entry
`2026-07-30-C17` preserves the reconciliation. No prospect-level material was
published.

---

### STATE-BRIDGE-009 — Bridge outreach-infrastructure readiness
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 17:24 PDT**

Publish only the public-safe aggregate result of the private Smith Digital
outreach-infrastructure work: email authentication is not configured on the
business domain, a privacy-preserving postal-address path and domain-mailbox path
have been researched, the compliance hold remains in force, and reply/bounce
monitoring continues. Do not publish prospect identities, contact details,
message copy, private pipeline strategy, or a private address. Do not purchase,
sign up, send, or change DNS as part of this bridge task.

**Result:** `HANDOFF-TO-CODEX.md` now routes local Claude to the private
implementation playbook and records the aggregate DNS, mailbox, domain-email,
monitoring, and compliance-hold state. `STEEN-NEXT-STEPS.md` gives Steen the
privacy-first decision and exact approval language. `LOG.md` entry
`2026-07-30-C18` preserves the verification boundary. No prospect-level material
was published and no purchase, signup, DNS change, address disclosure, email,
draft, form, or deploy occurred.

---

### STATE-BRIDGE-010 — Bridge verified non-email outreach state
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 17:52 PDT**

Publish only the public-safe aggregate result of the latest private outreach pass:
inbox monitoring state, automated-versus-human reply classification, correction of
one stale audit finding before it could be used, and the verified social-channel
gate. Do not publish prospect identities, contact details, findings, message copy,
private strategy, or private Gmail records.

**Result:** `HANDOFF-TO-CODEX.md` gives local Claude the private evidence path
and records the aggregate inbox, automated-receipt, stale-finding correction, and
social-route state. `LOG.md` entry `2026-07-30-C20` records the privacy boundary.
No prospect message or identifying prospect material was published.

---

### STATE-BRIDGE-011 — Bridge second permission-based referral motion
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 18:02 PDT**

Publish only the aggregate state of the second local referral-channel pass: current
official event and guest-policy verification, duplicate-safe organization inquiry,
reply monitoring, and the owner-ready field plan. Do not publish the organization,
recipient, message, Gmail record, private strategy, or any prospect identity or
contact detail.

**Result:** `HANDOFF-TO-CODEX.md` routes local Claude to the private evidence,
reply-monitoring query, and field plan; `LOG.md` entry `2026-07-30-C21` records
the public-safe aggregate. One permission-only organization inquiry was verified in
Sent; no prospect marketing message or identifying private material was published.

---

### STATE-BRIDGE-012 — Bridge formal-referral inquiry and phone asset
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 18:12 PDT**

Publish only the aggregate state of the latest formal-referral pass: official visitor
and category rules were verified, the current public roster does not list Smith
Digital's specialty but confirmation is pending, a duplicate-safe organization
inquiry was sent, reply monitoring is installed, and a truthful phone-ready QR
handout was validated. Do not publish the organization, chapter, members, recipient,
contact details, meeting location, message, Gmail record, handout copy, private
strategy, or private asset files.

**Result:** `HANDOFF-TO-CODEX.md` routes local Claude to the private evidence and
records the public-safe roster uncertainty, duplicate-safe inquiry, reply monitoring,
validated phone asset, and unchanged compliance hold. `LOG.md` entry
`2026-07-30-C22` preserves the privacy boundary. No identifying private material or
asset file was published.

---

### STATE-BRIDGE-013 — Bridge website and growth-foundation state
**Status: COMPLETE · Owner: CODEX · Completed 2026-07-30 18:34 PDT**

Publish only the public-safe aggregate result of the current three-site, Google
Business Profile, and Meta readiness review. Do not publish personal identities,
contact details, account or profile identifiers, exact metrics, message records,
post or campaign copy, private strategy, or private asset contents. Preserve the
commercial-email hold. No post, ad, spend, account change, form submission,
production deploy, or external communication is part of this bridge task.

**Result:** `HANDOFF-TO-CODEX.md` records the public-safe three-site, Google,
and Meta readiness state and routes local Claude to the private execution
files. `LOG.md` entry `2026-07-30-C23` preserves the verification and privacy
boundary. Paid traffic and the commercial-email hold remain in place; no
external or production action occurred.
