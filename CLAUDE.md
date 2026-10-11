# Contexto del proyecto · Auto Alineaciones Luevano

Este archivo lo lee Claude Code al abrir la carpeta. Resume todo lo decidido hasta ahora (octubre 2026).

## El cliente y el problema
- **Negocio:** Auto Alineaciones Luevano (en Google Maps aparece como "Alineaciones Luevano"). Taller familiar en la Col. Campesina, Chihuahua. Lo atiende la dueña (la señora Luevano).
- **Problema:** su hermano tiene otro taller en la misma cuadra (por atrás), "Direcciones y Alineaciones Luevano" (Av. Silvestre Terrazas 7011, tel. 614 137 8921, 4.2 ★ con ~83 reseñas). Los sobrinos posicionaron su ficha y le quitaron clientes a ella.
- **Solución honesta:** sitio web propio + arreglar su Perfil de Empresa de Google (verificar, mover el pin, categoría "Taller de alineación", nombre igual al letrero, fotos reales, pedir reseñas con QR). Nunca hablar mal del otro taller en el sitio.

## Datos reales (de su ficha de Google y su volante)
- Teléfono: **614 297 0351** (confirmar si tiene WhatsApp).
- Dirección en Google: Av. Silvestre Terrazas 7007, Campesina Nueva, 31410. **Por confirmar:** el Street View de la ficha cae en Av. Francisco Zarco 8014 y directorios viejos dicen Av. Zarco 711. Hay que saber a qué calle da la entrada de enfrente.
- Place ID: `ChIJvX73Bv1c6oYRRtPLfB7TnTU` · coords 28.6092401, -106.0946299.
- Calificación: 4.7 ★ con 3 reseñas. Reseña citada (real): Saúl Guerrero, "Buen servicio, realizan reparaciones que pocos lugares hacen."
- Especialidad (de su volante): partes de suspensión convencional: rótulas sup./inf., terminales int./ext., bujes de horquilla sup./inf., buje de barra estabilizadora, tornillo estabilizador, amortiguador, base de amortiguador, resortes, maza de rueda.
- Horario usado (por confirmar): L–V 8:30–18:30, Sáb 8:30–14:00, Dom cerrado.
- En su ficha hay fotos de otros negocios (L y R Alineación, Multillantas Chávez): reportarlas.

## Público (Chihuahua)
Trabajadores de maquila por turnos (importa el sábado y "esperas aquí"), autos americanos/regularizados (600 mil+ en el estado), camionetas, flotillas y transporte de personal, otros talleres sin alineadora, gente mayor (los hijos les mandan el link por WhatsApp). Casi todo es desde el celular y por WhatsApp.

## Diseño (decisiones tomadas)
- **Esencia propia**, no copiar sitios de otros (Casas Abrek fue solo referencia de calidad).
- Colores del logo real: azul `#15337C`, fondo oscuro `#0F1E4D`, acento `#3B6FE0`, texto sobre oscuro `#9DBBFF`. Fondo claro `#F4F5F8` (texto oscuro sobre claro se lee mejor a cualquier edad).
- Tipos: Oswald (títulos en mayúsculas), Yellowtail (una palabra en letra de rotulista por título), Atkinson Hyperlegible Next (texto, pensada para baja visión). Texto mínimo 18px, botones de 58px.
- Movimiento propio: **cortina metálica** que se sube al entrar (una vez por visita, con saludo según la hora); **bloques que llegan chuecos y se alinean** al bajar; **fotos que se descubren de abajo hacia arriba**. Sin animaciones si el sistema pide reducir movimiento.
- Hero a pantalla completa con foto de la rampa de alineación.
- Servicios: lista "empieza por lo que notas" + **una sola pieza 3D** (three.js) que cambia sin traslape. Alineación = eje visto desde arriba, llantas abiertas que quedan derechas. Balanceo = llanta en la balanceadora que tiembla hasta que le ponen la pesa.
- WhatsApp: botón del menú + botón flotante "Escríbenos" (escritorio) + barra fija en celular + armador de mensaje. No repetir botones de más.
- Croquis "Estamos por enfrente": solo "Aquí es · al frente", sin mencionar al otro taller.
- Firma en el pie: "Sitio hecho por Ian Corral" con su logo (C con barra azul). URL del portafolio pendiente (`portafolio` en `src/negocio.js`).
- Las fotos de `public/img/` (salvo `logo-luevano.png` y `cremallera.jpg`) son de muestra de Unsplash: cambiarlas por fotos reales.

## Cómo trabajar aquí
- `npm install`, luego `npm run dev`. Build: `npm run build`.
- Datos del negocio en `src/negocio.js`. El número también está en el texto de `index.html` y en el JSON-LD (buscar `614 297 0351`).
- Escribir textos en español de México, frases cortas, tuteo, sin tecnicismos sin explicar.
- Ian prefiere respuestas concisas con ejemplos y justificación antes de implementar.

## Pendientes
Ver la lista en `README.md` (WhatsApp, dirección, horario, "pregunta por…", fotos reales, permiso de la dueña, aviso de privacidad, URL del portafolio, publicar y ligar el sitio a su ficha de Google).
