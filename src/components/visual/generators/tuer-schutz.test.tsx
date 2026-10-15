import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { TuerSchutzGrafik } from './tuer-schutz';

function zeichne(params: unknown, title: unknown = 'Tür mit Schutzpunkten'): string {
  return renderToStaticMarkup(
    <TuerSchutzGrafik
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

/** Bauteile in Legendenreihenfolge (Nummer 1–5). */
const NAMEN = ['Zusatzschloss', 'Schutzbeschlag', 'Schließzylinder', 'Schließblech', 'Bandseite'];
const FOKUS = ['zylinder', 'beschlag', 'schliessblech', 'zusatzschloss', 'bandseite'];
/** Anzahl der Elemente, die je Fokus die Hervorhebungsklasse tragen. */
const HERVOR: Record<string, number> = {
  zylinder: 1,
  beschlag: 2,
  schliessblech: 1,
  zusatzschloss: 2,
  bandseite: 1,
};
const HERVOR_KLASSE = 'fill-area-soft stroke-area-strong';

/** Zählt, wie oft ein Text als eigenes Textelement vorkommt. */
const vorkommen = (html: string, text: string) => html.split(`>${text}</text>`).length - 1;

/** Marken in Reihenfolge: Ziffer und ob die Marke abgeblendet ist. */
function markenGruppen(html: string): { nummer: string; gedimmt: boolean }[] {
  return [
    ...html.matchAll(/<g( class="opacity-30")?><g class="sm24-pop"[^>]*>.*?>(\d)<\/text>/g),
  ].map((t) => ({ nummer: t[2], gedimmt: t[1] !== undefined }));
}

describe('TuerSchutzGrafik', () => {
  it('zeichnet mit Standardwerten die Tür mit allen fünf Schutzpunkten', () => {
    const html = zeichne({});
    pruefeVertrag(html);
    expect(html).toContain('<title>Tür mit Schutzpunkten</title>');
    expect(zeichne({ fokus: 'alle', nummern: true })).toBe(html);
    expect(zeichne({}, '')).toContain('<title>Schutzpunkte einer Tür</title>');
  });

  it('zeigt genau fünf Marken und fünf Legendenzeilen in Reihenfolge', () => {
    const html = zeichne({});
    expect(html.match(/class="sm24-pop"/g)).toHaveLength(5);
    for (const name of NAMEN) {
      expect(vorkommen(html, name)).toBe(1);
    }
    for (let nummer = 1; nummer <= 5; nummer += 1) {
      expect(vorkommen(html, String(nummer))).toBe(2);
    }
    expect(html.indexOf('Schließzylinder')).toBeLessThan(html.indexOf('Bandseite'));
  });

  it('gibt jeder Fokus eine eigene Ausgabe mit vier abgeblendeten Elementen je Art', () => {
    const ausgaben = ['alle', ...FOKUS].map((fokus) => zeichne({ fokus }));
    ausgaben.forEach(pruefeVertrag);
    expect(new Set(ausgaben).size).toBe(FOKUS.length + 1);

    for (const fokus of FOKUS) {
      const html = zeichne({ fokus });
      /* Marken, Legendenzeilen und Linien der übrigen vier Bauteile */
      expect(html.match(/class="opacity-30"><g class="sm24-pop"/g)).toHaveLength(4);
      expect(html.match(/class="opacity-30"><text/g)).toHaveLength(4);
      expect(html.match(/class="sm24-draw stroke-area opacity-30"/g)).toHaveLength(4);
      expect(html.match(/opacity-30/g)).toHaveLength(12);
      /* Das hervorgehobene Bauteil ist nicht abgeblendet */
      expect(html.split(HERVOR_KLASSE).length - 1).toBe(HERVOR[fokus]);
    }
  });

  it('lässt beim Fokus die Marke, Zeile und Linie des Bauteils unabgeblendet', () => {
    const html = zeichne({ fokus: 'schliessblech' });
    const gruppen = markenGruppen(html);
    expect(gruppen.map((g) => g.nummer)).toEqual(['1', '2', '3', '4', '5']);
    /* Schließblech ist Nummer 4 */
    expect(gruppen.filter((g) => !g.gedimmt).map((g) => g.nummer)).toEqual(['4']);
    expect(html).toContain('class="sm24-draw stroke-area" pathLength="1"');
    expect(html.match(/class="sm24-draw stroke-area" pathLength="1"/g)).toHaveLength(1);
  });

  it('blendet ohne Nummern Marken und Legende aus, aber nicht die Tür', () => {
    for (const nummern of [false, 'false', 'nein', ' Nein ']) {
      const html = zeichne({ nummern });
      pruefeVertrag(html);
      expect(html).not.toContain('sm24-pop');
      expect(html).not.toContain('sm24-draw');
      for (const name of NAMEN) {
        expect(html).not.toContain(name);
      }
      expect(html).toContain('fill-area-muted stroke-foreground');
      expect(html).toContain('fill-surface stroke-foreground');
    }
    expect(zeichne({ nummern: 'ja' })).toBe(zeichne({ nummern: true }));
  });

  it('wirft bei Unsinnswerten nicht und fällt auf den Standard zurück', () => {
    const standard = zeichne({});
    const faelle: unknown[] = [
      null,
      undefined,
      42,
      [],
      'karte',
      { fokus: 7 },
      { fokus: 'tür' },
      { fokus: null },
      { fokus: {} },
      { nummern: 'vielleicht' },
      { nummern: {} },
      { fokus: ['zylinder'], nummern: [false] },
      { constructor: 'zylinder', __proto__: { fokus: 'beschlag' } },
    ];
    for (const params of faelle) {
      expect(() => zeichne(params)).not.toThrow();
      const html = zeichne(params);
      pruefeVertrag(html);
      expect(html).toBe(standard);
    }
  });

  it('setzt einen Ersatztitel, auch bei einem Fokus', () => {
    expect(zeichne({ fokus: 'zylinder' }, '')).toContain(
      '<title>Schutzpunkte einer Tür – Schließzylinder</title>',
    );
    expect(zeichne({ fokus: 'bandseite' }, '   ')).toContain(
      '<title>Schutzpunkte einer Tür – Bandseite</title>',
    );
    expect(zeichne({}, null)).toContain('<title>Schutzpunkte einer Tür</title>');
    expect(zeichne({ fokus: 'beschlag' }, 'Eigener Titel')).toContain(
      '<title>Eigener Titel</title>',
    );
  });

  it('liefert für gleiche Eingaben dieselbe Grafik mit höchstens fünf Bewegungen', () => {
    const params = { fokus: 'beschlag', nummern: 'ja' };
    const html = zeichne(params);
    expect(html).toBe(zeichne({ ...params }));
    expect(html.match(/sm24-pop/g)?.length ?? 0).toBeLessThanOrEqual(5);
  });
});
