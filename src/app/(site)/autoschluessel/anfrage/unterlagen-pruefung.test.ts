import { describe, expect, it } from 'vitest';

import { schluesselfotosFreiwillig, unterlagenSchrittErfuellt, type DateienJeFeld } from './unterlagen-pruefung';

const DATEI = { name: 'foto.jpg' };

function dateien(belegt: Partial<Record<keyof DateienJeFeld, number>> = {}): DateienJeFeld {
  const feld = (anzahl = 0) => Array.from({ length: anzahl }, () => DATEI);
  return {
    vorderseite: feld(belegt.vorderseite),
    rueckseite: feld(belegt.rueckseite),
    bart: feld(belegt.bart),
    detail: feld(belegt.detail),
    fahrzeugschein: feld(belegt.fahrzeugschein),
  };
}

const ALLE_FOTOS = { vorderseite: 1, rueckseite: 1, bart: 1 };

describe('Unterlagen im Autoschlüssel-Assistenten', () => {
  it('macht Schlüsselfotos nur ohne funktionierenden Schlüssel freiwillig', () => {
    expect(schluesselfotosFreiwillig(0)).toBe(true);
    expect(schluesselfotosFreiwillig(1)).toBe(false);
    expect(schluesselfotosFreiwillig(2)).toBe(false);
    expect(schluesselfotosFreiwillig(null)).toBe(false);
  });

  it('lässt den Fotoschritt bei Totalverlust auch ohne Fotos zu', () => {
    const angaben = { workingKeys: 0, entitlementConfirmed: false };
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien())).toBe(true);
  });

  it('verlangt Vorderseite, Rückseite und Bart, solange ein Schlüssel funktioniert', () => {
    const angaben = { workingKeys: 1, entitlementConfirmed: true };
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien())).toBe(false);
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien({ vorderseite: 1, rueckseite: 1 }))).toBe(false);
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien(ALLE_FOTOS))).toBe(true);
    // Die Nahaufnahme bleibt freiwillig.
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien({ detail: 2 }))).toBe(false);
  });

  it('verlangt den Fahrzeugschein auch bei Totalverlust', () => {
    const angaben = { workingKeys: 0, entitlementConfirmed: true };
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien())).toBe(false);
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien({ fahrzeugschein: 1 }))).toBe(true);
  });

  it('verlangt die Bestätigung der Berechtigung zum Fahrzeugschein', () => {
    const angaben = { workingKeys: 0, entitlementConfirmed: false };
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien({ fahrzeugschein: 1 }))).toBe(false);
  });
});
