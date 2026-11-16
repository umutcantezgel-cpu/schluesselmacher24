import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/* ==========================================================================
   Untergrenze der Schrift (FA-26-01, FA-QA-04A): „gut lesbare Schrift“ auch für
   ältere Kunden. Keine Schriftstufe der Website liegt unter 14 px, auch nicht die
   Beschriftung in Großbuchstaben (`text-caption`). Gelesen werden die Werte aus dem
   Gestaltungssystem selbst; der Admin ist nicht gemeint.
   ========================================================================== */

const WURZEL = path.resolve(__dirname, '../../..');
const CSS = readFileSync(path.join(WURZEL, 'src/app/(site)/globals.css'), 'utf8');
const TAILWIND = readFileSync(path.join(WURZEL, 'tailwind.config.ts'), 'utf8');

const UNTERGRENZE_PX = 14;
const REM_PX = 16;

/** Kleinster Wert einer Größe in Pixeln: `0.875rem`, `14px` oder die Untergrenze aus `clamp(a, b, c)`. */
function kleinsterWertPx(wert: string): number {
  const roh = wert.trim();
  const clamp = roh.match(/^clamp\(\s*([^,]+),/);
  const teil = (clamp ? clamp[1] : roh).trim();
  const zahl = teil.match(/^([0-9.]+)(rem|px)$/);
  if (!zahl) throw new Error(`Schriftgröße nicht lesbar: ${wert}`);
  return zahl[2] === 'rem' ? Number(zahl[1]) * REM_PX : Number(zahl[1]);
}

/** Alle Schriftstufen `--text-<name>: <wert>;` aus dem Gestaltungssystem. */
const STUFEN = [...CSS.matchAll(/--text-([a-z-]+):\s*([^;]+);/g)].map((m) => ({ name: m[1], wert: m[2] }));

/** Quelltext der öffentlichen Website (ohne Tests). */
function dateien(ordner: string): string[] {
  const voll = path.join(WURZEL, ordner);
  return readdirSync(voll, { recursive: true, encoding: 'utf8' })
    .map((name) => path.join(voll, name))
    .filter((datei) => /\.(tsx?|css)$/.test(datei) && !/\.test\.tsx?$/.test(datei) && statSync(datei).isFile());
}
const QUELLEN = [...dateien('src/app/(site)'), ...dateien('src/components')];

describe('Schriftstufen der Website (FA-26-01)', () => {
  it('liest alle Stufen des Gestaltungssystems', () => {
    expect(STUFEN.map((s) => s.name)).toEqual(expect.arrayContaining(['caption', 'small', 'body', 'eingabe']));
  });

  it('keine Stufe liegt unter 14 px, auch die Beschriftung nicht', () => {
    const zuKlein = STUFEN.filter((s) => kleinsterWertPx(s.wert) < UNTERGRENZE_PX).map((s) => `--text-${s.name}: ${s.wert}`);
    expect(zuKlein).toEqual([]);
    expect(kleinsterWertPx(STUFEN.find((s) => s.name === 'caption')!.wert)).toBeGreaterThanOrEqual(UNTERGRENZE_PX);
  });

  it('text-caption und text-small kommen aus den Stufen (eine Stelle)', () => {
    expect(TAILWIND).toMatch(/caption:\s*\[\s*'var\(--text-caption\)'/);
    expect(TAILWIND).toMatch(/small:\s*\[\s*'var\(--text-small\)'/);
  });

  it('die Website setzt keine kleinere Schrift an den Stufen vorbei', () => {
    const funde: string[] = [];
    for (const datei of QUELLEN) {
      const text = readFileSync(datei, 'utf8');
      const name = path.relative(WURZEL, datei);
      // Tailwind-Standardstufe unter 14 px
      if (/(^|[\s"'`:])text-(xs|2xs)(?=[\s"'`]|$)/m.test(text)) funde.push(`${name}: text-xs`);
      // freie Werte wie text-[12px] oder text-[0.75rem]
      for (const m of text.matchAll(/text-\[([0-9.]+(?:px|rem))\]/g)) {
        if (kleinsterWertPx(m[1]) < UNTERGRENZE_PX) funde.push(`${name}: ${m[0]}`);
      }
      // feste Größen im CSS oder als Stilangabe
      for (const m of text.matchAll(/font-size:\s*([0-9.]+(?:px|rem))/g)) {
        if (kleinsterWertPx(m[1]) < UNTERGRENZE_PX) funde.push(`${name}: ${m[0]}`);
      }
      for (const m of text.matchAll(/fontSize:\s*['"]?([0-9.]+(?:px|rem)?)['"]?/g)) {
        const wert = /\d$/.test(m[1]) ? `${m[1]}px` : m[1];
        if (kleinsterWertPx(wert) < UNTERGRENZE_PX) funde.push(`${name}: ${m[0]}`);
      }
    }
    expect(funde).toEqual([]);
  });
});

/* ==========================================================================
   Schrift der SVG-Grafiken (Nachbesserung FA-QA-04A). Die Grafiken setzen ihre
   Beschriftung als JSX-Attribut `fontSize={…}` in viewBox-Einheiten, meist über
   Konstanten (`SCHRIFT`, `SCHRIFT_KLEIN` aus grafik-basis.tsx) oder über die
   `schrift` einer Fläche. Die Darstellungsgröße ist Wert × Darstellungsbreite /
   viewBox-Breite und hängt damit von der Breite ab; der schmale Schließplan
   (360 Einheiten, Schrift 12) erscheint bei 358 px mit rund 11,9 px.
   Diese Stellen liegen unter 14 Einheiten und sind OFFEN (Bericht FA-QA-04A,
   OFFENE FRAGEN): Die Grafiken stehen nicht in den Schreibrechten des Pakets und
   brauchen eine Sichtprobe der Anordnung. Der Test hält den Stand genau fest:
   Jede neue Stelle unter 14 Einheiten lässt ihn rot werden, ebenso jede behobene
   (dann ist die Liste zu kürzen). Er ist keine Freigabe der Werte.
   ========================================================================== */

const GRAFIK_BASIS = readFileSync(path.join(WURZEL, 'src/components/visual/generators/grafik-basis.tsx'), 'utf8');

/** Wert einer Konstanten `const NAME = 12;` in der Datei oder in grafik-basis.tsx. */
function konstante(text: string, name: string): number | undefined {
  const muster = new RegExp(`const ${name}\\s*=\\s*([0-9.]+)\\s*;`);
  const treffer = text.match(muster) ?? GRAFIK_BASIS.match(muster);
  return treffer ? Number(treffer[1]) : undefined;
}

/** Alle Werte, die ein Ausdruck in `fontSize={…}` annehmen kann (in viewBox-Einheiten). */
function grafikWerte(text: string, ausdruck: string): { wert: number; quelle: string }[] | undefined {
  const roh = ausdruck.trim();
  if (/^[0-9.]+$/.test(roh)) return [{ wert: Number(roh), quelle: roh }];
  if (/^[A-Z][A-Z0-9_]*$/.test(roh)) {
    const wert = konstante(text, roh);
    return wert === undefined ? undefined : [{ wert, quelle: roh }];
  }
  // Feld einer Fläche (`f.schrift`, `f.klein`) oder gleichnamige Variable (`schrift`).
  const feld = roh.split('.').pop()!;
  if (!/^[a-z][A-Za-z]*$/.test(feld)) return undefined;
  const werte: { wert: number; quelle: string }[] = [];
  for (const m of text.matchAll(new RegExp(`\\b${feld}\\s*:\\s*([A-Z][A-Z0-9_]*|[0-9.]+)\\s*[,}]`, 'g'))) {
    const wert = /^[0-9.]+$/.test(m[1]) ? Number(m[1]) : konstante(text, m[1]);
    if (wert === undefined) return undefined;
    werte.push({ wert, quelle: `${feld}: ${m[1]}` });
  }
  // Abgeleitete Größe wie `const schrift = r(SCHRIFT_KLEIN / skala)`: Grundwert der Konstanten.
  for (const m of text.matchAll(new RegExp(`\\b${feld}\\s*=\\s*\\{?\\s*r?\\(?\\s*([A-Z][A-Z0-9_]*)`, 'g'))) {
    const wert = konstante(text, m[1]);
    if (wert === undefined) return undefined;
    werte.push({ wert, quelle: `${feld} = ${m[1]} (skaliert)` });
  }
  return werte.length > 0 ? werte : undefined;
}

/** Bekannte Grafikschrift unter 14 viewBox-Einheiten (OFFEN, siehe oben). */
const BEKANNTE_GRAFIKSCHRIFT = [
  'src/components/visual/einsatzradius.tsx · SCHRIFT = 13',
  'src/components/visual/generators/ablauf.tsx · schrift: 12 = 12',
  'src/components/visual/generators/autoschluessel-aufbau.tsx · SCHRIFT_KLEIN = 12',
  'src/components/visual/generators/code-fundstelle.tsx · SCHRIFT = 13',
  'src/components/visual/generators/foto-beispiel.tsx · SCHRIFT = 13',
  'src/components/visual/generators/profilschnitt.tsx · SCHRIFT_KLEIN = 12',
  'src/components/visual/generators/schliessplan.tsx · schrift: 12 = 12',
  'src/components/visual/generators/schliessplan.tsx · schrift: SCHRIFT = 13',
  'src/components/visual/generators/schluessel.tsx · schrift = SCHRIFT_KLEIN (skaliert) = 12',
  'src/components/visual/generators/stiftzuhaltung.tsx · SCHRIFT = 13',
  'src/components/visual/generators/stiftzuhaltung.tsx · SCHRIFT_KLEIN = 12',
  'src/components/visual/generators/tuer-schutz.tsx · SCHRIFT = 13',
  'src/components/visual/generators/zylinder-mass.tsx · klein: SCHRIFT_KLEIN = 12',
  'src/components/visual/generators/zylinder-mass.tsx · schrift: SCHRIFT = 13',
];

describe('Schrift der SVG-Grafiken (FA-26-01, Nachbesserung FA-QA-04A)', () => {
  const attribute = QUELLEN.flatMap((datei) => {
    const text = readFileSync(datei, 'utf8');
    const name = path.relative(WURZEL, datei).split(path.sep).join('/');
    return [...text.matchAll(/fontSize=(?:\{([^}]+)\}|["']([0-9.]+)["'])/g)].map((m) => ({ name, text, ausdruck: m[1] ?? m[2] }));
  });

  it('findet die Beschriftung der Grafiken (Grundwerte aus grafik-basis.tsx)', () => {
    expect(attribute.length).toBeGreaterThan(20);
    expect(konstante('', 'SCHRIFT')).toBeTypeOf('number');
    expect(konstante('', 'SCHRIFT_KLEIN')).toBeTypeOf('number');
  });

  it('jede Schriftgröße einer Grafik ist lesbar (Konstante, Zahl oder Feld der Fläche)', () => {
    const unlesbar = attribute.filter((a) => grafikWerte(a.text, a.ausdruck) === undefined).map((a) => `${a.name}: fontSize={${a.ausdruck}}`);
    expect(unlesbar).toEqual([]);
  });

  it('unter 14 Einheiten liegt nur die bekannte, offene Grafikschrift', () => {
    const funde = new Set<string>();
    for (const a of attribute) {
      for (const { wert, quelle } of grafikWerte(a.text, a.ausdruck) ?? []) {
        if (wert < UNTERGRENZE_PX) funde.add(`${a.name} · ${quelle} = ${wert}`);
      }
    }
    expect([...funde].sort()).toEqual([...BEKANNTE_GRAFIKSCHRIFT].sort());
  });
});
