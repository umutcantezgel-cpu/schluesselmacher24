import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { ZylinderMassGrafik } from './zylinder-mass';

function zeichne(params: unknown, title: unknown = 'Maßzeichnung Zylinder'): string {
  return renderToStaticMarkup(
    <ZylinderMassGrafik
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

/** Längen der beiden Maßlinien (A, I) in viewBox-Einheiten. */
function masslinien(html: string): number[] {
  const treffer = html.matchAll(
    /class="sm24-draw stroke-area-strong"[^>]*?d="M([\d.]+) [\d.]+H([\d.]+)"/g,
  );
  return [...treffer].map((t) => Number(t[2]) - Number(t[1]) + 4);
}

describe('ZylinderMassGrafik', () => {
  it('zeichnet mit Standardwerten (Doppelzylinder 30/30)', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Maßzeichnung Zylinder</title>');
    expect(html).toContain('A 30');
    expect(html).toContain('I 30');
    expect(html).toContain('außen');
    expect(html).toContain('innen');
    expect(html).toContain('pathLength="1"');
  });

  it('beschriftet die Maße aus den Parametern', () => {
    const html = zeichne({ aussen: 30, innen: 45 });
    pruefeVertrag(html);
    expect(html).toContain('A 30');
    expect(html).toContain('I 45');
  });

  it('zeichnet die Seiten maßstäblich im Verhältnis A:I', () => {
    const [a, i] = masslinien(zeichne({ aussen: 30, innen: 60 }));
    expect(i / a).toBeCloseTo(2, 1);
    const [a2, i2] = masslinien(zeichne({ aussen: 80, innen: 40, bauform: 'knauf' }));
    expect(a2 / i2).toBeCloseTo(2, 1);
  });

  it('zeigt beim Halbzylinder nur Maß A', () => {
    const html = zeichne({ bauform: 'profil-halb', aussen: 40, innen: 55 });
    pruefeVertrag(html);
    expect(html).toContain('A 40');
    expect(html).not.toContain('I 55');
    expect(masslinien(html)).toHaveLength(1);
  });

  it('zeichnet beim Knaufzylinder einen Knauf auf der gewählten Seite', () => {
    const innen = zeichne({ bauform: 'knauf', aussen: 35, innen: 30 });
    const aussen = zeichne({ bauform: 'knauf', aussen: 35, innen: 30, knaufseite: 'aussen' });
    pruefeVertrag(innen);
    pruefeVertrag(aussen);
    expect(innen).toContain('fill-area-muted stroke-foreground');
    expect(innen).not.toBe(aussen);
    expect(zeichne({})).not.toContain('fill-area-muted stroke-foreground');
  });

  it('formatiert halbe Millimeter mit Komma', () => {
    const html = zeichne({ aussen: 27.5, innen: '32,5' });
    expect(html).toContain('A 27,5');
    expect(html).toContain('I 32,5');
  });

  it('begrenzt Zahlen und wirft bei Unsinnswerten nicht', () => {
    const faelle: unknown[] = [
      { bauform: 42, aussen: -5, innen: 999, knaufseite: {} },
      { aussen: Number.NaN, innen: Number.POSITIVE_INFINITY },
      { aussen: 'abc', innen: [], bauform: ['knauf'] },
      { bauform: 'knauf', knaufseite: 'oben', aussen: {} as unknown },
      null,
      undefined,
      'unsinn',
      [],
    ];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      pruefeVertrag(zeichne(params));
    }
    const begrenzt = zeichne({ aussen: -5, innen: 999 });
    expect(begrenzt).toContain('A 25');
    expect(begrenzt).toContain('I 100');
  });

  it('setzt einen Ersatztitel, wenn der Titel fehlt', () => {
    for (const title of [null, '  ', 42]) {
      const html = zeichne({}, title);
      pruefeVertrag(html);
      expect(html).toContain('<title>Maßzeichnung eines Schließzylinders</title>');
    }
  });

  it('liefert für gleiche Eingaben dieselbe Grafik', () => {
    const params = { bauform: 'knauf', aussen: 45, innen: 35, knaufseite: 'aussen' };
    expect(zeichne(params)).toBe(zeichne({ ...params }));
  });
});
