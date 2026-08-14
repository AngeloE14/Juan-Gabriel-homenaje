"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

export function inicializarLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!lightbox || !lightboxImg) return;

  const imagenes = Array.from(
    document.querySelectorAll("#fotos-iconicas .foto-card img")
  );

  if (imagenes.length === 0) return;

  let indiceActual = 0;

  function abrirLightbox(indice) {
    indiceActual = indice;
    renderLightbox();

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

  function lineasDelCaption(figcaption) {
    const partes = [];
    let actual = "";
    const separar = function () {
      if (actual.trim()) partes.push(actual.trim());
      actual = "";
    };
    Array.from(figcaption.childNodes).forEach(function (nodo) {
      if (nodo.nodeType === Node.TEXT_NODE) {
        actual += nodo.textContent;
      } else if (nodo.nodeType === Node.ELEMENT_NODE) {
        if (nodo.tagName === "BR") {
          separar();
        } else {
          separar();
          actual = nodo.textContent.trim();
          separar();
        }
      }
    });
    separar();
    return partes;
  }

  function renderCaption(lineas) {
    lightboxCaption.textContent = "";
    lineas.forEach(function (linea, i) {
      const parte = document.createElement("span");
      parte.className = "lightbox__caption-line";
      parte.textContent = linea;
      lightboxCaption.appendChild(parte);
    });
  }

  function renderLightbox() {
    const img = imagenes[indiceActual];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    const figcaption = img.closest("figure, .foto-card")?.querySelector("figcaption");
    if (figcaption) {
      const lineas = lineasDelCaption(figcaption);
      if (lineas.length) {
        renderCaption(lineas);
        lightboxCaption.style.display = "";
      } else {
        lightboxCaption.style.display = "none";
      }
    } else {
      lightboxCaption.style.display = "none";
    }

    if (prevBtn) prevBtn.style.display = imagenes.length > 1 ? "" : "none";
    if (nextBtn) nextBtn.style.display = imagenes.length > 1 ? "" : "none";
  }

  function siguiente() {
    indiceActual = (indiceActual + 1) % imagenes.length;
    renderLightbox();
  }

  function anterior() {
    indiceActual = (indiceActual - 1 + imagenes.length) % imagenes.length;
    renderLightbox();
  }

  imagenes.forEach(function (img, indice) {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      abrirLightbox(indice);
    });
  });

  lightboxClose.addEventListener("click", cerrarLightbox);

  if (prevBtn) prevBtn.addEventListener("click", anterior);
  if (nextBtn) nextBtn.addEventListener("click", siguiente);

  lightboxImg.addEventListener("click", function () {
    cerrarLightbox();
  });

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
    if (evento.key === "ArrowRight") {
      siguiente();
    }
    if (evento.key === "ArrowLeft") {
      anterior();
    }
  });
}
