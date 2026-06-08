```javascript
document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
     MOBILE NAVIGATION
  ===================================================== */

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("active");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* =====================================================
     COUNT-UP ANIMATION
  ===================================================== */

  const countUpNumbers = document.querySelectorAll(".count-up");

  function formatNumber(number) {
    return number.toLocaleString("en-US");
  }

  function runCountUp(element) {
    if (element.dataset.animated === "true") {
      return;
    }

    const target = Number(element.dataset.target);
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";

    if (!Number.isFinite(target)) {
      element.textContent = prefix + "0" + suffix;
      return;
    }

    element.dataset.animated = "true";

    const duration = 1400;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = Math.floor(easedProgress * target);

      element.textContent =
        prefix + formatNumber(currentNumber) + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent =
          prefix + formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(updateCount);
  }

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
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

    countUpNumbers.forEach(function (number) {
      countObserver.observe(number);
    });
  } else {
    countUpNumbers.forEach(function (number) {
      runCountUp(number);
    });
  }


  /* =====================================================
     FULL-SIZE IMAGE LIGHTBOX
  ===================================================== */

  const galleryImages = document.querySelectorAll(
    ".gallery-item img, .design-piece img"
  );

  if (galleryImages.length === 0) {
    return;
  }

  let currentImageIndex = 0;
  const imageList = Array.from(galleryImages);

  /* Create full-screen overlay */

  const lightbox = document.createElement("div");
  lightbox.id = "portfolio-fullscreen-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");

  Object.assign(lightbox.style, {
    position: "fixed",
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "100%",
    zIndex: "999999",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    padding: "70px 60px 45px",
    boxSizing: "border-box"
  });


  /* Create full-size image */

  const fullImage = document.createElement("img");
  fullImage.id = "portfolio-fullscreen-image";

  Object.assign(fullImage.style, {
    display: "block",
    width: "auto",
    height: "auto",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 130px)",
    objectFit: "contain",
    objectPosition: "center",
    borderRadius: "8px",
    boxShadow: "0 20px 70px rgba(0, 0, 0, 0.55)"
  });


  /* Create caption */

  const caption = document.createElement("p");

  Object.assign(caption.style, {
    position: "absolute",
    left: "20px",
    right: "20px",
    bottom: "15px",
    margin: "0",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "15px",
    lineHeight: "1.4",
    textAlign: "center"
  });


  /* Create close button */

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.innerHTML = "&times;";
  closeButton.setAttribute("aria-label", "Close full-size image");

  Object.assign(closeButton.style, {
    position: "absolute",
    top: "16px",
    right: "20px",
    zIndex: "2",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    border: "1px solid rgba(255, 255, 255, 0.35)",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "34px",
    lineHeight: "1",
    cursor: "pointer"
  });


  /* Create previous button */

  const previousButton = document.createElement("button");
  previousButton.type = "button";
  previousButton.innerHTML = "&#10094;";
  previousButton.setAttribute("aria-label", "Previous image");

  Object.assign(previousButton.style, {
    position: "absolute",
    top: "50%",
    left: "15px",
    transform: "translateY(-50%)",
    zIndex: "2",
    width: "48px",
    height: "60px",
    border: "0",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    color: "#ffffff",
    fontSize: "28px",
    cursor: "pointer"
  });


  /* Create next button */

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.innerHTML = "&#10095;";
  nextButton.setAttribute("aria-label", "Next image");

  Object.assign(nextButton.style, {
    position: "absolute",
    top: "50%",
    right: "15px",
    transform: "translateY(-50%)",
    zIndex: "2",
    width: "48px",
    height: "60px",
    border: "0",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    color: "#ffffff",
    fontSize: "28px",
    cursor: "pointer"
  });


  /* Add lightbox elements to the page */

  lightbox.appendChild(fullImage);
  lightbox.appendChild(caption);
  lightbox.appendChild(closeButton);
  lightbox.appendChild(previousButton);
  lightbox.appendChild(nextButton);

  document.body.appendChild(lightbox);


  /* Display selected image */

  function showImage(index) {
    if (index < 0) {
      currentImageIndex = imageList.length - 1;
    } else if (index >= imageList.length) {
      currentImageIndex = 0;
    } else {
      currentImageIndex = index;
    }

    const selectedImage = imageList[currentImageIndex];

    const imageSource =
      selectedImage.currentSrc ||
      selectedImage.getAttribute("src");

    const imageDescription =
      selectedImage.getAttribute("alt") ||
      "Portfolio image";

    fullImage.src = imageSource;
    fullImage.alt = imageDescription;
    caption.textContent = imageDescription;
  }


  /* Open the lightbox */

  function openLightbox(image) {
    const selectedIndex = imageList.indexOf(image);

    if (selectedIndex === -1) {
      return;
    }

    showImage(selectedIndex);

    lightbox.style.setProperty("display", "flex", "important");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    closeButton.focus();
  }


  /* Close the lightbox */

  function closeLightbox() {
    lightbox.style.setProperty("display", "none", "important");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    fullImage.src = "";
    fullImage.alt = "";
    caption.textContent = "";
  }


  /* Make gallery images clickable */

  imageList.forEach(function (image) {
    image.style.cursor = "zoom-in";
    image.setAttribute("tabindex", "0");
    image.setAttribute("role", "button");

    image.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      openLightbox(image);
    });

    image.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });


  /* Lightbox controls */

  closeButton.addEventListener("click", function (event) {
    event.stopPropagation();
    closeLightbox();
  });

  previousButton.addEventListener("click", function (event) {
    event.stopPropagation();
    showImage(currentImageIndex - 1);
  });

  nextButton.addEventListener("click", function (event) {
    event.stopPropagation();
    showImage(currentImageIndex + 1);
  });

  fullImage.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });


  /* Keyboard controls */

  document.addEventListener("keydown", function (event) {
    if (lightbox.style.display !== "flex") {
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
});
```
