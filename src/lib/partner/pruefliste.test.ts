import { describe, expect, it } from 'vitest';

import { MELDUNG_OHNE_SPERRGRUND, fehltFuerFreischaltung, sperreBeimWechsel, statuswechselPruefen } from './bewerbung';
import {
  PRUEFLISTE_MELDUNG,
  VOR_EINFUEHRUNG_TEXT,
  besuchErledigt,
  prueflisteFehlt,
  prueflisteSpeichernPruefen,
  prueflisteStandText,
  prueflisteZusammenfuehren,
  type Pruefliste,
} from './pruefliste';

/* FA-PLATTFORM-01B: Prüfliste vor der Freischaltung, Besuch vor Ort, Pausieren und Sperren mit Grund.
 * Erfundene Angaben (G4). */

const PUNKT = { erledigt: true, am: '2026-11-10T00:00:00.000Z', pruefer: 'Prüferin Test' };
const VOLL: Pruefliste = {
  identitaet: PUNKT,
  leistungsumfang: PUNKT,
  ausstattung: PUNKT,
  region: PUNKT,
  besuch: { am: '2026-11-11T00:00:00.000Z', pruefer: 'Prüfer Test', ergebnis: 'geeignet' },
  standard: { ...PUNKT, vertragsverweis: 'Partnervertrag, Anlage Qualität' },
};
const GEPRUEFT = { gewerbeGeprueft: true, identitaetGeprueft: true, eignungGeprueft: true, vertragUnterschrieben: true };

describe('Prüfliste vor der Freischaltung', () => {
  it('lehnt die Freischaltung ohne Prüfliste ab und nennt jeden fehlenden Punkt', () => {
    const meldung = statuswechselPruefen('vertrag-unterschrieben', 'freigeschaltet', GEPRUEFT);
    expect(meldung).toContain('Vor der Freischaltung fehlt');
    for (const punkt of ['Identität und Betrieb', 'Leistungsumfang und Fahrzeugabdeckung', 'Maschinen, Programmiergeräte, Werkstatt', 'Region und Radius', 'Besuch vor Ort', 'Qualitätsstandard schriftlich']) {
      expect(meldung).toContain(punkt);
    }
    expect(statuswechselPruefen('vertrag-unterschrieben', 'freigeschaltet', { ...GEPRUEFT, pruefliste: VOLL })).toBeNull();
  });

  it('verlangt je Punkt Haken, Datum und Prüfer', () => {
    expect(prueflisteFehlt({ ...VOLL, region: { erledigt: true, am: '2026-11-10T00:00:00.000Z', pruefer: ' ' } })).toEqual(['Prüfliste: Region und Radius']);
    expect(prueflisteFehlt({ ...VOLL, identitaet: { erledigt: false, am: PUNKT.am, pruefer: PUNKT.pruefer } })).toEqual(['Prüfliste: Identität und Betrieb']);
  });

  it('verlangt für den Qualitätsstandard eine Datei oder einen Vertragsverweis', () => {
    expect(prueflisteFehlt({ ...VOLL, standard: PUNKT })).toEqual(['Prüfliste: Qualitätsstandard schriftlich (Datei oder Vertragsverweis)']);
    expect(prueflisteFehlt({ ...VOLL, standard: { ...PUNKT, datei: 12 } })).toEqual([]);
  });

  it('lässt „Besuch nicht möglich“ nur mit Grund gelten', () => {
    const ohneGrund: Pruefliste = { ...VOLL, besuch: { nichtMoeglich: true, nichtMoeglichGrund: '  ' } };
    expect(prueflisteSpeichernPruefen(ohneGrund)).toBe(PRUEFLISTE_MELDUNG.besuchOhneGrund);
    expect(besuchErledigt(ohneGrund.besuch)).toBe(false);
    expect(prueflisteFehlt(ohneGrund)).toEqual(['Prüfliste: Besuch vor Ort (oder „Besuch nicht möglich“ mit Grund)']);
    const mitGrund: Pruefliste = { ...VOLL, besuch: { nichtMoeglich: true, nichtMoeglichGrund: 'Betrieb liegt auf einer Insel, Besuch erst im Frühjahr.' } };
    expect(prueflisteSpeichernPruefen(mitGrund)).toBeNull();
    expect(prueflisteFehlt(mitGrund)).toEqual([]);
  });

  it('schaltet nach einem Besuch mit Ergebnis „nicht geeignet“ nicht frei', () => {
    const liste: Pruefliste = { ...VOLL, besuch: { ...VOLL.besuch, ergebnis: 'nicht-geeignet' } };
    expect(prueflisteFehlt(liste)).toEqual(['Prüfliste: Besuch vor Ort mit Ergebnis „geeignet“']);
    expect(prueflisteFehlt({ ...VOLL, besuch: { ...VOLL.besuch, ergebnis: 'auflagen' } })).toEqual([]);
  });

  it('lässt Betriebe aus der Zeit davor freigeschaltet, nach einer Sperre gilt die volle Prüfliste', () => {
    const alt: Pruefliste = { vorEinfuehrung: true };
    expect(fehltFuerFreischaltung({ ...GEPRUEFT, pruefliste: alt })).toEqual([]);
    expect(statuswechselPruefen('freigeschaltet', 'freigeschaltet', { ...GEPRUEFT, pruefliste: alt })).toBeNull();
    expect(statuswechselPruefen('pausiert', 'freigeschaltet', { ...GEPRUEFT, pruefliste: alt })).toBeNull();
    expect(statuswechselPruefen('gesperrt', 'freigeschaltet', { ...GEPRUEFT, pruefliste: alt })).toContain('Prüfliste');
    expect(prueflisteStandText(alt, 'freigeschaltet')).toContain(VOR_EINFUEHRUNG_TEXT.slice(1));
  });

  it('setzt beim Abhaken Datum und Prüfer, wenn sie fehlen, und übernimmt den Altvermerk nie aus der Eingabe', () => {
    const k = { jetzt: '2026-11-16T09:00:00.000Z', bearbeiter: 'Mina Saad' };
    const neu = prueflisteZusammenfuehren({ identitaet: { erledigt: true }, vorEinfuehrung: true }, { region: { notiz: 'Radius 30 km' } }, k);
    expect(neu.identitaet).toMatchObject({ erledigt: true, am: k.jetzt, pruefer: 'Mina Saad' });
    expect(neu.region?.notiz).toBe('Radius 30 km');
    expect(neu.vorEinfuehrung).toBe(false);
    // Bereits abgehakt: Datum und Prüfer bleiben, wie das Team sie eingetragen hat.
    const weiter = prueflisteZusammenfuehren({ identitaet: { notiz: 'Ausweis gesehen' } }, { identitaet: { erledigt: true, am: '2026-11-01T00:00:00.000Z', pruefer: 'Inhaber' } }, k);
    expect(weiter.identitaet).toMatchObject({ am: '2026-11-01T00:00:00.000Z', pruefer: 'Inhaber', notiz: 'Ausweis gesehen' });
    expect(prueflisteZusammenfuehren({}, { vorEinfuehrung: true }, k).vorEinfuehrung).toBe(true);
  });
});

describe('Pausieren und Sperren (FA-07-19)', () => {
  it('verlangt einen Grund für „pausiert“ und „gesperrt“', () => {
    expect(statuswechselPruefen('freigeschaltet', 'pausiert', {})).toBe(MELDUNG_OHNE_SPERRGRUND);
    expect(statuswechselPruefen('freigeschaltet', 'gesperrt', { sperrGrund: ' ' })).toBe(MELDUNG_OHNE_SPERRGRUND);
    expect(statuswechselPruefen('freigeschaltet', 'gesperrt', { sperrGrund: 'Beschwerde wegen beschädigtem Schloss' })).toBeNull();
    expect(statuswechselPruefen('freigeschaltet', 'beendet', {})).toBeNull();
  });

  it('hält Datum und Bearbeiter fest und schreibt die Sperre beim Aufheben in die Notiz', () => {
    const k = { jetzt: '2026-11-16T09:00:00.000Z', bearbeiter: 'Mina Saad' };
    const gesperrt = sperreBeimWechsel('freigeschaltet', 'gesperrt', { grund: ' Qualitätsproblem ' }, k);
    expect(gesperrt.sperre).toEqual({ grund: 'Qualitätsproblem', seit: k.jetzt, von: 'Mina Saad' });
    const aufgehoben = sperreBeimWechsel('gesperrt', 'freigeschaltet', gesperrt.sperre, { jetzt: '2026-11-20T09:00:00.000Z', bearbeiter: 'Inhaber' });
    expect(aufgehoben.sperre).toEqual({ grund: null, seit: null, von: null });
    expect(aufgehoben.notizZeile).toBe('Gesperrt seit 2026-11-16 (Mina Saad): Qualitätsproblem. Aufgehoben am 2026-11-20 (Inhaber).');
    expect(sperreBeimWechsel('freigeschaltet', 'freigeschaltet', { grund: 'x' }, k).sperre).toEqual({ grund: 'x' });
  });
});
