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

## State as of 2026-09-21

Counts only; customers are deliberately not named here.

- **23** businesses contacted. The first 6 are closed. Ten sent 2026-09-11/12
  now have their one permitted follow-up drafted and waiting.
- **0** replies. Ever. From any of the twenty-three.
- **5** prepared drafts remain genuinely unsent.
- **3** inbound inquiries: one quoted order and two live, arrived this week.

### Read the draft before you trust its address

Eight drafts addressed to this week's follow-up targets *looked* like pending
follow-ups. They were `DO NOT SEND` tombstones marking superseded intros.
Sending them would have delivered ten duplicates to ten businesses.

Two more prepared drafts aimed at venues that had already received a *different*
introduction days earlier — a second intro, not a follow-up.

**The rule:** a draft's recipient tells you who it would reach, never what it
would say or whether it should exist. Open it.

### What is actually working

| Channel | Result |
|---|---|
| Cold email — 23 businesses, three rounds | **0 replies** |
| Website form / shop address | **3 inquiries, 1 quoted order, 2 live** |

**Two of three inbound inquiries carried `utm_source: chatgpt.com`.** People are
finding Smith Made by asking an AI assistant. The newer form fields — event
type, transport, planning role — arrive populated and make the first reply
sharper.

This engine counts emails sent, so it will keep reporting busy weeks. The
scoreboard above is the honest measure, and it has pointed the same direction
for seven weeks.
