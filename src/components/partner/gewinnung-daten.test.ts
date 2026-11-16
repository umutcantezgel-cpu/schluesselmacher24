import { describe, expect, it, vi } from 'vitest';

import { GEWINNUNG_SEITEN } from '@/lib/partner/gewinnung';

/* Der im Admin gepflegte Kurztext der Partnerseiten kommt in den Verweislisten und in /llms.txt an
 * (FA-22-36, Abnahme FA-PLATTFORM-02B). Erfundene Testtexte (G4). */

const gepflegt: Record<string, { subline?: string; headline?: string } | null> = {};

vi.mock('@/lib/data', () => ({
  getPageContent: async (route: string) => {
    if (route === 'partner-werden/kooperation') throw new Error('nicht erreichbar');
    return gepflegt[route] ?? null;
  },
}));

const { gepflegteGewinnungSeiten } = await import('./gewinnung-daten');

describe('Partnerseiten mit gepflegten Texten', () => {
  it('ein gepflegter Kurztext ersetzt den aus dem Code, ein leerer nicht; ein Lesefehler lässt den Code gelten', async () => {
    gepflegt['partner-werden/kfz-betriebe'] = { subline: 'Testkurztext für Werkstätten.' };
    gepflegt['partner-werden/netzwerk-deutschland'] = { subline: '   ' };
    const seiten = await gepflegteGewinnungSeiten();
    expect(seiten.map((s) => s.slug)).toEqual(GEWINNUNG_SEITEN.map((s) => s.slug));
    const nach = new Map(seiten.map((s) => [s.slug, s.kurztext]));
    const code = new Map(GEWINNUNG_SEITEN.map((s) => [s.slug, s.kurztext]));
    expect(nach.get('kfz-betriebe')).toBe('Testkurztext für Werkstätten.');
    expect(nach.get('netzwerk-deutschland')).toBe(code.get('netzwerk-deutschland'));
    expect(nach.get('kooperation')).toBe(code.get('kooperation'));
    expect(nach.get('auftraege-erhalten')).toBe(code.get('auftraege-erhalten'));
  });

  it('lässt die eigene Seite auf Wunsch weg (Verweise auf die übrigen)', async () => {
    const seiten = await gepflegteGewinnungSeiten('kfz-betriebe');
    expect(seiten.map((s) => s.slug)).not.toContain('kfz-betriebe');
    expect(seiten).toHaveLength(GEWINNUNG_SEITEN.length - 1);
  });

  it('die Verweislisten und /llms.txt lesen die gepflegten Seiten', async () => {
    const { readFileSync } = await import('node:fs');
    const path = await import('node:path');
    const lies = (...teile: string[]) => readFileSync(path.join(process.cwd(), ...teile), 'utf8');
    expect(lies('src', 'app', 'llms.txt', 'route.ts')).toContain('gepflegteGewinnungSeiten()');
    expect(lies('src', 'app', '(site)', 'partner-werden', 'page.tsx')).toContain('gepflegteGewinnungSeiten()');
    for (const slug of GEWINNUNG_SEITEN.map((s) => s.slug)) {
      expect(lies('src', 'app', '(site)', 'partner-werden', slug, 'page.tsx'), slug).toContain('gepflegteGewinnungSeiten(SEITE.slug)');
    }
  });
});
