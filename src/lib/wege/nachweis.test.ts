import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import { KARTEN_ANTWORTEN, KARTEN_LABEL, codeFotoKategorie, codeVerlangtKarte, fotoAnfrageVerlangtKarte, kartenAntwort } from './nachweis';

describe('Berechtigungsnachweis in den Schlüsselwegen (R13, E6-OPUS-01)', () => {
  it('macht das Pflichtfoto einer Codelinie zur Sicherungskarte und lässt freiwillige Fotos Schlüsselfotos', () => {
    expect(codeFotoKategorie({ photoUpload: 'pflicht' })).toBe('sicherungskarte');
    expect(codeFotoKategorie({ photoUpload: 'optional' })).toBe('schluesselfoto');
    expect(codeFotoKategorie({ photoUpload: 'nein' })).toBe('schluesselfoto');
    const geschuetzt = defaults.codeLines().filter(codeVerlangtKarte).map((l) => l.id);
    expect(geschuetzt).toEqual(['zy-02']);
  });

  it('verlangt die Karte in der Foto-Anfrage nur bei „ja“ und liest nur bekannte Antworten', () => {
    expect(fotoAnfrageVerlangtKarte({ sicherungskarte: 'ja' })).toBe(true);
    expect(fotoAnfrageVerlangtKarte({ sicherungskarte: 'nein' })).toBe(false);
    expect(fotoAnfrageVerlangtKarte({})).toBe(false);
    expect(kartenAntwort('unklar')).toBe('unklar');
    expect(kartenAntwort('JA')).toBe('');
    expect(kartenAntwort(undefined)).toBe('');
  });

  it('hat für jede Antwort einen Text im Formular und in der Zusammenfassung, ohne Gedankenstriche', () => {
    expect(KARTEN_ANTWORTEN.map((a) => a.wert)).toEqual(['ja', 'nein', 'unklar']);
    for (const a of KARTEN_ANTWORTEN) {
      expect(KARTEN_LABEL[a.wert]).toBeTruthy();
      expect(`${a.titel} ${a.satz} ${KARTEN_LABEL[a.wert]}`).not.toMatch(/[–—!]/);
    }
  });
});
