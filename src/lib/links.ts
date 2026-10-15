import { BUSINESS } from '@/config/business';

const placeQuery = encodeURIComponent(BUSINESS.name);

export const links = {
  whatsapp: (text: string) => `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`,
  phone: `tel:${BUSINESS.phone.e164}`,
  landline: `tel:${BUSINESS.landline.e164}`,
  map: `https://www.google.com/maps/search/?api=1&query=${placeQuery}&query_place_id=${BUSINESS.googlePlaceId}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${placeQuery}&destination_place_id=${BUSINESS.googlePlaceId}`,
  waze: `https://waze.com/ul?ll=${BUSINESS.geo.lat},${BUSINESS.geo.lng}&navigate=yes`,
  review: `https://search.google.com/local/writereview?placeid=${BUSINESS.googlePlaceId}`,
} as const;

export const WHATSAPP_GREETING = 'Hola, vi su página y quiero pedir informes.';

export const fullAddress = (): string => {
  const { street, neighborhood, postalCode, city } = BUSINESS.address;
  return `${street}, ${neighborhood}, ${postalCode} ${city}`;
};
