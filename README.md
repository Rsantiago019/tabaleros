# Los Tabaleros — Sitio oficial

Sitio web de una sola página para **Los Tabaleros**, banda argentina de folclore mutante y rock surrealista. Es una página estática, responsive y de estética oscura con acentos carmesí, fucsia y violeta, inspirada en el sitio de Los Tekis.

## Características

- **Hero** con foto de la banda, logo, eslogan y botones a la agenda y a Spotify.
- **Cuenta regresiva** al próximo show con entradas disponibles.
- **Nosotros** con la foto de la banda y zonas interactivas: al pasar el mouse o tocar sobre cada integrante aparece su nombre.
- **Últimos lanzamientos** con carátulas, años, enlaces y reproductor de Spotify.
- **Video de YouTube** en una sección ambientada en la selva; la portada enlaza al video.
- **Agenda** de shows con botón de compra y aviso de *Sold out*, alimentada desde Supabase.
- **Panel de administración** (`admin.html`) con login para agregar y eliminar fechas.
- **SEO**: metadatos, Open Graph, Twitter Card y datos estructurados (`MusicGroup` y `MusicEvent`).
- Footer con redes sociales y formulario de mailing (ver [Pendientes](#pendientes)).

## Tecnologías

- HTML, CSS y JavaScript sin paso de compilación
- [Tailwind CSS](https://tailwindcss.com/) por CDN
- [Supabase](https://supabase.com/) (Auth, PostgreSQL y Row Level Security)
- [SweetAlert2](https://sweetalert2.github.io/) para las confirmaciones del panel
- [Font Awesome](https://fontawesome.com/) para los íconos

## Estructura

```
.
├── index.html          # Sitio público
├── admin.html          # Panel de administración de la agenda
├── agenda.js           # Agenda pública, cuenta regresiva y datos estructurados
├── supabase-config.js  # URL del proyecto y clave pública (anon)
├── supabase.sql        # Tablas y políticas RLS
├── ADMIN_SETUP.md      # Guía de configuración del panel
└── assets/             # Imágenes de la banda y del video
```

## Créditos

Sitio no oficial creado como proyecto de diseño para Los Tabaleros. Las fotos, el logo, el afiche y las carátulas pertenecen a sus respectivos autores.
