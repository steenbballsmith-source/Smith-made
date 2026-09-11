/* Smith Made — inquiry form.
   Two modes, chosen by js/manifest.js:
   - formEndpoint set  -> POST to it (Formspree-compatible), inline status.
   - formEndpoint empty -> open the visitor's email app with everything
     pre-filled, addressed to the owner. Works with zero setup.          */

(function () {
  "use strict";

  var config = window.SMITH_MADE || {};
  var form = document.querySelector("[data-inquiry-form]");
  var status = document.querySelector("[data-form-status]");
  if (!form || !status) return;
  var recovery = form.querySelector("[data-form-recovery]");
  var recoveryLink = form.querySelector("[data-form-email-draft]");
  var inFlight = false;

  function updateRecovery() {
    if (recoveryLink) recoveryLink.href = emailDraft(new FormData(form));
  }
  form.addEventListener("input", function () {
    if (recovery && !recovery.hidden) updateRecovery();
  });
  if (recoveryLink) recoveryLink.addEventListener("click", updateRecovery);

  function resetForm() {
    // A second inquiry should retain the same campaign attribution.
    var attribution = [];
    form.querySelectorAll("[data-utm]").forEach(function (field) {
      attribution.push({ field: field, value: field.value });
    });
    form.reset();
    attribution.forEach(function (entry) { entry.field.value = entry.value; });
    if (recovery) recovery.hidden = true;
  }

  function say(message, ok) {
    status.textContent = message;
    status.classList.toggle("is-ok", Boolean(ok));
    status.classList.toggle("is-error", !ok);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (inFlight) return;
    if (!form.reportValidity()) return;

    var data = new FormData(form);

    /* Honeypot: real visitors never see this field. If it's filled,
       quietly accept and do nothing. */
    if (data.get("company")) {
      say("Thank you — we’ll be in touch soon.", true);
      resetForm();
      return;
    }
    data.delete("company");

    if (config.formEndpoint) {
      /* Delivery-service niceties (FormSubmit/Formspree understand these;
         harmless extras otherwise): subject line + tidy table layout. */
      data.set("_subject", "Smith Made event inquiry — " + (data.get("names") || "new inquiry"));
      data.set("_template", "table");
      submitToEndpoint(data);
    } else {
      submitViaEmail(data);
    }
  });

  function submitToEndpoint(data) {
    var button = form.querySelector("[type=submit]");
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timeout;
    inFlight = true;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    if (recovery) recovery.hidden = true;
    say("Sending…", true);

    var options = {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    };
    if (controller) options.signal = controller.signal;
    var request = Promise.resolve().then(function () {
      return fetch(config.formEndpoint, options);
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        /* A 200 is NOT proof of delivery. FormSubmit answers 200 with an HTML
           page for its "please activate this form" step on a first-ever send to
           an address, and for its verification interstitials. Trusting the
           status alone is what let this form tell a couple "Sent!" while
           nothing reached the inbox — the worst failure available to us,
           because nobody finds out.
           We send Accept: application/json, so a genuine success is JSON.
           Parsing is what separates it from those HTML pages. */
        return response.json().catch(function () {
          throw new Error("Non-JSON response — activation or verification page");
        });
      });
    // Limit the whole request, including JSON parsing. Never retry automatically:
    // a connection failure can happen after the service accepts an inquiry.
    var deadline = new Promise(function (resolve, reject) {
      timeout = setTimeout(function () {
        if (controller) controller.abort();
        reject(new Error("Inquiry confirmation timed out"));
      }, 20000);
    });
    Promise.race([request, deadline])
      .then(function (payload) {
        /* FormSubmit returns success as the STRING "true". Accept the boolean
           too, in case that ever changes. */
        var delivered = payload && (payload.success === true || payload.success === "true");
        if (!delivered) throw new Error("Endpoint reported failure");
        /* Analytics: the inquiry happened + which channel produced it.
           Deliberately NO names, emails, phones, or message text. */
        try {
          if (window.smTrack) {
            window.smTrack("inquiry_submit", {
              heard_about: data.get("heard_about") || "(not answered)",
              utm_source: data.get("utm_source") || "",
              utm_medium: data.get("utm_medium") || ""
            });
          }
        } catch (err) { /* Optional analytics must never hide a confirmed inquiry. */ }
        showSuccess();
        resetForm();
      })
      .catch(function () {
        say("We couldn’t confirm your inquiry was received. You can email us at " + (config.email || "the address above") + ".", false);
        if (recovery && recoveryLink) {
          updateRecovery();
          recovery.hidden = false;
        }
      })
      .then(function () {
        clearTimeout(timeout);
        inFlight = false;
        button.disabled = false;
        form.removeAttribute("aria-busy");
      });
  }

  /* Replace the form with a clear success state: what happened, when we
     reply, and the next step. The form stays in the DOM (display:none)
     so "Send another inquiry" can bring it straight back. */
  function showSuccess() {
    var success = document.querySelector("[data-form-success]");
    if (!success) { say("Sent! We’ll get back to you within a day or two.", true); return; }
    say("", true);
    form.style.display = "none";
    success.hidden = false;
    success.focus();
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    var again = success.querySelector("[data-form-again]");
    if (again && !again.__wired) {
      again.__wired = true;
      again.addEventListener("click", function () {
        success.hidden = true;
        form.style.display = "";
        say("", true);
        form.querySelector("input, select, textarea").focus();
      });
    }
  }

  function emailDraft(data) {
    var pieces = data.getAll("pieces").join(", ") || "Not sure yet";
    var lines = [
      "Names: " + data.get("names"),
      "Email: " + data.get("email"),
      "Planning as: " + (data.get("planning_role") || "Not specified"),
      "Phone: " + (data.get("phone") || "—"),
      "Event date: " + (data.get("date") || "TBD"),
      "Venue / city: " + (data.get("venue") || "—"),
      "Interested in: " + pieces,
      "Rent or buy: " + data.get("mode"),
      "Transport: " + (data.get("transport") || "Not selected"),
      "How you found us: " + (data.get("heard_about") || "Not specified"),
      "",
      data.get("message") || ""
    ];
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(function (key) {
      if (data.get(key)) lines.push(key + ": " + data.get(key));
    });

    var subject = "Smith Made event inquiry — " + data.get("names") + (data.get("date") ? " — " + data.get("date") : "");
    return "mailto:" + (config.email || "") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function submitViaEmail(data) {
    say("Opening your email app with everything filled in — just press send. If nothing opens, email us at " + (config.email || "the address above") + ".", true);
    window.location.href = emailDraft(data);
  }
})();
