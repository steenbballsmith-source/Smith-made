# Current handoff to Codex

## 🔴 DO THIS FIRST — rename the Smith Digital honeypot; it is probably eating real leads

**2026-08-02 23:30 UTC.** `SD-FORMS-004` **recurred**: a second submission
advanced `last_submission_at` (`2026-07-31T10:30:04.432` →
`2026-08-02T23:19:04.396`) without incrementing `submission_count`, and with
**no notification email**. Evidence: `LOG.md` `2026-08-02-C48`.

**Twice in three days on a site with negligible traffic is a mechanism, not
coincidence — and the mechanism is a field name.** The honeypot is
**`company-website-hp`**. Browsers and password managers autofill by matching
names, and that string contains **two** tokens they target: `company` and
`website`. **A real visitor with autofill enabled gets the hidden field filled
for them, trips the honeypot, and is silently classified as spam.** They see
"success". Steen gets nothing.

**The task, in the Smith Digital `index.html` on the Windows machine:**

1. Rename the honeypot to something autofill has no reason to touch — `hp-x9`,
   `zc-field`, anything meaningless. **Change it in both places**: the `name`
   attribute on the input *and* the `netlify-honeypot="..."` attribute on the
   `<form>`. They must match or the honeypot silently stops working entirely,
   which is a worse failure than the one being fixed.
2. Redeploy. Deploys no longer need a second confirmation (`AUTHORIZATION.md`
   §1B) — **but the post-deploy verification in §1C is mandatory**: fetch the
   live page, confirm the new field name is serving, and log the evidence.
3. Note on the board that Netlify **re-registers form fields on deploy**, so
   the field list will change — that is expected here, not a new deploy
   fingerprint to investigate.

**What this does NOT do: recover anything already queued.** Past silent
submissions exist only in the dashboard's **Spam** tab, and only Steen can read
them — the Netlify MCP toolset has **no submission-reading operation at all**.
Do not tell him the rename recovers them.

---

## 🛑 BOTH AGENTS, READ FIRST — Meta restricted Smith Digital's business account **for automation**

**2026-08-02 08:58 UTC.** Meta restricted the Smith Digital business account:
no ads, no audiences. Its stated reason: *"this account was created or used
with an **automation** that doesn't follow our rules."* Same morning, 07:58 and
08:01 UTC, that account's Accounts Center was restructured — removals then
additions — and the restriction landed within the hour. Evidence: `LOG.md`
`2026-08-02-C47`. Board: `OPS-META-RESTRICT-001`.

**If that was one of you: this is not a telling-off, it is the finding.** The
work was almost certainly legitimate and authorized. Meta's automated
enforcement does not assess either — it reacts to **speed and pattern**, and it
restricts before it asks. Say so plainly on the board if it was you; the
timeline is more useful than a clean record.

**Two instructions, effective now:**

1. **Stop all automated activity on Meta properties** — Facebook, Instagram,
   Business Manager, Accounts Center, ad accounts — until Steen's review
   resolves. **Repeat triggers turn a restriction into a permanent ban.** Do
   not "just check" the account programmatically; that is more of the signal
   that caused this.
2. **Do not file the appeal**, even though §1C now permits agents to take
   external actions without asking. Three reasons: another automated action on
   a freshly automation-flagged account is the worst available next move; an
   appeal is a factual claim about how the account is used, which only Steen
   can truthfully make; and Meta appeals routinely escalate to identity
   verification, which no permission reaches. **It is on Steen's list.**

**The general rule this implies, proposed for the charter:** on platforms with
automated enforcement, **work at human pace and never batch account-structure
changes.** The one-gate rule reduced *Steen's* approvals — it grants no
immunity from another company's abuse defences, and no permission he can give
ever will. Slower is cheaper than losing an account.

---

## 📍 LOCAL CLAUDE — session 2 (2026-08-01 ~22:10 UTC). PR #29 is MERGED and the deploy ran. Your three tasks:

Steen said "merge it" in the cloud chat at ~22:00 UTC, minutes after your LC2
entry recorded his deploy-gate change — the two authorizations agree. Cloud
Claude merged PR #29 (merge commit `46e7e4d`) and the Pages workflow
**"Deploy site to GitHub Pages" completed `success` at 22:04:13 UTC** on that
exact sha. The patched `js/form.js` and the `.nav-links .nav-cta` contrast fix
should now be serving. Your tasks, in order:

**1. The mandatory post-deploy check — your own LC2 entry is the one that made
it mandatory.** Fetch `https://smithmadesc.com/js/form.js` with a cache-buster
(`?v=` + anything) and confirm the live bytes contain `response.json()` and
`Non-JSON response — activation or verification page`, and that success is no
longer decided by `response.ok` alone. Also confirm
`https://smithmadesc.com/css/styles.css` contains `.nav-links .nav-cta`. If
either is stale, wait out the CDN (~10 min) and re-fetch before concluding
anything. Record the verdict on the board under `SM-FORM-001` with the bytes or
a grep as evidence. **If the live file is wrong, say so loudly — do not fix
silently.**

**2. Sync the private ops brain, and leave Codex one note.** Update
`C:\Users\SJ\.claude\ops\` (private board) with today's state: PR #29 merged
and live; SM-FORM-001 resolved-pending-Will's-inbox-confirmation; the deploy
gate change (your LC2); OPS-DOMAIN-001 unchanged, deadline **Aug 13**;
OPS-BILLING-001 open; OPS-CALLERS-001 — three callers, assignment de-duped,
**outcomes still don't flow back**. The note for Codex: its
`codex/site-qa-resilience` branch is now the **only unshipped fix** on Smith
Made's lead path (native fallback + privacy page). It doesn't touch
`js/form.js`, so rebasing on new `main` should be clean. Codex decides how it
ships; a deploy Steen directs no longer needs a second confirmation per §1B.

**3. Push your results** — board addendum + anything you changed, commit, push
to `claude/codex-team-coordination-shomkq`. Cloud Claude's watcher confirms
receipt. Nothing beyond these three: the other four gates (money, credentials,
deletion, external comms) are untouched, and no deploy happens that Steen
didn't start.

---

## ✅ LOCAL CLAUDE'S FIRST SESSION IS DONE — both tasks executed 2026-08-01 14:52 PDT

Written from the Windows PC by local Claude. Steen's login is complete (his own
browser OAuth), `claude --version` is `2.1.220`, and the branch was pulled
`299e126` → `a537973`. **The PC↔cloud bridge is proven and two-directional** —
this paragraph is the proof. Full evidence: `LOG.md` `2026-08-01-LC1`,
addendum under `OPS-LOCAL-001`.

### The FormSubmit answer: ACTIVATED. The form is not a black hole.

One labeled test POST to
`https://formsubmit.co/ajax/will.smithmade@gmail.com`, with the `Origin` and
`Referer` a real browser sends, returned:

```
HTTP 200 · {"success":"true","message":"The form was submitted successfully."}
```

**The biggest unverified risk in the operation, open since 07-31, is resolved
in the good direction.** Inquiries reaching that endpoint from the live site are
accepted for delivery.

### 🔴 But three things got worse, not better, and they need you

**1. The defect is now confirmed live, not theorised.** A first POST sent
without `Referer`/`Origin` returned **HTTP 200** carrying
`{"success":"false"}`. The live site runs **unpatched** `js/form.js` — fetched
and checked: 4,445 bytes, still `if (!response.ok) throw new Error(...)`, no
`response.json()`. On that exact response a real couple sees *"Sent! We'll get
back to you within a day or two"* while FormSubmit has just said it did not
send. Reproducible on demand.

**2. `index.html` has no `action` attribute on the live site.** Which means
**SM-QA-001's native fallback is not protecting anyone.** It closed on the
board, but it is sitting on `codex/site-qa-resilience`, unmerged and undeployed.
Line 703 live is still a bare `<form class="form" data-inquiry-form novalidate
data-reveal>`. Two fixes for Smith Made's only lead path are now finished, on
two different branches, and **neither is in front of a visitor.**

**3. FormSubmit sends `Content-Type: text/html` even when the body is JSON.**
`.json()` ignores content-type so the patch is safe, but anything sniffing the
header will be wrong every time.

### What each of you owns now

- **Will —** a message titled **`TEST - agent verification - FormSubmit
  activation check`** is in `will.smithmade@gmail.com`. **Check spam.** Say
  whether you can see it. `SM-FORM-001` cannot close until you do — acceptance
  is not arrival, and that last inch is yours.
- **Codex —** take, amend or discard the `js/form.js` patch on
  `claude/codex-team-coordination-shomkq`, and decide how the two branches get
  in front of visitors. **The deploy itself is Steen's approval, not yours or
  mine.**
- **Steen —** the question you have been carrying about the Smith Made form is
  answered: it works. The remaining piece is Will checking his inbox, and your
  say-so on putting the two finished fixes live.

Everything below is prior context. Codex owns its items; cloud Claude owns the
watch.

---


**Last reconciled:** 2026-07-30 18:34 PDT by Codex
**Full evidence:** `ops/LOG.md`, entries `2026-07-30-C17` through
`2026-07-30-C23`

This file is the current inbox. The original Claude handoff was read and acted
on. Its verified history is preserved in the log.

## 🟢 Small, quick, do first: pre-flight the PC for Steen's first local-Claude login

**2026-08-01 evening.** Steen has said again, in plain terms, that he wants
local Claude running with the widest access he can give it. The install you did
on 07-30 (`OPS-LOCAL-001`) is still the completed foundation — thank you, the
fresh-shell verification held up. **The only human step left is his browser
login, and he's been given the exact three steps.** Before he sits down, make
his first launch land on current state instead of Thursday's:

1. **Pull this branch on the PC.** `claude/codex-team-coordination-shomkq` in
   `C:\Users\SJ\Smith-Made-Site\claude-codex-team-coordination` is ~15 commits
   behind as of tonight. Local Claude's first act will be reading the board and
   this handoff; make sure it reads today's, not July 30th's.
2. **Fresh-shell re-verify** `claude --version` still answers (any 2.x is
   fine — if the auto-updater moved it past 2.1.220, that's normal, note the
   number on the board).
3. **Re-check `C:\Users\SJ\CLAUDE.md`** against what has changed since you
   wrote it: the board now carries OPS-DOMAIN-001 (domain suspends Aug 13),
   OPS-CALLERS-001 (shared do-not-contact list), OPS-WATCH-001 (deploy-ID
   watching), and the SM-FORM-001 patch sitting on Claude's branch. If your
   startup guardrails file summarizes open state, refresh that summary.
4. **Do not run interactive `claude`, do not touch the login.** Same line as
   before — the browser OAuth is Steen's personally. You did this correctly on
   07-30; it stays correct.

When done, mark it on the board under `OPS-LOCAL-001` as a dated addendum.

---

## ⚠ SM-FORM-001 — Claude applied the patch. Take it, amend it, or throw it out.

**2026-08-01 19:10 UTC.** The patch below was written for you at 00:50 UTC and
left for you to apply. Eighteen hours on, `js/form.js` was still untouched —
and you were plainly not idle, you shipped a second wave of twenty call leads
at 15:18. So rather than let a live defect sit on Smith Made's **only** lead
path over a weekend, Claude applied it to
`claude/codex-team-coordination-shomkq`.

**This is a claim Claude made for you and then took back, which is a real
deviation from the working agreement, so it is being said plainly rather than
buried.** Two of the three reasons for leaving it alone had expired: you had
pushed, and `git log origin/codex/site-qa-resilience -1 -- js/form.js` returns
`a7426bf` — you are not in that file. **The third reason still stands and is
yours: you can test against the live endpoint and Claude cannot.**

**Not merged. Not deployed.** A production deploy is outside the grant. The
commit sits on Claude's branch as something reviewable. **If you dislike it,
discard it — no argument.**

What changed: `response.ok` no longer decides success; the body is parsed.
Verified with `node --check` and seven simulated responses — genuine JSON
success passes, while the activation page (200 + HTML), verification
interstitial, `success:"false"`, empty body and HTTP 500 all correctly show the
error instead. The existing `.catch` message is untouched.

### The part only you can do, and it matters more than the patch

**Has `will.smithmade@gmail.com` ever been activated with FormSubmit?**

If it never was, **the form has never delivered a single inquiry**, and this
patch does not repair that — it only stops the form lying about it. Please send
one real test inquiry and confirm it arrives. That is still the largest single
unverified risk anywhere in this operation, and it has been open since
2026-07-31.

---

## ⚠ `codex/site-qa-resilience` reviewed — good branch, one gap that undoes part of it

**Reviewed 2026-08-01 00:50 UTC by Claude**, at `e0313b4`. Read this before you
open a PR, because the branch name and the native fallback together make it
very easy for the next person to conclude the inquiry form is fixed. **It is
half fixed.**

**What you got right, and it is worth saying plainly:**

- **The native fallback works.** `action` + `method` on the form, `novalidate`
  dropped so the browser validates when JS is absent. That closes SM-QA-001.
- **You removed an unverifiable liability-insurance claim** from both the FAQ
  prose *and* the JSON-LD — the structured-data copy is the one everybody
  forgets, and Google surfaces it. Promising a venue a certificate of insurance
  that cannot be produced is the kind of thing that detonates a week before a
  wedding. Right call.
- **You reframed the $50 date hold honestly.** "Your date comes off the
  calendar today" → "a temporary seven-day hold… not a confirmed booking."
  That difference is the difference between a disappointed couple and a
  chargeback.
- Privacy policy, footer link, sitemap entry, form disclosure, 44px touch
  target, and a meta description cut from ~232 to ~150 characters. All correct.

### The gap: SM-FORM-001 is untouched, and the fallback hides it

`js/form.js` is **not in the diff.** Line 59 still reads:

```js
if (!response.ok) throw new Error("HTTP " + response.status);
```

Success is still decided by the HTTP status alone. **The body is never read.**

**Why that specifically breaks against FormSubmit.** FormSubmit answers with
**HTTP 200** for its "please activate this form" page on a first-ever send to
an address, and for its verification interstitials. `response.ok` is `true` for
every one of those. So the JS path — which is what essentially every real
visitor runs — calls `showSuccess()` and tells a couple *"Sent! We'll get back
to you within a day or two"* **while nothing was delivered to
will.smithmade@gmail.com.**

**And note the inversion you have created.** After your change, the no-JS path
fails *visibly* (the visitor lands on FormSubmit's own page and can see
something is wrong), while the JS path fails *silently*. The rarely-used route
is now the honest one. That is backwards, and it is why this cannot be left.

**The patch.** Replace the first `.then` in `submitToEndpoint`:

```js
  .then(function (response) {
    if (!response.ok) throw new Error("HTTP " + response.status);
    // The request sends Accept: application/json, so a real success is JSON.
    // FormSubmit's activation and verification pages return HTML with a 200 —
    // parsing is what separates them from a genuine send.
    return response.json().catch(function () {
      throw new Error("Non-JSON response — activation or verification page");
    });
  })
  .then(function (payload) {
    // FormSubmit returns success as the STRING "true", not a boolean.
    var ok = payload && (payload.success === true || payload.success === "true");
    if (!ok) throw new Error("Endpoint reported failure");
    /* analytics + showSuccess() + form.reset() move here, unchanged */
  })
```

The existing `.catch` already shows the correct fallback message, so a failure
now tells the couple to email directly instead of lying to them.

**Claimed for you, not taken.** Claude did not apply this. You had unpushed work
in that file until an hour ago, the working agreement forbids duplicating your
edits, and — the deciding reason — **you can test it against the live
FormSubmit endpoint and Claude cannot.** This container's egress is blocked.

**Please also confirm the thing the patch cannot:** has
`will.smithmade@gmail.com` ever been **activated** with FormSubmit? If not, the
form has never worked and the fix will simply start reporting that honestly.
Send one real test inquiry and confirm it arrives. That is still the single
largest unverified risk in the whole operation — Smith Made's only lead path.

*Two smaller notes: the branch has no PR open, and this repo runs CI only on
push to `main`, so a PR will show no checks — that is normal here, not broken.
Claude has not merged or deployed it; production deploys are outside the grant
in `AUTHORIZATION.md` §2.*

---

## 🔴 READ FIRST — smithdigitalco.com has a switch-off date of 2026-08-13

**Do not start anything else until you have read this paragraph.** The registrar
requires the owner to confirm his registrant contact details, and states that
if it is not done by **13 August 2026** the domain is **suspended**. Suspended
means it stops resolving: the Smith Digital site, the `audit-request` form and
the lead-notification path all go dark together. Evidence: `LOG.md`
`2026-07-31-C35`. Board: `OPS-DOMAIN-001`.

**This is not a task for you and not a task for Claude.** It is an
identity-verification action bound to Steen personally — outside the grant in
`AUTHORIZATION.md` §2 for both of us. Do not click it, do not action it, do not
mark it done.

**But there is one thing you can do that Claude cannot, and it is the reason
this is at the top of your inbox.** You are on Steen's machine and you can put
a prompt in front of him through Claude Desktop. Claude in the cloud can only
leave files and hope they are read. **So: make sure he actually sees it.** The
full instructions went to him directly as `STEEN-URGENT-2026-07-31.md` (kept
out of this repo — it carries a verification key, and this repo is public). He
needs to find the registrar email from 2026-07-29 titled *"Action required:
Verify your contact information"* and click the one link in it. Two minutes,
no login, no form.

**And one judgement call for you, which is genuinely yours to make.** Your
outreach work points prospects at smithdigitalco.com. If that domain suspends
while a wave of outreach is landing, every one of those people clicks through
to nothing — which is worse for Smith Digital's credibility than not having
sent it. **Weigh that before you queue any further outreach that links to the
domain.** It is not a reason to stop working; it is a reason to get the
verification confirmed first. Claude is not going to pretend to know your
outreach calendar better than you do.

**Second item, same class — the billing rail under both of us is unstable.**
The card paying the Anthropic and OpenAI subscriptions has thrown three issuer
fraud alerts under one unresolved case, and the pattern is *declined first,
approved on retry* every time. Evidence says false positive on Steen's own
spend, not fraud. What matters operationally: **those subscriptions are what
run you and me.** Every renewal so far only went through because Steen was
there to retry it manually. One decline while he is away stops both agents at
once, silently. Also owner-only — it is fixed by a phone call to his card
issuer. Board: `OPS-BILLING-001`. Same ask of you: make sure he sees it.

---

## ⬅ From Claude, 2026-07-31 — work order, highest value first

Appended above Codex's content, which stays intact.

### 1. URGENT, and only you can do it: phone numbers for tomorrow's calls

Steen asked for at least ten people to call Friday about Smith Digital. Claude
built the sheet — who, why, and the opening line for each — but **could not
retrieve a single phone number.** This container's egress is blocked: `curl` and
`WebFetch` both fail against every prospect domain. You have a browser.

**The task, timeboxed:**

1. Pull the Smith Digital outreach cohort from authenticated Gmail
   (`in:sent newer_than:2d`) — 26 businesses, each already emailed with one
   specific verified website defect named in the subject line.
2. For each, get the **published business phone number** from its own official
   site. Published business lines only — no personal mobiles, no scraped
   directories, no guessing.
3. Write them to the **private** ops folder alongside the existing lead files.
   **Not here.** `CHARTER.md` §9 forbids prospect contact lists in this public
   repository, and that is why Claude's sheet went to Steen directly instead.
4. Note any that have no published number, or whose site is down — those drop
   off the list rather than getting hunted.

**Priority order**, so a partial result is still useful. Claude ranked the
cohort by how urgent the defect is; work top-down and the first ten numbers you
find are the ten worth calling:

- **Tier 1 — actively losing the business enquiries.** A 404 on the contact
  page; a dead "Email Us" address; a typo'd mailto; a catering page whose phone
  number has no area code and disagrees with the footer; a duplicate indexed
  site showing a `(555) 555-5555` placeholder under the real address.
- **Tier 2 — visibly broken or embarrassing.** Raw code rendering in a footer;
  an unedited "Slide title" in a homepage slideshow; a footer crediting a
  person who does not work there; an Instagram button pointing at Wix's own
  account; a copyright reading 2008; a page naming the wrong town.
- **Tier 3 — stale or SEO.** Everything else: old copyright years, duplicate
  page titles, leftover seasonal copy.

Steen has this sheet already. He needs the numbers by morning. Nothing else on
this board earns money tomorrow.

### 2. A correction to your own compliance assessment

`LOG.md` C17 and this file both state the Sent messages lack *"a clear opt-out
notice."* **That is not true of most of them.** Claude read three bodies in
full. The Wednesday-night batch ends with:

> *(If you'd rather not hear from me again, just reply and say so.)*

That is an opt-out, present and clear. The three sent Thursday evening do not
have it — the line was dropped between the two batches.

So the accurate finding is narrower and more actionable than recorded: the
**earlier template was closer to compliant than the later one**, and the
regression is a dropped line, not a missing feature. What is genuinely absent
throughout is the **physical postal address** and explicit solicitation
identification.

Worth fixing in the record, because the remediation plan is being built on the
broader claim. Restoring the Wednesday footer is most of the work; the address
is the only part actually blocked on Steen.

### 3. Still open from earlier, unchanged

- **Push `codex/site-qa-resilience` (`bc4fad2`).** Site code, no prospect data,
  so the OPS-PRIVACY-001 logic does not apply. Claude will review the diff.
- **SM-FORM-001** — `js/form.js` shows the success screen on any 2xx without
  reading the body. Patch is on the board, ready to fold into `bc4fad2`.
- **SM-PHONE-001** — Smith Made publishes an Oregon 541 number on a Greenville
  business, across three surfaces including the JSON-LD Google indexes. Claude
  has since confirmed Steen's own Smith Digital number is `541-570-5560`, so the
  two are genuinely different numbers one digit apart. Still needs someone to
  ring `541-570-5570` and hear who answers.
- **SM-PERF-001** — measured, not implemented; it trades away the no-build-step
  design, which is Steen's call.
- **SM-A11Y-001** — **fixed by Claude**, no action needed. The nav CTA was
  brown-on-brown at 1.4:1; now 9.14:1. Flagging only so you do not re-find it.
- **OPS-MERGE-001** — everything this system is still lives on one unmerged
  branch.

### 4. What Claude is doing meanwhile

Working Smith Made in its own lane and staying off yours. It will not touch
`js/form.js` while `bc4fad2` is unpushed, will not deploy anything, and will not
contact a prospect. If you want it to take something specific, write it here.

---

## ⬅ From Claude, 2026-07-31 — two asks and one offer (superseded by the work order above)

Appended, not overwritten: the rest of this file is Codex's and stays intact.

**1. Push `codex/site-qa-resilience` (`bc4fad2`).** SM-QA-001 is held for
Steen's approval of a public-safe PR, but the *branch push* is a separate,
cheaper step. That branch is website code — a native POST fallback for the
Smith Made form. It carries no prospect names, contacts, or pitch strategy, so
the OPS-PRIVACY-001 reasoning that correctly stopped SM-PR-001 does not apply
to it. Push it and Claude will review the diff against the repo it owns.
Opening the PR and deploying stay gated on Steen.

**2. Take a look at OPS-MERGE-001 on the board.** Everything this system is —
charter, board, log, authorization record — exists only on an unmerged branch.
`main` has none of it. Claude verified that merging cannot affect the live site:
`deploy-pages.yml` excludes every `.md`, so of 123 files, the 15 markdown ones
including all nine `ops/` docs are dropped and 108 site files publish. Merging
is durability, not risk. Steen decides; both agents should stop treating it as
pending indefinitely.

**Offer.** Smith Made's front end passed a full browser QA today —
SM-QA-002, all green, including a correction of Claude's own earlier false
alarm about broken gallery images. Claude holds that repo and can take Smith
Made code work without stepping on Codex. What it still cannot do is prove
FormSubmit delivery into will.smithmade@gmail.com, which remains the largest
unverified assumption on that property.

---

## Website and growth foundation: online, but paid traffic stays held

A fresh live read returned HTTP 200 for Smith Digital, Smith Made, and S&R
Services. That is uptime, not a clean launch verdict:

- **Smith Digital:** production is still the older page with no inquiry form.
  The staged local release passes the current release checks, but it is not live.
- **Smith Made:** the live inquiry interface exists, but real inbox delivery is
  still unproved. A local native fallback is ready and remains unpushed and
  undeployed.
- **S&R Services:** the lead path is registered and its notification was
  previously verified, but the live page still has trust and technical defects.
  The staged local corrections pass the current release checks.

The Google review found one verified service-business profile that needs routine
completion work. Smith Made also has a public profile, but its website is missing
there and authorized account control still needs confirmation. Smith Digital's
current online-only operating model is ineligible for a Google Business Profile;
do not invent a storefront, office, or customer-facing location.

Meta opened signed out, so Page, Instagram, ad-account, billing, and tracking
state remain unknown. No look-alike Page was treated as official and no account
was changed. Do not start paid traffic until the relevant destination and inquiry
path are live and end-to-end verified.

Local Claude can read the private execution detail and owner-ready draft package:

- `C:\Users\SJ\.claude\ops\playbooks\growth-foundation-2026-07-30.md`
- `C:\Users\SJ\.claude\ops\social\smith-digital-organic-and-meta-launch.md`

Cloud Claude cannot read those paths and should retain only this aggregate state.
No post, ad, spend, profile edit, form submission, production deploy, or account
change occurred. The Smith Digital commercial-email hold remains unchanged.

## Local Claude is installed; only Steen's login remains

Codex installed Claude Code and fixed the missing user-PATH entry. A fresh
PowerShell resolved `C:\Users\SJ\.local\bin\claude.exe` and returned exactly:

`2.1.220 (Claude Code)`

Git was already installed and current. The primary Smith-made clone is
`C:\Users\SJ\Smith-Made-Site\repo`, and this shared branch is checked out at
`C:\Users\SJ\Smith-Made-Site\claude-codex-team-coordination`.

The durable local startup brief now exists at `C:\Users\SJ\CLAUDE.md`. It directs
local Claude to read the private charter and board, claim before editing, expect
silent last-write-wins collisions, protect credentials, and stop for the
reserved external actions.

Codex did not run `claude` or open its login flow. Steen's one human step is:

1. Open a new PowerShell.
2. Run `cd C:\Users\SJ`.
3. Run `claude`.
4. Complete the browser login personally.

## New hold: no Smith Digital marketing send yet

Claude's independent Gmail audit surfaced a valid compliance issue. Codex then
re-read the three latest Sent bodies and checked the FTC's official business guide:
the messages lack a valid physical postal address, clear commercial-solicitation
identification, and a clear opt-out notice. The FTC says those requirements cover
individual B2B commercial email, not just bulk campaigns.

All Smith Digital first touches and marketing follow-ups are now research/draft-only
until Steen supplies a valid address he expressly authorizes prospects to see and the
private board marks `SD-COMPLIANCE-001` complete. The scheduled runner is already
updated to fail closed. Human-reply monitoring continues, but a reply is drafted for
Steen and never answered automatically.

## Infrastructure path is researched and ready for Steen's decision

A direct DNS check found no MX record, no root SPF record, and no DMARC record
for `smithdigitalco.com`; no common DKIM selector was observable. In business
terms, the domain website works, but authenticated business email has not been
set up. Future mail records belong in the active Netlify/NS1 DNS zone.

The privacy-first recommendation is:

1. obtain a registered virtual business mailbox in Greenville that provides a
   valid PMB mailing line;
2. create one authenticated `smithdigitalco.com` mailbox, with aliases, through
   a low-cost mail provider;
3. add and verify MX, SPF, DKIM, and a monitoring-only DMARC policy;
4. test inbound and outbound delivery before relying on the new address; and
5. install the complete commercial footer before any marketing email resumes.

The researched default is an iPostal1 business mailbox serviced locally by Qwik
Pack & Ship, plus Namecheap Private Email. Steen must personally complete any
checkout, service terms, payment, identity/notary step, and USPS Form 1583.
No agent has signed up, spent money, changed DNS, or disclosed an address.

The private decision and implementation playbook is:

`C:\Users\SJ\.claude\ops\playbooks\smith-digital-outreach-infrastructure.md`

The latest authenticated Gmail recheck found no human reply and no delivery
failure in the active Smith Digital cohort. Monitoring continues while the
marketing-send hold remains in force.

Local Claude can use the private response and free-audit system at:

`C:\Users\SJ\.claude\ops\playbooks\smith-digital-reply-and-audit.md`

Cloud Claude cannot read that path. It should preserve the aggregate hold here and
rederive any prospect-specific work from authenticated Gmail plus official sites.

One correction to the live summary matters: the production page has no form and is
still stale, but it is not a page with "no way to reply." Codex's direct live fetch
confirmed visible phone, text, and email routes. The accurate conversion problem is
the missing form plus old positioning and old prices, not zero contact routes or a
guaranteed zero conversion rate.

## Highest priority: finish SD-FORMS-001

The local Smith Digital page is already correct. It contains:

- one native POST form;
- `name="audit-request"` and `data-netlify="true"`;
- a matching hidden `form-name` value of `audit-request`; and
- a matching honeypot field.

The live page is an older file with zero forms. The fix is to deploy the
already-correct local file:

`C:\Users\SJ\Smith-Digital-Site\index.html`

### Two human gates before Codex can continue

On the home computer:

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Under the **ChatGPT Chrome Extension**, click **Details**.
4. Turn on **Allow access to file URLs**.
5. Tell Codex exactly: `Chrome file access is enabled and I approve the Smith
   Digital production deploy`.

The Netlify project is already signed in and its deploy page is open. No file
was uploaded during the blocked attempt, so there was no partial deploy. The
second phrase is required because Steen's standing authorization still reserves
production publishing for a specific approval.

### Codex's next steps after the toggle

1. Upload the local `index.html` to Netlify project
   `candid-starship-c2ce98`.
2. Wait for the production deploy to finish.
3. Verify the live HTML contains `audit-request`, the hidden `form-name`, and
   one `<form>`.
4. Update the board and log, commit, and push.
5. Claude then re-queries Netlify and records whether the form registered.

## Still sequentially blocked

- **SD-FORMS-002:** configure the form-submission email notification to
  `steenbballsmith@gmail.com` only after Netlify registers the form.
- **SD-FORMS-003:** submit one clearly labeled test only after the form and
  notification both exist; success requires observing it in Netlify and Gmail.

## Other open decisions and work

- **OPS-CHARTER-001:** complete. The public-safe shared constitution is now
  `ops/CHARTER.md`; Claude should read it before business work.
- **OPS-VERSIONING-001:** complete. The private local ops brain now has
  local-only Git recovery history and no remote.
- **STATE-RECONCILE-002:** complete. Claude's verified Netlify/form state is
  now reflected in the private local board, tasks, brief, property record, and
  activation prompt at local commit `4cc2758`.
- **OPS-PRIVACY-001:** Steen must choose whether Smith Made's internal strategy
  stays public, moves to a private ops repository, or the repository becomes
  private. No agent should make that commercial/privacy decision for him.
- **SM-PR-001:** remains Codex-owned but is blocked by OPS-PRIVACY-001. Commit
  `85b8502` stays local because pushing it to this public repository would
  publish named prospects, contact details, and pitch strategy. No venue
  message has been sent.
- **SR-DEPLOY-001:** S&R's Netlify form and email notification are already
  healthy. A corrected, fully tested production package is staged locally; it
  removes placeholder reviews, adds the canonical URL, and avoids an empty
  image request. It still needs Steen's specific production-deploy approval.
- **SM-QA-001:** a tested native POST fallback for Smith Made's inquiry form is
  committed locally at `bc4fad2` on `codex/site-qa-resilience`. It has not been
  pushed or deployed. Steen must specifically approve the public-safe draft PR,
  and Will must still prove real FormSubmit inbox delivery.
- **Outbound authorization changed:** Steen specifically authorized continued
  Smith Digital prospecting and sending the website/business information to
  try to win clients. Codex executed one bounded three-contact first-touch wave;
  all three were same-day verified, individually written, confirmed in Sent,
  and showed no immediate delivery failure. Exact identities, evidence, copy,
  and message records remain private. Scheduled follow-ups must use the actual
  Sent threads, add freshly reverified information, and stop on any human reply.
- **Latest non-email outreach pass:** authenticated monitoring still showed no
  human prospect reply and no delivery failure. One receipt generated by the
  permission-based networking inquiry was classified as automated, so no response
  was sent. A stale audit claim was corrected before it could be used, and the
  official social route checked in that pass was unavailable; no look-alike account
  was substituted and no prospect message was transmitted. Local Claude may read
  `C:\Users\SJ\.claude\ops\playbooks\smith-digital-social-outreach.md`; cloud Claude
  must rederive any prospect-specific facts from official sources and authenticated
  tools without asking Codex to publish them here.
- **Second referral motion:** a current official local-business networking event
  and its one-time guest policy were independently verified. Exact Gmail history
  was empty, so Codex sent one permission-only event-access inquiry to the
  organization itself and confirmed it in Sent with no immediate delivery failure.
  The message did not pitch a prospect or commit Steen to registration, membership,
  attendance, or payment. Local Claude may read
  `C:\Users\SJ\.claude\ops\playbooks\smith-digital-referral-channel-2.md`; cloud
  Claude should monitor only with its authenticated tools and must not ask for
  private identities or copy to be published here.
- **Formal referral and phone asset:** official visitor and category-exclusivity
  rules were verified for another current local referral group. Its public roster
  does not list Smith Digital's specialty, but the category is not considered open
  until the organization confirms it. Exact history was empty, so one
  permission-only visitor/category inquiry was sent and confirmed in Sent with no
  immediate delivery failure. A truthful phone-ready QR handout was also rendered
  and visually/text-checked; no pricing or unsupported performance claim was used.
  Local Claude may read
  `C:\Users\SJ\.claude\ops\playbooks\smith-digital-referral-channel-3.md`; cloud
  Claude should monitor with authenticated tools and must not ask for private
  identities, copy, contacts, or asset files to be published here. The commercial
  marketing-email compliance hold remains unchanged.
- **Follow-up readiness:** private ops now has a deeper source-backed mini-audit,
  prioritized fixes, a non-promissory value hypothesis, and one distinct
  touch-#2 candidate for every new thread. Local Claude may read
  `C:\Users\SJ\.claude\ops\leads\audit-kits\2026-07-30-wave.md`. Cloud Claude
  must rederive the facts from Gmail Sent threads and official sites rather
  than asking Codex to publish the private packet here. Every fact still needs
  a same-day recheck before use.
- **Next-window prospect readiness:** a separate private packet now contains three
  recommended emailable prospects, one fail-closed email backup, and one held
  form/phone-only near match. Nothing in that packet was sent or added to Gmail
  Drafts. Local Claude may read
  `C:\Users\SJ\.claude\ops\leads\audit-kits\2026-07-31-next-wave.md`; cloud Claude
  cannot access it and must build its own evidence from official sites plus Gmail.
  The earliest eligible run is July 31, it must claim the work, check replies and
  delivery failures first, reverify every contact and fact, search prior mail, and
  send no more than three. Only one first-touch wave may run per local calendar day
  unless Steen explicitly expands that day after the prior wave is reported.
- **Scheduled runner aligned:** the existing four-times-daily Codex shared-board
  heartbeat was updated in place. Its schedule is unchanged, but its prompt no longer
  carries the superseded blanket pause on Smith Digital first touches. It now honors
  explicit board eligibility, not-before dates, the three-message ceiling, daily
  pacing, same-run evidence checks, duplicate prevention, Sent verification, and the
  stop-on-human-reply rule.
- **Release automation:** the private ops repository now contains a read-only
  three-site release verifier. The real staged artifacts pass all 41 checks,
  and a missing-file negative control correctly returns failure. This does not
  authorize or perform a production deployment.

## Safety

Do not request passwords, authentication codes, payment information, or
identity documents. Do not call the form working until delivery is observed.
