import { readFileSync } from 'node:fs';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { renderVisual, schmaleFassung } from '@/components/visual/registry';
import { tutorials } from '@/lib/data/defaults/tutorials';
import type { ImageSlot, Tutorial } from '@/lib/types';
import { visualFuerMotiv } from '@/lib/visual/motiv';

import { SCHRITT_BILD_BREITE, SCHRITT_BILD_EINZUG, SCHRITT_BILD_KLASSE, SCHRITT_BILD_SIZES } from './schritt-bild';
import { TutorialInhalt } from './tutorial-inhalt';

/* Schrift der Zeichnungen in den Tutorial-Schritten (A-068): mindestens 14 px auf dem Bildschirm, bei jeder
 * Fensterbreite. Die Rechnung folgt der Bildfläche (`ImagePlaceholder`): Kasten mit 1 px Rahmen im
 * Seitenverhältnis des Eintrags, die Zeichnung füllt ihn und behält ihr eigenes Seitenverhältnis. Ist der
 * Kasten flacher als die Zeichnung, begrenzt die Höhe, sonst die Breite. */

const MINDEST_PX = 14;
const VERHAELTNIS: Record<ImageSlot['ratio'], number> = { '16/9': 16 / 9, '4/3': 4 / 3, '1/1': 1, '3/2': 3 / 2, '21/9': 21 / 9 };

/** Kleinste Schrift der Zeichnung auf dem Bildschirm, oder `null`, wenn sie keine Schrift trägt. */
function kleinsteSchrift(html: string, kastenBreite: number, ratio: ImageSlot['ratio']): number | null {
  if (!/<text[\s>]/.test(html)) return null;
  const flaeche = html.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const groessen = [...html.matchAll(/font-size="([\d.]+)"/g)].map((t) => Number(t[1]));
  if (!flaeche || groessen.length === 0) throw new Error('Zeichnung mit Schrift, aber ohne lesbare Fläche oder Schriftgröße');
  const innenBreite = kastenBreite - 2;
  const innenHoehe = kastenBreite / VERHAELTNIS[ratio] - 2;
  const massstab = Math.min(innenBreite / Number(flaeche[1]), innenHoehe / Number(flaeche[2]));
  return Math.min(...groessen) * massstab;
}

interface Fall {
  name: string;
  ratio: ImageSlot['ratio'];
  breit: string;
  schmal: string;
}

/** Jede Zeichnung in den Schritten: breite Fassung und die Fassung, die unter 640 px erscheint. */
function zeichnungen(liste: Tutorial[]): Fall[] {
  const faelle: Fall[] = [];
  for (const tutorial of liste) {
    tutorial.steps.forEach((schritt, index) => {
      const slot = schritt.image;
      if (!slot || slot.bild?.url) return;
      const ref = slot.visual ?? visualFuerMotiv(slot.motif);
      const breit = ref ? renderVisual(ref, '') : null;
      if (!ref || !breit) return;
      const schmalRef = schmaleFassung(ref);
      const schmal = schmalRef ? renderVisual(schmalRef, '') : breit;
      faelle.push({
        name: `${tutorial.id}, Schritt ${index + 1}`,
        ratio: slot.ratio,
        breit: renderToStaticMarkup(breit),
        schmal: renderToStaticMarkup(schmal ?? breit),
      });
    });
  }
  return faelle;
}

const startbestand = tutorials();
const json = JSON.parse(readFileSync('content/tutorials.json', 'utf8')) as Tutorial[];

describe('Bildfläche der Tutorial-Schritte', () => {
  it('steht unter dem Text und nie in einer schmalen Spalte', () => {
    const tutorial = startbestand.find((t) => t.id === 'hs-und-ghs')!;
    const html = renderToStaticMarkup(<TutorialInhalt tutorial={tutorial} />);
    // Kein Raster mit Spalten in der Schrittliste, gleich unter welchem Namen.
    const liste = html.slice(html.indexOf('<ol'), html.indexOf('</ol>'));
    expect(liste.length).toBeGreaterThan(500);
    expect(liste).not.toMatch(/grid-cols|col-span|columns-|\bflex-row\b|\bfloat-/);
    const flaechen = html.match(new RegExp(`<div class="${SCHRITT_BILD_EINZUG}"><div class="[^"]*`, 'g')) ?? [];
    expect(flaechen).toHaveLength(2);
    for (const flaeche of flaechen) expect(flaeche).toMatch(new RegExp(`\\bw-full\\b.*${SCHRITT_BILD_KLASSE}`));
  });

  it('nennt dem Browser die Breite, die die Klasse setzt', () => {
    // Klasse und Breite gehören zusammen: Wer die Klasse ändert, muss hier die Breite nachtragen, und die
    // Rechnung unten läuft dann mit der neuen Breite.
    const KLASSE_PX: Record<string, number> = { 'sm:max-w-sm': 24 * 16, 'sm:max-w-md': 28 * 16, 'sm:max-w-lg': 32 * 16 };
    expect(KLASSE_PX[SCHRITT_BILD_KLASSE]).toBe(SCHRITT_BILD_BREITE.breit);
    expect(SCHRITT_BILD_BREITE.telefon).toBe(360 - 2 * 20);
    expect(SCHRITT_BILD_SIZES).toBe('(min-width: 640px) 384px, 100vw');
  });

  it.each([
    ['Startbestand im Code', startbestand],
    ['content/tutorials.json', json],
  ])('%s: jede Zeichnung mit Schrift erreicht mindestens 14 px, am Telefon und ab 640 px', (_name, liste) => {
    const faelle = zeichnungen(liste);
    const mitSchrift = faelle.filter((f) => kleinsteSchrift(f.breit, SCHRITT_BILD_BREITE.breit, f.ratio) !== null);
    // Maßzeichnung, zwei Schließpläne und die Foto-Beispiele mit Beschriftung
    expect(mitSchrift.length).toBeGreaterThanOrEqual(4);
    const zuKlein: string[] = [];
    for (const fall of mitSchrift) {
      // Die Rechnung liest Schriftgröße und Zeichenfläche. Eine Zeichnung, die sich selbst verkleinert
      // (`scale(…)`, etwa ein großer Schließplan), sähe sie zu groß: Solche Zeichnungen gibt es hier nicht.
      expect(`${fall.name}: ${/scale\(/.test(fall.breit + fall.schmal)}`).toBe(`${fall.name}: false`);
      const telefon = kleinsteSchrift(fall.schmal, SCHRITT_BILD_BREITE.telefon, fall.ratio)!;
      const breit = kleinsteSchrift(fall.breit, SCHRITT_BILD_BREITE.breit, fall.ratio)!;
      if (telefon < MINDEST_PX) zuKlein.push(`${fall.name} am Telefon: ${telefon.toFixed(2)} px (Kasten ${fall.ratio})`);
      if (breit < MINDEST_PX) zuKlein.push(`${fall.name} ab 640 px: ${breit.toFixed(2)} px (Kasten ${fall.ratio})`);
    }
    expect(zuKlein).toEqual([]);
  });

  it('die Rechnung findet den Befund der Abnahme: 3/2-Kasten und schmale Spalte reichen nicht', () => {
    const ghs = zeichnungen(startbestand).find((f) => f.name === 'hs-und-ghs, Schritt 2')!;
    // Telefon, alter Kasten 3/2: Die Höhe begrenzt (gemessen 13,31 px).
    expect(kleinsteSchrift(ghs.schmal, 320, '3/2')!).toBeLessThan(MINDEST_PX);
    expect(kleinsteSchrift(ghs.schmal, 320, '3/2')!).toBeCloseTo(13.31, 1);
    // Spalte neben dem Text bei 1024 px Fensterbreite (gemessen 10,95 px).
    expect(kleinsteSchrift(ghs.breit, 246, '3/2')!).toBeCloseTo(10.95, 1);
  });
});
