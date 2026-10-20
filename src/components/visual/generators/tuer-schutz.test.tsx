import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { TUER_SCHUTZ_AUSSCHNITT, TuerSchutzGrafik } from './tuer-schutz';

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
      /* Marken und Linien der übrigen vier Bauteile sind abgeblendet, die Legende nicht */
      expect(html.match(/class="opacity-30"><g class="sm24-pop"/g)).toHaveLength(4);
      expect(html.match(/class="sm24-draw stroke-area opacity-30"/g)).toHaveLength(4);
      expect(html.match(/opacity-30/g)).toHaveLength(8);
      /* Legendenzeilen der übrigen vier Bauteile: Kennzeichen und Schriftfarbe der Ruhestufe */
      expect(html.match(/data-gedimmt="true"/g)).toHaveLength(4);
      expect(html.match(/class="fill-foreground-subtle stroke-surface font-mono"/g)).toHaveLength(8);
      /* Das hervorgehobene Bauteil ist nicht abgeblendet */
      expect(html.split(HERVOR_KLASSE).length - 1).toBe(HERVOR[fokus]);
    }
  });

  it('blendet Legendentext nie über die Deckkraft ab, auch nicht gedimmt', () => {
    for (const fokus of FOKUS) {
      const html = zeichne({ fokus });
      /* Jede Legendengruppe: Öffnungs-Tag ohne opacity-Klasse, direkt darin nur die Legendentexte */
      const gruppen = [...html.matchAll(/<g([^>]*)>((?:<text[^>]*data-legende[^>]*>[^<]*<\/text>)+)<\/g>/g)];
      expect(gruppen).toHaveLength(NAMEN.length);
      for (const [, attribute] of gruppen) {
        expect(attribute).not.toMatch(/opacity-/);
      }
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

  it('bemisst den Telefon-Ausschnitt für Tür und die vergrößerte Legende', () => {
    const a = TUER_SCHUTZ_AUSSCHNITT;
    const html = zeichne({});
    expect(html.match(/data-legende="true"/g)).toHaveLength(10);
    expect([a.vollBreite, a.vollHoehe]).toEqual([480, 300]);
    expect(a.x).toBeGreaterThanOrEqual(0);
    expect(a.y).toBeGreaterThanOrEqual(0);
    expect(a.x + a.breite).toBeLessThanOrEqual(a.vollBreite);
    expect(a.y + a.hoehe).toBeLessThanOrEqual(a.vollHoehe);
    // Zarge links (x 48, Bolzen ab 40) und Boden (y 272) liegen im Ausschnitt.
    expect(a.x).toBeLessThanOrEqual(30);
    expect(a.y + a.hoehe).toBeGreaterThanOrEqual(276);
    // Längster Name „Schließzylinder“ ab x 320 in 16 Einheiten Mono (≈ 0,6 em je Zeichen).
    expect(a.x + a.breite).toBeGreaterThanOrEqual(320 + 15 * 16 * 0.6 + 2);
    // Gewinn gegenüber der vollen Breite: Faktor ≥ 1,08 bei 16/13 größerer Legende.
    expect(a.vollBreite / a.breite).toBeGreaterThanOrEqual(1.08);
  });

  it('führt die Bandseite außen an der Zarge vorbei unter die Tür, ohne den Boden zu queren', () => {
    const html = zeichne({});
    expect(html).toContain('d="M46 210H34V288"');
    // Keine Führungslinie reicht unter die Zeile 288 (Legende unter der Tür)
    const fuehrungen = [...html.matchAll(/<path class="sm24-draw[^"]*"[^>]* d="([^"]+)"/g)].map((t) => t[1]);
    expect(fuehrungen).toHaveLength(5);
    for (const d of fuehrungen) {
      const ys = [...d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)].flatMap(([, befehl, args]) => {
        const zahlen = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
        if (befehl === 'V') return zahlen;
        if (befehl === 'M' || befehl === 'L') return zahlen.filter((_, i) => i % 2 === 1);
        return [];
      });
      expect(Math.max(...ys)).toBeLessThanOrEqual(288);
    }
  });

  it('setzt die Bandseite links unter der Tür: Ziffer und Name auf der Zeile 292,5', () => {
    const html = zeichne({});
    expect(html).toMatch(/ x="60" y="292.5"[^>]*>Bandseite<\/text>/);
    expect(html).toMatch(/ x="40" y="292.5"[^>]*>5<\/text>/);
  });

  it('gibt dem Telefon-Ausschnitt Höhe bis y 300, damit die Zeile unter der Tür im Bild liegt', () => {
    const a = TUER_SCHUTZ_AUSSCHNITT;
    expect(a.y + a.hoehe).toBeGreaterThanOrEqual(296);
  });
});
