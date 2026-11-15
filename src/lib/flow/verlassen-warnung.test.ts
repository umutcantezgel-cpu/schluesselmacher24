import { describe, expect, it } from 'vitest';

import {
  VERLASSEN_FRAGE,
  VERLASSEN_FRAGE_UNGESPEICHERT,
  istWache,
  verlassenFrage,
  wacheEinrichten,
  type WachFenster,
} from './verlassen-warnung';

/** Nachbau eines Fensters mit Historie und Ereignissen (FA-QA-02: Browser-Zurück ohne Datenverlust). */
function fenster(antwort: boolean, echtesZurueck = false) {
  const eintraege: unknown[] = [{ __NA: true }];
  const hoerer: Record<string, Array<(event: never) => void>> = { beforeunload: [], popstate: [] };
  const fragen: string[] = [];
  let zurueckGerufen = 0;
  const f: WachFenster = {
    history: {
      get state() {
        return eintraege[eintraege.length - 1];
      },
      pushState: (data) => {
        eintraege.push(data);
      },
      back: () => {
        zurueckGerufen += 1;
        if (echtesZurueck) browserZurueck();
      },
    },
    location: { href: 'https://beispiel.test/anfrage' },
    addEventListener: (typ, fn) => hoerer[typ].push(fn),
    removeEventListener: (typ, fn) => {
      hoerer[typ] = hoerer[typ].filter((h) => h !== fn);
    },
    confirm: (frage) => {
      fragen.push(frage);
      return antwort;
    },
  };
  /** Browser-Zurück: oberster Eintrag weg, popstate mit dem darunter. */
  const browserZurueck = () => {
    eintraege.pop();
    for (const h of [...hoerer.popstate]) (h as (e: { state: unknown }) => void)({ state: eintraege[eintraege.length - 1] });
  };
  return { f, eintraege, hoerer, fragen, browserZurueck, zurueck: () => zurueckGerufen };
}

describe('Warnung vor dem Verlassen (FA-QA-02)', () => {
  it('legt eine Wache in die Historie und fragt beim Neuladen nach', () => {
    const t = fenster(false);
    wacheEinrichten(t.f);
    expect(t.eintraege).toHaveLength(2);
    expect(istWache(t.f.history.state)).toBe(true);
    expect(t.hoerer.beforeunload).toHaveLength(1);
    const ereignis = { preventDefault: () => {}, returnValue: undefined as unknown };
    (t.hoerer.beforeunload[0] as (e: typeof ereignis) => void)(ereignis);
    expect(ereignis.returnValue).toBe('');
  });

  it('Browser-Zurück verlässt das Formular nicht ohne Frage; „Abbrechen“ legt die Wache neu', () => {
    const t = fenster(false);
    wacheEinrichten(t.f);
    t.browserZurueck();
    expect(t.fragen).toEqual([VERLASSEN_FRAGE]);
    expect(t.zurueck()).toBe(0);
    expect(istWache(t.f.history.state)).toBe(true);
  });

  it('„OK“ verlässt die Seite und räumt die Warnung ab', () => {
    const t = fenster(true);
    wacheEinrichten(t.f);
    t.browserZurueck();
    expect(t.zurueck()).toBe(1);
    expect(t.hoerer.beforeunload).toHaveLength(0);
    expect(t.hoerer.popstate).toHaveLength(0);
  });

  it('legt keine zweite Wache, wenn schon eine oben liegt, und räumt beim Ende auf', () => {
    const t = fenster(false);
    const ende1 = wacheEinrichten(t.f);
    ende1();
    wacheEinrichten(t.f);
    expect(t.eintraege).toHaveLength(2);
  });

  it('nimmt die Wache weg, wenn die Warnung ohne Verlassen endet; das nächste Zurück wirkt sofort', () => {
    const t = fenster(false, true);
    const ende = wacheEinrichten(t.f);
    expect(t.eintraege).toHaveLength(2);
    ende();
    expect(t.zurueck()).toBe(1);
    expect(t.eintraege).toHaveLength(1);
    expect(istWache(t.f.history.state)).toBe(false);
    // Das popstate der Rücknahme gilt nicht als Verlassen, und kein Hörer bleibt zurück.
    expect(t.fragen).toEqual([]);
    expect(t.hoerer.popstate).toHaveLength(0);
    expect(t.hoerer.beforeunload).toHaveLength(0);
  });

  it('neue Warnung, bevor die Rücknahme ankommt (zweiter Effektlauf): keine Frage, die Wache bleibt', () => {
    const t = fenster(false);
    const ende = wacheEinrichten(t.f);
    ende();
    wacheEinrichten(t.f);
    // Jetzt kommt das Zurück der Rücknahme an.
    t.browserZurueck();
    expect(t.fragen).toEqual([]);
    expect(istWache(t.f.history.state)).toBe(true);
    expect(t.hoerer.popstate).toHaveLength(1);
    // Ein echtes Zurück danach fragt wieder.
    t.browserZurueck();
    expect(t.fragen).toEqual([VERLASSEN_FRAGE]);
  });

  it('nach „OK“ nimmt das Aufräumen keine weitere Wache weg', () => {
    const t = fenster(true);
    const ende = wacheEinrichten(t.f);
    t.browserZurueck();
    ende();
    expect(t.zurueck()).toBe(1);
  });

  it('fragt mit dem Text, den der Grund gerade verlangt', () => {
    const t = fenster(false);
    let frage = VERLASSEN_FRAGE;
    wacheEinrichten(t.f, () => frage);
    frage = VERLASSEN_FRAGE_UNGESPEICHERT;
    t.browserZurueck();
    expect(t.fragen).toEqual([VERLASSEN_FRAGE_UNGESPEICHERT]);
  });

  it('wählt die Frage nach dem Grund: nicht gespeichert vor Dateien, ohne Grund keine', () => {
    expect(verlassenFrage({ dateien: false, ungespeichert: false })).toBeNull();
    expect(verlassenFrage({ dateien: true, ungespeichert: false })).toBe(VERLASSEN_FRAGE);
    // Ohne Dateien, aber ohne gespeicherten Stand: kein Wort von Dateien und keine Zusage, dass etwas bleibt.
    const ohneSpeicher = verlassenFrage({ dateien: false, ungespeichert: true });
    expect(ohneSpeicher).toBe(VERLASSEN_FRAGE_UNGESPEICHERT);
    expect(ohneSpeicher).not.toContain('Dateien');
    expect(ohneSpeicher).not.toContain('bleiben');
    expect(ohneSpeicher).toContain('nicht gespeichert');
    expect(verlassenFrage({ dateien: true, ungespeichert: true })).toBe(VERLASSEN_FRAGE_UNGESPEICHERT);
    expect(VERLASSEN_FRAGE_UNGESPEICHERT).not.toMatch(/[–—]/);
  });

  it('die Frage sagt, was verloren geht und was bleibt, ohne Gedankenstrich', () => {
    expect(VERLASSEN_FRAGE).toContain('Dateien verloren');
    expect(VERLASSEN_FRAGE).toContain('übrigen Angaben bleiben');
    expect(VERLASSEN_FRAGE).not.toMatch(/[–—]/);
  });
});
