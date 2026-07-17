/* ==========================================================================
   Picture Perfect Painting — shared site JavaScript
   Kept intentionally small and dependency-free.

   1. Mobile navigation toggle
   2. Gallery: category filters + lightbox
   3. Contact form: AJAX submit to Formspree with inline success/error
   4. Footer year
   ========================================================================== */

(function () {
  "use strict";

  /* 1. MOBILE NAVIGATION -------------------------------------------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close the menu when a link is chosen or when focus leaves via Escape
    siteNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* 2. GALLERY ------------------------------------------------------------ */
  var galleryGrid = document.querySelector(".gallery-grid");

  if (galleryGrid) {
    var filterButtons = Array.prototype.slice.call(
      document.querySelectorAll(".filter-btn")
    );
    var items = Array.prototype.slice.call(
      galleryGrid.querySelectorAll(".gallery-item")
    );

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter");

        filterButtons.forEach(function (other) {
          other.setAttribute("aria-pressed", other === button ? "true" : "false");
        });

        items.forEach(function (item) {
          var categories = (item.getAttribute("data-category") || "").split(" ");
          var show = filter === "all" || categories.indexOf(filter) !== -1;
          item.classList.toggle("is-hidden", !show);
        });
      });
    });

    /* Lightbox — uses the native <dialog> element, which gives us focus
       containment, Escape-to-close, and a backdrop for free. */
    var lightbox = document.getElementById("lightbox");

    if (lightbox && typeof lightbox.showModal === "function") {
      var lightboxImg = lightbox.querySelector("img");
      var lightboxCaption = lightbox.querySelector(".lightbox-caption");
      var currentIndex = 0;
      var lastTrigger = null;

      var visibleItems = function () {
        return items.filter(function (item) {
          return !item.classList.contains("is-hidden");
        });
      };

      var showItem = function (index) {
        var list = visibleItems();
        if (!list.length) return;
        currentIndex = (index + list.length) % list.length;
        var thumb = list[currentIndex].querySelector("img");
        // data-full lets thumbnails stay small while the lightbox loads the
        // full-size version. Falls back to the thumbnail src.
        lightboxImg.src = thumb.getAttribute("data-full") || thumb.src;
        lightboxImg.alt = thumb.alt;
        lightboxCaption.textContent =
          list[currentIndex].querySelector("figcaption").textContent;
      };

      galleryGrid.addEventListener("click", function (event) {
        var trigger = event.target.closest(".gallery-item button");
        if (!trigger) return;
        lastTrigger = trigger;
        showItem(visibleItems().indexOf(trigger.closest(".gallery-item")));
        lightbox.showModal();
      });

      lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
        showItem(currentIndex - 1);
      });
      lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
        showItem(currentIndex + 1);
      });
      lightbox.querySelector(".lightbox-close").addEventListener("click", function () {
        lightbox.close();
      });
      lightbox.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft") showItem(currentIndex - 1);
        if (event.key === "ArrowRight") showItem(currentIndex + 1);
      });
      // Click on the dark backdrop (outside the panel) closes the dialog
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.close();
      });
      // Return focus to the thumbnail that opened the lightbox
      lightbox.addEventListener("close", function () {
        if (lastTrigger) lastTrigger.focus();
      });
    }
  }

  /* 3. CONTACT FORM (Formspree) -------------------------------------------
     The form works two ways:
     - With JavaScript: submits in the background and shows an inline
       confirmation without leaving the page.
     - Without JavaScript: falls back to a normal POST to Formspree.
     Until a real Formspree endpoint is configured (see README.md), the
     placeholder is detected and visitors are pointed to phone/email. */
  var form = document.getElementById("estimate-form");

  if (form) {
    var statusBox = document.getElementById("form-status");
    var submitButton = form.querySelector('button[type="submit"]');

    var setStatus = function (type, message) {
      statusBox.className = "form-status is-" + type;
      statusBox.textContent = message;
      statusBox.focus();
    };

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        setStatus(
          "error",
          "The online form isn’t connected yet — please call (360) 485-0355 or email " +
            "chris.smith@pictureperfectpainting360.com and we’ll get right back to you."
        );
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = "Sending…";

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            form.reset();
            setStatus(
              "success",
              "Thanks — your estimate request is on its way! We’ll be in touch soon. " +
                "Need us sooner? Call (360) 485-0355."
            );
          } else {
            return response.json().then(function (data) {
              throw new Error(
                data.errors && data.errors.length
                  ? data.errors.map(function (e) { return e.message; }).join(", ")
                  : "Something went wrong."
              );
            });
          }
        })
        .catch(function () {
          setStatus(
            "error",
            "Sorry, the form couldn’t send. Please call (360) 485-0355 or email " +
              "chris.smith@pictureperfectpainting360.com instead."
          );
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.textContent = "Send Estimate Request";
        });
    });
  }

  /* 4. FOOTER YEAR ---------------------------------------------------------- */
  var yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
