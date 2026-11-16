import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { EINSATZRADIUS_BREITE, EINSATZRADIUS_SCHRIFT, EinsatzradiusZeichnung } from './einsatzradius';

const zeichne = (ort: string, radiusKm: number) => renderToStaticMarkup(<EinsatzradiusZeichnung ort={ort} radiusKm={radiusKm} />);

describe('EinsatzradiusZeichnung', () => {
  it('ist eine beschriftete Grafik mit Titel und role="img"', () => {
    const html = zeichne('Berlin', 40);
    expect(html).toContain('role="img"');
    expect(html).toContain('<title>Einsatzradius von etwa 40\u00a0km um Berlin</title>');
  });

  it('beschriftet den Radius mit geschütztem Leerzeichen und Dezimalkomma', () => {
    const ganz = zeichne('Berlin', 40);
    expect(ganz).toContain('r 40\u00a0km');
    expect(ganz).toContain('Einsatzradius von etwa 40\u00a0km um Berlin');

    const dezimal = zeichne('Berlin', 12.5);
    expect(dezimal).toContain('r 12,5\u00a0km');
    expect(dezimal).toContain('Einsatzradius von etwa 12,5\u00a0km um Berlin');
  });

  it('setzt keine id-Attribute', () => {
    expect(zeichne('Berlin', 40)).not.toMatch(/\sid=/);
  });

  it('wirft bei ungültigem Radius nicht, zeigt keine km-Beschriftung und keine Maßlinie', () => {
    for (const radiusKm of [Number.NaN, -5, 0, Number.POSITIVE_INFINITY]) {
      let html = '';
      expect(() => {
        html = zeichne('Berlin', radiusKm);
      }).not.toThrow();
      expect(html).not.toContain('km</text>');
      expect(html).not.toContain('\u00a0km');
      expect(html).not.toContain('M180 135L');
      expect(html).toContain('<title>Einsatzgebiet Berlin</title>');
    }
  });

  it('wirft bei leerem Ort nicht, zeigt keinen Orts-Text und keinen Titel mit Leerzeichen am Ende', () => {
    let html = '';
    expect(() => {
      html = zeichne('', 40);
    }).not.toThrow();
    expect(html).not.toMatch(/<text x="180"/);
    expect(html).toContain('<title>Einsatzradius von etwa 40\u00a0km</title>');
    expect(html).not.toMatch(/ <\/title>/);

    const ohneRadius = zeichne('  ', Number.NaN);
    expect(ohneRadius).toContain('<title>Einsatzgebiet</title>');
    expect(ohneRadius).not.toMatch(/<text x="180"/);
  });

  it('ist bei gleicher Eingabe deterministisch', () => {
    expect(zeichne('Hamburg', 40)).toEqual(zeichne('Hamburg', 40));
  });

  it('zeichnet den Kreis als Pfad mit sm24-draw und pathLength="1"', () => {
    const html = zeichne('Berlin', 40);
    const kreis = html.match(/<path[^>]*d="M75 135A[^"]*"[^>]*>/);
    expect(kreis).not.toBeNull();
    expect(kreis?.[0]).toContain('sm24-draw');
    expect(kreis?.[0]).toContain('pathLength="1"');
  });

  it('kürzt den Ortsnamen auf höchstens 20 Zeichen', () => {
    const html = zeichne('Ein sehr langer Ortsname über zwanzig Zeichen', 40);
    const ort = html.match(/<text x="180"[^>]*>([^<]*)<\/text>/);
    expect(ort).not.toBeNull();
    expect(ort?.[1].length).toBeLessThanOrEqual(20);
  });

  it('beschriftet auf dem Telefon mit mindestens 14 px, innerhalb der Fläche und ohne Überlappung (FA-QA-04D)', () => {
    // Darstellung bei 360 px Fensterbreite: volle Inhaltsbreite 320 px.
    expect((EINSATZRADIUS_SCHRIFT * 320) / EINSATZRADIUS_BREITE).toBeGreaterThanOrEqual(14);
    const html = zeichne('Ein sehr langer Ortsname über zwanzig Zeichen', 12.5);
    const texte = [...html.matchAll(/<text x="([0-9.]+)" y="([0-9.]+)" text-anchor="(start|middle)"[^>]*font-size="([0-9.]+)"[^>]*>([^<]*)<\/text>/g)].map(
      (m) => {
        const x = Number(m[1]);
        const breite = [...m[5]].length * Number(m[4]) * 0.6;
        const links = m[3] === 'middle' ? x - breite / 2 : x;
        return { links, rechts: links + breite, oben: Number(m[2]) - Number(m[4]), unten: Number(m[2]) + 4, groesse: Number(m[4]) };
      },
    );
    expect(texte).toHaveLength(2);
    for (const t of texte) {
      expect(t.groesse).toBe(EINSATZRADIUS_SCHRIFT);
      expect(t.links).toBeGreaterThanOrEqual(0);
      expect(t.rechts).toBeLessThanOrEqual(EINSATZRADIUS_BREITE);
    }
    const [a, b] = texte;
    const getrennt = a.rechts <= b.links || b.rechts <= a.links || a.unten <= b.oben || b.unten <= a.oben;
    expect(getrennt).toBe(true);
  });
});
