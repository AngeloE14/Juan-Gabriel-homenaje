# 🏗️ GUÍA PARA PRINCIPIANTES - Desarrollo Web

## ¡Bienvenido al mundo del desarrollo web! 🚀

Este proyecto es un ejemplo práctico de cómo se construyen páginas web modernas. Aquí te explicamos los conceptos básicos que necesitas saber para entender y modificar este sitio.

---

## 📚 CONCEPTOS BÁSICOS

### 🌐 ¿Qué es una página web?
Una página web es como un documento digital que combina:
- **HTML**: La estructura (como el esqueleto)
- **CSS**: El diseño y colores (como la ropa y maquillaje)
- **JavaScript**: La interactividad (como los movimientos y sonidos)

### 📁 Estructura de archivos
```
tu-proyecto/
├── index.html          ← El archivo principal (HTML)
├── css/                ← Carpeta con archivos CSS
│   ├── reset.css       ← Reinicio de estilos
│   ├── base.css        ← Estilos básicos
│   └── header.css      ← Estilos del encabezado
├── js/                 ← Carpeta con archivos JavaScript
│   ├── index.js        ← Archivo principal de JS
│   └── utils.js        ← Funciones útiles
└── assets/             ← Imágenes, sonidos, etc.
```

---

## 🏗️ HTML - La Estructura

### Etiquetas básicas
```html
<!DOCTYPE html>          ← Declara que es HTML5
<html lang="es">         ← Inicio del documento
  <head>                 ← Información sobre la página
    <title>Mi Página</title>  ← Título en la pestaña
  </head>
  <body>                 ← Contenido visible
    <h1>Título principal</h1>    ← Encabezado grande
    <p>Un párrafo de texto</p>   ← Texto normal
  </body>
</html>
```

### Etiquetas importantes en este proyecto
- `<header>` - Encabezado de la página
- `<nav>` - Menú de navegación
- `<main>` - Contenido principal
- `<section>` - Sección de contenido
- `<article>` - Contenido autocontenido
- `<footer>` - Pie de página
- `<img>` - Imágenes
- `<a>` - Enlaces

---

## 🎨 CSS - El Diseño

### ¿Cómo funciona CSS?
```css
/* Selector { propiedad: valor; } */
h1 {
  color: blue;           ← Color del texto
  font-size: 24px;       ← Tamaño del texto
  text-align: center;    ← Alineación
}
```

### Propiedades comunes
- `color` - Color del texto
- `background` - Color de fondo
- `font-size` - Tamaño del texto
- `margin` - Espacio exterior
- `padding` - Espacio interior
- `width` / `height` - Ancho y alto
- `display` - Cómo se muestra el elemento

### Selectores CSS
```css
.class-name     ← Selecciona elementos con class="class-name"
#id-name        ← Selecciona elemento con id="id-name"
element         ← Selecciona todos los <element>
element.class   ← Elementos específicos con esa clase
```

---

## ⚡ JavaScript - La Interactividad

### Conceptos básicos
```javascript
// Variables - almacenan información
let nombre = "Juan Gabriel";
const edad = 66;

// Funciones - bloques de código reutilizables
function saludar() {
  console.log("¡Hola!");
}

// Eventos - responder a acciones del usuario
boton.addEventListener("click", function() {
  alert("¡Botón clickeado!");
});
```

### Conceptos en este proyecto
- **DOM**: Document Object Model - manipular HTML desde JS
- **Eventos**: Clicks, carga de página, movimientos del mouse
- **Módulos**: Organizar código en archivos separados
- **Arrays**: Listas de elementos
- **Condicionales**: if/else para tomar decisiones

---

## 🛠️ Herramientas que necesitas

### Editor de código
- **VS Code** (recomendado) - Gratuito y poderoso
- **Sublime Text** - Rápido y simple
- **Atom** - Similar a VS Code

### Navegador
- **Chrome** o **Firefox** - Para ver tus páginas
- Presiona **F12** para abrir las herramientas de desarrollo

### Servidor local
Para probar tu sitio, necesitas un servidor. En terminal:
```bash
# Navega a tu carpeta del proyecto
cd ruta/a/tu/proyecto

# Inicia servidor (Python)
python3 -m http.server 8000

# Abre http://localhost:8000 en tu navegador
```

---

## 🚀 Próximos pasos

### 1. Modifica el HTML
- Cambia textos en las etiquetas
- Agrega nuevas secciones
- Experimenta con diferentes etiquetas

### 2. Juega con CSS
- Cambia colores
- Modifica tamaños
- Experimenta con `margin` y `padding`

### 3. Prueba JavaScript
- Abre la consola (F12)
- Escribe `console.log("Hola mundo!")`
- Modifica funciones existentes

### 5. Practica con ejemplos
¡Mira el archivo `js/ejemplo.js`! Contiene funciones simples con explicaciones detalladas para que experimentes y aprendas.

### 6. Sistema de audio mejorado
**¿Por qué no se oye el audio automáticamente?**
- Los navegadores modernos bloquean el audio automático por privacidad
- El sitio reproduce el audio en la primera interacción del usuario
- **Volumen configurado al 90%** para máxima audibilidad
- Indicador visual muestra cuando el audio se está reproduciendo

**Cómo funciona:**
1. Al cargar la página, intenta reproducir automáticamente
2. Si el navegador lo bloquea, espera el primer click/tecla/toque
3. Una vez desbloqueado, reproduce con volumen alto
4. Muestra indicadores visuales durante la reproducción

---

## 🔊 Audio en la Web - Conceptos Avanzados

### Políticas de Autoplay
```javascript
// Los navegadores bloquean audio automático sin interacción del usuario
audio.play().catch(error => {
  // Manejar el bloqueo - reproducir en primera interacción
  document.addEventListener("click", () => audio.play());
});
```

### Control de Volumen
```javascript
// Volumen va de 0.0 (silencio) a 1.0 (máximo)
audio.volume = 0.9;  // 90% del volumen
audio.muted = false;  // No silenciado
```

### Estados del Audio
- `loadstart` - Empezando a cargar
- `canplay` - Listo para reproducir
- `play` - Reproducción iniciada
- `ended` - Reproducción terminada
- `error` - Error de reproducción

---

## ❓ Preguntas frecuentes

**¿Por qué mi página no se ve bien?**
- Revisa que todas las etiquetas estén cerradas
- Verifica que los archivos CSS/JS se estén cargando
- Usa las herramientas de desarrollo (F12)

**¿Cómo agrego una nueva página?**
- Crea un nuevo archivo `.html`
- Copia la estructura básica
- Enlaza los mismos archivos CSS/JS

**¿Por qué usar módulos JavaScript?**
- Código más organizado
- Fácil de mantener
- Evita conflictos entre funciones

---

## 🎯 Proyecto actual explicado

### Estructura modular
- **HTML**: Estructura semántica con secciones claras
- **CSS**: 11 archivos separados por funcionalidad
- **JavaScript**: 6 módulos con responsabilidades específicas

### Funcionalidades implementadas
- Carrusel de imágenes automático
- Modales (ventanas emergentes)
- Navegación por secciones
- Reproducción de audio
- Diseño responsive (se adapta a móviles)

¡Explora el código, modifica cosas y aprende haciendo! La mejor manera de aprender desarrollo web es experimentando. 💪</content>
<parameter name="filePath">/home/angelo/Documentos/Juan-Gabriel-homenaje/GUIA-PARA-PRINCIPIANTES.md
