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

describe('Seitenstruktur', () => {
  const alle = seiten(__dirname);

  it('findet die Seiten', () => {
    expect(alle.length).toBeGreaterThan(30);
  });

  /*
   * Next scrollt nach einem Seitenwechsel nur nach oben, wenn das erste Element der
   * Seite außerhalb des Bildes liegt. Ein äußeres `AreaScope` hat `display: contents`
   * und damit keine Fläche – die neue Seite bliebe an der alten Scrollposition stehen.
   * Die Bereichsfarbe kommt deshalb aus dem `layout.tsx` des Bereichs.
   */
  it('beginnt keine Seite mit einem AreaScope um den ganzen Inhalt', () => {
    const funde = alle.filter((datei) => /return \(\s*<AreaScope\b/.test(readFileSync(datei, 'utf8')));
    expect(funde.map((datei) => path.relative(__dirname, datei))).toEqual([]);
  });
});
