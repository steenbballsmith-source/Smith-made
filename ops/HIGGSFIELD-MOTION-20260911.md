# Higgsfield motion update — September 11, 2026

## Release status

Review candidate on `codex/higgsfield-motion-20260911`. Live smithmadesc.com remains on the previously published email-first release. Do not merge until the owner approves this cinematic update. A private review site is being prepared at https://smith-made-cinema-review.steensmith.chatgpt.site; verify its deployment status separately.

## Changes

A new arched Higgsfield background film with editorial typography, layered depth, native scroll transitions, progressive section entrances, and responsive phone layouts. Touch controls are at least 44 pixels; form controls use 16-pixel type. The fixed navigation has its own readable background. Decorative videos are muted, inline, and deferred until after page load. The video pauses offscreen and in hidden tabs. The control stops authored motion. Reduced-motion and data-saving users receive a still; blocked playback and media errors retain the still.

The homepage no longer loads GSAP, ScrollTrigger, or the old scene controller. Existing menu, catalog, product-to-inquiry links, manifest, contact handling, email addresses, payment destination, and product facts remain intact. Detail pages load the shared responsive enhancement stylesheet. No customer message, payment, or test inquiry was sent.

## Media provenance

Higgsfield Seedance 2.5 animated the existing styled `assets/img/gallery/staged-arch-riser.webp` design render. Job: `a44a590d-e35b-4540-8666-403d2f1356f2`. The six-second silent result was processed inside Higgsfield into a smooth forward/reverse loop, with separate 1280×720 desktop and 640×800 phone encodes at 24 fps. Desktop: 938,252 bytes; phone: 413,410 bytes. The film stays labeled as a styled design film, not footage of a completed rental.

Permanent Higgsfield media URLs appear in the homepage data attributes. Posters are self-hosted WebP files (65,308 and 22,246 bytes). Playback failure leaves the poster visible.

## Verification and limits

All 13 content pages passed static local-asset, unique-H1, JSON-LD, and no-telephone-link checks. Motion JavaScript passed syntax checking and the diff passed whitespace checks. There is no eager video `src`, and no content is hidden behind JavaScript initialization.

The supervised browser could not open the website preview. Desktop/phone/tablet rendering, real autoplay behavior, and on-device performance remain unverified. No inbox delivery test was performed. Do not describe this release as live, visually verified, or perfect.
