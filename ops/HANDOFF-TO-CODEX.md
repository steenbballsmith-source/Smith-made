# Handoff: Claude → Codex

From Claude, 2026-07-30. Delivered by git — we have not spoken and cannot.

To pick this up:

```bash
git fetch origin claude/codex-team-coordination-shomkq
git checkout claude/codex-team-coordination-shomkq
```

Read `ops/README.md` first — it explains why your `C:\Users\SJ\.claude\ops\`
system, good as it is, cannot reach me.

---

## First, the correction you'll want

Your instructions had me take SD-DEPLOY-001 and deploy Smith Digital. **It was
already live before I was asked** — deploy `6a6a34440418d1b5f6dc57e0`, published
2026-07-29 17:11:34 UTC, a manual drop of a single `index.html`. If that was
you, note it on the board so the next agent doesn't reach for it too.

I didn't re-deploy. I also couldn't have: `C:\Users\SJ\Smith-Digital-Site\index.html`
is on your machine, and the only repo I can see is `Smith-made`.

The larger thing: your instructions had me *verify* the audit form, then
configure notifications for it, then send a test through it. I checked before
doing any of that, and the form isn't there. Three tasks were stacked on a
foundation that hasn't been poured yet. That's SD-FORMS-001 below, and it's the
one job worth doing today.

## SD-FORMS-001 — yours, highest priority

**Netlify has zero forms registered for `candid-starship-c2ce98`.**
`get-forms-for-project` on site `392091e9-6dc3-4a3d-8f84-d2e400d3169b` returns
`[]`. The Forms feature is enabled; nothing was detected. Netlify parses HTML at
deploy time to find forms, and it found none in what's live.

So: audit requests submitted on smithdigitalco.com right now go nowhere. Not to
a dashboard, not to an inbox, not to a log. If anyone has filled that form in
since 2026-07-29, that inquiry is gone.

**The fix**, in your local `index.html`:

```html
<form name="audit" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="audit">
  <p hidden><label>Leave blank: <input name="bot-field"></label></p>
  <!-- your existing fields -->
</form>
```

Check these in order — the second is the usual culprit:

1. `name="audit"` plus `data-netlify="true"` on the `<form>`. Without both, the
   parser skips it.
2. **The hidden `form-name` input.** If anything submits via `fetch`/JS instead
   of a native HTML POST, Netlify has no way to know which form the payload
   belongs to, and drops it. Silently. This is the single most common cause of a
   Netlify form that looks fine and captures nothing.
3. Redeploy after editing. Detection happens at deploy, so an un-redeployed fix
   changes nothing.

**Then push me a signal.** Append to `ops/LOG.md`, commit, push. I'll re-query
the Netlify API and confirm the form registered — that's a check I can do that
you'd otherwise do by eye.

## SD-FORMS-002 — needs a browser, so not me

Netlify's MCP server gives me forms enable/disable and submission read/delete.
**Notification config isn't in it.** Either you or Steen, in the dashboard:

`candid-starship-c2ce98` → Project configuration → Notifications →
*Form submission notifications* → email → **steenbballsmith@gmail.com**

## SD-FORMS-003 — the test, done properly

After 001 and 002 are actually done, send one clearly-labelled test inquiry and
confirm it in **both** the Netlify submissions list and the Gmail inbox.

Not the submit button returning 200. A form Netlify never registered will still
hand you a clean-looking 200. Delivery is what counts, and only the inbox proves
it.

## What I did not touch

**SM-PR-001 is yours, untouched.** No venue email sent, no draft opened, no
contact made with Riverain Farm, The Barn at Sitton Hill Farm, or The Hollow at
Paris Mountain.

Two things I noticed while reading, for whoever sends them: the drafts sit in
steenbballsmith@gmail.com but are meant to go from will.smithmade@gmail.com, and
the signature still has the wrong address on it (`SESSION_HANDOFF.md` §2). Worth
fixing before send, along with re-checking each venue's address against its live
site that day.

## Two things I need from you

**1. Commit `CHARTER.md` to `ops/`.** I have never read it. It governs sending,
publishing, money, and credentials — and I've been working from a paraphrase in
a prompt. I deliberately haven't written my own version, because two charters
that disagree is worse than one I can't see. Strip anything sensitive first;
this repo is public. Same goes for `TASKS.md`, `APPROVALS.md`, and
`properties_REGISTRY.md` if you want me operating on them rather than around
them.

**2. Look at OPS-PRIVACY-001.** `Smith-made` is public, and files merged before
today publish the 14-venue lead list with commentary, the 10-planner list, the
founder-discount strategy, and the ~50–55% gross margin floor. Nothing dangerous
— no credentials, no customer data — but it is the go-to-market plan and the
pricing floor, readable by anyone who finds the repo. It's Steen's call, not
ours. Flag it to him rather than acting on it.

## How the loop closes

I'm ephemeral — this container is wiped when the session ends, and I keep
nothing. Everything I know next time has to come from these files. If it isn't
committed, it didn't happen.

So: claim on the board before you work, log with evidence after, push. That's
the whole handshake.
