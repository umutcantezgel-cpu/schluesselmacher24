import { describe, expect, it, vi } from 'vitest';

// Serverfunktion ohne Datenbank: Einstellungen fest, keine Partner (G4, keine echten Daten).
vi.mock('@/lib/data', () => ({ getSettings: async () => ({ booking: { ownArea: { label: 'Wetzlar', postalPatterns: ['355*'] } } }) }));
vi.mock('@/lib/data/payload-adapter', () => ({ payloadInstanz: vi.fn() }));
vi.mock('@/lib/umgebung', () => ({ mitDatenbank: () => false }));

const { postleitzahlAbfragen } = await import('./stamm');

describe('postleitzahlAbfragen (Server)', () => {
  it('liefert für eine entfallene Großempfänger-Postleitzahl „unbekannt“ und bricht nicht', async () => {
    for (const plz of ['45117', '01053', '11501']) {
      await expect(postleitzahlAbfragen(plz)).resolves.toMatchObject({ plz, bekannt: false, orte: [], gemeinden: [], kreise: [], land: null, partnerVorhanden: false });
    }
  });

  it('kennt Zustell-Postleitzahlen weiter', async () => {
    await expect(postleitzahlAbfragen('35576')).resolves.toMatchObject({ bekannt: true, orte: ['Wetzlar'], land: 'Hessen', eigenbereich: true });
    await expect(postleitzahlAbfragen('14461')).resolves.toMatchObject({ bekannt: true, orte: ['Potsdam'], land: 'Brandenburg' });
  });
});
