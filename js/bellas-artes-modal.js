"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

const CONCIERTOS = {
  '1990': {
    src: 'https://archive.org/embed/juan-gabriel-en-el-palacio-de-bellas-artes-1990',
    quote: 'Juan Gabriel en Bellas Artes — 1990.'
  },
  'celebrando': {
    src: 'https://archive.org/embed/juan-gabriel-celebrando-25-anos-en-el-palacio-de-bellas-artes-1998-completo._202606',
    quote: 'Celebrando 25 años en Bellas Artes.'
  },
  '2013': {
    src: 'https://archive.org/embed/juan-gabriel-mis-40-en-bellas-artes',
    quote: 'Juan Gabriel — Mis 40 en Bellas Artes.'
  }
};

export function inicializarBellasArtesModal() {
  const modal = document.getElementById("bellasModal");
  const video = document.getElementById("bellasVideo");
  const quote = document.getElementById("bellasQuote");
  const closeBtn = document.querySelector(".bellas-modal__close");
  const botones = document.querySelectorAll(".bellas-btn");

  function detenerOtrosMedios() {
    pausarAudioFondo();

    document.querySelectorAll("#multimedia video").forEach(function (media) {
      media.pause();
    });

    const youtubeFrame = document.getElementById("youtube-frame");
    if (youtubeFrame && youtubeFrame.getAttribute("src")) {
      youtubeFrame.setAttribute("src", "");
    }

    const youtubeModal = document.getElementById("youtube-modal");
    if (youtubeModal) {
      youtubeModal.classList.remove("is-open");
      youtubeModal.setAttribute("aria-hidden", "true");
    }
  }

  function abrirConcierto(anio) {
    if (!modal || !video || !quote) return;

    const datos = CONCIERTOS[anio];
    if (!datos) return;

    detenerOtrosMedios();
    video.setAttribute("src", datos.src);
    quote.textContent = datos.quote;
    quote.style.display = datos.quote ? "" : "none";

    modal.classList.remove("bellas-modal--celebrando");
    modal.classList.remove("bellas-modal--2013");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    if (anio === "celebrando") {
      modal.classList.add("bellas-modal--celebrando");
    }
    if (anio === "2013") {
      modal.classList.add("bellas-modal--2013");
    }
  }

  function cerrarBellasArtes() {
    if (!modal || !video) return;

    modal.classList.remove("is-open");
    modal.classList.remove("bellas-modal--celebrando");
    modal.classList.remove("bellas-modal--2013");
    modal.setAttribute("aria-hidden", "true");
    video.setAttribute("src", "");
    reanudarAudioFondo();
  }

  botones.forEach(function (btn) {
    btn.addEventListener("click", function () {
      abrirConcierto(this.getAttribute("data-concierto"));
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", cerrarBellasArtes);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      cerrarBellasArtes();
    }
  });

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.classList.contains("bellas-modal__overlay")) {
        cerrarBellasArtes();
      }
    });
  }
}
