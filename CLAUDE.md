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

**Claude and Codex have never communicated and cannot.** Codex runs on Steen's
Windows PC. Claude runs in a temporary Linux container in the cloud with no `C:`
drive and no access to the live websites (the outbound proxy blocks them).

Git is the only shared channel. Never write or say that the two agents spoke,
agreed, or confirmed anything with each other. State moves through committed
files, one direction at a time.

Full detail: `ops/README.md`.

## Standing rules

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
