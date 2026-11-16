import { readFileSync } from 'node:fs';
import path from 'node:path';

import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KompaktBild } from '@/components/ui/bild-flaeche';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import type { ImageSlot } from '@/lib/types';

/*
 * FA-SEO-03B: Der Konfigurator zeigt das Messfoto mit `KompaktBild` statt `ImagePlaceholder compact`. Beide
 * zeichnen dasselbe (Foto oder Fach-Icon, nie eine Fachgrafik); `ImagePlaceholder` zog aber das Register aller
 * Zeichnungs-Generatoren in das Bündel der Ansicht (rund 19 KB komprimiert, zwei Skripte).
 */
describe('Messfoto im Konfigurator (FA-SEO-03B)', () => {
  const faelle: Array<[string, ImageSlot]> = [
    ['mit Foto', { motif: 'Messfoto Profilzylinder', ratio: '4/3', bild: { url: '/api/medien/file/mass.jpg', alt: 'Zylinder mit Maßband' } }],
    ['Foto ohne Alternativtext', { motif: 'Messfoto Profilzylinder', ratio: '16/9', bild: { url: '/api/medien/file/mass.jpg', alt: '' } }],
    ['Foto ohne Adresse', { motif: 'Messfoto Profilzylinder', ratio: '4/3', bild: { url: '', alt: 'leer' } }],
    ['ohne Foto, mit Generator', { motif: 'Profilzylinder messen', ratio: '4/3', visual: { generator: 'zylinder-mass', params: {} } }],
  ];

  it.each(faelle)('zeichnet %s genau wie ImagePlaceholder compact', (_name, slot) => {
    expect(renderToStaticMarkup(<KompaktBild slot={slot} />)).toBe(renderToStaticMarkup(<ImagePlaceholder slot={slot} compact />));
  });

  it('der Konfigurator bindet das Register der Generatoren nicht mehr ein', () => {
    const quelle = readFileSync(path.join(__dirname, 'konfigurator.tsx'), 'utf8');
    expect(quelle).not.toContain("from '@/components/ui/image-placeholder'");
    expect(quelle).toContain('<KompaktBild slot={measureFigure} />');
  });
});
