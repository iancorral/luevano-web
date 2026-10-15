import { BUSINESS } from '@/config/business';
import { SERVICES, type Service } from '@/data/services';
import { getSchemaOpeningHours } from './hours';
import { links } from './links';

// Sin aggregateRating: Google no muestra estrellas que el propio negocio publica sobre sí mismo.
export function localBusinessSchema(site: URL, imageUrl: string) {
  const { address, geo } = BUSINESS;
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': new URL('/#business', site).href,
    name: BUSINESS.name,
    alternateName: BUSINESS.alternateName,
    description: BUSINESS.description,
    foundingDate: BUSINESS.foundingDate,
    url: site.href,
    image: imageUrl,
    telephone: BUSINESS.phone.e164,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.regionCode,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: geo.lat, longitude: geo.lng },
    hasMap: links.map,
    openingHoursSpecification: getSchemaOpeningHours(),
    areaServed: { '@type': 'City', name: address.city },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios',
      itemListElement: SERVICES.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name, url: new URL(`/${service.slug}`, site).href },
      })),
    },
    ...(BUSINESS.sameAs.length ? { sameAs: BUSINESS.sameAs } : {}),
  };
}

export function serviceSchema(site: URL, service: Service) {
  const url = new URL(`/${service.slug}`, site).href;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      serviceType: service.name,
      description: service.seoDescription,
      url,
      provider: { '@id': new URL('/#business', site).href },
      areaServed: { '@type': 'City', name: BUSINESS.address.city },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.href },
        { '@type': 'ListItem', position: 2, name: service.name, item: url },
      ],
    },
  ];
}
