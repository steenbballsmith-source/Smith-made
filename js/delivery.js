/* The published transport policy, expressed as a planning estimate.
   Availability, route miles, tax, access and handling still need a written quote. */
(function () {
  "use strict";

  function estimate(miles, service, pickup) {
    if (typeof miles !== "number" || !Number.isFinite(miles) || miles < 0) return null;
    if (["customer", "delivery", "return"].indexOf(service) === -1) return null;
    if (["standard", "late", "midnight"].indexOf(pickup) === -1) return null;
    if (service === "customer") return { total: 0, trip: 0, trips: 0, afterHours: 0 };
    if (miles > 50) return { custom: true };
    // Work in cents; allow fractional road miles and round each trip up to $5.
    var trip = Math.ceil((7500 + Math.max(0, miles - 15) * 225) / 500) * 5;
    var trips = service === "return" ? 2 : 1;
    var afterHours = trips === 2 ? (pickup === "midnight" ? 125 : pickup === "late" ? 75 : 0) : 0;
    return { total: trip * trips + afterHours, trip: trip, trips: trips, afterHours: afterHours };
  }

  if (typeof module === "object" && module.exports) module.exports = estimate;
  if (typeof document === "undefined") return;
  var calculator = document.querySelector("[data-delivery-estimate]");
  if (!calculator) return;
  var milesInput = calculator.querySelector("#estimate-miles");
  var serviceInput = calculator.querySelector("#estimate-service");
  var pickupInput = calculator.querySelector("#estimate-pickup");
  var result = calculator.querySelector("[data-estimate-total]");
  var detail = calculator.querySelector("[data-estimate-detail]");
  var money = function (value) { return "$" + value.toLocaleString("en-US"); };

  function update() {
    var customer = serviceInput.value === "customer";
    milesInput.disabled = customer;
    pickupInput.disabled = serviceInput.value !== "return";
    calculator.querySelector("[data-pickup-time]").hidden = serviceInput.value !== "return";
    var miles = customer ? 0 : milesInput.value.trim() === "" ? NaN : Number(milesInput.value);
    var quote = estimate(miles, serviceInput.value, pickupInput.value);
    if (!quote) {
      result.textContent = "Enter road miles";
      detail.textContent = "Use a non-negative, one-way road distance from Greenville to your venue.";
    } else if (quote.custom) {
      result.textContent = "Custom route quote";
      detail.textContent = "Venues more than 50 road miles from Greenville need a custom transport quote. Send your venue and date.";
    } else {
      result.textContent = money(quote.total);
      detail.textContent = customer ? "Customer pickup and return by appointment. Confirm vehicle fit and return by noon the next day."
        : quote.trips + (quote.trips === 1 ? " trip" : " trips") + " at " + money(quote.trip) + " each"
          + (quote.afterHours ? ", plus " + money(quote.afterHours) + " after-hours pickup" : "") + ".";
    }
  }
  calculator.addEventListener("input", update);
  calculator.addEventListener("change", update);
  update();
})();
