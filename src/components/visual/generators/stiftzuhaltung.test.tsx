import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { StiftzuhaltungGrafik } from './stiftzuhaltung';
import { hash } from './grafik-basis';

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

  it('ohne szene bleibt die Ausgabe unverändert (Fingerabdruck vor E6-GRAFIKER-11)', () => {
    const fingerabdruecke: [unknown, number, number][] = [
      [{}, 1176611037, 7362],
      [{ zustand: 'passt-nicht' }, 3985722158, 8132],
      [{ zustand: 'abgebrochen', code: '500' }, 401139204, 8179],
      [{ zustand: 'passt-nicht', einschnitte: '37264', code: '4711' }, 2567637817, 8258],
      [{ zustand: 'passt', einschnitte: '37264' }, 1703972281, 7362],
      [{ zustand: 'passt', code: '404' }, 2720279030, 7487],
      [{ zustand: 'passt', einschnitte: [9, 0, 9, 0, 9], code: '9' }, 641981156, 7485],
      [{ zustand: 'abgebrochen' }, 1300335833, 8054],
      [{ einschnitte: [1, 2, 3, 4, 5], code: 12 }, 2353545066, 7474],
      [{ code: 7 }, 3177861991, 7485],
    ];
    for (const [params, fingerabdruck, laenge] of fingerabdruecke) {
      const html = zeichne(params);
      expect(html).toHaveLength(laenge);
      expect(hash(html)).toBe(fingerabdruck);
    }
  });

  it('zeigt die Szene nur mit szene: scroll und nur bei passt', () => {
    expect(zeichne({ szene: 'scroll' })).toMatch(/<svg[^>]*class="[^"]*\bsm24-szene\b/);
    expect(zeichne({})).not.toContain('sm24-szene');
    expect(zeichne({ szene: 'nein' })).toBe(zeichne({}));
    expect(zeichne({ szene: 7 })).toBe(zeichne({}));
    for (const zustand of ['passt-nicht', 'abgebrochen']) {
      const ohne = zeichne({ zustand, code: '4711' });
      expect(zeichne({ zustand, code: '4711', szene: 'scroll' })).toBe(ohne);
      expect(ohne).not.toContain('sm24-scrub');
      expect(ohne).not.toContain('sm24-szene');
    }
  });

  it('hat in der Szene einen einfahrenden Schlüssel, fünf Stifte und fünf Federn', () => {
    const html = zeichne({ szene: 'scroll', code: '4711' });
    pruefeVertrag(html);
    expect(html.match(/<g class="sm24-scrub-schluessel" style="--schluessel-von:-\d+"/g)).toHaveLength(1);
    expect(html.match(/<g class="sm24-scrub-stift"/g)).toHaveLength(5);
    expect(html.match(/<path class="stroke-foreground-muted sm24-scrub-feder"/g)).toHaveLength(5);
    expect(html.match(/<g class="sm24-scrub-pruefung"/g)).toHaveLength(1);

    const stifte = [...html.matchAll(/class="sm24-scrub-stift" style="--stift-von:(-?[\d.]+);--stift-nr:(\d+)"/g)];
    expect(stifte.map((m) => Number(m[2]))).toEqual([0, 1, 2, 3, 4]);
    for (const m of stifte) expect(Number(m[1])).toBeGreaterThanOrEqual(8);
    for (const m of stifte) expect(Number(m[1])).toBeLessThanOrEqual(30);

    const federn = [...html.matchAll(/sm24-scrub-feder" style="--feder-von:([\d.]+);--stift-nr:(\d+)"/g)];
    expect(federn.map((m) => Number(m[2]))).toEqual([0, 1, 2, 3, 4]);
    for (const m of federn) expect(Number(m[1])).toBeGreaterThan(1);
  });

  it('verändert in der Szene nur Klassen und Variablen, nicht die Zeichenelemente', () => {
    const ohne = zeichne({ code: '4711' });
    const mit = zeichne({ code: '4711', szene: 'scroll' });
    for (const element of ['<path', '<rect', '<circle', '<text']) {
      expect(mit.split(element)).toHaveLength(ohne.split(element).length);
    }
  });

  it('setzt in der Szene nur Zahlen ohne Einheit als Variablen', () => {
    const html = zeichne({ szene: 'scroll' });
    const stile = [...html.matchAll(/<(?:g|path) class="[^"]*sm24-scrub[^"]*" style="([^"]*)"/g)].map((m) => m[1]);
    expect(stile).toHaveLength(11);
    for (const stil of stile) expect(stil).toMatch(/^(?:--(?:stift|feder|schluessel)-\w+:-?\d+(?:\.\d+)?;?)+$/);
  });

  it('ist in der Szene deterministisch', () => {
    const params = { szene: 'scroll', einschnitte: '37264', code: '4711' };
    expect(zeichne(params)).toBe(zeichne(params));
  });

  it('behält eine übergebene className und hängt sm24-szene hinten an', () => {
    const mit = renderToStaticMarkup(
      <StiftzuhaltungGrafik params={{ szene: 'scroll' } as VisualProps['params']} title="" className="mt-4" />,
    );
    expect(mit).toMatch(/^<svg[^>]*class="block h-auto w-full mt-4 sm24-szene"/);
    const ohne = renderToStaticMarkup(
      <StiftzuhaltungGrafik params={{} as VisualProps['params']} title="" className="mt-4" />,
    );
    expect(ohne).toMatch(/^<svg[^>]*class="block h-auto w-full mt-4"/);
  });
});
