import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import { ABLAUF_FLAECHE, AblaufGrafik, ablaufHoehe, ablaufSchritte } from './ablauf';

function zeichne(params: unknown, title: unknown = 'Ablauf'): string {
  return renderToStaticMarkup(
    <AblaufGrafik params={params as VisualProps['params']} title={title as VisualProps['title']} />,
  );
}

function pruefeVertrag(html: string, breite: number, hoehe: number) {
  expect(html).toMatch(/^<svg[^>]*\brole="img"/);
  expect(html).toMatch(/^<svg[^>]*><title>[^<]+<\/title>/);
  expect(html).toContain(`viewBox="0 0 ${breite} ${hoehe}"`);
  expect(html).toContain('preserveAspectRatio="xMidYMid meet"');
  expect(html).not.toMatch(/\bid=/);
  expect(html).not.toMatch(/#[0-9a-f]{3,6}/i);
  expect(html).not.toContain('rgb(');
  expect(html).not.toContain('oklch(');
  expect(html).not.toContain('<marker');
  expect(html).not.toMatch(/NaN|Infinity|undefined/);
}

function attribut(tag: string, name: string): string | undefined {
  return new RegExp(`(?:^|\\s)${name}="([^"]*)"`).exec(tag)?.[1];
}

interface Beschriftung {
  inhalt: string;
  x: number;
  y: number;
  groesse: number;
  anker: string | undefined;
  beschriftung: boolean;
}

/** Alle Texte: Nummern (Klasse ohne `-muted`) und Beschriftungen (`fill-foreground-muted`). */
function texte(html: string): Beschriftung[] {
  return [...html.matchAll(/<text([^>]*)>([^<]*)<\/text>/g)].map(([, tag, inhalt]) => ({
    inhalt,
    x: Number(attribut(tag, 'x')),
    y: Number(attribut(tag, 'y')),
    groesse: Number(attribut(tag, 'font-size')),
    anker: attribut(tag, 'text-anchor'),
    beschriftung: (attribut(tag, 'class') ?? '').includes('fill-foreground-muted'),
  }));
}

const beschriftungen = (html: string) => texte(html).filter((t) => t.beschriftung);
const nummern = (html: string) => texte(html).filter((t) => !t.beschriftung).map((t) => t.inhalt);

/** Breite einer Beschriftung nach der Schätzung aus dem Auftrag (Mono, 0,6 em). */
const breiteSchaetzung = (t: Beschriftung) => [...t.inhalt].length * t.groesse * 0.6;

/** Punkte absoluter Pfadbefehle M, L, H, V (ohne Kurven, wie sie die Generatoren nutzen). */
function punkte(d: string): [number, number][] {
  const ausgabe: [number, number][] = [];
  let x = 0;
  let y = 0;
  for (const [, befehl, argumente] of d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const zahlen = (argumente.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    if (befehl === 'H') {
      for (const wert of zahlen) {
        x = wert;
        ausgabe.push([x, y]);
      }
    } else if (befehl === 'V') {
      for (const wert of zahlen) {
        y = wert;
        ausgabe.push([x, y]);
      }
    } else if (befehl !== 'Z') {
      for (let k = 0; k + 1 < zahlen.length; k += 2) {
        x = zahlen[k];
        y = zahlen[k + 1];
        ausgabe.push([x, y]);
      }
    }
  }
  return ausgabe;
}

/** Alle gezeichneten Punkte (ohne das Raster) müssen innerhalb der Fläche liegen. */
function pruefeInnerhalb(html: string, breite: number, hoehe: number) {
  const pfade = [...html.matchAll(/<path([^>]*)\/>/g)]
    .map((t) => t[1])
    .filter((tag) => !(attribut(tag, 'class') ?? '').includes('stroke-area-muted'));
  for (const tag of pfade) {
    for (const [x, y] of punkte(attribut(tag, 'd') ?? '')) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(breite);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(hoehe);
    }
  }
  for (const [tag] of html.matchAll(/<circle([^>]*)\/>/g)) {
    const cx = Number(attribut(tag, 'cx'));
    const cy = Number(attribut(tag, 'cy'));
    const radius = Number(attribut(tag, 'r'));
    expect(cx - radius).toBeGreaterThanOrEqual(0);
    expect(cx + radius).toBeLessThanOrEqual(breite);
    expect(cy - radius).toBeGreaterThanOrEqual(0);
    expect(cy + radius).toBeLessThanOrEqual(hoehe);
  }
  for (const t of texte(html)) {
    const halb = t.anker === 'middle' ? breiteSchaetzung(t) / 2 : 0;
    const links = t.anker === 'end' ? t.x - breiteSchaetzung(t) : t.x - halb;
    const rechts = t.anker === 'start' ? t.x + breiteSchaetzung(t) : t.x + halb;
    expect(links).toBeGreaterThanOrEqual(0);
    expect(rechts).toBeLessThanOrEqual(breite);
    expect(t.y).toBeLessThanOrEqual(hoehe);
  }
}

/** Gestaffelte Verzögerungen und Dauern aller Bewegungselemente (Sekunden). */
function bewegung(html: string) {
  const elemente = [...html.matchAll(/<(g|path|circle|text)([^>]*)>/g)]
    .map((t) => t[2])
    .filter((tag) => (attribut(tag, 'class') ?? '').includes('sm24-'))
    .map((tag) => {
      const stil = attribut(tag, 'style') ?? '';
      const verzoegerung = /--sm24-delay:([\d.]+)s/.exec(stil)?.[1];
      const dauer = /--sm24-duration:([\d.]+)s/.exec(stil)?.[1];
      return {
        klasse: attribut(tag, 'class') ?? '',
        verzoegerung: verzoegerung === undefined ? undefined : Number(verzoegerung),
        dauer: dauer === undefined ? undefined : Number(dauer),
      };
    });
  return elemente;
}

describe('AblaufGrafik', () => {
  it('zeichnet ohne Parameter drei Stationen nur mit Nummern', () => {
    const html = zeichne({});
    pruefeVertrag(html, 480, 270);
    expect(html).toContain('<title>Ablauf</title>');
    expect(nummern(html)).toEqual(['01', '02', '03']);
    expect(beschriftungen(html)).toHaveLength(0);
    expect(html.match(/class="fill-surface stroke-area"/g)).toHaveLength(3);
  });

  it('setzt einen Ersatztitel, wenn der Titel fehlt', () => {
    for (const title of [null, '  ', 42]) {
      const html = zeichne({}, title);
      expect(html).toContain('<title>Ablauf in Schritten</title>');
    }
  });

  it('zeigt die Beschriftungen in der übergebenen Reihenfolge', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen' });
    pruefeVertrag(html, 480, 270);
    expect(beschriftungen(html).map((t) => t.inhalt)).toEqual(['sichern', 'prüfen', 'bestellen']);
    expect(nummern(html)).toEqual(['01', '02', '03']);
  });

  it('zeichnet zwei und vier Schritte', () => {
    const zwei = zeichne({ schritte: 'messen|bestellen' });
    pruefeVertrag(zwei, 480, 270);
    expect(beschriftungen(zwei).map((t) => t.inhalt)).toEqual(['messen', 'bestellen']);
    expect(nummern(zwei)).toEqual(['01', '02']);

    const vier = zeichne({ schritte: 'a|b|c|d' });
    pruefeVertrag(vier, 480, 270);
    expect(nummern(vier)).toEqual(['01', '02', '03', '04']);
    expect(beschriftungen(vier).map((t) => t.inhalt)).toEqual(['a', 'b', 'c', 'd']);
  });

  it('lässt leere Einträge entfallen', () => {
    expect(ablaufSchritte({ schritte: ' sichern | prüfen || bestellen | ' })).toEqual([
      'sichern',
      'prüfen',
      'bestellen',
    ]);
  });

  it('fällt bei zu langen oder zu vielen Einträgen auf den Standard zurück', () => {
    const standard = zeichne({});
    expect(zeichne({ schritte: 'eins' })).toBe(standard);
    expect(zeichne({ schritte: 'a|b|c|d|e' })).toBe(standard);
    expect(zeichne({ schritte: 'kurz|dieser Eintrag ist viel zu lang' })).toBe(standard);
    expect(zeichne({ schritte: 'a|||' })).toBe(standard);
    expect(zeichne({ schritte: 42 })).toBe(standard);
    expect(ablaufSchritte({ schritte: 'a|b|c|d|e' })).toEqual([]);
    expect(ablaufSchritte({ schritte: 'a|sehr lange beschriftung' })).toEqual([]);
    expect(ablaufSchritte(null)).toEqual([]);
    expect(ablaufSchritte({})).toEqual([]);
  });

  it('nimmt genau 14 Zeichen an', () => {
    const vierzehn = 'abcdefghijklmn';
    expect(ablaufSchritte({ schritte: `${vierzehn}|x` })).toEqual([vierzehn, 'x']);
  });

  it('färbt genau eine Station, wenn aktiv gesetzt ist', () => {
    const html = zeichne({ schritte: 'a|b|c', aktiv: 2 });
    pruefeVertrag(html, 480, 270);
    expect(html.match(/class="fill-area-soft stroke-area-strong"/g)).toHaveLength(1);
    expect(html.match(/class="fill-surface stroke-area"/g)).toHaveLength(2);
    expect(html).toContain('class="font-mono fill-area-strong"');
    expect(html.match(/class="font-mono fill-area-strong"/g)).toHaveLength(1);
    expect(texte(html).find((t) => t.inhalt === '02')).toBeDefined();
  });

  it('lässt ohne aktiv oder bei ungültigem Wert keine Station hervorheben', () => {
    for (const params of [{ schritte: 'a|b|c' }, { schritte: 'a|b|c', aktiv: 0 }, { schritte: 'a|b|c', aktiv: 'abc' }]) {
      const html = zeichne(params);
      expect(html).not.toContain('stroke-area-strong');
      expect(html).not.toContain('fill-area-strong');
    }
  });

  it('zeichnet das schmale Format senkrecht mit eigener Höhe', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen', format: 'schmal' });
    pruefeVertrag(html, 300, ablaufHoehe(3));
    expect(ablaufHoehe(3)).toBe(224);
    expect(ablaufHoehe(4)).toBe(292);
    expect(ablaufHoehe(2)).toBe(156);
    // Beschriftung rechts neben dem Kreis, Stationen untereinander.
    const labels = beschriftungen(html);
    expect(labels.every((t) => t.anker === 'start')).toBe(true);
    expect(new Set(labels.map((t) => t.x)).size).toBe(1);
    expect(labels[0].y).toBeLessThan(labels[1].y);
    expect(labels[1].y).toBeLessThan(labels[2].y);
  });

  it('zeichnet das breite Format mit Beschriftung mittig unter der Station', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen' });
    for (const t of beschriftungen(html)) {
      expect(t.anker).toBe('middle');
    }
  });

  it('erfüllt die Mindestschrift für Telefonbreiten in beiden Formaten', () => {
    const breit = zeichne({ schritte: 'sichern|prüfen|bestellen' });
    const schmal = zeichne({ schritte: 'sichern|prüfen|bestellen', format: 'schmal' });
    expect(ABLAUF_FLAECHE.breit.breite).toBe(480);
    expect(ABLAUF_FLAECHE.breit.hoehe).toBe(270);
    expect(ABLAUF_FLAECHE.schmal.breite).toBe(300);
    for (const [html, breite] of [
      [breit, 480],
      [schmal, 300],
    ] as const) {
      for (const t of texte(html)) {
        expect((t.groesse * 358) / breite).toBeGreaterThanOrEqual(11.5);
      }
    }
    expect(breit).toContain('font-size="16"');
    expect(schmal).toContain('font-size="12"');
  });

  it('hält alle gezeichneten Elemente innerhalb der Fläche', () => {
    const faelle = [
      { schritte: 'sichern|prüfen|bestellen' },
      { schritte: 'a|b' },
      { schritte: 'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn' },
      { schritte: 'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn', aktiv: 4 },
      {},
    ];
    for (const params of faelle) {
      const breit = zeichne(params);
      pruefeInnerhalb(breit, 480, 270);
      const schmal = zeichne({ ...params, format: 'schmal' });
      const hoehe = Number(/viewBox="0 0 300 (\d+)"/.exec(schmal)?.[1]);
      pruefeInnerhalb(schmal, 300, hoehe);
    }
  });

  it('überlappt im breiten Format bei vier Stationen mit 14 Zeichen keine Beschriftungen', () => {
    const html = zeichne({ schritte: 'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn' });
    const labels = beschriftungen(html);
    expect(labels).toHaveLength(4);
    for (let a = 0; a < labels.length; a += 1) {
      for (let b = a + 1; b < labels.length; b += 1) {
        const x = labels[a];
        const y = labels[b];
        // Liegen zwei Beschriftungen in derselben Zeile, brauchen sie den Abstand aus dem Auftrag.
        if (Math.abs(x.y - y.y) < Math.max(x.groesse, y.groesse)) {
          expect(Math.abs(x.x - y.x)).toBeGreaterThanOrEqual(
            (breiteSchaetzung(x) + breiteSchaetzung(y)) / 2 + 8,
          );
        }
      }
    }
    // Die Zeilen sind bei dieser Länge versetzt: zwei Reihen mit je zwei Beschriftungen.
    expect(new Set(labels.map((t) => t.y)).size).toBe(2);
  });

  it('stellt kurze Beschriftungen nebeneinander in eine Zeile', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen' });
    expect(new Set(beschriftungen(html).map((t) => t.y)).size).toBe(1);
  });

  it('zeichnet für gleiche Eingaben dieselbe Grafik', () => {
    const params = { schritte: 'sichern|prüfen|bestellen|prüfen', aktiv: 3, format: 'schmal' };
    expect(zeichne(params)).toBe(zeichne({ ...params }));
    const breit = { schritte: 'sichern|prüfen', aktiv: 1 };
    expect(zeichne(breit)).toBe(zeichne({ ...breit }));
  });

  it('nutzt Bewegung nur wie vorgesehen: Linie, dann Station für Station, unter 1,6 s', () => {
    for (const params of [{}, { schritte: 'a|b|c|d' }, { schritte: 'a|b|c|d', format: 'schmal' }]) {
      const html = zeichne(params);
      const elemente = bewegung(html);
      const linie = elemente.filter((e) => e.klasse.includes('sm24-draw'));
      expect(linie).toHaveLength(1);
      expect(linie[0].verzoegerung).toBe(0);
      expect(linie[0].dauer).toBeCloseTo(0.6, 3);

      const stationen = elemente.filter((e) => e.klasse.includes('sm24-pop'));
      const anzahl = nummern(html).length;
      expect(stationen).toHaveLength(anzahl);
      const verzoegerungen = stationen.map((e) => e.verzoegerung ?? 0);
      expect(verzoegerungen[0]).toBeGreaterThanOrEqual(0.6 - 1e-9);
      // Staffel: höchstens vier Schritte zu je 0,12 s.
      expect(verzoegerungen[verzoegerungen.length - 1] - verzoegerungen[0]).toBeLessThanOrEqual(4 * 0.12);
      for (let i = 1; i < verzoegerungen.length; i += 1) {
        expect(verzoegerungen[i] - verzoegerungen[i - 1]).toBeCloseTo(0.12, 3);
      }

      for (const e of elemente) {
        expect(e.dauer).toBeDefined();
        expect((e.verzoegerung ?? 0) + (e.dauer ?? 0)).toBeLessThan(1.6);
      }
      expect(elemente.some((e) => e.klasse.includes('sm24-fade'))).toBe(true);
    }
  });

  it('blendet Beschriftungen mit ihrer Station ein', () => {
    const html = zeichne({ schritte: 'a|b|c' });
    const elemente = bewegung(html);
    const beschriftungsZeiten = beschriftungen(html).length;
    const fade = elemente.filter((e) => e.klasse.includes('sm24-fade') && e.verzoegerung !== 0);
    expect(fade.length).toBeGreaterThanOrEqual(beschriftungsZeiten);
  });

  it('enthält keine Ausblendung im Stil, damit die Endlage ohne Bewegung vollständig sichtbar ist', () => {
    const html = zeichne({ schritte: 'a|b|c|d', aktiv: 1 });
    expect(html).not.toMatch(/opacity|display:\s*none|visibility/);
  });
});
