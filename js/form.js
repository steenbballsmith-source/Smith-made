/* Inquiry enhancement. The native POST remains available without JavaScript.
   Private reviews use method="dialog" and never send a request. */
(function () {
  "use strict";
  var config = window.SMITH_MADE || {};
  var form = document.querySelector("[data-inquiry-form]");
  var status = document.querySelector("[data-form-status]");
  if (!form || !status) return;

  var preview = (form.getAttribute("method") || "").toLowerCase() === "dialog";
  var button = form.querySelector("[type=submit]");
  var reviewButton = form.querySelector("[data-form-review]");
  var review = form.querySelector("[data-inquiry-review]");
  var summary = form.querySelector("[data-inquiry-summary]");
  var email = form.querySelector("[data-inquiry-email]");
  var copy = form.querySelector("[data-inquiry-copy]");
  var note = form.querySelector("[data-inquiry-note]");
  var pending = false;
  var completed = false;
  var submitLabel = preview ? "Preview inquiry" : "Send inquiry";
  button.textContent = submitLabel;
  reviewButton.hidden = false;

  // A reference connects an email, a retry, and the owner's existing lead record.
  // It contains no personal data and is kept only in this form, not browser storage.
  function ensureReference() {
    var field = form.querySelector('[name="submission_id"]');
    if (!field || field.value) return;
    var random = window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID() : Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
    field.value = "SM-" + random;
  }
  function formData() { ensureReference(); return new FormData(form); }
  ensureReference();
  form.addEventListener("reset", function () {
    var field = form.querySelector('[name="submission_id"]');
    if (field) field.value = "";
  });

  function say(message, kind) {
    status.textContent = message;
    status.classList.toggle("is-ok", kind === "success");
    status.classList.toggle("is-error", kind === "error");
  }
  function details(data) {
    return [
      "Inquiry reference: " + (data.get("submission_id") || "Not assigned"),
      "Names: " + (data.get("names") || "Not provided"),
      "Email: " + (data.get("email") || "Not provided"),
      "Planning as: " + (data.get("planning_role") || "Not specified"),
      "Phone: " + (data.get("phone") || "Not provided"),
      "Event date: " + (data.get("date") || "TBD"),
      "Event type: " + (data.get("event_type") || "Not specified"),
      "Venue / city: " + (data.get("venue") || "Not decided yet"),
      "Interested in: " + (data.getAll("pieces").join(", ") || "Not sure yet"),
      "Suggested pairing: " + (data.get("requested_set") || "Individual pieces"),
      "Rent or buy: " + (data.get("mode") || "Not sure yet"),
      "Transport: " + (data.get("transport") || "Not decided yet"),
      "Found us through: " + (data.get("heard_about") || "Not specified"),
      "", data.get("message") || ""
    ].join("\n");
  }
  function reviewDetails(data, focus) {
    summary.value = details(data);
    var subject = "Smith Made event inquiry: " + (data.get("names") || "new inquiry") +
      (data.get("date") ? " / " + data.get("date") : "");
    var attribution = ["utm_source", "utm_medium", "utm_campaign", "utm_content"].filter(function (key) {
      return data.get(key);
    }).map(function (key) { return key + ": " + data.get(key); });
    var body = summary.value +
      (attribution.length ? "\n\n" + attribution.join("\n") : "");
    email.href = "mailto:" + (config.email || "will.smithmade@gmail.com") +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    email.hidden = preview || pending;
    review.hidden = false;
    note.textContent = preview ? "Preview only. No inquiry has been sent." :
      "Review or copy these details. Opening an email draft does not send it; choose Send in your email app.";
    if (focus) summary.focus();
  }
  reviewButton.addEventListener("click", function () { reviewDetails(formData(), true); });
  form.addEventListener("input", function () {
    if (!pending && !completed && !review.hidden) reviewDetails(formData(), false);
  });
  copy.addEventListener("click", async function () {
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(summary.value);
      note.textContent = "Details copied. Paste them into your email when you are ready.";
    } catch (_) {
      summary.focus(); summary.select();
      note.textContent = "Your details are selected. Use Copy on your phone or keyboard, then paste them into an email.";
    }
  });
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (pending || completed || !form.reportValidity()) return;
    var data = formData();
    if (data.get("company")) {
      say("Please use the direct email link to ask about your event.", "error");
      return;
    }
    data.delete("company");
    if (preview) {
      reviewDetails(data, false);
      say("Preview prepared. Your inquiry has not been sent.", "success");
      return;
    }
    if (!config.formEndpoint) {
      reviewDetails(data, false);
      say("Your email draft is ready below. Open it and choose Send in your email app.");
      return;
    }
    if (navigator.onLine === false) {
      reviewDetails(data, false);
      say("You are offline. Your details are still here. Reconnect before sending, or copy them into an email.", "error");
      return;
    }
    pending = true;
    button.disabled = true;
    reviewButton.disabled = true;
    email.hidden = true;
    button.textContent = "Sending inquiry…";
    form.setAttribute("aria-busy", "true");
    say("Sending your inquiry. Please keep this page open.");
    data.set("_subject", "Smith Made event inquiry: " + (data.get("names") || "new inquiry") +
      (data.get("date") ? " / " + data.get("date") : ""));
    data.set("_template", "table");
    var controller = new AbortController();
    var timer;
    var deadline = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        controller.abort();
        reject(new Error("Confirmation timed out"));
      }, 20000);
    });
    var locked = Array.from(form.querySelectorAll('input:not(:disabled), select:not(:disabled), textarea:not([readonly]):not(:disabled)'));
    locked.forEach(function (field) { field.disabled = true; });
    try {
      var request = Promise.resolve().then(function () {
        return fetch(config.formEndpoint, {
          method: "POST", body: data, headers: { Accept: "application/json" }, signal: controller.signal
        });
      }).then(function (response) {
        if (!response.ok) throw new Error("Unconfirmed request");
        // A 200 HTML verification page is not an acknowledgement. Require the endpoint's JSON.
        return response.json();
      });
      var payload = await Promise.race([request, deadline]);
      if (!payload || (payload.success !== true && payload.success !== "true")) throw new Error("No acknowledgement");
      completed = true;
      // Analytics must never turn an acknowledged inquiry into a failed-send message.
      try {
        if (window.smTrack) window.smTrack("inquiry_submit", {
          heard_about: data.get("heard_about") || "(not answered)",
          utm_source: data.get("utm_source") || "", utm_medium: data.get("utm_medium") || ""
        });
      } catch (_) {}
      showSuccess(data);
    } catch (error) {
      reviewDetails(data, false);
      say(controller.signal.aborted || error.name === "AbortError"
        ? "Confirmation took too long. Your inquiry may have arrived. Keep these details and email us before retrying to avoid a duplicate."
        : "We couldn’t confirm your inquiry. Your details are still here. Try again or open the email draft below.", "error");
    } finally {
      clearTimeout(timer);
      pending = false;
      locked.forEach(function (field) { field.disabled = false; });
      button.disabled = false;
      button.textContent = completed ? "Inquiry submitted" : submitLabel;
      reviewButton.disabled = completed;
      email.hidden = preview || completed;
      form.removeAttribute("aria-busy");
    }
  });
  function showSuccess(data) {
    var success = document.querySelector("[data-form-success]");
    if (!success) { say("Inquiry submitted for processing. We usually reply within a day or two.", "success"); return; }
    var reference = success.querySelector('[data-inquiry-reference]');
    if (reference) reference.textContent = "Your reference: " + data.get("submission_id");
    form.style.display = "none";
    success.hidden = false;
    success.focus({ preventScroll: true });
    var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.classList.contains("motion-paused");
    success.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "center" });
    var again = success.querySelector("[data-form-again]");
    var attribution = Array.from(form.querySelectorAll('[data-utm]')).map(function (field) {
      return { field: field, value: field.value };
    });
    form.reset();
    attribution.forEach(function (entry) { entry.field.value = entry.value; });
    review.hidden = true;
    say("");
    if (again && !again.__wired) {
      again.__wired = true;
      again.addEventListener("click", function () {
        completed = false;
        success.hidden = true;
        review.hidden = true;
        form.style.display = "";
        button.disabled = false;
        reviewButton.disabled = false;
        button.textContent = submitLabel;
        say("");
        ensureReference();
        form.querySelector("#f-names").focus();
      });
    }
  }
})();
