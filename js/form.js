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

  function say(message, ok) {
    status.textContent = message;
    status.classList.toggle("is-ok", Boolean(ok));
    status.classList.toggle("is-error", !ok);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    var data = new FormData(form);

    /* Honeypot: real visitors never see this field. If it's filled,
       quietly accept and do nothing. */
    if (data.get("company")) {
      say("Thank you — we’ll be in touch soon.", true);
      form.reset();
      return;
    }
    data.delete("company");

    if (config.formEndpoint) {
      /* Delivery-service niceties (FormSubmit/Formspree understand these;
         harmless extras otherwise): subject line + tidy table layout. */
      data.append("_subject", "Wedding inquiry — " + (data.get("names") || "new couple"));
      data.append("_template", "table");
      submitToEndpoint(data);
    } else {
      submitViaEmail(data);
    }
  });

  function submitToEndpoint(data) {
    var button = form.querySelector("[type=submit]");
    button.disabled = true;
    say("Sending…", true);

    fetch(config.formEndpoint, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        say(config.dateHoldUrl
          ? "Sent! We’ll get back to you within a day or two. Want the date locked today? Pay the $50 date hold above — it counts toward your balance."
          : "Sent! We’ll get back to you within a day or two.", true);
        form.reset();
      })
      .catch(function () {
        say("Something went wrong sending the form. Please email us directly at " + (config.email || "the address above") + ".", false);
      })
      .then(function () {
        button.disabled = false;
      });
  }

  function submitViaEmail(data) {
    var pieces = data.getAll("pieces").join(", ") || "Not sure yet";
    var lines = [
      "Names: " + data.get("names"),
      "Email: " + data.get("email"),
      "Phone: " + (data.get("phone") || "—"),
      "Wedding date: " + (data.get("date") || "TBD"),
      "Venue / city: " + (data.get("venue") || "—"),
      "Interested in: " + pieces,
      "Rent or buy: " + data.get("mode"),
      "",
      data.get("message") || ""
    ];

    var subject = "Wedding inquiry — " + data.get("names") + (data.get("date") ? " — " + data.get("date") : "");
    var mailto = "mailto:" + (config.email || "") +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(lines.join("\n"));

    say("Opening your email app with everything filled in — just press send. If nothing opens, email us at " + (config.email || "the address above") + ".", true);
    window.location.href = mailto;
  }
})();
