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
  // Regel des Inhabers (FA-KERN-02, A-048): Ausnahme nur bei ausdrücklich bestätigtem Totalverlust.
  it('macht Schlüsselfotos nur bei bestätigtem Totalverlust freiwillig', () => {
    expect(schluesselfotosFreiwillig(0, true)).toBe(true);
    // 0 funktionierende Schlüssel, aber ein defekter ist noch da: Fotos bleiben Pflicht.
    expect(schluesselfotosFreiwillig(0, false)).toBe(false);
    expect(schluesselfotosFreiwillig(1, true)).toBe(false);
    expect(schluesselfotosFreiwillig(2, false)).toBe(false);
    expect(schluesselfotosFreiwillig(null, true)).toBe(false);
  });

  it('lässt den Fotoschritt nur bei bestätigtem Totalverlust ohne Fotos zu', () => {
    expect(unterlagenSchrittErfuellt('schluesselfotos', { workingKeys: 0, keinSchluesselMehr: true, entitlementConfirmed: false }, dateien())).toBe(true);
    expect(unterlagenSchrittErfuellt('schluesselfotos', { workingKeys: 0, keinSchluesselMehr: false, entitlementConfirmed: false }, dateien())).toBe(false);
  });

  it('verlangt Vorderseite, Rückseite und Spitze, solange ein Schlüssel da ist', () => {
    const angaben = { workingKeys: 1, keinSchluesselMehr: false, entitlementConfirmed: true };
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien())).toBe(false);
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien({ vorderseite: 1, rueckseite: 1 }))).toBe(false);
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien(ALLE_FOTOS))).toBe(true);
    // Die Nahaufnahme bleibt freiwillig.
    expect(unterlagenSchrittErfuellt('schluesselfotos', angaben, dateien({ detail: 2 }))).toBe(false);
  });

  it('verlangt den Fahrzeugschein auch bei Totalverlust', () => {
    const angaben = { workingKeys: 0, keinSchluesselMehr: true, entitlementConfirmed: true };
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien())).toBe(false);
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien({ fahrzeugschein: 1 }))).toBe(true);
  });

  it('verlangt die Bestätigung der Berechtigung zum Fahrzeugschein', () => {
    const angaben = { workingKeys: 0, keinSchluesselMehr: true, entitlementConfirmed: false };
    expect(unterlagenSchrittErfuellt('fahrzeugschein', angaben, dateien({ fahrzeugschein: 1 }))).toBe(false);
  });
});
