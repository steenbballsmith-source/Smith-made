# Current handoff to Codex

**Last reconciled:** 2026-07-30 16:08 PDT by Codex
**Full evidence:** `ops/LOG.md`, entry `2026-07-30-C12`

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

### Two human gates before Codex can continue

On the home computer:

1. Open Chrome.
2. Go to `chrome://extensions`.
3. Under the **ChatGPT Chrome Extension**, click **Details**.
4. Turn on **Allow access to file URLs**.
5. Tell Codex exactly: `Chrome file access is enabled and I approve the Smith
   Digital production deploy`.

The Netlify project is already signed in and its deploy page is open. No file
was uploaded during the blocked attempt, so there was no partial deploy. The
second phrase is required because Steen's standing authorization still reserves
production publishing for a specific approval.

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

- **OPS-CHARTER-001:** complete. The public-safe shared constitution is now
  `ops/CHARTER.md`; Claude should read it before business work.
- **OPS-VERSIONING-001:** complete. The private local ops brain now has
  local-only Git recovery history and no remote.
- **STATE-RECONCILE-002:** complete. Claude's verified Netlify/form state is
  now reflected in the private local board, tasks, brief, property record, and
  activation prompt at local commit `4cc2758`.
- **OPS-PRIVACY-001:** Steen must choose whether Smith Made's internal strategy
  stays public, moves to a private ops repository, or the repository becomes
  private. No agent should make that commercial/privacy decision for him.
- **SM-PR-001:** remains Codex-owned but is blocked by OPS-PRIVACY-001. Commit
  `85b8502` stays local because pushing it to this public repository would
  publish named prospects, contact details, and pitch strategy. No venue
  message has been sent.
- **SR-DEPLOY-001:** S&R's Netlify form and email notification are already
  healthy. A corrected, fully tested production package is staged locally; it
  removes placeholder reviews, adds the canonical URL, and avoids an empty
  image request. It still needs Steen's specific production-deploy approval.
- **SM-QA-001:** a tested native POST fallback for Smith Made's inquiry form is
  committed locally at `bc4fad2` on `codex/site-qa-resilience`. It has not been
  pushed or deployed. Steen must specifically approve the public-safe draft PR,
  and Will must still prove real FormSubmit inbox delivery.
- **Outbound safety:** a read-only private Gmail audit found stale draft reuse
  could cause duplicate or low-information outreach. Exact recipients and
  evidence remain in the private ops repository. Scheduled follow-ups must
  start from the actual Sent thread and add freshly reverified information.
  No draft was changed, no message was sent, and agents will not delete email.

## Safety

Do not request passwords, authentication codes, payment information, or
identity documents. Do not call the form working until delivery is observed.
