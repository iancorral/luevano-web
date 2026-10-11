// =====================================================================
//  DATOS DEL NEGOCIO
//  Cambia aquí y se actualizan los enlaces de WhatsApp, teléfono, mapa,
//  horario y el aviso de "abierto/cerrado".
//  OJO: el texto visible y los datos para Google (JSON-LD) de index.html
//  también tienen el número y la dirección: busca "614 297 0351".
// =====================================================================
export const NEGOCIO = {
  nombre: 'Auto Alineaciones Luevano',
  whatsapp: '526142970351',          // 52 + número a 10 dígitos (por confirmar que tenga WhatsApp)
  telefono: '+526142970351',
  // Persona a quien preguntar. Si se deja vacío, no se muestra.
  contacto: '',                       // ej. 'Sra. Luevano'
  direccion: 'Av. Silvestre Terrazas 7007, Campesina Nueva, 31410 Chihuahua. Entrada por enfrente.',
  placeId: 'ChIJvX73Bv1c6oYRRtPLfB7TnTU', // ficha de Google Maps de Alineaciones Luevano
  lat: 28.6092401,
  lng: -106.0946299,
  // minutos desde las 00:00 · 0 = domingo … 6 = sábado (por confirmar con la dueña)
  horario: { 1: [510, 1110], 2: [510, 1110], 3: [510, 1110], 4: [510, 1110], 5: [510, 1110], 6: [510, 840] },
  // Firma del sitio
  autor: 'Ian Corral',
  portafolio: '' // ej. 'https://iancorral.dev' · si queda vacío, la firma no lleva enlace
};

export const enlaces = {
  wa: (texto) => `https://wa.me/${NEGOCIO.whatsapp}?text=${encodeURIComponent(texto)}`,
  mapa: () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Alineaciones Luevano')}&query_place_id=${NEGOCIO.placeId}`,
  ruta: () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Alineaciones Luevano')}&destination_place_id=${NEGOCIO.placeId}`,
  waze: () => `https://waze.com/ul?ll=${NEGOCIO.lat},${NEGOCIO.lng}&navigate=yes`,
  resena: () => `https://search.google.com/local/writereview?placeid=${NEGOCIO.placeId}`
};
