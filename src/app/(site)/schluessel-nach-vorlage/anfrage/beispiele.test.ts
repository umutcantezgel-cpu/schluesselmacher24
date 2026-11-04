import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/* Prüft am Quelltext, dass die Beispielbilder gezeichnete Generatoren tragen
 * und dass der Hinweis zur Ablesbarkeit auf Seite und Formular steht (G-23, G-45). */

const formular = readFileSync(new URL('./anfrage-formular.tsx', import.meta.url), 'utf8');
const seite = readFileSync(new URL('../page.tsx', import.meta.url), 'utf8');

const HINWEIS = 'Nicht jedes Foto ist ablesbar. Reichen die Bilder für eine sichere Bestimmung nicht, bitten wir Sie, den Schlüssel einzuschicken.';

/** Liefert den Rumpf der Konstante `name: ImageSlot = { … };` aus dem Quelltext. */
function beispielRumpf(name: string): string {
  const treffer = new RegExp(`const ${name}: ImageSlot = \\{([\\s\\S]*?)\\n\\};`).exec(formular);
  if (!treffer) throw new Error(`Konstante ${name} nicht gefunden`);
  return treffer[1];
}

describe('Beispielbilder im Anfrageformular', () => {
  it.each(['EXAMPLE_FRONT', 'EXAMPLE_BACK', 'EXAMPLE_TIP'])('%s trägt einen generator', (name) => {
    expect(beispielRumpf(name)).toMatch(/visual:\s*\{\s*generator:\s*'[a-z-]+'/);
  });

  it('übernimmt die Generatoren der Seite für Vorder-, Rückseite und Spitze', () => {
    expect(beispielRumpf('EXAMPLE_FRONT')).toContain("generator: 'schluessel', params: { typ: 'zylinder' }");
    expect(beispielRumpf('EXAMPLE_BACK')).toContain("generator: 'schluessel', params: { typ: 'zylinder', code: 'rueckseite' }");
    expect(beispielRumpf('EXAMPLE_TIP')).toContain("generator: 'profilschnitt', params: { beschriftung: false }");
  });

  it('enthält den Hinweissatz zur Ablesbarkeit', () => {
    expect(formular).toContain(HINWEIS);
  });
});

describe('Seite Schlüssel nach Foto', () => {
  it('enthält den Hinweissatz zur Ablesbarkeit unter den drei Aufnahmen', () => {
    expect(seite).toContain(HINWEIS);
  });
});
