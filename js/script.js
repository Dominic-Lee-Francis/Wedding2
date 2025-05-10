document.addEventListener("DOMContentLoaded", function () {
  // Countdown Timer
  const weddingDate = new Date("November 22, 2025 13:00:00").getTime();

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

  updateCountdown();
  setInterval(updateCountdown, 60000);

  //
  //
  //
  // Image Gallery
  // Image Gallery with Auto-Cycle
  const imageCount = 13;
  let currentImageIndex = 1;
  let autoSlideInterval;
  const imageElement = document.getElementById("current-image");

  // Preload images
  const images = [];
  for (let i = 1; i <= imageCount; i++) {
    const img = new Image();
    img.src = `images/wedding${i}.jpg`;
    images.push(img);
  }

  // Load image with fade effect
  function loadImage(index) {
    currentImageIndex = index;
    imageElement.src = `images/wedding${currentImageIndex}.jpg`;
    imageElement.style.opacity = 0;
    setTimeout(() => {
      imageElement.style.opacity = 1;
    }, 10);
  }

  // Auto-advance to next image
  function nextImage() {
    const newIndex =
      currentImageIndex >= imageCount ? 1 : currentImageIndex + 1;
    loadImage(newIndex);
  }

  // Start auto-cycling (3s interval)
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextImage, 4000);
  }

  // Pause auto-cycling when user interacts
  function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Initialize gallery
  function initGallery() {
    loadImage(Math.floor(Math.random() * imageCount) + 1); // Random first image
    startAutoSlide();

    // Pause on hover/focus for better UX
    const gallery = document.querySelector(".gallery");
    gallery.addEventListener("mouseenter", pauseAutoSlide);
    gallery.addEventListener("mouseleave", startAutoSlide);
    gallery.addEventListener("focusin", pauseAutoSlide);
    gallery.addEventListener("focusout", startAutoSlide);
  }

  // Event listeners for manual navigation
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

  // Initialize
  initGallery();

  // NEW SECTION: Schedule Cards Toggle
  // Toggle function for schedule cards
  // Schedule Cards Toggle
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

  // Save the Date Button with Reliable Confetti
  const saveDateBtn = document.getElementById("saveDateBtn");

  saveDateBtn.addEventListener("click", function () {
    // 1. Button press animation
    this.classList.add("clicked");
    setTimeout(() => this.classList.remove("clicked"), 300);

    // 2. Create confetti
    createCustomConfetti();

    // 3. Trigger calendar download after delay
    setTimeout(createCalendarFile, 800);
  });

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
  // Add some subtle animations on scroll
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

  // Set initial state for animated elements
  const animatedElements = document.querySelectorAll(
    ".schedule-card, .gallery, .countdown-item"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  window.addEventListener("scroll", animateOnScroll);
  // Trigger once on load in case elements are already visible
  animateOnScroll();
});
