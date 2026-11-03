import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AUFBAU_GROESSE, AUFBAU_TEILE, AutoschluesselAufbau, BART } from './autoschluessel-aufbau';

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
});
