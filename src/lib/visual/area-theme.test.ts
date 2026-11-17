import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { AREA_KEYS } from '@/lib/server/record-schema';
import {
  ABSTUFUNG,
  AREA_THEMES,
  DEFAULT_AREA_THEME,
  MARKENBLAU,
  MARKEN_FARBTON,
  MARKEN_HOVER,
  MARKEN_RING,
  WEISS,
  contrastRatio,
  farbton,
  imSrgb,
  istLilaOderIndigo,
  oklchZuHex,
  parseOklch,
  type AreaTheme,
} from './area-theme';

const STUFEN = ['accent', 'strong', 'soft', 'muted'] as const;

/* Helle Flächen aus globals.css, auf denen Akzentfarben stehen. */
const SURFACE_MUTED = '0.971 0.0077 255';
const SURFACE_SUNKEN = '0.9377 0.0123 255';
/** Tinte der Seite (--foreground), gegen die sich die „24“ der Wortmarke absetzen muss. */
const TINTE = '0.2497 0.0366 266';

/** Orange oder Rot-Orange: bunter Farbton zwischen 20° und 80° (OKLCH). */
function istOrange(wert: string): boolean {
  const [, c, h] = parseOklch(wert);
  return c > 0.06 && h >= 20 && h <= 80;
}

function checkTheme(name: string, theme: AreaTheme) {
  it(`${name}: Text in Akzentfarbe ist lesbar (≥ 4,5:1)`, () => {
    for (const flaeche of [WEISS, theme.soft, SURFACE_MUTED, SURFACE_SUNKEN]) {
      expect(contrastRatio(theme.strong, flaeche), flaeche).toBeGreaterThanOrEqual(4.5);
    }
  });

  it(`${name}: Grafikfarbe hebt sich ab (≥ 3:1)`, () => {
    for (const flaeche of [WEISS, theme.soft, SURFACE_MUTED, SURFACE_SUNKEN]) {
      expect(contrastRatio(theme.accent, flaeche), flaeche).toBeGreaterThanOrEqual(3);
    }
  });

  it(`${name}: folgt der Abstufungsregel (Helligkeit je Stufe, Buntheit gedeckelt, im sRGB-Farbraum)`, () => {
    for (const stufe of STUFEN) {
      const [l, c] = parseOklch(theme[stufe]);
      expect(Math.abs(l - ABSTUFUNG[stufe].L), `${stufe} L`).toBeLessThanOrEqual(0.002);
      expect(c, `${stufe} C`).toBeLessThanOrEqual(ABSTUFUNG[stufe].cHoechstens);
      expect(imSrgb(theme[stufe]), `${stufe} im Farbraum`).toBe(true);
    }
  });

  it(`${name}: kein Lila und kein Indigo (S2)`, () => {
    for (const stufe of STUFEN) expect(istLilaOderIndigo(theme[stufe]), stufe).toBe(false);
  });
}

describe('Bereichsfarben', () => {
  it('jeder Bereich hat eine Farbe', () => {
    expect(Object.keys(AREA_THEMES).sort()).toEqual([...AREA_KEYS].sort());
  });

  it('alle Bereiche tragen dasselbe Markenblau (Auftrag vom 17.11.2026, A-074)', () => {
    for (const theme of Object.values(AREA_THEMES)) {
      expect({ ...theme, label: '' }).toEqual({ ...DEFAULT_AREA_THEME, label: '' });
    }
    expect({ ...DEFAULT_AREA_THEME, label: '' }).toEqual({ ...MARKENBLAU, label: '' });
    expect(farbton(DEFAULT_AREA_THEME.accent)).toBe(MARKEN_FARBTON);
  });

  it('das Markenblau ist ein Dunkelblau: Farbton im Blau der Tinte, tief, kräftig, aber nicht grell', () => {
    /* Tinte der Seite liegt bei 266°; Blau zwischen 250° und 268°, darüber beginnt Indigo. */
    expect(MARKEN_FARBTON).toBeGreaterThanOrEqual(250);
    expect(MARKEN_FARBTON).toBeLessThanOrEqual(268);
    const [lStark, cStark] = parseOklch(DEFAULT_AREA_THEME.strong);
    expect(lStark).toBeGreaterThanOrEqual(0.3);
    expect(lStark).toBeLessThanOrEqual(0.42);
    expect(cStark).toBeGreaterThanOrEqual(0.1);
    expect(cStark).toBeLessThanOrEqual(0.16);
    const [lGrafik, cGrafik] = parseOklch(DEFAULT_AREA_THEME.accent);
    expect(lGrafik).toBeLessThanOrEqual(0.6);
    expect(cGrafik).toBeGreaterThanOrEqual(0.12);
    expect(cGrafik).toBeLessThanOrEqual(0.2);
  });

  it('kein Orange mehr in der Marke', () => {
    for (const stufe of STUFEN) expect(istOrange(DEFAULT_AREA_THEME[stufe]), stufe).toBe(false);
  });

  it('die „24“ der Wortmarke hebt sich auf hellem Grund von der Tinte ab (≥ 2,5:1) und ist lesbar (≥ 4,5:1 auf Weiß)', () => {
    /* Auf hellem Grund trägt die „24“ die Grafikfarbe; `strong` läge zu nah an der Tinte. */
    expect(contrastRatio(DEFAULT_AREA_THEME.accent, TINTE)).toBeGreaterThanOrEqual(2.5);
    expect(contrastRatio(DEFAULT_AREA_THEME.accent, WEISS)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(DEFAULT_AREA_THEME.strong, TINTE)).toBeLessThan(2.5);
  });

  it('Fläche, Text und Linie eines Bereichs teilen seinen Farbton', () => {
    for (const theme of [DEFAULT_AREA_THEME, ...Object.values(AREA_THEMES)]) {
      const ton = farbton(theme.accent);
      expect([theme.strong, theme.soft, theme.muted].map(farbton)).toEqual([ton, ton, ton]);
    }
  });

  checkTheme('Allgemein', DEFAULT_AREA_THEME);
  for (const [key, theme] of Object.entries(AREA_THEMES)) {
    checkTheme(key, theme);
  }
});

describe('Umrechnung', () => {
  it('rechnet OKLCH in Hex um und erkennt Lila', () => {
    expect(oklchZuHex(WEISS)).toBe('#ffffff');
    expect(oklchZuHex('0 0 0')).toBe('#000000');
    /* Markenblau: Text- und Aktionsfarbe, Grafikfarbe; das frühere Markenorange als Rechenprobe */
    expect(oklchZuHex('0.36 0.13 262')).toBe('#123780');
    expect(oklchZuHex('0.52 0.17 262')).toBe('#2e62c9');
    expect(oklchZuHex('0.555 0.168 41')).toBe('#c04606');
    /* früheres Primärblau HSL 214 80% 40%, als Rechenprobe */
    expect(oklchZuHex('0.4852 0.1611 257.63')).toBe('#145bb8');
    expect(istLilaOderIndigo('0.606 0.25 292.7')).toBe(true); /* Tailwind violet-500 */
    expect(istLilaOderIndigo('0.585 0.233 277.1')).toBe(true); /* Tailwind indigo-500 */
    expect(istLilaOderIndigo('0.6165 0.2269 322.07')).toBe(true); /* bisherige Schließanlagen */
    expect(istLilaOderIndigo('0.5904 0.2181 347.28')).toBe(true); /* bisheriger Service (HSL 322°) */
    expect(istLilaOderIndigo('0.2497 0.0366 266')).toBe(false); /* Schriftfarbe, kaum bunt */
  });

  it('meldet ein ungültiges Tripel, statt eine Farbe zu raten', () => {
    expect(() => parseOklch('214 80% 40%')).toThrow(/OKLCH/);
  });
});

const CSS = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
/** Erste Belegung eines Tokens: der helle Satz in `:root`. */
const token = (name: string) => {
  const match = CSS.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Token --${name} fehlt`);
  return match[1].trim();
};
/** Alle Farbtokens eines Blocks (OKLCH-Tripel). */
function farbtokens(block: string): Map<string, string> {
  return new Map([...block.matchAll(/--([a-z-]+):\s*(\d[\d.]*\s+[\d.]+\s+-?[\d.]+);/g)].map(([, n, w]) => [n, w]));
}
/** Inhalt des ersten Regelblocks nach `selektor {` (ohne verschachtelte Blöcke). */
function block(selektor: string): string {
  const start = CSS.indexOf(`${selektor} {`);
  if (start < 0) throw new Error(`Block ${selektor} fehlt`);
  const auf = CSS.indexOf('{', start);
  return CSS.slice(auf + 1, CSS.indexOf('}', auf));
}

describe('Grundfarben in globals.css', () => {
  it.each([
    ['foreground', 'background'],
    ['foreground-muted', 'background'],
    ['foreground-muted', 'surface-muted'],
    ['foreground-subtle', 'surface'],
    ['foreground-subtle', 'surface-muted'],
    ['primary', 'surface'],
    ['primary', 'surface-muted'],
    ['primary', 'surface-sunken'],
    ['primary', 'primary-soft'],
    ['primary-foreground', 'primary'],
    ['primary-foreground', 'primary-hover'],
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['danger', 'danger-soft'],
    ['accent', 'accent-soft'],
  ])('%s auf %s ist lesbar (≥ 4,5:1)', (fg, bg) => {
    expect(contrastRatio(token(fg), token(bg))).toBeGreaterThanOrEqual(4.5);
  });

  it('der Fokusring hebt sich von Weiß, Hintergrund und den getönten Flächen ab (≥ 3:1)', () => {
    for (const flaeche of ['surface', 'background', 'surface-muted', 'surface-sunken']) {
      expect(contrastRatio(token('ring'), token(flaeche)), flaeche).toBeGreaterThanOrEqual(3);
    }
  });

  it('alle Farbtokens sind OKLCH-Tripel im sRGB-Farbraum, ohne Lila und Indigo', () => {
    const tokens = [...CSS.matchAll(/--([a-z-]+):\s*(\d[\d.]*\s+[\d.]+\s+-?[\d.]+);/g)];
    expect(tokens.length).toBeGreaterThan(25);
    expect(CSS).not.toMatch(/--[a-z-]+:\s*\d[\d.]*\s+[\d.]+%\s+[\d.]+%;/);
    for (const [, name, wert] of tokens) {
      expect(imSrgb(wert), name).toBe(true);
      expect(istLilaOderIndigo(wert), name).toBe(false);
    }
  });

  it('das Markenblau ist die Grundfarbe für Text und Aktionen (A-074)', () => {
    expect(token('primary')).toBe(DEFAULT_AREA_THEME.strong);
    expect(oklchZuHex(token('primary'))).toBe('#123780');
    expect(token('primary-soft')).toBe(DEFAULT_AREA_THEME.soft);
    expect(token('primary-hover')).toBe(MARKEN_HOVER);
    expect(oklchZuHex(token('primary-hover'))).toBe('#092661');
    expect(token('ring')).toBe(MARKEN_RING);
    expect(oklchZuHex(token('ring'))).toBe('#3672e9');
    expect(farbton(token('primary-hover'))).toBe(MARKEN_FARBTON);
    expect(farbton(token('ring'))).toBe(MARKEN_FARBTON);
  });

  it('kein Orange mehr: Aktions- und Hinweisfarben liegen nicht im Orange (die Statusfarbe Warnung bleibt)', () => {
    for (const name of ['primary', 'primary-hover', 'primary-soft', 'ring', 'info', 'info-soft']) {
      expect(istOrange(token(name)), name).toBe(false);
    }
    expect(istOrange(token('warning'))).toBe(true);
  });
});

describe('Bühne: Schicht und Stellen aus der Abnahme (A-074)', () => {
  const css = readFileSync(path.join(process.cwd(), 'src/app/(site)/globals.css'), 'utf8');
  const quelle = (datei: string) => readFileSync(path.join(process.cwd(), datei), 'utf8');

  it('steht in der Schicht „components“, damit Tailwind Varianten wie max-md:buehne erzeugt', () => {
    const start = css.indexOf('    .buehne {');
    expect(start).toBeGreaterThan(0);
    const davor = css.slice(0, start);
    expect(davor.slice(davor.lastIndexOf('@layer'))).toMatch(/^@layer components \{\s+@media screen \{\s+$/);
  });

  it('die feste Formularleiste steht nur am Telefon auf der Bühne, ab Tablet hell im Formular', () => {
    const leiste = quelle('src/components/flow/flow-shell.tsx');
    expect(leiste).toMatch(/'sm24-ablauf-leiste max-md:buehne fixed inset-x-0 bottom-0[^']*'/);
    expect(leiste).not.toMatch(/sm24-ablauf-leiste buehne\b/);
    expect(leiste).toContain("'md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 md:pb-4'");
  });

  it('der Kopf der Fehleransicht (404, Fehlergrenze) steht auf der Bühne, die Liste der Bereiche hell', () => {
    const ansicht = quelle('src/components/layout/fehler-ansicht.tsx');
    const kopf = ansicht.indexOf('className="buehne buehne-licht');
    const liste = ansicht.indexOf('aria-labelledby="fehler-bereiche"');
    expect(kopf).toBeGreaterThan(0);
    expect(liste).toBeGreaterThan(kopf);
    expect(ansicht.slice(kopf, liste)).toContain('<h1');
    expect(ansicht.slice(liste)).not.toContain('buehne');
  });

  it('die helle Schaltfläche der Bühne wird beim Überfahren sichtbar heller und bleibt lesbar', () => {
    const buehne = css.slice(css.indexOf('    .buehne {'));
    const wert = (name: string) => buehne.match(new RegExp(`--${name}:\\s*([^;]+);`))![1].trim();
    expect(parseOklch(wert('primary-hover'))[0] - parseOklch(wert('primary'))[0]).toBeGreaterThanOrEqual(0.08);
    expect(contrastRatio(wert('primary-foreground'), wert('primary-hover'))).toBeGreaterThanOrEqual(4.5);
    expect(imSrgb(wert('primary-hover'))).toBe(true);
  });
});

describe('Bühne (.buehne in globals.css, A-074)', () => {
  const hell = farbtokens(block(':root'));
  const buehne = farbtokens(block('.buehne'));
  const bereich = farbtokens(block('.buehne,\n    .buehne[data-area],\n    .buehne [data-area]'));
  const b = (name: string) => {
    const wert = buehne.get(name) ?? bereich.get(name);
    if (!wert) throw new Error(`Bühnen-Token --${name} fehlt`);
    return wert;
  };
  /** Flächen der Bühne, auf denen Text und Bedienelemente stehen; `licht` ist die hellste Stelle des Verlaufs. */
  const FLAECHEN = ['background', 'surface', 'card', 'surface-muted', 'licht'] as const;

  it('belegt jedes farbtragende Token des hellen Satzes neu (nichts Helles scheint durch)', () => {
    expect(hell.size).toBeGreaterThan(30);
    for (const name of hell.keys()) expect(buehne.has(name), `--${name}`).toBe(true);
  });

  it('belegt auch die Bereichsfarben neu, für die Bühne selbst und jedes [data-area] darin', () => {
    for (const name of ['area', 'area-strong', 'area-soft', 'area-muted', 'area-foreground']) {
      expect(bereich.has(name), `--${name}`).toBe(true);
    }
    /* Spezifität: `.buehne[data-area]` und `.buehne [data-area]` (0,2,0) schlagen `[data-area="…"]` (0,1,0) */
    expect(CSS).toMatch(/\.buehne,\s*\.buehne\[data-area\],\s*\.buehne \[data-area\]\s*\{/);
    /* Gedruckt gilt der helle Satz: die Bühne steht nur am Bildschirm */
    const vor = CSS.slice(0, CSS.indexOf('.buehne {'));
    expect(vor.slice(vor.lastIndexOf('@media')).startsWith('@media screen')).toBe(true);
  });

  it('der Grund ist ein dunkles Blau aus der Tinte, das Licht das Markenblau', () => {
    const [l, , h] = parseOklch(b('background'));
    expect(l).toBeLessThanOrEqual(0.25);
    expect(h).toBeGreaterThanOrEqual(250);
    expect(h).toBeLessThanOrEqual(268);
    expect(b('licht')).toBe(MARKENBLAU.strong);
  });

  it.each(['foreground', 'foreground-muted', 'foreground-subtle', 'card-foreground', 'muted-foreground'])(
    'Text %s ist auf Grund, Karte, gedeckter Fläche und Licht lesbar (≥ 4,5:1)',
    (fg) => {
      for (const flaeche of FLAECHEN) {
        expect(contrastRatio(b(fg), b(flaeche)), flaeche).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each(['primary', 'primary-hover', 'area', 'area-strong', 'ring'])(
    'Aktion, Grafik und Fokus %s heben sich ab (≥ 3:1)',
    (fg) => {
      for (const flaeche of [...FLAECHEN, 'surface-sunken', 'area-soft', 'primary-soft']) {
        expect(contrastRatio(b(fg), b(flaeche)), flaeche).toBeGreaterThanOrEqual(3);
      }
    },
  );

  it('Links und die „24“ in der hellen Aktionsfarbe sind als Text lesbar (≥ 4,5:1)', () => {
    for (const flaeche of FLAECHEN) {
      expect(contrastRatio(b('primary'), b(flaeche)), flaeche).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(b('area-strong'), b(flaeche)), flaeche).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('Schrift auf der hellen Schaltfläche ist lesbar (≥ 4,5:1), auch bei Hover', () => {
    expect(contrastRatio(b('primary-foreground'), b('primary'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(b('primary-foreground'), b('primary-hover'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(b('area-foreground'), b('area'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(b('accent-foreground'), b('accent'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(b('destructive-foreground'), b('destructive'))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(b('secondary-foreground'), b('secondary'))).toBeGreaterThanOrEqual(4.5);
  });

  it('Ränder von Bedienelementen heben sich ab (≥ 3:1)', () => {
    for (const rand of ['border-strong', 'input']) {
      for (const flaeche of FLAECHEN) {
        expect(contrastRatio(b(rand), b(flaeche)), `${rand} auf ${flaeche}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it.each([
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['danger', 'danger-soft'],
    ['accent', 'accent-soft'],
    ['info', 'info-soft'],
  ])('Statusfarbe %s ist auf der Bühne lesbar (≥ 4,5:1 auf %s und den Flächen)', (fg, soft) => {
    for (const flaeche of [soft, ...FLAECHEN]) {
      expect(contrastRatio(b(fg), b(flaeche)), flaeche).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('die Lichter sind ein ruhiges Eisblau: kein Orange, kein Neon, kein Lila', () => {
    for (const name of ['primary', 'primary-hover', 'area', 'area-strong', 'ring']) {
      const [, c, h] = parseOklch(b(name));
      expect(h, name).toBeGreaterThanOrEqual(220);
      expect(h, name).toBeLessThanOrEqual(250);
      expect(c, name).toBeLessThanOrEqual(0.13);
      expect(istOrange(b(name)), name).toBe(false);
      expect(istLilaOderIndigo(b(name)), name).toBe(false);
    }
  });

  it('die Plakette für Herstellerlogos bleibt auf der Bühne hell und hebt sich vom Grund ab', () => {
    expect(hell.get('plakette')).toBe(WEISS);
    expect(b('plakette')).toBe(WEISS);
    /* dunkle Logos (Tinte) lesbar auf der Plakette, die Plakette selbst klar vor dem Grund */
    expect(contrastRatio(TINTE, b('plakette'))).toBeGreaterThanOrEqual(4.5);
    for (const flaeche of FLAECHEN) {
      expect(contrastRatio(b('plakette'), b(flaeche)), flaeche).toBeGreaterThanOrEqual(3);
    }
  });

  it('der Verlauf nutzt nur Tokens, kein Bild und keine feste Farbe', () => {
    const licht = block('.buehne-licht');
    expect(licht).toMatch(/radial-gradient\(/);
    expect(licht).toContain('oklch(var(--licht))');
    expect(licht).not.toMatch(/url\(|#[0-9a-f]{3,6}\b|oklch\(\d/i);
  });
});
