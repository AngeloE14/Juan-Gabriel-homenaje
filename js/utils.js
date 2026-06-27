/*
  ===========================================
  UTILS.JS - UTILIDADES GENERALES
  ===========================================

  CONCEPTO: FUNCIONES REUTILIZABLES
  Este archivo contiene funciones que se usan en múltiples partes del sitio.
  Son como "herramientas" que puedes llamar cuando las necesitas.

  CONCEPTOS JAVASCRIPT BÁSICOS:
  - FUNCIONES: Bloques de código reutilizables
  - VARIABLES: Almacenan datos (const = constante, let = variable)
  - DOM: Manipular elementos HTML desde JavaScript
  - EVENTOS: Responder a acciones del usuario
  - EXPORT: Compartir funciones con otros archivos
*/

/**
 * UTILS.JS - Utilidades generales de la aplicación
 *
 * Este archivo contiene funciones de utilidad generales como:
 * - Colocación del año actual
 * - Navegación del menú
 * - Reproducción de intro en video
 */

// MODO ESTRICTO - Ayuda a encontrar errores
"use strict";

let audioFondo;

/*
  FUNCIÓN: colocarAnioActual()
  OBJETIVO: Mostrar el año actual en el footer
  CONCEPTO: Manipulación del DOM - cambiar contenido de elementos
*/
export function colocarAnioActual() {
  // getElementById() - Busca elemento por su atributo id
  const anioActual = document.getElementById("anio-actual");

  // IF - Condicional: "si existe el elemento"
  if (anioActual) {
    // new Date() - Objeto que representa la fecha/hora actual
    const hoy = new Date();
    // getFullYear() - Método que devuelve el año (2024)
    const anio = hoy.getFullYear();
    // textContent - Propiedad que cambia el texto dentro del elemento
    anioActual.textContent = anio;
  }
}

/*
  FUNCIÓN: marcarEnlaceActivo()
  OBJETIVO: Resaltar el enlace del menú que corresponde a la sección actual
  CONCEPTO: querySelectorAll() - seleccionar múltiples elementos
*/
export function marcarEnlaceActivo() {
  // querySelectorAll() - Selecciona TODOS los elementos que coincidan
  const enlacesMenu = document.querySelectorAll(".main-nav a");
  // window.location.hash - Parte de la URL después de # (ej: #biografia)
  const hashActual = window.location.hash || "#biografia";

  // forEach() - Ejecuta una función para cada elemento del array
  enlacesMenu.forEach(function (enlace) {
    // getAttribute() - Obtiene el valor de un atributo HTML
    const esActivo = enlace.getAttribute("href") === hashActual;
    // setAttribute() - Cambia el valor de un atributo HTML
    enlace.setAttribute("aria-current", esActivo ? "page" : "false");
  });
}

/*
  FUNCIÓN: inicializarNavegacion()
  OBJETIVO: Hacer que los clics en el menú funcionen
  CONCEPTO: Event Listeners - responder a clics del usuario
*/
export function inicializarNavegacion() {
  const enlacesMenu = document.querySelectorAll(".main-nav a");
  const botonNavegacion = document.getElementById("nav-toggle");
  const barraLateral = document.getElementById("sidebar-nav");
  const overlayNavegacion = document.getElementById("nav-overlay");
  const body = document.body;

  function cerrarNavegacion() {
    if (!body) {
      return;
    }

    body.classList.remove("nav-open");

    if (botonNavegacion) {
      botonNavegacion.setAttribute("aria-expanded", "false");
      botonNavegacion.setAttribute("aria-label", "Abrir navegación");
    }

    if (overlayNavegacion) {
      overlayNavegacion.setAttribute("aria-hidden", "true");
    }

    if (barraLateral) {
      barraLateral.setAttribute("aria-hidden", "true");
    }
  }

  function abrirNavegacion() {
    if (!body) {
      return;
    }

    body.classList.add("nav-open");

    if (botonNavegacion) {
      botonNavegacion.setAttribute("aria-expanded", "true");
      botonNavegacion.setAttribute("aria-label", "Cerrar navegación");
    }

    if (overlayNavegacion) {
      overlayNavegacion.setAttribute("aria-hidden", "false");
    }

    if (barraLateral) {
      barraLateral.setAttribute("aria-hidden", "false");
    }
  }

  function alternarNavegacion() {
    if (!body) {
      return;
    }

    const estaAbierta = body.classList.contains("nav-open");
    if (estaAbierta) {
      cerrarNavegacion();
      return;
    }

    abrirNavegacion();
  }

  enlacesMenu.forEach(function (enlace) {
    // addEventListener() - "Escucha" cuando pasa un evento
    enlace.addEventListener("click", function () {
      console.log("Navegando a:", enlace.getAttribute("href"));
      marcarEnlaceActivo();
      cerrarNavegacion();
    });
  });

  if (botonNavegacion) {
    botonNavegacion.addEventListener("click", alternarNavegacion);
  }

  if (overlayNavegacion) {
    overlayNavegacion.addEventListener("click", cerrarNavegacion);
  }

  window.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      cerrarNavegacion();
    }
  });

  // Evento cuando cambia el hash manualmente
  window.addEventListener("hashchange", marcarEnlaceActivo);

  cerrarNavegacion();
}

/**
 * Reproduce el video de introducción al cargar la página.
 * Cuando termina la intro, revela el contenido principal y deja
 * que se ejecute la animación del logo en el header.
 */
export function reproducirIntroAlCargar() {
  const body = document.body;
  const introOverlay = document.getElementById("intro-overlay");
  const introVideo = document.getElementById("intro-video");
  const visualViewport = window.visualViewport;

  if (!body) {
    return;
  }

  if (!introOverlay || !introVideo) {
    console.warn("No se encontró el contenedor de intro en video");
    body.classList.remove("intro-activa");
    return;
  }

  // Se intenta con audio primero.
  introVideo.defaultMuted = false;
  introVideo.muted = false;
  introVideo.playsInline = true;

  let introFinalizada = false;
  let desbloqueoAudioRegistrado = false;

  function ajustarAlturaIntro() {
    if (introFinalizada) {
      return;
    }

    const altoViewport = visualViewport ? visualViewport.height : window.innerHeight;
    if (altoViewport && Number.isFinite(altoViewport)) {
      introOverlay.style.height = Math.round(altoViewport) + "px";
    }
  }

  function limpiarEventosViewport() {
    window.removeEventListener("resize", ajustarAlturaIntro);
    window.removeEventListener("orientationchange", ajustarAlturaIntro);
    if (visualViewport) {
      visualViewport.removeEventListener("resize", ajustarAlturaIntro);
      visualViewport.removeEventListener("scroll", ajustarAlturaIntro);
    }
  }

  ajustarAlturaIntro();
  window.addEventListener("resize", ajustarAlturaIntro);
  window.addEventListener("orientationchange", ajustarAlturaIntro);
  if (visualViewport) {
    visualViewport.addEventListener("resize", ajustarAlturaIntro);
    visualViewport.addEventListener("scroll", ajustarAlturaIntro);
  }

  function quitarDesbloqueoAudio() {
    if (!desbloqueoAudioRegistrado) {
      return;
    }

    document.removeEventListener("click", desbloquearAudio);
    document.removeEventListener("keydown", desbloquearAudio);
    document.removeEventListener("touchstart", desbloquearAudio);
    desbloqueoAudioRegistrado = false;
  }

  function desbloquearAudio() {
    if (introFinalizada) {
      return;
    }

    introVideo.muted = false;
    introVideo.defaultMuted = false;

    const intentoAudio = introVideo.play();
    if (intentoAudio && typeof intentoAudio.then === "function") {
      intentoAudio
        .then(function () {
          console.log("[Intro] Audio activado por interacción del usuario");
          quitarDesbloqueoAudio();
        })
        .catch(function (errorAudio) {
          console.warn("[Intro] Aún no se pudo activar audio tras interacción", errorAudio);
        });
    }
  }

  function registrarDesbloqueoAudio() {
    if (desbloqueoAudioRegistrado) {
      return;
    }

    desbloqueoAudioRegistrado = true;
    document.addEventListener("click", desbloquearAudio, { once: true });
    document.addEventListener("keydown", desbloquearAudio, { once: true });
    document.addEventListener("touchstart", desbloquearAudio, { once: true });
  }

  function finalizarIntro(motivo) {
    if (introFinalizada) {
      return;
    }

    introFinalizada = true;
    quitarDesbloqueoAudio();
    limpiarEventosViewport();
    body.classList.remove("intro-activa");
    body.classList.add("intro-finalizada");
    introOverlay.classList.add("is-hidden");

    window.setTimeout(function () {
      if (introOverlay.parentElement) {
        introOverlay.remove();
      }
    }, 700);

    document.dispatchEvent(new Event("intro-finalizada"));
    console.log("[Intro] Intro finalizada:", motivo);
  }

  introVideo.addEventListener("ended", function () {
    finalizarIntro("video-ended");
  }, { once: true });

  introVideo.addEventListener("error", function (errorEvento) {
    console.error("[Intro] Error al reproducir Intro.mp4", errorEvento);
    finalizarIntro("video-error");
  }, { once: true });

  const intentoReproduccion = introVideo.play();

  if (intentoReproduccion && typeof intentoReproduccion.then === "function") {
    intentoReproduccion.catch(function (errorAutoplay) {
      console.warn("[Intro] Autoplay con audio bloqueado. Activando fallback en silencio.", errorAutoplay);
      introVideo.defaultMuted = true;
      introVideo.muted = true;

      introVideo.play().then(function () {
        console.log("[Intro] Reproducción iniciada en silencio por políticas del navegador");
        registrarDesbloqueoAudio();
      }).catch(function (errorFinal) {
        console.error("[Intro] No se pudo reproducir Intro.mp4 automáticamente", errorFinal);
        finalizarIntro("autoplay-blocked");
      });
    });
  }
}

export function pausarAudioFondo() {
  if (typeof audioFondo !== "undefined" && audioFondo && !audioFondo.paused) {
    audioFondo.pause();
  }
}

export function reanudarAudioFondo() {
  if (typeof audioFondo !== "undefined" && audioFondo && audioFondo.paused) {
    audioFondo.play().catch(function () {});
  }
}

export function inicializarAudioFondo() {
  const btn = document.getElementById("music-btn");
  if (!btn) {
    return;
  }

  const canciones = [
    "audios/amor eterno.mp3",
    "audios/de mi enamorate.mp3",
    "audios/fue un placer conocerte.mp3",
    "audios/te lo pido por favor.mp3",
    "audios/debo hacerlo.mp3",
    "audios/se me olvido otra vez.mp3",
    "audios/dejame vivir.mp3",
    "audios/me nace del corazon.mp3"
  ];

  let indiceActual = Math.floor(Math.random() * canciones.length);
  audioFondo = new Audio(canciones[indiceActual]);
  audioFondo.volume = 0.46;
  audioFondo.playsInline = true;
  audioFondo.preload = "auto";

  let desbloqueoRegistrado = false;

  function cancionSiguiente() {
    indiceActual = Math.floor(Math.random() * canciones.length);
    audioFondo.src = canciones[indiceActual];
    audioFondo.play().catch(function () {});
  }

  audioFondo.addEventListener("ended", cancionSiguiente);

  function actualizarUI() {
    const reproduciendo = !audioFondo.paused;
    btn.classList.toggle("is-playing", reproduciendo);
    btn.setAttribute(
      "aria-label",
      reproduciendo ? "Pausar música de fondo" : "Reproducir música de fondo"
    );
  }

  function alternarReproduccion() {
    if (audioFondo.paused) {
      const intento = audioFondo.play();
      if (intento && typeof intento.then === "function") {
        intento.then(actualizarUI).catch(function (e) {
          console.warn("[AudioFondo] No se pudo reanudar", e);
        });
      }
    } else {
      audioFondo.pause();
      actualizarUI();
    }
  }

  function quitarDesbloqueoAudio() {
    if (!desbloqueoRegistrado) {
      return;
    }
    document.removeEventListener("click", desbloquearAudio);
    document.removeEventListener("keydown", desbloquearAudio);
    document.removeEventListener("touchstart", desbloquearAudio);
    desbloqueoRegistrado = false;
  }

  function desbloquearAudio() {
    audioFondo.muted = false;
    audioFondo.defaultMuted = false;

    const intento = audioFondo.play();
    if (intento && typeof intento.then === "function") {
      intento
        .then(function () {
          console.log("[AudioFondo] Audio activado por interacción del usuario");
          actualizarUI();
          quitarDesbloqueoAudio();
        })
        .catch(function (e) {
          console.warn("[AudioFondo] No se pudo activar tras interacción", e);
        });
    }
  }

  function registrarDesbloqueoAudio() {
    if (desbloqueoRegistrado) {
      return;
    }
    desbloqueoRegistrado = true;
    document.addEventListener("click", desbloquearAudio, { once: true });
    document.addEventListener("keydown", desbloquearAudio, { once: true });
    document.addEventListener("touchstart", desbloquearAudio, { once: true });
  }

  function iniciarAudioFondo() {
    const intento = audioFondo.play();

    if (intento && typeof intento.then === "function") {
      intento
        .then(actualizarUI)
        .catch(function () {
          console.warn("[AudioFondo] Autoplay bloqueado. Esperando interacción.");
          audioFondo.muted = true;
          audioFondo.defaultMuted = true;
          audioFondo.play().catch(function () {});
          registrarDesbloqueoAudio();
        });
    }
  }

  btn.addEventListener("click", alternarReproduccion);

  const videosLocales = document.querySelectorAll("#multimedia video");
  videosLocales.forEach(function (video) {
    video.addEventListener("play", function () {
      pausarAudioFondo();
    });
    video.addEventListener("pause", function () {
      reanudarAudioFondo();
    });
    video.addEventListener("ended", function () {
      reanudarAudioFondo();
    });
  });

  if (document.body.classList.contains("intro-activa")) {
    document.addEventListener("intro-finalizada", iniciarAudioFondo, { once: true });
  } else {
    iniciarAudioFondo();
  }
}
