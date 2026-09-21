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
      try { window.gtag("event", name, params || {}); }
      catch (err) { /* Optional tracking must not interrupt browsing or inquiries. */ }
    }
  }
  window.smTrack = smTrack;

  /* ---- UTM capture -> hidden inquiry fields --------------------
     Reads utm_source / utm_medium / utm_campaign / utm_content
     from the URL, keeps them for the session, and fills the
     hidden form fields so the values arrive with the inquiry
     email. No analytics involvement, no personal data.          */
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  var currentAttribution = {};
  var qs = new URLSearchParams(window.location.search);
  // Keep the campaign available even when a browser disallows session storage.
  UTM_KEYS.forEach(function (key) {
    var value = qs.get(key);
    if (value) currentAttribution[key] = value.slice(0, 120);
  });
  try {
    UTM_KEYS.forEach(function (key) {
      if (currentAttribution[key]) sessionStorage.setItem("sm_" + key, currentAttribution[key]);
      else currentAttribution[key] = sessionStorage.getItem("sm_" + key) || "";
    });
  } catch (err) { /* private-mode storage errors are fine */ }
  var landingPage = window.location.pathname;
  var referralHost = "";
  try {
    var referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer && referrer.origin !== window.location.origin) referralHost = referrer.hostname;
    landingPage = sessionStorage.getItem("sm_landing_page") || landingPage;
    referralHost = sessionStorage.getItem("sm_referral_host") || referralHost;
    sessionStorage.setItem("sm_landing_page", landingPage);
    if (referralHost) sessionStorage.setItem("sm_referral_host", referralHost);
  } catch (err) { /* current URL remains usable */ }

  function fillUtmFields() {
    UTM_KEYS.forEach(function (key) {
      var field = document.querySelector('[data-utm="' + key + '"]');
      if (!field) return;
      field.value = currentAttribution[key] || "";
    });
    var landing = document.querySelector('[name="landing_page"]');
    var referral = document.querySelector('[name="referral_host"]');
    if (landing) landing.value = landingPage;
    if (referral) referral.value = referralHost;
    // Carry campaign tags through ordinary internal links, including new-tab use.
    document.querySelectorAll('a[href]').forEach(function (link) {
      var raw = link.getAttribute("href");
      if (!raw || raw.charAt(0) === "#") return;
      try {
        var target = new URL(raw, window.location.href);
        if (target.origin !== window.location.origin || !/(?:\.html|\/)$/i.test(target.pathname)) return;
        UTM_KEYS.forEach(function (key) {
          if (currentAttribution[key] && !target.searchParams.has(key)) target.searchParams.set(key, currentAttribution[key]);
        });
        link.href = target.pathname + target.search + target.hash;
      } catch (err) { /* ignore unsupported links */ }
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
