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
  const imageCount = 42;
  let currentImageIndex = 0;
  let autoSlideInterval;
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

  // --- Start and pause auto-cycling ---
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextImage, 4000);
  }
  function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
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
    const newIndex =
      currentImageIndex <= 1 ? imageCount : currentImageIndex - 1;
    loadImage(newIndex);
    clearTimeout(autoSlideInterval); // Clear any existing timeout
    autoSlideInterval = setTimeout(startAutoSlide, 10000); // Resume after 10s inactivity
  });

  // --- Initialize gallery ---
  initGallery();

  // ===================== 3. Schedule Cards Toggle =====================
  // --- Toggle function for schedule cards ---
  const day1Header = document.getElementById("day1-header");
  const day1Content = document.getElementById("day1-content");
  const day2Header = document.getElementById("day2-header");
  const day2Content = document.getElementById("day2-content");

  day1Header.addEventListener("click", () => {
    day1Content.classList.toggle("active");
    const icon = day1Header.querySelector(".toggle-icon");
    icon.textContent = day1Content.classList.contains("active") ? "−" : "+";
  });

  day2Header.addEventListener("click", () => {
    day2Content.classList.toggle("active");
    const icon = day2Header.querySelector(".toggle-icon");
    icon.textContent = day2Content.classList.contains("active") ? "−" : "+";
  });

  // ===================== 4. Save the Date Button with Confetti =====================
  const saveDateBtn = document.getElementById("saveDateBtn");

  saveDateBtn.addEventListener("click", function () {
    // --- Button press animation ---
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);

    // --- Create confetti ---
    createCustomConfetti();

    // --- Trigger calendar download after delay ---
    setTimeout(createCalendarFile, 800);
  });

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
      const distance = 200 + Math.random() * 150; // 100-250px
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
    const rotation = Math.random() * 180 - 90; // -90 to +90 degrees

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
      e.preventDefault();
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        createWonwonAtPosition(touch.clientX, touch.clientY);
      }
    },
    { passive: false }
  );

  // --- Also work with mouse clicks for hybrid devices ---
  document.addEventListener("click", function (e) {
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
