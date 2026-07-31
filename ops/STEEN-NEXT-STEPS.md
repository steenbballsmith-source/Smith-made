# Steen — where things stand and what to do next

Updated 2026-07-30, evening, after Codex reported back. This is your inbox: it
gets overwritten. History lives in `ops/LOG.md`.

---

## 🔴 New, and it moved to the top of the list

**Future Smith Digital marketing email is paused until its footer is compliant.**

Claude checked Gmail independently and found 26 cold messages in the last 24 hours;
23 were sent in about five minutes. Codex then re-read the three latest message
bodies and checked the FTC's own business guidance. The messages have accurate
sender and subject information, but they do not include:

- a valid physical postal address;
- clear identification as a business-services solicitation; or
- a clear way to opt out.

The FTC says those rules cover individual and business-to-business commercial email,
not only bulk campaigns. All future Smith Digital first touches and marketing
follow-ups are now paused. To reopen them, tell the agents one valid street address,
registered PO box, or registered private mailbox that you deliberately authorize
prospects to see — or say to keep outreach paused until you obtain one.

The website still needs its staged replacement published, but one correction matters:
the current page is not a total dead end. It has phone, text, and email links. What it
lacks is the much better staged form, and it still shows the old local positioning
and old prices. Do not treat every prior message as automatically wasted or claim a
guaranteed zero conversion rate.

The fast prior burst is still a sender-reputation warning because the same personal
Gmail also carries normal business mail. Future pacing remains capped even after the
compliance hold is cleared.

---

## ⚠️ Also still true

**Both of your businesses have a contact form that may be losing every inquiry.**

### Smith Digital — confirmed broken, cause now known

I found today that Netlify has **zero forms registered** for smithdigitalco.com.
Codex then checked the actual files and found the real reason, which is simpler
and more annoying than I guessed:

**The good version of your site was never published.** The file on your PC is
52 KB and has a proper working audit form in it. The file actually live on the
internet is a different, older 23 KB file with **no form on it at all** — still
the old placeholder content. Somebody drag-and-dropped the wrong file to Netlify
on 2026-07-29.

So nothing needs rewriting. The correct page already exists on your computer. It
just needs to be published.

I want to be straight about one thing: my first guess was that the form's code
was written wrong and needed fixing. That was wrong. I was reasoning about a
file I couldn't see. Codex opened it, checked it, and proved otherwise. The
*problem* I found was real; the *cause* I guessed wasn't.

### Smith Made — still unconfirmed, and unconfirmed is not fine

Your smithmadesc.com form sends through a service called FormSubmit. It holds
every submission until someone clicks a one-time **Activate** button in an email
sent to will.smithmade@gmail.com. Per your own notes, that click was never
confirmed. If it never happened, every inquiry since launch is sitting in limbo.

Nobody has checked this. I can't — it needs eyes on Will's inbox. It is the
biggest unknown you have.

---

## When you get home — in this order

### 1. Test both your own forms · 5 minutes · do this first
Go to **smithmadesc.com**, fill in the inquiry form with "TEST — ignore", send.
Then check **will.smithmade@gmail.com**.

- FormSubmit email asking you to **Activate**? Click it. That was the bug.
- Your test arrives normally? That form is fine.
- **Nothing arrives?** Worst case, needs fixing that day.

This is the only item here that tells you whether you're currently losing money.

### 2. Flip one Chrome setting · 30 seconds · unblocks Codex right now
Codex got all the way to Netlify's upload page and was stopped by a browser
permission. It could not attach the file.

1. Open Chrome → go to `chrome://extensions`
2. Find the **ChatGPT Chrome Extension** → click **Details**
3. Turn on **Allow access to file URLs**
4. Tell Codex exactly: `Chrome file access is enabled`

Codex then publishes the correct file and your audit form goes live. Nothing was
uploaded during the blocked attempt, so nothing is half-done.

### 3. Put Claude on your PC · 10 minutes
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

Log in when the browser opens — that part is yours, no agent can do it.

**Worth knowing:** this also routes around the problem in step 2 entirely.
Local Claude would have that file and can publish it straight through Netlify's
API — no browser, no file picker, no extension permission. If step 2 gives you
trouble, step 3 makes it irrelevant.

### 4. Netlify email alerts · 2 minutes · only you can do this
Netlify → `candid-starship-c2ce98` → Project configuration → Notifications →
Form submission notifications → email → **steenbballsmith@gmail.com**.

Only works once the correct page is live — there's no form to attach it to yet.

### 5. Then a real test
Submit one clearly-labelled test on smithdigitalco.com and confirm it lands **in
your inbox**. Not that the button worked — a broken form still shows a
satisfying "sent!" message. The inbox is the only proof.

---

## What happened today

**The problem.** You asked me to team up with Codex. Codex had built a
coordination system in a folder on your PC and written me instructions to read
it. I can't — I run in a temporary machine in a datacenter with no access to
your computer. Not one of those files was reachable. The plan was sound; it just
assumed we were on the same machine.

**What I built.** An `ops/` folder inside your GitHub repo — the one place both
of us can reach. Shared task board, a log with evidence, handoff notes.

**It works, and it's already earned its keep.** Today: I found the form was
dead. Codex pulled that, claimed it, opened the actual files, and found the real
cause — with file sizes and checksums, not a guess. Then it hit the Chrome
blocker and wrote that down instead of going quiet. Neither of us could have
gotten there alone. I couldn't see the file; Codex wouldn't have known to look
without the Netlify records I read.

**What I checked rather than assumed.** The board told me to deploy Smith
Digital. Netlify's records showed it had gone live the day before, so I didn't
repeat it. Three of the six jobs I'd been handed — verify the form, set up its
alerts, test it — were resting on a form that didn't exist. Worked as a list,
they'd have produced a cheerful report about a form that drops every lead.

**Also today:** your install guide, a briefing for Codex on what changes when
Claude goes local, and your preference recorded that work arrives as a file
rather than a wall of chat.

**One thing I flagged and left alone.** Your GitHub repo is public, and it
publishes your 14-venue lead list with notes, your 10-planner list, the
founder-discount offer, and your margin floor (~50–55%). No passwords, no
customer data — but it's your playbook and your pricing, readable by any
competitor who finds it. Your call, not mine.

---

## Still open from before today

- **smithmadesc.com HTTPS** — repo → Settings → Pages → wait for the green DNS
  check → tick **Enforce HTTPS**.
- **Square account email** — still steenbballsmith@gmail.com, should be
  will.smithmade@gmail.com. Settings → Account → Email.
- **Google Business Profile** — photos, services with prices, first post,
  website field → https://smithmadesc.com. Video verification pending.
- **Three venue emails** — Codex owns these. Note the drafts sit in the wrong
  inbox and the signature has the wrong email on it.
- **Two Marketplace listings** — ready to paste, `MARKETING_PLAYBOOK.md` §2.
- **@smithmadesc socials** — bios and nine posts written, `SOCIAL_KIT.md`.
- **The privacy decision** — above.

---

## Who can actually do what

**Only you.** Every login. The Chrome toggle. Netlify's notification settings.
The Enforce HTTPS tick. The Square email swap. Google Business verification.
Anything spending money. The privacy call. Agents stop at identity gates —
that's the line that keeps one from being able to act as you.

**Codex** (your PC, your files, a browser): publish the correct Smith Digital
file once unblocked and continue the separate Smith Made venue work. The local
ops folder now has private recovery history, so the earlier overwrite risk has
an undo; Codex completed that safeguard and did not connect it to GitHub.

**Me, from the cloud:** check what's actually true — deploy records, form
registration, whether a site does what a summary claims. That's been my value
today: I caught that the deploy was already done, and that the form was dead. I
can also write and edit the Smith Made website, and draft anything needing words.

**Me, once on your PC:** all of that, plus your real files, plus I can load your
live sites — this container is blocked from reaching them, which is why I read
Netlify's records instead of just looking. And I could publish Smith Digital
directly.

**Neither of us, ever:** use your password, or send/publish/spend without you
saying so. And we can't talk to each other — same machine or not. Files only. If
either of us tells you the other agreed to something, that's a bug.

---

## Where things live

- **This file** — what's open for you
- `ops/AGENT_BOARD.md` — every task, owner, and what's verified
- `ops/HANDOFF-TO-CODEX.md` — Codex's current jobs
- `ops/LOG.md` — what happened, with evidence
- `ops/SETUP-CLAUDE-ON-YOUR-PC.md` — the install
- All on branch `claude/codex-team-coordination-shomkq`, draft PR #29

Drive safe.
