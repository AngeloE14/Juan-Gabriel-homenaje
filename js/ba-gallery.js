"use strict";

/**
 * BA-GALLERY.JS - Mini-carrusel de fotos del concierto de Bellas Artes 1990
 *
 * Muestra 2 imágenes a la vez con flechas para navegar entre las 2 diapositivas.
 */
export function inicializarBAGallery() {
  const gallery = document.getElementById("ba-gallery");
  if (!gallery) return;

  const slides = gallery.querySelectorAll(".ba-gallery__slide");
  const dotsContainer = gallery.querySelector(".ba-gallery__dots");
  const prevBtn = gallery.querySelector(".ba-gallery__arrow--prev");
  const nextBtn = gallery.querySelector(".ba-gallery__arrow--next");

  if (slides.length <= 1) return;

  let indiceActual = 0;

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === indiceActual);
    });
    var dots = gallery.querySelectorAll(".ba-gallery__dot");
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === indiceActual);
    });
  }

  function siguiente() {
    indiceActual = (indiceActual + 1) % slides.length;
    render();
  }

  function anterior() {
    indiceActual = (indiceActual - 1 + slides.length) % slides.length;
    render();
  }

  // Crear dots
  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.type = "button";
    dot.className = "ba-gallery__dot";
    dot.setAttribute("aria-label", "Grupo de fotos " + (i + 1));
    dot.addEventListener("click", function () {
      indiceActual = i;
      render();
    });
    if (dotsContainer) dotsContainer.appendChild(dot);
  });

  if (prevBtn) prevBtn.addEventListener("click", anterior);
  if (nextBtn) nextBtn.addEventListener("click", siguiente);

  render();
}
