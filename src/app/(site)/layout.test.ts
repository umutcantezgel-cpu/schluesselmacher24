import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

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
});
