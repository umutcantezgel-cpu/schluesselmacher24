import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { SchliessplanGrafik, schliessplanSchluessel } from './schliessplan';

function zeichne(params: unknown, title: unknown = 'Schließplan'): string {
  return renderToStaticMarkup(
    <SchliessplanGrafik
      params={params as VisualProps['params']}
      title={title as VisualProps['title']}
    />,
  );
}

function pruefeVertrag(html: string) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain('viewBox="0 0 480 300"');
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('oklch(');
  expect(html).not.toContain('<marker');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

/** Beschriftungen der Knoten in Reihenfolge. */
function kuerzel(html: string): string[] {
  return [...html.matchAll(/<text[^>]*>([A-Z]+)<\/text>/g)].map((t) => t[1]);
}

const anzahl = (liste: string[], wert: string) => liste.filter((k) => k === wert).length;
/** Türsymbole erkennt man an ihrer Rundung. */
const tueren = (html: string) => (html.match(/rx="2.5"/g) ?? []).length;

describe('SchliessplanGrafik', () => {
  it('zeichnet mit Standardwerten eine Hauptschlüsselanlage mit vier Türen', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    const k = kuerzel(html);
    expect(anzahl(k, 'HS')).toBe(1);
    expect(anzahl(k, 'ES')).toBe(4);
    expect(tueren(html)).toBe(4);
    expect(html).toContain('sm24-draw');
    expect(html).toContain('sm24-pop');
    expect(html).toContain('pathLength="1"');
  });

  it('zeigt bei der Generalhauptschlüsselanlage GHS, HGS und GS', () => {
    const html = zeichne({ system: 'generalhaupt' });
    pruefeVertrag(html);
    const k = kuerzel(html);
    expect(anzahl(k, 'GHS')).toBe(1);
    expect(anzahl(k, 'HGS')).toBe(2);
    expect(k).toContain('GS');
    expect(anzahl(k, 'ES')).toBe(4);
    expect(tueren(html)).toBe(4);
  });

  it('richtet sich nach gruppen und tueren', () => {
    const k = kuerzel(zeichne({ system: 'generalhaupt', gruppen: 3, tueren: 7 }));
    expect(anzahl(k, 'HGS')).toBe(3);
    expect(anzahl(k, 'ES')).toBe(7);
    const wenige = kuerzel(zeichne({ system: 'generalhaupt', gruppen: 4, tueren: 2 }));
    expect(anzahl(wenige, 'HGS')).toBe(2);
    expect(anzahl(wenige, 'ES')).toBe(2);
  });

  it('zeigt bei der Zentralschlossanlage Z-Türen und eigene Türen', () => {
    const html = zeichne({ system: 'zentral', tueren: 3 });
    pruefeVertrag(html);
    const k = kuerzel(html);
    expect(anzahl(k, 'Z')).toBe(2);
    expect(anzahl(k, 'ES')).toBe(3);
    expect(k).not.toContain('HS');
    expect(tueren(html)).toBe(3 + 2);
  });

  it('verbindet bei der Gleichschließung einen Schlüssel mit allen Türen', () => {
    const html = zeichne({ system: 'gleichschliessung', tueren: 5 });
    pruefeVertrag(html);
    expect(kuerzel(html)).toEqual([]);
    expect(tueren(html)).toBe(5);
    expect((html.match(/class="sm24-draw stroke-area"/g) ?? []).length).toBe(5);
  });

  it('ignoriert gruppen außerhalb der Generalhauptschlüsselanlage', () => {
    expect(zeichne({ system: 'haupt', gruppen: 4 })).toBe(zeichne({ system: 'haupt' }));
  });

  it('passt auch bei vielen Knoten in die viewBox', () => {
    for (const system of ['generalhaupt', 'zentral', 'haupt', 'gleichschliessung']) {
      const html = zeichne({ system, gruppen: 4, tueren: 8 });
      pruefeVertrag(html);
      const skala = html.match(/scale\(([\d.]+)\)/);
      const faktor = skala ? Number(skala[1]) : 1;
      expect(faktor).toBeGreaterThan(0.9);
      expect(faktor).toBeLessThanOrEqual(1);
      const xs = [...html.matchAll(/<rect[^>]*x="([\d.-]+)"[^>]*width="([\d.]+)"/g)].map((t) => [
        Number(t[1]),
        Number(t[2]),
      ]);
      const links = Math.min(...xs.map(([x]) => x));
      const rechts = Math.max(...xs.map(([x, w]) => x + w));
      const mitte = 240;
      expect(mitte - (mitte - links) * faktor).toBeGreaterThanOrEqual(0);
      expect(mitte + (rechts - mitte) * faktor).toBeLessThanOrEqual(480);
    }
  });

  it('wirft bei Unsinnswerten nicht', () => {
    const faelle: unknown[] = [
      { system: 42, gruppen: -1, tueren: 999 },
      { system: 'generalhaupt', gruppen: Number.NaN, tueren: 'viele' },
      { system: ['zentral'], tueren: {} },
      { system: 'zentral', tueren: -3 },
      null,
      undefined,
      'haupt',
    ];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      pruefeVertrag(zeichne(params));
    }
    expect(tueren(zeichne({ tueren: 999 }))).toBe(8);
    expect(tueren(zeichne({ tueren: -3 }))).toBe(2);
  });

  it('setzt einen Ersatztitel und bleibt deterministisch', () => {
    expect(zeichne({ system: 'zentral' }, '')).toContain(
      '<title>Schließplan Zentralschlossanlage</title>',
    );
    const params = { system: 'generalhaupt', gruppen: 3, tueren: 6 };
    expect(zeichne(params)).toBe(zeichne({ ...params }));
  });
});

/** Hervorgehobene Kanten: Pfade mit der Klasse der Markierung. */
const hervorgehobeneKanten = (html: string) =>
  (html.match(/<path class="sm24-draw stroke-area-strong /g) ?? []).length;
/** Knoten (Schlüssel und Türen) ohne Dimmung. */
const ungedimmt = (html: string) =>
  (html.match(/<g class="sm24-pop[^"]*"/g) ?? []).filter((g) => !g.includes('opacity-30')).length;
/** Türen von links nach rechts: hervorgehoben oder nicht. */
function tuerenVonLinks(html: string): boolean[] {
  return [...html.matchAll(/<rect class="([^"]*)"[^>]*?\bx="([\d.-]+)"[^>]*rx="2\.5"/g)]
    .map((t) => ({ hervor: t[1].includes('fill-area-soft'), x: Number(t[2]) }))
    .sort((a, b) => a.x - b.x)
    .map((t) => t.hervor);
}
/** Klassen der Gruppen, die ein Türsymbol umschließen. */
function tuerGruppen(html: string): string[] {
  return [...html.matchAll(/<g class="([^"]*)"[^>]*><rect class="[^"]*"[^>]*rx="2\.5"/g)].map(
    (t) => t[1],
  );
}

describe('SchliessplanGrafik – Markierung', () => {
  it('markiert e2 mit seiner Tür und dem Weg von oben', () => {
    const html = zeichne({ system: 'haupt', markiert: 'e2' });
    pruefeVertrag(html);
    expect(tueren(html)).toBe(4);
    expect((html.match(/fill-area-soft/g) ?? []).length).toBe(1);
    expect(hervorgehobeneKanten(html)).toBe(2);
    expect(tuerenVonLinks(html)).toEqual([false, true, false, false]);
  });

  it('markiert die Wurzel mit allen Türen, ohne Dimmung an Türen', () => {
    const html = zeichne({ system: 'haupt', markiert: 'wurzel' });
    pruefeVertrag(html);
    expect(tuerenVonLinks(html)).toEqual([true, true, true, true]);
    expect(tuerGruppen(html).some((c) => c.includes('opacity-30'))).toBe(false);
    expect(hervorgehobeneKanten(html)).toBe(8);
  });

  it('markiert bei der Generalhauptschlüsselanlage nur die Türen der ersten Hauptgruppe', () => {
    const html = zeichne({ system: 'generalhaupt', gruppen: 2, tueren: 4, markiert: 'g1' });
    pruefeVertrag(html);
    expect(tuerenVonLinks(html)).toEqual([true, true, false, false]);
    expect(hervorgehobeneKanten(html)).toBe(7);
  });

  it('markiert bei einer Tür die Tür, ihre Schlüssel und die Kanten dazwischen', () => {
    const html = zeichne({ system: 'haupt', tuer: 't3' });
    pruefeVertrag(html);
    expect(tuerenVonLinks(html)).toEqual([false, false, true, false]);
    expect(ungedimmt(html)).toBe(3);
    expect(hervorgehobeneKanten(html)).toBe(2);
  });

  it('markiert bei der Zentralschlossanlage ES 1 samt beider Zentraltüren', () => {
    const html = zeichne({ system: 'zentral', tueren: 3, markiert: 'e1' });
    pruefeVertrag(html);
    expect(tuerenVonLinks(html).filter(Boolean)).toHaveLength(3);
    expect(ungedimmt(html)).toBe(4);
  });

  it('ignoriert unbekannte Werte wie keine Markierung', () => {
    for (const extra of [{ markiert: 'x9' }, { markiert: 'e9' }, { tuer: 42 }, { markiert: ['e1'] }]) {
      expect(zeichne({ system: 'haupt', ...extra })).toBe(zeichne({ system: 'haupt' }));
    }
  });

  it('zeichnet ohne neue Parameter weder Dimmung noch Hervorhebung', () => {
    for (const params of [{}, { system: 'generalhaupt' }, { system: 'zentral' }]) {
      const html = zeichne(params);
      expect(html).not.toContain('opacity-30');
      expect(html).not.toContain('fill-area-soft');
    }
  });

  it('setzt den Titel mit Markierung nur bei fehlendem Titel', () => {
    expect(zeichne({ system: 'haupt', markiert: 'e3' }, '')).toContain(
      '<title>Schließplan Hauptschlüsselanlage – markiert: ES 3</title>',
    );
    expect(zeichne({ system: 'haupt', tuer: 't2' }, '')).toContain(
      '<title>Schließplan Hauptschlüsselanlage – markiert: Tür 2</title>',
    );
    expect(zeichne({ system: 'haupt', markiert: 'e3' }, 'Eigener Titel')).toContain(
      '<title>Eigener Titel</title>',
    );
  });

  it('bleibt bei gleicher Eingabe mit Markierung deterministisch', () => {
    const params = { system: 'generalhaupt', gruppen: 3, tueren: 6, markiert: 'g2' };
    expect(zeichne(params, '')).toBe(zeichne({ ...params }, ''));
  });

  it('liefert die Schlüsselliste der Generalhauptschlüsselanlage von oben nach unten', () => {
    const liste = schliessplanSchluessel({ system: 'generalhaupt', gruppen: 2, tueren: 4 });
    const kuerzel = liste.map((k) => k.kuerzel);
    expect(kuerzel[0]).toBe('GHS');
    expect(kuerzel).toContain('HGS 1');
    expect(kuerzel).toContain('HGS 2');
    const esse = liste.filter((k) => k.kuerzel.startsWith('ES '));
    expect(esse).toHaveLength(4);
    expect(esse.flatMap((k) => k.tueren).sort()).toEqual(['t1', 't2', 't3', 't4']);
    expect(liste[0].tueren.sort()).toEqual(['t1', 't2', 't3', 't4']);
  });

  it('liefert bei der Gleichschließung genau einen Schlüssel mit allen Türen', () => {
    expect(schliessplanSchluessel({ system: 'gleichschliessung', tueren: 5 })).toEqual([
      { kennung: 'wurzel', kuerzel: 'Schlüssel', tueren: ['t1', 't2', 't3', 't4', 't5'] },
    ]);
  });

  it('nennt bei der Zentralschlossanlage ES mit eigener Tür und beiden Zentraltüren', () => {
    const liste = schliessplanSchluessel({ system: 'zentral', tueren: 3 });
    expect(liste.map((k) => k.kuerzel)).toEqual(['ES 1', 'ES 2', 'ES 3']);
    expect(liste[0]).toEqual({ kennung: 'e1', kuerzel: 'ES 1', tueren: ['t1', 'z1', 'z2'] });
  });
});
