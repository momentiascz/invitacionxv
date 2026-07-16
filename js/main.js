/* ==========================================================================
   INVITACIÓN DIGITAL XV AÑOS — LÓGICA PRINCIPAL
   Organización: Config > Barra de progreso > Revelado al hacer scroll >
   Cuenta regresiva > Playlist (Spotify embed) > Galería + Lightbox >
   Confirmación WhatsApp > Reproductor flotante > CTA fija de RSVP
   ========================================================================== */

/* ==========================================================================
   CONFIGURACIÓN — edita estos valores para personalizar la invitación
   ========================================================================== */
const CONFIG = {
    eventDate: new Date('2026-08-15T20:00:00-04:00'),
    whatsappNumber: '59175386366', // formato internacional sin '+' ni espacios
    galleryCount: 18,
    // Pega aquí el ID de tu playlist de Spotify para mostrar el reproductor.
    // Lo encuentras en el enlace para compartir: open.spotify.com/playlist/ESTE_ID
    // Ejemplo: spotifyPlaylistId: '37i9dQZF1DXcBWIGoYBM5M'
    spotifyPlaylistId: '1sAVKbeZfl9IjAST4MNnYb?si=a8n6UuGnRl-qTxRo_A8yug'
};

document.addEventListener('DOMContentLoaded', function () {

    /* ==========================================================================
       0. PANTALLA DE INICIO — SOBRE ANIMADO
       Bloquea el scroll mientras se muestra el sobre. Al hacer clic (o Enter/
       espacio con teclado), se abre la solapa, la carta se desliza hacia
       arriba y luego toda la pantalla se desvanece dejando ver la invitación.
       ========================================================================== */
    function initEnvelope() {
        const screen = document.getElementById('envelopeScreen');
        const envelope = document.getElementById('envelopeButton');
        if (!screen || !envelope) return;

        document.body.classList.add('envelope-lock');

        function openEnvelope() {
            if (envelope.classList.contains('is-open')) return;
            envelope.classList.add('is-open');

            setTimeout(() => {
                screen.classList.add('is-hidden');
                document.body.classList.remove('envelope-lock');
            }, 1100);

            setTimeout(() => {
                screen.style.display = 'none';
            }, 1700);
        }

        envelope.addEventListener('click', openEnvelope);
        envelope.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
    }



    /* ==========================================================================
       HERO — entrada elegante al abrir el sobre + parallax sutil al hacer scroll
       ========================================================================== */
    function initHeroEffects() {
        const hero = document.querySelector('.hero');
        const photo = document.querySelector('.hero__photo');
        const caption = document.querySelector('.hero__caption');
        if (!hero || !photo) return;

        // Entrada escalonada: se activa cuando el sobre termina de abrirse
        const envelope = document.getElementById('envelopeButton');
        function reveal() { hero.classList.add('is-revealed'); }
        if (envelope) {
            envelope.addEventListener('click', () => setTimeout(reveal, 550), { once: true });
        } else {
            reveal();
        }

        // Parallax: la foto se mueve más lento que el scroll, el texto se desvanece
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let ticking = false;
        function update() {
            const rect = hero.getBoundingClientRect();
            const heroHeight = rect.height || 1;
            const progress = Math.min(1, Math.max(0, -rect.top / heroHeight));

            photo.style.backgroundPosition = 'center ' + (50 + progress * 12) + '%';
            if (caption) {
                caption.style.opacity = String(1 - progress * 1.15);
                caption.style.transform = 'translateY(' + (progress * 24) + 'px)';
            }
            ticking = false;
        }
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', update);
    }


    /* ==========================================================================
       1. BARRA DE PROGRESO DE LECTURA
       ========================================================================== */
    function initProgressBar() {
        const bar = document.getElementById('progressBar');
        if (!bar) return;
        function update() {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
            bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
        }
        update();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
    }

    /* ==========================================================================
       2. REVELADO PROGRESIVO AL HACER SCROLL
       El contenido ya es visible por defecto en el CSS (opacity:1). Aquí solo
       agregamos la clase "reveal-pending" a las secciones que todavía NO están
       a la vista, para animarlas cuando el usuario llegue a ellas. Si algo
       falla en este bloque, el contenido simplemente se queda visible.
       ========================================================================== */
    function initReveal() {
        const targets = document.querySelectorAll('.reveal');
        if (!targets.length) return;
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });

        targets.forEach(t => {
            const rect = t.getBoundingClientRect();
            const alreadyVisible = rect.top < window.innerHeight * 0.85;
            if (alreadyVisible) return;
            t.classList.add('reveal-pending');
            observer.observe(t);
        });
    }

    /* ==========================================================================
       3. CUENTA REGRESIVA DINÁMICA
       ========================================================================== */
    function initCountdown() {
        const els = {
            days: document.getElementById('cd-days'),
            hours: document.getElementById('cd-hours'),
            mins: document.getElementById('cd-mins'),
            secs: document.getElementById('cd-secs')
        };
        if (!els.days) return;

        function pad(n) { return String(n).padStart(2, '0'); }
        function tick() {
            const diff = CONFIG.eventDate.getTime() - Date.now();
            if (diff <= 0) {
                els.days.textContent = '00'; els.hours.textContent = '00';
                els.mins.textContent = '00'; els.secs.textContent = '00';
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            els.days.textContent = pad(d);
            els.hours.textContent = pad(h);
            els.mins.textContent = pad(m);
            els.secs.textContent = pad(s);
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ==========================================================================
       4. PLAYLIST — inserta el reproductor de Spotify si hay un ID configurado,
       o muestra un estado vacío con instrucciones si todavía no se agregó.
       ========================================================================== */
    function initPlaylist() {
        const card = document.getElementById('playlistCard');
        if (!card) return;

        if (CONFIG.spotifyPlaylistId) {
            card.innerHTML =
                '<div class="spotify-embed">' +
                '<iframe src="https://open.spotify.com/embed/playlist/' + CONFIG.spotifyPlaylistId + '?utm_source=generator&theme=0" ' +
                'width="100%" height="352" frameborder="0" allowfullscreen loading="lazy" ' +
                'allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" ' +
                'title="Playlist de la fiesta en Spotify"></iframe>' +
                '</div>';
        } else {
            card.innerHTML =
                '<div class="playlist-empty">' +
                '<span class="playlist-empty__icon">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' +
                '</span>' +
                '<p class="playlist-empty__title">Playlist por confirmar</p>' +
                '<p class="playlist-empty__note">Para mostrar aquí el reproductor, agrega el ID de tu playlist pública de Spotify en la configuración de <code>js/main.js</code>.</p>' +
                '<span class="playlist-empty__code">CONFIG.spotifyPlaylistId = \'tu-id-aqui\'</span>' +
                '</div>';
        }
    }

    /* ==========================================================================
       MÚSICA — reproduce/pausa el mp3 de fondo, con disco giratorio
       ========================================================================== */
    function initMusicPlayer() {
        const disc = document.getElementById('musicToggle');
        const audio = document.getElementById('bgMusic');
        const label = document.getElementById('musicLabel');
        if (!disc || !audio) return;

        audio.addEventListener('error', () => {
            console.error('[invitacion] error de audio:', audio.error);
            if (label) label.textContent = 'No se encontró el audio';
        });

        disc.addEventListener('click', () => {
            if (audio.paused) {
                audio.volume = 0.6;
                audio.play().then(() => {
                    disc.classList.add('is-playing');
                    disc.setAttribute('aria-pressed', 'true');
                    if (label) label.textContent = 'Reproduciendo…';
                }).catch((err) => {
                    console.error('[invitacion] no se pudo reproducir:', err);
                    if (label) label.textContent = 'No se pudo reproducir';
                });
            } else {
                audio.pause();
                disc.classList.remove('is-playing');
                disc.setAttribute('aria-pressed', 'false');
                if (label) label.textContent = 'Toca para reproducir';
            }
        });
    }

    /* ==========================================================================
       5. GALERÍA — genera espacios de ejemplo + lightbox
       Para usar fotos reales:
         1. Coloca tus imágenes dentro de assets/img/ (ej: foto1.jpg, foto2.jpg...)
         2. Reemplaza la línea marcada más abajo con el <img> comentado al lado
       ========================================================================== */
    function initGallery() {
        const gallery = document.getElementById('gallery');
        if (!gallery) return;

        const cameraIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 8h3l2-2h6l2 2h3v11H4z"/><circle cx="12" cy="13.5" r="3.2"/></svg>';

        for (let i = 1; i <= CONFIG.galleryCount; i++) {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'gallery__item';
            item.setAttribute('aria-label', 'Ver fotografía ' + i + ' ampliada');

            item.innerHTML = '<span class="gallery__placeholder">' + cameraIcon + '</span>';
            item.innerHTML = '<img src="assets/img/galeria/galery' + i + '.jpg" alt="Recuerdo ' + i + '">';
            // Para usar una foto real, reemplaza la línea anterior por:
            // item.innerHTML = '<img src="assets/img/foto' + i + '.jpg" alt="Recuerdo ' + i + '">';

            item.addEventListener('click', () => openLightbox(item));
            gallery.appendChild(item);
        }

        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightboxImg');
        const lightboxClose = document.getElementById('lightboxClose');
        if (!lightbox) return;

        function openLightbox(item) {
            const img = item.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('is-open');
        }
        function closeLightbox() {
            lightbox.classList.remove('is-open');
            lightboxImg.src = '';
        }
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    }

    /* ==========================================================================
       6. CONFIRMACIÓN DE ASISTENCIA POR WHATSAPP
       ========================================================================== */
    function initRSVP() {
        const form = document.getElementById('rsvpForm');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const nameField = document.getElementById('rsvpName');
            const guestsField = document.getElementById('rsvpGuests');
            const name = nameField.value.trim();
            const guests = guestsField.value;
            if (!name) return;

            const guestText = guests === '0' ? 'sin acompañantes' : ('con ' + guests + ' acompañante(s)');
            const message = '¡Hola! Soy ' + name + ' y confirmo mi asistencia a los XV años de Carla, ' + guestText + '. ¡Nos vemos ahí! 🎉';
            const url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
            window.open(url, '_blank', 'noopener');
        });
    }

    /* ==========================================================================
       7. REPRODUCTOR FLOTANTE — al tocarlo, lleva a la sección de playlist
       ========================================================================== */
    function initPlayerPill() {
        const pill = document.getElementById('playerPill');
        const target = document.getElementById('playlist');
        if (!pill || !target) return;
        pill.addEventListener('click', () => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /* ==========================================================================
       8. BARRA FIJA DE CONFIRMACIÓN — aparece después del hero, se oculta
       cuando el usuario ya llegó a la sección de RSVP
       ========================================================================== */
    function initStickyCta() {
        const cta = document.getElementById('stickyCta');
        const hero = document.querySelector('.hero');
        const rsvpSection = document.getElementById('rsvp');
        if (!cta || !hero) return;

        if (!('IntersectionObserver' in window)) {
            cta.classList.add('is-visible');
            return;
        }

        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                cta.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        heroObserver.observe(hero);

        if (rsvpSection) {
            const rsvpObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) cta.classList.remove('is-visible');
                });
            }, { threshold: 0.4 });
            rsvpObserver.observe(rsvpSection);
        }
    }

    /* ==========================================================================
       Inicialización — cada módulo va en su propio try/catch: si uno falla,
       los demás igual se ejecutan y el contenido de la página nunca se pierde.
       ========================================================================== */
    const modules = [
        initEnvelope, initHeroEffects, initProgressBar, initReveal, initCountdown, initPlaylist,
        initMusicPlayer, initGallery, initRSVP, initPlayerPill, initStickyCta
    ];
    modules.forEach(fn => {
        try { fn(); } catch (err) { console.error('[invitacion] error en ' + fn.name + ':', err); }
    });

});