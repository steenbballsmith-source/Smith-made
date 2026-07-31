# Current handoff to Codex

**Last reconciled:** 2026-07-30 17:25 PDT by Codex
**Full evidence:** `ops/LOG.md`, entries `2026-07-30-C17` and
`2026-07-30-C18`

This file is the current inbox. The original Claude handoff was read and acted
on. Its verified history is preserved in the log.

## New hold: no Smith Digital marketing send yet

Claude's independent Gmail audit surfaced a valid compliance issue. Codex then
re-read the three latest Sent bodies and checked the FTC's official business guide:
the messages lack a valid physical postal address, clear commercial-solicitation
identification, and a clear opt-out notice. The FTC says those requirements cover
individual B2B commercial email, not just bulk campaigns.

All Smith Digital first touches and marketing follow-ups are now research/draft-only
until Steen supplies a valid address he expressly authorizes prospects to see and the
private board marks `SD-COMPLIANCE-001` complete. The scheduled runner is already
updated to fail closed. Human-reply monitoring continues, but a reply is drafted for
Steen and never answered automatically.

## Infrastructure path is researched and ready for Steen's decision

A direct DNS check found no MX record, no root SPF record, and no DMARC record
for `smithdigitalco.com`; no common DKIM selector was observable. In business
terms, the domain website works, but authenticated business email has not been
set up. Future mail records belong in the active Netlify/NS1 DNS zone.

The privacy-first recommendation is:

1. obtain a registered virtual business mailbox in Greenville that provides a
   valid PMB mailing line;
2. create one authenticated `smithdigitalco.com` mailbox, with aliases, through
   a low-cost mail provider;
3. add and verify MX, SPF, DKIM, and a monitoring-only DMARC policy;
4. test inbound and outbound delivery before relying on the new address; and
5. install the complete commercial footer before any marketing email resumes.

The researched default is an iPostal1 business mailbox serviced locally by Qwik
Pack & Ship, plus Namecheap Private Email. Steen must personally complete any
checkout, service terms, payment, identity/notary step, and USPS Form 1583.
No agent has signed up, spent money, changed DNS, or disclosed an address.

The private decision and implementation playbook is:

`C:\Users\SJ\.claude\ops\playbooks\smith-digital-outreach-infrastructure.md`

The latest authenticated Gmail recheck found no human reply and no delivery
failure in the active Smith Digital cohort. Monitoring continues while the
marketing-send hold remains in force.

Local Claude can use the private response and free-audit system at:

`C:\Users\SJ\.claude\ops\playbooks\smith-digital-reply-and-audit.md`

Cloud Claude cannot read that path. It should preserve the aggregate hold here and
rederive any prospect-specific work from authenticated Gmail plus official sites.

One correction to the live summary matters: the production page has no form and is
still stale, but it is not a page with "no way to reply." Codex's direct live fetch
confirmed visible phone, text, and email routes. The accurate conversion problem is
the missing form plus old positioning and old prices, not zero contact routes or a
guaranteed zero conversion rate.

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
- **Outbound authorization changed:** Steen specifically authorized continued
  Smith Digital prospecting and sending the website/business information to
  try to win clients. Codex executed one bounded three-contact first-touch wave;
  all three were same-day verified, individually written, confirmed in Sent,
  and showed no immediate delivery failure. Exact identities, evidence, copy,
  and message records remain private. Scheduled follow-ups must use the actual
  Sent threads, add freshly reverified information, and stop on any human reply.
- **Follow-up readiness:** private ops now has a deeper source-backed mini-audit,
  prioritized fixes, a non-promissory value hypothesis, and one distinct
  touch-#2 candidate for every new thread. Local Claude may read
  `C:\Users\SJ\.claude\ops\leads\audit-kits\2026-07-30-wave.md`. Cloud Claude
  must rederive the facts from Gmail Sent threads and official sites rather
  than asking Codex to publish the private packet here. Every fact still needs
  a same-day recheck before use.
- **Next-window prospect readiness:** a separate private packet now contains three
  recommended emailable prospects, one fail-closed email backup, and one held
  form/phone-only near match. Nothing in that packet was sent or added to Gmail
  Drafts. Local Claude may read
  `C:\Users\SJ\.claude\ops\leads\audit-kits\2026-07-31-next-wave.md`; cloud Claude
  cannot access it and must build its own evidence from official sites plus Gmail.
  The earliest eligible run is July 31, it must claim the work, check replies and
  delivery failures first, reverify every contact and fact, search prior mail, and
  send no more than three. Only one first-touch wave may run per local calendar day
  unless Steen explicitly expands that day after the prior wave is reported.
- **Scheduled runner aligned:** the existing four-times-daily Codex shared-board
  heartbeat was updated in place. Its schedule is unchanged, but its prompt no longer
  carries the superseded blanket pause on Smith Digital first touches. It now honors
  explicit board eligibility, not-before dates, the three-message ceiling, daily
  pacing, same-run evidence checks, duplicate prevention, Sent verification, and the
  stop-on-human-reply rule.
- **Release automation:** the private ops repository now contains a read-only
  three-site release verifier. The real staged artifacts pass all 41 checks,
  and a missing-file negative control correctly returns failure. This does not
  authorize or perform a production deployment.

## Safety

Do not request passwords, authentication codes, payment information, or
identity documents. Do not call the form working until delivery is observed.
