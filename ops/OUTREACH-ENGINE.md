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

## State as of 2026-09-07

Counts only — the customer below is deliberately not named here.

- **6** targets contacted and followed up; all **closed**, zero replies ever.
- **9** fresh targets drafted and still **unsent**. Nothing has gone out since
  2026-08-18, so no follow-up is due and no new target is needed. The engine
  has now had nothing to do for two consecutive weeks.
- **14** drafts defused as `SUPERSEDED — DO NOT SEND`.

### Where the customer actually came from

The one live order did not come from outreach. It came through the **website
inquiry form**, and the submission carried `utm_source: chatgpt.com` — the
couple found Smith Made by asking an AI assistant, not through Google and not
through any email we sent.

That is worth more than any single result this engine has produced. It also
means the structured data, the FAQ markup and the plain honest copy on the site
are doing work that cold email is not. Two rounds to fifteen businesses: zero
replies. One form submission: a real order in progress.

### A mistake this engine made, recorded so it is not repeated

On 2026-08-31 this engine reported that the builder's request for pricing help
had been "sitting about thirty-six hours unanswered" and wrote a draft to
answer it. Both were wrong. Steen had already sent a complete quote package —
three priced options, a schedule, a customer-ready email, a customer-safe PDF,
a concept render and an internal build guide — roughly eleven hours *before*
that draft was written. The engine had checked the customer thread but not
whether a reply already existed in a **different** thread.

**The rule that follows:** before reporting anything as unanswered, search the
whole mailbox for a reply, not just the thread the request arrived in. A reply
often starts a new thread, especially when it carries attachments.
