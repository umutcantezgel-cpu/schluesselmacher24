import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { VisualProps } from '../registry';
import {
  ABLAUF_FLAECHE,
  AblaufGrafik,
  ablaufHoehe,
  ablaufSchritte,
  tiefeFuehrung,
} from './ablauf';

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
  const pfade = [...html.matchAll(/<path([^>]*)>/g)]
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
  for (const [tag] of html.matchAll(/<circle([^>]*)>/g)) {
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

/** Kreise der Stationen in der Reihenfolge der Zeichnung. */
function kreise(html: string): { cx: number; cy: number; r: number }[] {
  return [...html.matchAll(/<circle([^>]*)>/g)].map(([, tag]) => ({
    cx: Number(attribut(tag, 'cx')),
    cy: Number(attribut(tag, 'cy')),
    r: Number(attribut(tag, 'r')),
  }));
}

/** Pfade, die die Klasse `klasse` tragen (als Attributtext). */
function pfade(html: string, klasse: string): string[] {
  return [...html.matchAll(/<path([^>]*)>/g)]
    .map((t) => t[1])
    .filter((tag) => (attribut(tag, 'class') ?? '').split(/\s+/).includes(klasse));
}

/** Fünf Stationen mit je 14 Zeichen: Grenzfall für Rand und Innenlage. */
const FUENF_MIT_VIERZEHN =
  'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn';

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
    expect(zeichne({ schritte: 'a|b|c|d|e|f' })).toBe(standard);
    expect(zeichne({ schritte: 'kurz|dieser Eintrag ist viel zu lang' })).toBe(standard);
    expect(zeichne({ schritte: 'a|||' })).toBe(standard);
    expect(zeichne({ schritte: 42 })).toBe(standard);
    expect(ablaufSchritte({ schritte: 'a|b|c|d|e|f' })).toEqual([]);
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
      { schritte: FUENF_MIT_VIERZEHN },
      { schritte: FUENF_MIT_VIERZEHN, aktiv: 5 },
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

  it('hält im breiten Format Kreise und Beschriftungen mindestens 30 Einheiten vom Rand', () => {
    const vierMitVierzehn = 'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn';
    const faelle = [
      { schritte: 'sichern|prüfen|bestellen' },
      { schritte: 'a|b' },
      { schritte: vierMitVierzehn },
      { schritte: vierMitVierzehn, aktiv: 4 },
      { schritte: `${vierMitVierzehn}|abcdefghijklmn` },
      { schritte: FUENF_MIT_VIERZEHN },
      { schritte: FUENF_MIT_VIERZEHN, aktiv: 5 },
      {},
    ];
    for (const params of faelle) {
      const html = zeichne(params);
      expect(html).toContain('font-size="18"');
      for (const k of kreise(html)) {
        expect(k.r).toBe(30);
        expect(k.cx - k.r).toBeGreaterThanOrEqual(30 - 1e-9);
        expect(k.cx + k.r).toBeLessThanOrEqual(480 - 30 + 1e-9);
      }
      for (const t of beschriftungen(html)) {
        const halb = breiteSchaetzung(t) / 2;
        expect(t.x - halb).toBeGreaterThanOrEqual(30 - 1e-9);
        expect(t.x + halb).toBeLessThanOrEqual(480 - 30 + 1e-9);
      }
    }
  });

  it('stellt im breiten Format die Zeichnung senkrecht mittig, oben und unten fast gleich weit vom Rand', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen' });
    const [erster] = kreise(html);
    const [erste] = beschriftungen(html);
    const oben = erster.cy - erster.r;
    const basis = erste.y;
    expect(basis - oben).toBeGreaterThanOrEqual(0.5 * 270);
    expect(Math.abs(oben - (270 - basis))).toBeLessThanOrEqual(8);
  });

  it('setzt die Pfeilspitzen an die Enden der Bemaßung, in beiden Formaten', () => {
    for (const anzahl of [2, 3, 4, 5]) {
      const schritte = Array.from({ length: anzahl }, (_, i) => `s${i + 1}`).join('|');
      for (const format of ['breit', 'schmal'] as const) {
        const html = zeichne({ schritte, format });
        const stationen = kreise(html);
        const spitzen = pfade(html, 'fill-foreground-muted');
        expect(spitzen).toHaveLength(anzahl - 1);
        expect(pfade(html, 'fill-area')).toHaveLength(0);
        spitzen.forEach((tag, i) => {
          const [x, y] = punkte(attribut(tag, 'd') ?? '')[0];
          if (format === 'breit') {
            expect(x).toBeCloseTo(stationen[i + 1].cx, 1);
          } else {
            expect(y).toBeCloseTo(stationen[i + 1].cy, 1);
          }
        });
      }
    }
  });

  it('beginnt die Bemaßungslinie an der ersten Station und endet an der letzten, in beiden Formaten', () => {
    for (const format of ['breit', 'schmal'] as const) {
      const html = zeichne({ schritte: 'sichern|prüfen|bestellen', format });
      const [linie] = pfade(html, 'sm24-draw');
      const bemassung = punkte(attribut(linie, 'd') ?? '');
      const stationen = kreise(html);
      const erste = stationen[0];
      const letzte = stationen[stationen.length - 1];
      if (format === 'breit') {
        const xs = bemassung.map(([x]) => x);
        expect(Math.min(...xs)).toBeCloseTo(erste.cx, 1);
        expect(Math.max(...xs)).toBeCloseTo(letzte.cx, 1);
      } else {
        const ys = bemassung.map(([, y]) => y);
        expect(Math.min(...ys)).toBeCloseTo(erste.cy, 1);
        expect(Math.max(...ys)).toBeCloseTo(letzte.cy, 1);
      }
    }
  });

  it('zentriert im schmalen Format den Inhalt mit Beschriftung waagerecht', () => {
    const html = zeichne({ schritte: 'sichern|prüfen|bestellen', format: 'schmal' });
    const [linie] = pfade(html, 'sm24-draw');
    const links = Math.min(...punkte(attribut(linie, 'd') ?? '').map(([x]) => x));
    const rechts = Math.max(...beschriftungen(html).map((t) => t.x + breiteSchaetzung(t)));
    expect(Math.abs(links - (300 - rechts))).toBeLessThanOrEqual(4);
  });

  it('zentriert im schmalen Format die Zeichnung ohne Beschriftung waagerecht', () => {
    const html = zeichne({ format: 'schmal' });
    const [linie] = pfade(html, 'sm24-draw');
    const links = Math.min(...punkte(attribut(linie, 'd') ?? '').map(([x]) => x));
    const rechts = Math.max(...kreise(html).map((k) => k.cx + k.r));
    expect(Math.abs(links - (300 - rechts))).toBeLessThanOrEqual(4);
  });

  it('zeichnet fünf Stationen in beiden Formaten, versetzt und mit Bewegung unter 1,6 s', () => {
    const fuenf = 'abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn|abcdefghijklmn';
    const breit = zeichne({ schritte: fuenf, aktiv: 5 });
    pruefeVertrag(breit, 480, 270);
    expect(nummern(breit)).toEqual(['01', '02', '03', '04', '05']);
    const labels = beschriftungen(breit);
    expect(labels).toHaveLength(5);
    expect(new Set(labels.map((t) => t.y)).size).toBe(2);
    for (let a = 0; a < labels.length; a += 1) {
      for (let b = a + 1; b < labels.length; b += 1) {
        if (Math.abs(labels[a].y - labels[b].y) < 16) {
          expect(Math.abs(labels[a].x - labels[b].x)).toBeGreaterThanOrEqual(
            (breiteSchaetzung(labels[a]) + breiteSchaetzung(labels[b])) / 2 + 8,
          );
        }
      }
    }
    expect(breit.match(/class="fill-area-soft stroke-area-strong"/g)).toHaveLength(1);

    const schmal = zeichne({ schritte: fuenf, format: 'schmal' });
    pruefeVertrag(schmal, 300, ablaufHoehe(5));
    expect(ablaufHoehe(5)).toBe(360);
    expect(nummern(schmal)).toEqual(['01', '02', '03', '04', '05']);

    for (const html of [breit, schmal]) {
      const stationen = bewegung(html).filter((e) => e.klasse.includes('sm24-pop'));
      expect(stationen).toHaveLength(5);
      const verzoegerungen = stationen.map((e) => e.verzoegerung ?? 0);
      for (let i = 1; i < verzoegerungen.length; i += 1) {
        expect(verzoegerungen[i] - verzoegerungen[i - 1]).toBeCloseTo(0.12, 3);
      }
      for (const e of bewegung(html)) {
        expect((e.verzoegerung ?? 0) + (e.dauer ?? 0)).toBeLessThan(1.6);
      }
    }
  });

  it('hält Bemaßungskette, Anfangsstrich und Hilfslinien auch bei fünf Stationen', () => {
    for (const format of ['breit', 'schmal'] as const) {
      const html = zeichne({ schritte: FUENF_MIT_VIERZEHN, format });
      const [linie] = pfade(html, 'sm24-draw');
      const bemassung = punkte(attribut(linie, 'd') ?? '');
      const stationen = kreise(html);
      expect(stationen).toHaveLength(5);
      const hilfslinien = pfade(html, 'sm24-fade')
        .filter((tag) => tag.includes('stroke-dasharray'))
        .map((tag) => punkte(attribut(tag, 'd') ?? '')[0]);
      // Breit kommen für tiefe Stationen je eine weitere Strecke zur Beschriftung hinzu.
      expect(hilfslinien.length).toBeGreaterThanOrEqual(5);

      if (format === 'breit') {
        const LY = bemassung[3][1];
        const xs = bemassung.map(([x]) => x);
        expect(Math.min(...xs)).toBeCloseTo(stationen[0].cx, 1);
        expect(Math.max(...xs)).toBeCloseTo(stationen[4].cx, 1);
        // Anfangsstrich 6 über und 6 unter der Linie; Hilfslinien überragen sie um 6.
        expect(bemassung[0][1]).toBeCloseTo(LY - 6, 1);
        expect(bemassung[1][1]).toBeCloseTo(LY + 6, 1);
        for (const k of stationen) {
          expect(
            hilfslinien.some(([x, y]) => Math.abs(x - k.cx) < 0.05 && Math.abs(y - (LY + 6)) < 0.05),
          ).toBe(true);
        }
      } else {
        const lx = bemassung[2][0];
        const ys = bemassung.map(([, y]) => y);
        expect(Math.min(...ys)).toBeCloseTo(stationen[0].cy, 1);
        expect(Math.max(...ys)).toBeCloseTo(stationen[4].cy, 1);
        // Anfangsstrich 6 links und 6 rechts der Linie; Hilfslinien überragen sie um 6 nach links.
        expect(bemassung[0][0]).toBeCloseTo(lx - 6, 1);
        expect(bemassung[1][0]).toBeCloseTo(lx + 6, 1);
        for (const k of stationen) {
          expect(
            hilfslinien.some(([x, y]) => Math.abs(x - (lx - 6)) < 0.05 && Math.abs(y - k.cy) < 0.05),
          ).toBe(true);
        }
      }
    }
  });
});

/** Schritte der Seite /service-und-termin (PHASEN, Kurzfassung der Beschriftung). */
const SEITE_SCHRITTE = 'Bedarfsanalyse|Projektierung|Fertigung|Montage|Dokumentation';

/** Gestrichelte Pfade mit ihrer senkrechten Strecke (x, obere und untere y-Koordinate). */
function gestrichelt(html: string): { x: number; von: number; bis: number }[] {
  return [...html.matchAll(/<path([^>]*)>/g)]
    .map((t) => t[1])
    .filter((tag) => tag.includes('stroke-dasharray="4 3"'))
    .map((tag) => {
      const [anfang, ende] = punkte(attribut(tag, 'd') ?? '');
      return {
        x: anfang[0],
        von: Math.min(anfang[1], ende[1]),
        bis: Math.max(anfang[1], ende[1]),
      };
    });
}

describe('AblaufGrafik · Führungslinie (Z-09)', () => {
  it('kürzt die tiefe Führungslinie über der ersten Reihe, wenn eine Beschriftung ihr zu nahe kommt', () => {
    // Halbe Breite 62 + Luft 10 > Abstand 60: die Beschriftung reicht bis an die Linie.
    expect(tiefeFuehrung(100, 150, 178, 16, [{ x: 40, breite: 124 }])).toEqual(['M100 154V160']);
    // Auch ohne Berührung: Abstand 66 < 62 + 10 – die Linie liefe zu knapp an der Schrift vorbei.
    expect(tiefeFuehrung(100, 150, 178, 16, [{ x: 34, breite: 124 }])).toEqual(['M100 154V160']);
    // Schon eine von zwei Nachbarbeschriftungen genügt.
    expect(
      tiefeFuehrung(100, 150, 178, 16, [
        { x: 40, breite: 20 },
        { x: 160, breite: 124 },
      ]),
    ).toEqual(['M100 154V160']);
  });

  it('lässt die Führungslinie durchgehend, wenn keine Beschriftung sie erreicht', () => {
    // Halbe Breite 62 + Luft 10 = 72 < Abstand 80: die Beschriftung bleibt frei.
    expect(tiefeFuehrung(100, 150, 178, 16, [{ x: 20, breite: 124 }])).toEqual(['M100 154V189']);
    expect(tiefeFuehrung(100, 150, 178, 16, [])).toEqual(['M100 154V189']);
  });

  it('lässt auf der Seite Service und Termin jeder Beschriftung der ersten Reihe seitlich Luft', () => {
    const html = zeichne({ schritte: SEITE_SCHRITTE });
    const beschriftungsZeilen = beschriftungen(html);
    const ersteReihe = Math.min(...beschriftungsZeilen.map((t) => t.y));
    const erste = beschriftungsZeilen.filter((t) => t.y === ersteReihe);
    expect(erste.map((t) => t.inhalt)).toEqual(['Bedarfsanalyse', 'Fertigung', 'Dokumentation']);
    const strecken = gestrichelt(html);
    // Fünf Stationslinien, die beiden tiefen Führungslinien (02, 04) enden über der ersten Reihe.
    expect(strecken).toHaveLength(7);
    for (const t of erste) {
      const halb = breiteSchaetzung(t) / 2;
      const oberkante = t.y - t.groesse;
      const unterkante = t.y + 4;
      for (const s of strecken) {
        // In der Höhe der Beschriftung hält jede Linie mindestens 10 Einheiten seitlich Abstand.
        const zuNah = s.von <= unterkante && s.bis >= oberkante && Math.abs(s.x - t.x) < halb + 10;
        expect(zuNah).toBe(false);
      }
    }
  });

  it('behält bei kurzen Beschriftungen eine durchgehende Linie je Station', () => {
    for (const schritte of ['sichern|prüfen|bestellen', 'messen|bestellen', 'a|b|c|d']) {
      const html = zeichne({ schritte });
      const anzahl = nummern(html).length;
      expect(html.match(/stroke-dasharray="4 3"/g)).toHaveLength(anzahl);
      expect(gestrichelt(html)).toHaveLength(anzahl);
    }
  });
});
