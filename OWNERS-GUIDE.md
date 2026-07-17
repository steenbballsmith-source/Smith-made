# Smith Made website — owner's guide

This site is plain HTML, CSS, and JavaScript. No accounts, no subscriptions,
nothing to install. This guide covers everything you'll ever need to do,
in plain words. Every recipe is the same two moves:

> **Drop a file in a folder, then change one line in `js/manifest.js`.**

Open `js/manifest.js` in any text editor (Notepad works). Every setting in
it has instructions written right above it.

---

## 1. Add your product photos

Your ten concept renders (from `Downloads\Smith Made\web` on your PC) go in
the folder **`assets/img/catalog/`**. Rename each file to match its piece,
using the exact names below, then add one line per photo in `js/manifest.js`
under `photos:`.

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

Example — after dropping in the arch wall photo, the `photos:` section of
`js/manifest.js` looks like this:

```js
photos: {
  "arch-welcome-wall": "assets/img/catalog/arch-welcome-wall.jpg",
},
```

Until a photo exists, the site shows a tidy "photo coming soon" card —
nothing ever looks broken.

## 2. Add the hero video

When you have 15–30 seconds of build or venue footage:

1. Save it as `assets/video/hero.mp4` (MP4 format; your phone can export this).
2. In `js/manifest.js`, set: `heroVideo: "assets/video/hero.mp4",`

Also give it a matching still image (a frame from the video or any wide
photo), saved as `assets/img/hero-poster.jpg`, and set
`heroPoster: "assets/img/hero-poster.jpg",`. The still is what people see
while the video loads, on data-saver connections, and for anyone who has
"reduce motion" switched on — the site handles all of that by itself.

## 3. Add wedding photos to the gallery

1. Drop photos into `assets/img/gallery/` (any names are fine).
2. Add one line per photo in `js/manifest.js` under `gallery:`.

The Gallery section (and its menu link) appears automatically once the
list has at least one photo, and stays hidden until then.

## 4. Get inquiries into your inbox

Out of the box, the "Send inquiry" button opens the visitor's own email
app with everything pre-filled, addressed to you. That works with zero
setup, but some visitors don't have an email app configured. The upgrade:

1. Make a free account at [formspree.io](https://formspree.io).
2. Create a form — it gives you a link like `https://formspree.io/f/abcd1234`.
3. Paste that link into `formEndpoint:` in `js/manifest.js`.

Inquiries then land straight in your inbox from the website itself.

## 5. Change a price or a description

Prices live in `index.html`, right on each product card. Search for the
piece name (for example "Arched Welcome Sign"), and you'll see its price
a few lines below it between `<strong>` and `</strong>`. Change the
number, save, done. Package prices and policies are in the same file
under "Pricing &amp; policies".

## 6. Put the site online (free)

The site is ready for GitHub Pages:

1. On this repository's GitHub page, go to **Settings → Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**,
   pick the `main` branch and the `/ (root)` folder, and save.
3. A couple of minutes later your site is live at the address GitHub shows.

When you buy a real domain (for example `smithmadesc.com`), add it in the
same Pages settings screen, and tell whoever is helping you at the time to
update the `og:image` line in `index.html` to the full address — that makes
the preview card show up when the site is shared by text or on social media.

## 7. Phone number and Instagram

Both live in `js/manifest.js` (`phone:` and `instagram:`). Fill them in
and they appear in the footer automatically; leave them empty and the
site simply doesn't show them.
