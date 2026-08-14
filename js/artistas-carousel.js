"use strict";
import { obtenerRendimientoDispositivo } from './utils.js';

function inicializarCarruselInfinito(gallery, track, tarjetaSelector, pausarConCursor) {
  if (!gallery || !track) {
    return;
  }

  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  let animId = null;
  let pausado = false;
  let tiempoFuera = null;
  let ultimoFrame = null;
  let posicionAutomatica = gallery.scrollLeft;
  let interaccionManual = false;
  let envolviendo = false;
  let ajustandoLimite = false;

  function obtenerVelocidad() {
    const velocidadBase = Math.max(48, anchoOriginal / 50);
    const factorRendimiento = isLowEnd ? 0.65 : 1;
    const factorMovimiento = reducirMovimiento ? 0.75 : 1;
    return Math.max(32, velocidadBase * factorRendimiento * factorMovimiento);
  }

  function limitarScrollManual() {
    const limiteManual = Math.max(0, anchoOriginal - gallery.clientWidth);
    if (gallery.scrollLeft > limiteManual) {
      gallery.scrollLeft = limiteManual;
    }
    posicionAutomatica = gallery.scrollLeft;
  }

  function programarReanudacion(tiempoEspera) {
    if (tiempoFuera) clearTimeout(tiempoFuera);
    tiempoFuera = setTimeout(reanudar, tiempoEspera);
  }

  function pausarPorInteraccion(tiempoEspera) {
    interaccionManual = true;
    pausado = true;
    programarReanudacion(tiempoEspera);
  }

  // Envuelve el scroll: si pasa del punto medio (mitad original + mitad clon),
  // se resta el ancho original para volver al inicio de forma imperceptible.
  function envolver() {
    if (envolviendo) return;
    envolviendo = true;
    if (posicionAutomatica >= anchoOriginal) {
      posicionAutomatica -= anchoOriginal;
    } else if (posicionAutomatica < 0) {
      posicionAutomatica += anchoOriginal;
    }
    gallery.scrollLeft = posicionAutomatica;
    envolviendo = false;
  }

  function mover(ahora) {
    if (ultimoFrame === null) {
      ultimoFrame = ahora;
    }

    const delta = Math.min(80, ahora - ultimoFrame);
    ultimoFrame = ahora;

    if (!pausado && anchoOriginal > gallery.clientWidth) {
      posicionAutomatica += obtenerVelocidad() * (delta / 1000);
      envolver();
    }
    animId = requestAnimationFrame(mover);
  }

  function reanudar() {
    if (tiempoFuera) {
      clearTimeout(tiempoFuera);
      tiempoFuera = null;
    }
    interaccionManual = false;
    posicionAutomatica = gallery.scrollLeft;
    ultimoFrame = null;
    pausado = false;
  }

  if (pausarConCursor !== false) {
    gallery.addEventListener("pointerenter", function () { pausado = true; });
    gallery.addEventListener("pointerleave", function () {
      programarReanudacion(1500);
    });
  }

  gallery.addEventListener("pointerdown", function () { pausarPorInteraccion(3000); });
  gallery.addEventListener("touchstart", function () { pausarPorInteraccion(3000); });
  gallery.addEventListener("wheel", function () { pausarPorInteraccion(3000); }, { passive: true });
  gallery.addEventListener("keydown", function (evento) {
    const teclasScroll = ["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"];
    if (teclasScroll.includes(evento.key)) {
      pausarPorInteraccion(3000);
    }
  });
  gallery.addEventListener("touchend", function () { programarReanudacion(3000); });

  gallery.addEventListener("scroll", function () {
    // El scroll automático no debe pausar ni activar el límite manual.
    if (!interaccionManual) {
      return;
    }
    // Scroll MANUAL: no da la vuelta; solo el scroll automático lo hace con envolver().
    // El ajuste se difiere a requestAnimationFrame para NO pelear con el scroll
    // nativo por inercia táctil.
    if (!ajustandoLimite) {
      ajustandoLimite = true;
      requestAnimationFrame(function () {
        limitarScrollManual();
        ajustandoLimite = false;
      });
    }
  });

  // Al soltar el dedo se aplica el límite final una última vez (ya sin inercia,
  // por lo que es seguro). Evita que quede pasado el final tras un flick fuerte.
  gallery.addEventListener("touchend", function () {
    limitarScrollManual();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && animId) {
      cancelAnimationFrame(animId);
      animId = null;
    } else if (!document.hidden && !animId) {
      ultimoFrame = null;
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
        if (posicionAutomatica >= anchoOriginal) {
          posicionAutomatica = posicionAutomatica % anchoOriginal;
          gallery.scrollLeft = posicionAutomatica;
        }
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
    ".artista-frame",
    false
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
