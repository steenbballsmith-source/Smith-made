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

- **Standing end-to-end authorization, and as of 2026-08-01 there is exactly
  ONE approval gate: spending money.** Purchases, paid signups, priced terms,
  ad budgets, plan upgrades, metered services, auto-renewing trials — prepare
  them fully, then stop and queue. Everything formerly on the ask-first list
  (**external communications, publishing and deploying, permanent deletion,
  account settings**) is now **do-it-and-report**. Full scope and Steen's own
  words: `ops/AUTHORIZATION.md` **§1B** (deploys) and **§1C** (one gate).
  *This paragraph replaces the 2026-07-30 exception list; if you find that
  older list quoted elsewhere, it is stale.*
- **What replaces the removed gates is verification, not caution.** The
  approval step was also the step where a human read the work before it
  happened. That reader is gone. So: fetch the live URL after a deploy, confirm
  a send actually appears in Sent, read the record back — **every time, by you,
  and record the evidence.** A green button is not verification. First worked
  example: `ops/LOG.md` `2026-08-01-LC4`.
- **Three things the one-gate rule did NOT touch, because they were never
  Steen's to grant.** Do not read a broad permission as dissolving them:
  1. **No credential handling.** He has offered his passwords; that was
     declined and stays declined. Use the browser session he is already signed
     into, the live OAuth connectors, or a scoped key in the OS credential
     store.
  2. **No defeating an identity check** — 2FA, CAPTCHA, "confirm it's you",
     KYC. Owner permission cannot make "a particular human is present" true.
  3. **No fabrication and no waiving a legal duty.** CAN-SPAM binds Steen by
     law; "I approve it" is not a postal address. **The Smith Digital
     commercial-email hold is still in force** — `SD-COMPLIANCE-001` is the
     unlock, not the one-gate rule.
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
