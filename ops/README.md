# The Claude ↔ Codex bridge

**Why this folder exists:** Codex built a coordination system at
`C:\Users\SJ\.claude\ops\` on Steen's Windows machine. Claude cannot read it.
Not "hasn't yet" — *cannot*. This folder is the version that actually works.

Written by Claude, 2026-07-30. Codex should read this before its next work unit.

---

## 1. Where each agent actually runs

| | Codex | Claude |
|---|---|---|
| Machine | Steen's Windows PC | Ephemeral Linux container in the cloud |
| Sees `C:\Users\SJ\...` | Yes | **No** |
| Sees this git repo | Yes | Yes |
| Can open a browser / click UI | Yes | No |
| Can load `https://smithdigitalco.com` | Yes | **No** — outbound proxy returns 403 |
| Netlify / Gmail / GitHub APIs | via its own auth | via MCP, authenticated as steenbballsmith@gmail.com |
| Lifespan | as long as the PC is on | container is wiped when the session ends |

The two rows in bold are why the original plan could not run as written. Claude
was asked to read eight files on the `C:` drive and to verify a live URL. Both
are outside the container. Nothing was wrong with the plan's intent — it just
assumed one machine where there are two.

## 2. The shared channel is git. There is no other one.

Claude and Codex have never exchanged a message and cannot. **Never write or say
that the two agents "spoke," "agreed," or "confirmed with each other."** Every
piece of shared state travels one way:

```
agent writes a file  →  commits  →  pushes  →  other agent pulls  →  reads
```

That is the whole protocol. It is slow, it is durable, and it is honest.

Practical consequence: **Claude's work is invisible to Codex until it is pushed,
and Codex's work is invisible to Claude until it is pushed.** Anything Codex
keeps only on the `C:` drive — including `CHARTER.md`, `TASKS.md`,
`APPROVALS.md`, and `properties_REGISTRY.md` — is, from Claude's side, a file
that does not exist.

## 3. What lives here

| File | Owner | Purpose |
|---|---|---|
| `README.md` | Claude | This bridge protocol |
| `AGENT_BOARD.md` | shared | Who owns what, right now. Claim before working. |
| `LOG.md` | shared, append-only | What happened, with evidence. Never edit old entries. |
| `HANDOFF-TO-CODEX.md` | Claude → Codex | Open asks that only Codex can execute |

**Still missing, and only Codex can supply it:** `CHARTER.md`. It is Codex's
artifact and Claude will not write a rival copy — two charters is worse than
one. Codex: commit yours here so the guardrails bind both agents.

## 4. Working rules

1. **Pull first.** `git pull origin <branch>` before reading the board. A stale
   board is how two agents do the same job twice.
2. **Claim one bounded task** in `AGENT_BOARD.md`, push the claim, *then* work.
3. **Verify, don't trust the summary.** A board entry saying "deployed" is a
   claim. Check the API, the deploy ID, the inbox. This folder exists partly
   because a board entry and reality had already drifted apart — see LOG entry
   2026-07-30-C1.
4. **Log after every work unit**, with the evidence that would let the other
   agent reproduce the check.
5. **Never duplicate** the other agent's edit, branch, deploy, email, or form
   submission.
6. **Separate branches** for code. Fetch current state before editing.
7. **Re-verify outreach facts** against the live source the day they are used.
8. **Never ask for Steen's password.** Login and identity gates stop and wait
   for Steen personally.
9. If a task is blocked by the environment, say so on the board and move to work
   that isn't. Don't manufacture activity.

## 5. Privacy warning — read before adding files here

`steenbballsmith-source/Smith-made` is a **public** repository. Anything
committed here is world-readable, immediately and permanently.

Keep out of this folder: customer contact details, lead lists with names, real
pricing floors, revenue figures, credentials, and anything under `APPROVALS.md`
that names a person.

Note this is already a live issue, not a hypothetical. Files merged to `main`
before today publish, among other things, a 14-venue lead list with commentary
(`MARKETING_PLAYBOOK.md` §3), the founder-discount strategy, and the internal
margin floor (`SESSION_HANDOFF.md` §4). That is competitor-readable today.
Flagged for Steen — see `AGENT_BOARD.md` → `OPS-PRIVACY-001`.

**Recommendation:** create a *private* `smith-ops` repo as the permanent hub for
all four businesses and move the sensitive half of the ops brain there. This
folder is the bootstrap that works today, not the final home.
