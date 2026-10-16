// MODO ESTRICTO
"use strict";
import { obtenerRendimientoDispositivo } from './utils.js';

export function inicializarFrasesRotativas() {
  const frasesRotativas = Array.from(
    document.querySelectorAll(".frase-rotativa")
  );

  if (frasesRotativas.length <= 1) return;

  const mezclarFrases = (ultimaFrase = null) => {
    const mezcla = [...frasesRotativas];

    for (let indice = mezcla.length - 1; indice > 0; indice--) {
      const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
      [mezcla[indice], mezcla[indiceAleatorio]] = [
        mezcla[indiceAleatorio],
        mezcla[indice],
      ];
    }

    // Evita repetir la frase anterior al comenzar una nueva ronda.
    if (mezcla[0] === ultimaFrase) {
      const indiceAlternativo =
        1 + Math.floor(Math.random() * (mezcla.length - 1));
      [mezcla[0], mezcla[indiceAlternativo]] = [
        mezcla[indiceAlternativo],
        mezcla[0],
      ];
    }

    return mezcla;
  };

  let ordenFrases = mezclarFrases();
  let indiceFraseActual = 0;
  const { isLowEnd, isMobile } = obtenerRendimientoDispositivo();
  const intervaloFrases = isLowEnd ? (isMobile ? 9000 : 6500) : 4000;

  frasesRotativas.forEach((frase) => frase.classList.remove("is-active"));
  ordenFrases[indiceFraseActual].classList.add("is-active");

  window.setInterval(() => {
    ordenFrases[indiceFraseActual].classList.remove("is-active");
    indiceFraseActual++;

    if (indiceFraseActual === ordenFrases.length) {
      const ultimaFrase = ordenFrases[indiceFraseActual - 1];
      ordenFrases = mezclarFrases(ultimaFrase);
      indiceFraseActual = 0;
    }

    ordenFrases[indiceFraseActual].classList.add("is-active");
  }, intervaloFrases);
}
