import { describe, expect, it } from 'vitest';

import { LIEFERLAND } from '@/lib/kasse';

import { INITIAL, baujahrGueltig, gehaeuseZusammenfassung, kontaktAus, mitVorbelegung, payloadAus, schrittGueltig, type GehaeuseDaten } from './kern';

/* Jahr fest vorgegeben, damit die Grenze 2027 unabhängig vom Testdatum gilt. */
const JAHR = 2026;

const GUELTIG: GehaeuseDaten = {
  ...INITIAL,
  leistung: 'umbau',
  marke: 'Volkswagen',
  modell: 'Golf VII',
  baujahr: '2019',
  tasten: '3-4',
  vorname: 'Anna',
  nachname: 'Beispiel',
  email: 'anna@example.com',
  telefon: '06441 123456',
  plz: '35576',
  ort: 'Wetzlar',
  beschreibung: 'Zweitschlüssel gewünscht, Testangabe.',
};

describe('schrittGueltig', () => {
  it('prüft den Schritt Fahrzeug', () => {
    expect(schrittGueltig(GUELTIG, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, marke: '  ' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, marke: 'M'.repeat(61) }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, modell: 'M'.repeat(81) }, 'fahrzeug', JAHR)).toBe(false);
  });

  it('prüft das Baujahr: vier Ziffern, 1990 bis laufendes Jahr plus 1', () => {
    expect(schrittGueltig({ ...GUELTIG, baujahr: '1989' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '1998' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2022' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2027' }, 'fahrzeug', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '2028' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '19a0' }, 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, baujahr: '' }, 'fahrzeug', JAHR)).toBe(false);
    expect(baujahrGueltig('1990', JAHR)).toBe(true);
  });

  it('verlangt im Schritt Fahrzeug eine Antwort auf „Was sollen wir für Sie tun?“, „unklar“ ist gültig (FA-SHOP-02C)', () => {
    expect(schrittGueltig({ ...GUELTIG, leistung: '' }, 'fahrzeug', JAHR)).toBe(false);
    for (const leistung of ['gehaeusetausch', 'reparatur', 'umbau', 'unklar'] as const) {
      expect(schrittGueltig({ ...GUELTIG, leistung }, 'fahrzeug', JAHR), leistung).toBe(true);
    }
    // Ein erfundener Wert aus einem manipulierten Zwischenstand gilt nicht als Antwort.
    expect(schrittGueltig({ ...GUELTIG, leistung: 'testwert' as GehaeuseDaten['leistung'] }, 'fahrzeug', JAHR)).toBe(false);
    // Die Frage steht im ersten Schritt, die übrigen Schritte prüfen sie nicht.
    expect(schrittGueltig({ ...GUELTIG, leistung: '' }, 'tasten', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, leistung: '' }, 'kontakt', JAHR)).toBe(true);
  });

  it('verlangt eine Antwort auf die Pflichtfrage Tasten', () => {
    expect(schrittGueltig({ ...GUELTIG, tasten: '' }, 'tasten')).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, tasten: '1-2' }, 'tasten')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, tasten: '3-4' }, 'tasten')).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, tasten: 'unklar' }, 'tasten')).toBe(true);
  });

  it('lässt die Fotos dem Formular, der Schritt Unterlagen ist hier immer gültig', () => {
    expect(schrittGueltig({ ...INITIAL }, 'unterlagen', JAHR)).toBe(true);
    expect(schrittGueltig({ ...INITIAL, leistung: 'unklar' }, 'absenden', JAHR)).toBe(true);
  });

  it('sperrt das Absenden ohne gewünschte Leistung, auch bei einem alten Zwischenstand hinter Schritt 1 (FA-SHOP-02C)', () => {
    // Zwischenstand von vor FA-SHOP-02C (Version 1, Schritt absenden, ohne Feld leistung), so zusammengesetzt wie
    // in useFlow: Startwerte, darüber die gespeicherten Angaben.
    const gespeichert: Partial<GehaeuseDaten> = { ...GUELTIG };
    delete gespeichert.leistung;
    const alterStand: GehaeuseDaten = { ...INITIAL, ...gespeichert };
    expect(schrittGueltig(alterStand, 'kontakt', JAHR)).toBe(true);
    expect(schrittGueltig(alterStand, 'absenden', JAHR)).toBe(false);
    expect(schrittGueltig({ ...alterStand, leistung: 'testwert' as GehaeuseDaten['leistung'] }, 'absenden', JAHR)).toBe(false);
    // Die Vorbelegung aus der Adresse zählt als Antwort; ebenso jede eigene Wahl.
    expect(schrittGueltig(mitVorbelegung(alterStand, 'umbau'), 'absenden', JAHR)).toBe(true);
    for (const leistung of ['gehaeusetausch', 'reparatur', 'umbau', 'unklar'] as const) {
      expect(schrittGueltig({ ...alterStand, leistung }, 'absenden', JAHR), leistung).toBe(true);
    }
  });

  it('prüft den Kontakt: Namen, E-Mail, Telefon, Postleitzahl', () => {
    expect(schrittGueltig(GUELTIG, 'kontakt', JAHR)).toBe(true);
    expect(schrittGueltig({ ...GUELTIG, vorname: 'A' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, nachname: '' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, email: 'anna@' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, telefon: '12' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, plz: '3557' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, plz: '', ort: '' }, 'kontakt', JAHR)).toBe(true);
  });

  it('verlangt im Schritt Kontakt eine kurze Beschreibung des Anliegens (FA-KERN-02)', () => {
    expect(schrittGueltig({ ...GUELTIG, beschreibung: '' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, beschreibung: 'Zu kurz' }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, beschreibung: ' '.repeat(30) }, 'kontakt', JAHR)).toBe(false);
    expect(schrittGueltig({ ...GUELTIG, beschreibung: 'x'.repeat(20) }, 'kontakt', JAHR)).toBe(true);
  });
});

describe('gehaeuseZusammenfassung', () => {
  it('trägt Fahrzeug und Schlüssel sowie Kontakt ein', () => {
    const teile = gehaeuseZusammenfassung(GUELTIG);
    expect(teile.map((teil) => teil.title)).toEqual(['Fahrzeug und Schlüssel', 'Kontakt']);
    expect(teile[0].rows.find((z) => z.label === 'Marke')?.value).toBe('Volkswagen');
    expect(teile[0].rows.find((z) => z.label === 'Tasten am Schlüssel')?.value).toBe('3 oder 4 Tasten');
    expect(teile[1].rows.find((z) => z.label === 'Name')?.value).toBe('Anna Beispiel');
    expect(teile[1].rows.find((z) => z.label === 'Anschrift')?.value).toBe('35576 Wetzlar');
  });

  it('zeigt „Gewünschte Leistung“ direkt vor „Ihr Anliegen“ (FA-SHOP-02C)', () => {
    const zeilen = gehaeuseZusammenfassung(GUELTIG)[0].rows;
    const labels = zeilen.map((z) => z.label);
    expect(labels.indexOf('Gewünschte Leistung')).toBe(labels.indexOf('Ihr Anliegen') - 1);
    const wert = (leistung: GehaeuseDaten['leistung']) =>
      gehaeuseZusammenfassung({ ...GUELTIG, leistung })[0].rows.find((z) => z.label === 'Gewünschte Leistung')?.value;
    expect(wert('gehaeusetausch')).toBe('Gehäusetausch im Einsendeservice');
    expect(wert('reparatur')).toBe('Reparatur (Tasten, Mechanik)');
    expect(wert('umbau')).toBe('Umbau auf anderes Gehäuse (Customizing)');
    expect(wert('unklar')).toBe('Noch offen, bitte beraten');
    expect(wert('')).toBe('noch offen');
    expect(wert('testwert' as GehaeuseDaten['leistung'])).toBe('noch offen');
  });

  it('nennt die Tastenzahl und unklar mit dem passenden Text', () => {
    const wert = (tasten: GehaeuseDaten['tasten']) =>
      gehaeuseZusammenfassung({ ...GUELTIG, tasten })[0].rows.find((z) => z.label === 'Tasten am Schlüssel')?.value;
    expect(wert('1-2')).toBe('1 oder 2 Tasten');
    expect(wert('unklar')).toBe('unklar, bitte prüfen');
    expect(wert('')).toBe('noch offen');
  });
});

describe('Nutzlast des Vorgangs', () => {
  it('trägt die Quelle gehaeuse, die Angaben und den Kontakt ins Lieferland', () => {
    expect(payloadAus(GUELTIG)).toEqual({
      quelle: 'gehaeuse',
      marke: 'Volkswagen',
      modell: 'Golf VII',
      baujahr: 2019,
      tasten: '3-4',
      leistung: 'umbau',
      beschreibung: 'Zweitschlüssel gewünscht, Testangabe.',
    });
    // Ohne Antwort macht der Browser keine Antwort daraus: leer, erst der Server setzt „unklar“.
    expect(payloadAus({ ...GUELTIG, leistung: '' }).leistung).toBe('');
    expect(payloadAus({ ...GUELTIG, leistung: 'testwert' as GehaeuseDaten['leistung'] }).leistung).toBe('');
    expect(payloadAus({ ...GUELTIG, leistung: 'unklar' }).leistung).toBe('unklar');
    expect(kontaktAus(GUELTIG).country).toBe(LIEFERLAND);
    expect(kontaktAus(GUELTIG).firstName).toBe('Anna');
  });
});

describe('Vorbelegung aus der Adresse (FA-SHOP-02C)', () => {
  it('füllt nur eine leere Antwort; die eigene Wahl des Kunden bleibt', () => {
    expect(mitVorbelegung({ ...GUELTIG, leistung: '' }, 'reparatur').leistung).toBe('reparatur');
    expect(mitVorbelegung({ ...GUELTIG, leistung: 'unklar' }, 'reparatur').leistung).toBe('unklar');
    expect(mitVorbelegung({ ...GUELTIG, leistung: 'umbau' }, 'gehaeusetausch').leistung).toBe('umbau');
  });

  it('ohne Vorbelegung bleibt die Frage offen und der Schritt gesperrt', () => {
    const leer = { ...GUELTIG, leistung: '' as const };
    expect(mitVorbelegung(leer, '')).toBe(leer);
    expect(schrittGueltig(mitVorbelegung(leer, ''), 'fahrzeug', JAHR)).toBe(false);
    expect(schrittGueltig(mitVorbelegung(leer, 'umbau'), 'fahrzeug', JAHR)).toBe(true);
  });
});
