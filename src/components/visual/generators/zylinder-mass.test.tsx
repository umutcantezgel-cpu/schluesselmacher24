import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { hash } from './grafik-basis';
import { ausserhalb, bildschirmPx, textKaesten, ueberlappungen } from '../beschriftung-test-hilfe';
import { ZYLINDER_SCHRIFT, ZylinderMassGrafik } from './zylinder-mass';

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

/** Anfang und Ende jeder Maßlinie in viewBox-Einheiten (die Pfeile liegen 2 Einheiten davor). */
function masslinienEnden(html: string): [number, number][] {
  const treffer = html.matchAll(
    /class="sm24-draw stroke-area-strong"[^>]*?d="M([\d.]+) [\d.]+H([\d.]+)"/g,
  );
  return [...treffer].map((t) => [Number(t[1]) - 2, Number(t[2]) + 2]);
}

describe('ZylinderMassGrafik', () => {
  it('zeichnet mit Standardwerten (Doppelzylinder 30/30)', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Maßzeichnung Zylinder</title>');
    expect(html).toContain('A 30');
    expect(html).toContain('B 30');
    expect(html).toContain('außen');
    expect(html).toContain('innen');
    expect(html).toContain('pathLength="1"');
  });

  it('beschriftet die Maße aus den Parametern', () => {
    const html = zeichne({ aussen: 30, innen: 45 });
    pruefeVertrag(html);
    expect(html).toContain('A 30');
    expect(html).toContain('B 45');
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
    expect(html).not.toContain('B 55');
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
    expect(html).toContain('B 32,5');
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
    expect(begrenzt).toContain('B 100');
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

  it('zeichnet im schmalen Format eine kleinere Fläche mit größerer Schrift', () => {
    const schmal = zeichne({ bauform: 'profil-doppel', aussen: 35, innen: 45, format: 'schmal' });
    expect(schmal).toContain('viewBox="0 0 300 220"');
    expect(schmal).toContain(`font-size="${ZYLINDER_SCHRIFT.schmal}"`);
    expect(schmal).not.toMatch(/font-size="(?!21")/);
    expect(schmal).not.toMatch(/NaN|Infinity|undefined/);
    // Gleiche Maße, gleiches Verhältnis A:I wie im breiten Format.
    const [a, i] = masslinien(schmal);
    expect(a / i).toBeCloseTo(35 / 45, 1);
    // Unbekanntes Format fällt auf das breite zurück.
    pruefeVertrag(zeichne({ format: 'quer' }));
  });

  it('lässt im schmalen Format „außen“ und „innen“ in der Fläche', () => {
    for (const params of [
      { bauform: 'profil-doppel', aussen: 25, innen: 25 },
      { bauform: 'knauf', aussen: 100, innen: 100, knaufseite: 'aussen' },
      { bauform: 'profil-halb', aussen: 60 },
    ]) {
      const html = zeichne({ ...params, format: 'schmal' });
      const aussenX = Number(/text-anchor="end" x="([\d.]+)"[^>]*>außen</.exec(html)?.[1]);
      const innenX = Number(/text-anchor="start" x="([\d.]+)"[^>]*>innen</.exec(html)?.[1]);
      // Fünf Zeichen Mono in 21 Einheiten sind 63 Einheiten breit.
      expect(aussenX - 5 * ZYLINDER_SCHRIFT.schmal * 0.6).toBeGreaterThanOrEqual(0);
      expect(innenX + 5 * ZYLINDER_SCHRIFT.schmal * 0.6).toBeLessThanOrEqual(300);
    }
  });

  it('zeichnet ohne die neuen Parameter das Standardbild unverändert', () => {
    // Fingerabdruck des Standardbilds: Länge und FNV-1a-Hash des Markups. Neu genommen mit FA-QA-04D
    // (Schrift 23, Beschriftung in Zeilen unter dem Zylinder, Maßstab mit Platz für drei Zeilen,
    // gleich mit und ohne Beschlag); vorher 3979 Zeichen, Hash 707467243.
    const basis = zeichne({});
    expect(basis).toHaveLength(4244);
    expect(hash(basis)).toBe(2908997467);
    expect(zeichne({ beschlag: 'aus', ueberstand: 'an' })).toBe(basis);
    // Der Überstand wirkt nur zusammen mit dem Schutzbeschlag.
    expect(zeichne({ ueberstand: 'an' })).toBe(basis);
    expect(zeichne({ beschlag: 'ja', ueberstand: 42 })).toBe(basis);
  });

  it('zeichnet mit Schutzbeschlag Türblatt, Platte und die Strecke Überstand ohne Zahl', () => {
    const html = zeichne({ beschlag: 'an', aussen: 30, innen: 30 });
    pruefeVertrag(html);
    expect(html).toContain('class="fill-surface-muted stroke-border-strong"');
    expect(html).toContain('class="fill-area-muted stroke-foreground" stroke-width="1.5"');
    expect(html.match(/Überstand/g)).toHaveLength(1);
    expect(html).toContain('>Überstand</text>');
    // Der Überstand trägt keine Zahl; Maßangaben bleiben A und B.
    expect(html).not.toMatch(/Überstand\s*\d|\d\s*Überstand/);
    expect(html).toContain('A 30');
    expect(html).toContain('B 30');
  });

  it('lässt Maß A und B mit Schutzbeschlag unverändert, Stulpschraube und Zylinderende bleiben Bezug', () => {
    const ohne = zeichne({ aussen: 35, innen: 45 });
    const mit = zeichne({ aussen: 35, innen: 45, beschlag: 'an' });
    // Der Maßstab rechnet immer mit dem Platz der Zeile „Überstand“: A und B stehen gleich (E5-GRAFIKER-01).
    expect(masslinienEnden(mit)).toEqual(masslinienEnden(ohne));
    for (const format of ['breit', 'schmal'] as const) {
      expect(masslinienEnden(zeichne({ aussen: 35, innen: 45, beschlag: 'an', format }))).toEqual(
        masslinienEnden(zeichne({ aussen: 35, innen: 45, format })),
      );
    }
    for (const html of [ohne, mit]) {
      const [a, b] = masslinienEnden(html);
      // Maß A endet an der Mitte der Stulpschraube, dort beginnt Maß B.
      expect(a[1]).toBeCloseTo(b[0], 1);
      expect((a[1] - a[0]) / (b[1] - b[0])).toBeCloseTo(35 / 45, 2);
      // Die Bezugslinie der Stulpschraube steht auf der Grenze von A und B.
      const bezug = /class="stroke-area-strong" stroke-width="1" stroke-dasharray="[^"]+" d="M([\d.]+) /.exec(html);
      expect(Number(bezug![1])).toBeCloseTo(a[1], 1);
      // Die Zeichnung ist um die ganze Spanne zentriert.
      expect(a[0] + b[1]).toBeCloseTo(480, 0);
    }
  });

  it('setzt die Platte zwischen Strecke und Türblatt, die Stulpschraube liegt im Türblatt', () => {
    const html = zeichne({ beschlag: 'an', aussen: 30, innen: 30 });
    const strecke = /class="stroke-foreground-muted" stroke-width="1.5" d="M([\d.]+) [\d.]+H([\d.]+)"/.exec(html);
    const platte = /class="fill-area-muted stroke-foreground" stroke-width="1.5" x="([\d.]+)"/.exec(html);
    const tuer = /class="fill-surface-muted stroke-border-strong" stroke-width="1" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/.exec(html);
    expect(strecke).not.toBeNull();
    expect(platte).not.toBeNull();
    expect(tuer).not.toBeNull();
    const [a, b] = masslinienEnden(html);
    // Strecke vom Zylinderende (Anfang von Maß A) bis zur Platte; die Platte ist 6 Einheiten breit.
    expect(Number(strecke![1]) - 2).toBeCloseTo(a[0], 1);
    expect(Number(strecke![2]) + 2).toBeCloseTo(Number(platte![1]), 1);
    expect(Number(tuer![1])).toBeCloseTo(Number(platte![1]) + 6, 1);
    // Das Türblatt reicht bis zur Innenseite (Ende von Maß B) und umfasst die Mitte (x 240).
    const tuerEnde = Number(tuer![1]) + Number(tuer![2]);
    expect(tuerEnde).toBeCloseTo(b[1], 1);
    expect(a[1]).toBe(240);
    expect(Number(tuer![1])).toBeLessThan(240);
    expect(tuerEnde).toBeGreaterThan(240);
  });

  it('zeichnet bei Außenknauf keinen Schutzbeschlag', () => {
    const params = { bauform: 'knauf', aussen: 35, innen: 30, knaufseite: 'aussen' };
    expect(zeichne({ ...params, beschlag: 'an' })).toBe(zeichne(params));
  });

  it('liest beschlag und ueberstand wie andere Auswahltexte', () => {
    expect(zeichne({ beschlag: ' AN ' })).toBe(zeichne({ beschlag: 'an' }));
    expect(zeichne({ beschlag: 'an', ueberstand: ' Aus ' })).not.toContain('Überstand');
    // Unbekannter Wert: Standard „an“, die Strecke bleibt sichtbar.
    expect(zeichne({ beschlag: 'an', ueberstand: 'vielleicht' })).toBe(
      zeichne({ beschlag: 'an' }),
    );
  });

  it('hält die Beschriftungen mit Beschlag im schmalen Format in der Fläche und ohne Überschneidung', () => {
    const faelle = [
      { aussen: 25, innen: 25 },
      { aussen: 100, innen: 100 },
      { bauform: 'profil-halb', aussen: 60 },
      { bauform: 'knauf', aussen: 35, innen: 40, knaufseite: 'innen' },
    ];
    for (const params of faelle) {
      const html = zeichne({ ...params, beschlag: 'an', format: 'schmal' });
      expect(html).toContain('viewBox="0 0 300 220"');
      expect(html).toContain(`font-size="${ZYLINDER_SCHRIFT.schmal}"`);
      expect(html).not.toMatch(/NaN|Infinity|undefined/);
      const kaesten = textKaesten(html);
      const ueber = kaesten.find((k) => k.inhalt === 'Überstand');
      const mitte = kaesten.find((k) => k.inhalt === 'Mitte Stulpschraube');
      expect(ueber).toBeDefined();
      expect(mitte).toBeDefined();
      // „Überstand“ und „Mitte Stulpschraube“ ganz in der Fläche, ohne Überschneidung; Mitte darunter.
      expect(ausserhalb(kaesten, 300, 220)).toEqual([]);
      expect(ueberlappungen(kaesten)).toEqual([]);
      expect(mitte!.oben).toBeGreaterThanOrEqual(ueber!.unten);
    }
  });

  it('zeichnet alle Kombinationen aus Bauform, Knaufseite, Format und Überstand ohne Fehler', () => {
    for (const bauform of ['profil-doppel', 'profil-halb', 'knauf']) {
      for (const knaufseite of ['innen', 'aussen']) {
        for (const format of ['breit', 'schmal']) {
          for (const ueberstand of ['an', 'aus']) {
            const html = zeichne({
              bauform,
              knaufseite,
              format,
              beschlag: 'an',
              ueberstand,
              aussen: 27.5,
              innen: '32,5',
            });
            expect(html).toMatch(/^<svg[^>]*\brole="img"/);
            expect(html).not.toMatch(/\bid=|NaN|Infinity|undefined/);
            expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}|rgb\(|oklch\(/);
          }
        }
      }
    }
    // Der Halbzylinder zeigt weiter nur Maß A, auch mit Beschlag.
    expect(masslinienEnden(zeichne({ bauform: 'profil-halb', aussen: 40, innen: 55, beschlag: 'an' }))).toHaveLength(1);
  });

  it('setzt jede Beschriftung auf dem Telefon mindestens 14 px groß, in der Fläche und frei (FA-QA-04D)', () => {
    // Schmal: Karte der Startseite bei 360 px (206 px). Breit: Konfigurator auf dem Telefon (294 px).
    expect(bildschirmPx(ZYLINDER_SCHRIFT.schmal, 206, 300)).toBeGreaterThanOrEqual(14);
    expect(bildschirmPx(ZYLINDER_SCHRIFT.breit, 294, 480)).toBeGreaterThanOrEqual(14);
    for (const format of ['breit', 'schmal'] as const) {
      const [breite, hoehe] = format === 'breit' ? [480, 270] : [300, 220];
      for (const bauform of ['profil-doppel', 'profil-halb', 'knauf']) {
        for (const knaufseite of ['innen', 'aussen']) {
          for (const [aussen, innen] of [
            [25, 25],
            [30, 40],
            [100, 100],
            [100, 25],
          ]) {
            for (const beschlag of ['an', 'aus']) {
              const params = { format, bauform, knaufseite, aussen, innen, beschlag };
              const html = zeichne(params);
              const kaesten = textKaesten(html);
              for (const k of kaesten) expect(k.groesse).toBe(ZYLINDER_SCHRIFT[format]);
              expect(ausserhalb(kaesten, breite, hoehe), JSON.stringify(params)).toEqual([]);
              expect(ueberlappungen(kaesten), JSON.stringify(params)).toEqual([]);
              // Die Zeilen unter dem Zylinder beginnen unter seiner Unterkante und dem Türblatt.
              const unterkante = Math.max(
                ...[...html.matchAll(/<rect[^>]* y="([\d.]+)"[^>]* height="([\d.]+)"/g)].map((t) => Number(t[1]) + Number(t[2])),
                0,
              );
              for (const k of kaesten.filter((t) => ['außen', 'innen', 'Mitte Stulpschraube', 'Überstand'].includes(t.inhalt))) {
                expect(k.oben).toBeGreaterThanOrEqual(unterkante);
              }
            }
          }
        }
      }
    }
  });
});
