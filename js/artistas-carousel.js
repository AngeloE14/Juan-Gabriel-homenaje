"use strict";
import { obtenerRendimientoDispositivo } from './utils.js';

function inicializarCarruselInfinito(gallery, track, tarjetaSelector, pausarConCursor) {
  if (!gallery || !track) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const tarjetas = Array.from(track.querySelectorAll(tarjetaSelector));
  if (tarjetas.length <= 1) {
    return;
  }

  const clones = tarjetas.map(function (t) {
    const c = t.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  });
  clones.forEach(function (c) { track.appendChild(c); });

  let anchoOriginal = track.scrollWidth / 2;
  const { isLowEnd } = obtenerRendimientoDispositivo();
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

  if (pausarConCursor !== false) {
    gallery.addEventListener("pointerenter", function () { pausado = true; });
    gallery.addEventListener("pointerleave", function () {
      if (tiempoFuera) clearTimeout(tiempoFuera);
      tiempoFuera = setTimeout(reanudar, 1500);
    });
  }

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
    // Scroll MANUAL: no da la vuelta; solo el scroll automático lo hace con envolver().
    // El ajuste se difiere a requestAnimationFrame para NO pelear con el scroll
    // nativo por inercia táctil.
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

  // Las imágenes del carrusel se cargan después de inicializar (lazy), lo que
  // cambia el ancho real de la pista. Recalcular el punto de envoltura para
  // que el giro sea perfecto y no "brinque" en el lugar equivocado.
  if (typeof ResizeObserver !== "undefined") {
    const observador = new ResizeObserver(function () {
      const nuevoAncho = track.scrollWidth / 2;
      if (nuevoAncho > 0) {
        anchoOriginal = nuevoAncho;
      }
    });
    observador.observe(track);
  }

  animId = requestAnimationFrame(mover);
}

export function inicializarArtistasCarousel() {
  inicializarCarruselInfinito(
    document.querySelector(".artistas-gallery"),
    document.querySelector(".artistas-track"),
    ".artista-frame"
  );
}

export function inicializarFragmentosCarousel() {
  const gallery = document.querySelector(".fragmentos-scroll");
  if (gallery) {
    gallery.style.scrollSnapType = "none";
  }
  // pausarConCursor = false: en escritorio siempre gira aunque el mouse esté
  // encima (en móvil se pausa al tocar, igual que antes).
  inicializarCarruselInfinito(
    gallery,
    document.querySelector(".fragmentos-track"),
    ".fragmento-card",
    false
  );
}
