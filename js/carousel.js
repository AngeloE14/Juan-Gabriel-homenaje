/*
  CONCEPTOS JAVASCRIPT AVANZADOS:
  - ARRAYS: Listas de elementos (slides)
  - TEMPORIZADORES: setInterval() para autoplay
  - MANIPULACIÓN DE CLASES: classList.add/remove/toggle
  - EVENTOS DE TECLADO: Responder a flechas del teclado
  - VARIABLES DE ESTADO: Recordar qué slide está activo
*/

/**
 * CAROUSEL.JS - Funcionalidad del carrusel de imágenes
 *
 * Maneja el carrusel de fotos con navegación automática,
 * controles manuales y soporte para teclado.
 */

// MODO ESTRICTO
"use strict";

/*
  FUNCIÓN: inicializarCarrusel()
  OBJETIVO: Configurar todo el comportamiento del carrusel
  CONCEPTO: Inicialización de componentes complejos
*/
export function inicializarCarrusel() {
  // getElementById() - Buscar el contenedor del carrusel
  const carrusel = document.getElementById("carousel-bellas-artes");

  // EARLY RETURN - Si no existe el carrusel, salir de la función
  if (!carrusel) return;

  // querySelectorAll() - Obtener todos los slides (imágenes)
  const slides = carrusel.querySelectorAll(".carousel__slide");
  const dotsContainer = carrusel.querySelector(".carousel__dots");

  // VARIABLES DE ESTADO - Recordar el estado actual
  let indiceActual = 0;    // Índice del slide visible (empieza en 0)
  let autoplayId = null;   // ID del temporizador de autoplay

  /*
    CONFIGURACIÓN INICIAL
    Para cada slide, configurar el fondo difuminado usando CSS variables
  */
  slides.forEach(function (slide) {
    const imagen = slide.querySelector("img");
    if (imagen) {
      // setProperty() - Establecer variable CSS personalizada
      slide.style.setProperty("--bg-image", 'url("' + imagen.src + '")');
    }
  });

  /*
    FUNCIÓN: renderCarrusel()
    OBJETIVO: Actualizar qué slide se muestra
    CONCEPTO: Manipulación de clases CSS dinámicamente
  */
  function renderCarrusel() {
    // forEach() - Recorrer todos los slides
    slides.forEach(function (slide, indice) {
      // classList.toggle() - Agregar/quitar clase según condición
      const activa = indice === indiceActual;
      slide.classList.toggle("is-active", activa);
    });

    // Actualizar los indicadores (dots)
    const dots = carrusel.querySelectorAll(".carousel__dot");
    dots.forEach(function (dot, indice) {
      dot.classList.toggle("is-active", indice === indiceActual);
    });
  }

  /*
    FUNCIÓN: siguiente()
    OBJETIVO: Ir al siguiente slide
    CONCEPTO: Lógica modular con operador módulo (%)
  */
  function siguiente() {
    // OPERADOR MÓDULO: Cuando llega al final, vuelve al inicio
    indiceActual = (indiceActual + 1) % slides.length;
    renderCarrusel();
  }

  /**
   * Retrocede al slide anterior
   */
  function anterior() {
    indiceActual = (indiceActual - 1 + slides.length) % slides.length;
    renderCarrusel();
  }

  /**
   * Inicia la reproducción automática
   */
  function iniciarAutoplay() {
    if (slides.length <= 1) return;
    autoplayId = window.setInterval(siguiente, 5200);
  }

  /**
   * Reinicia el autoplay
   */
  function reiniciarAutoplay() {
    if (autoplayId) {
      window.clearInterval(autoplayId);
    }
    iniciarAutoplay();
  }

  // Crear puntos indicadores dinámicamente
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

  // Inicializar carrusel
  renderCarrusel();
  iniciarAutoplay();
}