/*
  ===========================================
  FRAGMENTOS-CAROUSEL.JS - Carrusel 3D cinematográfico
  ===========================================
*/

"use strict";

/* CAMBIO: Inicializa interacción 3D de Fragmentos sin alterar el HTML interno de cada tarjeta */
export function inicializarCarruselFragmentos3D() {
  const viewport = document.querySelector(".fragmentos-scroll");
  const track = viewport ? viewport.querySelector(".fragmentos-track") : null;

  if (!viewport || !track) return;

  /* CAMBIO: Se usa scroll-snap nativo en todos los tamaños, sin lógica JS */
  return;

  const tarjetas = Array.from(track.querySelectorAll(".fragmento-card"));
  if (!tarjetas.length) return;

  let indiceActivo = 0;
  let arrastrando = false;
  let inicioX = 0;
  let translateInicial = 0;
  let translateActual = 0;
  let suprimirClick = false;
  let ultimoGestoWheel = 0;
  const transicionTrack = "transform 0.35s ease";

  /* CAMBIO: Toma el src real de cada imagen para reutilizarlo en el reflejo ::after */
  tarjetas.forEach(function (tarjeta) {
    const imagen = tarjeta.querySelector("img");
    if (!imagen) return;

    const src = imagen.currentSrc || imagen.src;
    tarjeta.style.setProperty("--fragmento-img", 'url("' + src + '")');
  });

  function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(maximo, valor));
  }

  function limpiarEstados(tarjeta) {
    tarjeta.classList.remove(
      "is-active",
      "is-near-left",
      "is-near-right",
      "is-far-left",
      "is-far-right"
    );
  }

  /* CAMBIO: Aplica estados visuales 3D exactos según distancia relativa a la tarjeta activa */
  function aplicarEstados3D() {
    tarjetas.forEach(function (tarjeta, indice) {
      const distancia = indice - indiceActivo;
      limpiarEstados(tarjeta);

      if (distancia === 0) {
        tarjeta.classList.add("is-active");
        return;
      }

      if (distancia === -1) {
        tarjeta.classList.add("is-near-left");
        return;
      }

      if (distancia === 1) {
        tarjeta.classList.add("is-near-right");
        return;
      }

      if (distancia < 0) {
        tarjeta.classList.add("is-far-left");
      } else {
        tarjeta.classList.add("is-far-right");
      }
    });
  }

  /* CAMBIO: Calcula el translateX exacto para centrar una tarjeta en el viewport */
  function obtenerTranslateCentrado(indice) {
    const tarjeta = tarjetas[indice];
    if (!tarjeta) return 0;

    const centroViewport = viewport.clientWidth / 2;
    const centroTarjeta = tarjeta.offsetLeft + tarjeta.offsetWidth / 2;
    return centroViewport - centroTarjeta;
  }

  /* CAMBIO: Aplica translateX al track con o sin transición */
  function aplicarTranslateX(valor, animar) {
    translateActual = valor;
    track.style.transition = animar ? transicionTrack : "none";
    track.style.transform = "translateX(" + valor + "px)";
  }

  function obtenerIndiceMasCercano(translateReferencia) {
    let mejorIndice = 0;
    let mejorDistancia = Number.POSITIVE_INFINITY;

    tarjetas.forEach(function (_, indice) {
      const translateObjetivo = obtenerTranslateCentrado(indice);
      const distancia = Math.abs(translateObjetivo - translateReferencia);

      if (distancia < mejorDistancia) {
        mejorDistancia = distancia;
        mejorIndice = indice;
      }
    });

    return mejorIndice;
  }

  /* CAMBIO: Helpers para navegación discreta entre tarjetas */
  function irASiguiente() {
    centrarPorIndice(indiceActivo + 1, true);
  }

  function irAAnterior() {
    centrarPorIndice(indiceActivo - 1, true);
  }

  /* CAMBIO: Centra una tarjeta usando translateX del track y sincroniza estados 3D */
  function centrarPorIndice(indice, animar) {
    indiceActivo = limitar(indice, 0, tarjetas.length - 1);
    aplicarEstados3D();
    aplicarTranslateX(obtenerTranslateCentrado(indiceActivo), animar);
  }

  /* CAMBIO: Soporte de teclado (flechas izquierda/derecha) */
  viewport.addEventListener("keydown", function (evento) {
    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      irASiguiente();
    }

    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      irAAnterior();
    }
  });

  /* CAMBIO: Soporte wheel/trackpad con debounce de 300ms para evitar saltos múltiples */
  viewport.addEventListener(
    "wheel",
    function (evento) {
      evento.preventDefault();

      const ahora = Date.now();
      if (ahora - ultimoGestoWheel < 300) return;

      if (Math.abs(evento.deltaX) > Math.abs(evento.deltaY)) {
        if (evento.deltaX > 30) {
          ultimoGestoWheel = ahora;
          irASiguiente();
        }
        if (evento.deltaX < -30) {
          ultimoGestoWheel = ahora;
          irAAnterior();
        }
      } else {
        if (evento.deltaY > 30) {
          ultimoGestoWheel = ahora;
          irASiguiente();
        }
        if (evento.deltaY < -30) {
          ultimoGestoWheel = ahora;
          irAAnterior();
        }
      }
    },
    { passive: false }
  );

  /* CAMBIO: Click en tarjetas laterales para centrarlas */
  track.addEventListener("click", function (evento) {
    if (suprimirClick) {
      evento.preventDefault();
      evento.stopPropagation();
      suprimirClick = false;
      return;
    }

    const tarjeta = evento.target.closest(".fragmento-card");
    if (!tarjeta) return;

    const indice = tarjetas.indexOf(tarjeta);
    if (indice < 0 || indice === indiceActivo) return;

    centrarPorIndice(indice, true);
  });

  /* CAMBIO: Arrastre horizontal (mouse + touch) sin librerías externas */
  viewport.addEventListener("pointerdown", function (evento) {
    if (evento.pointerType === "mouse" && evento.button !== 0) return;

    arrastrando = true;
    inicioX = evento.clientX;
    translateInicial = translateActual;
    suprimirClick = false;

    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(evento.pointerId);
    track.style.transition = "none";
  });

  viewport.addEventListener("pointermove", function (evento) {
    if (!arrastrando) return;

    const deltaX = evento.clientX - inicioX;
    if (Math.abs(deltaX) > 6) {
      suprimirClick = true;
    }

    aplicarTranslateX(translateInicial + deltaX, false);
  });

  function finalizarArrastre(evento) {
    if (!arrastrando) return;

    arrastrando = false;
    viewport.classList.remove("is-dragging");
    try {
      viewport.releasePointerCapture(evento.pointerId);
    } catch (_) {
      // CAMBIO: Evita errores si el puntero ya no está capturado.
    }

    centrarPorIndice(obtenerIndiceMasCercano(translateActual), true);
  }

  viewport.addEventListener("pointerup", finalizarArrastre);
  viewport.addEventListener("pointercancel", finalizarArrastre);

  /* CAMBIO: Recalcula centro al redimensionar para mantener la composición */
  window.addEventListener("resize", function () {
    centrarPorIndice(indiceActivo, false);
  });

  /* CAMBIO: Estado inicial estable, primera tarjeta centrada al cargar */
  indiceActivo = 0;
  viewport.scrollLeft = 0;
  centrarPorIndice(indiceActivo, false);
}
