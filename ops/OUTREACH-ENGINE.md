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

## State as of 2026-09-14

Counts only — the customer is deliberately not named here.

- **23** businesses contacted in total. The original 6 (contacted 2026-08-05,
  followed up 2026-08-18) are **closed**. Ten more went out 2026-09-11/12 — two
  from the prepared drafts, eight prepared outside this engine.
- **0** replies. Ever. From any of the twenty-three.
- **7** prepared drafts remain unsent.
- **10 follow-ups come due next week.** The September sends are only 2-3 days
  old today, so nothing is due yet. One follow-up per target, forever.

### The order has no visible status, and that outranks everything above

Quote to the builder 2026-08-31, delivery promised Sept 30 - Oct 2 for an
October 10 wedding. Now 26 days out, with no confirmation the quote reached the
customer, that a proof was approved, or that a deposit arrived.

Say this precisely: **absence of visibility, not evidence of absence.** The
builder emails the customer directly and forwards selectively. What is certain
is that two weeks of a five-week schedule passed with nothing observable, and
that the two messages sent into the quote thread on Sept 11 and 12 were about
the website and the new introductions — neither mentioned the customer.

**The engine's own bias, stated plainly:** it is built to count emails sent, so
a week with ten sends and a silent order reads as a good week. It is not one.
One order in hand is worth more than twenty-three introductions, and the
check-in that protects it is worth more than the next batch.
