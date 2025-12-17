/* =========================
   CYBERDUCK — slider simple
========================= */
(() => {
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const dotsWrap = document.getElementById("dots");

  if (!slides.length || !prevBtn || !nextBtn || !dotsWrap) return;

  let index = 0;

  const setActive = (i) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => s.classList.toggle("is-active", idx === index));
    Array.from(dotsWrap.children).forEach((d, idx) => d.classList.toggle("is-active", idx === index));
  };

  // dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.ariaLabel = `Ir al slide ${i + 1}`;
    dot.addEventListener("click", () => setActive(i));
    dotsWrap.appendChild(dot);
  });

  prevBtn.addEventListener("click", () => setActive(index - 1));
  nextBtn.addEventListener("click", () => setActive(index + 1));

  // auto-play suave (opcional)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    setInterval(() => setActive(index + 1), 6500);
  }
})();
