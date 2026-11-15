import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/*
 * „Zurück behält Eingaben“ (FA-KERN-02B, FA Abschnitt 26): Der Zustand der gemeinsamen Anfrage läuft hier
 * mit dem echten useFlow, aber ohne Browser. Ein kleiner Ersatz für die React-Hooks hält den Zustand
 * zwischen zwei Aufrufen fest, wie es eine Komponente täte; der Browserspeicher ist ein Map.
 */

const hooks = vi.hoisted(() => {
  const zellen: unknown[] = [];
  let index = 0;
  const deps: Array<unknown[] | undefined> = [];
  const gleich = (a?: unknown[], b?: unknown[]) => !!a && !!b && a.length === b.length && a.every((w, i) => Object.is(w, b[i]));
  return {
    beginnen() {
      index = 0;
    },
    zuruecksetzen() {
      zellen.length = 0;
      deps.length = 0;
      index = 0;
    },
    useState<T>(start: T | (() => T)) {
      const i = index++;
      if (!(i in zellen)) zellen[i] = typeof start === 'function' ? (start as () => T)() : start;
      const setzen = (wert: T | ((alt: T) => T)) => {
        zellen[i] = typeof wert === 'function' ? (wert as (alt: T) => T)(zellen[i] as T) : wert;
      };
      return [zellen[i] as T, setzen] as const;
    },
    useMemo<T>(fabrik: () => T, abh?: unknown[]) {
      const i = index++;
      if (!(i in zellen) || !gleich(deps[i], abh)) {
        zellen[i] = fabrik();
        deps[i] = abh;
      }
      return zellen[i] as T;
    },
  };
});

vi.mock('react', () => ({
  useState: hooks.useState,
  useMemo: hooks.useMemo,
  useCallback: <T,>(fn: T, abh?: unknown[]) => hooks.useMemo(() => fn, abh),
  useSyncExternalStore: (_abo: unknown, schnappschuss: () => unknown) => schnappschuss(),
}));

// Außerhalb einer Komponente aufgerufen: Der Ersatz oben spielt die Rolle von React.
const { useFahrzeugAnfrage: zustandBerechnen } = await import('./zustand');
const { pflichtTabelle } = await import('./pflicht');

const speicher = new Map<string, string>();

beforeEach(() => {
  hooks.zuruecksetzen();
  speicher.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (k: string) => speicher.get(k) ?? null,
      setItem: (k: string, v: string) => void speicher.set(k, v),
      removeItem: (k: string) => void speicher.delete(k),
    },
    addEventListener: () => {},
    removeEventListener: () => {},
    scrollTo: () => {},
    requestAnimationFrame: (f: () => void) => f(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const datei = (name: string) => ({ id: name, name, sizeBytes: 1000, mimeType: 'image/jpeg', previewUrl: '', status: 'fertig' as const });

function anzeigen(klasse: 'motorrad' | 'roller' = 'motorrad') {
  hooks.beginnen();
  return zustandBerechnen({ klasse, pflichtTabelle: pflichtTabelle(klasse), jahr: 2026 });
}

describe('useFahrzeugAnfrage: Zurück behält Eingaben', () => {
  it('behält Angaben und ausgewählte Dateien beim Zurückgehen über alle Schritte', () => {
    let z = anzeigen();
    expect(z.flow.step.id).toBe('fahrzeug');
    expect(z.flow.stepCount).toBe(6);
    z.flow.update({ hersteller: 'Testwerk', modell: 'TX 700', baujahr: '2019' });
    z = anzeigen();
    expect(z.shellFlow.canContinue).toBe(true);
    z.flow.next();

    z = anzeigen();
    expect(z.flow.step.id).toBe('schluessel');
    z.flow.update({ schluessel: 'vorhanden', transponder: 'ja' });
    z = anzeigen();
    z.flow.next();

    z = anzeigen();
    expect(z.flow.step.id).toBe('unterlagen');
    // Ohne Unterlagen bleibt „Weiter“ gesperrt.
    expect(z.shellFlow.canContinue).toBe(false);
    expect(z.fehlt).toEqual(['fahrzeugschein', 'schluessel-vorderseite', 'schluessel-rueckseite', 'schluessel-spitze']);
    z.setDateien('fahrzeugschein', [datei('schein.jpg')]);
    z.setFoto('schluessel-vorderseite', [datei('v.jpg')]);
    z.setFoto('schluessel-rueckseite', [datei('r.jpg')]);
    z.setFoto('schluessel-spitze', [datei('s.jpg')]);
    z = anzeigen();
    expect(z.fehlt).toEqual([]);
    expect(z.shellFlow.canContinue).toBe(true);
    z.flow.next();

    z = anzeigen();
    expect(z.flow.step.id).toBe('beschreibung');
    z.flow.set('beschreibung', 'Zweitschlüssel gewünscht, Testangabe.');

    // Zweimal zurück: Angaben und Dateien stehen noch da.
    z = anzeigen();
    z.flow.back();
    z = anzeigen();
    expect(z.flow.step.id).toBe('unterlagen');
    expect(z.dateien.fahrzeugschein.map((d) => d.name)).toEqual(['schein.jpg']);
    expect(z.dateien.fotos['schluessel-spitze'].map((d) => d.name)).toEqual(['s.jpg']);
    expect(z.shellFlow.canContinue).toBe(true);
    z.flow.back();
    z = anzeigen();
    z.flow.back();
    z = anzeigen();
    expect(z.flow.step.id).toBe('fahrzeug');
    expect(z.flow.data).toMatchObject({
      hersteller: 'Testwerk',
      modell: 'TX 700',
      baujahr: '2019',
      schluessel: 'vorhanden',
      transponder: 'ja',
      beschreibung: 'Zweitschlüssel gewünscht, Testangabe.',
    });
    expect(z.dateien.fotos['schluessel-vorderseite']).toHaveLength(1);

    // Wieder vor bis zum Absenden: nichts fehlt.
    for (let i = 0; i < 4; i += 1) {
      z.flow.next();
      z = anzeigen();
    }
    z.flow.update({ vorname: 'Anna', nachname: 'Beispiel', email: 'anna@example.com', telefon: '06441 123456' });
    z = anzeigen();
    z.flow.next();
    z = anzeigen();
    expect(z.flow.step.id).toBe('absenden');
    expect(z.offen).toBeNull();
    expect(z.shellFlow.canContinue).toBe(true);
  });

  it('hält die Angaben im Zwischenstand, Dateien nicht; nach Neuladen sperrt das Absenden', () => {
    let z = anzeigen();
    z.flow.update({ hersteller: 'Testwerk', modell: 'TX 700', baujahr: '2019', schluessel: 'vorhanden', transponder: 'nein', beschreibung: 'Zweitschlüssel gewünscht, Testangabe.', vorname: 'Anna', nachname: 'Beispiel', email: 'anna@example.com', telefon: '06441 123456' });
    z = anzeigen();
    z.flow.goTo('absenden');
    const gespeichert = speicher.get('sm24:flow:fahrzeug-anfrage-motorrad') ?? '';
    expect(gespeichert).toContain('Testwerk');
    expect(gespeichert).not.toContain('schein');

    // Neuladen: neue Komponente, Zwischenstand aus dem Speicher, keine Dateien.
    hooks.zuruecksetzen();
    z = anzeigen();
    expect(z.flow.step.id).toBe('absenden');
    expect(z.flow.data.hersteller).toBe('Testwerk');
    expect(z.offen).toBe('unterlagen');
    expect(z.shellFlow.canContinue).toBe(false);
  });

  it('verwirft die Vorbelegung aus der Suche nicht still, wenn ein Zwischenstand ein anderes Fahrzeug hat', () => {
    const nichtGefunden = (vorbelegung?: { hersteller: string; modell: string }) => {
      hooks.beginnen();
      return zustandBerechnen({ klasse: 'nicht-gefunden', pflichtTabelle: pflichtTabelle('nicht-gefunden'), jahr: 2026, vorbelegung });
    };
    // Ohne Zwischenstand gilt die Vorbelegung, kein Hinweis.
    let z = nichtGefunden({ hersteller: 'Neuwerk', modell: 'N 1' });
    expect(z.flow.data).toMatchObject({ hersteller: 'Neuwerk', modell: 'N 1' });
    expect(z.vorbelegungAnbieten).toBeNull();

    // Halb ausgefüllte Anfrage mit anderem Fahrzeug, dann aus der Suche mit einem neuen.
    z.flow.update({ hersteller: 'Altwerk', modell: 'A 9', baujahr: '2015' });
    hooks.zuruecksetzen();
    z = nichtGefunden({ hersteller: 'Neuwerk', modell: 'N 1' });
    expect(z.flow.data.hersteller).toBe('Altwerk');
    expect(z.vorbelegungAnbieten).toEqual({ hersteller: 'Neuwerk', modell: 'N 1' });
    z.vorbelegungEntscheiden(true);
    z = nichtGefunden({ hersteller: 'Neuwerk', modell: 'N 1' });
    expect(z.flow.data).toMatchObject({ hersteller: 'Neuwerk', modell: 'N 1', baujahr: '2015' });
    expect(z.vorbelegungAnbieten).toBeNull();

    // Behalten: Angaben bleiben, der Hinweis verschwindet.
    hooks.zuruecksetzen();
    z = nichtGefunden({ hersteller: 'Drittwerk', modell: 'D 3' });
    expect(z.vorbelegungAnbieten).toEqual({ hersteller: 'Drittwerk', modell: 'D 3' });
    z.vorbelegungEntscheiden(false);
    z = nichtGefunden({ hersteller: 'Drittwerk', modell: 'D 3' });
    expect(z.flow.data.hersteller).toBe('Neuwerk');
    expect(z.vorbelegungAnbieten).toBeNull();

    // Ohne Vorbelegung nie ein Hinweis.
    hooks.zuruecksetzen();
    expect(nichtGefunden().vorbelegungAnbieten).toBeNull();
  });

  it('richtet beim Roller die Pflichtliste nach der Wahl', () => {
    let z = anzeigen('roller');
    z.flow.update({ roller: 'zulassung', schluessel: 'vorhanden' });
    z = anzeigen('roller');
    expect(z.pflicht).toContain('fahrzeugschein');
    z.flow.set('roller', 'versicherungskennzeichen');
    z = anzeigen('roller');
    expect(z.pflicht).not.toContain('fahrzeugschein');
    expect(z.pflicht).toEqual(expect.arrayContaining(['ersatznachweis', 'typenschild']));
  });
});
