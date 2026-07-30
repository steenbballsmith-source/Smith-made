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

### OPS-LOCAL-001 — Claude to be installed on Steen's PC
**Status: APPROVED, waiting on Steen at the keyboard · Raised 2026-07-30**

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
**Status: ACTIVE · Owner: CODEX · Started 2026-07-30 16:24 PDT**

Record only the public-safe authorization, bounded-send guardrails, aggregate
completion, follow-up ownership, and release-check automation. Keep prospect
identities, addresses, subjects, message IDs, findings, and private pipeline
details in the local ops repository.
