import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import * as vorOrt from './fahrzeug-vor-ort';
import * as pricing from './pricing';

/* FA-SEO-03D (Regel A-071): Die Regel „Fahrzeug vor Ort“ liegt ohne die übrige Preislogik in
   `fahrzeug-vor-ort.ts`. Der Autoschlüssel-Assistent liest sie über `components/autoschluessel/optionen.ts`
   im Browser; so lädt er die Zylinder- und Konfiguratorregeln aus `pricing.ts` nicht mit. Die Regel selbst
   prüft `pricing.test.ts` (über die Weitergabe aus `pricing.ts`). */
const ziele = (pfad: string) =>
  [...readFileSync(pfad, 'utf8').matchAll(/^import\s+(?!type\s)[^;]*?from\s*'([^']+)'/gm)].map((m) => m[1]);

describe('Fahrzeug vor Ort: eigene Datei ohne Preislogik (FA-SEO-03D)', () => {
  it('pricing.ts gibt dieselben Objekte weiter', () => {
    expect(pricing.fahrzeugVorOrtNoetig).toBe(vorOrt.fahrzeugVorOrtNoetig);
    expect(pricing.LEISTUNGEN_MIT_ANLERNEN).toBe(vorOrt.LEISTUNGEN_MIT_ANLERNEN);
    expect([...vorOrt.LEISTUNGEN_MIT_ANLERNEN]).toEqual(['zweitschluessel', 'ersatz-bei-verlust', 'programmierung']);
  });

  it('fahrzeug-vor-ort.ts importiert zur Laufzeit nichts', () => {
    expect(ziele('src/lib/fahrzeug-vor-ort.ts')).toEqual([]);
  });

  it('die Beschriftungen des Assistenten ziehen die Preislogik nicht herein', () => {
    const importe = ziele('src/components/autoschluessel/optionen.ts');
    expect(importe).toContain('@/lib/fahrzeug-vor-ort');
    expect(importe).not.toContain('@/lib/pricing');
    expect(importe).not.toContain('@/lib/cylinder-rules');
  });
});
