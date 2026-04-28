const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const revealItems = document.querySelectorAll(".reveal");
const form = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const heroSlides = Array.from(document.querySelectorAll(".hero__slide"));
let activeHeroSlide = 0;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  header.classList.toggle("nav-is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    header.classList.remove("nav-is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const active = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
      navLinks.forEach((link) => link.classList.toggle("is-active", link === active));
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
);

document.querySelectorAll("section[id]").forEach((section) => sectionObserver.observe(section));

function rotateHeroSlide() {
  if (heroSlides.length < 2) return;
  heroSlides[activeHeroSlide].classList.remove("is-active");
  activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
  heroSlides[activeHeroSlide].classList.add("is-active");
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(rotateHeroSlide, 5200);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const phone = formData.get("phone") || "";
  const shoot = formData.get("shoot") || "Wedding photography";
  const message = formData.get("message") || "";
  const subject = encodeURIComponent(`${shoot} booking inquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nShoot type: ${shoot}\n\n${message}`);

  window.location.href = `mailto:mishka80085@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = "Opening your email app with the booking details.";
});

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
