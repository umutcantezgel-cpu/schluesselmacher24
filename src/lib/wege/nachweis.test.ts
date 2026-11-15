import { describe, expect, it } from 'vitest';

import { defaults } from '../data/defaults';
import {
  KARTEN_ANTWORTEN,
  KARTEN_LABEL,
  SCHLUESSEL_STECKPLAETZE,
  STECKPLATZ_LABEL,
  UPLOAD_STECKPLAETZE,
  codeFotoKategorie,
  codeVerlangtKarte,
  dateiBezeichnung,
  fotoAnfrageVerlangtKarte,
  kartenAntwort,
  steckplatzPasst,
} from './nachweis';

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

describe('Steckplätze der Kundendateien (FA-KERN-02, A-048)', () => {
  it('kennt genau die acht Steckplätze mit Beschriftung', () => {
    expect([...UPLOAD_STECKPLAETZE]).toEqual([
      'fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze', 'ersatznachweis', 'typenschild', 'sicherungskarte', 'sonstiges',
    ]);
    expect([...SCHLUESSEL_STECKPLAETZE]).toEqual(['schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze']);
    for (const platz of UPLOAD_STECKPLAETZE) expect(STECKPLATZ_LABEL[platz].length).toBeGreaterThan(3);
  });

  it('lässt den Fahrzeugschein-Steckplatz nur für die Kategorie Fahrzeugschein zu (R13)', () => {
    expect(steckplatzPasst('fahrzeugschein', 'fahrzeugschein')).toBe(true);
    expect(steckplatzPasst('dokument', 'fahrzeugschein')).toBe(false);
    expect(steckplatzPasst('schluesselfoto', 'fahrzeugschein')).toBe(false);
    expect(steckplatzPasst('fahrzeugschein', 'ersatznachweis')).toBe(false);
    expect(steckplatzPasst('dokument', 'ersatznachweis')).toBe(true);
    expect(steckplatzPasst('schluesselfoto', 'schluessel-spitze')).toBe(true);
    expect(steckplatzPasst('fahrzeugschein', 'schluessel-spitze')).toBe(false);
    expect(steckplatzPasst('grundriss', 'sonstiges')).toBe(true);
    expect(steckplatzPasst('grundriss', undefined)).toBe(true);
  });

  it('beschriftet Dateien mit Steckplatz, ältere mit ihrer Art', () => {
    const art = { schluesselfoto: 'Schlüsselfoto' };
    expect(dateiBezeichnung({ category: 'schluesselfoto', steckplatz: 'schluessel-rueckseite' }, art)).toBe('Schlüssel Rückseite');
    expect(dateiBezeichnung({ category: 'schluesselfoto', steckplatz: 'sonstiges' }, art)).toBe('Schlüsselfoto (Sonstiges)');
    expect(dateiBezeichnung({ category: 'schluesselfoto' }, art)).toBe('Schlüsselfoto');
  });
});
