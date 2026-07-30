# Working agreement — read this first

## How Steen wants work delivered

**Default output is a handoff file, not a chat essay.** Steen asked for this
directly on 2026-07-30: *"anything like this, I want you to just handoff and
stuff that I can give to Codex or do that and then tell me where to tell Codex
to look."*

So every work unit ends like this:

1. **Write the handoff to `ops/HANDOFF-TO-CODEX.md`** — the open asks, in
   Codex's language, ready to act on. This file is an inbox, not an archive:
   overwrite it with what's currently open. Anything Steen has to do himself
   goes in its own section, in plain words, with the exact clicks.
2. **Append what happened to `ops/LOG.md`** — with the evidence, so the next
   agent can reproduce the check. Never edit an old entry; correct it below.
3. **Update `ops/AGENT_BOARD.md`** — task ownership and status.
4. **Commit and push.** If it isn't pushed, Codex cannot see it, and neither
   can the next Claude session.
5. **Then reply to Steen in a few lines**: what changed, and the exact sentence
   to give Codex. Not a report — a pointer.

The long version belongs in the file. The chat message is the address of the
file.

Steen is not a developer. Write the files so they're usable without knowing
what a deploy or a DNS record is — and when something is genuinely technical,
say what it means for the business, not just what it is.

## The one thing to get right about Codex

**Cloud Claude and Codex have no channel between them.** Codex runs on Steen's
Windows PC. Cloud Claude runs in a temporary Linux container with no `C:` drive
and no access to the live websites (the outbound proxy blocks them). Git is the
only shared channel, one direction at a time.

**One exception, added 2026-07-30:** Codex can drive Claude Desktop on the PC
and send it prompts. That is a real channel, but an asymmetric one — Codex
prompting Claude and getting agreement is *not* independent verification, it is
Codex's own framing handed back. Cite the artifact, never the other agent's
agreement. Never say the two spoke unless a real channel recorded it, and then
name which. Full detail: `ops/AUTHORIZATION.md` §3.

Full detail: `ops/README.md`.

## Standing rules

- **Claude has standing end-to-end authorization**, granted by Steen
  2026-07-30: complete requests end to end, make reasonable assumptions, keep
  working rather than confirming each step. It carries its own exceptions —
  still stop for a specific say-so before purchases, permanent deletion,
  credential changes, **external communications**, **production deploys**, or
  anything outside the stated scope. Details: `ops/AUTHORIZATION.md` §2.
  Don't read this as licence to send the venue emails or publish a site; those
  are the named exceptions, not the grant.
- **Read `ops/CHARTER.md` before business work.** It is the public-safe shared
  constitution. A permission omitted from it is not authorization.
- **Verify, don't trust the summary.** A board entry saying "done" is a claim.
  Check the API, the deploy ID, the inbox. This convention exists because a
  board and reality had already drifted apart — see `ops/LOG.md` 2026-07-30-C1.
- **Never duplicate** the other agent's edit, branch, deploy, email, or form
  submission. Claim on the board before working.
- **Never ask for Steen's password.** Logins and identity checks stop and wait
  for him personally.
- **Don't manufacture activity.** Real inquiries beat more pages and more
  outreach volume.
- **This repo is public.** No customer details, credentials, or real contact
  lists in committed files. See `OPS-PRIVACY-001` on the board.

## Repo facts worth not re-learning

- Plain HTML/CSS/JS, no build step. `js/manifest.js` is the only file the owner
  edits.
- GitHub Pages deploys from `main` via `.github/workflows/deploy-pages.yml`.
  It runs **only on push to `main`** — so pull requests get no CI here, and a
  PR with no checks is normal, not broken.
- That workflow excludes `*.md` from the deploy, so these docs never reach the
  live site. They are still public on GitHub.
- Full business state: `SESSION_HANDOFF.md`.
