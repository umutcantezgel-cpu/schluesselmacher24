import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { EinsatzradiusZeichnung } from './einsatzradius';

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
});
