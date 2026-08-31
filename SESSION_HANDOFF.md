# SMITH MADE — Complete Session Handoff (v2)
**Everything done, everywhere it lives, and everything still open.**
Compiled 2026-07-18. Give this file to any new Claude chat and it knows the whole story.

> **Verified against the repo 2026-07-31 by Claude.** Section 3 and section 7
> item 9 had drifted — eight statements were false, and two of them were
> actively harmful: the checklist told a new agent to redo imagery that was
> already finished, and the technical map said the Lookbook gallery was empty
> and hidden when it holds 14 live images. Corrections are marked inline in
> *(italics)* so the drift stays visible rather than silently overwritten.
>
> **Still unverified from a cloud session**, and not to be assumed: everything
> in section 2 that lives outside this repo — DNS records, the Namecheap email
> forward, Square's account settings, Google Business Profile state, and
> whether FormSubmit was ever activated. Those need someone who can open the
> accounts. Treat section 2 as last known, not as checked.
>
> Whoever reads this next: prices and catalog were checked and are consistent
> (all 8 pieces, JSON-LD offers match the cards). The front end passed a full
> browser QA the same day — see `ops/AGENT_BOARD.md` SM-QA-002.

## 0. PASTE THIS PROMPT IN THE NEW CHAT

```
Read SESSION_HANDOFF.md in the repo steenbballsmith-source/Smith-made
completely before doing anything. It contains the full state of the
Smith Made business launch: what's built, every account, every file,
and the open checklist. Continue from the checklist in Section 7,
working with me one step at a time in plain words — I'm not a
developer. Top priority: finish activating the custom domain
smithmadesc.com (Section 7, item 1) so the website is live on it.
```

## 1. WHO / WHAT

- **Business:** Smith Made — custom wood wedding signage & décor, handbuilt in Greenville, SC. Serves the Upstate: Greenville, Travelers Rest, Greer, Simpsonville, Easley, Taylors, Spartanburg, Anderson, Clemson, Pickens, Hendersonville NC, Asheville NC.
- **People:** Steen Smith (owner/carpenter). William runs the accounts in chat; business inbox is **will.smithmade@gmail.com**.
- **Model:** primarily a RENTAL company — rent for the weekend, custom pieces built to order by quote. Rent-to-own is dead: removed from every public material 2026-07-22 per Will, do not reintroduce. 50% deposit books the date and holds the pieces, non-refundable inside 60 days. Wording approved in writing + free proof before anything is made. Refundable damage deposit $100 or 25% on rentals. **Transport policy updated 2026-08-30:** customer pickup and return has no transport fee; delivery starts at $75 within 15 road miles; standard pickup starts at $75 within 15 road miles; beyond 15 road miles add $2.25 per additional one-way venue mile per service trip and round each trip to the nearest $5; pickup after 9 p.m. adds $75 and pickup at/after midnight adds $125 instead; oversize/two-person handling, stairs, setup, strict windows, and venues over 50 miles are custom quoted. Do not expose a private address; share the exact handoff point only after booking. Styling/setup is not included unless separately quoted. Balance due at delivery, invoiced via Square. **$50 date hold** payable on the website, credited to balance, refundable 7 days.

## 2. LIVE INFRASTRUCTURE — WHERE EVERYTHING IS

| Thing | Where | State |
|---|---|---|
| Domain **smithmadesc.com** | Namecheap (William's account) | Purchased ✓, privacy on, auto-renew on |
| DNS records | Namecheap → Domain List → smithmadesc.com → Advanced DNS | SAVED ✓: 4 A records `@` → 185.199.108.153 / .109.153 / .110.153 / .111.153 + CNAME `www` → `steenbballsmith-source.github.io` + Namecheap email-forwarding MX rows |
| Email **william@smithmadesc.com** | Namecheap Redirect Email | Forwards → will.smithmade@gmail.com ✓ |
| Website code | GitHub repo **steenbballsmith-source/Smith-made** (public) | GitHub account owner email: steenbballsmith@gmail.com |
| Hosting | GitHub Pages, source = **GitHub Actions**; workflow `.github/workflows/deploy-pages.yml` auto-deploys every push to `main` | Working ✓; deploys take ~20 s; latest = run #11 green on commit 38bdde2 |
| Site address | **https://smithmadesc.com** (bound via `CNAME` file in repo root) | Deployed ✓; old address steenbballsmith-source.github.io/Smith-made auto-redirects |
| ⚠ Domain activation | Repo → Settings → Pages | **OPEN:** wait for green DNS check, then tick **Enforce HTTPS** (cert can take ~1 h). William had not yet confirmed this at session end. |
| Payments | Square (account created under steenbballsmith@gmail.com; bank linked) | Payment link **"Smith Made — Date Hold" $50: https://square.link/u/w6KAdXlo** — live on site ✓. Deposits/balances sent manually as Square invoices. ⚠ OPEN: switch Square account email to will.smithmade@gmail.com (Settings → Account → Email) — unconfirmed. |
| Inquiry form delivery | FormSubmit → will.smithmade@gmail.com (endpoint in `js/manifest.js`) | ⚠ OPEN: **one-time Activate click unconfirmed.** First form submission emails a FormSubmit confirmation to will.smithmade@gmail.com — the blue Activate button must be clicked once or inquiries are held. |
| Google Business Profile | Created under will.smithmade@gmail.com | Verification pending (video, up to 5 days from ~2026-07-17). ⚠ OPEN: finish photos/services/first post; update website field to https://smithmadesc.com. Full field-by-field package: MARKETING_PLAYBOOK.md §1. |
| Venue outreach drafts | Gmail **Drafts of steenbballsmith@gmail.com** (the old inbox) | 3 written drafts: Riverain Farm, The Barn at Sitton Hill Farm, The Hollow at Paris Mountain. ⚠ OPEN: copy text into will.smithmade@gmail.com, fix signature email line, paste each venue's address from its website, send. |

## 3. WEBSITE — TECHNICAL MAP (plain HTML/CSS/JS, no build step)

- `index.html` — everything: hero (with photo + price line), values, 8-card catalog + filter chips, how-it-works, pricing & policies + pickup-savings callout, Lookbook (14 captioned renders) + custom invitation, hidden Couples/reviews section, FAQ, inquiry form + $50-hold callout, footer, phone action bar. SEO title "Custom Wood Wedding Signs Greenville SC — Rent or Buy | Smith Made", LocalBusiness JSON-LD, OG tags → https://smithmadesc.com.
- `css/styles.css` — brand tokens (handoff §3): linen `#F5F0E8`/`#EDE6D9`/card `#FAF7F1`, walnut `#6B4A2B` hover `#57381E`, ink `#3B2C1C`, soft ink `#6D5B45`, gold `#B08D57`, hairline `#DCD2C2`. Fonts: **Cormorant Garamond** (display/body) + **Great Vibes** (script) + **Jost** (UI), **self-hosted** as `assets/fonts/*.woff2` — no Google Fonts request at runtime. *(Corrected 2026-07-31: this line previously said Italiana + Lora via Google Fonts. Both the typefaces and the delivery method had changed.)* Includes `[hidden]{display:none!important}` (fixes filter chips — don't remove). Hover system: card lift + photo zoom, nav underline, table-row + FAQ highlights, reduced-motion respected.
- `js/manifest.js` — **the only file the owner edits**. Values verified against the file 2026-07-31: `heroVideo` empty · `heroPoster` = `assets/img/hero-staged.jpg` · `photos{}` **empty** (the catalog images are baked into `index.html`; this block only *overrides* them, so empty is correct and expected) · `gallery[]` **14 entries — the Lookbook is live, not hidden** · `dateHoldUrl` = the Square link · `formEndpoint` = `https://formsubmit.co/ajax/will.smithmade@gmail.com` · `email` = will.smithmade@gmail.com · `phone` = **(541) 570-5570 (set)** · `instagram` empty. *(Corrected 2026-07-31: this line previously said heroPoster was hero-poster.jpg, photos had 4 set, the gallery was empty and its section hidden, and phone was blank. All four were wrong.)*
- `js/main.js` — nav toggle, hero video probe + graceful fallback (reduced-motion/data-saver aware), catalog photo preload-then-swap, chips filter, per-piece **Book** buttons (prefill form + scroll), hold-callout wiring. `js/form.js` — posts FormData + `_subject`/`_template=table` to endpoint, honeypot field `company` silently drops bots, mailto fallback if endpoint empty.
- `assets/img/catalog/` — **all eight pieces now have photoreal `.jpg` renders plus `.webp` versions**; the original concept `.svg` files are retained alongside them but are no longer what the cards display. Hero poster is `assets/img/hero-staged.jpg`. Social image is `assets/img/og-image.jpg` (1200×630). *(Corrected 2026-07-31: this line previously named only four pieces as photoreal and described the rest as concept SVGs, and gave the OG image as `.png`. Verified on disk — every slug has a `.jpg`.)*
- `CNAME` = `smithmadesc.com` · `robots.txt` + `sitemap.xml` → smithmadesc.com · `favicon.svg` SM monogram.
- Git flow used: branch `claude/smith-made-website-rnm7no` → PR → merge to `main` → auto-deploy. PRs #1–#9 all merged.

## 4. CATALOG + PRICES (launch column; on the cards in index.html)

01 The Arched Welcome (arched-welcome) · 02 Seating Chart Wall (seating-chart-wall) · 03 Champagne Wall (champagne-wall) · 04 Grand Arch Welcome Wall (grand-arch-welcome-wall) · 05 Ceremony Arch Set (ceremony-arch-set) · 06 Slat Monogram Backdrop (slat-backdrop) · 07 The Mobile Bar (mobile-bar) · 08 The Keepsake Heart · 09 The Display Wall. Current public site is quote-first; do not restore retired item prices from this historical handoff without current owner approval. 2026-08-30 transport policy supersedes the old flat-fee rule: customer pickup/return $0 transport; delivery from $75 and standard pickup from $75 within 15 road miles; distance and after-hours charges as recorded in §1. Personalisation goes on a SEPARATE engraved plaque — never cut into a rental. Premium pricing tier unlocks only after owner review. Never quote below the approved margin guardrail.

## 5. DOCS IN THE REPO (all merged to main)

- **OWNERS-GUIDE.md** — 11 plain-words parts: how GitHub works, hosting, publishing, photos (slugs table for the 6 remaining renders on Steen's PC in `Downloads\Smith Made\web`), hero video (≤25 MB MP4), gallery, form activation, phone/Instagram, price edits, custom domain, Square payments (account → bank → link → invoices).
- **MARKETING_PLAYBOOK.md** — §1 complete GBP package (fields/description/services/3 posts/review-ask text), §2 two ready-to-paste Facebook Marketplace listings + scam rules (local + in person + invoice paid; overpayment/"my mover" = scam), §3 founder offer (~20% off first venue-referred booking for photos+review) + 14-venue and 10-planner researched lead lists + email templates, §4 social cadence, §5 Etsy (keepsakes only, month 2), §6 paid-ads policy (skip The Knot/WeddingWire at launch), §7 30-day calendar, §8 success metrics.
- **SOCIAL_KIT.md** — @smithmadesc bios (IG/TikTok/Pinterest), 9 launch posts with captions + 2 hashtag sets, 3 vertical build-video scripts (Part 1 / Part 2 / Reveal), Pinterest boards, boosted-Reel recipe (only after real photos: $5–10/day, Engaged, 25 mi, judge by inquiries).
- Original **SMITHMADE_HANDOFF.md** (business plan source) was a chat upload — not in repo; its catalog/brand/policy content is fully reflected above.

## 6. GOTCHAS THE NEXT SESSION SHOULD KNOW

- The Claude cloud sandbox **cannot reach** smithmadesc.com / github.io / fonts.googleapis.com (proxy blocks) — verify deploys via GitHub Actions run status and ask William to check in his browser. Local QA: serve repo with `python3 -m http.server` + Playwright (chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`); a 14-check audit pattern exists (chips subsets, book prefill, hold link, form validation + mocked FormSubmit success, honeypot, mailtos, anchors, hover, FAQ, images).
- `steenbballsmith-source` strings in URLs are the **GitHub username**, not an email — never "fix" them. Zero references to steenbballsmith@gmail.com remain in repo by design (Square + GitHub accounts still use it externally).
- The github MCP server is the only GitHub access (no `gh` CLI). Repo work: recreate branch `claude/smith-made-website-rnm7no` from origin/main, push force-with-lease, PR, merge.
- FormSubmit first-submission activation is the #1 silent failure risk. Square payment notifications currently go to steenbballsmith@gmail.com until the email swap.

## 7. THE OPEN CHECKLIST (in priority order)

1. **Activate the domain (William's current goal).** All config is DONE (DNS saved, CNAME deployed, site published). Remaining: repo → **Settings → Pages** → wait for the DNS check on smithmadesc.com to turn green → tick **☑ Enforce HTTPS** (may take up to 1 h to become clickable — certificate minting). Then verify https://smithmadesc.com loads and a test email to william@smithmadesc.com arrives. Troubleshooting if DNS check stays red >1 h: re-open Namecheap Advanced DNS and confirm the 5 records match §2 exactly (no typos, no extra URL-redirect rows); in Pages settings, remove the custom domain and re-add it to re-trigger the check.
2. **FormSubmit Activate click** (test inquiry → will.smithmade@gmail.com inbox → blue button).
3. **Square email swap** to will.smithmade@gmail.com.
4. **GBP finish:** photos (all renders), services w/ prices, first post; **website field → https://smithmadesc.com**; await video verification (~5 days); then start weekly posts + review engine (playbook §1).
5. **Send 3 venue emails** from will.smithmade@gmail.com (drafts in old Gmail).
6. **Post 2 Marketplace listings** (playbook §2); renew weekly.
7. **Create @smithmadesc socials**, paste bios, run the 9-post sequence (SOCIAL_KIT.md).
8. **Build the flagship arch + film the 3 scripts** — unlocks real photos everywhere and the first $70 boosted-Reel ad test.
9. ~~Replace the 6 concept-SVG pieces with photoreal renders~~ — **DONE, verified 2026-07-31.** All eight catalog slugs have `.jpg` + `.webp` renders on disk and the cards display them. Do not redo this; treating it as open risks replacing good imagery. Also done: the 14-image Lookbook gallery is live. **Still genuinely open:** `hero.mp4` (heroVideo is empty), Instagram link (empty), Etsy keepsakes, premium pricing at 15–20 reviews.
