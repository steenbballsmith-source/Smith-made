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
   **https://steenbballsmith-source.github.io/Smith-made/**

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
5. When it's green, open **https://steenbballsmith-source.github.io/Smith-made/**
   — your site is live. Check it on your phone too.

From now on you never repeat this Part — every future change publishes
itself.

## Part 4 — Put your ten renders on the product cards

Four pieces already have renders (sent to Claude in chat): the Seating
Chart Wall, Framed Seating Chart, Champagne Wall, and Ceremony Arch —
and the hero backdrop uses a styled crop of the wall render. The other
six cards show a tidy "photo coming soon" placeholder until you add
them. Your renders are on your PC in `Downloads\Smith Made\web`; if a
render is already placed but on the wrong piece, just say so in chat —
it's a one-line swap.

**4a. Rename copies on your PC.** Make a copy of the ten images and
rename them exactly as follows (keep whatever ending the files already
have — `.jpg` or `.png` — just make the names match):

| Piece on the site | Name the file |
| --- | --- |
| The Arch Welcome Wall | `arch-welcome-wall.jpg` |
| Arched Welcome Sign | `arched-welcome-sign.jpg` |
| A-Frame Welcome Sign | `a-frame-welcome-sign.jpg` |
| Live-Edge Welcome Sign | `live-edge-welcome-sign.jpg` |
| Seating Chart Wall | `seating-chart-wall.jpg` |
| Framed Seating Chart | `framed-seating-chart.jpg` |
| The Champagne Wall | `champagne-wall.jpg` |
| The Mobile Bar | `mobile-bar.jpg` |
| Ceremony Arch | `ceremony-arch.jpg` |
| Keepsake "Established" Sign | `keepsake-established-sign.jpg` |

**4b. Upload them.** In the repo, click into the `assets` folder, then
`img`, then `catalog`. Click **Add file → Upload files**, drag all ten
renamed images in, and press the green **Commit changes** button.
(The little message box above the button is just a note-to-self about
what you changed — "add product photos" is perfect.)

**4c. Tell the site they exist.** Open `js/manifest.js` in the repo,
click the **pencil** icon to edit, find the part that says
`photos: {` and make it look like this (copy-paste, then fix any `.jpg`
to `.png` where your files are PNGs):

```js
photos: {
  "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",
  "arched-welcome-sign": "assets/img/catalog/arched-welcome-sign.jpg",
  "a-frame-welcome-sign": "assets/img/catalog/a-frame-welcome-sign.jpg",
  "live-edge-welcome-sign": "assets/img/catalog/live-edge-welcome-sign.jpg",
  "seating-chart-wall": "assets/img/catalog/seating-chart-wall.jpg",
  "framed-seating-chart": "assets/img/catalog/framed-seating-chart.jpg",
  "champagne-wall": "assets/img/catalog/champagne-wall.jpg",
  "mobile-bar": "assets/img/catalog/mobile-bar.jpg",
  "ceremony-arch": "assets/img/catalog/ceremony-arch.jpg",
  "keepsake-established-sign": "assets/img/catalog/keepsake-established-sign.jpg"
},
```

Press **Commit changes**, wait a minute, refresh the site — real photos.
If one card still shows the placeholder, its file name and its line
don't match exactly (check for typos and `.jpg` vs `.png`).

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

## Part 7 — Get inquiries straight into your inbox

**Today, with zero setup:** when a couple presses "Send inquiry," their
own email app opens with everything they typed pre-filled, addressed to
you. That works — but a visitor whose phone has no mail app set up can
stall there.

**The five-minute upgrade (recommended):**

1. Go to **formspree.io** and create a free account (free tier is plenty
   at this stage — 50 inquiries a month).
2. Click **New form**, name it "Smith Made inquiries", and copy the
   endpoint address it gives you — it looks like
   `https://formspree.io/f/abcd1234`.
3. In `js/manifest.js`, paste it into the `formEndpoint` line:

```js
formEndpoint: "https://formspree.io/f/abcd1234",
```

From then on the form sends directly from the website and inquiries
land in your inbox. (First submission may ask you to confirm your email
with Formspree — click the link they send once.)

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
   `<strong>` and `</strong>` — like `<strong>$95</strong>`.
3. Change the number (or the sentence), leave the surrounding tags
   exactly as they are, and **Commit changes**.

Packages, delivery fees, and policy wording are in the same file under
the "Pricing" section. The FAQ answers and the rent-to-own example are
there too — if you raise the welcome-sign price, remember the $95/$203
example appears in a couple of places.

## Part 10 — Later: your own domain name

`steenbballsmith-source.github.io/Smith-made` works fine to start, but a
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
