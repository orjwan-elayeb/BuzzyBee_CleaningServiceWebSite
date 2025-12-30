/**
 * =========================================
 * 1. CONFIGURATION & DATA
 * =========================================
 */
// Service Price List (Currency: LYD)
const servicePrices = {
  house: 120,
  apartment: 90,
  carpet: 70,
};

/**
 * =========================================
 * 2. PAGE LOADER
 * =========================================
 */
window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add("hide");
  }, 600);
});

/**
 * =========================================
 * 3. HELPERS
 * =========================================
 */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function showToast(message) {
  // لو موجود toast ثابت في الصفحة استخدمه
  let toast = document.getElementById("toast");

  // لو مش موجود (زي صفحات signin/signup) أنشئه مرة وحدة
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function fakeAuth(provider) {
  showToast(`Signed up with ${provider} successfully`);
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}

/**
 * =========================================
 * 4. MAIN (DOM READY)
 * =========================================
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * ---------------------------
   * A) NAVIGATION & SCROLLING
   * ---------------------------
   */

  // --- Mobile Menu Toggle ---
  const menuBtn = document.querySelector(".dropbtn");
  const menuContent = document.querySelector(".dropdown-content");

  if (menuBtn && menuContent) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menuContent.classList.toggle("show");
    });

    // في حالة الضغط في اي مكان غير المنيو نسكر المنيو
    document.addEventListener("click", (e) => {
      if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove("show");
      }
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      e.preventDefault();
      smoothScrollTo(targetId);
    });
  });

  // --- Scroll To Top Button ---
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollTopBtn.style.display = "flex";
        setTimeout(() => scrollTopBtn.classList.add("show"), 10);
      } else {
        scrollTopBtn.classList.remove("show");
        scrollTopBtn.style.display = "none";
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * ---------------------------
   * B) REVEAL ANIMATION
   * ---------------------------
   */
  const revealTargets = document.querySelectorAll(
    ".service-card, .feature, .referral, .booking-form, .map-header, .section-title, .section-subtitle"
  );

  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el, index) => {
      el.classList.add("reveal");
      el.classList.add(`reveal-delay-${(index % 4) + 1}`);
      revealObserver.observe(el);
    });
  }

  /**
   * ---------------------------
   * C) STATS COUNTERS
   * ---------------------------
   */
  const statsSection = document.getElementById("stats");
  const counters = document.querySelectorAll(".stat-number");
  let countersStarted = false;

  function startCounters() {
    counters.forEach((counter) => {
      const target = +counter.dataset.target;
      const duration = 1500;
      const startTime = performance.now();
      const valueSpan = counter.querySelector(".stat-value");

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOut cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(easeOut * target);

        if (valueSpan) valueSpan.textContent = value.toLocaleString();
        else counter.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Ensure final value exact
          if (valueSpan) valueSpan.textContent = target.toLocaleString();
          else counter.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  if (statsSection && counters.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          startCounters();
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
  }

  /**
   * ---------------------------
   * D) SERVICE SELECTION & PRICING
   * ---------------------------
   */
  const serviceSelect = document.getElementById("service");
  const servicePriceEl = document.getElementById("servicePrice");

  function updatePriceDisplay() {
    if (!serviceSelect || !servicePriceEl) return;

    const selectedService = serviceSelect.value;
    const price = servicePrices[selectedService];

    servicePriceEl.textContent = price ? price : "—";
  }

  if (serviceSelect) {
    serviceSelect.addEventListener("change", updatePriceDisplay);
    updatePriceDisplay();
  }

  // Event: When user clicks "Book Now" on a Service Card
  document.querySelectorAll(".service-card").forEach((card) => {
    const btn = card.querySelector(".book-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const serviceValue = card.dataset.service;

      // 1) Set dropdown value
      if (serviceSelect) {
        serviceSelect.value = serviceValue;
        updatePriceDisplay();

        // 2) Highlight effect
        serviceSelect.classList.add("highlight");
        setTimeout(() => serviceSelect.classList.remove("highlight"), 1500);
      }

      // 3) Scroll to form
      smoothScrollTo("#booking");
    });
  });

  /**
   * ---------------------------
   * E) BOOKING FORM & MODAL
   * ---------------------------
   */
  const bookingForm = document.querySelector(".booking-form form");
  const confirmModal = document.getElementById("confirmModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalSummary = document.getElementById("modalSummary");

  function openModal(summaryHtml) {
    if (!confirmModal || !modalSummary) return;

    modalSummary.innerHTML = summaryHtml;
    confirmModal.classList.add("show");
    confirmModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!confirmModal) return;

    confirmModal.classList.remove("show");
    confirmModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (bookingForm) bookingForm.reset();
    updatePriceDisplay();
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

  if (confirmModal) {
    confirmModal.addEventListener("click", (e) => {
      if (e.target === confirmModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && confirmModal?.classList.contains("show")) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name")?.value || "";
      const phone = document.getElementById("phone")?.value || "";
      const date = document.getElementById("date")?.value || "";
      const address = document.getElementById("address")?.value || "";

      // service text/value safely
      const serviceOption =
        serviceSelect?.options?.[serviceSelect.selectedIndex] || null;
      const serviceText = serviceOption ? serviceOption.text : "";
      const serviceValue = serviceSelect ? serviceSelect.value : "";

      const timeSelect = document.getElementById("time");
      const timeText = timeSelect?.options?.[timeSelect.selectedIndex]?.text || "";

      const currentPrice = servicePrices[serviceValue]
        ? `${servicePrices[serviceValue]} DL`
        : "—";

      const summaryHTML = `
        <div class="summary-item"><b>Name:</b> ${name}</div>
        <div class="summary-item"><b>Phone:</b> ${phone}</div>
        <div class="summary-item"><b>Service:</b> ${serviceText}</div>
        <div class="summary-item"><b>Price:</b> <span style="color:#ff9800;font-weight:800">${currentPrice}</span></div>
        <div class="summary-item"><b>Date:</b> ${date}</div>
        <div class="summary-item"><b>Time:</b> ${timeText}</div>
        <div class="summary-item"><b>Address:</b> ${address}</div>
        <p class="modal-hint" style="margin-top:15px; color:#666; font-size:0.9rem;">
          💡 You can create an account later to track your bookings and get discounts.
        </p>
      `;

      openModal(summaryHTML);
    });
  }

  /**
   * ---------------------------
   * F) REFERRAL SYSTEM (COPY + TOAST)
   * ---------------------------
   */
  const sendBtn = document.querySelector(".send-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", async () => {
      const codeElement = document.querySelector(".referral-code");
      if (!codeElement) return;

      const link = codeElement.innerText.trim();

      // 1) Modern clipboard (HTTPS)
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(link);
          showToast("Referral link copied successfully");
          return;
        }
      } catch (e) {
        // continue to fallback
      }

      // 2) Fallback
      try {
        const temp = document.createElement("textarea");
        temp.value = link;
        temp.setAttribute("readonly", "");
        temp.style.position = "fixed";
        temp.style.top = "-1000px";
        document.body.appendChild(temp);

        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);

        showToast("Referral link copied successfully");
      } catch (e) {
        showToast("Could not copy the link. Please copy it manually");
      }
    });
  }

  /**
   * ---------------------------
   * G) THEME (DARK/LIGHT) + SAVE
   * ---------------------------
   */
  const themeToggleBtn = document.getElementById("themeToggle");
  const icon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", String(isDark));
      themeToggleBtn.setAttribute(
        "aria-label",
        isDark ? "Light mode" : "Dark mode"
      );
    }
  }

  const savedTheme = localStorage.getItem("theme"); // "dark" | "light" | null
  applyTheme(savedTheme === "dark");

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDarkNow = !document.body.classList.contains("dark-mode");
      applyTheme(isDarkNow);
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    });
  }

  /**
   * ---------------------------
   * H) SCROLL SPY (ACTIVE NAV LINK)
   * ---------------------------
//    */
//   const sections = document.querySelectorAll("section[id]");
//   const navLinks = document.querySelectorAll("nav ul li a");

//   if (sections.length && navLinks.length) {
//     const spyObserver = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const id = entry.target.getAttribute("id");
//             navLinks.forEach((link) => {
//               link.classList.remove("active");
//               if (link.getAttribute("href") === `#${id}`) {
//                 link.classList.add("active");
//               }
//             });
//           }
//         });
//       },
//       {
//         root: null,
//         rootMargin: "-10% 0px -70% 0px",
//         threshold: 0,
//       }
//     );

//     sections.forEach((section) => spyObserver.observe(section));
//   }
// });
})

function showToast(message) {
  // If a static toast already exists on the page, use it
  let toast = document.getElementById("toast");

  // If it doesn't exist (like in signin/signup pages), create it once
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function fakeAuth(provider) {
  showToast(`Successfully signed in with ${provider}`);

  setTimeout(() => {
    window.location.href = "index-en.html"; // English homepage
  }, 1200);
}

