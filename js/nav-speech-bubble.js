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
  "Pero por fuera me digo que palo dado ni Dios lo quita.🤷‍♂️",
  "Te pareces tanto a mi que no puedes engañarme",
  "No cabe duda que es verdad que la costumbre es más fuerte que el amor",
  "Lo que se ve no se pregunta",
  "Si me buscas es porque te conviene 😏",
  "Lloviendo está y por eso es que no vez mis lágrimas☔",
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
  let primeraEleccion = true;
  let frasesPendientes = [];
  let temporizadorOcultar;

  function mezclarFrases() {
    const frasesMezcladas = Array.from(new Set(FRASES_BOCADILLO));

    for (let i = frasesMezcladas.length - 1; i > 0; i -= 1) {
      const indiceAleatorio = Math.floor(Math.random() * (i + 1));
      [frasesMezcladas[i], frasesMezcladas[indiceAleatorio]] = [
        frasesMezcladas[indiceAleatorio],
        frasesMezcladas[i]
      ];
    }

    const frasesAExcluirAlInicio = new Set([fraseAnterior]);
    if (primeraEleccion) {
      // Queridaaa sigue en la rotación, pero no queda fija como apertura.
      frasesAExcluirAlInicio.add(FRASES_BOCADILLO[0]);
    }

    if (frasesMezcladas.length > 1 && frasesAExcluirAlInicio.has(frasesMezcladas[0])) {
      const indicesAlternativos = frasesMezcladas
        .map(function (frase, indice) {
          return frasesAExcluirAlInicio.has(frase) ? -1 : indice;
        })
        .filter(function (indice) {
          return indice > 0;
        });
      const indiceAlternativo = indicesAlternativos[
        Math.floor(Math.random() * indicesAlternativos.length)
      ];

      [frasesMezcladas[0], frasesMezcladas[indiceAlternativo]] = [
        frasesMezcladas[indiceAlternativo],
        frasesMezcladas[0]
      ];
    }

    frasesPendientes = frasesMezcladas;
  }

  function elegirFraseAleatoria() {
    if (frasesPendientes.length === 0) {
      mezclarFrases();
    }

    primeraEleccion = false;
    return frasesPendientes.shift();
  }

  function mostrarBocadillo() {
    const fraseElegida = elegirFraseAleatoria();

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
