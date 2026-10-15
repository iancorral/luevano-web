import { describe, expect, it } from 'vitest';
import { SERVICES, getService } from './services';

describe('SERVICES', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = SERVICES.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('uses a different 3D piece for each service', () => {
    const pieces = SERVICES.map((service) => service.piece);
    expect(new Set(pieces).size).toBe(pieces.length);
  });

  it('keeps SEO text within search result limits', () => {
    for (const service of SERVICES) {
      expect(service.seoTitle.length, service.slug).toBeLessThanOrEqual(65);
      expect(service.seoDescription.length, service.slug).toBeLessThanOrEqual(160);
    }
  });

  it('has content for every section of its page', () => {
    for (const service of SERVICES) {
      expect(service.signs.length, service.slug).toBeGreaterThan(0);
      expect(service.steps.length, service.slug).toBeGreaterThan(0);
      expect(service.faq.length, service.slug).toBeGreaterThan(0);
    }
  });

  it('finds a service by slug', () => {
    expect(getService('alineacion')?.name).toBe('Alineación');
    expect(getService('no-existe')).toBeUndefined();
  });
});
