# Auto Alineaciones Luevano · sitio web

Sitio de una sola página para **Auto Alineaciones Luevano** (Col. Campesina, Chihuahua).
Diseño y desarrollo: **Ian Corral**.

## Cómo correrlo

Necesitas [Node.js](https://nodejs.org) 18 o más nuevo.

```bash
npm install      # una sola vez
npm run dev      # abre http://localhost:5173 (también se ve desde el celular en la misma red)
npm run build    # genera la carpeta dist/ lista para subir
npm run preview  # prueba la versión de dist/
```

## Dónde cambiar cada cosa

| Qué | Archivo |
| --- | --- |
| WhatsApp, teléfono, persona de contacto, horario, ubicación, enlace a tu portafolio | `src/negocio.js` |
| Textos visibles, número y dirección que se muestran, datos para Google (JSON-LD) | `index.html` (busca `614 297 0351`) |
| Colores, tipografías, espacios | `src/styles/main.css` (variables en `:root`) |
| Servicios del explorador (títulos y descripciones) | `src/ui.js` → objeto `SERV` |
| Piezas 3D y sus animaciones | `src/escena3d/` |
| Cortina de entrada y animaciones al bajar | `src/movimiento.js` |
| Fotos | `public/img/` |
| Aviso de privacidad | `aviso-de-privacidad.html` |

## Estructura

```
index.html                 página principal
aviso-de-privacidad.html   aviso de privacidad (borrador)
public/                    archivos que se copian tal cual (fotos, favicon, tu logo)
src/
  main.js                  punto de entrada
  negocio.js               datos del negocio (un solo lugar)
  ui.js                    horario, servicios, armador de WhatsApp, ubicación
  movimiento.js            cortina, "bloques que se alinean", fotos que se descubren
  escena3d/                three.js: motor (un renderer para todas las vistas) y piezas
  styles/main.css
_material/                 fotos de referencia y de Google Maps (no se publica)
```

## Tecnologías

- **Vite** para desarrollo y empaquetado (sitio estático, carga rápida).
- **GSAP + ScrollTrigger** para las animaciones.
- **three.js** para las piezas 3D. Se carga aparte (`import()` dinámico) para no frenar la primera pantalla.
- Fuentes de Google: Oswald (títulos), Yellowtail (palabra de rotulista) y Atkinson Hyperlegible Next (texto, pensada para baja visión).
- Respeta "reducir movimiento" del sistema: sin cortina ni animaciones.

## Pendientes antes de publicar

- [ ] Confirmar que **614 297 0351** tiene WhatsApp.
- [ ] Confirmar la **dirección y a qué calle da la entrada** (Google dice Av. Silvestre Terrazas 7007; Street View cae en Av. Francisco Zarco).
- [ ] Confirmar **horario** y si se pone "Pregunta por…" (`contacto` en `src/negocio.js`).
- [ ] Cambiar las fotos de muestra (Unsplash) por **fotos reales del taller**: fachada, rampa, la dueña atendiendo.
- [ ] Pedir permiso por escrito a la dueña para usar su logo, fotos y reseñas.
- [ ] Revisar el aviso de privacidad con ella.
- [ ] Poner la URL de tu portafolio en `portafolio` (`src/negocio.js`).
- [ ] Al publicar: agregar la URL del sitio en su Perfil de Empresa de Google y una imagen `og:image` con URL absoluta.

## Publicarlo (gratis)

Cualquiera de estos sirve con la carpeta `dist/`: Netlify, Vercel o Cloudflare Pages.
Con un dominio `.mx` (por ejemplo `alineacionesluevano.mx`) se ve más confiable.

## Notas legales (no es asesoría legal)

- **Aviso de privacidad (LFPDPPP):** el sitio no guarda datos, pero el taller sí recibe datos por WhatsApp; por eso se incluye un aviso simplificado.
- **Si agregas Google Analytics o el Pixel de Facebook**, agrega también un aviso de cookies.
- **Fotos:** las de Unsplash tienen licencia libre para uso comercial; aun así, lo ideal es usar fotos propias del taller.
- **Reseñas:** solo se citan reseñas reales y públicas de Google, con el nombre como aparece ahí.
