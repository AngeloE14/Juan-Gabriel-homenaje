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

/**
 * Detecta si el dispositivo es de bajo recurso para adaptar el rendimiento.
 * No quita animaciones ni efectos, solo ayuda a ajustar tiempos y carga.
 */
let _rendimientoCache = null;

export function obtenerRendimientoDispositivo() {
  if (_rendimientoCache) return _rendimientoCache;

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  const deviceMemory = typeof navigator !== "undefined" && "deviceMemory" in navigator ? navigator.deviceMemory : null;
  const cores = typeof navigator !== "undefined" && "hardwareConcurrency" in navigator ? navigator.hardwareConcurrency : null;
  const saveData = connection ? connection.saveData : false;
  const effectiveType = connection && connection.effectiveType ? connection.effectiveType : "";
  const downlink = connection && typeof connection.downlink === "number" ? connection.downlink : null;
  const rtt = connection && typeof connection.rtt === "number" ? connection.rtt : null;

  const hasLowMemory = deviceMemory !== null ? deviceMemory <= 2 : false;
  const hasFewCores = cores !== null ? cores <= 2 : false;
  const slowNetwork = saveData || ['slow-2g', '2g'].includes(effectiveType) || (downlink !== null && downlink <= 0.5) || (rtt !== null && rtt >= 300);
  const isLowEnd = hasLowMemory || hasFewCores || slowNetwork;
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches;

  _rendimientoCache = {
    isLowEnd,
    isMobile,
    deviceMemory,
    cores,
    effectiveType,
    downlink,
    rtt,
    saveData
  };

  return _rendimientoCache;
}

export function aplicarClaseRendimientoDelDispositivo() {
  const body = document.body;
  if (!body) return { isLowEnd: false, isMobile: false };

  const { isLowEnd, isMobile } = obtenerRendimientoDispositivo();
  body.dataset.performanceTier = isLowEnd ? "low" : "normal";
  body.classList.toggle("low-end-device", isLowEnd);
  body.classList.toggle("mobile-device", isMobile);

  return { isLowEnd, isMobile };
}

// audioFondo = elemento Audio que reproduce la canción actual
let audioFondo;
// audioFondoSiguiente = segundo Audio usado durante el crossfade (se crea uno nuevo al cambiar canción)
let audioFondoSiguiente = null;
// crossfadeActivo = bandera para evitar que se dispare más de un crossfade a la vez
let crossfadeActivo = false;
// intervaloCrossfade = referencia al setInterval que controla la transición de volumen
let intervaloCrossfade = null;
// audioDesactivadoPorUsuario = true cuando el usuario pausó la música manualmente.
// Evita que los modales o videos reanuden la música sin permiso del usuario.
let audioDesactivadoPorUsuario = false;

/*
  FUNCIÓN: sincronizarEstadoBotonMusica()
  OBJETIVO: Mantener el botón de música y sus ondas sincronizados con el
  estado real del audio (reproduciendo = ondas animadas; pausado = quieto).
*/
function sincronizarEstadoBotonMusica() {
  const btn = document.getElementById("music-btn");
  if (!btn) return;
  const reproduciendo = typeof audioFondo !== "undefined" && audioFondo && !audioFondo.paused;
  btn.classList.toggle("is-playing", reproduciendo);
  btn.setAttribute(
    "aria-label",
    reproduciendo ? "Pausar música de fondo" : "Reproducir música de fondo"
  );
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
    enlace.addEventListener("click", function (e) {
      e.preventDefault();
      var destino = document.querySelector(enlace.getAttribute("href"));
      if (destino) {
        var esMovil = window.matchMedia("(max-width: 700px)").matches;
        destino.scrollIntoView({ behavior: esMovil ? "instant" : "smooth" });
      }
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
  const botonOmitirIntro = document.getElementById("intro-skip");
  const botonDesbloqueoAudio = document.getElementById("intro-unlock-btn");
  const introLoading = document.getElementById("intro-loading");
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

  function ocultarLoading() {
    if (introLoading) {
      introLoading.classList.add("is-hidden");
    }
  }

  introVideo.addEventListener("play", ocultarLoading, { once: true });
  introVideo.addEventListener("playing", ocultarLoading, { once: true });
  introVideo.addEventListener("error", ocultarLoading, { once: true });

  // Si el video ya empezó a reproducirse antes de que corriera este script
  // (autoplay nativo en carga local), ocultar el spinner de inmediato.
  if (!introVideo.paused || introVideo.currentTime > 0) {
    ocultarLoading();
  }

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

  function mostrarBotonDesbloqueo() {
    if (botonDesbloqueoAudio) {
      botonDesbloqueoAudio.classList.add("is-visible");
    }
  }

  function ocultarBotonDesbloqueo() {
    if (botonDesbloqueoAudio) {
      botonDesbloqueoAudio.classList.remove("is-visible");
    }
  }

  function quitarDesbloqueoAudio() {
    if (!desbloqueoAudioRegistrado) {
      return;
    }

    document.removeEventListener("click", desbloquearAudio);
    document.removeEventListener("keydown", desbloquearAudio);
    document.removeEventListener("touchstart", desbloquearAudio);
    if (introVideo) {
      introVideo.removeEventListener("touchstart", desbloquearAudio);
    }
    desbloqueoAudioRegistrado = false;
    ocultarBotonDesbloqueo();
  }

  function desbloquearAudio(evento) {
    if (introFinalizada) {
      return;
    }

    evento.preventDefault();

    introVideo.muted = false;
    introVideo.defaultMuted = false;

    const intentoAudio = introVideo.play();
    if (intentoAudio && typeof intentoAudio.then === "function") {
      intentoAudio
        .then(function () {
          quitarDesbloqueoAudio();
        })
        .catch(function (errorAudio) {
          registrarDesbloqueoAudio();
        });
    }
  }

  function registrarDesbloqueoAudio() {
    if (desbloqueoAudioRegistrado) {
      return;
    }

    desbloqueoAudioRegistrado = true;
    mostrarBotonDesbloqueo();
    document.addEventListener("click", desbloquearAudio);
    document.addEventListener("keydown", desbloquearAudio);
    document.addEventListener("touchstart", desbloquearAudio);
    if (introVideo) {
      introVideo.addEventListener("touchstart", desbloquearAudio);
    }
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
    introVideo.pause();

    window.setTimeout(function () {
      if (introOverlay.parentElement) {
        introOverlay.remove();
      }
    }, 700);

    document.dispatchEvent(new Event("intro-finalizada"));
  }

  if (botonOmitirIntro) {
    botonOmitirIntro.addEventListener("click", function () {
      finalizarIntro("skip-button");
    }, { once: true });
  }

  introVideo.addEventListener("ended", function () {
    finalizarIntro("video-ended");
  }, { once: true });

  introVideo.addEventListener("error", function (errorEvento) {
    console.error("[Intro] Error al reproducir Intro.mp4", errorEvento);
    finalizarIntro("video-error");
  }, { once: true });

  const intentoReproduccion = introVideo.play();

  if (window.matchMedia("(max-width: 560px)").matches) {
    registrarDesbloqueoAudio();
  }

  if (intentoReproduccion && typeof intentoReproduccion.then === "function") {
    intentoReproduccion.catch(function (errorAutoplay) {
      introVideo.defaultMuted = true;
      introVideo.muted = true;

      introVideo.play().then(function () {
        registrarDesbloqueoAudio();
      }).catch(function (errorFinal) {
        finalizarIntro("autoplay-blocked");
      });
    });
  }
}

export function pausarAudioFondo() {
  // Si hay un crossfade en curso, cancelarlo: restaurar volumen, detener el segundo Audio y limpiar el intervalo
  if (crossfadeActivo) {
    clearInterval(intervaloCrossfade);
    intervaloCrossfade = null;
    audioFondo.volume = 0.46;
    if (audioFondoSiguiente) {
      audioFondoSiguiente.pause();
      audioFondoSiguiente.src = "";
      audioFondoSiguiente = null;
    }
    crossfadeActivo = false;
  }
  if (typeof audioFondo !== "undefined" && audioFondo && !audioFondo.paused) {
    audioFondo.pause();
  }
  sincronizarEstadoBotonMusica();
}

export function reanudarAudioFondo() {
  // Si el usuario pausó la música manualmente, respetar su decisión y
  // no reanudarla (por ejemplo, al cerrar un lightbox o un video).
  if (audioDesactivadoPorUsuario) {
    sincronizarEstadoBotonMusica();
    return;
  }
  if (typeof audioFondo !== "undefined" && audioFondo && audioFondo.paused) {
    const intento = audioFondo.play();
    if (intento && typeof intento.then === "function") {
      intento.then(sincronizarEstadoBotonMusica).catch(function () {});
    } else {
      sincronizarEstadoBotonMusica();
    }
  }
}

export function inicializarAudioFondo() {
  const btn = document.getElementById("music-btn");
  if (!btn) {
    return;
  }

  const canciones = [
    "audios/asi se quiere.mp3",
    "audios/yo te perdono.mp3",
    "audios/debo hacerlo.mp3",
    "audios/te lo pido por favor.mp3",
    "audios/la farsante.mp3",
    "audios/costumbres.mp3",
    "audios/yo no se que me paso.mp3",
    "audios/no vale la pena.mp3",
    "audios/se me olvido otra vez.mp3",
    "audios/cada quien su camino.mp3",
    "audios/fue un placer conocerte.mp3",
    "audios/dimelo.mp3",
    "audios/inocente pobre amigo.mp3",
    "audios/de mi enamorate.mp3",
    "audios/es mejor.mp3",
    "audios/dejame vivir.mp3",
    "audios/amor eterno.mp3",
    "audios/perdoname olvidalo.mp3"
  ];

  // DURACION_CROSSFADE = segundos que dura la transición entre canciones
  // VOLUMEN_BASE = volumen máximo de la música de fondo (46%)
  const DURACION_CROSSFADE = 2;
  const VOLUMEN_BASE = 0.46;
  let indiceActual = Math.floor(Math.random() * canciones.length);
  audioFondo = new Audio(canciones[indiceActual]);
  audioFondo.volume = VOLUMEN_BASE;
  audioFondo.playsInline = true;
  audioFondo.preload = "auto";

  let desbloqueoRegistrado = false;

  // Cola de reproducción aleatoria (Fisher-Yates shuffle)
  // Garantiza que todas las canciones suenen antes de repetir alguna
  let colaReproduccion = [];

  function mezclarFisherYates(arr) {
    const shuffled = arr.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled;
  }

  function generarColaAleatoria(excluirUltimo) {
    const indices = [];
    for (let i = 0; i < canciones.length; i++) {
      indices.push(i);
    }
    let shuffled = mezclarFisherYates(indices);
    if (excluirUltimo && shuffled[0] === indiceActual && canciones.length > 1) {
      const temp = shuffled[0];
      shuffled[0] = shuffled[shuffled.length - 1];
      shuffled[shuffled.length - 1] = temp;
    }
    return shuffled;
  }

  function seleccionarSiguienteCancion() {
    if (colaReproduccion.length === 0) {
      colaReproduccion = generarColaAleatoria(true);
    }
    return colaReproduccion.shift();
  }

  /*
    FUNCIÓN: alTerminarCancion()
    OBJETIVO: Se dispara cuando la canción actual termina (evento "ended")
    NOTA: Es un respaldo por si detectarFinCancion no se activó a tiempo.
          Si el crossfade ya está corriendo, lo ignora para evitar duplicados.
  */
  function alTerminarCancion() {
    if (crossfadeActivo) return;
    iniciarCrossfade();
  }

  /*
    FUNCIÓN: detectarFinCancion()
    OBJETIVO: Detectar cuándo quedan 2 segundos o menos para que termine la canción
    CÓMO: Se ejecuta en cada "timeupdate" (~250ms). Cuando el tiempo restante
          es menor o igual a DURACION_CROSSFADE, inicia el crossfade antes de
          que la canción termine, logrando una transición superpuesta.
  */
  function detectarFinCancion() {
    if (crossfadeActivo || !audioFondo.duration || !isFinite(audioFondo.duration)) return;
    const restante = audioFondo.duration - audioFondo.currentTime;
    if (restante <= DURACION_CROSSFADE && restante > 0) {
      iniciarCrossfade();
    }
  }

  /*
    FUNCIÓN: iniciarCrossfade()
    OBJETIVO: Realizar la transición suave entre la canción actual y la siguiente
    CÓMO FUNCIONA EL CROSSFADE:
      1. Se crea un segundo elemento Audio con la siguiente canción (volumen 0)
      2. Se empieza a reproducir el segundo Audio en silencio
      3. Un setInterval cada 50ms va ajustando los volúmenes:
         - La canción actual baja de volumen (0.46 → 0)
         - La canción siguiente sube de volumen (0 → 0.46)
      4. Cuando el crossfade termina (40 pasos × 50ms = 2 segundos):
         - Se pausa y limpia el Audio anterior
         - Se reasigna audioFondo para que apunte al nuevo Audio
         - Se vuelven a registrar los event listeners en el nuevo Audio
  */
  function iniciarCrossfade() {
    if (crossfadeActivo) return;

    const siguienteIndice = seleccionarSiguienteCancion();
    audioFondoSiguiente = new Audio(canciones[siguienteIndice]);
    audioFondoSiguiente.volume = 0;
    audioFondoSiguiente.playsInline = true;
    audioFondoSiguiente.preload = "auto";

    // Reproducir la siguiente canción en silencio (volumen 0)
    audioFondoSiguiente.play().catch(function () {});

    crossfadeActivo = true;
    // pasos = DURACION_CROSSFADE * 20 porque el setInterval corre cada 50ms
    // 2 segundos × 20 pasos/segundo = 40 pasos totales
    const pasos = DURACION_CROSSFADE * 20;
    let pasoActual = 0;

    intervaloCrossfade = setInterval(function () {
      pasoActual++;
      // progreso va de 0 a 1 a lo largo del crossfade
      const progreso = Math.min(pasoActual / pasos, 1);

      // Bajar volumen de la canción actual: de VOLUMEN_BASE a 0
      audioFondo.volume = VOLUMEN_BASE * (1 - progreso);
      // Subir volumen de la siguiente canción: de 0 a VOLUMEN_BASE
      audioFondoSiguiente.volume = VOLUMEN_BASE * progreso;

      // Cuando terminan todos los pasos, completar la transición
      if (pasoActual >= pasos) {
        clearInterval(intervaloCrossfade);
        intervaloCrossfade = null;

        // Detener y limpiar el Audio anterior
        audioFondo.pause();
        audioFondo.removeEventListener("ended", alTerminarCancion);
        audioFondo.removeEventListener("timeupdate", detectarFinCancion);
        audioFondo.src = "";

        // El segundo Audio pasa a ser el Audio principal
        indiceActual = siguienteIndice;
        audioFondo = audioFondoSiguiente;
        audioFondoSiguiente = null;
        crossfadeActivo = false;

        // Restaurar volumen y registrar listeners en el nuevo Audio
        audioFondo.volume = VOLUMEN_BASE;
        audioFondo.addEventListener("ended", alTerminarCancion);
        audioFondo.addEventListener("timeupdate", detectarFinCancion);
      actualizarInterfaz();
      }
    }, 50);
  }

  // Registrar listeners en el Audio inicial para detectar fin de canción y activar crossfade
  audioFondo.addEventListener("ended", alTerminarCancion);
  audioFondo.addEventListener("timeupdate", detectarFinCancion);

  function actualizarInterfaz() {
    sincronizarEstadoBotonMusica();
  }

  function alternarReproduccion() {
    if (audioFondo.paused) {
      audioDesactivadoPorUsuario = false;
      const intento = audioFondo.play();
      if (intento && typeof intento.then === "function") {
        intento.then(actualizarInterfaz).catch(function (e) {
        });
      }
    } else {
      // Si el usuario pausa la música manualmente, recordarlo para no
      // reanudarla automáticamente más adelante.
      audioDesactivadoPorUsuario = true;
      // Si el usuario pausa durante un crossfade, cancelarlo y restaurar el Audio original
      if (crossfadeActivo) {
        clearInterval(intervaloCrossfade);
        intervaloCrossfade = null;
        audioFondo.volume = VOLUMEN_BASE;
        if (audioFondoSiguiente) {
          audioFondoSiguiente.pause();
          audioFondoSiguiente.src = "";
          audioFondoSiguiente = null;
        }
        crossfadeActivo = false;
      }
      audioFondo.pause();
          actualizarInterfaz();
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
    if (audioFondo.paused) return;
    // El usuario dio su consentimiento al hacer clic: permitir reanudar después
    audioDesactivadoPorUsuario = false;
    audioFondo.muted = false;
    audioFondo.defaultMuted = false;

    const intento = audioFondo.play();
    if (intento && typeof intento.then === "function") {
      intento
        .then(function () {
        actualizarInterfaz();
          quitarDesbloqueoAudio();
        })
        .catch(function (e) {
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
    if (audioDesactivadoPorUsuario) {
      sincronizarEstadoBotonMusica();
      return;
    }
    const intento = audioFondo.play();

    if (intento && typeof intento.then === "function") {
      intento
        .then(actualizarInterfaz)
        .catch(function () {
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
      videosLocales.forEach(function (otroVideo) {
        if (otroVideo !== video && !otroVideo.paused) {
          otroVideo.pause();
        }
      });
    });
    video.addEventListener("pause", function () {
      const algunoReproduciendo = Array.from(videosLocales).some(function (v) {
        return !v.paused;
      });
      if (!algunoReproduciendo) {
        reanudarAudioFondo();
      }
    });
    video.addEventListener("ended", function () {
      const algunoReproduciendo = Array.from(videosLocales).some(function (v) {
        return !v.paused;
      });
      if (!algunoReproduciendo) {
        reanudarAudioFondo();
      }
    });
  });

  if (document.body.classList.contains("intro-activa")) {
    document.addEventListener("intro-finalizada", iniciarAudioFondo, { once: true });
  } else {
    iniciarAudioFondo();
  }

  // Reanudar música al volver de una pestaña/ventana externa
  var estabaReproduciendo = false;
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") {
      estabaReproduciendo = !audioFondo.paused;
    }
    if (document.visibilityState === "visible" && estabaReproduciendo) {
      audioFondo.play().then(actualizarInterfaz).catch(function () {});
    }
  });
}
