import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { echteEinstellungen, einstellungenMitWerkstatt, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';

import { KENNUNG, articleSchema, breadcrumbSchema, localBusinessSchema, pageGraphSchema, serviceAreaSchema } from './json-ld';

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

/* ---------- FA-SEO-01C: feste Kennung, Leistungen, keine doppelten Kennungen ---------- */

describe('Betrieb als feste Kennung (FA-25-08)', () => {
  const graph = (daten: unknown) => (daten as { '@graph': Knoten[] })['@graph'];

  it('der Betriebs-Graph definiert Organisation, Website und Locksmith, aber keine Webseite der Startseite', () => {
    const typen = graph(localBusinessSchema(echteEinstellungen())).map((k) => k['@type']);
    expect(typen).toEqual(['Organization', 'WebSite', 'Locksmith']);
    expect(knoten(echteEinstellungen(), 'Locksmith')['@id']).toBe(KENNUNG.betrieb);
  });

  it('Seiten-Graphen verweisen nur per @id auf den Betrieb und definieren ihn nicht erneut', () => {
    const seite = graph(pageGraphSchema({
      path: '/schliessanlagen',
      name: 'Schließanlagen',
      crumbs: [{ href: '/schliessanlagen', label: 'Schließanlagen' }],
      service: { name: 'Schließanlagen', description: 'Wir planen Ihre Schließanlage.' },
    }));
    expect(seite.map((k) => k['@type'])).toEqual(['WebPage', 'Service', 'BreadcrumbList']);
    const service = seite.find((k) => k['@type'] === 'Service')!;
    expect(service).toMatchObject({
      name: 'Schließanlagen',
      description: 'Wir planen Ihre Schließanlage.',
      provider: { '@id': KENNUNG.betrieb },
      areaServed: { '@type': 'Country', name: 'Deutschland' },
    });
    expect(Object.keys(service.provider as object)).toEqual(['@id']);
  });

  it('auf einer Seite kommt jede Kennung nur einmal als Definition vor (Layout + Seite)', () => {
    const settings = echteEinstellungen();
    const knotenDerSeite = [
      ...graph(localBusinessSchema(settings)),
      ...graph(pageGraphSchema({
        path: '/autoschluessel/nachmachen',
        name: 'Autoschlüssel nachmachen',
        crumbs: [{ href: '/autoschluessel', label: 'Autoschlüssel' }, { href: '/autoschluessel/nachmachen', label: 'Nachmachen' }],
        service: { name: 'Autoschlüssel nachmachen' },
        faq: [{ question: 'Frage?', answer: 'Antwort.' }],
      })),
    ];
    const kennungen = knotenDerSeite.map((k) => k['@id']);
    expect(new Set(kennungen).size).toBe(kennungen.length);
  });

  it('ohne sichtbaren Kurztext hat die Leistung keine Beschreibung', () => {
    const service = graph(pageGraphSchema({ path: '/x', name: 'X', service: { name: 'X' } })).find((k) => k['@type'] === 'Service')!;
    expect(service).not.toHaveProperty('description');
  });

  it('Brotkrumen beginnen mit der Startseite und doppeln sie nicht; die Startseite hat keine', () => {
    const krumen = graph(breadcrumbSchema([{ href: '/', label: 'Start' }, { href: '/ratgeber', label: 'Ratgeber' }], 'https://x.test/ratgeber'))
      .find((k) => k['@type'] === 'BreadcrumbList')!.itemListElement as Array<{ name: string; position: number }>;
    expect(krumen.map((k) => k.name)).toEqual(['Startseite', 'Ratgeber']);
    expect(krumen.map((k) => k.position)).toEqual([1, 2]);
    const start = graph(pageGraphSchema({ path: '/', name: 'Start', crumbs: [{ href: '/', label: 'Start' }] }));
    expect(start.map((k) => k['@type'])).toEqual(['WebPage']);
    expect(start[0]['@id']).toMatch(/\/#webpage$/);
  });

  it('Artikel und Einsatzgebiet nennen keinen Firmennamen fest, sondern verweisen per @id', () => {
    const artikel = JSON.stringify(articleSchema({ slug: 's', title: 'T', excerpt: 'E', updatedAt: '2026-11-01' } as Parameters<typeof articleSchema>[0]));
    expect(artikel).not.toContain('SCHLÜSSELMACHER24');
    expect(artikel).toContain(KENNUNG.organisation);
    const ort = JSON.stringify(serviceAreaSchema({ slug: 'w', city: 'Wetzlar', state: 'Hessen' } as Parameters<typeof serviceAreaSchema>[0]));
    expect(ort).toContain(`"provider":{"@id":"${KENNUNG.betrieb}"}`);
    expect(ort).not.toMatch(/openingHours/);
  });
});

describe('Einbindung', () => {
  const quelle = (datei: string) => readFileSync(path.join(__dirname, '../../app/(site)', datei), 'utf8');

  it('das Root-Layout bindet den Betrieb auf jeder Seite ein, die Startseite nicht noch einmal', () => {
    expect(quelle('layout.tsx')).toContain('<JsonLd data={localBusinessSchema(settings)} />');
    expect(quelle('page.tsx')).not.toContain('localBusinessSchema');
  });
});
