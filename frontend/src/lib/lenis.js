import Lenis from "lenis";

let lenis = null;

export function initLenis() {
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  const raf = (time) => {
    if (!lenis) return;
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
  return lenis;
}

export function destroyLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

export function scrollTop(immediate = false) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}

export function scrollToId(id) {
  const el = typeof id === "string" ? document.getElementById(String(id).replace("#", "")) : id;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72 });
  else el.scrollIntoView({ behavior: "smooth" });
}
