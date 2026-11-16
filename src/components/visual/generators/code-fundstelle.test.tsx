import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { CODE_FUNDSTELLE_AUSSCHNITT, CodeFundstelleGrafik, HINWEIS_SCHRIFT } from './code-fundstelle';

function zeichne(params: unknown, title: unknown = 'Fundstelle der Schlüsselnummer'): string {
  return renderToStaticMarkup(
    <CodeFundstelleGrafik
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

const ORTE = ['schluesselkopf', 'sicherungskarte', 'zylinderstirn'];

describe('CodeFundstelleGrafik', () => {
  it('zeichnet mit Standardwerten die Fundstelle am Schlüsselkopf', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Fundstelle der Schlüsselnummer</title>');
    expect(zeichne({ ort: 'schluesselkopf' })).toBe(html);
  });

  it('zeichnet jeden Ort eigenständig mit Markierung und Lupe', () => {
    const ausgaben = ORTE.map((ort) => zeichne({ ort }));
    for (const html of ausgaben) {
      pruefeVertrag(html);
      expect(html).toContain('sm24-pop');
      expect(html).toContain('stroke-dasharray="5 5"');
      expect((html.match(/class="sm24-draw stroke-area"/g) ?? []).length).toBe(2);
    }
    expect(new Set(ausgaben).size).toBe(ORTE.length);
  });

  it('zeigt keine Ziffern, sondern nur Platzhalter-Striche', () => {
    for (const ort of ORTE) {
      const html = zeichne({ ort });
      expect(html).not.toContain('<text');
      expect(html).toMatch(/class="sm24-draw stroke-foreground-muted" pathLength="1"/);
    }
  });

  it('wirft bei Unsinnswerten nicht', () => {
    const faelle: unknown[] = [{ ort: 42 }, { ort: {} }, { ort: 'dach' }, { ort: ['karte'] }, null, undefined, 7];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      pruefeVertrag(zeichne(params));
    }
  });

  it('setzt einen Ersatztitel je Ort und bleibt deterministisch', () => {
    expect(zeichne({ ort: 'zylinderstirn' }, '')).toContain(
      '<title>Schlüsselnummer auf der Stirnseite des Zylinders</title>',
    );
    expect(zeichne({ ort: 'sicherungskarte' })).toBe(zeichne({ ort: ' Sicherungskarte ' }));
  });

  it('beschriftet nur den Schlüsselkopf, und nur mit beschriftung: true', () => {
    const html = zeichne({ ort: 'schluesselkopf', beschriftung: true });
    pruefeVertrag(html);
    const texte = html.match(/<text[^>]*>[^<]*<\/text>/g) ?? [];
    expect(texte).toHaveLength(1);
    // Ohne data-legende: Das Attribut gibt es nicht mehr (frühere Regel in globals.css: 16 Einheiten im Ausschnitt).
    expect(texte[0]).not.toContain('data-legende');
    expect(texte[0]).toContain(`font-size="${HINWEIS_SCHRIFT}"`);
    expect(texte[0]).toContain('>Am Schlüsselkopf</text>');
    const inhalt = />([^<]*)<\/text>/.exec(texte[0] as string)?.[1] ?? '';
    expect(inhalt).toBe('Am Schlüsselkopf');
    expect(inhalt).not.toMatch(/\d/);
    expect(html).toContain('d="M128 190V234"');
    for (const ort of ['sicherungskarte', 'zylinderstirn']) {
      expect(zeichne({ ort, beschriftung: true })).not.toContain('<text');
    }
  });

  it('bleibt ohne gültiges beschriftung gleich dem Standard', () => {
    const standard = zeichne({});
    for (const beschriftung of [false, 'nein', 42, {}, 'vielleicht']) {
      expect(zeichne({ ort: 'schluesselkopf', beschriftung })).toBe(standard);
    }
    expect(zeichne({ beschriftung: 'Ja ' })).not.toBe(standard);
    expect(zeichne({ beschriftung: '1' })).toBe(zeichne({ beschriftung: true }));
  });

  it('gibt jedem Element der Bewegung Dauer und hält jede Animation unter 1,6 s', () => {
    for (const ort of ORTE) {
      const html = zeichne({ ort, beschriftung: true });
      const tags = html.match(/<[a-z]+[^>]*class="[^"]*sm24-(draw|pop)[^"]*"[^>]*>/g) ?? [];
      expect(tags.length).toBeGreaterThan(0);
      for (const tag of tags) {
        expect(tag).toMatch(/--sm24-duration:[\d.]+s/);
        const dauer = Number(/--sm24-duration:([\d.]+)s/.exec(tag)?.[1]);
        const beginn = Number(/--sm24-delay:([\d.]+)s/.exec(tag)?.[1] ?? 0);
        expect(beginn + dauer).toBeLessThanOrEqual(1.6);
      }
    }
  });

  it('zeichnet in der Reihenfolge Fundkreis, Linien, Lupe, Striche', () => {
    const lese = (tag: string) => ({
      beginn: Number(/--sm24-delay:([\d.]+)s/.exec(tag)?.[1] ?? 0),
      ende:
        Number(/--sm24-delay:([\d.]+)s/.exec(tag)?.[1] ?? 0)
        + Number(/--sm24-duration:([\d.]+)s/.exec(tag)?.[1]),
    });
    for (const ort of ORTE) {
      const html = zeichne({ ort });
      const tags = html.match(/<[a-z]+[^>]*class="[^"]*sm24-(draw|pop)[^"]*"[^>]*>/g) ?? [];
      const fundkreis = tags.find((t) => t.includes('class="sm24-pop stroke-area-strong"'));
      const linien = tags.filter((t) => t.includes('class="sm24-draw stroke-area"'));
      const lupe = tags.find((t) => t.startsWith('<g class="sm24-pop"'));
      const striche = tags.filter((t) => t.includes('class="sm24-draw stroke-foreground-muted"'));
      expect(fundkreis && lupe).toBeTruthy();
      expect(linien).toHaveLength(2);
      const [kreis, lupeZeit] = [lese(fundkreis as string), lese(lupe as string)];
      const ersteLinie = lese(linien[0] as string);
      expect(kreis.beginn).toBeLessThan(ersteLinie.beginn);
      expect(lupeZeit.beginn).toBeGreaterThanOrEqual(ersteLinie.ende - 0.05);
      for (const linie of linien) expect(lese(linie).beginn).toBeLessThan(lupeZeit.beginn);
      for (const strich of striche) expect(lese(strich).beginn).toBeGreaterThanOrEqual(lupeZeit.beginn);
    }
  });

  it('nutzt beim Schlüsselkopf keine vollflächige Muted-Fläche mehr', () => {
    const html = zeichne({ ort: 'schluesselkopf' });
    expect(html).not.toContain('fill-area-muted');
    expect(html).toContain('fill-area-soft');
  });

  it('bemisst den Telefon-Ausschnitt für Kopf, Lupe und Beschriftung', () => {
    const a = CODE_FUNDSTELLE_AUSSCHNITT;
    expect([a.vollBreite, a.vollHoehe]).toEqual([480, 270]);
    expect(a.x).toBeGreaterThanOrEqual(0);
    expect(a.y).toBeGreaterThanOrEqual(0);
    expect(a.x + a.breite).toBeLessThanOrEqual(a.vollBreite);
    expect(a.y + a.hoehe).toBeLessThanOrEqual(a.vollHoehe);
    // Kopfkontur (x ab 36, Strich 2,25), Lupenring (y ab 33,5), Griffende (x bis ≈ 448, Kappe bis 455)
    expect(a.x).toBeLessThanOrEqual(34);
    expect(a.y).toBeLessThanOrEqual(33);
    expect(a.x + a.breite).toBeGreaterThanOrEqual(455);
    // Textunterkante der Beschriftung (Grundlinie y 254, Unterlänge rund 0,25 em)
    expect(a.y + a.hoehe).toBeGreaterThanOrEqual(254 + HINWEIS_SCHRIFT * 0.25);
    // Beschriftung „Am Schlüsselkopf“ (mittig bei x 128, 16 Zeichen × 0,6 em) bleibt im Fenster
    const halbe = (16 * HINWEIS_SCHRIFT * 0.6) / 2;
    expect(a.x).toBeLessThanOrEqual(128 - halbe);
    expect(a.x + a.breite).toBeGreaterThanOrEqual(128 + halbe);
    expect(a.vollBreite / a.breite).toBeGreaterThanOrEqual(1.08);
  });

  it('setzt „Am Schlüsselkopf“ auf dem Telefon mit mindestens 14 px, frei und in der Fläche (FA-QA-04D)', () => {
    // /schluessel-nach-code bei 360 px: Ausschnitt (440 Einheiten) über 320 px Inhaltsbreite.
    expect((HINWEIS_SCHRIFT * 320) / CODE_FUNDSTELLE_AUSSCHNITT.breite).toBeGreaterThanOrEqual(14);
    // Bei 1280 px: volle Zeichnung in 5 von 12 Spalten, etwa 472 px.
    expect((HINWEIS_SCHRIFT * 472) / 480).toBeGreaterThanOrEqual(14);
    const html = zeichne({ ort: 'schluesselkopf', beschriftung: true });
    const text = /<text[^>]*x="([0-9.]+)" y="([0-9.]+)"[^>]*>([^<]*)<\/text>/.exec(html);
    expect(text).not.toBeNull();
    const [x, y] = [Number(text![1]), Number(text![2])];
    const halbe = ([...text![3]].length * HINWEIS_SCHRIFT * 0.6) / 2;
    expect(x - halbe).toBeGreaterThanOrEqual(0);
    expect(x + halbe).toBeLessThanOrEqual(480);
    expect(y + HINWEIS_SCHRIFT * 0.25).toBeLessThanOrEqual(270);
    // Die Hinweislinie endet über der Schrift (Oberlänge rund 0,75 em), der Bart (bis y 188) liegt darüber.
    // Linienende aus dem Markup: die senkrechte Hinweislinie über der Schrift (gleiches x).
    const linie = [...html.matchAll(/d="M([0-9.]+) ([0-9.]+)V([0-9.]+)"/g)].find((t) => Number(t[1]) === x);
    expect(linie).toBeDefined();
    const ende = Math.max(Number(linie![2]), Number(linie![3]));
    expect(ende).toBeLessThanOrEqual(y - HINWEIS_SCHRIFT * 0.75);
    expect(188).toBeLessThan(y - HINWEIS_SCHRIFT);
  });
});
