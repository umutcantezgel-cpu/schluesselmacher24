import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/data', () => ({
  getRubrik: async (id: string) => (id === 'motorradschluessel' ? { id, status: 'live' } : { id, status: 'pausiert' }),
}));

const rubrik = await import('./rubrik');

/*
 * FA-SEO-03B: `SeitenDaten` steht auf fast jeder Seite. Ein Import aus `./seiten` hängte über das
 * Anfrageformular den Foto-Upload und alle Zeichnungs-Generatoren an das Client-Bündel jeder dieser Seiten
 * (Shop: 20 statt 15 Skripte, rund 60 KB komprimiert mehr). Rubrik-Stand und Brotkrume liegen deshalb in
 * `./rubrik`, ohne Client-Baustein.
 */
describe('Rubrik-Stand ohne Client-Baustein (FA-SEO-03B)', () => {
  const quelle = (datei: string) => readFileSync(path.join(__dirname, datei), 'utf8');

  it('rubrik.ts importiert keinen Baustein und ist selbst keiner', () => {
    const text = quelle('rubrik.ts');
    expect(text).not.toMatch(/^['"]use client['"]/m);
    const importe = [...text.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    expect(importe).toEqual(['@/lib/data', '@/lib/fahrzeuge/anfrage-klassen']);
  });

  it('SeitenDaten liest den Rubrik-Stand aus ./rubrik, nicht aus ./seiten', () => {
    const text = readFileSync(path.join(__dirname, '..', 'seo', 'seiten-daten.tsx'), 'utf8');
    expect(text).toContain("from '@/components/fahrzeug-anfrage/rubrik'");
    expect(text).not.toContain("from '@/components/fahrzeug-anfrage/seiten'");
  });

  it('./seiten gibt dieselben Werte weiter (eine Quelle)', async () => {
    vi.doMock('next/navigation', () => ({ notFound: () => { throw new Error('notFound'); } }));
    const seiten = await import('./seiten');
    expect(seiten.KLASSE_RUBRIK).toBe(rubrik.KLASSE_RUBRIK);
    expect(seiten.RUBRIK_PAUSIERT_LEAD).toBe(rubrik.RUBRIK_PAUSIERT_LEAD);
    expect(seiten.bereichsKrume).toBe(rubrik.bereichsKrume);
    expect(seiten.rubrikLive).toBe(rubrik.rubrikLive);
  });

  it('Rubrik live nur bei Status „live“; Brotkrume nur für Krafträder und „nicht gefunden“', async () => {
    expect(await rubrik.rubrikLive('motorrad')).toBe(true);
    expect(await rubrik.rubrikLive('fahrrad')).toBe(false);
    expect(rubrik.bereichsKrume('roller')).toEqual([{ href: '/autoschluessel', label: 'Autoschlüssel' }]);
    expect(rubrik.bereichsKrume('e-scooter')).toEqual([]);
  });
});
