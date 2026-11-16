import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { GEHAEUSE_LEISTUNGEN } from '../leistungen';
import { GEHAEUSE_ANFRAGE_PFAD } from '../teile/ansicht';
import {
  ANFRAGE_PFAD,
  LEISTUNG_LABEL,
  LEISTUNG_OPTIONEN,
  LEISTUNG_TEXT,
  LEISTUNG_WERTE,
  anfrageAdresse,
  gehaeuseLeistungSichern,
  leistungAusAdresse,
  leistungPruefen,
} from './leistung';

/* Gewünschte Leistung der Gehäuse-Anfrage (FA-SHOP-02C; FA-14-04, FA-14-05). Erfundene Testdaten (G4). */

describe('Werteliste', () => {
  it('drei Leistungen aus der Vorgabe und „unklar“, die Kennungen aus GEHAEUSE_LEISTUNGEN', () => {
    expect(LEISTUNG_WERTE).toEqual(['gehaeusetausch', 'reparatur', 'umbau', 'unklar']);
    expect(LEISTUNG_WERTE.slice(0, 3)).toEqual(GEHAEUSE_LEISTUNGEN.map((l) => l.kennung));
    expect(LEISTUNG_OPTIONEN.map((o) => o.wert)).toEqual(LEISTUNG_WERTE);
  });

  it('die Titel sind die Benennung der Vorgabe; der Ausweg heißt „Weiß ich noch nicht, bitte beraten“', () => {
    expect(LEISTUNG_OPTIONEN.slice(0, 3).map((o) => o.titel)).toEqual(GEHAEUSE_LEISTUNGEN.map((l) => l.titel));
    expect(LEISTUNG_OPTIONEN.at(-1)?.titel).toBe('Weiß ich noch nicht, bitte beraten');
    for (const wert of LEISTUNG_WERTE) expect(LEISTUNG_TEXT[wert].length, wert).toBeGreaterThan(0);
  });

  it('je Antwort ein kurzer Satz; kein Preis, keine Frist, kein Zahlungslink, keine Gedankenstriche (G9, A-036, R9)', () => {
    for (const option of LEISTUNG_OPTIONEN) {
      const texte = [option.titel, option.satz, LEISTUNG_TEXT[option.wert]];
      expect(option.satz.split(/[.!?]\s/).length, option.wert).toBe(1);
      expect(option.satz.length, option.wert).toBeLessThanOrEqual(90);
      for (const text of texte) {
        expect(text).not.toMatch(/€|\d+\s?(tage|werktage|stunden)|zahlungslink|kostenlos|garantiert|sofort/i);
        expect(text).not.toMatch(/[–—]| - /);
      }
    }
  });
});

describe('Vorbelegung aus der Adresse', () => {
  it('gültig: die drei Leistungen, ohne Rücksicht auf Groß- und Kleinschreibung', () => {
    expect(leistungAusAdresse('gehaeusetausch')).toBe('gehaeusetausch');
    expect(leistungAusAdresse('reparatur')).toBe('reparatur');
    expect(leistungAusAdresse('umbau')).toBe('umbau');
    expect(leistungAusAdresse(' Umbau ')).toBe('umbau');
  });

  it('ungültig oder fehlend: wird übergangen, auch „unklar“ (keine Leistung)', () => {
    for (const wert of ['testwert', 'unklar', '', 'umbau;reparatur', '<b>umbau</b>', null, undefined]) {
      expect(leistungAusAdresse(wert), String(wert)).toBe('');
    }
  });

  it('Verweise: mit Kennung nach ?leistung=, ohne Kennung die Adresse ohne Parameter', () => {
    expect(ANFRAGE_PFAD).toBe(GEHAEUSE_ANFRAGE_PFAD);
    expect(anfrageAdresse()).toBe('/autoschluessel/gehaeuse/anfrage');
    expect(anfrageAdresse('umbau')).toBe('/autoschluessel/gehaeuse/anfrage?leistung=umbau');
    for (const l of GEHAEUSE_LEISTUNGEN) {
      const adresse = new URL(anfrageAdresse(l.kennung), 'https://beispiel.test');
      expect(leistungAusAdresse(adresse.searchParams.get('leistung'))).toBe(l.kennung);
    }
  });
});

describe('Prüfung auf dem Server', () => {
  it('nimmt nur die vier Werte an; alles andere wird „unklar“', () => {
    for (const wert of LEISTUNG_WERTE) expect(leistungPruefen(wert)).toBe(wert);
    for (const wert of ['testwert', 'UMBAU', '', null, undefined, 3, ['umbau'], { umbau: true }]) {
      expect(leistungPruefen(wert), JSON.stringify(wert)).toBe('unklar');
    }
  });

  it('baut die Zeile der Zusammenfassung aus dem geprüften Wert, vor „Ihr Anliegen“', () => {
    const summary = [
      { title: 'Fahrzeug und Schlüssel', rows: [{ label: 'Marke', value: 'Testmarke' }, { label: LEISTUNG_LABEL, value: 'Testwunsch' }, { label: 'Ihr Anliegen', value: 'Testanliegen' }] },
      { title: 'Kontakt', rows: [{ label: LEISTUNG_LABEL, value: 'Noch ein Testwunsch' }, { label: 'Name', value: 'Test Person' }] },
    ];
    const ergebnis = gehaeuseLeistungSichern({ quelle: 'gehaeuse', leistung: 'testwert' }, summary);
    expect(ergebnis.payload).toEqual({ quelle: 'gehaeuse', leistung: 'unklar' });
    expect(ergebnis.summary[0].rows).toEqual([
      { label: 'Marke', value: 'Testmarke' },
      { label: LEISTUNG_LABEL, value: 'Noch offen, bitte beraten' },
      { label: 'Ihr Anliegen', value: 'Testanliegen' },
    ]);
    expect(ergebnis.summary[1].rows).toEqual([{ label: 'Name', value: 'Test Person' }]);
    // Eingabe unverändert (keine Seiteneffekte).
    expect(summary[0].rows[1].value).toBe('Testwunsch');

    const gut = gehaeuseLeistungSichern({ quelle: 'gehaeuse', leistung: 'reparatur' }, summary);
    expect(gut.payload.leistung).toBe('reparatur');
    expect(gut.summary[0].rows[1]).toEqual({ label: LEISTUNG_LABEL, value: 'Reparatur (Tasten, Mechanik)' });
  });

  it('ohne Zeile „Ihr Anliegen“ oder ohne Zusammenfassung steht die Angabe trotzdem im Vorgang', () => {
    expect(gehaeuseLeistungSichern({ leistung: 'umbau' }, [{ title: 'A', rows: [{ label: 'Marke', value: 'Testmarke' }] }]).summary).toEqual([
      { title: 'A', rows: [{ label: 'Marke', value: 'Testmarke' }, { label: LEISTUNG_LABEL, value: 'Umbau auf anderes Gehäuse (Customizing)' }] },
    ]);
    expect(gehaeuseLeistungSichern({ leistung: 'umbau' }, []).summary).toEqual([
      { title: 'Fahrzeug und Schlüssel', rows: [{ label: LEISTUNG_LABEL, value: 'Umbau auf anderes Gehäuse (Customizing)' }] },
    ]);
  });

  it('records.ts prüft die Leistung für den Weg gehaeuse; die Pflichtregel für Unterlagen bleibt unverändert (R13)', () => {
    const wurzel = path.resolve(__dirname, '../../../../../..');
    const records = readFileSync(path.join(wurzel, 'src/lib/actions/records.ts'), 'utf8');
    expect(records).toMatch(/if \(weg === 'gehaeuse'\) \{\s*\(\{ payload, summary \} = gehaeuseLeistungSichern\(payload, summary\)\);/);
    expect(readFileSync(path.join(wurzel, 'src/lib/server/unterlagen-pflicht.ts'), 'utf8')).not.toMatch(/leistung/i);
  });
});

describe('Formular', () => {
  const formular = readFileSync(path.join(__dirname, 'anfrage-formular.tsx'), 'utf8');
  const seite = readFileSync(path.join(__dirname, 'page.tsx'), 'utf8');

  it('liest die Adresse unter einer Suspense-Grenze, die Seite bleibt ohne searchParams (statisch)', () => {
    expect(formular).toMatch(/<Suspense fallback=\{<GehaeuseFormular[^>]*vorbelegung=""/);
    expect(formular).toContain('useSearchParams().get(LEISTUNG_PARAMETER)');
    expect(seite).not.toMatch(/searchParams/);
    expect(seite).toContain('canonical: `/${ROUTE}`');
  });

  it('die Frage steht im ersten Schritt, die Zahl der Schritte bleibt fünf', () => {
    expect(formular).toContain('Was sollen wir für Sie tun?');
    expect(formular.match(/\{ id: '[a-z]+', title:/g)).toHaveLength(5);
    const fahrzeugSchritt = formular.slice(formular.indexOf("flow.step?.id === 'fahrzeug'"), formular.indexOf("flow.step?.id === 'tasten' &&"));
    expect(fahrzeugSchritt).toContain('LEISTUNG_OPTIONEN.map');
    expect(fahrzeugSchritt).toMatch(/<fieldset[\s\S]*<legend/);
  });
});
