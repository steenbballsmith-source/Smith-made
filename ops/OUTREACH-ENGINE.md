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

## State as of 2026-10-12 — eleven weeks in, an honest accounting

### What the record actually shows

| Channel | Attempts | Result |
|---|---|---|
| Cold email | 26+ businesses, four rounds | **0 replies. Not one, ever.** |
| Website form / shop address | 3 inquiries | 1 lost to slow reply, 1 silent after qualifying, 1 outcome unknown |

Two of the three inbound inquiries arrived with `utm_source: chatgpt.com`.

### The loss that should settle the argument

The October 5 inquiry came in on September 18. The reply went out on September
28 — ten days later. The answer came back in **sixty-nine minutes**:

> "We have moved forward with other options."

She was a local school's admissions director, planning a fortieth anniversary.
She did not go elsewhere because of price, product, or portfolio. She went
elsewhere because nobody answered for ten days. That is the only confirmed,
attributable loss in eleven weeks of this engine's records, and response time
caused it.

### The drafts are not being used

Thirteen follow-up drafts have sat unsent for two to three weeks. Every one was
written, threaded, and compliance-footed; none has been sent. Four escalation
drafts to the builder sit beside them, also unsent — though the two customer
replies they argued for *were* sent, so the substance landed even when the draft
did not.

An engine whose output nobody uses is not a quiet engine. It is a stopped one
that still files reports.

### The recommendation

**Stop spending the weekly cycle on cold outreach.** Eleven weeks and 26
businesses have produced nothing, and the evidence that it is the wrong channel
is no longer ambiguous.

Point the same weekly cycle at the two things that demonstrably matter:

1. **Response time on inbound inquiries.** Every real lead has come through the
   website. One was lost, in writing, to a ten-day reply. A check that fires
   when an inquiry is more than 24 hours old would have saved it.
2. **Five real photographs.** The folder has been empty for eight weeks. Every
   quote still says some version of "once our first display piece is ready."

That is the owner's call, not this engine's. But it should be made with the
table above in front of him rather than another week of draft counts.

### Standing blind spots, unchanged

Outreach is also sent from `steen.smithmade@gmail.com`, which this connector
cannot read; a third address, `steen.smithdigital@gmail.com`, now generates
heavy automated traffic. Counts here remain "as seen from one mailbox of
several," and no follow-up should be drafted for a send this engine cannot see.
