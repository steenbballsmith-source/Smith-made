# SM-CELEBRATIONS-20260912

Owner: ChatGPT
Status: release reconciliation in progress in PR #40

## Scope

Add celebrations.html for private celebrations, business events and milestones. Add links from custom-signs.html and include the page in the sitemap. Preserve existing wedding routes, inquiry endpoint, payment flow, prices, stock policy and analytics.

## September 12 reconciliation

The original PR check failed because tests/site.test.cjs expected 14 sitemap entries. The customer inquiry tests passed in that run. Main subsequently received PR #41, including a collection index, updated journey assets and 24 isolated checks.

The merge resolution uses main commit 4eddf8c7009ba5336864d9d287e14edbce9b429e as its file baseline. It preserves the collection index, journey asset versions and directory URL handling. It adds celebrations as the sixteenth sitemap entry and explicitly asserts its presence. The original celebrations page blob is unchanged.

## Evidence and remaining checks

Original failing workflow: https://github.com/steenbballsmith-source/Smith-made/actions/runs/34674370283
Last observed main deployment before this release: https://github.com/steenbballsmith-source/Smith-made/actions/runs/34675037930

The prior task recorded local mobile/desktop layout review. This follow-on work has not repeated that browser review or submitted a customer inquiry. Require passing checks on the reconciled PR, then verify the deployed page, source links and sitemap after an authorized merge. Do not infer actual inbox delivery, indexing or customer bookings from repository checks.

Private outreach and customer records stay outside this public repository.
