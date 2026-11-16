import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import vehiclesJson from '../../../../../content/vehicles.json';
import type { UmbauBeispiel, VehicleMake } from '@/lib/types';

import { BEDINGUNGEN, CUSTOMIZING_KURZTEXT, KEINE_FALSCHEN_VERSPRECHEN, MOEGLICH, PRUEFUNG } from './texte';
import { umbauAngaben } from './umbau-beispiele';

/* Rubrik Customizing (FA-SHOP-02B, Punkt 3; FA-14-05 bis FA-14-11). */

const ALLE_TEXTE = [CUSTOMIZING_KURZTEXT, KEINE_FALSCHEN_VERSPRECHEN, ...MOEGLICH.flatMap((m) => [m.titel, m.satz]), ...BEDINGUNGEN.flatMap((b) => [b.titel, b.satz]), ...PRUEFUNG];

describe('Customizing: Texte', () => {
  it('der Satz gegen falsche Erwartungen steht im Wortlaut des Inhabers', () => {
    expect(KEINE_FALSCHEN_VERSPRECHEN).toContain(
      'Optischer Umbau nur dort anbieten, wo Elektronik, Transponder, Tasten und Bart technisch passend übernommen werden können.',
    );
  });

  it('nennt die vier Bedingungen und die Prüfung über Fotos, Fahrzeug und Schlüsseltyp', () => {
    expect(BEDINGUNGEN.map((b) => b.titel)).toEqual(['Elektronik', 'Transponder', 'Tasten', 'Bart']);
    expect(PRUEFUNG.join(' ')).toMatch(/Fotos/);
    expect(PRUEFUNG.join(' ')).toMatch(/Fahrzeug und Schlüsseltyp/);
    expect(PRUEFUNG.at(-1)).toMatch(/Rückmeldung, ob der Umbau geht/);
  });

  it('keine konkreten Fahrzeuge oder Marken ohne Beleg (R4, R12)', () => {
    const marken = (vehiclesJson as VehicleMake[]).map((m) => m.name);
    for (const text of ALLE_TEXTE) {
      for (const marke of marken) expect(text, marke).not.toMatch(new RegExp(`\\b${marke}\\b`));
    }
  });

  it('keine Preise, keine Fristen, keine Gedankenstriche (R9)', () => {
    for (const text of ALLE_TEXTE) {
      expect(text).not.toMatch(/€|\d+\s?(tage|werktage|stunden)|garantiert|kostenlos/i);
      expect(text).not.toMatch(/[–—]| - /);
    }
  });

  it('der Vergleich erscheint nur mit Beispielen aus den Daten, nicht als fester Baustein (R4)', () => {
    const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
    expect(seite).toContain("getUmbauBeispiele('customizing')");
    expect(seite).toMatch(/beispiele\.length > 0 &&/);
    expect(seite).not.toMatch(/<VorherNachher/);
  });
});

describe('Angaben eines Umbau-Beispiels', () => {
  const bild = { url: '/x.jpg', alt: 'x', beschriftung: 'x' };
  const beispiel: UmbauBeispiel = {
    id: 'b1',
    titel: 'Test',
    vorher: bild,
    nachher: bild,
    uebernommen: ['elektronik', 'transponder'],
    hinweis: 'Test',
    einsatz: ['customizing'],
    reihenfolge: 0,
  };

  it('nur gepflegte Angaben, Reihe mit Namen aus dem Katalog', () => {
    expect(umbauAngaben(beispiel, [])).toEqual([{ name: 'Übernommen', wert: 'Elektronik, Transponder' }]);
    const voll = { ...beispiel, marke: 'Testmarke', reihe: 'testmarke-alpha', schluesselart: 'klappschluessel' as const };
    expect(umbauAngaben(voll, [{ id: 'testmarke-alpha', reihe: 'Alpha' }]).map((a) => a.wert)).toEqual([
      'Testmarke Alpha',
      'Klappschlüssel',
      'Elektronik, Transponder',
    ]);
  });
});
