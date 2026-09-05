(function () {
  var headerInner = document.querySelector(".header-inner");
  var toggle = document.querySelector(".menu-toggle");
  var more = document.querySelector(".nav-more");
  var cookie = document.querySelector(".cookie");
  var accept = document.querySelector("[data-accept-cookies]");
  var form = document.querySelector("[data-contact-form]");

  if (toggle && headerInner) {
    toggle.addEventListener("click", function () {
      headerInner.classList.toggle("nav-open");
      toggle.setAttribute(
        "aria-expanded",
        headerInner.classList.contains("nav-open") ? "true" : "false"
      );
    });
  }

  if (more) {
    var button = more.querySelector("button");
    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        more.classList.toggle("open");
      });
    }
    document.addEventListener("click", function (event) {
      if (!more.contains(event.target)) {
        more.classList.remove("open");
      }
    });
  }

  if (cookie && !localStorage.getItem("ingenio-cookies")) {
    cookie.classList.add("show");
  }
  if (accept) {
    accept.addEventListener("click", function () {
      localStorage.setItem("ingenio-cookies", "1");
      cookie.classList.remove("show");
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var message = (form.querySelector('[name="message"]') || {}).value || "";
      var newsletter = form.querySelector('[name="newsletter"]');
      var subject = encodeURIComponent("Ingenio Care website inquiry");
      var body = encodeURIComponent(
        "Name: " +
          name +
          "\nEmail: " +
          email +
          "\nNewsletter: " +
          (newsletter && newsletter.checked ? "Yes" : "No") +
          "\n\n" +
          message
      );
      window.location.href =
        "mailto:alex.kumar@ingeniocare.com?subject=" + subject + "&body=" + body;
      var success = document.querySelector(".success");
      if (success) success.classList.add("show");
      form.reset();
    });
  }
})();
