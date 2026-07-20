# Smith Made website — the complete owner's guide

Everything you will ever need to do with this website, step by step, in
plain words. No coding knowledge needed — every step happens in a web
browser on **github.com**, and nothing here can permanently break the
site (every change is saved with history, so anything can be undone).

---

## Part 1 — The big picture: what you have

Five ideas, one minute, and everything else in this guide will make sense:

1. **The repository ("repo").** Your website is a folder of files stored
   at github.com — that folder is called a repository. Yours is at
   `github.com/steenbballsmith-source/Smith-made`. Think of it as the
   master copy of the site, with a full saved history of every change.

2. **The main branch.** The repo's official, current version is called
   `main`. When files change on `main`, that's the real site changing.

3. **The robot publisher.** A helper called *GitHub Actions* watches the
   repo. Every time anything changes on `main`, it automatically copies
   the site to your live web address within about a minute. You never
   "upload the site" anywhere — you change files, and the robot publishes.

4. **The live address.** Once hosting is on (Part 2), your site is at:
   **https://smithmadesc.com/**

5. **The one settings file.** `js/manifest.js` controls your photos,
   video, gallery, contact details, and inquiry form. Almost every
   recipe below is: *put a file in a folder, change one line in
   `js/manifest.js`.* Instructions are written inside the file too.

**Two skills you'll reuse constantly** (both explained fully the first
time they appear below):

- **Uploading a file**: open a folder in the repo → **Add file** →
  **Upload files** → drag the file in → **Commit changes**.
- **Editing a file**: open the file in the repo → click the **pencil**
  icon (top right of the file) → make the change → **Commit changes**.

"Commit" is GitHub's word for *save with a note attached*. Every commit
to `main` republishes the site automatically.

---

## Part 2 — Turn on hosting (one time, do this first)

GitHub hosts websites for free **only from public repositories**. Your
repo started private, so this is the one switch to flip. It's safe:
the repo contains only the website files themselves — the exact same
files every visitor's browser downloads when they view any website.
There are no passwords or private records in it.

1. Go to `github.com` and sign in.
2. Open your repository: `github.com/steenbballsmith-source/Smith-made`.
3. Click **Settings** (the gear tab across the top of the repo).
4. Scroll to the very bottom, to the red-outlined **Danger Zone**.
5. Click **Change visibility** → **Change to public**.
6. GitHub asks you to confirm by typing the repository name — type
   `steenbballsmith-source/Smith-made` and confirm. (The scary warnings
   are aimed at companies with secret code. You're publishing a website;
   public is the point.)

That's it. The next Part makes the site appear.

## Part 3 — Publish and see your site

The robot publisher tried to run once already and stopped because the
repo was private. Give it one manual push (or, if Claude is watching the
repo, this happens for you automatically within a few minutes):

1. In the repo, click the **Actions** tab (top of the page). This is the
   robot's logbook — one row per publishing run.
2. In the left sidebar, click **Deploy site to GitHub Pages**.
3. Click the **Run workflow** button (right side), leave the branch as
   `main`, and press the green **Run workflow**.
4. Watch the new row: a spinning amber circle means working, a **green
   check** means published, a **red X** means something failed (see
   "If something goes wrong" at the end).
5. When it's green, open **https://smithmadesc.com/**
   — your site is live. Check it on your phone too.

From now on you never repeat this Part — every future change publishes
itself.

## Part 4 — Put your renders on the product cards

Four pieces already show your photoreal renders — **Seating Chart Wall
(02), Champagne Wall (04), Grand Arch Welcome Wall (07), and Ceremony
Arch Set (08)** — and the hero backdrop is a styled crop of the wall
render. The other six show original Smith Made concept drawings until
you replace them with photoreal renders or real photos.

**4a. Rename copies on your PC** to these exact names (keep `.jpg` or
`.png`, whichever the file already is):

| Piece on the site | Name the file |
| --- | --- |
| No. 01 The Arched Welcome | `arched-welcome.jpg` |
| No. 02 Seating Chart Wall | `seating-chart-wall.jpg` |
| No. 03 The Family Round | `family-round.jpg` |
| No. 04 Champagne Wall | `champagne-wall.jpg` |
| No. 05 Unplugged Ceremony | `unplugged-ceremony.jpg` |
| No. 06 The Bar Menu | `bar-menu.jpg` |
| No. 07 Grand Arch Welcome Wall | `grand-arch-welcome-wall.jpg` |
| No. 08 Ceremony Arch Set | `ceremony-arch-set.jpg` |
| No. 09 Slat Monogram Backdrop | `slat-backdrop.jpg` |
| No. 10 The Mobile Bar | `mobile-bar.jpg` |

**4b. Upload them** to `assets/img/catalog/` in the repo (**Add file →
Upload files** → drag → **Commit changes**).

**4c. Tell the site they exist:** edit `js/manifest.js` and add one line
per photo inside `photos: {` — the four already there show the pattern:

```js
"arched-welcome": "assets/img/catalog/arched-welcome.jpg",
```

Commit, wait a minute, refresh. If a card still shows the drawing, the
file name and the line don't match exactly (`.jpg` vs `.png` counts).

## Part 5 — The hero video

When you have 15–30 seconds of footage (a build in the shop, a finished
piece at a venue — filmed sideways/landscape):

1. Export it as an **MP4** (phones do this by default). Keep it short —
   GitHub's web uploader refuses files over 25 MB; a 15–30 second 1080p
   clip fits comfortably. If it's refused, trim it shorter or export at
   1080p instead of 4K.
2. Upload it to the `assets/video` folder, named `hero.mp4`.
3. Also upload one wide still photo (a nice frame from the video works)
   to `assets/img`, named `hero-poster.jpg`.
4. Edit `js/manifest.js` and set the two lines near the top:

```js
heroVideo: "assets/video/hero.mp4",
heroPoster: "assets/img/hero-poster.jpg",
```

The site handles the rest: the still shows instantly while the video
loads, phones on data-saver get the still only, and visitors who've
turned on "reduce motion" never get autoplaying video. If the video
ever fails to load, the still simply stays — nothing looks broken.

## Part 6 — Gallery photos

After every wedding, add the best shots:

1. Upload photos to `assets/img/gallery` (any file names are fine).
2. In `js/manifest.js`, add one line per photo inside `gallery: [` — like:

```js
gallery: [
  "assets/img/gallery/june-wedding-01.jpg",
  "assets/img/gallery/june-wedding-02.jpg",
],
```

The Gallery section and its menu link appear automatically once there's
at least one photo, and stay hidden while the list is empty.

## Part 7 — Inquiries land in your inbox (already wired)

The form sends every inquiry straight to **will.smithmade@gmail.com**
through FormSubmit — a free delivery service that needs no account.

**One-time activation:** the very first submission makes FormSubmit send
a confirmation email to that inbox. Open it and press the blue
**Activate** button once. After that, every inquiry arrives
automatically, formatted as a tidy table, and you can just press Reply
to answer the couple.

**If inquiries ever stop arriving:** check the spam folder first, then
send a test from the site. To change the receiving address, edit the
`formEndpoint` and `email` lines in `js/manifest.js` — the address
appears right in the URL.

## Part 8 — Phone number and Instagram

Both live in `js/manifest.js`, right at the bottom:

```js
phone: "(864) 555-0123",
instagram: "https://instagram.com/yourhandle",
```

Fill them in and they appear in the site footer automatically. Leave
them as empty quotes (`""`) and the site simply doesn't mention them.

## Part 9 — Change a price, a description, or any wording

All the words and prices live in one file: `index.html`.

1. Open `index.html` in the repo and click the **pencil** to edit.
2. Press `Ctrl+F` and search for the piece or phrase — for example
   "Arched Welcome Sign". Its price is a few lines below, between
   `<strong>` and `</strong>` — like `<strong>$150</strong>`.
3. Change the number (or the sentence), leave the surrounding tags
   exactly as they are, and **Commit changes**.

Packages, delivery fees, and policy wording are in the same file under
the "Pricing" section. The FAQ answers and the rent-to-own example are
there too — if you raise the welcome-sign price, remember the $150/$320
example appears in a couple of places.

## Part 10 — Later: your own domain name

`smithmadesc.com` works fine to start, but a
name like `smithmadesc.com` looks better on a business card:

1. Buy the domain (about $12/year at Namecheap, Cloudflare, or
   Squarespace Domains).
2. In the repo: **Settings → Pages → Custom domain** — type your domain
   and save. GitHub shows you two small settings (DNS records) to add at
   the company you bought the domain from; their help pages all have a
   "connect to GitHub Pages" guide, and it's copy-paste.
3. Ask whoever is helping you at the time (Claude included) to update
   the site's address in five spots — `og:image`, `og:url`, and
   `canonical` in `index.html`, plus `sitemap.xml` and `robots.txt` —
   so search engines and link previews use the new name.

## Part 11 — Take money on the website (Square)

Couples can pay a **$50 date hold** right on the site — it locks their
Saturday, counts toward their balance, and lands in your bank account.
The bigger payments (50% build deposit, final balance) go out as Square
invoices from your phone once you've quoted the exact price. Here's the
one-time setup, about 20 minutes:

**A. Create your free Square account** (this is the part only you can
do — it's your identity and your bank):

1. Go to **squareup.com** and sign up with will.smithmade@gmail.com.
   (Already created the account under a different email? No problem —
   in Square go to **Settings → Account → Email** and change it to
   will.smithmade@gmail.com so payment notifications land in the
   business inbox with everything else.)
2. It will ask what kind of business — pick something like Events/
   Rentals; "Smith Made" as the business name.
3. It asks for your legal name, address, and SSN (or EIN once the LLC
   exists) — that's federal law for anyone who processes card payments
   (identity verification), not Square being nosy.
4. Under **Settings → Bank accounts**, link your checking account.
   Square then deposits card money the next business day, automatically.
   Fee: 2.9% + 30¢ per online payment — a $50 hold nets you about $48.25.

**B. Create the date-hold payment link:**

1. In the Square dashboard, find **Payment Links** (also called Online
   Checkout) → **Create a link** → "Collect a payment."
2. Name: `Smith Made — Date Hold` · Amount: `$50`.
3. Turn on the option to collect the buyer's **name and email**, and add
   a custom question if offered: "Wedding date + which piece(s)?"
4. Create it, and copy the link (looks like `https://square.link/u/AbCdEf`).

**C. Turn it on for the site** — one line: open `js/manifest.js`, find
`dateHoldUrl`, and paste your link between the quotes. Commit. The gold
"Pay the $50 date hold" button appears in the booking section, and every
"Book this piece" button leads couples to it.

**D. Deposits and balances** (no code — just Square): when you've agreed
on the exact quote, open Square → **Invoices** → new invoice → line items
("Grand Arch Welcome Wall — build deposit (50%)"), send to their email.
Same again for the balance, due at delivery. Square chases the reminders
for you.

**Refund a date hold** (if plans change inside the 7 days you promise on
the site): Square dashboard → Transactions → find it → Refund. The site's
wording and your policy stay in step automatically because both came from
the same plan.

## Reference — what every file is

| File / folder | What it is |
| --- | --- |
| `index.html` | The entire site's words, prices, and structure |
| `css/styles.css` | Colors, fonts, spacing — the whole look |
| `js/manifest.js` | **Your settings file** — photos, video, form, contact |
| `js/main.js` | Menu, hero video handling, gallery (don't need to touch) |
| `js/form.js` | Makes the inquiry form work (don't need to touch) |
| `assets/img/catalog/` | Product photos (and built-in placeholders) |
| `assets/img/gallery/` | Wedding photos |
| `assets/video/` | Hero video |
| `.github/workflows/deploy-pages.yml` | The robot publisher's instructions |
| `favicon.svg` | The little "SM" icon in the browser tab |
| `robots.txt` / `sitemap.xml` | Directions for Google |

## If something goes wrong

- **A red X in the Actions tab** — open the run, then just press
  **Re-run all jobs** (top right). If it stays red, the run's log says
  why in plain-ish English; ask Claude and paste what it says.
- **A photo isn't showing** — the file name in the folder and the line
  in `js/manifest.js` don't match exactly. Capitalization and `.jpg`
  vs `.png` both count.
- **You changed something and regret it** — nothing is lost. Every
  commit is saved in the repo's **History** (clock icon on any file).
  Ask Claude to "put back the version from before" and it's done.
- **The site looks stale after a change** — give it a minute, then
  hard-refresh (`Ctrl+F5`), and check the Actions tab has a green check
  for your change.
