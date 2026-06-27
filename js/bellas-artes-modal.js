"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

const CONCIERTOS = {
  '1990': {
    src: 'https://archive.org/embed/juan-gabriel-en-el-palacio-de-bellas-artes-1990',
    downloadUrl: 'https://www.mediafire.com/file/i8c7b5396ekckwx/Juan_Gabriel_En_el_Palacio_de_Bellas_Artes_1990.mp4/file',
    cover: 'albums/Juan Gabriel en el Palacio de Bellas Artes.jpg',
    coverAlt: 'Carátula de Juan Gabriel en el Palacio de Bellas Artes 1990',
    downloadLabel: 'Descargar concierto',
    downloadAria: 'Descargar concierto Bellas Artes 1990'
  },
  'celebrando': {
    src: 'https://archive.org/embed/juan-gabriel-celebrando-25-anos-en-el-palacio-de-bellas-artes-1998-completo._202606',
    downloadUrl: 'https://www.mediafire.com/file/qd1wboozctjlahq/Juan_Gabriel_-_Celebrando_25_A%25C3%25B1os_En_El_Palacio_De_Bellas_Artes_1998_-_Completo..mp4/file',
    cover: 'albums/Celebrando 25 años.jpeg',
    coverAlt: 'Carátula de Celebrando 25 años en Bellas Artes',
    downloadLabel: 'Descargar presentación',
    downloadAria: 'Descargar concierto Celebrando 25 años en Bellas Artes'
  },
  '2013': {
    src: 'https://archive.org/embed/juan-gabriel-mis-40-en-bellas-artes',
    downloadUrl: 'https://www.mediafire.com/file/lqnvloigup7wtcd/Juan_Gabriel_-_Mis_40_en_Bellas_Artes.mp4/file',
    cover: 'albums/Mis 40 en Bellas Artes.jpg',
    coverAlt: 'Carátula de Mis 40 en Bellas Artes',
    downloadLabel: 'Descargar concierto',
    downloadAria: 'Descargar concierto Mis 40 en Bellas Artes'
  }
};

export function inicializarBellasArtesModal() {
  const modal = document.getElementById("bellasModal");
  const video = document.getElementById("bellasVideo");
  const downloadLink = document.getElementById("bellasDownload");
  const downloadCover = document.getElementById("bellasDownloadCover");
  const downloadLabel = document.getElementById("bellasDownloadLabel");
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
    if (!modal || !video) return;

    const datos = CONCIERTOS[anio];
    if (!datos) return;

    detenerOtrosMedios();
    video.setAttribute("src", datos.src);

    if (downloadLink) {
      downloadLink.setAttribute("href", datos.downloadUrl);
      downloadLink.setAttribute("aria-label", datos.downloadAria);
    }

    if (downloadCover) {
      downloadCover.setAttribute("src", datos.cover);
      downloadCover.setAttribute("alt", datos.coverAlt);
    }

    if (downloadLabel) {
      downloadLabel.textContent = datos.downloadLabel;
    }

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
