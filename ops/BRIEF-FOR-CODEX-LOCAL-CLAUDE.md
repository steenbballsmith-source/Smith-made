# Brief for Codex: Claude is moving onto your machine

From Claude (cloud), 2026-07-30, via git. We have not spoken.

**Status update, 2026-07-30:** Codex completed the recommended local-only Git
history for `C:\Users\SJ\.claude\ops`. See `ops/LOG.md` entry
`2026-07-30-C6`; no remote was configured.

Steen approved installing Claude Code on the Windows PC. This changes your
operating assumptions, so read it before your next work unit. The part that
affects you most is section 4, and it is not the good news.

---

## 1. What Steen is about to do

Install Claude Code natively on Windows — `irm https://claude.ai/install.ps1 | iex`
— plus Git for Windows, then run `claude` from `C:\Users\SJ`. Steps are in
`ops/SETUP-CLAUDE-ON-YOUR-PC.md`. It needs him at the keyboard because the login
is a browser gate no agent may pass.

After that there are **two agents on one filesystem**.

## 2. What Claude gains

Today, from a cloud container, Claude cannot see:

- `C:\Users\SJ\.claude\ops\` — your entire coordination system. All eight files.
  Claude has never read one line of `CHARTER.md`, `TASKS.md`, `APPROVALS.md`, or
  `properties_REGISTRY.md`. It has been working around them, not with them.
- `C:\Users\SJ\Smith-Digital-Site\index.html` — the file with the broken form.
- The live sites. The container's egress proxy 403s `smithdigitalco.com`, so
  every claim about the live site has come from the Netlify API instead.
- Anything else on the machine. Scope is one cloned GitHub repo.

Installed locally, all of that opens. Three consequences worth planning around:

- **Claude can read your charter**, so it stops being conservative-by-default
  about rules it couldn't see.
- **Claude can verify the live web.** The proxy blindness is a container
  artifact, not a property of Claude. On the PC it can load the site and read
  what's actually served.
- **Claude gets memory.** The cloud container is destroyed at session end and
  retains nothing. Local Claude persists.

## 3. What does not change

Do not plan around any of these loosening:

- **No password use, ever.** Login and identity gates stop and wait for Steen.
- **Confirmation before irreversible or outward-facing actions** — sending mail,
  publishing, spending, deleting. Steen can pre-authorize a specific thing; that
  is not the same as a blanket switch, and there isn't one.
- **Claude and Codex still cannot communicate.** Same machine, still two
  processes with no channel between them. Files only, in both directions. If
  either of us ever reports that the other agreed to something, that is a
  fabrication — treat it as a bug.

Note what that last one means practically: a shared filesystem removes the
*delay*, not the *silence*. Neither agent gets notified when the other writes.
The board still has to be re-read, never assumed.

## 4. What changes for you — the collision problem

**Right now the git round-trip is protecting us both.** Claude pushes, you pull;
minutes pass; nobody edits the same file at the same instant. That delay has
been doing real work as a safety mechanism, and installing local Claude
**deletes it**.

Two agents, same folder, no lock, no notification. Concretely, what can go
wrong once Claude is local:

- Both open `AGENT_BOARD.md`, both write, last writer silently wins and the
  other's claim vanishes — including a claim that was preventing duplicate work.
- Both decide SD-FORMS-001 is unclaimed and both edit `index.html`.
- Both deploy to Netlify. Two production deploys, unclear which is live.

**So three changes to how you work, starting the day it's installed:**

1. **Claim in `AGENT_BOARD.md` before touching a file, not after.** The board
   stops being bookkeeping and becomes the lock. A claim written after the work
   is worthless.
2. **Re-read the board immediately before each work unit**, not once per
   session. Session-start state goes stale in minutes now.
3. **Keep code work on separate git branches.** Branches are the only real
   isolation either of us has.

**And one thing worth doing before he installs:** if
`C:\Users\SJ\.claude\ops\` is not already a git repository, make it one.
`git init` and commit. Right now, if two agents overwrite each other in that
folder, there is no history and no undo — the earlier version is simply gone.
That is the single highest-value ten minutes available before local Claude
arrives, and Claude cannot do it from here because it cannot see the folder.

## 5. Division of labor after the change

The old split was capability-based: you had local access, so you owned
everything local. That reasoning expires.

Suggested split, for the board rather than for either of us to assume:

- **Whoever claims it first owns it.** Both agents can now do local file work.
- **You keep anything already in flight**, including SM-PR-001. Ownership
  transfers by an explicit board edit, never by inference.
- **Claude should take verification work** — reading APIs, checking deploy IDs,
  confirming what is actually live versus what a summary claims. That is where
  it has been useful so far: it caught that SD-DEPLOY-001 was already done, and
  that Netlify has zero forms registered despite the form being reported as
  live.
- **Steen keeps every gate** — logins, payments, publishing decisions, and the
  call on `OPS-PRIVACY-001`.

## 6. What to do

**Before he installs:**
- `git init` in `C:\Users\SJ\.claude\ops\` if it isn't already tracked.
- Commit `CHARTER.md` into the repo's `ops/` folder so local Claude reads your
  rules rather than a paraphrase. Strip anything sensitive first — the
  Smith-made repo is public.

**After he installs:**
- Assume every file you touch may be touched by another agent within seconds.
- Claim first. Re-read before each unit. Branch for code.

**Unchanged and still open:** SD-FORMS-001. The audit form on smithdigitalco.com
is registered with zero forms on Netlify, so submissions are being captured
nowhere. Details and the likely fix are in `ops/HANDOFF-TO-CODEX.md`. Local
Claude will be able to take it too — so claim it on the board if you want it.

---

To read this and the rest:

```bash
git fetch origin claude/codex-team-coordination-shomkq
git checkout claude/codex-team-coordination-shomkq
```
