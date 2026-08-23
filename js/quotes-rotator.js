// MODO ESTRICTO
"use strict";
import { obtenerRendimientoDispositivo } from './utils.js?v=2';

export function inicializarFrasesRotativas() {
  const frasesRotativas = document.querySelectorAll(".frase-rotativa");

  
  if (frasesRotativas.length > 1) {
    let indiceFraseActual = 0;
    const { isLowEnd, isMobile } = obtenerRendimientoDispositivo();
    const intervaloFrases = isLowEnd ? (isMobile ? 9000 : 6500) : 4000;

    /*
      SETINTERVAL - TEMPORIZADOR
      Ejecuta una función cada X milisegundos
      El intervalo se adapta a dispositivos de menos recursos.
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
    }, intervaloFrases); // Intervalo adaptado según el rendimiento del dispositivo
  }
}