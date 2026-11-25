/* ==========================================================
   Explore Yellowstone - script.js
   1. Trip countdown: shows how many days until the arrival date
   2. Form validation: checks required fields before "submitting"
   ========================================================== */

// Get the page elements we need
var form = document.getElementById("trip-form");
var nameInput = document.getElementById("name");
var emailInput = document.getElementById("email");
var arrivalInput = document.getElementById("arrival");
var groupInput = document.getElementById("group-size");
var countdownBox = document.getElementById("countdown");
var errorBox = document.getElementById("form-errors");
var successBox = document.getElementById("form-success");

// Only run the script on the page that has the form
if (form) {

  /* ---------- Helper: today's date at midnight ---------- */
  function getToday() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /* ---------- Helper: turn "2027-06-15" into a local Date ---------- */
  function parseDate(value) {
    var parts = value.split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  /* ---------- Do not allow dates in the past ---------- */
  var today = getToday();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  arrivalInput.min = today.getFullYear() + "-" + month + "-" + day;

  /* ---------- 1. Trip countdown ---------- */
  function updateCountdown() {
    if (arrivalInput.value === "") {
      countdownBox.textContent = "";
      return;
    }

    var tripDate = parseDate(arrivalInput.value);
    var msPerDay = 1000 * 60 * 60 * 24;
    var daysLeft = Math.round((tripDate - getToday()) / msPerDay);

    if (daysLeft > 1) {
      countdownBox.textContent = "Your Yellowstone adventure is " + daysLeft + " days away!";
    } else if (daysLeft === 1) {
      countdownBox.textContent = "Your Yellowstone adventure starts tomorrow!";
    } else if (daysLeft === 0) {
      countdownBox.textContent = "Your Yellowstone adventure starts today. Have a great trip!";
    } else {
      countdownBox.textContent = "That date has already passed. Please choose a future date.";
    }
  }

  arrivalInput.addEventListener("change", updateCountdown);
  arrivalInput.addEventListener("input", updateCountdown);

  /* ---------- 2. Form validation ---------- */

  // Mark a field as invalid (or valid) for screen readers and styling
  function setInvalid(input, isInvalid) {
    if (isInvalid) {
      input.setAttribute("aria-invalid", "true");
      input.classList.add("input-error");
    } else {
      input.removeAttribute("aria-invalid");
      input.classList.remove("input-error");
    }
  }

  function isValidEmail(email) {
    // Simple check: something@something.something
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  form.addEventListener("submit", function (event) {
    // Stop the page from reloading (there is no server for this project)
    event.preventDefault();

    var errors = [];
    var firstBadField = null;

    // Name
    var nameValue = nameInput.value.trim();
    var nameBad = nameValue === "";
    setInvalid(nameInput, nameBad);
    if (nameBad) {
      errors.push("Please enter your full name.");
      firstBadField = firstBadField || nameInput;
    }

    // Email
    var emailValue = emailInput.value.trim();
    var emailBad = !isValidEmail(emailValue);
    setInvalid(emailInput, emailBad);
    if (emailBad) {
      errors.push("Please enter a valid email address, such as name@example.com.");
      firstBadField = firstBadField || emailInput;
    }

    // Arrival date
    var dateBad = arrivalInput.value === "" || parseDate(arrivalInput.value) < getToday();
    setInvalid(arrivalInput, dateBad);
    if (dateBad) {
      errors.push("Please choose an arrival date that is today or later.");
      firstBadField = firstBadField || arrivalInput;
    }

    // Group size (optional, but must be 1 to 20 if filled in)
    var groupValue = groupInput.value;
    var groupBad = groupValue !== "" && (Number(groupValue) < 1 || Number(groupValue) > 20);
    setInvalid(groupInput, groupBad);
    if (groupBad) {
      errors.push("Number of travelers must be between 1 and 20.");
      firstBadField = firstBadField || groupInput;
    }

    // Show errors, or show the thank-you message
    if (errors.length > 0) {
      successBox.textContent = "";
      errorBox.innerHTML = "";

      var heading = document.createElement("p");
      heading.textContent = "Please fix the following:";
      errorBox.appendChild(heading);

      var list = document.createElement("ul");
      for (var i = 0; i < errors.length; i++) {
        var item = document.createElement("li");
        item.textContent = errors[i];
        list.appendChild(item);
      }
      errorBox.appendChild(list);

      firstBadField.focus();
    } else {
      errorBox.innerHTML = "";
      successBox.textContent = "Thank you, " + nameValue +
        "! Your Yellowstone trip planner will be sent to " + emailValue + ".";
      form.reset();
      countdownBox.textContent = "";
    }
  });
}
