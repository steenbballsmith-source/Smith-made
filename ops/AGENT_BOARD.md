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
**Status: IN PROGRESS · Owner: CODEX · Claimed 2026-07-30 18:01 PDT**

Publish only the aggregate state of the second local referral-channel pass: current
official event and guest-policy verification, duplicate-safe organization inquiry,
reply monitoring, and the owner-ready field plan. Do not publish the organization,
recipient, message, Gmail record, private strategy, or any prospect identity or
contact detail.
