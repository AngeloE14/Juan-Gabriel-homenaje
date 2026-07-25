
"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

/**
 * Pausa todos los <video> locales del section #multimedia
 */
function pausarVideosLocales() {
  document.querySelectorAll("#multimedia video").forEach(function (v) {
    v.pause();
  });
}

/**
 * Inicializa el modal de YouTube
 */
export function inicializarYouTubeModal() {
  const botonesYouTube = document.querySelectorAll(".youtube-open");
  const youtubeModal = document.getElementById("youtube-modal");
  const youtubeFrame = document.getElementById("youtube-frame");
  const youtubeClose = document.getElementById("youtube-close");

  /**
   * Abre el modal de YouTube con el video especificado
   */
  function abrirYouTube(videoId, titulo, lista, embedUrl) {
    if (!youtubeModal || !youtubeFrame) return;

    /* Pausar videos locales y audio de fondo */
    pausarVideosLocales();
    pausarAudioFondo();

    let src = "";
    if (embedUrl) {
      src = embedUrl;
      src += src.includes("?") ? "&" : "?";
      src += "autoplay=1&rel=0&playsinline=1";
    } else {
      src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&rel=0&playsinline=1";
      if (lista) {
        src += "&list=" + encodeURIComponent(lista);
      }
    }

    youtubeFrame.src = src;
    youtubeFrame.title = titulo || "Video de YouTube";

    youtubeModal.classList.add("is-open");
    youtubeModal.setAttribute("aria-hidden", "false");
  }

  /**
   * Cierra el modal de YouTube
   */
  function cerrarYouTube() {
    if (!youtubeModal || !youtubeFrame) return;
    youtubeModal.classList.remove("is-open");
    youtubeModal.setAttribute("aria-hidden", "true");
    youtubeFrame.src = "";

    reanudarAudioFondo();
  }

  /* Cuando un video local empieza a reproducir, pausa YouTube */
  document.querySelectorAll("#multimedia video").forEach(function (video) {
    video.addEventListener("play", function () {
      if (youtubeFrame && youtubeFrame.src) {
        youtubeFrame.src = "";
      }
      if (youtubeModal && youtubeModal.classList.contains("is-open")) {
        cerrarYouTube();
      }
      /* Pausar otros videos locales que estén reproduciéndose */
      document.querySelectorAll("#multimedia video").forEach(function (otro) {
        if (otro !== video && !otro.paused) {
          otro.pause();
        }
      });
    });
  });

  // Event listeners para botones de YouTube
  botonesYouTube.forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (boton.dataset.direct === "true") {
        return; // deja que el enlace navegue directamente a YouTube
      }

      abrirYouTube(
        boton.dataset.videoId,
        boton.dataset.videoTitle,
        boton.dataset.videoList,
        boton.dataset.embedUrl
      );
    });
  });

  // Botón de cerrar
  if (youtubeClose) {
    youtubeClose.addEventListener("click", cerrarYouTube);
  }

  // Cerrar al hacer click en el overlay
  if (youtubeModal) {
    youtubeModal.addEventListener("click", function (evento) {
      const cerrar = evento.target.getAttribute("data-close-modal");
      if (cerrar === "true") {
        cerrarYouTube();
      }
    });
  }

  // Cerrar con tecla Escape
  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarYouTube();
    }
  });
}