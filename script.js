const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("primary-nav");
const nextInput = document.getElementById("form-next");

if (nextInput && nextInput instanceof HTMLInputElement) {
  const base = window.location.href.split("?")[0].split("#")[0];
  nextInput.value = `${base}?sent=1#contact`;
}

function setNav(open) {
  document.body.classList.toggle("nav-open", open);
  if (toggle) toggle.setAttribute("aria-expanded", String(open));
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = !document.body.classList.contains("nav-open");
    setNav(open);
  });
}

document.addEventListener("click", (e) => {
  if (!document.body.classList.contains("nav-open")) return;
  const target = e.target;
  if (!(target instanceof Element)) return;

  const clickedToggle = toggle && (target === toggle || toggle.contains(target));
  const clickedNav = nav && (target === nav || nav.contains(target));

  if (!clickedToggle && !clickedNav) setNav(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setNav(false);
});

const navLinks = document.querySelectorAll(".nav__link");
navLinks.forEach((a) => {
  a.addEventListener("click", () => setNav(false));
});

const revealEls = Array.from(document.querySelectorAll("[data-reveal]"));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

const params = new URLSearchParams(window.location.search);
if (note && params.get("sent") === "1") {
  note.textContent = "Terima kasih — pesan kamu sudah terkirim. Kami akan balas secepat mungkin.";
  const cleanedUrl = `${window.location.pathname}${window.location.hash}`;
  window.history.replaceState({}, "", cleanedUrl);
}

if (form) {
  form.addEventListener("submit", () => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (note) note.textContent = "Mengirim...";
    if (submitBtn && submitBtn instanceof HTMLButtonElement) submitBtn.disabled = true;
  });
}
