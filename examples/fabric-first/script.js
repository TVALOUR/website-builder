/* Fabric First — two behaviours, nothing else.
 * 1. The N10 nav morph (bar → floating pill past a threshold).
 * 2. The section drawing's active layer, driven by which stage is being read.
 *
 * Both are progressive enhancement: with JS off the nav stays a bar and the
 * drawing shows every layer in its resting state. Nothing is hidden behind
 * either one.
 *
 * Both run off ONE rAF-throttled passive scroll loop. An earlier version drove
 * the layer highlight from an IntersectionObserver with a -30% rootMargin;
 * that silently stopped updating past the second stage, because a stage taller
 * than the observation band never re-crosses a threshold and so never fires
 * the callback again. Nearest-to-the-midline is a continuous question, not an
 * event, so it belongs on the scroll loop.
 */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 40rem)");

  const nav = document.querySelector(".nav");
  const figure = document.querySelector("[data-section-figure]");
  const stages = Array.from(document.querySelectorAll("[data-layer]"));

  const THRESHOLD = 80; // ≥60px so a micro-scroll never twitches the bar
  let floating = false;
  let current = null;
  let ticking = false;

  /* ── 1 · N10 floating-on-scroll morph ────────────────────────────────── */
  const updateNav = () => {
    if (!nav) return;
    const next = window.scrollY > THRESHOLD;
    if (next === floating) return; // boolean-flip guard: toggle once per change
    floating = next;
    nav.classList.toggle("is-floating", floating);
  };

  /* ── 2 · The section drawing's active layer ──────────────────────────── */
  const setLayer = (el) => {
    if (el === current) return;
    if (current) current.classList.remove("is-current");
    current = el;
    if (!current) {
      figure.removeAttribute("data-active");
      return;
    }
    current.classList.add("is-current");
    figure.setAttribute("data-active", current.dataset.layer);
  };

  const updateLayer = () => {
    if (!figure || stages.length === 0) return;

    // Below 40rem the drawing sits above the stages rather than beside them,
    // so highlighting a layer the reader cannot currently see is noise.
    // Reduced-motion keeps the highlight — it carries meaning, not motion, and
    // the stylesheet has already collapsed its transition to nothing.
    if (narrow.matches) {
      setLayer(null);
      return;
    }

    const mid = window.innerHeight / 2;
    let best = null;
    let bestDistance = Infinity;

    for (const stage of stages) {
      const box = stage.getBoundingClientRect();
      if (box.bottom < 0 || box.top > window.innerHeight) continue;
      // A stage spanning the midline is the one being read — distance 0.
      // Otherwise measure the gap from the midline to the nearest edge.
      const distance =
        box.top > mid ? box.top - mid : box.bottom < mid ? mid - box.bottom : 0;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = stage;
      }
    }

    setLayer(best);
  };

  const update = () => {
    updateNav();
    updateLayer();
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true } // never preventDefault — keeps the main thread free
  );

  window.addEventListener("resize", update, { passive: true });
  narrow.addEventListener("change", updateLayer);
  reduced.addEventListener("change", updateLayer);

  update();
})();
