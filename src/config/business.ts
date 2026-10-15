// Única fuente de datos del negocio. Todo el sitio (textos, enlaces, JSON-LD) sale de aquí.
// Debe coincidir exactamente con el Perfil de Empresa de Google.

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface DailyHours {
  open: string; // "HH:MM", 24 h
  close: string;
}

export interface PhoneNumber {
  display: string;
  e164: string;
}

export interface Business {
  name: string;
  alternateName: string;
  description: string;
  foundingDate: string; // YYYY-MM-DD
  phone: PhoneNumber; // principal: llamadas desde el sitio y Google
  landline: PhoneNumber; // fijo del taller
  whatsapp: string; // 52 + 10 dígitos
  contactPerson: string;
  address: {
    street: string;
    neighborhood: string;
    postalCode: string;
    city: string;
    region: string;
    regionCode: string;
    country: string;
    entranceNote: string;
  };
  geo: { lat: number; lng: number };
  googlePlaceId: string;
  timeZone: string;
  hours: Record<Weekday, DailyHours | null>;
  rating: { value: number; count: number };
  featuredReview: { author: string; badge: string; text: string };
  facebook: string;
  sameAs: string[];
  author: { name: string; url: string };
}

const FACEBOOK_URL = 'https://www.facebook.com/alineacionybalan/';

const weekday: DailyHours = { open: '08:00', close: '17:30' };

export const BUSINESS = {
  name: 'Auto Alineaciones Luevano',
  alternateName: 'Alineaciones Luevano',
  description:
    'Taller familiar de alineación, balanceo y suspensión en la colonia Campesina, Chihuahua, desde 1968.',
  foundingDate: '1968-12-12', // fecha de apertura en su ficha de Google
  phone: { display: '614 301 0831', e164: '+526143010831' }, // celular de la dueña: llamadas y WhatsApp
  landline: { display: '614 297 0351', e164: '+526142970351' }, // lo contesta un trabajador
  whatsapp: '526143010831',
  contactPerson: '', // ej. 'Sra. Luevano'; vacío = no se muestra
  address: {
    street: 'Av. Silvestre Terrazas 7011-A', // igual que la ficha verificada; la "A" la distingue del 7011
    neighborhood: 'Campesina',
    postalCode: '31410',
    city: 'Chihuahua',
    region: 'Chihuahua',
    regionCode: 'Chih.',
    country: 'MX',
    entranceNote: 'Entrada por enfrente',
  },
  geo: { lat: 28.6092401, lng: -106.0946299 },
  // Ficha verificada (https://maps.app.goo.gl/gbbQs8HELFmGa2PA7). La duplicada era ChIJvX73Bv1c6oYRRtPLfB7TnTU.
  googlePlaceId: 'ChIJq3QxKl5d6oYRSi3b0vJOWE4',
  timeZone: 'America/Chihuahua',
  hours: {
    0: null,
    1: weekday,
    2: weekday,
    3: weekday,
    4: weekday,
    5: weekday,
    6: { open: '08:00', close: '13:30' },
  }, // igual que la ficha de Google (el martes ahí dice 6:30 pm: confirmar si es error)
  rating: { value: 4.7, count: 3 },
  featuredReview: {
    author: 'Saúl Guerrero',
    badge: 'Local Guide en Google',
    text: 'Buen servicio, realizan reparaciones que pocos lugares hacen.',
  },
  facebook: FACEBOOK_URL,
  sameAs: [FACEBOOK_URL], // agregar Apple Maps, etc. cuando existan
  author: { name: 'Ian Corral', url: '' }, // url del portafolio; vacío = firma sin enlace
} as const satisfies Business;
