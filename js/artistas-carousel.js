"use strict";
import { obtenerRendimientoDispositivo } from './utils.js';

export function inicializarArtistasCarousel() {
  const gallery = document.querySelector(".artistas-gallery");
  const track = gallery ? gallery.querySelector(".artistas-track") : null;


  if (!gallery || !track) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const tarjetas = Array.from(track.querySelectorAll(".artista-frame"));
  if (tarjetas.length <= 1) {
    return;
  }

  const clones = tarjetas.map(function (t) {
    const c = t.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  });
  clones.forEach(function (c) { track.appendChild(c); });

  const anchoOriginal = track.scrollWidth / 2;
  const { isLowEnd, isMobile } = obtenerRendimientoDispositivo();
  const velocidadBase = Math.max(0.8, anchoOriginal / 3000);
  const velocidad = velocidadBase * (isLowEnd ? 0.55 : 1);

  let animId = null;
  let pausado = false;
  let tiempoFuera = null;
  let ultimoMovimientoAutomatico = 0;
  let envolviendo = false;
  let ajustandoLimite = false;

  // Envuelve el scroll: si pasa del punto medio (mitad original + mitad clon),
  // se resta el ancho original para volver al inicio de forma imperceptible.
  function envolver() {
    if (envolviendo) return;
    envolviendo = true;
    if (gallery.scrollLeft >= anchoOriginal) {
      gallery.scrollLeft -= anchoOriginal;
    } else if (gallery.scrollLeft <= 0) {
      gallery.scrollLeft += anchoOriginal;
    }
    envolviendo = false;
  }

  function mover() {
    if (!pausado) {
      ultimoMovimientoAutomatico = performance.now();
      gallery.scrollLeft += velocidad;
      envolver();
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
    // Scroll programático (auto) no debe pausar ni envolver de nuevo
    if (performance.now() - ultimoMovimientoAutomatico < 100) {
      return;
    }
    // Scroll MANUAL: se detiene al llegar a Isabel Pantoja (fin de la lista
    // original). No da la vuelta; solo el scroll automático lo hace con envolver().
    // El ajuste se difiere a requestAnimationFrame para NO pelear con el scroll
    // nativo por inercia táctil (evita glitches/crash al escribir scrollLeft
    // dentro del propio evento de scroll).
    if (!ajustandoLimite) {
      ajustandoLimite = true;
      requestAnimationFrame(function () {
        const limiteManual = Math.max(0, anchoOriginal - gallery.clientWidth);
        if (gallery.scrollLeft > limiteManual) {
          gallery.scrollLeft = limiteManual;
        }
        ajustandoLimite = false;
      });
    }
    if (!pausado) {
      pausado = true;
      if (tiempoFuera) clearTimeout(tiempoFuera);
      tiempoFuera = setTimeout(reanudar, 3000);
    }
  });

  // Al soltar el dedo se aplica el límite final una última vez (ya sin inercia,
  // por lo que es seguro). Evita que quede pasado el final tras un flick fuerte.
  gallery.addEventListener("touchend", function () {
    const limiteManual = Math.max(0, anchoOriginal - gallery.clientWidth);
    if (gallery.scrollLeft > limiteManual) {
      gallery.scrollLeft = limiteManual;
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
}
