import { beforeEach, describe, expect, it, vi } from 'vitest';

import { echteEinstellungen } from '@/lib/rechtliches/test-hilfen';
import type { WiderrufDatensatz } from '@/lib/rechtliches/widerruf-aufnahme';

/* Der Widerrufsbutton als Server-Aktion: Formulardaten, Ratenbegrenzung und
 * Notbetrieb ohne Datenbank. Speicher und Vorgangssuche sind ersetzt; der
 * Ablauf selbst ist in src/lib/rechtliches/widerruf-aufnahme.test.ts geprüft. */

const zustand = { erlaubt: true, mitDatenbank: true };
const gespeichert: WiderrufDatensatz[] = [];

vi.mock('@/lib/server/rate-limit', () => ({
  LIMITS: { widerruf: { name: 'widerruf', limit: 5, windowMs: 600_000 } },
  RATE_LIMIT_MESSAGE: 'Zu viele Anfragen in kurzer Zeit.',
  allowRequest: async () => zustand.erlaubt,
}));

vi.mock('@/lib/umgebung', async (original) => ({
  ...(await original<typeof import('@/lib/umgebung')>()),
  mitDatenbank: () => zustand.mitDatenbank,
}));

vi.mock('@/lib/data', () => ({
  getSettings: async () => echteEinstellungen(),
}));

vi.mock('@/lib/rechtliches/widerruf-speicher', () => ({
  widerrufSpeichern: async (datensatz: WiderrufDatensatz) => {
    gespeichert.push(datensatz);
    return { id: gespeichert.length };
  },
  widerrufBestaetigungVermerken: async () => {},
  widerrufVorgangFinden: async () => null,
  widerrufAmVorgangVermerken: async () => {},
}));

const { widerrufErklaeren } = await import('./widerruf');

function formular(felder: Record<string, string>): FormData {
  const daten = new FormData();
  for (const [name, wert] of Object.entries(felder)) daten.set(name, wert);
  return daten;
}

beforeEach(() => {
  zustand.erlaubt = true;
  zustand.mitDatenbank = true;
  gespeichert.length = 0;
});

describe('widerrufErklaeren', () => {
  it('nimmt die Erklärung aus dem Formular an und speichert sie', async () => {
    const ergebnis = await widerrufErklaeren(
      null,
      formular({ name: 'Erika Muster', email: 'erika@example.org', vorgangsnummer: 'SM24-T-2026-0007', erklaerung: '' }),
    );
    expect(ergebnis).toMatchObject({ status: 'eingegangen', vorgangsnummer: 'SM24-T-2026-0007', mailGesendet: false });
    expect(gespeichert).toHaveLength(1);
    expect(gespeichert[0].zuordnung).toBe('zu-pruefen');
  });

  it('meldet fehlende Pflichtfelder', async () => {
    const ergebnis = await widerrufErklaeren(null, formular({ email: 'erika@example.org' }));
    expect(ergebnis).toEqual({ status: 'ungueltig', fehler: { name: 'Bitte geben Sie Ihren Namen an.' } });
    expect(gespeichert).toHaveLength(0);
  });

  it('bremst Massenanfragen und nennt den Weg per E-Mail', async () => {
    zustand.erlaubt = false;
    const ergebnis = await widerrufErklaeren(null, formular({ name: 'Erika Muster', email: 'erika@example.org' }));
    expect(ergebnis.status).toBe('fehler');
    expect(ergebnis.status === 'fehler' && ergebnis.meldung).toContain('info@schluesselmacher24.de');
    expect(gespeichert).toHaveLength(0);
  });

  it('speichert ohne Datenbank nichts und verweist auf die E-Mail-Adresse', async () => {
    zustand.mitDatenbank = false;
    const ergebnis = await widerrufErklaeren(null, formular({ name: 'Erika Muster', email: 'erika@example.org' }));
    expect(ergebnis).toEqual({ status: 'ohne-speicher', email: 'info@schluesselmacher24.de' });
    expect(gespeichert).toHaveLength(0);
  });
});
