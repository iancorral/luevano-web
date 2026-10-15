# Contexto del proyecto · Auto Alineaciones Luevano

Resume lo decidido hasta ahora (octubre 2026). La estructura del código está en `README.md`.

## El cliente y el problema

- **Negocio:** Auto Alineaciones Luevano (en Google Maps aparece como "Alineaciones Luevano"). Taller familiar en la Col. Campesina, Chihuahua. Lo atiende la dueña (la señora Luevano). Su entrada es **por enfrente**.
- **Problema:** su hermano tiene otro taller en el mismo terreno, con entrada por atrás: "Direcciones y Alineaciones Luevano" (Av. Silvestre Terrazas 7011, tel. 614 137 8921, 4.2 ★ con ~83 reseñas). Antes él solo hacía cremallera y se mandaban clientes entre ellos. Los sobrinos posicionaron esa ficha, empezaron a dar los mismos servicios y **pusieron su pin sobre la entrada de enfrente (la de ella)**, para parecer el taller de enfrente. Ella casi desapareció del mapa.
- **Ubicación confirmada (Street View, jun 2024):** la entrada de ella da a **Av. Silvestre Terrazas**. El taller del hermano está **al fondo del mismo local**, no en otra calle. Su nombre en Google ya es "Auto Alineaciones Luevano" (sin comillas, oct 2026).
- **Ella hace de todo:** alineación, balanceo, suspensión, dirección, cremallera y frenos.
- **Letrero real (Street View):** "AUTO ALINEACIONES 'LUEVANO'".
- **Objetivo:** que ella salga primero en Google Maps y que su sitio salga en búsquedas relacionadas.
- **Solución honesta:** sitio web propio + arreglar su Perfil de Empresa de Google (verificar, mover el pin, categoría de alineación, nombre igual al letrero, fotos reales, reseñas con QR y WhatsApp) + los mismos datos en directorios. Nunca hablar mal del otro taller ni usar tácticas que arriesguen una suspensión (palabras clave en el nombre, reseñas compradas, páginas por colonia sin contenido).
- **Riesgo:** dos fichas con nombres parecidos en el mismo lugar pueden marcarse como duplicadas. Se defiende con entrada, letrero, teléfono y nombre propios.
- **Zona Comercial** solo tiene la ficha del sobrino (sin reclamar). Hay que dar de alta la de ella.

## Datos reales (de su ficha de Google y su volante)

- **Ficha verificada que ella administra (oct 2026):** se llama "AAlineaciones y Suspensiones Los Originales", Av. Silvestre Terrazas 7011-A, tel. 614 301 0831, categoría "Taller de reparación de automóviles", ~311 interacciones, al parecer sin reseñas. Ella agregó a Ian como administrador con la cuenta de Google de él. La ficha "Alineaciones Luevano" (7007, Place ID de abajo, 3 reseñas) parece un duplicado que ella no controla: hay que confirmarlo. El plan completo está en `docs/google-business-profile.md`.
- Teléfonos: **614 301 0831** = celular de ella, **principal** para llamadas y WhatsApp. **614 297 0351** = fijo del taller, lo contesta un trabajador. En todos lados indicar cuál es cuál.
- **Dirección oficial:** Av. Silvestre Terrazas 7011-A, Campesina, 31410 (la de la ficha verificada). Ella dice "7011", pero se usa **7011-A** en todos lados porque la distingue del 7011 del sobrino. No cambiarla en Google.
- Fecha de apertura en Google: 12 de diciembre de 1968 (ella dice "60 años"). En los textos: "desde 1968".
- Facebook de ella: https://www.facebook.com/alineacionybalan/ ("Alineaciones Luevano | Chihuahua").
- En su ficha hay un cambio de nombre pendiente que ella no recuerda ("Alineaciones Luevano, Suspensiones (55 años a su servicio)") y un intento de quitar "mujer empresaria". Hay que revisar quién tiene acceso.
- Ficha **verificada**: Place ID `ChIJq3QxKl5d6oYRSi3b0vJOWE4` (sacado del ftid `0x86ea5d5e2a3174ab:0x4e584ef2d2db2d4a`, CID 5645348937735548234) · https://maps.app.goo.gl/gbbQs8HELFmGa2PA7
- Ficha **duplicada** (7007, por fusionar): Place ID `ChIJvX73Bv1c6oYRRtPLfB7TnTU` · coords 28.6092401, -106.0946299 (las coords del sitio vienen de aquí; es la misma cuadra).
- Calificación (de la duplicada): 4.7 ★ con 3 reseñas. Reseña citada (real): Saúl Guerrero, "Buen servicio, realizan reparaciones que pocos lugares hacen."
- Servicios: alineación, balanceo, suspensión, dirección/cremallera, frenos, enderezado de chasis y soldadura.
- Horario de la ficha verificada: L, Mi–V 8:00–17:30 · Ma 8:00–18:30 (¿error?) · Sáb 8:00–13:30 · Dom cerrado. En el sitio se usa 17:30 de lunes a viernes.
- Los dominios `alineacionesluevano.mx` y `.com` parecían libres (octubre 2026, sin confirmar con el registrador).

## Público (Chihuahua)

Trabajadores de maquila por turnos (importa el sábado y "esperas aquí"), autos americanos/regularizados, camionetas, flotillas, otros talleres sin alineadora, gente mayor (los hijos les mandan el link por WhatsApp). Casi todo es desde el celular y por WhatsApp.

## Diseño (decisiones tomadas)

- Esencia propia, nada genérico. Casas Abrek fue solo referencia de calidad.
- Colores del logo: azul `#15337C`, fondo oscuro `#0F1E4D`, acento `#3B6FE0`, texto sobre oscuro `#9DBBFF`, fondo claro `#F4F5F8`.
- Tipos: Oswald (títulos en mayúsculas), Yellowtail (una palabra por título), Atkinson Hyperlegible Next (texto). Texto mínimo 18px, botones de 58px.
- Movimiento (concepto "precisión de alineadora"): cortina metálica al entrar (una vez por visita), títulos que suben línea por línea con máscara, bloques que aparecen sin rotación, fotos que se descubren de abajo hacia arriba con zoom, franja de servicios en movimiento constante que acelera con el scroll, guía láser de progreso bajo el header. Se descartó "bloques que llegan chuecos" porque a Ian no le gustó. Sin animaciones si el sistema pide reducir movimiento.
- Servicios: lista "empieza por lo que notas" + una sola pieza 3D que se encuadra sola y nunca tapa el texto.
- WhatsApp: botón del header + flotante (escritorio) + barra fija en celular + cotizador.
- Croquis "Estamos por enfrente", sin mencionar al otro taller.
- Firma: "Sitio hecho por Ian Corral". URL del portafolio pendiente.
- Las fotos de `src/assets/images/` (salvo `logo.png` y `steering-rack.jpg`) son de muestra de Unsplash.

## Cómo trabajar aquí

- Código, archivos, carpetas y clases en inglés. Comentarios cortos en español, solo si hacen falta.
- Los datos del negocio viven solo en `src/config/business.ts`; nunca duplicarlos en el HTML.
- Textos en español de México, frases cortas, tuteo, sin tecnicismos sin explicar.
- Antes de entregar: `npm test`, `npm run build` (incluye `astro check`) y `npm run lint`.
- Repo **privado** en GitHub: `iancorral/luevano-web` (rama `main`). Vercel publica cada push.
- Commits solo a nombre de Ian, **sin** "Co-Authored-By" ni menciones a Claude.
- Ian prefiere respuestas concisas con ejemplos y justificación antes de implementar.
- README y "About" de GitHub en inglés, con el mismo formato que sus repos DARPE y Tangible.

## Pendientes antes de publicar

- [ ] Confirmar el horario del **martes** (en Google dice hasta las 6:30).
- [ ] Si se pone "Pregunta por…" (`contactPerson`).
- [ ] Cambiar las fotos de muestra (Unsplash) por **fotos reales del taller**.
- [ ] Agregar fotos de trabajos en `src/assets/images/work/` (de su Facebook o del celular).
- [ ] Permiso por escrito de la dueña para usar su logo, fotos y reseñas.
- [ ] Revisar el aviso de privacidad con ella.
- [ ] Comprar el dominio a nombre de ella y agregarlo en Vercel.
- [ ] URL del portafolio en `author.url`.
- [ ] Poner la URL de Vercel (y luego el dominio) en "Website" del About de GitHub.

## SEO local (fuera del código)

Plan completo en `docs/google-business-profile.md`. Resumen:

- Ficha de Google: nombre igual al letrero, categoría de alineación, fotos reales, unir el duplicado, 2FA.
- Reseñas: QR en el mostrador y mensaje de WhatsApp después de cada trabajo (`links.review`).
- **Zona Comercial**: solo aparece la ficha del sobrino; hay que dar de alta la de ella.
- Mismos datos en Facebook, Apple Business Connect, Bing Places y Sección Amarilla.
- Al publicar con dominio: Google Search Console y Bing Webmaster con `sitemap-index.xml`.
