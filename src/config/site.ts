// Dominio definitivo (pendiente de comprar).
const DOMAIN = 'https://alineacionesluevano.mx';

// En Vercel, mientras no haya dominio propio, se usa la URL del proyecto (…vercel.app).
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : DOMAIN);

// En la URL de prueba de Vercel no se deja que Google indexe el sitio.
export const IS_PREVIEW_HOST = new URL(SITE_URL).hostname.endsWith('.vercel.app');
