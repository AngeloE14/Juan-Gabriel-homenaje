/*
  ===========================================
  QUOTES-ROTATOR.JS - ROTACIÓN DE FRASES
  ===========================================

  CONCEPTO: ANIMACIÓN AUTOMÁTICA SIMPLE
  Este módulo hace que las frases cambien automáticamente cada pocos segundos.
  Es como un slideshow de texto.

  CONCEPTOS JAVASCRIPT USADOS:
  - ARRAYS: Lista de elementos a rotar
  - TEMPORIZADORES: setInterval() para repetición automática
  - MANIPULACIÓN DE CLASES: Mostrar/ocultar elementos
  - OPERADOR MÓDULO: Ciclo infinito en arrays
*/

/**
 * QUOTES-ROTATOR.JS - Funcionalidad de frases rotativas
 *
 * Maneja la rotación automática de frases en la sección de discografía
 * con efectos de fade in/out.
 */

// MODO ESTRICTO
"use strict";

/*
  FUNCIÓN: inicializarFrasesRotativas()
  OBJETIVO: Hacer que las frases cambien automáticamente
  CONCEPTO: Animación cíclica con temporizador
*/
export function inicializarFrasesRotativas() {
  // querySelectorAll() - Obtener TODAS las frases rotativas
  const frasesRotativas = document.querySelectorAll(".frase-rotativa");

  // length - Propiedad que dice cuántos elementos hay
  if (frasesRotativas.length > 1) {
    // VARIABLE DE ESTADO - Recordar cuál frase está visible
    let indiceFraseActual = 0;

    /*
      SETINTERVAL - TEMPORIZADOR
      Ejecuta una función cada X milisegundos (4000ms = 4 segundos)
      SINTAXIS: setInterval(función, milisegundos)
    */
    window.setInterval(function () {
      // Quitar clase "is-active" de la frase actual (la oculta)
      frasesRotativas[indiceFraseActual].classList.remove("is-active");

      // OPERADOR MÓDULO (%) - Cuando llega al final, vuelve al inicio
      // Ejemplo: si hay 3 frases (índices 0,1,2):
      // (0 + 1) % 3 = 1, (1 + 1) % 3 = 2, (2 + 1) % 3 = 0
      indiceFraseActual = (indiceFraseActual + 1) % frasesRotativas.length;

      // Agregar clase "is-active" a la nueva frase (la muestra)
      frasesRotativas[indiceFraseActual].classList.add("is-active");
    }, 4000); // 4000 milisegundos = 4 segundos
  }
}