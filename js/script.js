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

  // Save the Date Button Animation
  const saveDateBtn = document.getElementById("saveDateBtn");

  saveDateBtn.addEventListener("click", function () {
    this.classList.add("clicked");
    setTimeout(() => {
      this.classList.remove("clicked");
    }, 300);

    // Create confetti effect
    createConfetti();
  });

  // function createConfetti() {
  //   const confettiCount = 50;
  //   const container = document.querySelector(".save-date-section");

  //   for (let i = 0; i < confettiCount; i++) {
  //     const confetti = document.createElement("div");
  //     confetti.className = "confetti";
  //     confetti.style.left = Math.random() * 100 + "vw";
  //     confetti.style.backgroundColor = getRandomColor();
  //     confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
  //     confetti.style.animationDelay = Math.random() * 0.5 + "s";
  //     container.appendChild(confetti);

  //     setTimeout(() => {
  //       confetti.remove();
  //     }, 3000);
  //   }
  // }

  // function getRandomColor() {
  //   const colors = ["#e2d1f9", "#d0bdf4", "#a280e8", "#845ec2", "#6c5ce7"];
  //   return colors[Math.floor(Math.random() * colors.length)];
  // }

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
