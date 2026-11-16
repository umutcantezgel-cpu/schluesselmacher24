import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import codeLinesJson from '../../../../content/code-lines.json';
import type { CodeLine, Verfuegbarkeit } from '@/lib/types';

/* Übersicht „Schlüssel nach Code“ (FA-INHALT-03I, L-14 bis L-16, L-21, L-22): Der Kopf beschreibt den
 * Direktkauf nur, wenn mindestens ein Produkt lieferbar ist; der Leerzustand sagt nur, was heute gilt.
 * Erfundene Testdaten aus den Musterlinien (G4). */

vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: () => {}, push: () => {}, replace: () => {} }),
  usePathname: () => '/schluessel-nach-code',
  useSearchParams: () => new URLSearchParams(),
}));

const zustand: { lines: CodeLine[] } = { lines: [] };

vi.mock('@/lib/data', async () => {
  const { defaults } = await import('@/lib/data/defaults');
  return {
    getRubrik: async (id: string) => defaults.rubriken().find((r) => r.id === id) ?? null,
    getPageContent: async () => null,
    getCodeLines: async () => zustand.lines,
    getSettings: async () => defaults.settings(),
    getGuide: async () => null,
    getHersteller: async () => defaults.hersteller(),
    getKategorien: async () => defaults.kategorien(),
  };
});

const { default: Seite, generateMetadata } = await import('./page');

const MUSTER = (codeLinesJson as CodeLine[]).slice(0, 3);
const mit = (...staende: Verfuegbarkeit[]): CodeLine[] =>
  staende.map((availability, i) => ({ ...MUSTER[i], example: false, manufacturer: 'Testwerk', availability }));

async function seite(): Promise<string> {
  return renderToStaticMarkup(await Seite()).replace(/\s+/g, ' ');
}

describe('Übersicht Schlüssel nach Code', () => {
  beforeEach(() => {
    zustand.lines = [];
  });

  it('mit einem lieferbaren Produkt: Direktkauf im Kopf', async () => {
    zustand.lines = mit('nicht-lieferbar', 'lieferbar');
    const html = await seite();
    expect(html).toContain('Code eingeben, Stückzahl wählen, bestellen.');
    expect(html).toContain('Nach Code bestellen');
    expect(html).not.toContain('Bestellen können Sie hier zurzeit nicht.');
  });

  it('mit Produkten, aber keinem lieferbaren: Kopf „Auf Anfrage“, Anfrage-Fassung, Knopf „Schlüssel finden“', async () => {
    for (const staende of [['auf-anfrage', 'nicht-lieferbar'], ['nicht-lieferbar', 'nicht-lieferbar']] as Verfuegbarkeit[][]) {
      zustand.lines = mit(...staende);
      const html = await seite();
      expect(html, staende.join()).toContain('Auf Anfrage');
      expect(html, staende.join()).toContain('Bestellen können Sie hier zurzeit nicht. Fragen Sie uns mit Ihrem Code an. Wir prüfen ihn und melden uns.');
      expect(html, staende.join()).not.toContain('Code eingeben, Stückzahl wählen, bestellen.');
      expect(html, staende.join()).not.toContain('Nach Code bestellen');
      expect(html, staende.join()).toContain('Schlüssel finden');
    }
  });

  it('ohne lieferbares Produkt: kein Kaufablauf, sondern die Schritte der Anfrage', async () => {
    for (const staende of [[], ['auf-anfrage', 'nicht-lieferbar'], ['nicht-lieferbar']] as Verfuegbarkeit[][]) {
      zustand.lines = mit(...staende);
      const html = await seite();
      expect(html, staende.join()).not.toContain('Stückzahl wählen, bezahlen');
      expect(html, staende.join()).not.toContain('Vom Code zum fertigen Schlüssel');
      expect(html, staende.join()).toContain('Vom Code zur Anfrage');
      expect(html, staende.join()).toContain('Heute beginnt alles mit Ihrer Anfrage.');
      // Berechtigungsnachweis auch im Anfrageweg (R13).
      expect(html, staende.join()).toContain('Sie bestätigen, dass Sie den Schlüssel nachmachen lassen dürfen.');
    }
  });

  it('mit lieferbarem Produkt: Kaufablauf aus den Rubrikdaten', async () => {
    zustand.lines = mit('lieferbar');
    const html = await seite();
    expect(html).toContain('Vom Code zum fertigen Schlüssel');
    expect(html).toContain('Stückzahl wählen, bezahlen');
    expect(html).not.toContain('Heute beginnt alles mit Ihrer Anfrage.');
  });

  it('Suchtitel und -beschreibung: Anfrage-Fassung, solange kein Produkt lieferbar ist', async () => {
    zustand.lines = mit('lieferbar', 'auf-anfrage');
    const direkt = await generateMetadata();
    expect(String(direkt.description)).toContain('Stückzahl wählen, bestellen');
    for (const staende of [[], ['auf-anfrage'], ['nicht-lieferbar', 'auf-anfrage']] as Verfuegbarkeit[][]) {
      zustand.lines = mit(...staende);
      const meta = await generateMetadata();
      expect(meta.title, staende.join()).toBe('Schlüssel nach Code anfragen');
      expect(String(meta.description), staende.join()).not.toMatch(/bestellen|Stückzahl/);
      expect([...String(meta.description)].length).toBeGreaterThanOrEqual(120);
      expect([...String(meta.description)].length).toBeLessThanOrEqual(160);
    }
  });

  it('Herstellerliste: „Produkt/Produkte“ statt „Linie“, ohne „und Preisen“', async () => {
    zustand.lines = mit('lieferbar', 'auf-anfrage');
    const html = await seite();
    expect(html).toContain('Für jeden Hersteller gibt es eine eigene Seite mit seinen Systemen und Codes.');
    expect(html).toMatch(/2 Produkte/);
    expect(html).not.toMatch(/Linien?\b/);
  });

  it('ohne Produkte: keine Zusage eines künftigen Direktkaufs', async () => {
    const html = await seite();
    expect(html).toContain('Direkt bestellen können Sie hier derzeit nicht.');
    expect(html).toContain('Wir prüfen Ihren Code auf Anfrage.');
    expect(html).toContain('Heute beginnt alles mit Ihrer Anfrage. Wir prüfen Ihren Code und melden uns mit einem Angebot oder einer Rückfrage.');
    expect(html).not.toMatch(/sobald|bis dahin|noch nicht/i);
  });
});
