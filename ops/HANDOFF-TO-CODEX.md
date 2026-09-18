# Current handoff

**Written 2026-09-18 by cloud Claude.** This file is an inbox, not an archive.
History lives in `LOG.md`.

---

# 1. Steen — read this part first

You asked me to find you somewhere local that needs a website, and a way to make
$1,000 fast. Both are done. **The list of actual businesses is on a private page,
not in this repo** — this repository is public on GitHub, and your own rules say
prospect lists don't go in it.

**Your list is here:** https://claude.ai/artifact/4ezV3RgM1u8KYAL6APabae

It opens on your phone. It has the businesses, what's wrong with each one, what
to charge, and the exact words to say. Keep the link to yourself.

## The short version

**The fastest $1,000 is two customers at $500, taken half up front.** Not one big
project, not a monthly retainer. Two people say yes, you invoice $250 each on the
spot through Square, and **$500 is in your account before you've built anything.**
The other $500 lands when you deliver a few days later.

What you're selling, in one sentence: *"A one-page website, live in five days,
five hundred dollars. Half now, half when it's live. You own the domain."*

## Three things I found that you should know

**1. "You don't have a website" barely works here any more.** I checked four
local businesses that looked like they had nothing. **Two had good websites** —
one with online ordering, one with online booking. So don't lead with that.
Lead with businesses that registered in the last few months: no site, no Google
listing, startup money, and nobody else calling them yet. Linn County registered
**452 new businesses in 120 days.** That list is free and public, and the page
above tells you exactly where to look.

**2. The best single target I found is a Lebanon landscaping and handyman
outfit** that does everything right except the website — before-and-after photos,
licensed and insured, free estimates — and their entire website is a **free
Google Sites page** with a personal iCloud email on it. They already care how
they look. You're agreeing with them, not selling them.

**3. Your own website is what's slowing the money down.** Every button on
smithdigitalco.com says "Get my free 15-minute audit," and the pricing page says
"Quoted after audit." That's a good way to sell a $4,000 project and a bad way
to collect $1,000 this week — it puts an audit, a scope and a quote between you
and the cash. For this week, say the $500 number out loud on the phone and at
the door.

## Two things to be careful about — these are real

**Check with your callers before you dial anyone.** Two other people are already
ringing businesses for Smith Digital — roughly forty to fifty of them, off
separate private lists that don't talk to each other. If you cold-call someone
one of them already called, you're the company that rang twice. That's worse
than not calling. Sort this out before your first wave.

**Don't send marketing emails yet.** Smith Digital's outbound email is on hold
until the messages carry a real postal address and an opt-out line
(`SD-COMPLIANCE-001`). Phone, knocking on doors and texting are all fine — and
in person closes better anyway.

## One small thing on your own site

Your homepage says **"9 Services, listed in full with what each one costs."**
I checked today: the services page lists **ten** services and **no prices**, and
the pricing page says "Quoted after audit." So the site promises prices it
doesn't show. Worth fixing — it's the kind of thing a careful customer notices,
and your own rules say not to publish claims that aren't true.

---

# 2. Codex — asks that need the Windows machine

## SD-REVENUE-002 — Put one fixed price on smithdigitalco.com

Cloud Claude cannot deploy that site. You hold the files; this is yours.

**The problem:** every conversion path on the live site is "free 15-minute
audit" → written scope → quote. There is no way for a small local buyer to see
a price and commit. That is the constraint on near-term revenue.

**The ask:** one offer block, above the fold on the homepage and on
`/services/websites/`, reading approximately:

> **The One-Page Local Site — $500.** Live in five days. Half to start, half
> when it goes live. Your services written out plainly, your own photos, a phone
> button that works, and a contact form that reaches your inbox. You own the
> domain and every account.

Keep the free-audit path as the secondary action for larger work. Do not remove
it.

**Also fix the false claim** described in §1: the homepage stat block advertises
per-service costs that no page publishes. Either publish the prices or change
the wording. Verified 2026-09-18 by extracting `/services/` with a
JavaScript-rendering driver, so this is the rendered DOM, not a static-fetch
artifact — ten services, no prices, and `/pricing` says "Quoted after audit."

**Before you deploy:** the publish itself no longer needs a second confirmation
(`AUTHORIZATION.md` §1B), but Steen still starts it, and a price on a public
page is a commercial commitment — get the $500 figure from him in his own words
first. Verify the live URL after publishing and record the deploy ID.

## SD-REVENUE-003 — One shared call list with a do-not-contact column

`OPS-CALLERS-001` has been open since 1 August. Three people will now be
contacting local businesses for Smith Digital — two callers and Steen himself —
off lists that do not join up. A business that tells one of them to stop is
still live on the other two lists.

A Google Sheet is enough. One list, one row per business, a column for who
contacted them and when, and a do-not-contact flag everyone can see. The
platform does not matter; **one list instead of three** is the whole
requirement.

This is worth doing before Steen's first wave, not after.

## SD-REVENUE-004 — Optional: a reusable one-page template

If Steen sells two of these, he will build the same thing twice. A single
plain-HTML template — hero, services, gallery, hours and service area, contact
form, phone button — that takes a business name, photos and copy would cut each
build to an afternoon.

**Do not put it in the Smith-made repo.** That repository's deploy workflow
rsyncs everything except `.git`, `.github`, `*.md`, `node_modules`, `tests` and
`package*.json` — so **any non-Markdown file added anywhere in it publishes to
smithmadesc.com.** That is why this work committed Markdown only. Keep the
template with the Smith Digital files.

---

# 3. Still open on Smith Made — unchanged, do not drop

These carried over from the 11 September handoff. Nothing in this pass touched
them.

1. **Review the live site on a phone and tablet** — menu, sticky email button,
   long labels, inquiry form. Only desktop rendering was ever verified.
2. **Have the inbox owner confirm receipt** of the already-submitted
   `INTERNAL TEST - SM-GROWTH-002` — fields, spam placement, reply behaviour.
   Do not duplicate the submission. Service acceptance is not inbox delivery.
3. **Connect the actual Smith Made CRM location**, map the prepared fields and
   pipeline, test workflows while disabled. The CRM specification is still an
   inactive design.
4. **Verify Search Console and business-profile ownership** before any account
   edits, then submit `https://smithmadesc.com/sitemap.xml`. Do not promise
   ranking.
5. **Add measured dimensions, rentable quantities, included items and real shop
   photographs.** Confirm deposit basis and the damage-deposit rule with the
   owners before publishing new policy wording.
6. **`SM-PHONE-001`** — Smith Made publishes a 541 (Oregon) number on a
   Greenville SC business, one digit from Steen's Smith Digital line. Thirty
   seconds on the phone settles whether it is a retained number or a typo.

The pending cinematic branch `codex/higgsfield-motion-20260911` is still a review
candidate; see `HIGGSFIELD-MOTION-20260911.md`. The live baseline remains PR #39,
commit `d7c7b202f99226e1df08006f876b030d00cbbe8a`.

For inquiry changes run `npm ci --ignore-scripts --no-audit --no-fund` then
`npm test`. Tests never submit a real inquiry.

---

# 4. What this pass did not do

No call, email, message or form submission was made to anyone. Nothing was
deployed. Every prospect contact is Steen's.

Two tools were tried and discarded rather than trusted: `WebFetch` is blocked
from this container for ordinary business domains, and `dig` returns no A record
for **every** domain here including known-live controls — so no "that domain is
dead" conclusion can be drawn from DNS in this environment. All verification ran
through server-side fetching, and every claim on the private page says how it
was checked. Full method: `LOG.md` `2026-09-18-C1`.
