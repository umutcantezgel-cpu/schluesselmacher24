import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { defaults } from '@/lib/data/defaults';
import { sucheFahrzeuge } from '@/lib/fahrzeuge/suche';
import type { FahrzeugReihe } from '@/lib/types';

import { anfrageHref, fahrzeugZiel, KATALOG_ADRESSE, KATALOG_QUELLE, katalogIndex, KRAFTRAD_QUELLE, markenAZ, markenZuordnung } from './fahrzeug-ziel';

const KATALOG = JSON.parse(readFileSync(path.join(process.cwd(), 'content/fahrzeugkatalog.json'), 'utf8')) as FahrzeugReihe[] | { reihen: FahrzeugReihe[] };
const reihen: FahrzeugReihe[] = Array.isArray(KATALOG) ? KATALOG : (Object.values(KATALOG).find(Array.isArray) as FahrzeugReihe[]);
const makes = defaults.vehicleMakes();
const index = katalogIndex(reihen);
const marken = markenZuordnung(index, makes);

describe('Fahrzeugwahl aus dem Katalog (G-14, G-15)', () => {
  it('nimmt nur sichtbare Reihen mit den Feldern der Suche in den Index', () => {
    expect(index.length).toBe(reihen.filter((r) => r.sichtbar).length);
    expect(index.length).toBeGreaterThan(500);
    expect(Object.keys(index[0]).every((k) => ['id', 'klasse', 'marke', 'reihe', 'sichtbar', 'alias', 'bestand', 'bestandsModell', 'generationen'].includes(k))).toBe(true);
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

  it('führt „Fahrzeug nicht gefunden“ in die Anfrage mit Unterlagen, nicht in die allgemeine Anfrage (FA-KERN-02B)', () => {
    expect(anfrageHref()).toBe('/autoschluessel/fahrzeug-nicht-gefunden');
    expect(anfrageHref('Dacia Sandero')).toBe('/autoschluessel/fahrzeug-nicht-gefunden?fahrzeug=Dacia%20Sandero');
    expect(decodeURIComponent(anfrageHref('x'.repeat(200)).split('fahrzeug=')[1])).toHaveLength(80);
    // Treffer des Katalogs: Marke und Reihe getrennt, damit mehrteilige Marken stimmen.
    expect(anfrageHref({ marke: 'Alfa Romeo', reihe: 'Giulia' })).toBe('/autoschluessel/fahrzeug-nicht-gefunden?marke=Alfa%20Romeo&modell=Giulia');
    expect(anfrageHref({ marke: 'Lada' })).toBe('/autoschluessel/fahrzeug-nicht-gefunden?marke=Lada');
    expect(anfrageHref()).not.toContain('service-und-termin');
  });

  it('nennt die Quelle des Katalogs nach Datenlizenz (MA-17)', () => {
    expect(KATALOG_QUELLE).toContain('Kraftfahrt-Bundesamt (KBA), FZ 12, Stand 1.1.2026');
    expect(KATALOG_QUELLE).toContain('Datenlizenz Deutschland, Namensnennung, Version 2.0');
  });
});

describe('Fahrzeugklassen im Katalog (A-047)', () => {
  const pkw = katalogIndex(reihen, 'pkw');
  const kraftrad = katalogIndex(reihen, 'kraftrad');

  it('trennt den Index nach Klasse, ohne Zeilen zu verlieren', () => {
    expect(pkw.length + kraftrad.length).toBe(index.length);
    expect(pkw.length).toBeGreaterThan(900);
    expect(kraftrad.length).toBeGreaterThan(1500);
    expect(pkw.every((e) => e.klasse === undefined)).toBe(true);
    expect(kraftrad.every((e) => e.klasse === 'kraftrad')).toBe(true);
  });

  it('führt jede Zeile aus FZ 2 als auffindbar, aber nicht buchbar (R4)', () => {
    const fz2 = reihen.filter((r) => r.quelle.includes('FZ 2,'));
    expect(fz2.length).toBeGreaterThan(2000);
    for (const r of fz2) {
      expect(r.leistungen).toEqual([]);
      expect(r.klonbar).toBe('unbekannt');
      expect(r.gehaeuse).toBe('unbekannt');
      expect(r.transponder).toBeUndefined();
      expect(r.bestandsModell).toBeUndefined();
    }
    const kennungen = new Set(reihen.map((r) => r.id));
    expect(kennungen.size).toBe(reihen.length);
  });

  it('findet Krafträder nur im Motorradweg und Autos nur im Autoschlüssel-Weg', () => {
    const krad = sucheFahrzeuge('Kawasaki Z900', kraftrad, { klasse: 'kraftrad' });
    expect(krad[0]?.reihe).toMatchObject({ marke: 'Kawasaki', reihe: 'Z900' });
    expect(sucheFahrzeuge('Kawasaki Z900', pkw, { klasse: 'pkw' })).toEqual([]);
    expect(sucheFahrzeuge('VW Golf', kraftrad, { klasse: 'kraftrad' })).toEqual([]);
    expect(sucheFahrzeuge('VW Golf', pkw, { klasse: 'pkw' })[0]?.reihe.reihe).toBe('Golf');
  });

  it('findet seltene Marken und Untermarken aus FZ 2.2', () => {
    expect(sucheFahrzeuge('Trabant 601', pkw, { klasse: 'pkw' })[0]?.reihe.marke).toBe('Trabant');
    expect(sucheFahrzeuge('Cupra Leon', pkw, { klasse: 'pkw' })[0]?.reihe).toMatchObject({ marke: 'Cupra', reihe: 'Leon' });
    // Das KBA führt den Formentor in FZ 12 unter SEAT: Die Untermarke findet ihn dort.
    expect(sucheFahrzeuge('Cupra Formentor', pkw, { klasse: 'pkw' })[0]?.reihe).toMatchObject({ marke: 'SEAT', reihe: 'Formentor' });
  });

  it('listet alle Automarken von A bis Z, ohne Krafträder', () => {
    const az = markenAZ(reihen, 'pkw');
    expect(az.length).toBe(new Set(reihen.filter((r) => (r.klasse ?? 'pkw') === 'pkw' && r.sichtbar).map((r) => r.marke)).size);
    expect(az.map((m) => m.marke)).toContain('Wartburg');
    expect(az.map((m) => m.marke)).not.toContain('Kawasaki');
    const namen = az.map((m) => m.marke);
    expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, 'de', { sensitivity: 'base' })));
    expect(markenAZ(reihen, 'kraftrad').map((m) => m.marke)).toContain('Kawasaki');
  });

  it('lädt jede Klasse von einer eigenen Adresse nach und nennt die Quelle getrennt', () => {
    expect(KATALOG_ADRESSE.pkw).not.toBe(KATALOG_ADRESSE.kraftrad);
    expect(KATALOG_QUELLE).toContain('FZ 2, Stand 1.1.2026, © Kraftfahrt-Bundesamt, Flensburg, Datenlizenz Deutschland - Namensnennung - Version 2.0');
    expect(KRAFTRAD_QUELLE).toContain('FZ 2, Stand 1.1.2026');
    expect(KRAFTRAD_QUELLE).not.toContain('FZ 12');
  });
});
