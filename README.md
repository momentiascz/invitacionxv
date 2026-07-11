# Invitación Digital · Mis XV Años

Proyecto listo para subir a cualquier hosting (cPanel, Netlify, Vercel, GitHub Pages, etc.). Es HTML, CSS y JavaScript puro: no requiere instalación ni build.

Diseño inspirado en el formato "app card" de plataformas como Invitio: una tarjeta centrada tipo móvil, superficie clara, reproductor de playlist flotante y barra de confirmación fija.

## Estructura del proyecto

```
xv-valentina/
├── index.html          → estructura y contenido de la invitación
├── css/
│   └── style.css        → todos los estilos (paleta, tipografía, animaciones)
├── js/
│   └── main.js           → cuenta regresiva, playlist, galería, RSVP, animaciones
├── assets/
│   └── img/              → coloca aquí tus fotografías reales
└── README.md
```

## Qué personalizar antes de publicar

1. **Nombre y fecha** — en `index.html`, dentro de `<header class="hero">` y en la sección `#fecha`.
2. **Fecha real de la cuenta regresiva** — en `js/main.js`, variable `CONFIG.eventDate`.
3. **Número de WhatsApp para confirmaciones** — en `js/main.js`, variable `CONFIG.whatsappNumber` (formato: código de país + número, sin espacios ni símbolos, ej. `59171234567`).
4. **Playlist de Spotify** — en `js/main.js`, variable `CONFIG.spotifyPlaylistId`:
   - Abre tu playlist en Spotify → Compartir → Copiar enlace.
   - El enlace se ve así: `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M`
   - Copia solo el código final (`37i9dQZF1DXcBWIGoYBM5M`) y pégalo en `spotifyPlaylistId`.
   - Mientras no la configures, la sección muestra un aviso con instrucciones en vez de un reproductor vacío.
5. **Ceremonia y recepción** — direcciones reales en la sección `#eventos-titulo` de `index.html`.
6. **Mapa** — reemplaza la URL del `<iframe>` en la sección del mapa. La forma más fácil:
   - Busca tu ubicación en Google Maps.
   - Compartir → Insertar un mapa → copia solo el valor del atributo `src`.
7. **Fotografías de la galería**:
   - Copia tus fotos dentro de `assets/img/` (por ejemplo `foto1.jpg`, `foto2.jpg`...).
   - En `js/main.js`, dentro de `initGallery()`, sigue el comentario que indica qué línea reemplazar por la etiqueta `<img>`.
   - También puedes reemplazar `.hero__photo-placeholder` en `index.html` por tu foto principal.
8. **Código de vestimenta y mesa de regalos** — textos directamente en `index.html`.

## Cómo subir al servidor

Sube la carpeta completa (`index.html`, `css/`, `js/`, `assets/`) manteniendo esa misma estructura de carpetas. No cambies los nombres de archivo a menos que también actualices las rutas dentro de `index.html`.

- **Hosting tradicional (cPanel/FTP):** sube todo dentro de `public_html/` (o la carpeta raíz de tu dominio).
- **Netlify / Vercel:** arrastra la carpeta completa al panel de despliegue.
- **GitHub Pages:** sube el contenido a un repositorio y activa Pages sobre la rama principal.

## Notas técnicas

- El contenido de cada sección es visible por defecto; las animaciones de aparición son una mejora progresiva que no depende de JavaScript para mostrar el contenido.
- La tarjeta central ("app frame") flota con sombra en pantallas grandes y ocupa toda la pantalla en móvil, para que se sienta como una app nativa.
- El botón flotante de playlist y la barra de confirmación inferior están pensados para el uso principal: invitados abriendo el enlace desde WhatsApp.
- Respeta la preferencia del sistema "reducir movimiento" (desactiva animaciones y transiciones).
- Compatible con navegadores modernos de escritorio y móvil (Chrome, Safari, Firefox, Edge).
