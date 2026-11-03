import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHash } from 'node:crypto';

import {
  BEWEGUNG_SCHLUESSEL,
  START_KLASSE,
  START_ZEITLIMIT_MS,
  STARTSKRIPT,
  bewegungAusWahl,
  bewegungReduziert,
  scrollVerhalten,
} from './bewegung';

function fensterMit(reduziert: boolean) {
  vi.stubGlobal('window', {
    matchMedia: (anfrage: string) => ({ matches: anfrage === '(prefers-reduced-motion: reduce)' && reduziert }),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('scrollVerhalten', () => {
  it('scrollt sanft, wenn Bewegung erlaubt ist', () => {
    expect(scrollVerhalten(false)).toBe('smooth');
  });

  it('springt sofort bei „Bewegung reduzieren“', () => {
    expect(scrollVerhalten(true)).toBe('auto');
  });

  it('liest die Einstellung des Browsers, wenn nichts übergeben wird', () => {
    fensterMit(true);
    expect(bewegungReduziert()).toBe(true);
    expect(scrollVerhalten()).toBe('auto');

    fensterMit(false);
    expect(bewegungReduziert()).toBe(false);
    expect(scrollVerhalten()).toBe('smooth');
  });

  it('bewegt ohne Browser nichts', () => {
    expect(typeof window).toBe('undefined');
    expect(bewegungReduziert()).toBe(true);
    expect(scrollVerhalten()).toBe('auto');
  });
});

describe('bewegungAusWahl', () => {
  it('nimmt eine gültige Wahl im Gerät, sonst die Systemeinstellung', () => {
    expect(bewegungAusWahl('an', true)).toBe('an');
    expect(bewegungAusWahl('ruhig', false)).toBe('ruhig');
    expect(bewegungAusWahl(null, true)).toBe('ruhig');
    expect(bewegungAusWahl(undefined, false)).toBe('an');
    expect(bewegungAusWahl('vielleicht', false)).toBe('an');
  });
});

/** Führt das Startskript mit erfundenen Browser-Objekten aus. */
function starte({ gespeichert, reduziert, speicherFehler = false, alles = false }: {
  gespeichert?: string | null;
  reduziert: boolean;
  speicherFehler?: boolean;
  alles?: boolean;
}) {
  const attribute: Record<string, string> = {};
  const klassen = new Set<string>();
  const zeitgeber: Array<{ fn: () => void; ms: number }> = [];
  const html = {
    setAttribute: (n: string, w: string) => { attribute[n] = w; },
    classList: { add: (k: string) => klassen.add(k), remove: (k: string) => klassen.delete(k) },
  };
  const speicher = {
    getItem: (k: string) => {
      if (speicherFehler) throw new Error('gesperrt');
      return k === BEWEGUNG_SCHLUESSEL ? (gespeichert ?? null) : null;
    },
  };
  const fenster = {
    matchMedia: (anfrage: string) => {
      if (alles) throw new Error('kein matchMedia');
      return { matches: anfrage === '(prefers-reduced-motion: reduce)' && reduziert };
    },
  };
  new Function('document', 'localStorage', 'window', 'setTimeout', STARTSKRIPT)(
    { documentElement: html },
    speicher,
    fenster,
    (fn: () => void, ms: number) => zeitgeber.push({ fn, ms }),
  );
  return { attribute, klassen, zeitgeber };
}

describe('STARTSKRIPT', () => {
  it('setzt die gespeicherte Wahl vor dem ersten Rendern', () => {
    expect(starte({ gespeichert: 'an', reduziert: true }).attribute['data-bewegung']).toBe('an');
    expect(starte({ gespeichert: 'ruhig', reduziert: false }).attribute['data-bewegung']).toBe('ruhig');
  });

  it('folgt ohne Wahl der Systemeinstellung', () => {
    expect(starte({ reduziert: true }).attribute['data-bewegung']).toBe('ruhig');
    expect(starte({ reduziert: false }).attribute['data-bewegung']).toBe('an');
  });

  it('nimmt bei gesperrtem Speicher die Systemeinstellung und bei jedem Fehler die ruhige Fassung', () => {
    expect(starte({ reduziert: false, speicherFehler: true }).attribute['data-bewegung']).toBe('an');
    expect(starte({ reduziert: false, speicherFehler: true, alles: true }).attribute['data-bewegung']).toBe('ruhig');
  });

  it('setzt die Startklasse nur bei Bewegung und nimmt sie spätestens nach 2 s weg', () => {
    const an = starte({ reduziert: false });
    expect(an.klassen.has(START_KLASSE)).toBe(true);
    expect(an.zeitgeber).toHaveLength(1);
    expect(an.zeitgeber[0].ms).toBe(START_ZEITLIMIT_MS);
    expect(START_ZEITLIMIT_MS).toBeLessThanOrEqual(2000);
    an.zeitgeber[0].fn();
    expect(an.klassen.has(START_KLASSE)).toBe(false);
    const ruhig = starte({ reduziert: true });
    expect(ruhig.klassen.size).toBe(0);
    expect(ruhig.zeitgeber).toHaveLength(0);
  });

  it('bleibt klein und hat eine feste Prüfsumme (für eine spätere CSP mit Hash)', () => {
    expect(STARTSKRIPT.length).toBeLessThan(700);
    const pruefsumme = createHash('sha256').update(STARTSKRIPT).digest('base64');
    expect(pruefsumme).toBe('qCEkOCiIvf9hq/BzIpAc0gRp+OahB7RC/laL4EU10ZA=');
  });
});
