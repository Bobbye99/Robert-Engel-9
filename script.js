```javascript
document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const menuIsOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", menuIsOpen);
      menuToggle.setAttribute(
        "aria-expanded",
        String(menuIsOpen)
      );
    });

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =====================================================
     SCROLLING COUNT-UP NUMBERS
  ===================================================== */

  const countUpNumbers =
    document.querySelectorAll(".count-up");

  function formatNumber(number) {
    return Math.round(number).toLocaleString("en-US");
  }

  function animateNumber(element) {
    if (element.dataset.animated === "true") {
      return;
    }

    const target = Number(element.dataset.target);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";

    if (!Number.isFinite(target)) {
      console.error(
        "Invalid data-target on count-up element:",
        element
      );

      element.textContent = prefix + "0" + suffix;
      return;
    }

    element.dataset.animated = "true";

    const animationDuration = 1600;
    const startingTime = performance.now();

    function updateNumber(currentTime) {
      const elapsedTime = currentTime - startingTime;

      const progress = Math.min(
        elapsedTime / animationDuration,
        1
      );

      /* Smooth easing effect */
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue =
        Math.floor(target * easedProgress);

      element.textContent =
        prefix +
        formatNumber(currentValue) +
        suffix;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent =
          prefix +
          formatNumber(target) +
          suffix;
      }
    }

    requestAnimationFrame(updateNumber);
  }


  /* Start numbers when they scroll into view */

  if ("IntersectionObserver" in window) {
    const numberObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateNumber(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    countUpNumbers.forEach(function (number) {
      numberObserver.observe(number);
    });
  } else {
    /* Browser fallback */
    countUpNumbers.forEach(function (number) {
      animateNumber(number);
    });
  }
});
```
