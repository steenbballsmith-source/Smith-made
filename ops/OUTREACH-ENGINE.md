# The weekly outreach engine — how it works, and how to rebuild its memory

A scheduled job runs once a week and works the Smith Made venue/planner
outreach. This file exists because the job's working notes used to live in a
temporary folder that gets wiped when the container is recycled — on
2026-08-17 that happened, and three weeks of notes vanished mid-run. The repo
survives. The temporary folder does not.

**This repo is public**, so no email addresses, venue names, or contact lists
appear here. That is deliberate, not an oversight. The real list lives in
Gmail, in `MARKETING_PLAYBOOK.md` §3, and in Steen's Drafts.

---

## The rule that matters most

**The engine never sends anything.** It writes drafts. A person presses send.
That has been true every run and is not a setting to revisit.

Three more that are easy to get wrong:

- **One follow-up per target, ever.** Not one per run — one, total, for all
  time. Before writing a follow-up, check whether a follow-up draft or a sent
  follow-up already exists for that address. If it does, skip the target
  silently.
- **No invented claims.** No reviews, no testimonials, no photos of work that
  doesn't exist, no "our clients say". If it can't be pointed at, it doesn't
  go in an email.
- **Every commercial email needs three things**: a real postal address, a line
  identifying it as a business solicitation, and a way to opt out. This is the
  same rule that put Smith Digital's outreach on hold (see
  `ops/STEEN-NEXT-STEPS.md`). Follow-ups are commercial email too — a two-line
  "just floating this back up" still needs the footer.

## Gmail is the memory

Every fact the engine needs is already in Gmail. Nothing has to be remembered
between runs, which is why losing the notes was survivable. Rebuild state with
four searches:

| Question | Search |
|---|---|
| Who has been contacted, and when? | `in:sent` restricted to the target addresses |
| Did anyone reply? | `newer_than:8d -in:sent -in:draft` from the target domains |
| Has this target already had its one follow-up? | list drafts filtered to that address, plus the thread's own message count |
| How many fresh targets are still queued? | list drafts, minus anything already sent |

A thread containing exactly one message means: contacted, no reply, no
follow-up sent yet.

## A trap worth writing down

Updating an existing reply-draft through the Gmail tool **destroys its
threading**. The draft comes back with a brand-new conversation id, which
means the recipient would get a bare "just floating this back up" with no
original underneath — the one thing a follow-up cannot survive.

Never edit a reply draft. Delete it and create a new one with the original
message id attached, then confirm the new draft's conversation id matches the
sent message's. If a bad copy can't be deleted, point it at Steen's own
address and retitle it `SUPERSEDED — DO NOT SEND` so a stray click is
harmless.

## Run order

1. Look for replies. Summarize each in plain words; draft a short warm answer
   for each. An auto-responder is not a reply — say so plainly rather than
   reporting interest that isn't there.
2. Find anything sent more than five days ago with no reply and no follow-up
   yet. Write one short follow-up each: two sentences, no pressure, an easy
   "not for us", plus the compliance footer.
3. If fewer than three uncontacted targets remain in Drafts, prepare three
   more from `MARKETING_PLAYBOOK.md` §3.
4. If replies were found, or drafts were written, tell Steen in a few lines
   and say where the drafts are. If genuinely nothing happened, say nothing.

## State as of 2026-09-28

### 🔴 This engine is now half-blind — read this before trusting any count below

Outreach has moved to a **second mailbox, `steen.smithmade@gmail.com`**, and the
connector this engine uses reads only `steenbballsmith@gmail.com`. Discovered
2026-09-28 from a status email that mentioned sends this engine had no record
of: two introductions and one follow-up went out from the new address on
September 22 and are invisible here.

**What that breaks, concretely:**

- "Zero replies" can no longer be asserted. A reply may be sitting in a mailbox
  this engine cannot open.
- The one-follow-up-per-target rule cannot be enforced across both mailboxes.
  One target already had its follow-up sent from the new address while a
  follow-up draft for it sat here; it was caught by reading a status email, not
  by any check this engine runs.
- Every count in this file is now "as seen from one of two mailboxes."

**Until the second mailbox is connected, do not draft a follow-up for any
target whose original send is not visible in this account.** Drafting blind is
how a business gets chased twice, and that is the one mistake this channel
cannot afford in a market where the vendors all know each other.

### Counts, as seen from this mailbox only

- **26** businesses contacted from this account; 10 have follow-up drafts
  waiting, 3 more drafted today, 1 retired as already-followed-up elsewhere.
- **2** further introductions went out from the other mailbox. Not tracked here.
- **0** replies seen — with the caveat above.
- **5** prepared drafts remain unsent.

### The three inbound customers are still the whole story

One quoted order for an October 10 wedding, one for an October 5 school
anniversary, one undated. **Their status has been unconfirmed for weeks**, and
two of the dates are now inside two weeks. The builder handles all three
directly; a structured status request went to him on September 22 and has not
been answered.

An inquiry that arrives and then waits is worth less than one that never
arrived, because the second costs nothing and the first costs a reputation.
Chasing the answer matters more than sending the next introduction.
