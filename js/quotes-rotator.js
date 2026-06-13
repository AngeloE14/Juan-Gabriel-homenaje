// MODO ESTRICTO
"use strict";

export function inicializarFrasesRotativas() {
  const frasesRotativas = document.querySelectorAll(".frase-rotativa");

  
  if (frasesRotativas.length > 1) {
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