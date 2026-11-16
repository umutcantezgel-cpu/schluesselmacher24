import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import codeLinesJson from '../../../../../content/code-lines.json';
import type { CodeLine, Verfuegbarkeit } from '@/lib/types';

/* Produktseite samt Bestellformular (FA-INHALT-03I, L-10, Entscheidung 12): Dass der
 * Originalschlüssel beim Kunden bleibt, steht auf der gerenderten Seite höchstens zweimal
 * (Plakette und ein Satz), auch mit dem Kopf des Bestellformulars. Erfundene Testdaten aus den
 * Musterlinien (G4). */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/schluessel-nach-code/test',
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error('notFound');
  },
  permanentRedirect: (ziel: string) => {
    throw new Error(`redirect ${ziel}`);
  },
}));

const zustand: { lines: CodeLine[] } = { lines: [] };

vi.mock('@/lib/data', async () => {
  const { defaults } = await import('@/lib/data/defaults');
  return {
    getCodeLines: async () => zustand.lines,
    getSettings: async () => defaults.settings(),
    getGuide: async () => null,
    getHersteller: async () => defaults.hersteller(),
    getKategorien: async () => defaults.kategorien(),
  };
});

const { default: Seite } = await import('./page');

const MUSTER = (codeLinesJson as CodeLine[])[0];

async function sichtbarerText(availability: Verfuegbarkeit): Promise<string> {
  const line = { ...MUSTER, example: false, availability };
  zustand.lines = [line];
  const html = renderToStaticMarkup(await Seite({ params: Promise.resolve({ slug: line.slug }) }));
  // Nur sichtbarer Text: Strukturdaten und Auszeichnungen heraus.
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

describe('Produktseite: Original höchstens zweimal (L-10)', () => {
  for (const stand of ['lieferbar', 'auf-anfrage', 'nicht-lieferbar'] as Verfuegbarkeit[]) {
    it(`${stand}: samt Bestellformular höchstens zweimal`, async () => {
      const text = await sichtbarerText(stand);
      const anzahl = text.match(/Originalschlüssel/g)?.length ?? 0;
      expect(anzahl, text).toBeLessThanOrEqual(2);
      expect(anzahl).toBeGreaterThanOrEqual(1);
    });
  }

  it('lieferbar: das Bestellformular steht auf der Seite, sein Kopf nennt nur die Fertigung nach Code', async () => {
    const text = await sichtbarerText('lieferbar');
    expect(text).toContain('Schlüssel nach Code bestellen');
    expect(text).toContain('Wir fertigen nur nach dem Code, den Sie hier eintragen.');
  });
});
