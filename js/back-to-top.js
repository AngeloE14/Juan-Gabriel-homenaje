"use strict";

export function inicializarBotonSubir() {
  const btn = document.getElementById("btn-subir");
  if (!btn) return;

  let visible = false;

  function onClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onScroll() {
    const debeSerVisible = window.scrollY > 400;
    if (debeSerVisible !== visible) {
      visible = debeSerVisible;
      btn.classList.toggle("is-visible", visible);
    }
  }

  btn.addEventListener("click", onClick);

  window.addEventListener("scroll", onScroll, { passive: true });

  onScroll();
}
