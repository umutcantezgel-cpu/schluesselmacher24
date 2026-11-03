import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FACH_ICON_REGISTRY, fachIconKomponente } from '@/components/visual/fach-icon';
import { defaults } from '@/lib/data/defaults';
import { hubKacheln, RUBRIK_ICONS } from '@/lib/rubriken';
import type { Rubrik } from '@/lib/types';

import { CODE_MOTIV_ZIFFERN, CodeMotiv, codeMotivPfad } from './code-motiv';
import { rubrikUebergang } from './hub-kachel';
import { HUB_FRAGE, hubRaster, IntentHub } from './intent-hub';

const ICON_ORDNER = path.join(process.cwd(), 'src/components/visual/icons');
const GLYPHEN = new Set(['dokument']);

function rubrik(teil: Partial<Rubrik> & Pick<Rubrik, 'id'>): Rubrik {
  const basis = defaults.rubriken().find((r) => r.id === 'autoschluessel')!;
  return { ...basis, ...teil };
}

describe('Icon-Registry', () => {
  it('führt jede Datei des Icon-Ordners genau einmal', () => {
    const dateien = readdirSync(ICON_ORDNER)
      .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx') && f !== 'icon-base.tsx')
      .map((f) => f.slice(0, -4))
      .sort();
    expect(Object.keys(FACH_ICON_REGISTRY).sort()).toEqual(dateien);
  });

  it('kennt jedes Fach-Icon aus RUBRIK_ICONS (Glyphen ausgenommen)', () => {
    const fehlend = RUBRIK_ICONS.filter((n) => !GLYPHEN.has(n) && !fachIconKomponente(n));
    expect(fehlend).toEqual([]);
  });

  it('liefert für unbekannte oder leere Namen nichts', () => {
    expect(fachIconKomponente('gibt-es-nicht')).toBeUndefined();
    expect(fachIconKomponente(undefined)).toBeUndefined();
  });

  it('enthält keine Farbwerte (Farbe nur über currentColor und Bereichstokens)', () => {
    expect(readFileSync(path.join(process.cwd(), 'src/components/visual/fach-icon.tsx'), 'utf8')).not.toMatch(/#[0-9a-f]{3,8}\b|oklch\(|hsl\(/i);
  });
});

describe('Raster des Hubs (G-02, A-025)', () => {
  it('setzt eine Leitkachel, wenn sie mit den übrigen Kacheln vier Spalten genau füllt', () => {
    expect(hubRaster(9)).toEqual({ spalten: 4, leit: true });
    expect(hubRaster(13)).toEqual({ spalten: 4, leit: true });
  });

  it('wählt sonst drei Spalten, wenn sich die Zahl nur durch drei teilt, und vier in allen anderen Fällen', () => {
    expect(hubRaster(12)).toEqual({ spalten: 4, leit: false });
    expect(hubRaster(11)).toEqual({ spalten: 4, leit: false });
    expect(hubRaster(8)).toEqual({ spalten: 4, leit: false });
    expect(hubRaster(6)).toEqual({ spalten: 3, leit: false });
  });
});

describe('Intent-Hub', () => {
  const live = hubKacheln(defaults.rubriken());
  const telefon = { anzeige: '06441 8056279', href: 'tel:+4964418056279' };

  it('stellt die Frage als einzige h1 und den Satz darunter', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} satz="Ein Satz." telefon={telefon} />);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(`>${HUB_FRAGE}</h1>`);
    expect(html).toContain('Ein Satz.');
  });

  it('zeigt jede Hub-Rubrik als Kachel mit Link auf ihr Ziel, in der Reihenfolge der Daten', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} telefon={telefon} />);
    const ids = [...html.matchAll(/data-rubrik="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(live.map((r) => r.id));
    for (const r of live) expect(html).toContain(`href="${r.ziel}"`);
  });

  it('nimmt nur Rubriken mit imHub und Status live (keine Sackgasse)', () => {
    expect(live.length).toBeGreaterThan(0);
    expect(live.every((r) => r.imHub && r.status === 'live')).toBe(true);
  });

  it('hat für jede Kachel ein Fach-Icon und einen eindeutigen Übergangsnamen', () => {
    for (const r of defaults.rubriken().filter((x) => x.imHub)) expect(fachIconKomponente(r.icon)).toBeDefined();
    const namen = defaults.rubriken().map((r) => rubrikUebergang(r.id));
    expect(new Set(namen).size).toBe(namen.length);
  });

  it('trägt die Laienerklärung der Sperrschließung auf der Kachel (G-09)', () => {
    const sperr = defaults.rubriken().find((r) => r.id === 'sperrschliessung')!;
    const html = renderToStaticMarkup(<IntentHub rubriken={[sperr]} />);
    expect(html).toContain(sperr.laienname);
    expect(html).toContain(sperr.zusatz!);
  });

  it('wischt nicht und scrollt nicht seitlich (G-02)', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} telefon={telefon} />);
    expect(html).not.toMatch(/overflow-x-auto|snap-x|snap-mandatory/);
    expect(html).toContain('grid-cols-3');
  });

  it('nennt Anrufen mit Nummer als tel:-Link und ohne Link als Text', () => {
    expect(renderToStaticMarkup(<IntentHub rubriken={live} telefon={telefon} />)).toContain('href="tel:+4964418056279"');
    const ohne = renderToStaticMarkup(<IntentHub rubriken={live} telefon={{ anzeige: '06441 8056279', href: null }} />);
    expect(ohne).toContain('06441 8056279');
    expect(ohne).not.toContain('tel:');
  });

  it('zeigt eine Kachel ohne Icon trotzdem mit Namen', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={[rubrik({ id: 'test', icon: 'gibt-es-nicht' as Rubrik['icon'], laienname: 'Test' })]} />);
    expect(html).toContain('>Test</span>');
  });

  it('setzt Leuchten und Druck nur bei Bewegung an (B-30, B-34)', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} />);
    expect(html).toContain('bewegt:hover:shadow-leuchten');
    expect(html).toContain('bewegt:active:scale-kachel');
    const leuchten = html.match(/[\w:-]*shadow-leuchten[\w-]*/g) ?? [];
    expect(leuchten.length).toBeGreaterThan(0);
    expect(leuchten.every((klasse) => klasse.startsWith('bewegt:'))).toBe(true);
  });
});

describe('Code-Motiv (B-33)', () => {
  it('staffelt höchstens acht Ziffern und ist dekorativ', () => {
    expect(CODE_MOTIV_ZIFFERN.length).toBeLessThanOrEqual(8);
    const html = renderToStaticMarkup(<CodeMotiv />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-motion="B-33"');
    expect(html.match(/sm24-ordnen/g)).toHaveLength(CODE_MOTIV_ZIFFERN.length);
  });

  it('leitet die Tiefe jedes Einschnitts aus seiner Ziffer ab', () => {
    const flach = codeMotivPfad([1, 1, 1]).d;
    const tief = codeMotivPfad([6, 6, 6]).d;
    const maxY = (d: string) => Math.max(...[...d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => Number(m[2])));
    expect(maxY(tief)).toBeGreaterThan(maxY(flach));
  });
});
