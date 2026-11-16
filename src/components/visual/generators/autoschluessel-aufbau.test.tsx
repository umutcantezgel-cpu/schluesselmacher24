import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AUFBAU_GROESSE, AUFBAU_TEILE, AutoschluesselAufbau, BART, POSITION_RADIUS, POSITION_SCHRIFT, POSITIONEN } from './autoschluessel-aufbau';

describe('Aufbauzeichnung Autoschlüssel (A-025)', () => {
  const html = renderToStaticMarkup(<AutoschluesselAufbau />);

  it('ist ein benanntes Bild mit Zeichenpapier in der festen Größe', () => {
    expect(html).toContain('role="img"');
    expect(html).toContain('<title>Aufbau eines Funk-Klappschlüssels, schematisch</title>');
    expect(html).toContain(`viewBox="0 0 ${AUFBAU_GROESSE.breite} ${AUFBAU_GROESSE.hoehe}"`);
  });

  it('trägt genau eine Positionsnummer je Teil, 1 bis 5', () => {
    expect(AUFBAU_TEILE.map((t) => t.nr)).toEqual([1, 2, 3, 4, 5]);
    for (const { nr } of AUFBAU_TEILE) expect(html.match(new RegExp(`data-position="${nr}"`, 'g'))).toHaveLength(1);
  });

  it('zeichnet den Bart mehr als zehnmal so lang wie hoch und innerhalb der Fläche', () => {
    expect(BART.laenge / BART.hoehe).toBeGreaterThan(10);
    expect(BART.x + BART.laenge).toBeLessThanOrEqual(AUFBAU_GROESSE.breite);
  });

  it('enthält keine festen Farbwerte', () => {
    const quelle = readFileSync(path.join(process.cwd(), 'src/components/visual/generators/autoschluessel-aufbau.tsx'), 'utf8');
    expect(quelle).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|hsl\(|rgb\(/i);
  });

  it('setzt die Positionsnummern auf dem Telefon mit mindestens 14 px, in der Fläche und frei (FA-QA-04D)', () => {
    // /autoschluessel bei 360 px: Kasten mit p-3 und Rahmen, etwa 294 px breit.
    expect((POSITION_SCHRIFT * 294) / AUFBAU_GROESSE.breite).toBeGreaterThanOrEqual(14);
    expect(html.match(new RegExp(`font-size="${POSITION_SCHRIFT}"`, 'g'))).toHaveLength(5);
    // Eine Ziffer (Mono, 0,6 em) passt in den Kreis.
    expect(POSITION_SCHRIFT * 0.6).toBeLessThan(POSITION_RADIUS * 2 - 8);
    for (const p of POSITIONEN) {
      expect(p.x - POSITION_RADIUS).toBeGreaterThanOrEqual(0);
      expect(p.x + POSITION_RADIUS).toBeLessThanOrEqual(AUFBAU_GROESSE.breite);
      expect(p.y - POSITION_RADIUS).toBeGreaterThanOrEqual(0);
      expect(p.y + POSITION_RADIUS).toBeLessThanOrEqual(AUFBAU_GROESSE.hoehe);
      for (const q of POSITIONEN) {
        if (q.nr !== p.nr) expect(Math.hypot(p.x - q.x, p.y - q.y)).toBeGreaterThan(2 * POSITION_RADIUS);
      }
    }
    // Der Kreis an Position 1 bleibt über dem Bart.
    const eins = POSITIONEN.find((p) => p.nr === 1)!;
    expect(eins.y + POSITION_RADIUS).toBeLessThan(BART.y);
  });
});
