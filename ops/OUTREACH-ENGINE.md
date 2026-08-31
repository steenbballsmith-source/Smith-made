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

## State as of 2026-08-31

Counts only — names live in Gmail, and the customer below is deliberately not
named here.

- **6** targets contacted (2026-08-05) and followed up (2026-08-18). All six
  are **closed** — two touches and we stop. Zero replies, ever.
- **9** fresh targets drafted, accurate, and still **unsent**. Nothing has
  gone out since 2026-08-18, so no follow-ups are due and no new targets are
  needed. The engine had nothing to do this week.
- **13** drafts remain defused as `SUPERSEDED — DO NOT SEND`, re-addressed to
  Steen's own mailbox.

### The thing that actually matters this week

**Outreach produced nothing. An inbound inquiry produced a live order.**

A couple found Smith Made on their own, asked for a seating-chart piece for an
October wedding, and have now moved from questions to "quote me three build
options." Will has been handling it directly and forwarded it to Steen for
help pricing. That thread is worth more than all fifteen outreach emails
combined, and it arrived without any of them.

Worth remembering when judging this channel: two rounds of cold email to
fifteen businesses have produced zero replies. One inbound inquiry produced a
real customer with a date and a budget. The engine is cheap to keep running,
but it is not what is working.

### A correction the engine should learn from

Steen's first round of coaching to Will was written while the customer was
still considering a rental, and most of it was about protecting a rental
surface from glue and pinholes. She then moved toward buying. On a purchase
that advice is not just unnecessary, it is wrong — a buyer can do whatever she
likes to her own sign, and telling her otherwise reads as fussy.

Advice written for one scenario goes stale the moment the customer changes
direction, exactly the way the July drafts went stale against the site. Re-read
your own prior advice before repeating it.
