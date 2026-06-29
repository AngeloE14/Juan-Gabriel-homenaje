/*
  ===========================================
  FRAGMENTOS-CAROUSEL.JS - Carrusel 3D cinematográfico
  ===========================================
*/

"use strict";

/* CAMBIO: Inicializa interacción 3D de Fragmentos sin alterar el HTML interno de cada tarjeta */
export function inicializarCarruselFragmentos3D() {
  const viewport = document.querySelector(".fragmentos-scroll");
  const track = viewport ? viewport.querySelector(".fragmentos-track") : null;

  if (!viewport || !track) return;

  /* CAMBIO: Se usa scroll-snap nativo en todos los tamaños, sin lógica JS */
  return;
}
