import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { ausschnittAusQuelle, ausserhalb, bildschirmPx, textKaesten, ueberlappungen } from '../beschriftung-test-hilfe';
import { STIFT_SCHRIFT, SZENE_SCHRIFT, StiftzuhaltungGrafik } from './stiftzuhaltung';
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

  // Fingerabdrücke neu genommen mit FA-QA-04D (Schrift 22, „Trennlinie“ bei x 146); geändert sind nur
  // Schriftgröße und Lage der zwei Beschriftungen, die Länge jeder Ausgabe ist gleich geblieben.
  it('ohne szene bleibt die Ausgabe unverändert (Fingerabdruck vor E6-GRAFIKER-11)', () => {
    const fingerabdruecke: [unknown, number, number][] = [
      [{}, 2348589670, 7362],
      [{ zustand: 'passt-nicht' }, 458589357, 8132],
      [{ zustand: 'abgebrochen', code: '500' }, 580167323, 8179],
      [{ zustand: 'passt-nicht', einschnitte: '37264', code: '4711' }, 3072678790, 8258],
      [{ zustand: 'passt', einschnitte: '37264' }, 3539121810, 7362],
      [{ zustand: 'passt', code: '404' }, 100318785, 7487],
      [{ zustand: 'passt', einschnitte: [9, 0, 9, 0, 9], code: '9' }, 4180095455, 7485],
      [{ zustand: 'abgebrochen' }, 3564876458, 8054],
      [{ einschnitte: [1, 2, 3, 4, 5], code: 12 }, 2403287969, 7474],
      [{ code: 7 }, 4014084124, 7485],
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

describe('StiftzuhaltungGrafik – Schrift auf dem Bildschirm (FA-QA-04D)', () => {
  /*
   * Ausschnitt der Szene auf /gleichschliessende-zylinder, aus dem Quelltext der Seite gelesen
   * (Seiten dürfen in Next.js keine Werte exportieren). Ändert die Seite ihn, prüft der Test den neuen Wert.
   */
  const SZENE_AUSSCHNITT = ausschnittAusQuelle(
    readFileSync(join(process.cwd(), 'src/app/(site)/gleichschliessende-zylinder/page.tsx'), 'utf8'),
    'STIFTZUHALTUNG_AUSSCHNITT',
  ) as { x: number; y: number; breite: number; hoehe: number };

  it('liest den Ausschnitt der Seite aus ihrem Quelltext', () => {
    expect(SZENE_AUSSCHNITT).toMatchObject({ x: 58, y: 30, breite: 370, hoehe: 200 });
  });

  it('erreicht bei 360 px Fensterbreite mindestens 14 px', () => {
    // Fehlerseiten: ganze Zeichnung über 318 px; Szene: Ausschnitt bis an den Rand (360 px).
    expect(bildschirmPx(STIFT_SCHRIFT, 318, 480)).toBeGreaterThanOrEqual(14);
    expect(bildschirmPx(SZENE_SCHRIFT, 360, SZENE_AUSSCHNITT.breite)).toBeGreaterThanOrEqual(14);
  });

  it('hält Code und „Trennlinie“ in der Fläche, getrennt und links vor dem Gehäuse', () => {
    for (const params of [{ code: '4711' }, { zustand: 'passt-nicht', code: '4711' }, { zustand: 'abgebrochen', code: '500' }]) {
      const kaesten = textKaesten(zeichne(params));
      expect(kaesten.map((k) => k.inhalt).sort()).toEqual([String(params.code), 'Trennlinie'].sort());
      for (const k of kaesten) expect(k.groesse).toBe(STIFT_SCHRIFT);
      expect(ausserhalb(kaesten, 480, 270)).toEqual([]);
      expect(ueberlappungen(kaesten)).toEqual([]);
      const trenn = kaesten.find((k) => k.inhalt === 'Trennlinie')!;
      // Vor dem Gehäuse (x 150), über der Trennlinie (y 118)
      expect(trenn.rechts).toBeLessThanOrEqual(150);
      expect(trenn.unten).toBeLessThanOrEqual(118);
    }
  });

  it('zeigt „Trennlinie“ in der Szene ganz im Ausschnitt der Seite', () => {
    const [trenn] = textKaesten(zeichne({ szene: 'scroll' }));
    expect(trenn.inhalt).toBe('Trennlinie');
    expect(trenn.groesse).toBe(SZENE_SCHRIFT);
    expect(trenn.links).toBeGreaterThanOrEqual(SZENE_AUSSCHNITT.x);
    expect(trenn.oben).toBeGreaterThanOrEqual(SZENE_AUSSCHNITT.y);
    expect(trenn.rechts).toBeLessThanOrEqual(Math.min(150, SZENE_AUSSCHNITT.x + SZENE_AUSSCHNITT.breite));
    expect(trenn.unten).toBeLessThanOrEqual(SZENE_AUSSCHNITT.y + SZENE_AUSSCHNITT.hoehe);
  });
});
