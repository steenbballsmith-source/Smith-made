# Steen — where things stand and what to do next

2026-07-30. This is your inbox: it gets overwritten, so what's here is what's
open. History lives in `ops/LOG.md`.

---

## ⚠️ Read this part first

**Both of your businesses have a contact form that may be swallowing every
inquiry right now.**

**Smith Digital — confirmed broken.** I checked Netlify's own records today.
The site has the Forms feature switched on, but **zero forms are registered**.
Netlify looks for the form when the site is published, and it didn't find one.
So anyone who filled in the audit form on smithdigitalco.com since 2026-07-29
sent it into nothing. No inbox, no record, no way to recover it.

**Smith Made — unconfirmed, and unconfirmed is not the same as fine.** Your site
sends inquiries through a service called FormSubmit. It holds every submission
until someone clicks a one-time "Activate" button in an email it sends to
will.smithmade@gmail.com. Per your own handoff notes, **that click was never
confirmed**. If it never happened, every inquiry since launch is sitting in
limbo.

I can verify Smith Digital because Netlify has an API I can read. I can't verify
Smith Made from here — that needs someone to look in Will's inbox.

Everything else on this page is worth less than finding out whether you've been
losing leads. It takes five minutes and you can do it from your phone.

---

## What happened today

**The problem we found.** You asked me to team up with Codex. Codex had built a
coordination system in a folder on your PC and written me instructions to read
it. I can't — I run in a temporary machine in a datacenter with no access to
your computer. Not one of those files was reachable. The plan was sound; it just
assumed we were on the same machine.

**What I built instead.** An `ops/` folder inside your GitHub repo — the one
place both of us can reach. Codex writes there and pushes; I pull and read; and
back the other way. It holds the shared task board, a log with evidence, and the
handoff notes.

**It works.** Late today Codex pulled the board, read the Smith Digital problem,
claimed it with a timestamp, and pushed back. First real exchange. Worth knowing
how I found out: my next save was rejected because Codex had gotten there first.
Nothing notified me. That's genuinely how it works — we leave notes, we don't
talk.

**What I checked, rather than took on faith.** The board said to deploy Smith
Digital. Netlify's records showed it had already gone live the day before, so I
didn't repeat it. Then I checked the form and found the zero-forms problem. Three
of the six jobs I'd been handed — verify the form, set up its email alerts, send
a test through it — were all resting on a form that doesn't exist. If I'd just
worked the list, I'd have reported success on a form that drops every lead.

**Also today:** wrote your install guide after you approved putting Claude on
your PC, wrote Codex a briefing on what that changes, and recorded your
preference that work arrives as a file rather than a wall of chat.

**One thing I flagged and left alone.** Your GitHub repo is public, and it
publishes your 14-venue lead list with notes on each, your 10-planner list, the
founder-discount offer, and your margin floor (~50–55%). No passwords, no
customer data — but it's your playbook and your pricing, readable by any
competitor who finds it. What your business publishes is your call, not mine.

---

## When you get home — in this order

### 1. Test both your own forms · 5 minutes · do this first
Go to **smithmadesc.com**, fill in the inquiry form with something obvious like
"TEST — ignore", send it. Then check **will.smithmade@gmail.com**.

- If a FormSubmit email arrives asking you to **Activate** — click it. That's
  the bug, now fixed, and it means inquiries were being held.
- If your test inquiry arrives normally — that form is fine.
- If **nothing** arrives at all — that's the worst case and it needs fixing
  today.

Do the same on **smithdigitalco.com**. That one I already know is broken, so
this is just to see it for yourself.

### 2. Put Claude on your PC · 10 minutes
Start → type `powershell` → Enter. Paste:

```powershell
irm https://claude.ai/install.ps1 | iex
winget install --id Git.Git -e --accept-package-agreements --accept-source-agreements
```

Close that window, open a new one, paste:

```powershell
cd C:\Users\SJ
claude
```

Log in when the browser opens — that part is yours, no agent can do it. Then
type: `read C:\Users\SJ\.claude\ops and tell me what Codex has set up`.

If it reads those files back, it's working. Full guide:
`ops/SETUP-CLAUDE-ON-YOUR-PC.md`.

### 3. Hand local Claude the form problem · 2 minutes of your time
Once it's running, type:

```
the audit form on smithdigitalco.com is capturing nothing - Netlify has zero
forms registered. read ops/HANDOFF-TO-CODEX.md in the Smith-made repo, then fix
C:\Users\SJ\Smith-Digital-Site\index.html and redeploy
```

Check the board first (`ops/AGENT_BOARD.md`) — Codex claimed this at 3:13pm. If
it's already fixed, skip. Don't let both agents do it twice.

### 4. Netlify email alerts · 2 minutes · only you can do this
Netlify → `candid-starship-c2ce98` → Project configuration → Notifications →
Form submission notifications → email → **steenbballsmith@gmail.com**.

Only works after step 3 — there's no form to attach it to until then.

### 5. Then a real test
Submit one clearly-labelled test inquiry on smithdigitalco.com and confirm it
lands **in your actual inbox**. Not that the button worked — a broken form still
gives you a satisfying "sent!" message. The inbox is the only proof.

---

## Still open from before today

These predate today and are still waiting:

- **smithmadesc.com HTTPS** — repo → Settings → Pages → wait for the green DNS
  check → tick **Enforce HTTPS**.
- **Square account email** — still steenbballsmith@gmail.com, meant to be
  will.smithmade@gmail.com. Settings → Account → Email.
- **Google Business Profile** — photos, services with prices, first post, and
  set the website field to https://smithmadesc.com. Video verification pending.
- **Three venue emails** — Riverain Farm, The Barn at Sitton Hill Farm, The
  Hollow at Paris Mountain. Codex owns these. Note the drafts sit in the wrong
  inbox and the signature has the wrong email on it.
- **Two Facebook Marketplace listings** — ready to paste, `MARKETING_PLAYBOOK.md` §2.
- **@smithmadesc socials** — bios and nine posts written, `SOCIAL_KIT.md`.
- **The privacy decision** — public repo, above.

---

## Who can actually do what

**Only you.** Every login. Netlify's notification settings. The Enforce HTTPS
tick. The Square email swap. Google Business verification. Anything spending
money. The privacy call. Agents stop at identity gates — that's the line that
keeps one from being able to act as you.

**Codex** (on your PC, has your files and a browser): fix and redeploy Smith
Digital, send the venue emails, and one small job I can't do — run `git init` in
`C:\Users\SJ\.claude\ops` so that folder has an undo. Right now if two agents
overwrite each other in there, the earlier version is just gone.

**Me, from the cloud:** check what's actually true. Deploy records, form
registration, whether a site says what it claims to. That's where I've been
worth having today — I caught that the deploy was already done, and that the
form was dead. I can also write and edit the Smith Made website, since I have
that code, and draft anything you need words for.

**Me, once I'm on your PC:** all of that, plus your actual files, plus I can
load your live websites — this cloud container is blocked from reaching them,
which is why I've been reading Netlify's records instead of just looking. And I
could fix Smith Digital myself instead of writing Codex a note about it.

**Neither of us, ever:** use your password, or send/publish/spend without you
saying so. And we can't talk to each other — same machine or not. Files only. If
either of us ever tells you the other one agreed to something, that's a bug.

---

## Where things live

- **This file** — what's open for you
- `ops/AGENT_BOARD.md` — every task, who owns it, what's verified
- `ops/HANDOFF-TO-CODEX.md` — Codex's jobs
- `ops/LOG.md` — what happened, with the evidence
- `ops/SETUP-CLAUDE-ON-YOUR-PC.md` — the install
- `ops/BRIEF-FOR-CODEX-LOCAL-CLAUDE.md` — what changes when I'm local
- All on branch `claude/codex-team-coordination-shomkq`, draft PR #29

Drive safe.
