import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { SchluesselGrafik } from './schluessel';

function zeichne(params: unknown, title: unknown = 'Schlüssel'): string {
  return renderToStaticMarkup(
    <SchluesselGrafik
      params={params as VisualProps['params']}
      title={title as VisualProps['title']}
    />,
  );
}

function pruefeVertrag(html: string) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain('viewBox="0 0 480 270"');
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('oklch(');
  expect(html).not.toContain('<marker');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

const TYPEN = ['zylinder', 'buntbart', 'klapp', 'funk', 'smart-key', 'transponder'];

describe('SchluesselGrafik', () => {
  it('zeichnet mit Standardwerten einen Zylinderschlüssel', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Schlüssel</title>');
    expect(html).toContain('class="sm24-draw stroke-area"');
    expect(html).toContain('pathLength="1"');
    expect(zeichne({ typ: 'zylinder' })).toBe(html);
  });

  it('zeichnet jeden Typ eigenständig', () => {
    const ausgaben = TYPEN.map((typ) => zeichne({ typ, code: 'AB123' }));
    ausgaben.forEach(pruefeVertrag);
    expect(new Set(ausgaben).size).toBe(TYPEN.length);
  });

  it('zeichnet Funkbögen nur bei Funk- und Smart-Key', () => {
    expect(zeichne({ typ: 'funk' })).toContain('sm24-dash');
    expect(zeichne({ typ: 'smart-key' })).toContain('sm24-dash');
    expect(zeichne({ typ: 'zylinder' })).not.toContain('sm24-dash');
  });

  it('hat beim Smart-Key keinen Bart mit Einschnitten', () => {
    const html = zeichne({ typ: 'smart-key', einschnitte: [1, 2, 3, 4] });
    expect(html).not.toContain('class="sm24-draw stroke-area"');
    expect(html).not.toContain('<text');
  });

  it('leitet aus gleichem Code dasselbe Profil ab, aus anderem ein anderes', () => {
    expect(zeichne({ code: 'AB 4711' })).toBe(zeichne({ code: 'AB 4711' }));
    expect(zeichne({ code: 'ab4711' })).toBe(zeichne({ code: 'AB 4711' }));
    expect(zeichne({ code: 'AB 4711' })).not.toBe(zeichne({ code: 'CD 0815' }));
    expect(zeichne({ code: 'AB 4711' })).not.toBe(zeichne({}));
  });

  it('beschriftet Code-Profile nicht mit Ziffern', () => {
    expect(zeichne({ code: 'AB 4711' })).not.toContain('<text');
  });

  it('gibt einschnitten Vorrang vor code und beschriftet sie', () => {
    const a = zeichne({ einschnitte: [3, 5, 2, 7, 4], code: 'A' });
    const b = zeichne({ einschnitte: [3, 5, 2, 7, 4], code: 'B' });
    expect(a).toBe(b);
    const ziffern = [...a.matchAll(/<text[^>]*>(\d)<\/text>/g)].map((t) => Number(t[1]));
    expect(ziffern).toEqual([3, 5, 2, 7, 4]);
  });

  it('begrenzt einschnitte auf 4–8 Stellen und 0–9', () => {
    const lang = zeichne({ einschnitte: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] });
    expect([...lang.matchAll(/<text[^>]*>\d<\/text>/g)]).toHaveLength(8);
    const begrenzt = zeichne({ einschnitte: [12, -3, 4, 5] });
    const ziffern = [...begrenzt.matchAll(/<text[^>]*>(\d)<\/text>/g)].map((t) => Number(t[1]));
    expect(ziffern).toEqual([9, 0, 4, 5]);
    expect(zeichne({ einschnitte: [1, 2, 3] })).toBe(zeichne({}));
  });

  it('stapelt Kopien versetzt hinter dem Schlüssel', () => {
    const eins = zeichne({ anzahl: 1 });
    const drei = zeichne({ anzahl: 3 });
    pruefeVertrag(drei);
    expect(eins).not.toContain('translate(18 -18)');
    expect(drei).toContain('translate(18 -18)');
    expect(drei).toContain('translate(36 -36)');
    expect(zeichne({ anzahl: 99 })).toBe(drei);
  });

  it('wirft bei Unsinnswerten nicht', () => {
    const faelle: unknown[] = [
      { typ: 42, code: {}, einschnitte: 'x', anzahl: 'viele' },
      { typ: 'klapp', einschnitte: [Number.NaN, 'a', {}, null, 1] },
      { typ: ['funk'], anzahl: Number.NEGATIVE_INFINITY, code: '' },
      { typ: 'buntbart', einschnitte: '9 9 9 9 9 9 9 9 9' },
      { code: 'x'.repeat(10_000) },
      null,
      undefined,
      42,
    ];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      pruefeVertrag(zeichne(params));
    }
  });

  it('setzt einen Ersatztitel je Typ', () => {
    expect(zeichne({ typ: 'buntbart' }, '')).toContain('<title>Buntbartschlüssel, Seitenansicht</title>');
    expect(zeichne({}, null)).toContain('<title>Zylinderschlüssel, Seitenansicht</title>');
  });
});
