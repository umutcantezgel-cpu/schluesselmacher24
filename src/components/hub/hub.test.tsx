import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { FACH_ICON_REGISTRY, fachIconKomponente } from '@/components/visual/fach-icon';
import { defaults } from '@/lib/data/defaults';
import { hubKacheln, RUBRIK_ICONS } from '@/lib/rubriken';
import type { Rubrik } from '@/lib/types';

import { CODE_MOTIV_ZIFFERN, CodeMotiv, codeMotivPfad } from './code-motiv';
import { kurzImNamen, rubrikUebergang, ZUSATZ_AUF_DEM_TELEFON } from './hub-kachel';
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

describe('Raster des Hubs (G-02, FA-03, A-052)', () => {
  /** Spaltenklassen der gezeichneten Liste und Zahl der Kacheln. */
  const raster = (anzahl: number) => {
    const html = renderToStaticMarkup(<IntentHub rubriken={hubKacheln(defaults.rubriken()).slice(0, anzahl)} />);
    const klassen = html.match(/<ul aria-label="Leistungen" class="([^"]*)"/)?.[1].split(' ') ?? [];
    return { klassen, kacheln: html.match(/data-rubrik=/g)?.length ?? 0 };
  };
  /** Kacheln je Reihe bei n Kacheln und s Spalten (die letzte Reihe linksbündig). */
  const reihen = (n: number, s: number) => Array.from({ length: Math.ceil(n / s) }, (_, i) => Math.min(s, n - i * s));

  it('zeichnet die 14 Hauptzugänge auf dem Telefon in drei Spalten (3, 3, 3, 3, 2) und ab 768 px in vier (4, 4, 4, 2)', () => {
    const { klassen, kacheln } = raster(14);
    expect(kacheln).toBe(14);
    expect(klassen).toContain('grid-cols-3');
    expect(klassen).toContain('md:grid-cols-4');
    expect(klassen).not.toContain('md:grid-cols-3');
    expect(reihen(kacheln, 3)).toEqual([3, 3, 3, 3, 2]);
    expect(reihen(kacheln, 4)).toEqual([4, 4, 4, 2]);
  });

  it('zeichnet bei 13 Kacheln dieselben Spalten; die einzelne Kachel in der letzten Reihe ist hingenommen', () => {
    const { klassen, kacheln } = raster(13);
    expect(kacheln).toBe(13);
    expect(klassen).toContain('grid-cols-3');
    expect(klassen).toContain('md:grid-cols-4');
    expect(reihen(kacheln, 3)).toEqual([3, 3, 3, 3, 1]);
    expect(reihen(kacheln, 4)).toEqual([4, 4, 4, 1]);
  });

  it('setzt ab 768 px immer vier Spalten ohne Leitkachel, bei bis zu drei Kacheln drei', () => {
    for (const anzahl of [4, 9, 11, 12, 13, 14, 16]) expect(hubRaster(anzahl).spalten).toBe(4);
    expect(hubRaster(3).spalten).toBe(3);
    expect(hubRaster(1).spalten).toBe(3);
    const { klassen } = raster(3);
    expect(klassen).toContain('md:grid-cols-3');
    expect(klassen).not.toContain('md:grid-cols-4');
  });

  it('zeichnet die Kacheln ohne Leitkachel und ohne Spannen, die letzte Reihe linksbündig', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={hubKacheln(defaults.rubriken())} />);
    expect(html).not.toContain('data-leit');
    expect(html).not.toMatch(/col-span-2|row-span-2|justify-items-center|place-content-center/);
    expect(html).toContain('grid-cols-3');
    expect(html).toContain('md:grid-cols-4');
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

  it('zeigt genau die 14 Hauptzugänge des Inhabers in seiner Reihenfolge (FA-03, A-052)', () => {
    expect(live.map((r) => r.id)).toEqual([
      'autoschluessel',
      'motorradschluessel',
      'roller-und-kleinstfahrzeuge',
      'e-scooter',
      'seniorenmobile',
      'fahrradschluessel',
      'schluessel-nach-vorlage',
      'schluessel-nach-code',
      'sperrschliessung',
      'schliessanlage',
      'elektronische-schliesssysteme',
      'sicherheitstechnik',
      'schluesseldienst-vor-ort',
      'beratung',
    ]);
  });

  it('zeigt auf dem Telefon den kurzen Namen und nennt den vollen Namen als zugänglichen Namen, sichtbar ab 768 px', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} telefon={telefon} />);
    for (const r of live) {
      const kachel = html.slice(html.indexOf(`data-rubrik="${r.id}"`), html.indexOf('</a>', html.indexOf(`data-rubrik="${r.id}"`)));
      expect(kachel, r.id).toMatch(new RegExp(`data-kachelname="voll" class="sr-only[^"]* md:not-sr-only[^"]*">${r.name}<`));
      // Name im Namen (WCAG 2.5.3) mit ganzen Wörtern: Steht der kurze Name als Wort im vollen, bleibt
      // er verborgen; sonst ist er Teil des zugänglichen Namens und steht vorn, durch Komma getrennt.
      const alsWort = new RegExp(`(?<![\\p{L}\\p{N}])${r.laienname}(?![\\p{L}\\p{N}])`, 'iu').test(r.name);
      expect(kurzImNamen(r.laienname, r.name), r.id).toBe(alsWort);
      if (alsWort) {
        expect(kachel, r.id).toMatch(new RegExp(`aria-hidden="true" data-kachelname="kurz" class="[^"]*md:hidden[^"]*">${r.laienname}<`));
      } else {
        expect(kachel, r.id).toMatch(new RegExp(`<span data-kachelname="kurz" class="[^"]*md:hidden[^"]*">${r.laienname}</span><span class="sr-only md:hidden">, </span><span data-kachelname="voll"`));
      }
    }
  });

  it('erkennt den kurzen Namen nur als ganzes Wort im vollen Namen (WCAG 2.5.3)', () => {
    expect(kurzImNamen('Auto', 'Autoschlüssel')).toBe(false);
    expect(kurzImNamen('Fahrrad', 'Fahrradschlüssel')).toBe(false);
    expect(kurzImNamen('Zutritt', 'Elektronische Zutrittslösungen')).toBe(false);
    expect(kurzImNamen('Schließanlage', 'Schließanlagen')).toBe(false);
    expect(kurzImNamen('Roller', 'Roller und Kleinstfahrzeuge')).toBe(true);
    expect(kurzImNamen('Nach Vorlage', 'Schlüssel nach Vorlage oder einschicken')).toBe(true);
    expect(kurzImNamen('Zylinder', 'Sperrschließungen und gleichschließende Zylinder')).toBe(true);
    expect(kurzImNamen('E-Scooter', 'E-Scooter und ähnliche Elektrofahrzeuge')).toBe(true);
  });

  it('hält die Schrift der Kacheln bei mindestens 13 px und die Trefferfläche bei 44 px (FA-01)', () => {
    const html = renderToStaticMarkup(<IntentHub rubriken={live} />);
    const kacheln = [...html.matchAll(/<a [^>]*data-rubrik="[^"]+"[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]);
    expect(kacheln).toHaveLength(14);
    for (const kachel of kacheln) {
      // text-caption sind 12 px; die Kachel nutzt text-small (15 px) und größer.
      expect(kachel).not.toContain('text-caption');
      expect(kachel).toMatch(/class="group [^"]*min-h-touch /);
    }
  });

  it('zeigt die Laienerklärung auf dem Telefon nur bei der Sperrschließung, sonst ab 768 px (G-09, Höhe)', () => {
    expect([...ZUSATZ_AUF_DEM_TELEFON]).toEqual(['sperrschliessung']);
    const html = renderToStaticMarkup(<IntentHub rubriken={live} />);
    for (const r of live.filter((x) => x.zusatz)) {
      const start = html.indexOf(`data-rubrik="${r.id}"`);
      const kachel = html.slice(start, html.indexOf('</a>', start));
      const zusatz = kachel.match(/data-kachelname="zusatz" class="([^"]*)"/)?.[1] ?? '';
      if (r.id === 'sperrschliessung') expect(zusatz).not.toMatch(/(^| )sr-only/);
      else expect(zusatz, r.id).toMatch(/(^| )sr-only .*md:not-sr-only/);
    }
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
