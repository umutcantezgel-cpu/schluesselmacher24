import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import vehiclesJson from '../../../../../content/vehicles.json';
import { rubriken } from '@/lib/data/defaults/rubriken';
import type { UmbauBeispiel, VehicleMake } from '@/lib/types';

import { BEDINGUNGEN, CUSTOMIZING_KURZTEXT, CUSTOMIZING_PFAD, KEINE_FALSCHEN_VERSPRECHEN, MOEGLICH } from './texte';
import { umbauAngaben } from './umbau-beispiele';
import { anfrageAdresse } from '../gehaeuse/anfrage/leistung';

/* Rubrik Customizing (FA-SHOP-02B, Punkt 3; FA-14-05 bis FA-14-11). */

/** Die Rubrik aus den Daten: Ihr Ablauf ist die Prüfung der Seite (G-10, G-11). */
const RUBRIK = rubriken().find((r) => r.id === 'customizing')!;
const PRUEFUNG = RUBRIK.ablauf.map((s) => s.text);
const RUBRIK_TEXTE = [RUBRIK.name, RUBRIK.laienname, RUBRIK.erklaerung, ...RUBRIK.ablauf.flatMap((s) => [s.titel, s.text])];

const ALLE_TEXTE = [CUSTOMIZING_KURZTEXT, KEINE_FALSCHEN_VERSPRECHEN, ...MOEGLICH.flatMap((m) => [m.titel, m.satz]), ...BEDINGUNGEN.flatMap((b) => [b.titel, b.satz]), ...RUBRIK_TEXTE];

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

  it('die eigene Rubrik des Inhabers steht in den Daten: live, unter Autoschlüssel, mit Fahrzeugschein (FA-14, R13)', () => {
    expect(RUBRIK).toMatchObject({
      name: 'Customizing und Modifikation',
      ziel: CUSTOMIZING_PFAD,
      status: 'live',
      navigation: 'autoschluessel',
      imHub: false,
      nachweis: 'fahrzeugschein',
      abschluss: 'anfrage',
    });
    expect(RUBRIK.pflichtUploads).toEqual(['fahrzeugschein', 'schluesselfoto']);
    expect(PRUEFUNG.join(' ')).toMatch(/drei Fotos Ihres Schlüssels und der Fahrzeugschein/);
    // Die Seite zeigt den Ablauf aus den Rubrikdaten und führt keine zweite Liste im Code.
    const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
    expect(seite).toContain("getRubrik('customizing')");
    expect(seite).toMatch(/<RubrikAblaufAbschnitt\b/);
    expect(readFileSync(path.join(__dirname, 'texte.ts'), 'utf8')).not.toMatch(/export const PRUEFUNG\b/);
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

  it('„Umbau anfragen“ wählt die Leistung Umbau vor; der Behelfssatz ist entfallen (FA-SHOP-02C)', () => {
    const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');
    expect(seite).toContain("const UMBAU_ANFRAGE = anfrageAdresse('umbau');");
    expect(anfrageAdresse('umbau')).toBe('/autoschluessel/gehaeuse/anfrage?leistung=umbau');
    // Jeder Knopf „Umbau anfragen“, auch der im Ablauf, führt mit der Kennung in die Anfrage.
    const knoepfe = seite.match(/<ButtonLink href=\{(\w+)\}[^>]*>\s*Umbau anfragen/g) ?? [];
    expect(knoepfe.length).toBeGreaterThanOrEqual(2);
    for (const knopf of knoepfe) expect(knopf).toContain('href={UMBAU_ANFRAGE}');
    const ablauf = seite.slice(seite.indexOf('<RubrikAblaufAbschnitt'), seite.indexOf('cust-auswahl'));
    expect(ablauf).toContain('href={UMBAU_ANFRAGE}');
    expect(seite).not.toContain('GEHAEUSE_ANFRAGE_PFAD');
    expect(seite).not.toContain('ANFRAGE_LEISTUNG_NENNEN');
    expect(readFileSync(path.join(__dirname, 'texte.ts'), 'utf8')).not.toMatch(/export const ANFRAGE_LEISTUNG_NENNEN\b/);
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
