import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { echteEinstellungen, platzhalterEinstellungen } from '@/lib/rechtliches/test-hilfen';
import { WerkstattZeile, werkstattAngaben } from './werkstatt-zeile';

describe('Werkstattzeile', () => {
  const firma = echteEinstellungen().company;

  it('nennt Bezeichnung, Anschrift und Telefon als tel:-Link bei gepflegtem Standort', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(firma)} />);
    expect(html).toContain('<address');
    expect(html).toContain('Werkstatt und Abholung:');
    expect(html).toContain('Langgasse 70, 35576 Wetzlar');
    expect(html).toContain('href="tel:+4964418056279"');
    expect(html).toContain('06441 8056279');
  });

  it('nennt keine Öffnungszeiten', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(firma)} />);
    expect(html).not.toMatch(/Uhr|geöffnet|Öffnungszeit/);
  });

  it('zeigt nichts ohne gepflegten Standort', () => {
    expect(renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben({ ...firma, location: undefined })} />)).toBe('');
    expect(renderToStaticMarkup(<WerkstattZeile telefon="06441 8056279" />)).toBe('');
  });

  it('zeigt nichts, wenn der Standort dem Firmensitz entspricht', () => {
    const gleicherOrt = {
      ...firma,
      location: { label: 'Laden', street: firma.street, postalCode: firma.postalCode, city: firma.city },
    };
    expect(renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben(gleicherOrt)} />)).toBe('');
  });

  it('zeigt nichts bei Platzhalter-Firmendaten', () => {
    const angaben = werkstattAngaben(platzhalterEinstellungen().company);
    expect(angaben).toEqual({});
    expect(renderToStaticMarkup(<WerkstattZeile {...angaben} />)).toBe('');
  });

  it('lässt das Telefon weg, wenn keines gepflegt ist', () => {
    const html = renderToStaticMarkup(<WerkstattZeile {...werkstattAngaben({ ...firma, phone: '' })} />);
    expect(html).toContain('Langgasse 70, 35576 Wetzlar');
    expect(html).not.toContain('tel:');
  });
});
