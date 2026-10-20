/*
  ===========================================
  NAV-SPEECH-BUBBLE.JS - FRASES DEL BOCADILLO
  ===========================================

  Controla de forma independiente las frases que aparecen junto al botón
  de navegación y su rotación aleatoria.
*/

const FRASES_BOCADILLO = [
  "Queridaaa!🎵",
  "Pero qué necesidad, para qué tanto problema",
  "No me vuelvo a enamorar, totalmente, ¿para qué? 🎶",
  "Te pareces tanto a mi que no puedes engañarme",
  "No cabe duda que es verdad que la costumbre es más fuerte que el amor",
  "Lo que se ve no se pregunta",
  "Si me buscas es porque te conviene 😏",
  "Mejor tú vive feliz que yo mientras sufriré",
  "Se me olvidó otra vez, que sólo yo te quise 💔",
  "Yo creí que eras sinceraaaaa 🎤",
];

const DEMORA_INICIAL = 1200;
const DURACION_VISIBLE = 3000;
const INTERVALO_FRASES = 7800;

export function inicializarBocadilloNavegacion() {
  const bocadillo = document.querySelector("#nav-toggle .nav-toggle__speech");

  if (!bocadillo || bocadillo.dataset.speechInitialized === "true") {
    return;
  }

  bocadillo.dataset.speechInitialized = "true";

  let fraseAnterior = "";
  let temporizadorOcultar;

  function mostrarBocadillo() {
    const frasesDisponibles = fraseAnterior
      ? FRASES_BOCADILLO.filter(function (frase) {
          return frase !== fraseAnterior;
        })
      : [FRASES_BOCADILLO[0]];
    const fraseElegida = frasesDisponibles[
      Math.floor(Math.random() * frasesDisponibles.length)
    ];

    fraseAnterior = fraseElegida;
    bocadillo.textContent = fraseElegida;
    bocadillo.classList.add("is-visible");

    window.clearTimeout(temporizadorOcultar);
    temporizadorOcultar = window.setTimeout(function () {
      bocadillo.classList.remove("is-visible");
    }, DURACION_VISIBLE);
  }

  window.setTimeout(mostrarBocadillo, DEMORA_INICIAL);
  window.setInterval(mostrarBocadillo, INTERVALO_FRASES);
}
