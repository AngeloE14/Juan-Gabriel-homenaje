/*
  ===========================================
  MAIN.JS - PUNTO DE ENTRADA PRINCIPAL
  ===========================================

  CONCEPTO BÁSICO DE JAVASCRIPT PARA PRINCIPIANTES:
  JavaScript es el lenguaje de programación que hace que las páginas web sean interactivas.
  Permite responder a clics, animaciones, cargar datos, etc.

  MÓDULOS ES6:
  - import: Trae funciones de otros archivos
  - export: Comparte funciones desde este archivo
  - Ventaja: Código organizado, reutilizable y fácil de mantener

  DOM (Document Object Model):
  - Es la representación en JavaScript del HTML de la página
  - Permite modificar contenido, estilos y comportamiento
  - document = el objeto principal que representa toda la página

  EVENTOS:
  - Son "cosas que pasan" (clics, carga de página, movimientos del mouse)
  - addEventListener() = "escucha" cuando pasa algo y ejecuta código
*/

/**
 * MAIN.JS - Archivo principal de JavaScript
 *
 * Punto de entrada principal que coordina todos los módulos
 * de la aplicación y maneja la inicialización.
 */

// "USE STRICT" - MODO ESTRICTO
// Hace que JavaScript sea más estricto y ayude a encontrar errores
"use strict";

/*
  IMPORTS - TRAER FUNCIONES DE OTROS ARCHIVOS
  Sintaxis: import { función1, función2 } from './archivo.js'
  El ./ significa "en la misma carpeta"
*/
import { colocarAnioActual, marcarEnlaceActivo, inicializarNavegacion, reproducirDialogoAlCargar } from './utils.js';
import { inicializarCarrusel } from './carousel.js';
import { inicializarYouTubeModal } from './youtube-modal.js';
import { inicializarFrasesRotativas } from './quotes-rotator.js';

/*
  DOMContentLoaded - EVENTO DE CARGA
  Se ejecuta cuando el HTML está completamente cargado.
  Es mejor que window.onload porque no espera imágenes/css externos.

  SINTAXIS:
  elemento.addEventListener("evento", función);
*/
document.addEventListener("DOMContentLoaded", function () {
  // CONSOLE.LOG - Imprime mensajes en la consola del navegador (F12)
  console.log("🚀 Inicializando aplicación Juan Gabriel...");

  // LLAMAR FUNCIONES - Ejecutar cada inicialización
  colocarAnioActual();        // Pone el año actual en el footer
  marcarEnlaceActivo();       // Resalta el enlace del menú actual
  inicializarNavegacion();    // Configura clics en el menú
  reproducirDialogoAlCargar(); // Reproduce audio al cargar

  // INICIALIZAR COMPONENTES ESPECÍFICOS
  inicializarCarrusel();         // Configura el carrusel de imágenes
  inicializarYouTubeModal();     // Configura modal de YouTube
  inicializarFrasesRotativas();  // Configura rotación de frases

  console.log("✅ Aplicación inicializada correctamente");
});