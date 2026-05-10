/**
 * YOUTUBE-MODAL.JS - Funcionalidad del modal de YouTube
 *
 * Maneja la apertura y cierre del modal de YouTube
 * con soporte para videos individuales y listas de reproducción.
 */

"use strict";

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
   * @param {string} videoId - ID del video de YouTube
   * @param {string} titulo - Título del video
   * @param {string} lista - ID de la lista de reproducción (opcional)
   * @param {string} embedUrl - URL embed completa (opcional)
   */
  function abrirYouTube(videoId, titulo, lista, embedUrl) {
    if (!youtubeModal || !youtubeFrame) return;

    // Si el HTML trae una URL embed completa, la usamos tal cual
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
  }

  // Event listeners para botones de YouTube
  botonesYouTube.forEach(function (boton) {
    boton.addEventListener("click", function () {
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