# Current handoff

**Written 2026-09-18 by cloud Claude, and corrected the same day.** This file is
an inbox, not an archive. History lives in `LOG.md`.

---

# 1. Steen — read this part first

You asked what digital services you can sell, using AI, to make money fast while
you're in Fort Myers.

**Your page:** https://claude.ai/artifact/FSetbfo3shZwawTsNaqu5b

It opens on your phone. Service menu with real prices, why the rental owners are
the opening, two verified leads, what to say, and the week. Keep the link to
yourself.

**The earlier Oregon page is withdrawn** — I researched the wrong state before
you corrected me. Ignore it; this one replaces it.

## The short version

**Sell direct-booking pages to vacation rental owners, $600–900, half up front.**

Fort Myers Beach has about **1,127 short-term rental units, up 71% in a year**,
and roughly **40% are run by the owner** rather than a management company. That's
around 450 people who decide for themselves, have money, and are up against a
booking deadline. Snowbird season arrivals are happening now, and listings that
aren't sorted by December miss the bookings that carry their whole year.

The pitch is their arithmetic, not yours: *every booking through Airbnb costs
them about 15%. On a $60,000 property, moving a quarter of bookings direct keeps
roughly $2,300 a year. Your page costs $800 once.* The cheapest agency
alternative in that market starts at $1,000 **a month** — that gap is your whole
opportunity.

## Two things you should know before you start

**One. Fort Myers is nothing like the market I first looked at.** I checked about
thirty local businesses — home watch, fishing charters, pool, lawn, pressure
washing — and nearly all of them already have working websites, several with
online booking and published pricing. **"You need a website" will not open a
door here.** What works is pointing at something specific and broken on the site
they already have, or selling the rental owners something they don't have at all.

**Two. I nearly handed you a false opening line.** One home watch company looked,
in a search snippet, like it had placeholder contact details on its live site —
a fake phone number, a fake email. I loaded the real page before writing it down
and it was completely clean. If I hadn't checked, you'd have walked in and told
a business owner something untrue about his own website. **Load any page
yourself before you use it as an opener.**

## What only you can do

**Reconnect GoHighLevel — two minutes, and it unlocks your only monthly income.**
I tested the connection today and it returns a 401, which means the saved login
is rejected. Until that's fixed you cannot set up missed-call text-back, CRM
follow-up or review automation for a paying client — so don't sell those. It's
also the one service on the menu that pays you every month instead of once. This
also settles the open question in `OPS-CALLERS-001`, which had been sitting on
"the trial may never have activated."

**Still no marketing emails.** Outbound email stays on hold until the messages
carry a real postal address and an opt-out line (`SD-COMPLIANCE-001`). Phone,
walking in, and replying through someone's own rental listing are all fine.

**Check the caller lists before you dial anything back home.** Two other people
are contacting roughly forty to fifty businesses for Smith Digital off separate
lists that don't join up. Those are Oregon-area leads, so Fort Myers should be
clear — but there is still no single shared do-not-contact list, and that is the
thing that will eventually produce a complaint.

## One small thing on your own site

Your homepage says **"9 Services, listed in full with what each one costs."** I
checked with a full browser render: the services page lists **ten** services and
**no prices**, and `/pricing` says "Quoted after audit." The site promises prices
it doesn't show. Worth fixing either way — publish the prices or change the line.

---

# 2. Codex — asks that need the Windows machine

## SD-REVENUE-002 — Put one fixed price on smithdigitalco.com

Cloud Claude cannot deploy that site. You hold the files.

Every conversion path on the live site is "free 15-minute audit" → written scope
→ quote. There's no way for a small local buyer to see a price and commit, and
that is the constraint on near-term revenue.

Add one offer block, above the fold on the homepage and on `/services/websites/`:

> **The One-Page Local Site — $500.** Live in five days. Half to start, half when
> it goes live. Your services written out plainly, your own photos, a phone
> button that works, and a contact form that reaches your inbox. You own the
> domain and every account.

$500 for a mobile-first lead-capture page in about 48 hours is a **published 2026
market rate**, not an invented number. Keep the free-audit path as the secondary
action for larger work.

**Also fix the false claim** in §1 — ten services, no prices, against a homepage
that advertises per-service costs.

**Before deploying:** publishing no longer needs a second confirmation
(`AUTHORIZATION.md` §1B), but Steen still starts it, and a price on a public page
is a commercial commitment — get the $500 from him in his own words first. Verify
the live URL afterwards and record the deploy ID.

## SD-REVENUE-003 — Reconnect GoHighLevel, then one shared call list

The connection is dead (401). Steen has to do the reconnect himself — it's a
credential action, off-limits to both agents.

Once it works, `OPS-CALLERS-001` is still open and now two months old: three
people will be contacting businesses for Smith Digital off lists that don't join
up. A business that tells one of them to stop stays live on the other two lists.
**One list with a do-not-contact column, visible to everyone.** A Google Sheet is
enough; the platform is irrelevant.

## SD-REVENUE-004 — A reusable direct-booking page template

If Steen sells two of these he'll build the same thing twice. A plain-HTML
template — hero, photos, rates table, availability, enquiry form, house rules,
and a slot for the rental registration number — would cut each build to an
afternoon.

**Put the registration number field in by default.** Fort Myers Beach requires
every short-term rental to be registered at $300 a unit and to display its
registration number in all advertising, and the town started issuing violation
notices to unregistered rentals in late 2025. Cape Coral brought in a $350/year
registration this January. Asking for it also makes Steen sound local.

**Do not put the template in the Smith-made repo.** That deploy workflow rsyncs
everything except `.git`, `.github`, `*.md`, `node_modules`, `tests` and
`package*.json`, so **any non-Markdown file added anywhere in it publishes to
smithmadesc.com.** That's why this work is Markdown only. Keep it with the Smith
Digital files.

---

# 3. Still open on Smith Made — unchanged, do not drop

Carried over from 11 September. Nothing in this pass touched them.

1. **Review the live site on a phone and tablet** — menu, sticky email button,
   long labels, inquiry form. Only desktop rendering was ever verified.
2. **Have the inbox owner confirm receipt** of the already-submitted
   `INTERNAL TEST - SM-GROWTH-002`. Do not duplicate it. Service acceptance is
   not inbox delivery.
3. **Connect the actual Smith Made CRM location**, map the fields and pipeline,
   test workflows while disabled. Note the GoHighLevel 401 above may be the same
   blocker.
4. **Verify Search Console and business-profile ownership** before any account
   edits, then submit `https://smithmadesc.com/sitemap.xml`. Do not promise rank.
5. **Add measured dimensions, rentable quantities, included items and real shop
   photographs.** Confirm deposit and damage-deposit rules with the owners before
   publishing new policy wording.
6. **`SM-PHONE-001`** — still worth one phone call. But note the correction on
   the board: that entry's claim about where Steen lives is an inference from an
   area code and is wrong. Do not reuse it.

Pending cinematic branch `codex/higgsfield-motion-20260911` is still a review
candidate. Live baseline remains PR #39, commit
`d7c7b202f99226e1df08006f876b030d00cbbe8a`. For inquiry changes run
`npm ci --ignore-scripts --no-audit --no-fund` then `npm test`.

---

# 4. What this pass did not do

No call, email, message, listing enquiry or form submission was made to anyone.
Nothing was deployed. Every prospect contact is Steen's.

Tools discarded rather than trusted: `WebFetch` is egress-blocked here, and `dig`
returns no A record for **every** domain including known-live controls, so no
"that domain is dead" conclusion can come from DNS in this environment. One lead
was killed by re-rendering a page that a search snippet had misrepresented.
Method and evidence: `LOG.md` `2026-09-18-C2`, correcting `2026-09-18-C1`.
