# Auto Alineaciones Luevano · sitio web

Sitio de **Auto Alineaciones Luevano** (Col. Campesina, Chihuahua): portada + una página por servicio.
Diseño y desarrollo: **Ian Corral**.

## Cómo correrlo

Necesitas [Node.js](https://nodejs.org) 22.12 o más nuevo.

```bash
npm install      # una sola vez
npm run dev      # http://localhost:4321
npm run dev:lan  # igual, pero visible desde el celular en la misma red (úsalo solo en redes de confianza)
npm run build    # revisa tipos y genera dist/ lista para subir
npm run preview  # prueba la versión de dist/
npm test         # pruebas (Vitest)
npm run lint     # ESLint
npm run format   # Prettier
```

## Dónde cambiar cada cosa

| Qué                                                                         | Archivo                                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Nombre, teléfono, WhatsApp, dirección, horario, calificación, reseña, firma | `src/config/business.ts` (todo el sitio y el JSON-LD salen de aquí) |
| Dominio del sitio                                                           | `src/config/site.ts`                                                |
| Servicios (portada y su página propia)                                      | `src/data/services.ts`                                              |
| Piezas de suspensión, franja en movimiento, cotizador, "para quién", FAQ    | `src/data/content.ts`                                               |
| Colores y espacios                                                          | `src/styles/tokens.css`                                             |
| Tipografías                                                                 | `astro.config.ts` → `fonts` (se sirven desde el propio sitio)       |
| Animaciones                                                                 | `src/scripts/motion/`                                               |
| Piezas 3D                                                                   | `src/scripts/scene3d/`                                              |
| Fotos                                                                       | `src/assets/images/` (Astro las optimiza a AVIF/WebP)               |
| Fotos de trabajos reales (sección "Así queda tu carro")                     | `src/assets/images/work/` + descripción en `WORK_CAPTIONS`          |
| Headers de seguridad y URLs limpias en Vercel                               | `vercel.json`                                                       |

## Estructura

```
src/
  config/        datos del negocio y dominio (una sola fuente)
  data/          contenido: servicios, partes, preguntas
  lib/           horario, enlaces de WhatsApp/Maps, datos estructurados (JSON-LD)
  layouts/       BaseLayout: <head>, SEO, CSP, fuentes
  components/
    layout/      Header, Footer, barra del celular, botón flotante, cortina de entrada
    sections/    cada sección de las páginas
    ui/          Button, ArrowLink, Kicker, SectionHeader, Icon
  scripts/
    motion/      GSAP: cortina, títulos por línea, bloques, fotos, franja, guía láser
    scene3d/     three.js: escenario, encuadre automático y piezas
  pages/         index, [service] (una página por servicio), aviso-de-privacidad, 404, robots.txt
  styles/        tokens.css, global.css
public/          favicon
docs/            guía de la ficha de Google
vercel.json      headers de seguridad y URLs sin .html
_material/       fotos de referencia (no se publica ni se sube a git)
```

Convenciones: código, archivos y carpetas en inglés; textos del sitio en español de México; comentarios cortos en español solo donde hacen falta.

## Tecnologías

- **Astro 7** + **TypeScript** (modo estricto): HTML estático, cero JavaScript por defecto, componentes y datos en un solo lugar.
- **GSAP 3.15** (ScrollTrigger y SplitText, ahora gratuitos) para las animaciones.
- **three.js** para las piezas 3D. Se descarga solo cuando la sección está por aparecer y deja de dibujar cuando sale de pantalla.
- Fuentes auto-hospedadas: Oswald, Yellowtail y Atkinson Hyperlegible Next.
- **Content-Security-Policy** generada por Astro con hashes, más headers en `vercel.json`.
- Diseño fluido: todo en `rem`; en pantallas grandes la base crece de 16px a 22px.
- Respeta "reducir movimiento" del sistema: sin cortina ni animaciones.

## Pendientes antes de publicar

- [ ] Confirmar el horario del **martes** (en Google dice hasta las 6:30).
- [ ] Si se pone "Pregunta por…" (`contactPerson`).
- [ ] Cambiar las fotos de muestra (Unsplash) por **fotos reales del taller**.
- [ ] Agregar fotos de trabajos en `src/assets/images/work/` (de su Facebook o del celular).
- [ ] Permiso por escrito de la dueña para usar su logo, fotos y reseñas.
- [ ] Revisar el aviso de privacidad con ella.
- [ ] Comprar el dominio a nombre de ella y ponerlo en `src/config/site.ts`.
- [ ] URL del portafolio en `author.url`.

## SEO local (fuera del código)

- Perfil de Google: verificar, nombre igual al letrero, mover el pin, categorías, fotos reales, alertas de cambios, 2FA.
- Reseñas: QR en el mostrador y mensaje de WhatsApp después de cada trabajo (`links.review`).
- **Zona Comercial**: ahí solo aparece "Direcciones y Alineaciones Luevano" (Silvestre Terrazas 7011, 614 137 8921). Hay que **dar de alta su negocio**, no reclamar esa ficha.
- Mismos datos en Facebook, Apple Business Connect, Bing Places, Waze y Sección Amarilla.
- Al publicar: Google Search Console y Bing Webmaster con `sitemap-index.xml`.

## Publicarlo

Se publica en **Vercel** desde GitHub (rama `main`): cada `git push` vuelve a publicar solo.

- Vercel detecta Astro; no hay que configurar nada (comando `npm run build`, carpeta `dist`).
- Mientras se use la URL `…vercel.app`, el sitio sale con **noindex** para que Google no lo indexe todavía (`src/config/site.ts`).
- Al comprar el dominio: agregarlo en Vercel → Settings → Domains. La URL del sitio se toma sola de Vercel.

## Notas legales (no es asesoría legal)

- **Aviso de privacidad (LFPDPPP):** el sitio no guarda datos ni usa cookies; el taller sí recibe datos por WhatsApp.
- Si se agrega analítica, usar una sin cookies (Cloudflare Web Analytics, Plausible o Umami).
- Solo se citan reseñas reales y públicas de Google, con el nombre como aparece ahí.
