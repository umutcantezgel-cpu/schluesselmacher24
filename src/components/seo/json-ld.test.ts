import { describe, expect, it } from 'vitest';

import { echteEinstellungen, einstellungenMitWerkstatt, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';

import { localBusinessSchema } from './json-ld';

type Knoten = Record<string, unknown> & { '@type': string };

function knoten(settings: ReturnType<typeof einstellungenMitWerkstatt>, typ: string): Knoten {
  const graph = (localBusinessSchema(settings) as unknown as { '@graph': Knoten[] })['@graph'];
  return graph.find((eintrag) => eintrag['@type'] === typ)!;
}

describe('localBusinessSchema', () => {
  it('trägt den Sitz an der Organisation und die Werkstatt am Betrieb', () => {
    const settings = einstellungenMitWerkstatt();
    const organisation = knoten(settings, 'Organization');
    const betrieb = knoten(settings, 'Locksmith');
    expect(organisation.address).toMatchObject({ streetAddress: 'Langgasse 61', postalCode: '35576', addressLocality: 'Wetzlar' });
    expect(betrieb.address).toMatchObject({ streetAddress: 'Werkstattweg 7', postalCode: '35576', addressLocality: 'Wetzlar' });
    expect(betrieb.telephone).toBe('+4964418056279');
    expect(betrieb.email).toBe('info@schluesselmacher24.de');
    expect(betrieb.vatID).toBe('DE 282140471');
    expect(JSON.stringify(localBusinessSchema(settings))).not.toContain(settings.company.taxNumber!);
  });

  it('nennt mit den echten Daten eine einzige Anschrift: Langgasse 61 (FA-24)', () => {
    const settings = echteEinstellungen();
    expect(knoten(settings, 'Organization').address).toMatchObject({ streetAddress: 'Langgasse 61', postalCode: '35576', addressLocality: 'Wetzlar' });
    expect(knoten(settings, 'Locksmith').address).toMatchObject({ streetAddress: 'Langgasse 61', postalCode: '35576', addressLocality: 'Wetzlar' });
  });

  it('zeichnet keine Öffnungszeiten aus, sondern die Erreichbarkeit am Telefon rund um die Uhr (FA-23)', () => {
    const settings = echteEinstellungen();
    const betrieb = knoten(settings, 'Locksmith');
    expect(betrieb).not.toHaveProperty('openingHoursSpecification');
    expect(betrieb).not.toHaveProperty('openingHours');
    expect(betrieb.contactPoint).toMatchObject({
      '@type': 'ContactPoint',
      telephone: '+4964418056279',
      hoursAvailable: { '@type': 'OpeningHoursSpecification', opens: '00:00', closes: '23:59' },
    });
    const tage = (betrieb.contactPoint as { hoursAvailable: { dayOfWeek: string[] } }).hoursAvailable.dayOfWeek;
    expect(tage).toHaveLength(7);
    /* Die Terminzeiten der Werkstatt (09:00 bis 17:00) stehen in keinem Knoten. */
    expect(JSON.stringify(localBusinessSchema(settings))).not.toMatch(/09:00|13:00|14:00|17:00/);
  });

  it('lässt den Kontaktpunkt weg, wenn die Erreichbarkeit rund um die Uhr nicht gepflegt ist', () => {
    const settings = echteEinstellungen();
    settings.reachability = { kernaussage: 'Erreichbar nach Absprache', zeilen: [], rundUmDieUhr: false };
    expect(knoten(settings, 'Locksmith')).not.toHaveProperty('contactPoint');
  });

  it('lässt leere Angaben weg', () => {
    const settings = einstellungenMitWerkstatt();
    settings.company = { ...settings.company, vatId: '', email: '', location: undefined };
    const betrieb = knoten(settings, 'Locksmith');
    expect(betrieb).not.toHaveProperty('vatID');
    expect(betrieb).not.toHaveProperty('email');
    expect(betrieb.address).toMatchObject({ streetAddress: 'Langgasse 61' });
  });

  it('enthält bei Platzhalter-Firmendaten keine Firmendaten', () => {
    const text = JSON.stringify(localBusinessSchema(platzhalterEinstellungen()));
    expect(text).not.toContain('[Platzhalter');
    expect(text).not.toContain('[PLZ]');
    expect(text).not.toContain('telephone');
    expect(text).not.toContain('address');
  });
});
