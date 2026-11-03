import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import type { FahrzeugReihe } from '@/lib/types';

import { anfrageHref, fahrzeugZiel, KATALOG_QUELLE, katalogIndex, markenZuordnung } from './fahrzeug-ziel';

const KATALOG = JSON.parse(readFileSync(path.join(process.cwd(), 'content/fahrzeugkatalog.json'), 'utf8')) as FahrzeugReihe[] | { reihen: FahrzeugReihe[] };
const reihen: FahrzeugReihe[] = Array.isArray(KATALOG) ? KATALOG : (Object.values(KATALOG).find(Array.isArray) as FahrzeugReihe[]);
const makes = defaults.vehicleMakes();
const index = katalogIndex(reihen);
const marken = markenZuordnung(index, makes);

describe('Fahrzeugwahl aus dem Katalog (G-14, G-15)', () => {
  it('nimmt nur sichtbare Reihen mit den Feldern der Suche in den Index', () => {
    expect(index.length).toBe(reihen.filter((r) => r.sichtbar).length);
    expect(index.length).toBeGreaterThan(500);
    expect(Object.keys(index[0]).every((k) => ['id', 'marke', 'reihe', 'sichtbar', 'alias', 'bestand', 'bestandsModell'].includes(k))).toBe(true);
  });

  it('führt ein gepflegtes Modell in den Weg mit Preis und Anzahlung', () => {
    const golf = sucheFahrzeuge('vw golf', index)[0].reihe;
    expect(fahrzeugZiel(golf, makes, marken)).toEqual({ art: 'gepflegt', makeSlug: 'volkswagen', modelSlug: 'golf', name: `${golf.marke} ${golf.reihe}` });
  });

  it('führt eine gepflegte Marke mit ungepflegter Reihe in „Modell nicht aufgeführt“', () => {
    const ohneModell = index.find((e) => !e.bestandsModell && marken.has(e.marke))!;
    expect(ohneModell).toBeDefined();
    const ziel = fahrzeugZiel(ohneModell, makes, marken);
    expect(ziel.art).toBe('marke');
    if (ziel.art === 'marke') expect(ziel.modelOther).toBe(ohneModell.reihe);
  });

  it('führt eine Marke ohne gepflegte Daten in die Anfrage', () => {
    const fremd = index.find((e) => !marken.has(e.marke))!;
    expect(fremd).toBeDefined();
    expect(fahrzeugZiel(fremd, makes, marken).art).toBe('anfrage');
  });

  it('ordnet Marken nur über Verweise auf gepflegte Modelle zu', () => {
    for (const [, slug] of marken) expect(makes.some((m) => m.slug === slug)).toBe(true);
    // Jedes gepflegte Modell ist über den Katalog erreichbar.
    for (const make of makes) {
      for (const model of make.models) {
        expect(index.some((e) => e.bestandsModell === `${make.slug}/${model.slug}`), `${make.slug}/${model.slug}`).toBe(true);
      }
    }
  });

  it('baut die Anfrage mit vorbelegtem Fahrzeug, gekürzt und kodiert', () => {
    expect(anfrageHref()).toBe('/service-und-termin/anfrage?thema=autoschluessel');
    expect(anfrageHref('Dacia Sandero')).toBe('/service-und-termin/anfrage?thema=autoschluessel&fahrzeug=Dacia%20Sandero');
    expect(decodeURIComponent(anfrageHref('x'.repeat(200)).split('fahrzeug=')[1])).toHaveLength(80);
  });

  it('nennt die Quelle des Katalogs nach Datenlizenz (MA-17)', () => {
    expect(KATALOG_QUELLE).toContain('Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026');
    expect(KATALOG_QUELLE).toContain('Datenlizenz Deutschland, Namensnennung, Version 2.0');
  });
});
