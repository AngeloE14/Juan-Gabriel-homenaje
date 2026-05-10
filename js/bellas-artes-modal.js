/**
 * BELLAS-ARTES-MODAL.JS - Funcionalidad del modal de Bellas Artes
 *
 * Maneja el interruptor y modal especial de Bellas Artes
 * con reproducción de video embebido.
 */

"use strict";

/**
 * Inicializa el modal de Bellas Artes
 */
export function inicializarBellasArtesModal() {
  const bellasToggle = document.getElementById("bellasToggle");
  const bellasModal = document.getElementById("bellasModal");
  const bellasClose = document.querySelector(".bellas-modal__close");
  const bellasMedia = document.querySelector(".bellas-video");
  const bellasMediaSrc = bellasMedia ? bellasMedia.getAttribute("src") : "";

  /**
   * Reproduce el media en el modal de Bellas Artes
   */
  function reproducirMediaBellas() {
    if (!bellasMedia) return;

    if (bellasMedia.tagName === "IFRAME") {
      if (!bellasMedia.getAttribute("src") && bellasMediaSrc) {
        bellasMedia.setAttribute("src", bellasMediaSrc);
      }
    }
  }

  /**
   * Detiene el media en el modal de Bellas Artes
   */
  function detenerMediaBellas() {
    if (!bellasMedia) return;

    if (bellasMedia.tagName === "VIDEO") {
      bellasMedia.pause();
      bellasMedia.currentTime = 0;
      return;
    }

    if (bellasMedia.tagName === "IFRAME") {
      // Forzamos a detener reproducción remota limpiando el src
      bellasMedia.setAttribute("src", "");
    }
  }

  /**
   * Abre el modal de Bellas Artes
   */
  function abrirBellasArtes() {
    if (!bellasModal || !bellasMedia) return;

    bellasModal.classList.add("is-open");
    bellasModal.setAttribute("aria-hidden", "false");

    reproducirMediaBellas();
  }

  /**
   * Cierra el modal de Bellas Artes
   */
  function cerrarBellasArtes() {
    if (!bellasModal || !bellasMedia) return;

    bellasModal.classList.remove("is-open");
    bellasModal.setAttribute("aria-hidden", "true");

    detenerMediaBellas();

    // Desactivar el checkbox también
    if (bellasToggle) {
      bellasToggle.checked = false;
    }
  }

  // Click en el botón (checkbox)
  if (bellasToggle) {
    bellasToggle.addEventListener("change", function () {
      if (this.checked) {
        abrirBellasArtes();
      } else {
        cerrarBellasArtes();
      }
    });
  }

  // Click en el botón de cerrar
  if (bellasClose) {
    bellasClose.addEventListener("click", cerrarBellasArtes);
  }

  // Cerrar con tecla Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      cerrarBellasArtes();
    }
  });

  // Cerrar al dar click fuera del video (en el overlay)
  if (bellasModal) {
    bellasModal.addEventListener("click", function (e) {
      if (e.target === bellasModal || e.target.classList.contains("bellas-modal__overlay")) {
        cerrarBellasArtes();
      }
    });
  }
}