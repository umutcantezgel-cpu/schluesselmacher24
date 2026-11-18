import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { KompaktBild } from '@/components/ui/bild-flaeche';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { SchluesselGrafik } from '@/components/visual/generators/schluessel';
import { getVisual, schmaleFassung } from '@/components/visual/registry';
import { standardArticles } from '@/lib/data/defaults/standard-articles';
import type { ImageSlot } from '@/lib/types';

import { CodeProfilBild } from './code-profil-bild';

/* FA-SEO-03E: Warenkorb und Artikelliste zeichnen ihre Bilder ohne das Register aller Generatoren. Der Seitenkopf
   verlinkt `/warenkorb` auf jeder Seite, dessen Vorabruf zog über `ImagePlaceholder` alle Zeichnungen mit.
   Die Tests halten fest, (1) welche Zeichnungen dort vorkommen (nur `schluessel`, sonst Foto oder Fach-Icon),
   (2) dass die Bausteine dasselbe Markup ergeben wie `ImagePlaceholder` und (3) dass das Register nicht wieder
   hereinkommt. Erfundene Testdaten (G4). */

const lies = (pfad: string) => readFileSync(pfad, 'utf8');
/** Quelltext ohne Kommentare (Block, JSX-Block und Zeile), damit Erklärungen nicht als Code zählen. */
const ohneKommentare = (quelle: string) => quelle.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
/** Ziele der Importe, die zur Laufzeit geladen werden (ohne `import type`). */
const ziele = (quelle: string) =>
  [...quelle.matchAll(/^import\s+(?!type\s)[^;]*?from\s*'([^']+)'|import\(\s*'([^']+)'/gm)].map((m) => m[1] ?? m[2]);

const DATEIEN = [
  'src/app/(site)/warenkorb/warenkorb-ansicht.tsx',
  'src/app/(site)/warenkorb/code-profil-bild.tsx',
  'src/app/(site)/artikel/artikel-liste.tsx',
];

/** Zeichnungen, die Warenkorb und Artikelliste zeichnen dürfen (Name wie im Register). */
const ZEICHNUNGEN = new Set(['schluessel']);

const CODES = ['', 'A1234', 'HS-0042', '12345', 'ZK 7/31', 'x'.repeat(40), 'Ä-ß-1', '<b>&"'];

/** Bildstellen, wie Artikel sie mitbringen: Beispielartikel, Fotos, Motive mit und ohne passende Zeichnung. */
function artikelBilder(): ImageSlot[] {
  const slots: ImageSlot[] = standardArticles().map((a) => a.image);
  slots.push(
    { motif: 'Produktfoto: Satz gleichschließender Zylinder mit gemeinsamen Schlüsseln', ratio: '1/1' },
    { motif: 'Produktfoto: Zylinder messen', ratio: '1/1' },
    { motif: 'Produktfoto: Schließplan', ratio: '4/3' },
    { motif: 'Produktfoto', ratio: '1/1' },
    { motif: 'Produktfoto: Schlüssel', ratio: '1/1', visual: { generator: 'schliessplan', params: {} } },
    { motif: 'Produktfoto: Schlüssel', ratio: '1/1', bild: { url: '/medien/beispiel.jpg', alt: 'Beispiel' } },
    { motif: 'Produktfoto: Schlüssel', ratio: '1/1', bild: { url: '/medien/beispiel.jpg', alt: '' } },
  );
  return slots;
}

describe('Warenkorb und Artikelliste ohne das Register (FA-SEO-03E)', () => {
  it('CodeProfilBild ergibt dasselbe Markup wie ImagePlaceholder mit der Schlüsselzeichnung', () => {
    for (const code of CODES) {
      const slot: ImageSlot = {
        motif: 'Schlüsselprofil zum Code',
        ratio: '1/1',
        visual: { generator: 'schluessel', params: { typ: 'zylinder', code } },
      };
      const html = renderToStaticMarkup(<CodeProfilBild code={code} />);
      expect(html, code).toBe(renderToStaticMarkup(<ImagePlaceholder slot={slot} frei />));
      expect(html).toContain('<svg');
    }
  });

  it('KompaktBild ergibt dasselbe Markup wie ImagePlaceholder compact, so wie Warenkorb und Liste es aufrufen', () => {
    let verglichen = 0;
    for (const slot of artikelBilder()) {
      // Warenkorb: Standardposition und Zylindersatz
      expect(renderToStaticMarkup(<KompaktBild slot={slot} />), slot.motif).toBe(
        renderToStaticMarkup(<ImagePlaceholder slot={slot} compact />),
      );
      // Artikelliste
      expect(renderToStaticMarkup(<KompaktBild slot={slot} frei className="w-10 shrink-0" sizes="40px" />), slot.motif).toBe(
        renderToStaticMarkup(<ImagePlaceholder slot={slot} compact frei className="w-10 shrink-0" sizes="40px" />),
      );
      verglichen += 2;
    }
    expect(verglichen).toBeGreaterThanOrEqual(2 * (standardArticles().length + 7));
  });

  it('die kompakte Fläche zeichnet nie eine Zeichnung, auch wenn das Motiv eine hätte', () => {
    for (const slot of artikelBilder()) {
      expect(renderToStaticMarkup(<KompaktBild slot={slot} />), slot.motif).not.toContain('<svg role="img"');
    }
  });

  it('nutzt dieselbe Schlüsselzeichnung wie das Register, ohne schmale Fassung', () => {
    expect(SchluesselGrafik).toBe(getVisual('schluessel'));
    expect(schmaleFassung({ generator: 'schluessel', params: {} })).toBeNull();
  });

  it('zieht weder ImagePlaceholder noch das Register herein', () => {
    for (const datei of DATEIEN) {
      const quelle = lies(datei);
      const importe = ziele(quelle);
      expect(importe, datei).not.toContain('@/components/ui/image-placeholder');
      expect(importe.some((z) => /visual\/registry$/.test(z)), datei).toBe(false);
      expect(ohneKommentare(quelle), datei).not.toMatch(/\brenderVisual\b|\bImagePlaceholder\b/);
    }
  });

  it('zeichnet nur Zeichnungen aus der Auswahl; eine andere Zeichnung lässt den Test scheitern', () => {
    for (const datei of DATEIEN) {
      const quelle = lies(datei);
      for (const ziel of ziele(quelle)) {
        const m = /visual\/generators\/([a-z-]+)$/.exec(ziel);
        if (m) {
          expect(
            ZEICHNUNGEN.has(m[1]),
            `${datei} bindet den Generator ${m[1]} ein; für Zeichnungen aus Inhalten ImagePlaceholder nutzen oder die Auswahl hier begründet ergänzen`,
          ).toBe(true);
        }
      }
      // Kein Verweis auf eine Zeichnung über Daten (`generator: …`, `visual: …`): solche Stellen brauchen ImagePlaceholder.
      const code = ohneKommentare(quelle);
      for (const m of code.matchAll(/generator:\s*'([^']+)'/g)) expect(ZEICHNUNGEN.has(m[1]), `${datei}: ${m[1]}`).toBe(true);
      expect(code, datei).not.toMatch(/\bvisual:\s*[{\w]/);
    }
  });
});
