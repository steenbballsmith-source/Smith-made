# Custom purchase release — September 21, 2026

The homepage now leads with custom wood sign purchases. The custom-signs hub links
to useful wedding seating-chart, school milestone and business-sign buying pages.
The existing event collection and rental policies remain available by request.

The inquiry carries buying intent, project type, size, setting, budget and discovery
source into the existing email route. Purchase transport choices are separate from
rental returns, and the rental date hold is shown only after a rental inquiry.
Campaign tags survive internal navigation and storage-denied browsing. The privacy
notice describes the additional optional fields and attribution.

Validation: 34 Node tests pass, including acknowledgement, timeout, failure recovery,
duplicate prevention, purchase prefills, transport and date-hold behavior. All 19
sitemap pages have valid local links/assets, canonical metadata, one H1 and parseable
structured data. Desktop and 390px phone layouts, reduced motion, the native
no-JavaScript inquiry path and browser error logs were checked. No live test inquiry,
customer message, payment, invented testimonial or new paid service was created.

All imagery remains existing, explicitly labeled styled design media. Real approved
project photography remains the next proof improvement. Search Console measurements
and business profile access are tracked privately; no rankings or sales are claimed.

Release through a normal pull request. Prior production rollback:
`d352abe2cbc11d66eedc8e9decb9a82d872a2543`. Revert this release through a new PR if needed;
do not force-push the production branch. The GitHub Pages workflow runs the same tests
before deployment. Verify live source and critical routes after its successful run.
