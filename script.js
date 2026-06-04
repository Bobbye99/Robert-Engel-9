const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// COUNT-UP ANIMATION FOR MARKETING METRICS
const countUpNumbers = document.querySelectorAll(".count-up");

const formatNumber = (number) => {
  return number.toLocaleString("en-US");
};

const runCountUp = (element) => {
  const target = Number(element.dataset.target);
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  const duration = 1400;
  const startTime = performance.now();

  const updateCount = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentNumber = Math.floor(progress * target);

    element.textContent = `${prefix}${formatNumber(currentNumber)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      element.textContent = `${prefix}${formatNumber(target)}${suffix}`;
    }
  };

  requestAnimationFrame(updateCount);
};

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
    threshold: 0.6
  }
);

countUpNumbers.forEach((number) => {
  countObserver.observe(number);
});
