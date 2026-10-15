import { describe, expect, it } from 'vitest';
import { BUSINESS } from '@/config/business';
import { links } from './links';

describe('links', () => {
  it('sends WhatsApp messages to the mobile number with the text encoded', () => {
    const url = new URL(links.whatsapp('Hola, ¿tienen lugar el sábado?\nMi carro es F-150 & más'));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${BUSINESS.whatsapp}`);
    expect(url.searchParams.get('text')).toBe('Hola, ¿tienen lugar el sábado?\nMi carro es F-150 & más');
  });

  it('keeps WhatsApp on the same number used for calls', () => {
    expect(`+${BUSINESS.whatsapp}`).toBe(BUSINESS.phone.e164);
  });

  it('builds tel: links in E.164 format', () => {
    expect(links.phone).toMatch(/^tel:\+52\d{10}$/);
    expect(links.landline).toMatch(/^tel:\+52\d{10}$/);
    expect(links.phone).not.toBe(links.landline);
  });

  it('points Maps links to the Google place', () => {
    for (const url of [links.map, links.directions, links.review]) {
      expect(url).toContain(BUSINESS.googlePlaceId);
    }
  });
});
