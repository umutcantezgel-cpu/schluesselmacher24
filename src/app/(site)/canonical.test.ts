import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/** Alle `page.tsx` unter `src/app/(site)`. */
function seiten(ordner: string): string[] {
  return readdirSync(ordner).flatMap((name) => {
    const pfad = path.join(ordner, name);
    if (statSync(pfad).isDirectory()) return seiten(pfad);
    return name === 'page.tsx' ? [pfad] : [];
  });
}

/** Seiten ohne eigene Metadaten, die nur auf die 404-Seite führen. */
const NUR_404 = ['[...unbekannt]/page.tsx'];

describe('canonical', () => {
  it('erbt keine canonical-Vorgabe aus dem Root-Layout', () => {
    const layout = readFileSync(path.join(__dirname, 'layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/canonical\s*:/);
  });

  /*
   * Ohne Vorgabe im Layout braucht jede indexierbare Seite ihre eigene
   * canonical. Ausgenommen sind Seiten, die immer auf noindex stehen.
   */
  it('setzt auf jeder indexierbaren Seite eine eigene canonical', () => {
    const fehlend = seiten(__dirname)
      .map((datei) => ({ datei: path.relative(__dirname, datei), quelle: readFileSync(datei, 'utf8') }))
      .filter(({ datei }) => !NUR_404.includes(datei))
      .filter(({ quelle }) => !/canonical\s*:/.test(quelle))
      .filter(({ quelle }) => !/robots:\s*\{\s*index:\s*false/.test(quelle))
      .map(({ datei }) => datei);
    expect(fehlend).toEqual([]);
  });

  it('führt die Seite „Zahlung und Versand“ mit eigener canonical', () => {
    const quelle = readFileSync(path.join(__dirname, 'rechtliches/versand-und-zahlung/page.tsx'), 'utf8');
    expect(quelle).toContain("canonical: '/rechtliches/versand-und-zahlung'");
  });
});
