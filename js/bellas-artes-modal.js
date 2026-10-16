"use strict";

import { pausarAudioFondo, reanudarAudioFondo } from './utils.js';

const CONCIERTOS = {
  '1990': {
    src: 'https://archive.org/embed/juan-gabriel-en-el-palacio-de-bellas-artes-1990?autoplay=1',
    downloadUrl: 'https://www.mediafire.com/file/i8c7b5396ekckwx/Juan_Gabriel_Enuit_el_Palacio_de_Bellas_Artes_1990.mp4/file',
    cover: 'albums/Juan Gabriel en el Palacio de Bellas Artes.webp',
    coverAlt: 'Carátula de Juan Gabriel en el Palacio de Bellas Artes 1990',
    downloadLabel: 'En el Palacio de Bellas Artes',
    downloadAria: 'Descargar concierto Bellas Artes 1990',
    setlist: [
      {
        disc: 'Disco 1',
        tracks: [
          'Obertura: No discutamos / Mi fracaso / Adiós, amor te vas',
          'Yo te perdono',
          'Yo no nací para amar',
          'Popurrí: No tengo dinero / Me he quedado solo / No se ha dado cuenta / Buenos días señor Sol',
          'Amor del alma',
          'Ya lo sé que tú te vas',
          'Se me olvidó otra vez',
          'Me nace del corazón / La muerte del palomo',
          'No vale la pena',
          'Popurrí: Que te falta, mujer / No te vaya a suceder / Caray',
          'Inocente pobre amigo',
          'Te lo pido por favor',
          'Amor eterno'
        ]
      },
      {
        disc: 'Disco 2',
        tracks: [
          'Popurrí: Hasta que te conocí / La negra Tomasa / Danzando lambada / Caballo viejo / Bamboleo / Debo hacerlo / Adoro / Te dedico esta canción / Cada quién su camino',
          'No me vuelvo a enamorar / Quédate conmigo esta noche / Tenías qué ser tan cruel',
          'De mí enamórate',
          'Mi más bello error',
          'Querida / Contigo aprendí / Bonita / La diferencia / Qué te pasa / Toda la vida / Muévanse todos',
          'Debo hacerlo',
          'La más querida',
          'Lo pasado, pasado',
          'Viva México / Guadalajara',
          'Final: Adiós amor, te vas'
        ]
      }
    ]
  },
  'celebrando': {
    src: 'https://archive.org/embed/juan-gabriel-celebrando-25-anos-en-el-palacio-de-bellas-artes-1998-completo._202606?autoplay=1',
    downloadUrl: 'https://www.mediafire.com/file/qd1wboozctjlahq/Juan_Gabriel_-_Celebrando_25_A%25C3%25B1os_En_El_Palacio_De_Bellas_Artes_1998_-_Completo..mp4/file',
    cover: 'albums/Celebrando 25 años.webp',
    coverAlt: 'Carátula de Celebrando 25 años en Bellas Artes',
    downloadLabel: 'Celebrando 25 años en Bellas Artes',
    downloadAria: 'Descargar concierto Celebrando 25 años en Bellas Artes',
    setlist: [
      {
        disc: 'Disco 1',
        tracks: [
          'Obertura: El Amor',
          'Que Buena Suerte',
          'Sin Dinero y Con Guitarra: Aquella Melodía',
          'Recordándote',
          'Así Fue',
          'Cuantos Días Más',
          'Queriendo y No',
          'Hoy Todos Mis Días',
          'Rumbeando Por Madrid: La Madrileña/María José/Cuando Seas Mi Mujer',
          'Ven a Mi Soledad',
          'Amor Eterno'
        ]
      },
      {
        disc: 'Disco 2',
        tracks: [
          'El Principio',
          'La Herencia',
          'Homenaje a Lola: Que Viva Lola/Cucurrucucu Paloma',
          'Te Sigo Amando',
          'Costumbres',
          'No Me Arrepiento de Nada',
          'Abuso',
          'Chachaseando (Pensando en Ti): Siempre en Mi Mente/Mentira',
          'Te Recuerdo Dulcemente',
          'Obertura: El Amor'
        ]
      }
    ]
  },
  '2013': {
    src: 'https://archive.org/embed/juan-gabriel-mis-40-en-bellas-artes?autoplay=1',
    downloadUrl: 'https://www.mediafire.com/file/lqnvloigup7wtcd/Juan_Gabriel_-_Mis_40_en_Bellas_Artes.mp4/file',
    cover: 'albums/Mis 40 en Bellas Artes.webp',
    coverAlt: 'Carátula de Mis 40 en Bellas Artes',
    downloadLabel: 'Mis 40 en Bellas Artes',
    downloadAria: 'Descargar concierto Mis 40 en Bellas Artes',
    setlist: [
      {
        disc: 'Disco 1',
        tracks: [
          'Obertura Parácuaro',
          'Mi Pueblito',
          'Querida / Me Nace del Corazón',
          'Caray / Esta Noche Voy a Verla / Juntos / Me Gustas Mucho',
          'Amor de un Rato',
          'La Diferencia / No Discutamos',
          'Tú a Mí No Me Hundes',
          'Con Todo y Mi Tristeza',
          'Rondinella',
          'María José',
          'Del Olvido al No Me Acuerdo',
          'Insensible',
          'Tus Ojos Mexicanos Lindos',
          'Siempre en Mi Mente'
        ]
      },
      {
        disc: 'Disco 2',
        tracks: [
          'Cuando Quieras Déjame',
          'Luna',
          'He Venido a Pedirte Perdón',
          'Abrázame Muy Fuerte',
          'Vienes o Voy',
          'Así Fue',
          'Déjame Vivir',
          '¿Por Qué Me Haces Llorar?',
          'Que No Diera Yo',
          'El Noa Noa'
        ]
      }
    ]
  }
};

export function inicializarBellasArtesModal() {
  const modal = document.getElementById("bellasModal");
  const video = document.getElementById("bellasVideo");
  const downloadLink = document.getElementById("bellasDownload");
  const downloadCover = document.getElementById("bellasDownloadCover");
  const downloadLabel = document.getElementById("bellasDownloadLabel");
  const setlist = document.getElementById("bellasSetlist");
  const setlistTracks = document.getElementById("bellasSetlistTracks");
  const closeBtn = document.querySelector(".bellas-modal__close");
  const botones = document.querySelectorAll(".bellas-btn");

  if (setlist && modal) {
    setlist.addEventListener("toggle", function () {
      modal.classList.toggle("bellas-modal--setlist-open", setlist.open);
    });
  }

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

  function mostrarSetlist(canciones) {
    if (!setlist || !setlistTracks) return;

    setlistTracks.replaceChildren();
    setlist.hidden = !canciones || canciones.length === 0;
    setlist.open = false;
    if (modal) modal.classList.remove("bellas-modal--setlist-open");
    if (!canciones || canciones.length === 0) return;

    canciones.forEach(function (disco) {
      disco.tracks.forEach(function (titulo) {
        const item = document.createElement("li");
        item.textContent = titulo;
        setlistTracks.appendChild(item);
      });
    });
  }

  function abrirConcierto(anio) {
    if (!modal || !video) return;

    const datos = CONCIERTOS[anio];
    if (!datos) return;

    detenerOtrosMedios();
    mostrarSetlist(datos.setlist);
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

    modal.classList.remove("bellas-modal--1990");
    modal.classList.remove("bellas-modal--celebrando");
    modal.classList.remove("bellas-modal--2013");
    modal.classList.remove("bellas-modal--setlist-open");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("bellas-modal-open");
    document.body.classList.add("bellas-modal-open");

    if (anio === "1990") {
      modal.classList.add("bellas-modal--1990");
    }
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
    modal.classList.remove("bellas-modal--1990");
    modal.classList.remove("bellas-modal--celebrando");
    modal.classList.remove("bellas-modal--2013");
    modal.classList.remove("bellas-modal--setlist-open");
    modal.setAttribute("aria-hidden", "true");
    video.setAttribute("src", "");
    mostrarSetlist(null);
    document.documentElement.classList.remove("bellas-modal-open");
    document.body.classList.remove("bellas-modal-open");
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
