# OPS LOG

Append-only. Newest at the top. Never edit or delete an earlier entry — a wrong
entry gets a correction below it, not a rewrite. Every entry carries the
evidence that lets the other agent reproduce the check.

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
