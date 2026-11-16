import { describe, expect, it } from 'vitest';

import {
  ABLAUF,
  SchrittHistorie,
  aufRelevant,
  eintragAus,
  popstateEntscheiden,
  rueckwegDelta,
  type HistorienFenster,
} from './schritt-historie';
import { VERLASSEN_FRAGE, istWache, wacheEinrichten, type WachFenster } from './verlassen-warnung';

/*
 * FA-QA-04B (FA Abschnitt 26: „Zurückfunktion ohne Datenverlust“, „Mobile Bedienung besonders intensiv
 * testen“): Formularschritte in der Browser-Historie. Ein Nachbau des Browsers mit Einträgen, Index und
 * popstate; Sprünge (`go`, `back`) laufen wie im Browser erst im nächsten Arbeitsschritt (`fliessen`).
 */

type Hoerer = (event: never) => void;

function browser(antwort = false) {
  // Vorige Seite und die Seite mit dem Formular.
  let eintraege: unknown[] = [{ __NA: true, seite: 'vorher' }, { __NA: true, seite: 'formular' }];
  let index = 1;
  const warteschlange: number[] = [];
  const hoerer: Record<string, Hoerer[]> = { beforeunload: [], popstate: [] };
  const fragen: string[] = [];
  const pushAufrufe: unknown[][] = [];
  const zeit = { jetzt: 0 };
  const f = {
    history: {
      get state() {
        return eintraege[index];
      },
      pushState: (...args: unknown[]) => {
        pushAufrufe.push(args);
        eintraege = [...eintraege.slice(0, index + 1), args[0]];
        index += 1;
      },
      replaceState: (...args: unknown[]) => {
        eintraege[index] = args[0];
      },
      go: (delta: number) => {
        warteschlange.push(delta);
      },
      back: () => {
        warteschlange.push(-1);
      },
    },
    location: { href: 'https://beispiel.test/anfrage' },
    addEventListener: (typ: string, fn: Hoerer) => {
      hoerer[typ].push(fn);
    },
    removeEventListener: (typ: string, fn: Hoerer) => {
      hoerer[typ] = hoerer[typ].filter((h) => h !== fn);
    },
    confirm: (frage: string) => {
      fragen.push(frage);
      return antwort;
    },
  };
  /** Führt anstehende Sprünge aus, wie der Browser im nächsten Arbeitsschritt. */
  const fliessen = () => {
    while (warteschlange.length > 0) {
      const delta = warteschlange.shift() as number;
      const ziel = Math.min(eintraege.length - 1, Math.max(0, index + delta));
      if (ziel === index) continue;
      index = ziel;
      for (const h of [...hoerer.popstate]) (h as (e: { state: unknown }) => void)({ state: eintraege[index] });
    }
  };
  return {
    f,
    fenster: f as unknown as HistorienFenster,
    wachFenster: f as unknown as WachFenster,
    fragen,
    pushAufrufe,
    zeit,
    hoerer,
    fliessen,
    /** Browser- oder Android-Zurück. */
    zurueck: () => {
      f.history.go(-1);
      fliessen();
    },
    vorwaerts: (n = 1) => {
      f.history.go(n);
      fliessen();
    },
    index: () => index,
    anzahl: () => eintraege.length,
    verlassen: () => index === 0,
  };
}

const SCHRITTE = ['fahrzeug', 'schluessel', 'unterlagen', 'kontakt', 'absenden'];

/**
 * Nachbau von `useFlow` und FlowShell: dieselben Aufrufe in derselben Reihenfolge (Wechsel, popstate,
 * Abgleich nach dem Rendern, Wache am Anfang des Ablaufs).
 */
function ablauf(
  b: ReturnType<typeof browser>,
  {
    start = SCHRITTE[0],
    gueltig = () => true,
    relevant = () => SCHRITTE,
  }: { start?: string; gueltig?: (schritt: string) => boolean; relevant?: () => string[] } = {},
) {
  let schritt = start;
  let warnen = false;
  let ende: (() => void) | null = null;
  let wacheJetzt: boolean | null = null;
  const h = new SchrittHistorie('test', () => b.fenster, () => b.zeit.jetzt);

  /** Effekte nach dem Rendern: erst die Wache (FlowShell, Kind), dann der Abgleich (useFlow). */
  const rendern = () => {
    const soll = warnen ? h.amAnfang() : null;
    if (soll !== wacheJetzt) {
      ende?.();
      ende = null;
      wacheJetzt = soll;
      if (soll !== null) ende = wacheEinrichten(b.wachFenster, () => VERLASSEN_FRAGE, { wache: soll, imAblauf: h.istFolgeEintrag });
    }
    h.abgleichen(schritt);
  };

  b.f.addEventListener('popstate', ((event: { state: unknown }) => {
    const neu = h.beiPopstate(event.state, { aktuell: schritt, alle: SCHRITTE, relevant: relevant(), gueltig: gueltig(schritt) });
    if (neu && neu !== schritt) {
      schritt = neu;
      rendern();
    }
  }) as Hoerer);

  const wechseln = (ziel: string) => {
    if (h.unterwegs()) return;
    const richtung = SCHRITTE.indexOf(ziel) - SCHRITTE.indexOf(schritt);
    if (richtung < 0 && h.zurueck(ziel)) return;
    const von = schritt;
    schritt = ziel;
    if (richtung > 0) h.vor(von, ziel);
    rendern();
  };

  rendern();
  return {
    h,
    schritt: () => schritt,
    weiter: () => wechseln(relevant()[relevant().indexOf(schritt) + 1]),
    /** Eigener Zurück-Knopf. */
    zurueckKnopf: () => wechseln(relevant()[relevant().indexOf(schritt) - 1]),
    /** Schrittlink in der Liste. */
    schrittlink: (ziel: string) => wechseln(ziel),
    neuBeginnen: () => {
      schritt = SCHRITTE[0];
      rendern();
    },
    dateienWaehlen: (ja: boolean) => {
      warnen = ja;
      rendern();
    },
  };
}

describe('Schritt-Historie: reine Entscheidungen (FA-QA-04B)', () => {
  it('liest nur Einträge desselben Formulars', () => {
    expect(eintragAus({ [ABLAUF]: { id: 'a', pfad: ['x'] } }, 'a')).toEqual({ id: 'a', pfad: ['x'] });
    expect(eintragAus({ [ABLAUF]: { id: 'b', pfad: ['x'] } }, 'a')).toBeNull();
    expect(eintragAus({ [ABLAUF]: { id: 'a', pfad: [] } }, 'a')).toBeNull();
    expect(eintragAus(null, 'a')).toBeNull();
    expect(eintragAus({ __NA: true }, 'a')).toBeNull();
  });

  it('der Rückweg geht auf den nächsten Eintrag mit dem Ziel, nie weiter', () => {
    expect(rueckwegDelta(['a', 'b', 'c'], 'b')).toBe(-1);
    expect(rueckwegDelta(['a', 'b', 'c'], 'a')).toBe(-2);
    expect(rueckwegDelta(['a', 'b', 'a', 'c'], 'a')).toBe(-1);
    expect(rueckwegDelta(['c'], 'b')).toBe(0);
    expect(rueckwegDelta(null, 'b')).toBe(0);
  });

  it('ein ausgeblendeter Schritt führt auf den letzten nötigen davor', () => {
    expect(aufRelevant('b', ['a', 'b', 'c'], ['a', 'c'])).toBe('a');
    expect(aufRelevant('c', ['a', 'b', 'c'], ['a', 'c'])).toBe('c');
    expect(aufRelevant('x', ['a', 'b', 'c'], ['a', 'c'])).toBeNull();
  });

  const basis = { alle: SCHRITTE, relevant: SCHRITTE, aktuell: 'unterlagen' };

  it('zurück immer, ohne Prüfung', () => {
    expect(popstateEntscheiden({ ...basis, ziel: 'schluessel', tiefe: -1, weiterFrei: false })).toEqual({ art: 'zeigen', schritt: 'schluessel' });
  });

  it('vorwärts einen Schritt nur mit erfülltem Schritt; gesperrt zurück auf den Eintrag des Sprungs', () => {
    expect(popstateEntscheiden({ ...basis, ziel: 'kontakt', tiefe: 1, weiterFrei: true })).toEqual({ art: 'zeigen', schritt: 'kontakt' });
    expect(popstateEntscheiden({ ...basis, ziel: 'kontakt', tiefe: 1, weiterFrei: false })).toEqual({ art: 'springen', delta: -1 });
    expect(popstateEntscheiden({ ...basis, ziel: 'absenden', tiefe: 2, weiterFrei: false })).toEqual({ art: 'springen', delta: -2 });
  });

  it('vorwärts über mehrere Einträge nur bis zum nächsten Schritt (R13: nichts wird übersprungen)', () => {
    expect(popstateEntscheiden({ ...basis, ziel: 'absenden', tiefe: 2, weiterFrei: true })).toEqual({ art: 'springen', delta: -1 });
    expect(popstateEntscheiden({ ...basis, ziel: 'absenden', tiefe: 1, weiterFrei: true })).toEqual({ art: 'zeigen', schritt: 'kontakt' });
  });
});

describe('Schritt-Historie im Ablauf (FA-QA-04B)', () => {
  it('jeder Schritt nach vorn legt einen Eintrag an, ohne Adresse (canonical und Messung unberührt)', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    expect(a.schritt()).toBe('unterlagen');
    expect(b.anzahl()).toBe(4);
    expect(b.pushAufrufe).toHaveLength(2);
    for (const aufruf of b.pushAufrufe) expect(aufruf).toHaveLength(2);
    expect(eintragAus(b.f.history.state, 'test')?.pfad).toEqual(['fahrzeug', 'schluessel', 'unterlagen']);
  });

  it('Browser- und Android-Zurück führen einen Schritt zurück; im ersten Schritt aus dem Formular hinaus', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    b.zurueck();
    expect(a.schritt()).toBe('schluessel');
    b.zurueck();
    expect(a.schritt()).toBe('fahrzeug');
    expect(b.verlassen()).toBe(false);
    b.zurueck();
    expect(b.verlassen()).toBe(true);
    expect(b.fragen).toEqual([]);
  });

  it('Vorwärts im Browser führt wieder auf den späteren Schritt', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    b.zurueck();
    b.zurueck();
    b.vorwaerts();
    expect(a.schritt()).toBe('schluessel');
    b.vorwaerts();
    expect(a.schritt()).toBe('unterlagen');
  });

  it('der eigene Zurück-Knopf nutzt dieselbe Historie: kein neuer Eintrag, Vorwärts geht wieder', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.zurueckKnopf();
    b.fliessen();
    expect(a.schritt()).toBe('schluessel');
    expect(b.anzahl()).toBe(4);
    expect(b.index()).toBe(2);
    b.vorwaerts();
    expect(a.schritt()).toBe('unterlagen');
  });

  it('doppelter Klick auf Zurück springt nicht um zwei Schritte', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.zurueckKnopf();
    a.zurueckKnopf();
    b.fliessen();
    expect(a.schritt()).toBe('schluessel');
    expect(b.index()).toBe(2);
    // Nach dem Sprung ist der nächste Wechsel wieder frei.
    a.zurueckKnopf();
    b.fliessen();
    expect(a.schritt()).toBe('fahrzeug');
  });

  it('ein Schrittlink geht auf den Eintrag des Ziels; Zurück danach verlässt im ersten Schritt', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.weiter();
    a.schrittlink('schluessel');
    b.fliessen();
    expect(a.schritt()).toBe('schluessel');
    expect(b.index()).toBe(2);
    b.zurueck();
    expect(a.schritt()).toBe('fahrzeug');
    b.zurueck();
    expect(b.verlassen()).toBe(true);
  });

  it('Vorwärts im Browser nie an einem gesperrten Schritt vorbei (canContinue)', () => {
    const b = browser();
    let erfuellt = true;
    const a = ablauf(b, { gueltig: (s) => s !== 'schluessel' || erfuellt });
    a.weiter();
    a.weiter();
    b.zurueck();
    expect(a.schritt()).toBe('schluessel');
    erfuellt = false;
    b.vorwaerts();
    expect(a.schritt()).toBe('schluessel');
    // Der Browser steht wieder auf dem Eintrag des gesperrten Schritts.
    expect(b.index()).toBe(2);
    erfuellt = true;
    b.vorwaerts();
    expect(a.schritt()).toBe('unterlagen');
  });

  it('die Freigabe des Rahmens (fehlende Unterlagen) sperrt Vorwärts ebenso (R13)', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.weiter();
    b.zurueck();
    expect(a.schritt()).toBe('unterlagen');
    a.h.setzeFreigabe(false);
    b.vorwaerts();
    expect(a.schritt()).toBe('unterlagen');
    a.h.setzeFreigabe(true);
    b.vorwaerts();
    expect(a.schritt()).toBe('kontakt');
  });

  it('ein Sprung über mehrere Einträge nach vorn endet auf dem nächsten Schritt', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.weiter();
    b.zurueck();
    b.zurueck();
    expect(a.schritt()).toBe('schluessel');
    b.vorwaerts(2);
    expect(a.schritt()).toBe('unterlagen');
    expect(b.index()).toBe(3);
  });

  it('nach einem Neuladen mitten im Ablauf: eigenes Zurück wechselt direkt, Browser-Zurück verlässt', () => {
    const b = browser();
    // Gespeicherter Stand: Schritt 3, die Seite frisch geladen (kein Eintrag darunter).
    const a = ablauf(b, { start: 'unterlagen' });
    expect(a.h.amAnfang()).toBe(true);
    a.zurueckKnopf();
    expect(a.schritt()).toBe('schluessel');
    expect(b.anzahl()).toBe(2);
    expect(eintragAus(b.f.history.state, 'test')?.pfad).toEqual(['schluessel']);
    b.zurueck();
    expect(b.verlassen()).toBe(true);
  });

  it('Neuladen auf einem Schritteintrag: der Pfad darunter gilt weiter', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    // Neuladen: dieselben Einträge, ein neuer Ablauf mit dem gespeicherten Schritt.
    const neu = ablauf(b, { start: 'unterlagen' });
    expect(neu.h.aktuellerPfad()).toEqual(['fahrzeug', 'schluessel', 'unterlagen']);
    neu.zurueckKnopf();
    b.fliessen();
    expect(neu.schritt()).toBe('schluessel');
  });

  it('„Neu beginnen“ beschriftet den Eintrag um, legt aber keinen an', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.neuBeginnen();
    expect(b.anzahl()).toBe(3);
    expect(eintragAus(b.f.history.state, 'test')?.pfad).toEqual(['fahrzeug', 'fahrzeug']);
  });

  it('ersetzt Next.js den Zustand eines Eintrags, gilt der bekannte Pfad weiter', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    b.f.history.replaceState({ __NA: true }, '');
    a.dateienWaehlen(false); // irgendein Rendern
    expect(eintragAus(b.f.history.state, 'test')?.pfad).toEqual(['fahrzeug', 'schluessel', 'unterlagen']);
    // Und ein Eintrag ohne Kennung darunter wird beim Zurück aus dem Pfad erkannt.
    b.zurueck();
    b.f.history.replaceState({ __NA: true }, '');
    b.vorwaerts();
    b.zurueck();
    expect(a.schritt()).toBe('schluessel');
  });

  it('ein Ablauf mit ausgeblendetem Schritt geht beim Zurück auf den letzten nötigen', () => {
    const b = browser();
    let relevant = SCHRITTE;
    const a = ablauf(b, { relevant: () => relevant });
    a.weiter();
    a.weiter();
    relevant = SCHRITTE.filter((s) => s !== 'schluessel');
    b.zurueck();
    expect(a.schritt()).toBe('fahrzeug');
  });

  it('ohne Fenster (Vorabrendern) tut die Historie nichts und bricht nicht', () => {
    const h = new SchrittHistorie('test', () => null);
    expect(() => {
      h.abgleichen('fahrzeug');
      h.vor('fahrzeug', 'schluessel');
    }).not.toThrow();
    expect(h.zurueck('fahrzeug')).toBe(false);
    expect(h.beiPopstate(null, { aktuell: 'fahrzeug', alle: SCHRITTE, relevant: SCHRITTE, gueltig: true })).toBeNull();
    expect(h.amAnfang()).toBe(true);
  });
});

describe('Schritt-Historie und Rückfrage vor dem Verlassen (FA-QA-02, FA-QA-04B)', () => {
  it('Dateien im ersten Schritt: Wacheintrag; Weiter und Zurück fragen nicht, erst das Verlassen', () => {
    const b = browser(false);
    const a = ablauf(b);
    a.dateienWaehlen(true);
    expect(istWache(b.f.history.state)).toBe(true);
    a.weiter();
    expect(a.schritt()).toBe('schluessel');
    b.zurueck();
    expect(a.schritt()).toBe('fahrzeug');
    expect(b.fragen).toEqual([]);
    // Vorwärts auf den späteren Schritt fragt nicht.
    b.vorwaerts();
    expect(a.schritt()).toBe('schluessel');
    b.zurueck();
    expect(b.fragen).toEqual([]);
    // Zurück im ersten Schritt verlässt: jetzt die Rückfrage. „Abbrechen“ bleibt im Formular.
    b.zurueck();
    expect(b.fragen).toEqual([VERLASSEN_FRAGE]);
    expect(b.verlassen()).toBe(false);
    expect(a.schritt()).toBe('fahrzeug');
    expect(istWache(b.f.history.state)).toBe(true);
  });

  it('„OK“ im ersten Schritt verlässt das Formular mit genau einer Rückfrage', () => {
    const b = browser(true);
    const a = ablauf(b);
    a.dateienWaehlen(true);
    a.weiter();
    b.zurueck();
    b.zurueck();
    b.fliessen();
    expect(b.fragen).toEqual([VERLASSEN_FRAGE]);
    expect(b.verlassen()).toBe(true);
  });

  it('Dateien in Schritt 3: Zurück führt ohne Frage bis Schritt 1, dann fragt das Verlassen; die Dateien bleiben', () => {
    const b = browser(false);
    const a = ablauf(b);
    a.weiter();
    a.weiter();
    a.dateienWaehlen(true);
    // Weiter oben keine Wache, nur die Rückfrage beim Neuladen und Schließen.
    expect(istWache(b.f.history.state)).toBe(false);
    expect(b.hoerer.beforeunload).toHaveLength(1);
    b.zurueck();
    b.zurueck();
    expect(a.schritt()).toBe('fahrzeug');
    expect(b.fragen).toEqual([]);
    b.zurueck();
    expect(b.fragen).toEqual([VERLASSEN_FRAGE]);
    expect(b.verlassen()).toBe(false);
  });

  it('Formular ohne Dateien hält niemanden fest und legt keine Wache an', () => {
    const b = browser();
    const a = ablauf(b);
    a.weiter();
    expect(b.anzahl()).toBe(3);
    b.zurueck();
    b.zurueck();
    expect(b.verlassen()).toBe(true);
    expect(b.fragen).toEqual([]);
  });

  it('Dateien wieder entfernt im ersten Schritt: die Wache geht, Zurück verlässt sofort', () => {
    const b = browser(false);
    const a = ablauf(b);
    a.dateienWaehlen(true);
    a.dateienWaehlen(false);
    b.fliessen();
    expect(istWache(b.f.history.state)).toBe(false);
    b.zurueck();
    expect(b.verlassen()).toBe(true);
    expect(b.fragen).toEqual([]);
  });
});
