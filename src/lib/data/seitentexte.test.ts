import { describe, expect, it } from 'vitest';

import seiten from '../../../content/seo.json';

/* Ortsbezug (I-17): Startseite und Autoschlüssel-Seiten nennen die Werkstatt in Wetzlar im
 * Titel. Die Marke hängt die Vorlage im Wurzel-Layout an, die Startseite trägt sie selbst.
 * Die Fahrzeugöffnung fehlt bewusst: Sie findet meist beim Fahrzeug statt, nicht in der Werkstatt. */
const MARKE = ' | SCHLÜSSELMACHER24';
const ROUTEN = [
  '',
  'autoschluessel',
  'autoschluessel/nachmachen',
  'autoschluessel/programmieren',
  'autoschluessel/kopieren',
  'autoschluessel/funkschluessel',
  'autoschluessel/smart-key',
  'autoschluessel/schluesselbart-fraesen',
];

describe('Seitentexte mit Ortsbezug', () => {
  it.each(ROUTEN)('„%s“ nennt Wetzlar im Titel, ohne Marke höchstens 60 Zeichen', (route) => {
    const titel = seiten.find((s) => s.route === route)?.seo.title.replace(MARKE, '') ?? '';
    expect(titel).toContain('Wetzlar');
    expect(titel.length).toBeLessThanOrEqual(60);
  });
});
