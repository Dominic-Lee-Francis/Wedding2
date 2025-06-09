// ===================== DOMContentLoaded Main Handler =====================
document.addEventListener("DOMContentLoaded", function () {
  // ===================== 1. Countdown Timer =====================
  // --- Setup wedding date ---
  const weddingDate = new Date("November 22, 2025 13:00:00").getTime();

  // --- Update countdown display ---
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
  }

  // --- Initialize countdown ---
  updateCountdown();
  setInterval(updateCountdown, 60000);

  // ===================== 2. Image Gallery with Auto-Cycle =====================
  // --- Gallery setup ---
  const imageCount = 61; // Total number of images
  let currentImageIndex = 0;
  let autoSlideInterval;
  let resetTimeout;
  const imageElement = document.getElementById("current-image");

  // --- Preload and shuffle images ---
  const images = [];
  for (let i = 1; i <= imageCount; i++) {
    const img = new Image();
    img.src = `images/wedding${i}.jpg`;
    images.push(img);
  }

  // --- Shuffle function ---
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(images);

  // --- Load image with fade effect ---
  function loadImage(index) {
    currentImageIndex = index;
    imageElement.src = images[currentImageIndex].src;
    imageElement.style.opacity = 0;
    setTimeout(() => {
      imageElement.style.opacity = 1;
    }, 10);
  }

  // --- Auto-advance to next image ---
  function nextImage() {
    const newIndex =
      currentImageIndex >= images.length - 1 ? 0 : currentImageIndex + 1;
    loadImage(newIndex);
  }

  // --- Previous image ---
  function prevImage() {
    const newIndex =
      currentImageIndex <= 0 ? images.length - 1 : currentImageIndex - 1;
    loadImage(newIndex);
  }

  // --- Start and pause auto-cycling ---
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextImage, 4000);
  }
  function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // --- Pause for 20s after navigation, then reset gallery ---
  function pauseAndResetGallery() {
    pauseAutoSlide();
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      // Reset: shuffle, go to first image, and restart auto-slide
      shuffleArray(images);
      loadImage(0);
      startAutoSlide();
    }, 20000);
  }

  // --- Initialize gallery and UX events ---
  function initGallery() {
    loadImage(0); // Start with the first image in the shuffled array
    startAutoSlide();

    // Pause on hover/focus for better UX
    const gallery = document.querySelector(".gallery");
    gallery.addEventListener("mouseenter", pauseAutoSlide);
    gallery.addEventListener("mouseleave", startAutoSlide);
    gallery.addEventListener("focusin", pauseAutoSlide);
    gallery.addEventListener("focusout", startAutoSlide);

    // --- Touch support: swipe left/right to navigate ---
    let touchStartX = null;
    let touchStartY = null;
    gallery.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    });
    gallery.addEventListener("touchend", function (e) {
      if (touchStartX === null || touchStartY === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;
      // Only trigger if horizontal swipe is dominant
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        pauseAutoSlide();
        if (dx < 0) {
          nextImage();
        } else {
          prevImage();
        }
        clearTimeout(autoSlideInterval);
        autoSlideInterval = setTimeout(startAutoSlide, 10000);
      }
      touchStartX = null;
      touchStartY = null;
    });
  }

  // --- Manual navigation buttons ---
  document.getElementById("next-btn").addEventListener("click", () => {
    pauseAutoSlide();
    nextImage();
    clearTimeout(autoSlideInterval); // Clear any existing timeout
    autoSlideInterval = setTimeout(startAutoSlide, 10000); // Resume after 10s inactivity
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    pauseAutoSlide();
    prevImage();
    clearTimeout(autoSlideInterval); // Clear any existing timeout
    autoSlideInterval = setTimeout(startAutoSlide, 10000); // Resume after 10s inactivity
  });

  // --- Touch support for navigation buttons ---
  document.getElementById("next-btn").addEventListener("touchend", (e) => {
    e.preventDefault();
    pauseAutoSlide();
    nextImage();
    clearTimeout(autoSlideInterval);
    autoSlideInterval = setTimeout(startAutoSlide, 10000);
  });

  document.getElementById("prev-btn").addEventListener("touchend", (e) => {
    e.preventDefault();
    pauseAutoSlide();
    prevImage();
    clearTimeout(autoSlideInterval);
    autoSlideInterval = setTimeout(startAutoSlide, 10000);
  });

  // --- Initialize gallery ---
  initGallery();

  // ===================== 3. Schedule Cards Toggle =====================
  // --- Toggle function for schedule cards ---
  const day1Header = document.getElementById("day1-header");
  const day1Content = document.getElementById("day1-content");
  const day2Header = document.getElementById("day2-header");
  const day2Content = document.getElementById("day2-content");

  function toggleDayContent(header, content) {
    content.classList.toggle("active");
    const icon = header.querySelector(".toggle-icon");
    icon.textContent = content.classList.contains("active") ? "−" : "+";
  }

  // Click events
  day1Header.addEventListener("click", () =>
    toggleDayContent(day1Header, day1Content)
  );
  day2Header.addEventListener("click", () =>
    toggleDayContent(day2Header, day2Content)
  );

  // Touch events (for mobile/touch devices)
  day1Header.addEventListener("touchend", (e) => {
    e.preventDefault();
    toggleDayContent(day1Header, day1Content);
  });
  day2Header.addEventListener("touchend", (e) => {
    e.preventDefault();
    toggleDayContent(day2Header, day2Content);
  });

  // ===================== 4. Save the Date Button with Confetti =====================
  const saveDateBtn = document.getElementById("saveDateBtn");

  function handleSaveDateAction(e) {
    // Prevent duplicate triggers (e.g., touch and click)
    if (handleSaveDateAction.locked) return;
    handleSaveDateAction.locked = true;
    setTimeout(() => (handleSaveDateAction.locked = false), 500);

    // --- Button press animation ---
    saveDateBtn.classList.add("clicked");
    setTimeout(() => saveDateBtn.classList.remove("clicked"), 300);

    // --- Create confetti ---
    createCustomConfetti();

    // --- Trigger calendar download after delay ---
    setTimeout(createCalendarFile, 800);

    // Prevent default for touch events
    if (e && e.type === "touchend") e.preventDefault();
  }

  saveDateBtn.addEventListener("click", handleSaveDateAction);
  saveDateBtn.addEventListener("touchend", handleSaveDateAction);

  // --- Confetti effect ---
  function createCustomConfetti() {
    const confettiCount = 30;
    const buttonRect = saveDateBtn.getBoundingClientRect();
    const originX = buttonRect.left + buttonRect.width / 2;
    const originY = buttonRect.top + buttonRect.height / 2;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = new Image();
      confetti.src = "images/wonwon.png";
      confetti.className = "wonwon-confetti";

      // Calculate random movement (pre-calculated pixels)
      const angle = Math.random() * Math.PI * 2; // Random direction
      const distance = 200 + Math.random() * 350; // 200-350px
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      // Set CSS custom properties
      confetti.style.setProperty("--move-x", `${moveX}px`);
      confetti.style.setProperty("--move-y", `${moveY}px`);
      confetti.style.setProperty(
        "--rotation",
        `${Math.random() * 720 - 360}deg`
      );

      // Position at button center
      confetti.style.left = `${originX}px`;
      confetti.style.top = `${originY}px`;
      confetti.style.width = `${15 + Math.random() * 20}px`;

      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  }

  // --- Download calendar file ---
  function createCalendarFile() {
    const eventData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:Dom & Genie's Wedding",
      "DTSTART:20251122T150000",
      "DTEND:20251123T140000",
      `LOCATION:[Insert Venue Address]`,
      `DESCRIPTION:For details, visit: ${window.location.href}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");

    const blob = new Blob([eventData], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Dom-Genie-Wedding.ics";
    link.click();
    URL.revokeObjectURL(url);
  }

  // ===================== 5. Subtle Animations on Scroll =====================
  // --- Animate elements on scroll into view ---
  const animateOnScroll = function () {
    const elements = document.querySelectorAll(
      ".schedule-card, .gallery, .countdown-item"
    );

    elements.forEach((element) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;

      if (elementPosition < screenPosition) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // --- Set initial state for animated elements ---
  const animatedElements = document.querySelectorAll(
    ".schedule-card, .gallery, .countdown-item"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // --- Scroll event listener ---
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Trigger once on load
});

// ===================== 6. Floating Wonwon on Touch and Click =====================
document.addEventListener("DOMContentLoaded", function () {
  // --- Add CSS for the wonwon animation ---
  const style = document.createElement("style");
  style.textContent = `
    .floating-wonwon {
        position: fixed;
        width: 25px;
        height: 25px;
        pointer-events: none;
        z-index: 1000;
        transform: translate(-50%, -50%);
        animation: 
            floatWonwon 2s ease-out forwards,
            spinWonwon 2s linear forwards,
            fadeWonwon 2s ease-out forwards;
    }
    
    @keyframes floatWonwon {
        to {
            transform: 
                translate(
                    calc(-50% + var(--move-x)), 
                    calc(-50% + var(--move-y))
                );
        }
    }
    
    @keyframes spinWonwon {
        to {
            transform: 
                translate(
                    calc(-50% + var(--move-x)), 
                    calc(-50% + var(--move-y))
                )
                rotate(var(--rotation));
        }
    }
    
    @keyframes fadeWonwon {
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
    `;
  document.head.appendChild(style);

  // --- Create wonwon at a given position ---
  function createWonwonAtPosition(x, y) {
    const wonwon = new Image();
    wonwon.src = "images/wonwon.png";
    wonwon.className = "floating-wonwon";

    // Position at touch/click location
    wonwon.style.left = `${x}px`;
    wonwon.style.top = `${y}px`;

    // Calculate center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Vector from center to touch/click point
    const toTouchX = x - centerX;
    const toTouchY = y - centerY;

    // Random angle in full 360-degree circle away from center
    const baseAngle = Math.atan2(toTouchY, toTouchX);
    const randomAngle = baseAngle + (Math.random() - 0.5) * Math.PI * 2;

    const distance = 100 + Math.random() * 150; // 100-250px
    const moveX = Math.cos(randomAngle) * distance;
    const moveY = Math.sin(randomAngle) * distance;
    const rotation = Math.random() * 360 - 90; // -90 to +90 degrees

    wonwon.style.setProperty("--move-x", `${moveX}px`);
    wonwon.style.setProperty("--move-y", `${moveY}px`);
    wonwon.style.setProperty("--rotation", `${rotation}deg`);

    document.body.appendChild(wonwon);

    // Remove after animation completes
    setTimeout(() => wonwon.remove(), 2000);
  }

  // --- Handle touch events (multi-touch supported) ---
  document.addEventListener(
    "touchstart",
    function (e) {
      // Only prevent default if the target is a button or interactive element
      // (to avoid blocking scrolling on the whole page)
      // if (
      //   e.target.tagName === "BUTTON" ||
      //   e.target.tagName === "A" ||
      //   e.target.closest("button") ||
      //   e.target.closest("a")
      // ) {
      //   e.preventDefault();
      // }
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        // Create more wonwons here for each touch
        createWonwonAtPosition(touch.clientX, touch.clientY);
      }
    },
    { passive: true }
  );

  // --- Also work with mouse clicks for hybrid devices ---
  document.addEventListener("click", function (e) {
    // Create more wonwons here for each click
    createWonwonAtPosition(e.clientX, e.clientY);
  });
});

/*
===========================================================================
  (Commented Out) Floating wonwon on mouse cursor every 10 seconds
===========================================================================

document.addEventListener("DOMContentLoaded", function () {
  // Track mouse position
  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function createFloatingWonwon() {
    const wonwon = new Image();
    wonwon.src = "images/wonwon.png";
    wonwon.className = "floating-wonwon";

    // Position at current mouse location
    const startX = mouseX;
    const startY = mouseY;
    wonwon.style.left = `${startX}px`;
    wonwon.style.top = `${startY}px`;

    // Calculate random outward direction (always away from cursor)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Vector from center to cursor (ensures outward movement)
    const toCursorX = mouseX - centerX;
    const toCursorY = mouseY - centerY;

    // Random angle within 90-degree cone away from center
    const baseAngle = Math.atan2(toCursorY, toCursorX);
    const randomAngle = baseAngle + ((Math.random() - 0.5) * Math.PI) / 2;

    const distance = 100 + Math.random() * 150; // 100-250px
    const moveX = Math.cos(randomAngle) * distance;
    const moveY = Math.sin(randomAngle) * distance;
    const rotation = Math.random() * 180 - 90; // -90 to +90 degrees

    wonwon.style.setProperty("--move-x", `${moveX}px`);
    wonwon.style.setProperty("--move-y", `${moveY}px`);
    wonwon.style.setProperty("--rotation", `${rotation}deg`);

    document.body.appendChild(wonwon);

    setTimeout(() => wonwon.remove(), 2000);
  }

  // Add CSS
  const style = document.createElement("style");
  style.textContent = `
    .floating-wonwon {
        position: fixed;
        width: 30px;
        height: 30px;
        pointer-events: none;
        z-index: 1000;
        transform: translate(-50%, -50%);
        animation:
            floatWonwon 2s ease-out forwards,
            spinWonwon 2s linear forwards,
            fadeWonwon 2s ease-out forwards;
    }

    @keyframes floatWonwon {
        to {
            transform:
                translate(
                    calc(-50% + var(--move-x)),
                    calc(-50% + var(--move-y))
                );
        }
    }

    @keyframes spinWonwon {
        to {
            transform:
                translate(
                    calc(-50% + var(--move-x)),
                    calc(-50% + var(--move-y))
                )
                rotate(var(--rotation));
        }
    }

    @keyframes fadeWonwon {
        70% { opacity: 1; }
        100% { opacity: 0; }
    }
    `;
  document.head.appendChild(style);

  // Start interval (every 10 seconds)
  setInterval(createFloatingWonwon, 10000);

  // Initial spawn
  setTimeout(createFloatingWonwon, 100);
});
*/
