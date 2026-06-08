```javascript
document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const menuIsOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", menuIsOpen);
      menuToggle.setAttribute("aria-expanded", menuIsOpen);
    });

    // Close the mobile menu after selecting a navigation link
    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =====================================================
     COUNT-UP ANIMATION FOR MARKETING METRICS
  ===================================================== */

  const countUpNumbers = document.querySelectorAll(".count-up");

  const formatNumber = (number) => {
    return number.toLocaleString("en-US");
  };

  const runCountUp = (element) => {
    // Prevent the same number from animating more than once
    if (element.dataset.animated === "true") {
      return;
    }

    element.dataset.animated = "true";

    const target = Number(element.dataset.target);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";
    const duration = 1400;
    const startTime = performance.now();

    // Prevent NaN from appearing if data-target is missing
    if (!Number.isFinite(target)) {
      element.textContent = `${prefix}0${suffix}`;
      return;
    }

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Smoothly slows the animation near the final number
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easedProgress * target);

      element.textContent =
        `${prefix}${formatNumber(currentNumber)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent =
          `${prefix}${formatNumber(target)}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.4
      }
    );

    countUpNumbers.forEach((number) => {
      countObserver.observe(number);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    countUpNumbers.forEach((number) => {
      runCountUp(number);
    });
  }


  /* =====================================================
     IMAGE LIGHTBOX
     Photography and graphic-design galleries
  ===================================================== */

  const galleryImages = Array.from(
    document.querySelectorAll(
      ".gallery-item img, .design-piece img"
    )
  );

  if (galleryImages.length > 0) {
    // Create the lightbox automatically
    const lightbox = document.createElement("div");

    lightbox.className = "image-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute(
      "aria-label",
      "Full-size portfolio image"
    );

    lightbox.innerHTML = `
      <button
        class="lightbox-close"
        type="button"
        aria-label="Close full-size image"
      >
        &times;
      </button>

      <button
        class="lightbox-arrow lightbox-previous"
        type="button"
        aria-label="View previous image"
      >
        &#10094;
      </button>

      <div class="lightbox-content">
        <img
          class="lightbox-image"
          src=""
          alt=""
        >

        <p class="lightbox-caption"></p>
      </div>

      <button
        class="lightbox-arrow lightbox-next"
        type="button"
        aria-label="View next image"
      >
        &#10095;
      </button>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage =
      lightbox.querySelector(".lightbox-image");

    const lightboxCaption =
      lightbox.querySelector(".lightbox-caption");

    const closeButton =
      lightbox.querySelector(".lightbox-close");

    const previousButton =
      lightbox.querySelector(".lightbox-previous");

    const nextButton =
      lightbox.querySelector(".lightbox-next");

    let currentImageIndex = 0;
    let previouslyFocusedElement = null;


    /* Display a selected gallery image */

    const showImage = (index) => {
      if (index < 0) {
        currentImageIndex = galleryImages.length - 1;
      } else if (index >= galleryImages.length) {
        currentImageIndex = 0;
      } else {
        currentImageIndex = index;
      }

      const selectedImage =
        galleryImages[currentImageIndex];

      const imageSource =
        selectedImage.currentSrc ||
        selectedImage.getAttribute("src");

      const imageDescription =
        selectedImage.getAttribute("alt") ||
        "Portfolio image";

      lightboxImage.src = imageSource;
      lightboxImage.alt = imageDescription;
      lightboxCaption.textContent = imageDescription;
    };


    /* Open the lightbox */

    const openLightbox = (selectedImage) => {
      const imageIndex =
        galleryImages.indexOf(selectedImage);

      if (imageIndex === -1) {
        return;
      }

      previouslyFocusedElement = document.activeElement;

      showImage(imageIndex);

      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");

      closeButton.focus();
    };


    /* Close the lightbox */

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("lightbox-open");

      setTimeout(() => {
        if (!lightbox.classList.contains("active")) {
          lightboxImage.src = "";
          lightboxImage.alt = "";
          lightboxCaption.textContent = "";
        }
      }, 250);

      if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === "function"
      ) {
        previouslyFocusedElement.focus();
      }
    };


    /* Make each gallery image clickable */

    galleryImages.forEach((image) => {
      image.style.cursor = "zoom-in";
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");

      const imageDescription =
        image.getAttribute("alt") || "Portfolio image";

      image.setAttribute(
        "aria-label",
        `${imageDescription}. Open full-size image.`
      );

      image.addEventListener("click", () => {
        openLightbox(image);
      });

      image.addEventListener("keydown", (event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });


    /* Lightbox buttons */

    closeButton.addEventListener("click", closeLightbox);

    previousButton.addEventListener("click", (event) => {
      event.stopPropagation();
      showImage(currentImageIndex - 1);
    });

    nextButton.addEventListener("click", (event) => {
      event.stopPropagation();
      showImage(currentImageIndex + 1);
    });


    /* Close by clicking the dark background */

    lightbox.addEventListener("click", (event) => {
      if (
        event.target === lightbox ||
        event.target.classList.contains("lightbox-content")
      ) {
        closeLightbox();
      }
    });


    /* Keyboard controls */

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("active")) {
        return;
      }

      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showImage(currentImageIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showImage(currentImageIndex + 1);
      }
    });
  }
});
```
