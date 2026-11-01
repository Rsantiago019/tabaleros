# Los Tabaleros — Sitio oficial

Sitio web de una sola página para **Los Tabaleros**, banda argentina de folclore mutante y rock surrealista. Es una página estática, responsive y de estética oscura con acentos carmesí, fucsia y violeta, inspirada en el sitio de Los Tekis.

## Características

- **Hero** con carrusel de imágenes, logo, eslogan y botones a la agenda y a Spotify.
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

## Cómo ejecutarlo en local

No hace falta instalar nada. Sirvelo con cualquier servidor estático, por ejemplo la extensión **Live Server** de VS Code, o:

```bash
python -m http.server 8000
```

Luego abrí `http://localhost:8000`.

> No abras los archivos con `file://`: el login de Supabase y algunos reproductores incrustados no funcionan así.

## Configurar la agenda y el panel

1. Creá un proyecto en Supabase y ejecutá [`supabase.sql`](./supabase.sql) en el **SQL Editor**.
2. Creá la cuenta administradora en **Authentication → Users** y autorizala en `public.show_admins` con su UUID.
3. Copiá la URL del proyecto y la clave pública (`anon`) en [`supabase-config.js`](./supabase-config.js).
4. Agregá el dominio publicado en **Authentication → URL Configuration**.

Los pasos completos están en [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## Seguridad

- Solo los usuarios incluidos en `public.show_admins` pueden crear, editar o eliminar fechas. Esto lo exige la base de datos mediante políticas RLS, no solo el panel.
- La lectura de la agenda es pública y el rol `anon` no tiene permisos de escritura.
- El navegador solo usa la clave pública de Supabase. **Nunca** pongas la clave `service_role` en este proyecto.
- Las consultas usan el cliente de Supabase, sin SQL armado a mano, y el contenido dinámico se inserta con `textContent`, no con `innerHTML`.
- `admin.html` está marcado como `noindex`.
- Recomendado: desactivar el registro público de usuarios, bajar los límites de intentos de login, activar MFA para el administrador y agregar cabeceras de seguridad en el hosting.

## Publicación

Al ser un sitio estático, se puede desplegar en Vercel, Netlify o GitHub Pages. Antes de publicar:

- Reemplazá las rutas relativas de `og:image`, `twitter:image` y de los datos estructurados por URLs absolutas.
- Agregá `<link rel="canonical">` con el dominio final.
- Considerá compilar Tailwind en lugar de usar el CDN.

## Pendientes

- Conectar el formulario de mailing a un servicio real; hoy solo muestra un mensaje de demostración.
- Cargar las fechas reales de la agenda.
- Verificar las redes sociales y los datos de contacto oficiales.

## Créditos

Sitio no oficial creado como proyecto de diseño para Los Tabaleros. Las fotos, el logo, el afiche y las carátulas pertenecen a sus respectivos autores.
