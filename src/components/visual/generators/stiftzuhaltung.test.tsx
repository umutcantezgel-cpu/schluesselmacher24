import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { StiftzuhaltungGrafik } from './stiftzuhaltung';

function zeichne(params: unknown, title: unknown = ''): string {
  return renderToStaticMarkup(
    <StiftzuhaltungGrafik params={params as VisualProps['params']} title={title as VisualProps['title']} />,
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

/** Marken: alle Kreise an den Fugen, mit der angegebenen Klasse. */
const marken = (html: string, farbe: 'stroke-success' | 'stroke-danger') =>
  [...html.matchAll(/<circle[^>]*class="[^"]*\b(stroke-success|stroke-danger)\b[^"]*"[^>]*>/g)].filter(
    (m) => m[1] === farbe,
  );

describe('StiftzuhaltungGrafik', () => {
  it('hält den Vertrag in allen drei Zuständen', () => {
    for (const zustand of ['passt', 'passt-nicht', 'abgebrochen']) {
      pruefeVertrag(zeichne({ zustand }));
    }
  });

  it('zeigt bei passt fünf Marken auf der Trennlinie und keine Abweichung', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Stiftzuhaltung: Der Schlüssel passt</title>');
    expect(marken(html, 'stroke-success')).toHaveLength(5);
    expect(marken(html, 'stroke-danger')).toHaveLength(0);
    expect(html).not.toContain('stroke-danger');
    const fugen = [...html.matchAll(/<circle[^>]*class="[^"]*stroke-success[^"]*"[^>]*cy="([\d.]+)"/g)].map((m) => m[1]);
    expect(fugen).toEqual(['118', '118', '118', '118', '118']);
  });

  it('zeigt bei passt-nicht mindestens drei falsche Fugen', () => {
    const html = zeichne({ zustand: 'passt-nicht' });
    pruefeVertrag(html);
    expect(html).toContain('<title>Stiftzuhaltung: Der Schlüssel passt nicht</title>');
    expect(marken(html, 'stroke-danger').length).toBeGreaterThanOrEqual(3);
    expect(marken(html, 'stroke-danger').length + marken(html, 'stroke-success').length).toBe(5);
  });

  it('zeichnet bei abgebrochen eine Bruchkante und lässt die hinteren Bohrungen fallen', () => {
    const html = zeichne({ zustand: 'abgebrochen', code: '500' });
    pruefeVertrag(html);
    expect(html).toContain('<title>Abgebrochener Schlüssel im Zylinder</title>');
    expect(html.match(/data-bruch=""/g)).toHaveLength(1);
    expect(marken(html, 'stroke-danger').length).toBeGreaterThanOrEqual(3);
  });

  it('zeigt einen Code als Text auf der Reide, begrenzt auf vier Ziffern', () => {
    expect(zeichne({ code: '404' })).toMatch(/>404<\/text>/);
    expect(zeichne({ code: 'abc' })).not.toMatch(/>abc</);
    expect(zeichne({ code: 'abc' })).not.toMatch(/>\d+<\/text>/);
    const lang = zeichne({ code: '12345' });
    expect(lang).toMatch(/>1234<\/text>/);
    expect(lang).not.toContain('12345');
    expect(zeichne({})).not.toMatch(/>\d+<\/text>/);
  });

  it('zeichnet fünf Bohrungen', () => {
    expect(zeichne({}).match(/data-bohrung=""/g)).toHaveLength(5);
    expect(zeichne({ zustand: 'abgebrochen' }).match(/data-bohrung=""/g)).toHaveLength(5);
  });

  it('bewegt sich nur mit Trennlinie und Marken, höchstens fünf Marken gestaffelt', () => {
    const html = zeichne({ zustand: 'passt-nicht' });
    expect(html.match(/sm24-pop/g)?.length ?? 0).toBeLessThanOrEqual(5);
    expect(html).not.toContain('sm24-reveal');
    expect(html).not.toContain('sm24-fade');
    expect(html).toContain('sm24-draw');
  });

  it('wirft bei Unsinnswerten nicht und liefert den Standard', () => {
    const standard = zeichne({});
    for (const params of [null, 42, [], { zustand: 7 }, { einschnitte: 'x' }, { einschnitte: {} }, { code: 7 }]) {
      const html = zeichne(params, undefined);
      pruefeVertrag(html);
      expect(zeichne(params, undefined)).toBe(zeichne(params, undefined));
    }
    expect(zeichne({ zustand: 7 })).toBe(standard);
    expect(zeichne({ einschnitte: 'x' })).toBe(standard);
  });

  it('ist deterministisch', () => {
    const params = { zustand: 'passt-nicht', einschnitte: '37264', code: '4711' };
    expect(zeichne(params)).toBe(zeichne(params));
  });

  it('übernimmt einen eigenen Titel', () => {
    expect(zeichne({}, 'Schließzylinder in der Werkstatt')).toContain(
      '<title>Schließzylinder in der Werkstatt</title>',
    );
  });
});
