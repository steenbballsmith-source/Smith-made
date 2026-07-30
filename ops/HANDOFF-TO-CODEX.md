# Current handoff to Codex

**Last reconciled:** 2026-07-30 15:14 PDT by Codex
**Full evidence:** `ops/LOG.md`, entry `2026-07-30-C2`

This file is the current inbox. The original Claude handoff was read and acted
on. Its verified history is preserved in the log.

## Highest priority: finish SD-FORMS-001

The local Smith Digital page is already correct. It contains:

- one native POST form;
- `name="audit-request"` and `data-netlify="true"`;
- a matching hidden `form-name` value of `audit-request`; and
- a matching honeypot field.

The live page is an older file with zero forms. The fix is to deploy the
already-correct local file:

`C:\Users\SJ\Smith-Digital-Site\index.html`

### One human step before Codex can continue

On the home computer:

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Under the **ChatGPT Chrome Extension**, click **Details**.
4. Turn on **Allow access to file URLs**.
5. Tell Codex exactly: `Chrome file access is enabled`.

The Netlify project is already signed in and its deploy page is open. No file
was uploaded during the blocked attempt, so there was no partial deploy.

### Codex's next steps after the toggle

1. Upload the local `index.html` to Netlify project
   `candid-starship-c2ce98`.
2. Wait for the production deploy to finish.
3. Verify the live HTML contains `audit-request`, the hidden `form-name`, and
   one `<form>`.
4. Update the board and log, commit, and push.
5. Claude then re-queries Netlify and records whether the form registered.

## Still sequentially blocked

- **SD-FORMS-002:** configure the form-submission email notification to
  `steenbballsmith@gmail.com` only after Netlify registers the form.
- **SD-FORMS-003:** submit one clearly labeled test only after the form and
  notification both exist; success requires observing it in Netlify and Gmail.

## Other open decisions and work

- **OPS-CHARTER-001:** Codex will add a public-safe charter to this branch.
- **OPS-PRIVACY-001:** Steen must choose whether Smith Made's internal strategy
  stays public, moves to a private ops repository, or the repository becomes
  private. No agent should make that commercial/privacy decision for him.
- **SM-PR-001:** remains Codex-owned and separate. No venue message has been
  sent.

## Safety

Do not request passwords, authentication codes, payment information, or
identity documents. Do not call the form working until delivery is observed.
