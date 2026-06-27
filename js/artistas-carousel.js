"use strict";

export function inicializarArtistasCarousel() {
  console.log("[Artistas] Inicializando carrusel...");

  const gallery = document.querySelector(".artistas-gallery");
  const track = gallery ? gallery.querySelector(".artistas-track") : null;

  if (!gallery || !track) {
    console.warn("[Artistas] No se encontró gallery o track");
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    console.log("[Artistas] prefers-reduced-motion activo, se omite");
    return;
  }

  const tarjetas = Array.from(track.querySelectorAll(".artista-frame"));
  if (tarjetas.length <= 1) {
    console.warn("[Artistas] Solo 1 tarjeta, se omite");
    return;
  }

  console.log("[Artistas] Tarjetas encontradas:", tarjetas.length);

  const clones = tarjetas.map(function (t) {
    const c = t.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  });
  clones.forEach(function (c) { track.appendChild(c); });

  const anchoOriginal = track.scrollWidth / 2;
  const velocidad = Math.max(0.8, anchoOriginal / 3000);

  console.log("[Artistas] anchoOriginal:", anchoOriginal, "velocidad:", velocidad);

  let animId = null;
  let pausado = false;
  let tiempoFuera = null;

  function mover() {
    if (!pausado) {
      gallery.scrollLeft += velocidad;
      if (gallery.scrollLeft >= anchoOriginal) {
        gallery.scrollLeft = 0;
      }
    }
    animId = requestAnimationFrame(mover);
  }

  function reanudar() {
    if (tiempoFuera) {
      clearTimeout(tiempoFuera);
      tiempoFuera = null;
    }
    pausado = false;
  }

  gallery.addEventListener("pointerenter", function () { pausado = true; });
  gallery.addEventListener("pointerleave", function () {
    if (tiempoFuera) clearTimeout(tiempoFuera);
    tiempoFuera = setTimeout(reanudar, 1500);
  });

  gallery.addEventListener("touchstart", function () { pausado = true; });
  gallery.addEventListener("touchend", function () {
    if (tiempoFuera) clearTimeout(tiempoFuera);
    tiempoFuera = setTimeout(reanudar, 3000);
  });

  gallery.addEventListener("scroll", function () {
    if (!pausado) {
      pausado = true;
      if (tiempoFuera) clearTimeout(tiempoFuera);
      tiempoFuera = setTimeout(reanudar, 3000);
    }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!document.hidden && !animId) {
      animId = requestAnimationFrame(mover);
    }
  });

  animId = requestAnimationFrame(mover);
  console.log("[Artistas] Carrusel iniciado");
}
