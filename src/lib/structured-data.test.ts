import { describe, expect, it } from 'vitest';
import { BUSINESS } from '@/config/business';
import { SERVICES } from '@/data/services';
import { localBusinessSchema, serviceSchema } from './structured-data';

const site = new URL('https://example.mx');

describe('localBusinessSchema', () => {
  const schema = localBusinessSchema(site, 'https://example.mx/og.jpg');

  it('matches the Google Business Profile data', () => {
    expect(schema.name).toBe(BUSINESS.name);
    expect(schema.telephone).toBe(BUSINESS.phone.e164);
    expect(schema.address.streetAddress).toBe(BUSINESS.address.street);
  });

  it('does not self-publish ratings', () => {
    expect(schema).not.toHaveProperty('aggregateRating');
  });

  it('lists every service with its page', () => {
    const urls = schema.hasOfferCatalog.itemListElement.map((offer) => offer.itemOffered.url);
    expect(urls).toEqual(SERVICES.map((service) => `https://example.mx/${service.slug}`));
  });
});

describe('serviceSchema', () => {
  it('links the service to the business and adds a breadcrumb', () => {
    const [service, breadcrumb] = serviceSchema(site, SERVICES[0]!);
    expect(service).toMatchObject({
      '@type': 'Service',
      provider: { '@id': 'https://example.mx/#business' },
    });
    expect(breadcrumb).toMatchObject({ '@type': 'BreadcrumbList' });
  });
});
