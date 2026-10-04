/*
  ===========================================
  INDEX.JS - PUNTO DE ENTRADA PRINCIPAL
  ===========================================

  CONCEPTO BÁSICO DE JAVASCRIPT PARA PRINCIPIANTES:
  JavaScript es el lenguaje de programación que hace que las páginas web sean interactivas.
  Permite responder a clics, animaciones, cargar datos, etc.

  MÓDULOS ES6:
  - import: Trae funciones de otros archivos
  - export: Comparte funciones desde este archivo
  - Ventaja: Código organizado, reutilizable y fácil de mantener

  DOM (Document Object Model):
  - Es la representación en JavaScript del HTML de la página
  - Permite modificar contenido, estilos y comportamiento
  - document = el objeto principal que representa toda la página

  EVENTOS:
  - Son "cosas que pasan" (clics, carga de página, movimientos del mouse)
  - addEventListener() = "escucha" cuando pasa algo y ejecuta código
*/

/**
 * INDEX.JS - Archivo principal de JavaScript
 *
 * Punto de entrada principal que coordina todos los módulos
 * de la aplicación y maneja la inicialización.
 */

// "USE STRICT" - MODO ESTRICTO
// Hace que JavaScript sea más estricto y ayude a encontrar errores
"use strict";

/*
  IMPORTS - TRAER FUNCIONES DE OTROS ARCHIVOS
  Sintaxis: import { función1, función2 } from './archivo.js'
  El ./ significa "en la misma carpeta"
*/
import { marcarEnlaceActivo, inicializarNavegacion, reproducirIntroAlCargar, inicializarAudioFondo, aplicarClaseRendimientoDelDispositivo } from './utils.js';
import { inicializarCarrusel } from './carousel.js';
import { inicializarYouTubeModal } from './youtube-modal.js';
import { inicializarBellasArtesModal } from './bellas-artes-modal.js';
import { inicializarFrasesRotativas } from './quotes-rotator.js';
/* CAMBIO: Importa la lógica del carrusel 3D de Fragmentos */
import { inicializarArtistasCarousel, inicializarFragmentosCarousel } from './artistas-carousel.js';
import { inicializarLightbox } from './lightbox.js?v=2';
import { inicializarBotonSubir } from './back-to-top.js';

function inicializarRetratoDiscografia() {
  const section = document.querySelector('#discografia');
  const firma = document.querySelector('#discografia .discografia-firma');
  const retrato = document.querySelector('#discografia .discografia-retrato');

  if (!section || !firma || !retrato) {
    return;
  }

  const ajustarPosicion = function () {
    const sectionRect = section.getBoundingClientRect();
    const firmaRect = firma.getBoundingClientRect();
    const esMovil = window.matchMedia('(max-width: 900px)').matches;

    if (esMovil) {
      retrato.style.top = `${firmaRect.top - sectionRect.top + 340}px`;
      retrato.style.right = '8px';
      retrato.style.zIndex = '2';
      return;
    }

    retrato.style.top = `${firmaRect.top - sectionRect.top + 10}px`;
    retrato.style.right = 'clamp(24px, 8vw, 144px)';
  };

  const ajustarEnFrame = function () {
    window.requestAnimationFrame(ajustarPosicion);
  };

  if (retrato.complete) {
    ajustarEnFrame();
  } else {
    retrato.addEventListener('load', ajustarEnFrame, { once: true });
  }

  section.querySelectorAll('.discografia-gallery img').forEach(function (imagen) {
    imagen.addEventListener('load', ajustarEnFrame, { once: true });
  });

  window.addEventListener('load', ajustarEnFrame, { once: true });

  if ('ResizeObserver' in window) {
    const observador = new ResizeObserver(ajustarEnFrame);
    observador.observe(section);
  }

  window.addEventListener('resize', ajustarEnFrame, { passive: true });
}

/*
  DOMContentLoaded - EVENTO DE CARGA
  Se ejecuta cuando el HTML está completamente cargado.
  Es mejor que window.onload porque no espera imágenes/css externos.

  SINTAXIS:
  elemento.addEventListener("evento", función);
*/
document.addEventListener("DOMContentLoaded", function () {
  // CRÍTICO: Ejecutar de inmediato
  aplicarClaseRendimientoDelDispositivo();
  marcarEnlaceActivo();
  inicializarNavegacion();
  reproducirIntroAlCargar();
  inicializarRetratoDiscografia();

  // AUDIO: inicializar DE INMEDIATO, no en idle. Si el usuario oprime
  // "Omitir" antes del idle callback, el evento intro-finalizada se pierde
  // y la música arrancaría fuera de su gesto (los navegadores móviles la
  // bloquean o dejan muda). Inicializado ya, el play() corre DENTRO del
  // clic en Omitir → suena al instante.
  inicializarAudioFondo();

  // IMPORTANTE pero puede esperar un frame
  requestAnimationFrame(function () {
    inicializarCarrusel();
    inicializarYouTubeModal();
    inicializarBellasArtesModal();
    inicializarFrasesRotativas();
    inicializarArtistasCarousel();
    inicializarFragmentosCarousel();
    inicializarLightbox();
    inicializarBotonSubir();
  });
});
