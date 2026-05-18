# Juan Gabriel
<p align="center">
  <img src="assets/Logo.png" alt="Juan Gabriel" width="250">
</p>

<p align="center">
  <img src="Pictures/Por los siglos.jpeg" alt="Homenaje a Juan Gabriel por los siglos" width="760">
</p>

Proyecto personal en homenaje a Juan Gabriel.
La página reúne fragmentos visuales, letras y momentos icónicos como una experiencia sencilla y respetuosa de su legado.
## �📌 Estado del proyecto
La estructura general está definida y las secciones principales se encuentran implementadas.


## 🔄 Cambios recientes

- Se reemplazó el uso de tablas en `Fotos Icónicas` por un mosaico flexible
- Ajuste del layout para mejorar el aprovechamiento del espacio
- Integración de imágenes en una sola galería principal
- Cambios enfocados en HTML y CSS sin necesidad de modificar JavaScript
- **Reorganización completa**: Los estilos se han separado en múltiples archivos organizados por componentes dentro de la carpeta `styles/`
- **Reorganización de imágenes**: La carpeta `Fotos` ha sido renombrada a `Pictures` para mayor claridad
- **Limpieza del proyecto**: Archivo CSS original eliminado para mantener estructura limpia para mejorar la mantenibilidad y legibilidad.
- **Modularización JavaScript**: La lógica se ha separado en módulos ES6 organizados en la carpeta `js/` para mejor mantenibilidad
- **Autoplay priorizado (mayo 2026)**: La intro intenta reproducción automática con audio; si el navegador la bloquea, activa fallback en silencio (`playsinline`) y permite reactivar audio en la primera interacción
- **Mejoras móviles (mayo 2026)**: Se corrigió el intro full-screen en teléfonos (sin franjas visibles y con ajuste dinámico de altura del viewport) y se reforzó el responsive de `Fragmentos`/grillas para una lectura más cómoda en pantallas pequeñas
- **Video local en Multimedia (mayo 2026)**: Se integró un video local (`videos/Juan Gabriel - Ensayo (Debo Hacerlo).mp4`) embebido con reproductor web nativo y diseño responsive para móvil/escritorio

## 📁 Estructura de archivos CSS

Los estilos CSS han sido organizados en archivos separados por funcionalidad dentro de la carpeta `styles/`:

- **`styles/reset.css`**: Estilos de reinicio global y configuración base del documento
- **`styles/base.css`**: Estilos base, componentes comunes (botones, títulos, contenedores)
- **`styles/header.css`**: Estilos del encabezado y logo
- **`styles/footer.css`**: Estilos del pie de página, bloque de plataformas y firma
- **`styles/navigation.css`**: Estilos del menú de navegación
- **`styles/carousel.css`**: Estilos del carrusel multimedia
- **`styles/multimedia.css`**: Estilos de multimedia, fotos icónicas, YouTube
- **`styles/discografia.css`**: Estilos de la sección de discografía
- **`styles/bellas-artes.css`**: Estilos del modal especial "Bellas Artes"
- **`styles/responsive.css`**: Media queries y estilos responsivos
- **`styles/animations.css`**: Animaciones y keyframes

Cada archivo incluye documentación detallada de su contenido y propósito.

## 📁 Estructura de archivos JavaScript

La lógica JavaScript ha sido modularizada usando ES6 modules y organizada en la carpeta `js/`:

- **`js/main.js`**: Punto de entrada principal que importa y coordina todos los módulos
- **`js/utils.js`**: Utilidades generales (mostrar año, navegación, intro en video)
- **`js/carousel.js`**: Funcionalidad del carrusel de imágenes con autoplay y controles
- **`js/youtube-modal.js`**: Gestión del modal de YouTube y reproducción de videos
- **`js/bellas-artes-modal.js`**: Control del modal especial "Bellas Artes" y manejo de videos
- **`js/quotes-rotator.js`**: Rotación automática de citas en la sección de discografía

Cada módulo está documentado y exporta funciones específicas para mantener la separación de responsabilidades.

## 🧱 Base para futura migración a framework

Se definió una base clara en HTML + CSS + JS para facilitar llevar el proyecto a React, Vue, Svelte u otro framework:

- **HTML semántico con responsabilidades claras**: `#intro-overlay`, `#intro-video` y `#page-content` delimitan el flujo de intro vs contenido principal.
- **CSS orientado a estados**: clases `intro-activa` e `intro-finalizada` controlan visualmente la transición sin depender de estilos inline.
- **JS modular y desacoplado**: `reproducirIntroAlCargar()` encapsula la lógica del ciclo de vida de la intro (inicio, finalización y fallback).
- **Comportamiento responsive consistente**: intro full-screen con `object-fit: cover`, fondo negro durante carga y ajuste dinámico de altura de viewport para escritorio y móvil.
- **Responsive móvil reforzado**: el intro ajusta altura en tiempo real con `visualViewport/innerHeight` y la sección `#letras` ahora se adapta a una columna en móviles sin desbordes.

---

> “Muy feliz fui contigo, me conformé con nada  
> y hoy te quedas sin mí”

## Nota personal
Un homenaje digital a Juan Gabriel 💛
