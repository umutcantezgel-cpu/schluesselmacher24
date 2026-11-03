import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { oklchZuHex } from '@/lib/visual/area-theme';

/* Das Root-Layout lässt sich wegen next/font nicht im Test laden — geprüft
 * wird der Quelltext, wie in canonical.test.ts. */

describe('Root-Layout', () => {
  /*
   * Metadaten werden flach zusammengeführt: Eine Seite ohne eigenes openGraph
   * erbt das ganze Objekt des Layouts. Eine og:url hier meldete auf jeder
   * Unterseite die Startseite als geteilte Adresse.
   */
  it('vererbt keine og:url an die Unterseiten', () => {
    const layout = readFileSync(path.join(__dirname, 'layout.tsx'), 'utf8');
    const openGraph = layout.match(/openGraph:\s*\{[^}]*\}/)?.[0];
    expect(openGraph).toContain("siteName: 'SCHLÜSSELMACHER24'");
    expect(openGraph).not.toMatch(/\burl\s*:/);
  });

  /* KERN 2.0, A-003: Schriften als Dateien im Projekt, keine Schrift aus der Liste S1. */
  it('lädt die Schriften lokal aus src/fonts und nicht von Google', () => {
    const layout = readFileSync(path.join(__dirname, 'layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/next\/font\/google/);
    expect(layout).toMatch(/from '@\/fonts\/schriften'/);
    const schriften = readFileSync(path.join(process.cwd(), 'src/fonts/schriften.ts'), 'utf8');
    expect(schriften).toMatch(/from 'next\/font\/local'/);
    expect(schriften).not.toMatch(/\bInter\b/);
    /* Familienname = Name der Konstante, sonst zeigt die CSS-Variable ins Leere (Turbopack). */
    const familien = [...schriften.matchAll(/export const (\w+) = localFont\(\{[\s\S]*?prop: 'font-family', value: '(\w+)'/g)];
    expect(familien).toHaveLength(4);
    for (const [, name, familie] of familien) expect(familie, name).toBe(name.replace(/Erweitert$/, ''));
    for (const datei of schriften.matchAll(/'\.\/([a-z0-9-]+\.woff2)'/g)) {
      expect(existsSync(path.join(process.cwd(), 'src/fonts', datei[1])), datei[1]).toBe(true);
    }
  });

  it('nimmt als Farbe der Browserleiste den Seitenhintergrund (--background)', () => {
    const layout = readFileSync(path.join(__dirname, 'layout.tsx'), 'utf8');
    const css = readFileSync(path.join(__dirname, 'globals.css'), 'utf8');
    const hintergrund = css.match(/--background:\s*([^;]+);/)?.[1].trim() ?? '';
    expect(layout).toContain(`themeColor: '${oklchZuHex(hintergrund)}'`);
  });
});
