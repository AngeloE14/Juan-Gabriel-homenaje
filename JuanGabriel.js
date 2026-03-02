"use strict";
// 1) Esperamos a que el HTML termine de cargar
document.addEventListener("DOMContentLoaded", function () {
  // 2) Guardamos elementos del DOM en variables
  const anioActual = document.getElementById("anio-actual");
  const enlacesMenu = document.querySelectorAll(".main-nav a");
  const dialogoAudio = document.getElementById("dialogo-audio");

  function reproducirDialogoAlCargar() {
    if (!dialogoAudio) return;

    const intento = dialogoAudio.play();

    // Si el navegador bloquea autoplay con sonido,
    // intentamos reproducir en la primera interacción del usuario.
    if (intento && typeof intento.catch === "function") {
      intento.catch(function () {
        function desbloquearYReproducir() {
          dialogoAudio.play().catch(function () {});
        }

        document.addEventListener("click", desbloquearYReproducir, { once: true });
        document.addEventListener("keydown", desbloquearYReproducir, { once: true });
        document.addEventListener("touchstart", desbloquearYReproducir, { once: true });
      });
    }
  }

  // 3) Función simple: mostrar el año actual en el footer
  function colocarAnioActual() {
    const hoy = new Date();
    const anio = hoy.getFullYear();

    if (anioActual) {
      anioActual.textContent = anio;
    }
  }

  // 4) Función para marcar el enlace activo usando el hash (#biografia, etc.)
  function marcarEnlaceActivo() {
    const hashActual = window.location.hash || "#biografia";

    enlacesMenu.forEach(function (enlace) {
      const esActivo = enlace.getAttribute("href") === hashActual;
      enlace.setAttribute("aria-current", esActivo ? "page" : "false");
    });
  }

  // 5) Evento click en el menú (aprendizaje de eventos)
  enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      // Mensaje de apoyo en consola para práctica
      console.log("Navegando a:", enlace.getAttribute("href"));
      marcarEnlaceActivo();
    });
  });

  // 6) Evento del navegador cuando cambia el hash manualmente
  window.addEventListener("hashchange", marcarEnlaceActivo);

  // 7) Ejecutamos funciones iniciales
  colocarAnioActual();
  marcarEnlaceActivo();
  reproducirDialogoAlCargar();

  // 8) Carrusel basico de fotos (fundamentos: variables, funciones y eventos)
  const carrusel = document.getElementById("carousel-bellas-artes");

  if (carrusel) {
    const slides = carrusel.querySelectorAll(".carousel__slide");
    const dotsContainer = carrusel.querySelector(".carousel__dots");
    let indiceActual = 0;
    let autoplayId = null;

    // Fondo difuminado por slide para rellenar laterales en fotos verticales
    slides.forEach(function (slide) {
      const imagen = slide.querySelector("img");
      if (imagen) {
        slide.style.setProperty("--bg-image", 'url("' + imagen.src + '")');
      }
    });

    function renderCarrusel() {
      slides.forEach(function (slide, indice) {
        const activa = indice === indiceActual;
        slide.classList.toggle("is-active", activa);
      });

      const dots = carrusel.querySelectorAll(".carousel__dot");
      dots.forEach(function (dot, indice) {
        dot.classList.toggle("is-active", indice === indiceActual);
      });
    }

    function siguiente() {
      indiceActual = (indiceActual + 1) % slides.length;
      renderCarrusel();
    }

    function anterior() {
      indiceActual = (indiceActual - 1 + slides.length) % slides.length;
      renderCarrusel();
    }

    function iniciarAutoplay() {
      if (slides.length <= 1) return;
      autoplayId = window.setInterval(siguiente, 5200);
    }

    function reiniciarAutoplay() {
      if (autoplayId) {
        window.clearInterval(autoplayId);
      }
      iniciarAutoplay();
    }

    // Crear puntos indicadores dinamicamente
    slides.forEach(function (_, indice) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("aria-label", "Ir a foto " + (indice + 1));
      dot.addEventListener("click", function () {
        indiceActual = indice;
        renderCarrusel();
        reiniciarAutoplay();
      });
      if (dotsContainer) {
        dotsContainer.appendChild(dot);
      }
    });

    // Click manual: izquierda = anterior, derecha = siguiente
    carrusel.addEventListener("click", function (evento) {
      if (evento.target.closest(".carousel__dot")) return;

      const rect = carrusel.getBoundingClientRect();
      const clickEnMitadDerecha = evento.clientX > rect.left + rect.width / 2;
      if (clickEnMitadDerecha) {
        siguiente();
      } else {
        anterior();
      }
      reiniciarAutoplay();
    });

    // Teclado: flechas izquierda/derecha cuando el carrusel tiene foco
    carrusel.addEventListener("keydown", function (evento) {
      if (evento.key === "ArrowRight") {
        siguiente();
        reiniciarAutoplay();
      }
      if (evento.key === "ArrowLeft") {
        anterior();
        reiniciarAutoplay();
      }
    });

    renderCarrusel();
    iniciarAutoplay();
  }

  // 9) Modal YouTube en Multimedia (abrir/cerrar reproductor)
  const botonesYouTube = document.querySelectorAll(".youtube-open");
  const youtubeModal = document.getElementById("youtube-modal");
  const youtubeFrame = document.getElementById("youtube-frame");
  const youtubeClose = document.getElementById("youtube-close");

  function abrirYouTube(videoId, titulo, lista, embedUrl) {
    if (!youtubeModal || !youtubeFrame) return;

    // Si el HTML trae una URL embed completa, la usamos tal cual (caso especial de compatibilidad)
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

  function cerrarYouTube() {
    if (!youtubeModal || !youtubeFrame) return;
    youtubeModal.classList.remove("is-open");
    youtubeModal.setAttribute("aria-hidden", "true");
    youtubeFrame.src = "";
  }

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

  if (youtubeClose) {
    youtubeClose.addEventListener("click", cerrarYouTube);
  }

  if (youtubeModal) {
    youtubeModal.addEventListener("click", function (evento) {
      const cerrar = evento.target.getAttribute("data-close-modal");
      if (cerrar === "true") {
        cerrarYouTube();
      }
    });
  }

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarYouTube();
    }
  });

  // 10) Modo Bellas Artes (botón toggle + modal)
  const bellasToggle = document.getElementById("bellasToggle");
  const bellasModal = document.getElementById("bellasModal");
  const bellasClose = document.querySelector(".bellas-modal__close");
  const bellasMedia = document.querySelector(".bellas-video");
  const bellasMediaSrc = bellasMedia ? bellasMedia.getAttribute("src") : "";

  function reproducirMediaBellas() {
    if (!bellasMedia) return;

  
    if (bellasMedia.tagName === "IFRAME") {
      if (!bellasMedia.getAttribute("src") && bellasMediaSrc) {
        bellasMedia.setAttribute("src", bellasMediaSrc);
      }
    }
  }

  function detenerMediaBellas() {
    if (!bellasMedia) return;

    if (bellasMedia.tagName === "VIDEO") {
      bellasMedia.pause();
      bellasMedia.currentTime = 0;
      return;
    }

    if (bellasMedia.tagName === "IFRAME") {
      // Forzamos a detener reproducción remota limpiando el src.
      bellasMedia.setAttribute("src", "");
    }
  }

  function abrirBellasArtes() {
    if (!bellasModal || !bellasMedia) return;

    bellasModal.classList.add("is-open");
    bellasModal.setAttribute("aria-hidden", "false");

    reproducirMediaBellas();
  }

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

  // Cerrar con ESC
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
});
