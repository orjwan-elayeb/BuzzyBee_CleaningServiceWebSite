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
 * 3. NAVIGATION & SCROLLING
 * =========================================
 */
document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile Menu Toggle ---
  const menuBtn = document.querySelector(".dropbtn");
  const menuContent = document.querySelector(".dropdown-content");

  if (menuBtn && menuContent) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menuContent.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove("show");
      }
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
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
}); // ✅ هذا الإغلاق الصح للـ DOMContentLoaded

/**
 * =========================================
 * 4. ANIMATIONS (REVEAL & COUNTERS)
 * =========================================
 */

// --- Scroll Reveal Animation ---
const revealTargets = document.querySelectorAll(
  ".service-card, .feature, .referral, .booking-form, .map-header, .section-title, .section-subtitle"
);

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
  // Add staggered delay based on index (optional logic can be refined)
  el.classList.add(`reveal-delay-${(index % 4) + 1}`);
  revealObserver.observe(el);
});

// --- Stats Counter Animation ---
const statsSection = document.getElementById("stats");
const counters = document.querySelectorAll(".stat-number");
let countersStarted = false;

function startCounters() {
  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    const duration = 1500; // Animation duration in ms
    const startTime = performance.now();
    const valueSpan = counter.querySelector(".stat-value");

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smoother effect (optional)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const value = Math.floor(easeOut * target);
      if (valueSpan) {
        valueSpan.textContent = value.toLocaleString();
      } else {
        counter.textContent = value.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        if (valueSpan) {
          valueSpan.textContent = target.toLocaleString(); // Ensure final value is exact
        } else {
          counter.textContent = target.toLocaleString();
        }
      }
    }
    requestAnimationFrame(updateCounter);
  });
}

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

if (statsSection) {
  statsObserver.observe(statsSection);
}

/**
 * =========================================
 * 5. SERVICE SELECTION & PRICING LOGIC
 * =========================================
 */
const serviceSelect = document.getElementById("service");
const servicePriceEl = document.getElementById("servicePrice");

// Function to update price display based on selection
function updatePriceDisplay() {
  const selectedService = serviceSelect.value;
  const price = servicePrices[selectedService];

  if (price) {
    servicePriceEl.textContent = price;
  } else {
    servicePriceEl.textContent = "—";
  }
}

// Event: When user changes dropdown manually
if (serviceSelect) {
  serviceSelect.addEventListener("change", updatePriceDisplay);
  // Initialize on load
  updatePriceDisplay();
}

// Event: When user clicks "Book Now" on a Service Card
document.querySelectorAll(".service-card").forEach((card) => {
  const btn = card.querySelector(".book-btn");

  btn.addEventListener("click", () => {
    const serviceValue = card.dataset.service;

    // 1. Set dropdown value
    if (serviceSelect) {
      serviceSelect.value = serviceValue;
      updatePriceDisplay();

      // 2. Add highlight effect
      serviceSelect.classList.add("highlight");
      setTimeout(() => serviceSelect.classList.remove("highlight"), 1500);
    }

    // 3. Scroll to form
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/**
 * =========================================
 * 6. BOOKING FORM & MODAL HANDLING
 * =========================================
 */
const bookingForm = document.querySelector(".booking-form form");
const confirmModal = document.getElementById("confirmModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalSummary = document.getElementById("modalSummary");

// --- Modal Functions ---
function openModal(summaryHtml) {
  modalSummary.innerHTML = summaryHtml;
  confirmModal.classList.add("show");
  confirmModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeModal() {
  confirmModal.classList.remove("show");
  confirmModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  bookingForm.reset(); // Reset form after successful closing
  updatePriceDisplay(); // Reset price display
}

// --- Event Listeners for Modal ---
if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

if (confirmModal) {
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) closeModal();
  });
}

document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    confirmModal &&
    confirmModal.classList.contains("show")
  ) {
    closeModal();
  }
});

// --- Form Submission ---
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Gather Form Data
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const date = document.getElementById("date").value;
    const address = document.getElementById("address").value;

    // Get Select Text and Values safely
    const serviceOption = serviceSelect.options[serviceSelect.selectedIndex];
    const serviceText = serviceOption ? serviceOption.text : "";
    const serviceValue = serviceSelect.value;

    const timeSelect = document.getElementById("time");
    const timeText = timeSelect.options[timeSelect.selectedIndex]?.text || "";

    // Calculate Price
    const currentPrice = servicePrices[serviceValue]
      ? `${servicePrices[serviceValue]} د.ل`
      : "—";

    // Create Summary HTML
    const summaryHTML = `
      <div class="summary-item"><b>الاسم:</b> ${name}</div>
      <div class="summary-item"><b>الهاتف:</b> ${phone}</div>
      <div class="summary-item"><b>الخدمة:</b> ${serviceText}</div>
      <div class="summary-item"><b>السعر:</b> <span style="color:#ff9800;font-weight:800">${currentPrice}</span></div>
      <div class="summary-item"><b>التاريخ:</b> ${date}</div>
      <div class="summary-item"><b>الوقت:</b> ${timeText}</div>
      <div class="summary-item"><b>العنوان:</b> ${address}</div>
      <p class="modal-hint" style="margin-top:15px; color:#666; font-size:0.9rem;">
        💡 يمكنك إنشاء حساب لاحقًا لمتابعة طلباتك والحصول على خصومات.
      </p>
    `;

    openModal(summaryHTML);
  });
}

/**
 * =========================================
 * 7. REFERRAL SYSTEM (Toast Version)
 * =========================================
 */

const sendBtn = document.querySelector(".send-btn");

if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const codeElement = document.querySelector(".referral-code");
    if (!codeElement) return;

    const link = codeElement.innerText.trim();

    // 1) Modern clipboard (works best on HTTPS)
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
        showToast("تم نسخ رابط الدعوة بنجاح");
        return;
      }
    } catch (e) {
      // continue to fallback
    }

    // 2) Fallback for phones / http / older browsers
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

      showToast("تم نسخ رابط الدعوة بنجاح");
    } catch (e) {
      showToast("تعذر نسخ الرابط، انسخه يدويًا");
    }
  });
}

/*تغير الوضع بين الداكن والفاتح */
/* ===========================
  Theme (Dark/Light) + Save
   =========================== */
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("themeToggle");
  const icon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    // icon swap
    if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";

    // (اختياري) aria
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", String(isDark));
      themeToggleBtn.setAttribute(
        "aria-label",
        isDark ? "الوضع الفاتح" : "الوضع الداكن"
      );
    }
  }

  // 1) Apply saved theme on load
  const savedTheme = localStorage.getItem("theme"); // "dark" | "light" | null
  applyTheme(savedTheme === "dark");

  // 2) Toggle + Save
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const isDarkNow = !document.body.classList.contains("dark-mode");
      applyTheme(isDarkNow);
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");
    });
  }
});

/**
 * =========================================
 * Scroll Spy using IntersectionObserver
 * =========================================
 */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav ul li a");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    root: null, // viewport
    rootMargin: "-40% 0px -50% 0px",
    threshold: 0,
  }
);

// Observe each section
sections.forEach((section) => spyObserver.observe(section));

//sign in / sign up

// function fakeAuth(provider) {
//   showToast(`تم التسجيل عبر ${provider} ✅`);

//   setTimeout(() => {
//     window.location.href = "index.html";
//   }, 2000);
// }

// function showToast(message) {
//   const toast = document.createElement("div");
//   toast.className = "toast-message";
//   toast.textContent = message;

//   document.body.appendChild(toast);

//   setTimeout(() => toast.classList.add("show"), 100);
//   setTimeout(() => {
//     toast.classList.remove("show");
//     setTimeout(() => toast.remove(), 300);
//   }, 1800);
// }

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
  showToast(`تم التسجيل عبر ${provider} بنجاح`);

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1200);
}
