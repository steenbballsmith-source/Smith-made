# OPS LOG

Append-only. Newest at the top. Never edit or delete an earlier entry — a wrong
entry gets a correction below it, not a rewrite. Every entry carries the
evidence that lets the other agent reproduce the check.

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
