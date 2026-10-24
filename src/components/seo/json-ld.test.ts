import { describe, expect, it } from 'vitest';

import { echteEinstellungen, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';

import { localBusinessSchema } from './json-ld';

type Knoten = Record<string, unknown> & { '@type': string };

function knoten(settings: ReturnType<typeof echteEinstellungen>, typ: string): Knoten {
  const graph = (localBusinessSchema(settings) as unknown as { '@graph': Knoten[] })['@graph'];
  return graph.find((eintrag) => eintrag['@type'] === typ)!;
}

describe('localBusinessSchema', () => {
  it('trägt den Sitz an der Organisation und die Werkstatt am Betrieb', () => {
    const settings = echteEinstellungen();
    const organisation = knoten(settings, 'Organization');
    const betrieb = knoten(settings, 'Locksmith');
    expect(organisation.address).toMatchObject({ streetAddress: 'Gloelstraße 11', postalCode: '35576', addressLocality: 'Wetzlar' });
    expect(betrieb.address).toMatchObject({ streetAddress: 'Langgasse 70', postalCode: '35576', addressLocality: 'Wetzlar' });
    expect(betrieb.telephone).toBe('+4964418056279');
    expect(betrieb.email).toBe('info@schluesselmacher24.de');
    expect(betrieb.vatID).toBe('DE 282140471');
    expect(betrieb.openingHoursSpecification).toBeDefined();
    expect(JSON.stringify(localBusinessSchema(settings))).not.toContain(settings.company.taxNumber!);
  });

  it('lässt leere Angaben weg', () => {
    const settings = echteEinstellungen();
    settings.company = { ...settings.company, vatId: '', email: '', location: undefined };
    const betrieb = knoten(settings, 'Locksmith');
    expect(betrieb).not.toHaveProperty('vatID');
    expect(betrieb).not.toHaveProperty('email');
    expect(betrieb.address).toMatchObject({ streetAddress: 'Gloelstraße 11' });
  });

  it('enthält bei Platzhalter-Firmendaten keine Firmendaten', () => {
    const text = JSON.stringify(localBusinessSchema(platzhalterEinstellungen()));
    expect(text).not.toContain('[Platzhalter');
    expect(text).not.toContain('[PLZ]');
    expect(text).not.toContain('telephone');
    expect(text).not.toContain('address');
  });
});
