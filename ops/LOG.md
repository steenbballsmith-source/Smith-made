# OPS LOG

Append-only. Newest at the top. Never edit or delete an earlier entry — a wrong
entry gets a correction below it, not a rewrite. Every entry carries the
evidence that lets the other agent reproduce the check.

---

## 2026-07-31-C26 · Claude · Scheduled check clean; found an Oregon number on a Greenville business

**Scheduled check — nothing moved.** Netlify `get-forms-for-project` → still
`[]`. Gmail `in:sent newer_than:1d` → still 28 threads, no new sends, hold
intact. PR #29 open, draft, `mergeable_state: clean`, 0 check runs, 0 review
comments. `main` still `a7426bf`. No new Codex commits.

**Used the turn rather than idling, per Steen\'s standing instruction.**

**Audited `OWNERS-GUIDE.md` — it is fine.** After finding eight false statements
in `SESSION_HANDOFF.md`, the owner-facing guide was the obvious next suspect. It
holds up: Part 4 correctly states all eight cards already carry renders and
frames replacement as optional; Part 6 frames the gallery as an ongoing
after-each-wedding task rather than an empty list; Part 8\'s `(864) 555-0123` is
a labelled placeholder in an instructional example. No corrections made. Worth
recording that a clean audit is a result — the temptation after a productive
find is to manufacture the next one.

**But tracing the phone number through that guide turned up SM-PHONE-001.** The
site\'s `LocalBusiness` structured data declares the address as Greenville SC
and lists the SC Upstate plus Asheville as areas served, while publishing
`+1-541-570-5570`. **541 is Oregon** — the Willamette Valley, Steen\'s own
region, about 2,500 miles from the market.

It sits on three surfaces: the JSON-LD Google indexes, the footer contact link,
and the mobile action bar.

**Deliberately not called a defect.** It entered in `d9586d5`, titled *"Publish
Will\'s phone number"*, and has been treated as verified since. It may simply be
a retained Oregon number — in which case it is a local-trust friction point for
wedding buyers, not a bug. But it is also **one digit** from Steen\'s Smith
Digital number (`5560` vs `5570`), and if that is a transposition then couples
calling reach nobody while Google publishes it. Claude cannot distinguish the
two from here. Ringing the number settles it in thirty seconds.

Fix is one line in `js/manifest.js` plus the JSON-LD if it turns out wrong.

**Pattern, noted once and not laboured.** Third item this session published as
settled that was never checked — after the deploy already done and the form
cause that was guessed rather than read. Each time a confident commit message
or handoff line stood in for verification.

**Claude sent nothing.** No email, form, deploy, or account change.

---

## 2026-07-31-C25 · Claude · Audited the doc every new agent reads first

**Continued self-directed.** With deploy and outreach work blocked on Steen,
took the highest-value thing still fully inside Claude\'s reach: verifying
`SESSION_HANDOFF.md`, the file its own §0 says to hand any new session.

**Eight false statements found and corrected.** Full table in `AGENT_BOARD.md`
SM-DOCS-001. The two that would have cost real work: §7 item 9 instructs a new
agent to replace six concept-SVG catalog pieces with photoreal renders — that
finished some time ago, all eight slugs carry `.jpg` and `.webp`, and acting on
it risks overwriting good imagery with worse. And §3 describes `gallery[]` as
empty with its section hidden, when it holds 14 entries and the Lookbook was
browser-tested working earlier today.

The rest: `phone` recorded as blank but set to (541) 570-5570; `heroPoster`
pointing at a filename that no longer exists; `photos{}` claimed as 4 set when
it is empty (correctly — it overrides `index.html` rather than feeding it);
`og-image` given as `.png` when it is `.jpg`; and the fonts described as
Italiana + Lora served from Google Fonts when they are Cormorant Garamond,
Great Vibes and Jost, fully self-hosted in `assets/fonts/*.woff2`.

**Corrected in place with the drift left visible.** Each fix carries an inline
italic note saying what the line used to claim. Silently overwriting would
destroy the evidence that this document decays — which is the actual lesson.

**The more useful half of the header block is what it does not claim.**
Everything in §2 living outside the repo — DNS, the Namecheap email forward,
Square account settings, Google Business Profile, and whether FormSubmit was
ever activated — is now marked *last known, not checked*. No cloud session can
open those accounts, and an unmarked stale fact reads exactly like a verified
one.

**Checked and clean:** prices and catalog needed no change. All 8 pieces
present with matching slugs, and the JSON-LD offers Google reads agree with the
cards exactly.

**Why this over more features.** Claude was misled twice in this session by
stale documentation: it proposed an HTML fix for a file it could not open, and
it chased phantom broken images. Both cost an hour. This document is read
first, by design, so its errors compound across every future session.

**Safe to edit, checked before touching:** `git log` shows Codex has modified
only `ops/` and `CLAUDE.md` on this branch. `SESSION_HANDOFF.md` had no
competing unpushed work.

**Claude sent nothing.** No email, form, deploy, or account change.

---

## 2026-07-31-C24 · Claude · Smith Made's form can lie about success

**Self-directed work.** Steen asked the agents to coordinate through the files
and choose their own tasks. Claude audited `js/form.js` in the repo it owns.

**Finding — SM-FORM-001, and it is the SD-FORMS-001 failure mode again on the
other business.** The success path is gated only on `response.ok`:

```js
if (!response.ok) throw new Error("HTTP " + response.status);
...
showSuccess();
```

The JSON body is never read. Any 2xx response carrying a failure payload takes
the success branch — the form is replaced and the couple is told they will hear
back within a day or two. Nothing is delivered and nothing is recorded.

This part is certain from the source and needs no external access. Genuine
network failures are handled correctly; the `.catch` tells the visitor to email
directly. It is specifically "200 with a failure body" that escapes.

**What is not yet proven.** Cloud Claude's proxy 403s `formsubmit.co`, so the
exact trigger is unverified. FormSubmit's AJAX endpoint is understood to return
a JSON `success` field and to hold the first submission until a one-time
activation link is clicked. If that holds, then while activation stays
unconfirmed **every couple sees a success screen and no inquiry arrives** —
which is precisely the standing worry about will.smithmade@gmail.com. Marked as
needing confirmation rather than asserted; an agent with live web access should
check the response shape.

**Patch written, not applied — deliberately.** Codex holds unpushed work in this
exact file (`bc4fad2` on `codex/site-qa-resilience`). Two agents editing
`js/form.js` with one copy unpushed is the collision `README.md` §4 exists to
prevent, and the file handles lead capture, so a botched merge is expensive.
The proposed diff is on the board under SM-FORM-001, ready to fold into
`bc4fad2` — the two changes are complementary. Codex's covers JavaScript being
unavailable; Claude's covers JavaScript reporting a success that did not happen.

Also noted there: the `fetch` has no timeout, so a hanging endpoint leaves the
visitor on "Sending…" with the button disabled and no fallback.

**Second piece of work — SD-COMPLIANCE-002.** `SD-COMPLIANCE-001` holds all
Smith Digital marketing mail until a compliant footer exists, but drafting that
footer was nobody's task. Claude wrote it (charter §3 permits unsent drafts):
solicitation identification, a reply-to-opt-out that needs no infrastructure and
suits hand-written one-to-one mail, and a clearly marked slot for the postal
address. The address stays empty on purpose — `CHARTER.md` §5 forbids an agent
guessing or exposing a residential address, and it is the one input only Steen
can give. Everything else is ready to install the moment he names one.

Recorded there too: the hold should not be routed around by moving the same
pitch to social DMs. That is the same solicitation in a venue with its own
rules.

**Claude sent nothing.** No email, draft, form, deploy, or account change. No
file outside `ops/` was modified.

---

## 2026-07-31-C23 · Claude · Smith Made QA clean; PR #29 proven safe to merge

**Took unclaimed work in its own lane.** Steen asked Claude to work with Codex
and pick up tasks. Claude holds the Smith Made repo, so it took the front-end
QA rather than touching anything Codex has claimed.

**Smith Made — full browser QA, all green.** Static audit plus headless
Chromium against a local server. Assets and anchors all resolve; JSON-LD valid
(LocalBusiness, WebSite, FAQPage); filter chips correct (8/7/3/6 with
`aria-pressed` tracking); 8 Book buttons prefill the piece and move focus to
`names`; staged viewer renders a 1448px WebP; form validation blocks empty
submit with `names` and `email` required; honeypot `company` present; zero
console errors and zero failed requests. Detail in `AGENT_BOARD.md` SM-QA-002.

**Corrected Claude's own false alarm.** An earlier run in this session reported
15–17 broken images. That was a fixed-timeout test that never scrolled —
lazy images below the fold report `naturalWidth: 0` because they are never
requested. Re-run with polling: **14/14 load as WebP, three consecutive runs,
zero failed requests.** No image defect exists. Left uncorrected, that would
have cost the next agent the same hour.

**Also found two stale facts in `SESSION_HANDOFF.md` §3:** fonts are
self-hosted in `assets/fonts/*.woff2`, not pulled from Google Fonts, and the
social image is `og-image.jpg`, not `.png`. The site is correct; the doc is out
of date.

**PR #29 is safe to merge — verified, and it matters.** The entire ops system
lives only on this unmerged branch; `main` has no `ops/` and no `CLAUDE.md`.
Simulating `deploy-pages.yml`'s exact rsync exclusions against the tree: 108
site files publish, 15 markdown files are dropped including all nine `ops/`
docs, and **0** ops or markdown files reach the live site. Merging changes what
future agents can read and changes nothing a visitor sees. Opened as
OPS-MERGE-001 for Steen.

**A method failure worth recording.** The first attempt at that check ran
`rsync`, which is not installed in this container. It failed, produced an empty
result, and briefly read as a clean pass — the same shape as the Cloudflare 502
in `C15`. An absent tool returns something that looks exactly like a negative
finding. Re-done as an explicit simulation of rsync's semantics. This is now
twice in one session; the habit is worth keeping.

**Asks written to Codex** in `HANDOFF-TO-CODEX.md`, appended above its content
rather than overwriting it: push `codex/site-qa-resilience` (`bc4fad2`) since
that branch is site code with no prospect data, so the OPS-PRIVACY-001 logic
that correctly held SM-PR-001 does not apply; and look at OPS-MERGE-001.

**Claude sent nothing.** No email, draft, form, deploy, or account change.

---

## 2026-07-31-C22 · Claude · Scheduled check; hold held a second time

**Unchanged.** Netlify `get-forms-for-project` → still `[]`. PR #29 open, draft,
`mergeable_state: clean`, 0 check runs, 0 review comments. `main` still
`a7426bf`. Four new Codex commits bridging referral and website-readiness state;
no prospect material published.

**Gmail 27 → 28. The new body was read, not assumed.** Sent 2026-07-31 01:09
UTC to a BNI chapter director: asks whether the sender may visit an upcoming
meeting, and to confirm date, online-versus-venue, visitor fee, and whether the
Website Design or Digital Marketing specialty seat is open. It closes with *"I'm
only asking for the correct visitor path. I have not registered, applied for
membership, or authorized any payment."*

**Verdict: compliant.** A visitor-logistics question is not a marketing
solicitation, and the explicit payment disclaimer respects the purchases gate in
`AUTHORIZATION.md` §1 rather than merely avoiding it. Second consecutive clean
audit of `SD-COMPLIANCE-001`.

**One thing worth surfacing to Steen when he next reads, not urgent.** Both
non-email routes now in motion — a Chamber Greeters program and a BNI chapter —
are membership organisations. Visiting is free; joining is not, and BNI in
particular carries an annual fee plus chapter dues. No agent has registered,
applied, or authorized payment, and both messages said so in writing. But the
funnel these open ends at a paid commitment, and that decision is Steen's alone.
Flagging the shape of the path, not objecting to it.

**Claude sent nothing.** No email, draft, form, deploy, or account change.

---

## 2026-07-31-C21 · Claude · Scheduled check; compliance hold verified as held

**Netlify.** `get-forms-for-project` on `392091e9…` → still `[]`. SD-FORMS-001
unchanged. The staged page is still unpublished, waiting on Steen's login or the
explicit deploy approval.

**PR #29.** Open, draft, `mergeable_state: clean`, 42 commits, 0 check runs, 0
review comments. `main` still `a7426bf`. Zero checks remains normal here —
`deploy-pages.yml` only triggers on push to `main`.

**Gmail — one new send since the last check, and it was checked rather than
assumed.** `in:sent newer_than:1d` returned 27 threads, up from 26. The new one
went to an Albany Chamber of Commerce address at 2026-07-31 00:58 UTC, during
the active `SD-COMPLIANCE-001` marketing hold — so the body was read in full.

It is an inquiry, not a solicitation: it asks whether the sender may attend a
specific Greeters event as a first-time guest, cites the Chamber's own published
nonmember-guest policy, asks about a guest fee and registration, and states
plainly *"I'm not asking for a presentation spot."* No offer, no pitch, no
service description beyond one clause of self-identification.

**Verdict: the hold was respected.** It covers marketing messages; a question
about attending an event is not one. Recording this because a compliance hold is
only worth having if someone checks it, and because the check should be visible
when it comes back clean — not only when it catches something.

**Nothing else moved.** Two new Codex commits (`59dd606`, `8fe52c4`) bridging
the second referral channel; no prospect material published.

**Claude sent nothing.** No email, draft, form, deploy, or account change.

---

## 2026-07-30-C15 · Claude · Outreach verified against Gmail; it points at a dead page

**Trigger.** Scheduled check found ten new Codex commits, several naming
outreach. `C13` reported three authorized Smith Digital emails sent. Per
`CHARTER.md` §2, a log entry is a claim — so it was checked against the artifact
rather than accepted.

**Method.** Authenticated Gmail, `in:sent newer_than:1d` and
`newer_than:7d older_than:1d`, plus one full message body sampled. Prospect
identities and addresses deliberately kept out of this public repo per
`CHARTER.md` §9; only counts, timings, and patterns recorded here.

**What the Sent folder actually contains.**
- **26** cold outreach threads in the last 24 hours, all from Steen's personal
  Gmail, all linking to `https://smithdigitalco.com`.
- **23** of them sent between **05:43:49 and 05:49:08 UTC** — 5 min 19 s, about
  one every 14 seconds.
- **3** at **23:21 UTC** across 27 seconds — this is precisely the wave `C13`
  describes.
- 3 more on 2026-07-29 at 04:39 UTC, inside 46 seconds.

**The finding that matters, and it is not the count.** Every one of those
messages points at smithdigitalco.com, and smithdigitalco.com is still serving
the 23 KB placeholder with **zero `<form>` elements**. The emails offer a free
audit and send the reader to a page with no way to reply. SD-FORMS-001 stopped
being a maintenance ticket the moment outreach started pointing at it: 26
prospects have been driven to a page that cannot convert. Opened as
**SD-OUTREACH-001**.

**Two secondary risks, both real.** 23 cold messages in five minutes from a
personal Gmail is the pattern spam heuristics act on — and the cost is not the
campaign, it is that Steen invoices customers from that address, so reputation
damage lands on genuine mail. Separately, the sampled message carries no postal
address and no opt-out, which US commercial email generally requires. Nothing
deceptive: sender, headers, subject, and the cited defect were all accurate.

**Not an accusation, and worth saying so explicitly.** `C13` matches the 23:21
batch exactly. The 23-email burst was 22:43 PDT on 2026-07-29 — before this ops
folder existed — so it could not have been logged here. Board and reality differ
because the board started late. Codex's other checkable claim this cycle, S&R
Services having one `quote` form with a single historical submission, verified
exactly against the Netlify API: form `quote`, `submission_count: 1`, created
2026-06-28, last submission 2026-06-29.

**Also confirmed unchanged.** Smith Digital `get-forms-for-project` → still
`[]`. PR #29 open, draft, `mergeable_state: clean`, 0 check runs, 0 review
comments. `main` still at `a7426bf`.

**One process note.** The first Netlify call this cycle returned a Cloudflare
502. A failed call is not a negative result; it was retried rather than logged
as "no change." Worth keeping as a habit — the cheapest way to fake a clean
check is to accept an error as an answer.

**Claude sent nothing.** No email, draft, form, deploy, or account change.

---

## 2026-07-30-C14 · Codex · Private follow-up readiness bridged safely

**Claim.** Claimed `STATE-BRIDGE-005` in commit `36065a1` and pushed the claim
before changing shared state.

After the authorized first-touch wave, Codex reopened every official site and
prepared a private mini-audit for each new thread. Every packet separates
sourced facts from inference and includes prioritized fixes, a non-promissory
value hypothesis, and one distinct touch-#2 candidate that was not used in the
first message. No additional outreach or external draft was created.

Local Claude can read the canonical private packet directly. Cloud Claude
cannot; it should read the authenticated Gmail Sent threads and re-open the
official sites to reconstruct the evidence. The private prospect identities,
contacts, findings, copy, and message IDs remain out of this public repository.

**External side effects:** this sanitized branch update only. No message, form,
site, PR, ad, account, purchase, credential, or deletion changed.

---

## 2026-07-30-C13 · Codex · Authorized outreach wave and release guard bridged

**Claim.** Claimed `STATE-BRIDGE-004` in commit `1f5c7d5` and pushed the claim
before changing shared state.

**Authorization change.** Steen specifically instructed the agents to continue
Smith Digital outreach and authorized sending the website and business
information to prospects to try to win clients. The durable public-safe grant
is now in `AUTHORIZATION.md`; the private charter owns the detailed controls.

**Execution.** Codex completed one three-contact first-touch wave. Every target
was checked against Gmail history, its official website, its published contact
route, and the cited fact immediately before sending. Each message was
individually written, included the Smith Digital site and free-audit offer, and
made no unverified performance claim. Gmail confirmed all three in Sent; an
immediate delivery-failure search was empty. Prospect identities, contact
details, findings, subjects, copy, and message IDs remain only in private ops.

**Release guard.** Added a private, read-only pre-publish verifier covering
Smith Digital, S&R Services, and Smith Made. The staged artifacts pass all 41
checks. A deliberate missing-file negative control exits nonzero, proving a
release blocker fails closed.

**Ownership.** Scheduled routines retain follow-up monitoring. They must use
the real Sent threads, reverify a new fact on the send day, and stop automation
on any human reply. Production site tasks remain separately blocked on Steen's
specific deploy/PR approvals.

**External side effects:** three specifically authorized Smith Digital prospect
emails were sent. No site, PR, ad, form, purchase, account setting, credential,
or deletion changed. This commit publishes only sanitized coordination state.

---

## 2026-07-30-C12 · Codex · Three-site QA and outreach guardrail bridged

**Claim.** Claimed `STATE-BRIDGE-003` in commit `7877836` and pushed the claim
before changing shared state.

**Website QA completed locally.**

- **Smith Digital:** the local and staged single-file page match and contain
  the complete native Netlify `audit-request` form. The live site is still the
  older form-less file. No source edit remains; production upload is blocked
  on Chrome file access plus Steen's specific deploy approval.
- **S&R Services:** Netlify has one active `quote` form, a historical
  submission, and an email notification configured for every submission. The
  corrected local package was rebuilt and browser-tested after removing an
  empty image request. No production deploy occurred.
- **Smith Made:** all same-site assets and core page structure passed live QA.
  A no-JavaScript native FormSubmit fallback was committed locally as
  `bc4fad2` on `codex/site-qa-resilience`. The branch was not pushed and the
  site was not deployed; Steen's PR approval and Will's real-inbox delivery
  test remain separate gates.

**Outreach safety.** A read-only private Gmail/site audit identified unsafe
stale-draft reuse and refreshed the follow-up evidence. Exact prospects,
contacts, inbox contents, and strategy remain private. Scheduled work is now
directed to start from actual Sent threads and add same-day verified
information. No draft was changed or created, no email or form was sent, and
agents will not delete email.

**Authorization and durable memory.** Steen's standing authorization is now in
the private local charter and this branch's `AUTHORIZATION.md`. The public Git
branch is only a sanitized bridge; the private local ops repository remains
the canonical business memory and still has no remote.

**External side effects:** this sanitized branch update only. No customer or
prospect communication, account change, purchase, test submission, PR, site
branch push, or production deployment.

---

## 2026-07-30-C11 · Claude · Standing authorization granted to Claude

**Steen:** *"I want you on the same footing — complete my request end to end."*

`AUTHORIZATION.md` §2 previously recorded that Codex held a standing
end-to-end authorization and Claude did not, and said Claude should not infer
one by analogy — it would take a sentence from Steen. That sentence has now
been said. §2 rewritten to grant it; root `CLAUDE.md` updated so the next
session inherits it, since this container keeps nothing.

**Recorded with its exceptions attached, deliberately.** Same footing means
inheriting Codex's carve-outs too, not just its latitude. Still stopping for a
specific authorization before purchases, permanent deletion, credential changes,
external communications, production deploys, and out-of-scope actions. Those are
Steen's own words in the envelope, not restrictions layered on top of it.

The concrete consequence, so no later session misreads the grant: **it does not
authorize sending the three venue emails, and it does not authorize publishing
a site.** Both sit squarely on the exception list.

**What it also does not fix, which is worth separating from permission.**
SD-FORMS-001 stays blocked for reasons that were never about authorization:
Claude has no copy of the Smith Digital file, and the Netlify `deploy-site`
tool still takes only a `siteId` with no source directory, so from this
container it would likely publish the Smith Made site over smithdigitalco.com.
A permission grant supplies neither a missing file nor a safe tool. Similarly,
the PowerShell/Chrome/Claude Desktop clauses describe a machine Claude is not
on; they become real at `OPS-LOCAL-001`, not now.

---

## 2026-07-30-C10 · Claude · Scheduled check; finished an incomplete correction

**Scheduled re-check, nothing moved.**
- `get-forms-for-project` on `392091e9-6dc3-4a3d-8f84-d2e400d3169b` → still
  `[]`. SD-FORMS-001 unchanged; smithdigitalco.com still captures nothing.
- PR #29: open, draft, `mergeable_state: clean`, 0 check runs, 0 review
  comments. Zero checks is normal here — `deploy-pages.yml` triggers only on
  push to `main`, so pull requests get no CI in this repo.
- No new commits from Codex since `C9`.

**A defect in Claude's own work, found and fixed.** `C9` corrected the
"the agents cannot communicate" claim in `README.md` and root `CLAUDE.md`, but
missed the same claim in `BRIEF-FOR-CODEX-LOCAL-CLAUDE.md` §3 — which is the
document Codex is meant to act on when local Claude arrives. It still said any
report of the other agent agreeing is "a fabrication."

That left two shared documents contradicting each other, and the stale one was
the operational one. Corrected: a relay of what Claude Desktop said is not a
fabrication, but it is not independent confirmation either. Cite the artifact.

Worth naming the pattern rather than just the fix: a correction applied to the
files that were in front of me, not to every file carrying the claim. The next
agent to correct a shared assertion should grep for it across `ops/` first.

---

## 2026-07-30-C9 · Claude · Authorization recorded; "cannot communicate" corrected

**Source.** Steen supplied Codex's permission envelope directly and asked for it
to be stored where it is useful. Recorded verbatim in substance as
`ops/AUTHORIZATION.md` §1.

**A claim in this folder was about to become false.** `README.md` §2 and root
`CLAUDE.md` both asserted flatly that Claude and Codex cannot communicate. That
was accurate for cloud Claude and is still accurate for cloud Claude. It is not
accurate generally: Steen's statement says Codex can **interact with Claude
Desktop** — drive the app, send it prompts, read its responses. That is a real
channel. Both files corrected rather than left to age into a lie.

The precise position now:

- Codex ↔ cloud Claude: no channel, git only. Unchanged.
- Codex → Claude Desktop: a real channel, and asymmetric. Codex prompts; Claude
  Desktop answers, cannot initiate, and does not see the rest of Codex's work.
  That is one agent using another as a tool, not two peers conferring.

**Three risks named in `AUTHORIZATION.md` §4.** The one worth repeating here is
**fake independence**: if Codex prompts Claude Desktop and reports "Claude
confirmed it," that is Codex's framing returned to Codex, not a second opinion.
It looks exactly like verification and is not. Neither agent should cite the
other's agreement as evidence — cite the API response, the deploy ID, the inbox.
The other two: relayed untrusted content getting a second chance to read as an
instruction, and a Claude Desktop instance editing shared ops files without
having read the board or claimed anything.

**Not done, deliberately.** Steen's message grants Codex a standing "complete my
requests end to end" authorization. It says nothing about Claude. Claude did not
adopt it by analogy. Recorded the asymmetry in `AUTHORIZATION.md` §2 and left
Claude's envelope where the charter puts it — task-specific approval for
sending, publishing, deploying, account changes, spending, and deletion. If
Steen wants the standing authorization to cover Claude too, that is one sentence
from him, and it should be his sentence.

**Read on arrival.** `ops/CHARTER.md`, delivered by Codex, read in full and
scanned for leaked emails, phone numbers, credentials, and margin figures before
being accepted. Clean — every match was a prohibition, not data.

**Noted with approval, since verification cuts both ways:** Codex claimed
SM-PR-001 and then declined to push it, because the branch carried three named
prospects with direct contact details and a branch in a public repository is
public even unmerged (`LOG.md` C7). It also initialized git history in the
private ops folder (C6), which was the one pre-install recommendation Claude
could not carry out itself.

---

## 2026-07-30-C8 · Codex · Bridge findings reconciled into private canonical ops

Imported the verified state from this Git bridge into
`C:\Users\SJ\.claude\ops`:

- closed the stale SD-DEPLOY-001 ownership and replaced it with the sequential
  SD-FORMS-001, SD-FORMS-002, and SD-FORMS-003 gates;
- recorded deploy `6a6a34440418d1b5f6dc57e0` as the old page with zero forms;
- recorded that the 52,858-byte local file already has the complete form while
  the 23,205-byte live page does not;
- updated the private task queue, daily brief, Smith Digital property record,
  no-duplicate warnings, and Claude activation prompt; and
- committed the reconciled private state locally as `4cc2758`.

The private ops repository still has no remote. No private data was pushed, and
no deploy, form submission, message, or account change occurred.

---

## 2026-07-30-C7 · Codex · Smith Made PR held at the public-repository boundary

**Claim.** Claimed SM-PR-001 and pushed claim commit `37c75eb` before touching
the outreach worktree.

**Repository check.**
- Worktree `codex-outreach-readiness` is clean at commit
  `85b8502a331d925c200eddc7b0e902387faefdd0`, one commit ahead of `origin/main`.
- Git Credential Manager successfully authenticated a push dry-run earlier in
  this session; the separate `gh` login is not required to push the branch.
- The commit adds a three-prospect packet with venue names, direct email or
  phone details, and personalized pitch strategy.

**Decision.** Did not push. A branch in a public GitHub repository is public
even when it is unmerged, so pushing would create a new exposure that conflicts
with `ops/CHARTER.md` and OPS-PRIVACY-001. The work remains safe and recoverable
in the clean local commit. No venue email, form, draft transfer, or contact was
sent.

**Unblock.** Steen chooses one:

1. create a private operations repository and push the full packet there; or
2. authorize a sanitized public PR containing only generic process documents,
   with named prospect material kept local/private.

---

## 2026-07-30-C6 · Codex · Private local ops history initialized

**Claim.** Added OPS-VERSIONING-001 to both coordination boards and pushed
claim commit `f2f3199` before touching the private local repository.

**Result.**
- Initialized `C:\Users\SJ\.claude\ops` as a local Git repository on `main`.
- Root commit `c06f9494291a5c84e6eb937bfaab7efbeeb7d301` captured 18 operating
  files; completion commit is `8ad4598200b987abea412dfde419c9a48dd7407a`.
- Used the local-only identity `Codex <codex@local.invalid>`.
- Ignored the generated deploy ZIP and executable permission helper because
  they are not durable business memory.
- Verified `git remote -v` is empty. No private ops file was pushed or
  published.

This adds an undo trail for same-file collisions when a second desktop agent
arrives. The board still remains the lock: history makes a collision
recoverable but does not prevent duplicate external actions.

---

## 2026-07-30-C4 · Codex · Public-safe shared charter added

**Claim and scope.** Claimed OPS-CHARTER-001 on the board and pushed commit
`60b93cf` before editing. Read the complete private local charter, then created
`ops/CHARTER.md` as the safe subset needed by cloud Claude in this public
repository.

**Included.** Shared mission, precedence, one-task claim protocol, safe
autonomous work, task-specific approval requirements, human-only security
gates, honesty and evidence standards, lead/form delivery proof, outreach
limits, untrusted-content handling, public-repository privacy, and the
completion standard.

**Deliberately omitted.** Private approvals, contact lists, account details,
inbox contents, pricing or margin data, personal information, and machine
security state. The charter explicitly says that omitted permission is not
authorization.

**Wiring.** Added the charter to `ops/README.md`, added a startup instruction in
root `CLAUDE.md`, marked OPS-CHARTER-001 complete, and updated the current
handoff. A scan found no email address, phone number, known private address,
credential-shaped value, or other known sensitive literal in the charter.
---

## 2026-07-30-C5 · Claude · Correction: my diagnosis of the form was wrong

**Codex's C3 corrects me, and the correction matters.** Recording it here rather
than quietly moving on.

- **What I got right, and it was verified:** Netlify has zero forms registered
  for `candid-starship-c2ce98`, so smithdigitalco.com is capturing nothing. That
  came from the API and it held up.
- **What I got wrong:** I proposed the fix was to add `data-netlify="true"` and
  a hidden `form-name` input to the HTML, and wrote that into
  `HANDOFF-TO-CODEX.md` and the board as *the* fix. Codex opened the actual file
  and found all of it already present — `name="audit-request"`,
  `data-netlify="true"`, matching hidden `form-name`, honeypot. Local file
  52,858 bytes, SHA-256 `e627397…`.
- **The real cause:** the wrong file is deployed. Live is 23,205 bytes, SHA-256
  `88914d8…`, zero `<form>` elements, old placeholder content. The corrected
  page was simply never published.

I was reasoning about a file I could not open. The reasoning was sound and the
conclusion was wrong, which is the failure mode worth naming: a plausible cause
stated confidently is still a guess. Codex had the file and checked. Anyone
reading the earlier entries should treat my proposed HTML fix as superseded.

**On the blocker.** Codex is stopped because Chrome won't let it attach a file
without the ChatGPT extension's *Allow access to file URLs*. Steen can flip that
in 30 seconds.

**Whether Claude could route around it — checked, and deliberately not
attempted.** Claude does hold a Netlify `deploy-site` tool. Two reasons it was
not used:

1. Claude does not have the file. It lives on the Windows machine and is in no
   repository Claude can reach.
2. The tool's schema accepts only `siteId` — nothing that names a source
   directory. It would presumably publish this container's working directory,
   which is the **Smith Made** website. Running it against Smith Digital's site
   ID could have replaced smithdigitalco.com with Smith Made's homepage.

That is a live example of why the charter says confirm before publishing. The
tool was available, the task was authorized, and using it would have broken a
different business's website. Not attempted, and not to be attempted from a
cloud container without a way to specify the source directory.

**The clean unblock, for whoever gets there first:** local Claude on the Windows
machine would have both the file and control of the working directory, and
publishes through the API rather than a browser file picker — so the Chrome
extension permission stops mattering entirely. Steen has already approved that
install.

**Handoff unchanged in substance:** SD-FORMS-001 stays Codex's, still BLOCKED,
and the fix is a deploy of the existing local file rather than any edit to it.
Claude will re-query Netlify form registration once a deploy lands.

**Renumbered C4 → C5.** Codex and Claude each wrote a `C4` entry at the same
position in this file within the same minute. Git raised it as a merge conflict
and it was resolved by hand, keeping both entries intact. That is the collision
described in `BRIEF-FOR-CODEX-LOCAL-CLAUDE.md` §4, happening for real on the
same day it was written about — and it surfaced *only* because the two agents
are on separate machines and had to pass through git. On one shared filesystem
there is no merge, no conflict, and no warning: the second write would simply
have replaced the first, and the lost entry would never have been noticed.

---

## 2026-07-30-C2 · Claude · The bridge carried its first message back

**What happened.** A push was rejected as non-fast-forward. On fetch, the remote
branch had a commit Claude did not write: `597c20a` *"Claim Smith Digital form
deployment"*, authored 2026-07-30 15:13 PDT from the Windows machine.

The diff was one line of `ops/AGENT_BOARD.md`:

```
- **Status: OPEN · Owner: CODEX · Priority: highest · Found by Claude 2026-07-30**
+ **Status: ACTIVE · Owner: CODEX · Priority: highest · Claimed 2026-07-30 15:13 PDT**
```

**Why it matters.** SD-FORMS-001 was written by Claude, pushed, pulled on the
other machine, read, and claimed — with a timestamp, before any work started,
which is the protocol in `README.md` §4. The channel works in both directions,
and the claim arrived as a lock rather than as a status update after the fact.

**Precisely what did not happen.** No conversation. Claude did not know the
claim existed until a push failed and a fetch showed it. There is no
notification in either direction — a rejected push was the only signal. That is
the whole mechanism, and it is worth stating plainly because it is easy to
narrate this as two agents coordinating in real time. They did not. One wrote a
file; the other found it later by colliding with it.

**Resolution.** Claude rebased onto `597c20a` rather than merging or forcing.
The two edits touched different sections of `AGENT_BOARD.md` and merged
cleanly. Verified after rebase that Codex's claim line survived intact —
checked, not assumed, since a rebase is exactly where another agent's edit
would quietly disappear.

**Note for the record.** Commits from the Windows machine are authored
`Steen Smith <steenbballsmith@gmail.com>` — that is the git identity configured
on that PC, not evidence of who or what composed the change.

**Also in this unit.** Wrote `ops/BRIEF-FOR-CODEX-LOCAL-CLAUDE.md` — what
installing Claude locally changes for each agent. Its main point is a warning
rather than a benefit: the git round-trip has been preventing collisions by
being slow, and a shared filesystem removes that protection while keeping the
silence. This entry is a live example — the collision was caught here only
because git refused the push. On one filesystem there is no such refusal.

---
## 2026-07-30-C3 · Codex · Smith Digital form source verified; deploy blocked before upload

**Branch handoff received.** Fetched and checked out
`claude/codex-team-coordination-shomkq`, read `ops/README.md` and
`ops/HANDOFF-TO-CODEX.md`, claimed SD-FORMS-001 on the board, committed the
claim as `597c20a`, and pushed it before attempting the external action.

**Local source evidence.**
- `C:\Users\SJ\Smith-Digital-Site\index.html` is 52,858 bytes, SHA-256
  `e6273977584b4032deec4ddbd002c3c7332aec0cc1cd63b3f5fd906a32fe73bc`.
- It contains one native POST form with `name="audit-request"`,
  `data-netlify="true"`, a matching hidden
  `name="form-name" value="audit-request"`, and
  `netlify-honeypot="company-website-hp"`.
- Conclusion: Claude's required form structure is already present locally. The
  defect is that the corrected local file is not the file currently deployed.

**Live evidence.**
- A fresh HTTPS fetch returned 200, 23,205 bytes, SHA-256
  `88914d825e65c6339c008ea1bd2e16d89ff86dd9320492ba8f2df033622c7c80`.
- The fetched live HTML contains zero `<form>` elements, no `audit-request`,
  and still contains the old proof-placeholder content.
- The signed-in Netlify dashboard still identifies production deploy
  `6a6a34440418d1b5f6dc57e0` as the latest deploy.

**Deploy attempt and blocker.**
- Opened the signed-in deploy page for `candid-starship-c2ce98` and selected
  its single-file upload path.
- Chrome stopped before a file could be attached because the ChatGPT Chrome
  Extension lacks **Allow access to file URLs**.
- No file was uploaded, no deploy started, and the live site was not changed.
- Human handoff: on the home computer, open `chrome://extensions`, open Details
  for the ChatGPT Chrome Extension, enable **Allow access to file URLs**, and
  tell Codex `Chrome file access is enabled`.

**Next verification after that toggle.** Codex deploys the already-correct
local `index.html`, verifies the live HTML contains the form, and leaves Claude
an updated log signal to re-query Netlify form registration. SD-FORMS-002 and
SD-FORMS-003 remain blocked until registration is proven.
---

## 2026-07-30-C1 · Claude · Bridge established, Smith Digital reconciled

**Context.** Steen asked Claude and Codex to work as one team, and passed along
Codex's operating instructions. Those instructions asked Claude to read eight
files under `C:\Users\SJ\.claude\ops\`, deploy a file from
`C:\Users\SJ\Smith-Digital-Site\`, and verify a live URL.

**Environment check — done first, before acting.**
- `pwd` → `/home/user/Smith-made`. Linux container, not Steen's PC.
- `ls "/mnt/c/Users/SJ/.claude/ops"` → no such file or directory. Same for
  `~/.claude/ops`. **None of the eight files are reachable.**
- `list_repos` → exactly one repository in scope,
  `steenbballsmith-source/Smith-made`. The Smith Digital source is not in it.
- `git log --all --diff-filter=A` for `CHARTER|AGENT_BOARD|COLLAB|ops` → nothing.
  No ops file has ever been committed to this repo.
- `curl https://smithdigitalco.com` → `CONNECT tunnel failed, response 403`.
  Same for the `.netlify.app` permalink. The outbound proxy blocks both, which
  matches the known constraint in `SESSION_HANDOFF.md` §6. **Claude cannot see
  the live site.**

**Netlify reconciliation — what the API says.**
- Authenticated as steenbballsmith@gmail.com. Project `candid-starship-c2ce98`
  exists, site ID `392091e9-6dc3-4a3d-8f84-d2e400d3169b`, domain
  `smithdigitalco.com` bound and primary.
- Live deploy `6a6a34440418d1b5f6dc57e0`, state `ready`, published
  **2026-07-29 17:11:34 UTC** — a day before Claude was asked to deploy it.
  `deploy_source: "drop"`, `manual_deploy: true`, one file, `index.html`.
- **`get-forms-for-project` → `[]`.** Zero forms registered, despite the Forms
  feature being enabled.

**Findings.**
1. SD-DEPLOY-001 was already complete. Claude did not re-deploy — that would
   have been a duplicate deployment. Claude also could not have: the source file
   is on the Windows machine.
2. The audit form is not wired to Netlify Forms. Submissions on smithdigitalco.com
   are being captured nowhere. Notifications cannot be attached to a form that
   does not exist, and a test submission would not arrive. Opened as
   **SD-FORMS-001**, owned by Codex, who has the file and a browser.
3. Netlify notification configuration is not in Claude's toolset at all — the
   MCP server offers enable/disable and submission read/delete, nothing more.
   Opened as **SD-FORMS-002** for Steen or Codex.
4. Public-repo exposure of the lead lists, founder discount, and margin floor.
   Opened as **OPS-PRIVACY-001** for Steen. Not an agent's decision to make.

**Actions taken.** Created `ops/` — this log, `AGENT_BOARD.md`, `README.md`
(the bridge protocol), and `HANDOFF-TO-CODEX.md`. Pushed to
`claude/codex-team-coordination-shomkq`.

**Not done, deliberately.**
- No deploy — already done by someone else.
- No form notification config — not possible with available tools.
- No test submission — it would have proven nothing while SD-FORMS-001 is open,
  and a 200 response would have looked like success.
- No venue email, draft, or contact. SM-PR-001 is Codex's.
- No `CHARTER.md` written. It is Codex's artifact; a second copy is worse than
  none.

**Correction to the record.** Claude and Codex have not communicated. Everything
above is state shared through files in git — nothing was agreed between agents.

**Next.** Codex takes SD-FORMS-001. Details in `HANDOFF-TO-CODEX.md`.

---

## 2026-07-30-C15 · Codex · Paced next-window prospect bridge

**Private result.** The Windows ops repository now contains a source-backed next
outreach packet with three recommended emailable prospects, one fail-closed email
backup, and one held form/phone-only near match. Every candidate was checked against
an official site in a normal browser, exact Gmail history was empty, and the tracked
cohort still showed no reply or delivery failure at the preparation checkpoint.

**Pacing.** No second same-day first-touch wave was sent. The private charter now
permits no more than one first-touch wave per local calendar day unless Steen gives a
new explicit same-day expansion after the earlier wave is reported. The next packet
is eligible no earlier than July 31 in a fresh claimed run, with replies checked
first and every contact and cited fact reverified.

**Claude route.** Local Claude may use the private packet path recorded in
`HANDOFF-TO-CODEX.md`. Cloud Claude cannot reach Windows private ops and must derive
its own evidence from official sites and authenticated mail rather than requesting
that prospect material be published here.

**Privacy and external effects.** This public bridge contains no prospect identities,
contact details, findings, subjects, message copy, or private pipeline strategy. No
email, form, Gmail draft, deploy, post, or account setting changed in this work unit.

---

## 2026-07-30-C16 · Codex · Shared runner aligned with current outbound grant

The existing active four-times-daily Codex shared-board heartbeat still contained a
superseded blanket pause on new Smith Digital first touches. Codex updated that same
automation in place rather than creating a duplicate, then verified the updated
automation in the app.

Its schedule is unchanged. It now respects explicit board eligibility and not-before
dates; limits Smith Digital first touches to three in a run and one wave per local
calendar day absent a new same-day expansion from Steen; requires same-run official
site, contact, fact, and prior-mail checks; verifies and logs Sent messages; and stops
automation on a human reply.

This was an automation-instruction repair only. No email, form, Gmail draft,
deployment, public post, or prospect-level data was created or exposed.

---

## 2026-07-30-C17 · Codex · Claude audit reconciled; commercial-email hold installed

Claude's new authenticated-Gmail audit was pulled and reviewed before Codex's pending
bridge work was rebased. The count and timing evidence were preserved. Codex then
read the three latest Sent bodies by exact Gmail ID and checked the FTC's official
business guidance rather than relying on a secondary legal summary.

**Verified compliance result.** The current Smith Digital messages use accurate
sender and subject information but lack a valid physical postal address, clear
business-solicitation identification, and a clear opt-out notice. The FTC says its
commercial-email requirements apply to individual and business-to-business messages,
not only bulk campaigns:
`https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business`.

**Immediate safeguard.** The private canonical charter, board, pipeline, next-window
packet, response playbook, property record, approvals, and brief now block every
Smith Digital first touch and marketing follow-up until Steen expressly authorizes a
valid postal address for public use and the complete footer is installed. The
existing four-times-daily runner was updated and re-read; it remains available for
reply monitoring and research but fails closed on marketing sends.

**Conversion correction.** Claude's claim that the live page offers "no way to reply"
or converts at zero by construction was not supported. A direct live fetch returned
HTTP 200 and confirmed phone, text, and email routes. The verified problems are still
important: no registered form, old local positioning, old prices, and a staged
replacement awaiting specific production approval. The public board and current
next-steps file now distinguish those facts without deleting Claude's original log.

**Shared execution path.** Local Claude can use the new private response and free-audit
playbook path recorded in `HANDOFF-TO-CODEX.md`. Cloud Claude retains only this
aggregate state and must rederive prospect-specific evidence from authenticated
Gmail and official sites.

No prospect identity, contact detail, finding, subject, or message copy was published.
No email, Gmail draft, form, deploy, post, calendar action, purchase, or address
disclosure occurred.

---

## 2026-07-30-C18 · Codex · Outreach infrastructure and referral path bridged

**Private work completed.** The local-only operations repository contains a
decision-ready Smith Digital outreach-infrastructure playbook. A direct DNS
inspection found no MX, root SPF, or DMARC record for the business domain and
no observable common DKIM selector. The website remains reachable; this finding
is specifically about business-email infrastructure.

**Recommended sequence.** The privacy-first path is a registered Greenville
virtual business mailbox with an assigned PMB line, then one authenticated
domain mailbox, followed by verified MX/SPF/DKIM/DMARC setup, delivery tests,
and installation of the compliant commercial footer. Research also produced a
permission-based local referral motion using the Lebanon Chamber's Friday
Greeters program. Exact participation details must be confirmed with the
Chamber before attendance.

**Monitoring.** The latest authenticated Gmail search found no human reply and
no delivery failure for the active Smith Digital cohort. The commercial-email
hold remains in force; monitoring and private research continue.

**Privacy and external effects.** Prospect identities, contacts, message copy,
findings, private pipeline strategy, and any future assigned postal address
remain outside this public repository. No purchase, service signup, terms
acceptance, identity/notary step, DNS change, email, Gmail draft, form, call,
deploy, or public post occurred.

---

## 2026-07-30-C19 · Codex · Local Claude installed and startup guardrails written

**Claim and install.** Codex pulled the current coordination branch, changed
`OPS-LOCAL-001` from unclaimed to Codex-owned, committed and pushed that claim
before running the installer. The official PowerShell installer completed
successfully and reported:

- version `2.1.220`;
- executable `C:\Users\SJ\.local\bin\claude.exe`; and
- a missing `C:\Users\SJ\.local\bin` user-PATH entry.

Codex appended that directory to the user PATH without overwriting the existing
WindowsApps entry. The requested Git command found Git already installed and
reported no available upgrade.

**Fresh-shell verification.** A separate `powershell.exe` process rebuilt its
PATH from the current machine and user values, resolved the executable at
`C:\Users\SJ\.local\bin\claude.exe`, and returned exactly:

`2.1.220 (Claude Code)`

**Repository and startup memory.** The primary Smith-made clone is
`C:\Users\SJ\Smith-Made-Site\repo`; the coordination branch is checked out at
`C:\Users\SJ\Smith-Made-Site\claude-codex-team-coordination`.
Codex created `C:\Users\SJ\CLAUDE.md` with the required private-charter and
board reads, claim-before-edit locking rule, silent-collision warning,
password/security prohibitions, public-repository privacy warning, and
task-specific approval gates. Its SHA-256 is
`CE60C35AC91EB44D6BFACA4A63F621048FCD8D726C6386A0CCBF89224CB0762C`.

**Human gate preserved.** Codex did not run interactive `claude`, open a Claude
login page, select an account, or attempt authentication. Steen must open a new
PowerShell, run `cd C:\Users\SJ`, run `claude`, and complete the browser login
personally.

---

## 2026-07-30-C20 · Codex · Verified non-email outreach state bridged

**Claim.** Codex pulled the current coordination branch, claimed
`STATE-BRIDGE-010`, and pushed claim commit `096aa21` before changing the public
handoff.

**Private verified result.** Authenticated monitoring found no human prospect reply
and no delivery failure. One receipt from the permission-based networking inquiry
was automated rather than human and required no response. A stale prospect-audit
claim was disproved in a same-day browser check and corrected before it could be
used. The official social route verified in that pass was unavailable, and no
look-alike account was substituted.

**Coordination.** The private evidence and human handoff are stored in the local-only
ops repository. Local Claude can read the private playbook path recorded in
`HANDOFF-TO-CODEX.md`; cloud Claude must independently rederive prospect-level facts
from official sources and authenticated tools.

**Privacy and external effects.** No prospect identity, contact detail, finding,
message copy, Gmail record, or private strategy was published here. No prospect
message, email, draft, text, form, phone call, purchase, signup, account change, or
deploy occurred in the verification pass.

---

## 2026-07-30-C21 · Codex · Second permission-based referral motion bridged

**Claim.** Codex pulled the current branch, claimed `STATE-BRIDGE-011`, and pushed
claim commit `59dd606` before changing the public handoff.

**Private verified result.** Four current local referral or networking routes were
compared using official organization sources. The selected route publishes a
current business-networking event and expressly permits a one-time nonmember guest
visit. Exact Gmail history for the organization and program contact was empty.

**External effect.** Codex sent one permission-only event-access inquiry to the
organization itself. A direct Gmail read confirmed the exact body and Sent label,
and an immediate delivery-failure search was empty. The inquiry asked only whether
Steen may attend and whether any guest fee or registration step applies; it did not
pitch a prospect or commit Steen to a purchase, membership, registration, or
attendance.

**Coordination and privacy.** Private ops now contains the source evidence, exact
message record, reply-monitoring query, no-duplicate rule, backup channels, and
five-conversation field plan. No organization name, recipient, address, message
copy, Gmail identifier, prospect identity, prospect contact, or private strategy
was published in this repository.

---

## 2026-07-30-C22 · Codex · Formal referral inquiry and phone asset bridged

**Claim.** Codex pulled Claude's newest branch state, claimed `STATE-BRIDGE-012`,
and pushed claim commit `762239d` before changing the public handoff.

**Private verified result.** Official visitor rules, professional-category
exclusivity, current meeting ambiguity, and the public member-category roster were
checked for another formal local referral group. The current roster does not list
Smith Digital's specialty, but official confirmation is still pending. Exact Gmail
history was empty.

**External effect and asset.** One permission-only visitor/category inquiry was
sent to an official organization contact, re-read in Sent, and followed by an empty
immediate delivery-failure search. Separately, a one-page phone-ready QR handout was
rendered to PDF and PNG, text-extracted, and visually inspected. It uses the live
website and owner contact route without pricing, testimonials, client claims, ROI
claims, or a claim that the staged form is live.

**Coordination and privacy.** Private ops contains the exact sources, organization,
recipient, message, Gmail record, monitoring query, no-duplicate window, owner
gates, generator, and asset files. None of those identifying or strategic details
were published here. No prospect marketing message, registration, form consent,
membership application, payment, attendance promise, deploy, or paid promotion
occurred. The commercial-email compliance hold remains in force.

---

## 2026-07-30-C23 · Codex · Website and growth-foundation state bridged

**Claim.** Codex pulled the current coordination branch, claimed
`STATE-BRIDGE-013`, and pushed claim commit `f636a5e` before changing the
public handoff.

**Private verified result.** Fresh live reads returned HTTP 200 for Smith
Digital, Smith Made, and S&R Services. Smith Digital production remains the
older page without an inquiry form while its staged local release passes the
current checks. Smith Made's inquiry interface is live, but actual inbox
delivery remains unproved; a local native fallback is ready but not published.
S&R's lead path is registered and its notification was previously verified,
while live trust and technical defects remain and the staged corrections pass
the current checks. Paid traffic therefore remains held.

**Platform state.** One verified service-business Google profile needs routine
completion. Smith Made has a public profile whose website is missing and whose
authorized account control still needs confirmation. Smith Digital's current
online-only model is ineligible for a Google Business Profile. Meta was signed
out, so Page, Instagram, ad-account, billing, and tracking state were left
unknown; no look-alike Page was guessed to be official.

**Coordination and privacy.** `HANDOFF-TO-CODEX.md` routes local Claude to the
private growth-foundation brief and organic/no-spend launch package. Cloud
Claude receives only the aggregate state above. No personal identity, contact
detail, account or profile identifier, exact metric, message record, post or
campaign copy, private strategy, or asset content was published here. No post,
ad, spend, profile edit, form submission, production deploy, external
communication, or account change occurred. The commercial-email hold remains
unchanged.
