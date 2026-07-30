/* ============================================================
   SMITH MADE — LIGHTWEIGHT EVENT TRACKING
   Safe by design:
   - Does NOTHING until a GA4 tag is installed on the page.
     (Add the gtag snippet with the real G-XXXX id in index.html,
     and every event below starts flowing — no other changes.)
   - Never sends names, emails, phone numbers, or free text.
     Only piece ids, finish labels, and link types.
   ============================================================ */
(function () {
  "use strict";

  /* Send an event if GA4 is present; otherwise no-op quietly.
     Exposed as window.smTrack so form.js / staged.js can call it. */
  function smTrack(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }
  window.smTrack = smTrack;

  /* ---- UTM capture -> hidden inquiry fields --------------------
     Reads utm_source / utm_medium / utm_campaign / utm_content
     from the URL, keeps them for the session, and fills the
     hidden form fields so the values arrive with the inquiry
     email. No analytics involvement, no personal data.          */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  try {
    var qs = new URLSearchParams(window.location.search);
    UTM_KEYS.forEach(function (key) {
      var val = qs.get(key);
      if (val) sessionStorage.setItem("sm_" + key, val.slice(0, 120));
    });
  } catch (err) { /* private-mode storage errors are fine */ }

  function fillUtmFields() {
    UTM_KEYS.forEach(function (key) {
      var field = document.querySelector('[data-utm="' + key + '"]');
      if (!field) return;
      try {
        field.value = sessionStorage.getItem("sm_" + key) || "";
      } catch (err) { /* ignore */ }
    });
  }

  /* ---- Click events, delegated ------------------------------- */
  function pieceIdFor(el) {
    var li = el.closest("li.piece");
    return li && li.id ? li.id.replace(/^piece-/, "") : "";
  }

  document.addEventListener("click", function (event) {
    var a = event.target.closest("a, button");
    if (!a) return;

    if (a.matches('a[href^="tel:"]')) {
      smTrack("phone_click", { link_location: a.closest("footer") ? "footer" : "body" });
    } else if (a.matches('a[href^="mailto:"]')) {
      smTrack("email_click", { link_location: a.closest("footer") ? "footer" : "body" });
    } else if (a.matches("[data-hold-link]")) {
      smTrack("date_hold_click", {});
    } else if (a.matches("[data-book]")) {
      smTrack("product_book_click", { piece: pieceIdFor(a) || a.getAttribute("data-piece") || "" });
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fillUtmFields);
  } else {
    fillUtmFields();
  }
})();
