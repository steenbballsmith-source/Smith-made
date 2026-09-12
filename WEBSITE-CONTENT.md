# Smith Made website content and inquiry handoff

Updated September 12, 2026. The approved website work adds a shorter homepage, a full eight-piece collection, three suggested pairings, clearer product facts, and inquiry references. Product prices, dimensions, stock, and real event photography remain unconfirmed in the available business records. The site does not invent them.

## Finish the product facts

For each of the eight designs, provide the rental starting price and what that price covers; dimensions and weight; available finishes; included base/supports, personalization and accessories; transport/loading requirements; and actual inventory quantity. Record the approval date. Update both the detail page facts and any card price at the same time. Only use prices that are approved for publication, never a customer's one-off proposed quote. All fees and policies already on the site are preserved in `delivery.html`.

The current pairings are A warm welcome (Arched Welcome + Seating Chart Wall), The ceremony moment (Ceremony Arch Set + Arched Welcome), and Time to toast (Mobile Bar + Champagne Wall). They are suggestions quoted for the event date. They do not imply a discount or guaranteed availability. Approved package rates can replace quote copy after inclusions and availability are confirmed.

## Add real events

The homepage has a real-event gallery ready to accept permission-cleared photography. It stays hidden while `SMITH_MADE.events` is empty. Add a local photo in `assets/img/gallery/`, then an entry in `js/manifest.js`:

```js
{
  approved: true,
  src: "assets/img/gallery/your-approved-event-photo.webp",
  alt: "Accurate description of the photographed pieces and setup",
  width: 1600,
  height: 1200,
  caption: "Approved event or venue description",
  credit: "Photographer's approved credit",
  pieces: ["arched-welcome", "seating-chart-wall"]
}
```

Use the image's actual dimensions. Every photo must show the linked rental pieces. Real-photo permissions must cover the venue, photographer, and identifiable people as applicable. Add actual customer reviews to the existing `reviews` array only with permission and the exact approved attribution. Do not treat the existing design renders as completed customer work. A real photograph of Will and Steen in the shop can replace the current text-only story when provided.

## One inquiry record

Production continues to deliver through the existing FormSubmit endpoint to the Smith Made inbox. The private design preview sends nothing. A generated `submission_id` identifies one inquiry and remains the same during a manual retry or an email fallback. It changes after a confirmed inquiry when the visitor starts another. It is a reference, not backend deduplication or a booking confirmation. Personal form details are not saved in browser storage.

The email contains names, email, optional phone, event date, venue/city, exact selected pieces, event type, suggested pairing, transport preference, rent/buy preference, planning role, referral source, campaign attribution, and message. The event type and pairing are included in the review/copy/email fallback as well.

Until the correct Smith Made GoHighLevel location is connected, reconcile this inbox into the existing Smith Made Operating System workbook. Use the reference to match a retry to an existing lead. Keep the workbook's existing status and follow-up process. No new parallel lead database or automatic CRM synchronization was installed in this release.

## GoHighLevel mapping when access is available

Map `names`, `email`, and optional `phone` to the contact. Map `submission_id`, `date`, `event_type`, `venue`, repeated `pieces`, `requested_set`, `transport`, `mode`, `planning_role`, `heard_about`, campaign fields, and `message` to the opportunity and its custom fields. Set the initial stage to the owner's existing New Inquiry stage, retain the received timestamp, and use the existing follow-up policy. Match by reference first and contact email second; multiple event dates for one person should remain separate opportunities.

Required connection: the owner-selected Smith Made location, its existing pipeline/stages, and permission to create contacts/opportunities. Confirm these against the existing operating playbook and workflow specifications. Keep any API credentials on a server, never in this static site's JavaScript. Do not replace the working email endpoint until the CRM receiver, duplicate behavior, and inbox fallback are verified with an approved test. There is no configured CRM receiver or live CRM synchronization at present.
