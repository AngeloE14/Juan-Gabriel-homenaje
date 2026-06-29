"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

export function inicializarLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  if (!lightbox || !lightboxImg) return;

  const imagenes = Array.from(
    document.querySelectorAll("#fotos-iconicas .foto-card img")
  );

  if (imagenes.length === 0) return;

  function abrirLightbox(indice) {
    const img = imagenes[indice];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    const figcaption = img.closest("figure").querySelector("figcaption");
    if (figcaption && figcaption.textContent.trim()) {
      lightboxCaption.textContent = figcaption.textContent.trim();
      lightboxCaption.style.display = "";
    } else {
      lightboxCaption.style.display = "none";
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    pausarAudioFondo();
  }

  function cerrarLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";

    reanudarAudioFondo();
  }

  imagenes.forEach(function (img, indice) {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      abrirLightbox(indice);
    });
  });

  lightboxClose.addEventListener("click", cerrarLightbox);

  lightbox.addEventListener("click", function (evento) {
    if (evento.target.getAttribute("data-close-modal") === "true") {
      cerrarLightbox();
    }
  });

  document.addEventListener("keydown", function (evento) {
    if (!lightbox.classList.contains("is-open")) return;
    if (evento.key === "Escape") {
      cerrarLightbox();
    }
  });
}
