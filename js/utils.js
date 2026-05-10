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
 * - Reproducción de audio de diálogo
 */

// MODO ESTRICTO - Ayuda a encontrar errores
"use strict";

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

  enlacesMenu.forEach(function (enlace) {
    // addEventListener() - "Escucha" cuando pasa un evento
    enlace.addEventListener("click", function () {
      console.log("Navegando a:", enlace.getAttribute("href"));
      marcarEnlaceActivo();
    });
  });

  // Evento cuando cambia el hash manualmente
  window.addEventListener("hashchange", marcarEnlaceActivo);
}

/**
 * Maneja la reproducción del audio de diálogo con manejo de autoplay
 * CONFIGURACIÓN: Volumen alto (0.9) para asegurar que se oiga bien
 * MEJORA: Intentos múltiples y indicadores visuales
 */
export function reproducirDialogoAlCargar() {
  const dialogoAudio = document.getElementById("dialogo-audio");
  if (!dialogoAudio) {
    console.warn("⚠️ Elemento de audio 'dialogo-audio' no encontrado");
    return;
  }

  // CONFIGURAR VOLUMEN MUY ALTO - 0.9 = 90% del volumen máximo
  dialogoAudio.volume = 0.9;
  dialogoAudio.muted = false; // Asegurar que no esté silenciado
  dialogoAudio.loop = false; // No repetir automáticamente
  console.log("🔊 Volumen configurado al 90%:", dialogoAudio.volume);

  // Función auxiliar para reproducir con manejo de errores mejorado
  function intentarReproducir() {
    console.log("🎵 Intentando reproducir diálogo...");

    // Verificar que el audio esté listo
    if (dialogoAudio.readyState < 2) {
      console.log("⏳ Audio aún no está listo, esperando...");
      dialogoAudio.addEventListener("canplay", intentarReproducir, { once: true });
      return false;
    }

    const intento = dialogoAudio.play();

    if (intento && typeof intento.catch === "function") {
      return intento
        .then(() => {
          console.log("✅ Diálogo reproduciéndose correctamente");
          return true;
        })
        .catch((error) => {
          console.warn("⚠️ Autoplay bloqueado por navegador:", error.message);
          return false;
        });
    }

    console.log("✅ Reproducción iniciada");
    return true;
  }

  // Intentar reproducir inmediatamente al cargar
  const exitoInmediato = intentarReproducir();

  // Si no se pudo reproducir inmediatamente, configurar para primera interacción
  if (!exitoInmediato) {
    console.log("🎯 Configurando reproducción en primera interacción...");

    function desbloquearYReproducir() {
      console.log("👆 Primera interacción detectada, reproduciendo...");

      // Asegurar volumen alto antes de reproducir
      dialogoAudio.volume = 0.9;
      dialogoAudio.muted = false;

      dialogoAudio.play().then(() => {
        console.log("✅ Audio reproduciéndose después de interacción");
      }).catch((error) => {
        console.error("❌ Error al reproducir después de interacción:", error);
      });

      // Remover listeners después de la primera reproducción
      document.removeEventListener("click", desbloquearYReproducir);
      document.removeEventListener("keydown", desbloquearYReproducir);
      document.removeEventListener("touchstart", desbloquearYReproducir);
    }

    // Escuchar primera interacción del usuario
    document.addEventListener("click", desbloquearYReproducir, { once: true });
    document.addEventListener("keydown", desbloquearYReproducir, { once: true });
    document.addEventListener("touchstart", desbloquearYReproducir, { once: true });

    console.log("🎧 Listo para reproducir en primera interacción (click, tecla o toque)");
  }

  // Agregar indicadores de estado del audio para debugging y usuario
  const audioIndicator = document.getElementById("audio-indicator");

  dialogoAudio.addEventListener("loadstart", () => console.log("📥 Audio empezando a cargar"));
  dialogoAudio.addEventListener("canplay", () => console.log("🎵 Audio listo para reproducir"));
  dialogoAudio.addEventListener("play", () => {
    console.log("▶️ Audio empezado");
    if (audioIndicator) {
      audioIndicator.style.display = "block";
      audioIndicator.textContent = "🔊 Reproduciendo diálogo...";
      // Ocultar indicador después de 3 segundos
      setTimeout(() => {
        audioIndicator.style.display = "none";
      }, 3000);
    }
  });
  dialogoAudio.addEventListener("pause", () => console.log("⏸️ Audio pausado"));
  dialogoAudio.addEventListener("ended", () => {
    console.log("🏁 Audio terminado");
    if (audioIndicator) {
      audioIndicator.style.display = "block";
      audioIndicator.textContent = "✅ Diálogo completado";
      setTimeout(() => {
        audioIndicator.style.display = "none";
      }, 2000);
    }
  });
  dialogoAudio.addEventListener("error", (e) => console.error("❌ Error de audio:", e));
}