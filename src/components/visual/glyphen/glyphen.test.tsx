import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { IconProps } from '../icons/icon-base';

/**
 * Vertrag der UI-Glyphen (KERN K-008). Die Glyphen werden selbst gefunden:
 * Jede `.tsx`-Datei in diesem Ordner (außer Tests) ist ein Glyph mit genau
 * einem Export `Glyph<Dateiname in PascalCase>`. So braucht ein neuer Glyph
 * keinen Eintrag in einer gemeinsamen Liste.
 */
const ORDNER = path.dirname(fileURLToPath(import.meta.url));

function dateien(): string[] {
  return fs
    .readdirSync(ORDNER)
    .filter((f) => f.endsWith('.tsx') && !f.includes('.test.'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort();
}

function komponentenName(datei: string): string {
  return `Glyph${datei
    .split('-')
    .map((teil) => teil.charAt(0).toUpperCase() + teil.slice(1))
    .join('')}`;
}

type Exporte = Record<string, ComponentType<IconProps> | undefined>;

const geladen: [string, Exporte][] = await Promise.all(
  dateien().map(async (datei): Promise<[string, Exporte]> => [datei, (await import(`./${datei}.tsx`)) as Exporte]),
);

const glyphen = geladen.map(([datei, exporte]) => [datei, exporte[komponentenName(datei)]] as const);

const VERBOTEN = [/#[0-9a-f]{3,8}\b/i, /rgb\(/, /hsl\(/, /\bid=/, /<text/, /gradient/i, /<mask/, /<filter/, /<pattern/, /url\(/];

describe('UI-Glyphen: Vollständigkeit', () => {
  it('jede Datei exportiert genau den Glyph mit dem Namen nach dem Dateinamen', () => {
    expect(geladen.length).toBeGreaterThan(0);
    for (const [datei, exporte] of geladen) {
      expect(Object.keys(exporte), datei).toEqual([komponentenName(datei)]);
    }
  });

  it('Quelltexte sind Server-Komponenten aus der gemeinsamen IconBase, ohne Zufall', () => {
    for (const datei of dateien()) {
      const quelle = fs.readFileSync(path.join(ORDNER, `${datei}.tsx`), 'utf8');
      expect(quelle, datei).not.toMatch(/['"]use client['"]/);
      expect(quelle, datei).not.toContain('Math.random');
      expect(quelle, datei).toContain("from '../icons/icon-base'");
    }
  });
});

describe.each(glyphen)('Glyph %s', (datei, Glyph) => {
  if (!Glyph) throw new Error(`${datei}: Export ${komponentenName(datei)} fehlt`);
  const html = renderToStaticMarkup(<Glyph />);

  it('gehört zur Icon-Familie: 48er-Raster, Kontur in currentColor, Formsystem-Marke', () => {
    expect(html).toContain('viewBox="0 0 48 48"');
    expect(html).toContain('stroke="currentColor"');
    expect(html).toContain('data-sm24-icon=""');
    expect(html).toContain('stroke-linecap="round"');
    expect(html).toContain('stroke-linejoin="round"');
    expect(html.match(/stroke-width=/g)).toHaveLength(1);
  });

  it('ist einfarbig: keine Zweitonfläche, keine eigenen Farben', () => {
    expect(html).not.toMatch(/class="[^"]*fill-/);
    const striche = [...html.matchAll(/\sstroke="([^"]*)"/g)].map((t) => t[1]);
    expect(striche.every((wert) => wert === 'currentColor')).toBe(true);
    for (const muster of VERBOTEN) expect(html).not.toMatch(muster);
  });

  it('hat die Standardgröße 20 und übernimmt andere Größen', () => {
    expect(html).toContain('width="20"');
    expect(html).toContain('height="20"');
    const gross = renderToStaticMarkup(<Glyph size={16} />);
    expect(gross).toContain('width="16"');
  });

  it('ist ohne Titel dekorativ und mit Titel ein Bild', () => {
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
    const mitTitel = renderToStaticMarkup(<Glyph title="Testtitel" />);
    expect(mitTitel).toContain('role="img"');
    expect(mitTitel).toContain('<title>Testtitel</title>');
    expect(mitTitel).not.toContain('aria-hidden');
  });

  it('hält 3 Einheiten Abstand zum Rand (Kreise, Pfad-Endpunkte)', () => {
    const imRaster = (wert: number) => wert >= 3 && wert <= 45;
    for (const [, cx, cy, r] of html.matchAll(/<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)) {
      const [x, y, radius] = [Number(cx), Number(cy), Number(r)];
      expect(imRaster(x - radius) && imRaster(x + radius) && imRaster(y - radius) && imRaster(y + radius)).toBe(true);
    }
    for (const [, d] of html.matchAll(/\sd="([^"]*)"/g)) {
      /* Vertrag: Glyphen nutzen nur absolute Befehle M, L, H, V, A, Z. */
      expect(d).toMatch(/^[MLHVAZ\d.\s-]+$/);
      for (const [, befehl, werte] of d.matchAll(/([MLHVA])([^MLHVAZ]*)/g)) {
        const zahlen = (werte.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
        const punkte = befehl === 'A' ? zahlen.slice(-2) : zahlen;
        for (const zahl of punkte) expect(imRaster(zahl), `${befehl}${werte}`).toBe(true);
      }
    }
  });
});
