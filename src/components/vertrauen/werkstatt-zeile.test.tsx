import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { echteEinstellungen, einstellungenMitWerkstatt, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';
import { WerkstattZeile, werkstattAngaben } from './werkstatt-zeile';

describe('Werkstattzeile', () => {
  const firma = einstellungenMitWerkstatt().company;

  it('nennt Bezeichnung, Anschrift und Telefon als tel:-Link bei gepflegtem Standort', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(firma)} />);
    expect(html).toContain('<address');
    expect(html).toContain('Werkstatt und Abholung:');
    expect(html).toContain('Werkstattweg 7, 35576 Wetzlar');
    expect(html).toContain('href="tel:+4964418056279"');
    expect(html).toContain('06441 8056279');
  });

  it('nennt keine Öffnungszeiten', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(firma)} />);
    expect(html).not.toMatch(/Uhr|geöffnet|Öffnungszeit/);
  });

  it('nennt den Firmensitz als Werkstatt, wenn kein eigener Standort gepflegt ist (echte Daten: Langgasse 61)', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(echteEinstellungen().company)} />);
    expect(html).toContain('Werkstatt:');
    expect(html).toContain('Langgasse 61, 35576 Wetzlar');
    expect(html).not.toContain('Werkstatt und Abholung');
    expect(renderToStaticMarkup(<WerkstattZeile telefon="06441 8056279" />)).toBe('');
  });

  it('nennt den Firmensitz nur einmal, wenn der Standort dem Firmensitz entspricht', () => {
    const gleicherOrt = {
      ...firma,
      location: { label: 'Laden', street: firma.street, postalCode: firma.postalCode, city: firma.city },
    };
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(gleicherOrt)} />);
    expect(html).toContain('Werkstatt:');
    expect(html.match(/Langgasse 61/g)).toHaveLength(1);
    expect(html).not.toContain('Laden');
  });

  it('zeigt nichts bei Platzhalter-Firmendaten', () => {
    const angaben = werkstattAngaben(platzhalterEinstellungen().company);
    expect(angaben).toEqual({});
    expect(renderToStaticMarkup(<WerkstattZeile {...angaben} />)).toBe('');
  });

  it('lässt das Telefon weg, wenn keines gepflegt ist', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben({ ...firma, phone: '' })} />);
    expect(html).toContain('Werkstattweg 7, 35576 Wetzlar');
    expect(html).not.toContain('tel:');
  });
});
