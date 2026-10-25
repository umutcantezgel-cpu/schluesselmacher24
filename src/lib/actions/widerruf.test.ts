import { beforeEach, describe, expect, it, vi } from 'vitest';

import { echteEinstellungen } from '@/lib/rechtliches/test-hilfen';
import type { WiderrufDatensatz } from '@/lib/rechtliches/widerruf-aufnahme';

/* Der Widerrufsbutton als Server-Aktion: Formulardaten, Ratenbegrenzung und
 * Notbetrieb ohne Datenbank. Speicher und Vorgangssuche sind ersetzt; der
 * Ablauf selbst ist in src/lib/rechtliches/widerruf-aufnahme.test.ts geprüft. */

const zustand = { erlaubt: true, mitDatenbank: true };
const gespeichert: WiderrufDatensatz[] = [];
/** Wer welche Mail bekommen hätte (Kunde: Eingangsbestätigung, Betrieb: Meldung). */
const versand = { kunde: [] as Array<Record<string, unknown>>, betrieb: [] as string[] };

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

vi.mock('@/lib/server/benachrichtigungen', () => ({
  nachDerAntwort: async (arbeit: () => Promise<unknown>) => {
    await arbeit();
  },
  sendeWiderrufEingang: async (daten: Record<string, unknown>) => {
    versand.kunde.push(daten);
    return { kind: 'widerruf', to: daten.an, at: new Date().toISOString(), result: 'gesendet' };
  },
  sendeWiderrufBetrieb: async (daten: { email: string }) => {
    versand.betrieb.push(daten.email);
    return null;
  },
}));

const { widerrufErklaeren } = await import('./widerruf');
const { startSignieren } = await import('@/lib/server/formular-schutz');

/** Formulardaten wie aus dem Browser — mit gültigem Startzeitpunkt (vor 10 s geöffnet). */
function formular(felder: Record<string, string>): FormData {
  const daten = new FormData();
  daten.set('formularStart', startSignieren(Date.now() - 10_000));
  daten.set('website', '');
  for (const [name, wert] of Object.entries(felder)) daten.set(name, wert);
  return daten;
}

beforeEach(() => {
  zustand.erlaubt = true;
  zustand.mitDatenbank = true;
  gespeichert.length = 0;
  versand.kunde.length = 0;
  versand.betrieb.length = 0;
});

describe('widerrufErklaeren', () => {
  it('nimmt die Erklärung aus dem Formular an und speichert sie', async () => {
    const ergebnis = await widerrufErklaeren(
      null,
      formular({ name: 'Erika Muster', email: 'erika@example.org', vorgangsnummer: 'SM24-T-2026-0007', erklaerung: 'Termin am Montag' }),
    );
    expect(ergebnis).toMatchObject({ status: 'eingegangen', vorgangsnummer: 'SM24-T-2026-0007', mailGesendet: true });
    expect(gespeichert).toHaveLength(1);
    expect(gespeichert[0].zuordnung).toBe('zu-pruefen');
    expect(gespeichert[0].notiz).toBeUndefined();
    // Die Eingangsbestätigung trägt den Inhalt der Erklärung.
    expect(versand.kunde).toEqual([
      expect.objectContaining({ an: 'erika@example.org', name: 'Erika Muster', vorgangsnummer: 'SM24-T-2026-0007', angaben: 'Termin am Montag' }),
    ]);
    expect(versand.betrieb).toEqual(['erika@example.org']);
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

  describe('Bot-Schutz', () => {
    const eingabe = { name: 'Erika Muster', email: 'erika@example.org', vorgangsnummer: 'SM24-T-2026-0007' };

    it('antwortet beim ausgefüllten Honigtopf wie bei Erfolg, speichert aber nichts', async () => {
      const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ergebnis = await widerrufErklaeren(null, formular({ ...eingabe, website: 'https://spam.example' }));
      expect(ergebnis).toMatchObject({ status: 'eingegangen', name: 'Erika Muster', mailGesendet: false });
      expect(gespeichert).toHaveLength(0);
      expect(versand).toEqual({ kunde: [], betrieb: [] });
      expect(warnung).toHaveBeenCalledWith(expect.stringContaining('honigtopf'));
      warnung.mockRestore();
    });

    it.each([
      ['zu schnell abgesendet', () => startSignieren(Date.now() - 1_000)],
      ['ohne Startzeitpunkt', () => ''],
      ['mit gefälschtem Startzeitpunkt', () => '1700000000000.gefaelscht'],
      ['mit abgelaufenem Startzeitpunkt', () => startSignieren(Date.now() - 25 * 60 * 60 * 1000)],
    ])('speichert die Erklärung %s trotzdem, informiert den Betrieb, mailt aber nicht an die eingegebene Adresse', async (_name, start) => {
      const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const ergebnis = await widerrufErklaeren(null, formular({ ...eingabe, formularStart: start() }));
      expect(ergebnis).toMatchObject({ status: 'eingegangen', name: 'Erika Muster', mailGesendet: false });
      expect(ergebnis.status === 'eingegangen' && Date.parse(ergebnis.eingangAm)).not.toBeNaN();
      expect(gespeichert).toHaveLength(1);
      expect(gespeichert[0].notiz).toContain('Bot-Schutz');
      expect(versand.kunde).toHaveLength(0);
      expect(versand.betrieb).toEqual(['erika@example.org']);
      warnung.mockRestore();
    });

    it('speichert auch eine Erklärung, die ohne JavaScript abgesendet wurde', async () => {
      const warnung = vi.spyOn(console, 'warn').mockImplementation(() => {});
      // Natives Absenden: Das versteckte Startfeld bleibt leer.
      const daten = new FormData();
      for (const [name, wert] of Object.entries({ ...eingabe, erklaerung: '', formularStart: '', website: '' })) {
        daten.set(name, wert);
      }
      const ergebnis = await widerrufErklaeren(null, daten);
      expect(ergebnis).toMatchObject({ status: 'eingegangen', vorgangsnummer: 'SM24-T-2026-0007', mailGesendet: false });
      expect(gespeichert).toHaveLength(1);
      expect(versand.kunde).toHaveLength(0);
      warnung.mockRestore();
    });
  });
});
