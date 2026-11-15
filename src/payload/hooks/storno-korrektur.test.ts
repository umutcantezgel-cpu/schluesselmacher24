import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ERSTATTUNG_MELDUNG_WEG, STORNO_MELDUNG, zahlungsstandText } from '../../lib/zahlung/erstattung';
import type { Vorgaenge } from '../../payload-types';

import { auftragswegVorAenderung } from './auftragsweg';
import { KORREKTUR_MELDUNG, korrekturText, stornoKorrekturVorAenderung, summeNachKorrektur } from './storno-korrektur';
import { ERSTATTUNG_MELDUNG, vermittlungVorAenderung } from './vermittlung';
import { vorgangVorAenderung } from './vorgang-benachrichtigen';

/* FA-KERN-05: Storno mit Entscheidung zur Erstattung, Weg und Beleg, Berichtigung eines Irrtums und
 * Korrekturpositionen. Nachgebildetes `req`, kein Zahlungsdienst, keine Mail (G5). Erfundene Testdaten (G4). */

vi.mock('../../lib/integrations/stripe', () => ({ stripeClient: () => ({}) }));

const TEAM = { id: 1, email: 'team@example.org', name: 'Mina Saad', rollen: ['team'] };

function bestellung(teil: Partial<Vorgaenge> = {}): Vorgaenge {
  return {
    id: 51,
    nummer: 'SM24-B-2026-0051',
    art: 'bestellung',
    bereich: 'schluessel-nach-code',
    prozess: 'shop-kauf',
    status: 'in-fertigung',
    kundeInformieren: false,
    kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', plz: '60311', land: 'Deutschland' },
    zahlung: { umfang: 'gesamt', betragCent: 4_000, status: 'bezahlt', anbieterRef: 'pi_test123' },
    summen: { artikelCent: 3_500, versandCent: 500, gesamtCent: 4_000 },
    notizen: [],
    verlauf: [],
    mails: [],
    updatedAt: '2026-11-15T12:00:00.000Z',
    createdAt: '2026-11-15T10:00:00.000Z',
    ...teil,
  } as Vorgaenge;
}

function req(user: unknown = TEAM) {
  return {
    user,
    context: {} as Record<string, unknown>,
    payload: {
      update: vi.fn(),
      find: vi.fn(),
      findByID: vi.fn(async () => null),
      findGlobal: vi.fn(async () => {
        throw new Error('keine Einstellungen im Test');
      }),
      logger: { warn: vi.fn(), error: vi.fn() },
    },
  };
}

/** Alle Hooks vor dem Speichern in der Reihenfolge der Sammlung. */
async function speichern(original: Vorgaenge, data: Partial<Vorgaenge>, r = req()) {
  const a = { operation: 'update', originalDoc: original, req: r };
  const erst = vorgangVorAenderung({ ...a, data: { ...original, ...data } } as never) as Partial<Vorgaenge>;
  const zweit = (await vermittlungVorAenderung({ ...a, data: erst } as never)) as Partial<Vorgaenge>;
  const dritt = (await stornoKorrekturVorAenderung({ ...a, data: zweit } as never)) as Partial<Vorgaenge>;
  return auftragswegVorAenderung({ ...a, data: dritt } as never) as Partial<Vorgaenge>;
}

const texte = (data: Partial<Vorgaenge>) => (data.notizen ?? []).map((n) => n.text).join('\n');

beforeEach(() => {
  vi.stubEnv('MAIL_PROVIDER', '');
  vi.stubEnv('MAIL_API_KEY', '');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Storno einer bezahlten Bestellung', () => {
  it('ist ohne Entscheidung zur Erstattung nicht möglich', async () => {
    await expect(speichern(bestellung(), { status: 'storniert' })).rejects.toThrow(STORNO_MELDUNG.entscheidung);
  });

  it('verlangt bei „keine Erstattung“ einen Grund und hält die Entscheidung mit Bearbeiter fest', async () => {
    const original = bestellung();
    await expect(speichern(original, { status: 'storniert', storno: { entscheidung: 'keine' } })).rejects.toThrow(STORNO_MELDUNG.grund);
    const data = await speichern(original, { status: 'storniert', storno: { entscheidung: 'keine', grund: 'Schlüssel schon gefertigt' } });
    expect(data.status).toBe('storniert');
    expect(data.storno).toMatchObject({ entscheidung: 'keine', grund: 'Schlüssel schon gefertigt', entschiedenVon: 'Mina Saad' });
    expect(data.storno?.entschiedenAm).toBeTruthy();
    expect(data.zahlung?.status).toBe('bezahlt');
    expect(texte(data)).toContain('Storno mit Entscheidung zur Erstattung: Keine Erstattung. Grund: Schlüssel schon gefertigt (Mina Saad).');
  });

  it('verlangt bei „ganz“ oder „teilweise“ die Erstattung im selben Speichern', async () => {
    const original = bestellung();
    await expect(speichern(original, { status: 'storniert', storno: { entscheidung: 'ganz' } })).rejects.toThrow(STORNO_MELDUNG.ganz);
    await expect(speichern(original, { status: 'storniert', storno: { entscheidung: 'teilweise' } })).rejects.toThrow(STORNO_MELDUNG.teilweise);

    const ganz = await speichern(original, {
      status: 'storniert',
      storno: { entscheidung: 'ganz' },
      erstattung: { art: 'ganz', grund: 'Kunde storniert', weg: 'zahlungsdienst' },
    });
    expect(ganz.zahlung).toMatchObject({ status: 'erstattet', erstattetCent: 4_000 });
    expect(texte(ganz)).toContain('Storno mit Entscheidung zur Erstattung: Ganz erstatten (erstattet insgesamt 40,00');
  });

  it('Teilerstattung zeigt Betrag und Stand', async () => {
    const data = await speichern(bestellung(), {
      status: 'storniert',
      storno: { entscheidung: 'teilweise' },
      erstattung: { art: 'teilweise', betragCent: 1_500, grund: 'Versand behalten', weg: 'ueberweisung', beleg: 'Buchung 2026-11-15 SM24-B-2026-0051' },
    });
    expect(data.zahlung).toMatchObject({ status: 'teilweise-erstattet', erstattetCent: 1_500 });
    const stand = zahlungsstandText({ status: data.zahlung?.status, betragCent: data.zahlung?.betragCent, erstattetCent: data.zahlung?.erstattetCent });
    expect(stand).toMatch(/^Teilweise erstattet: 15,00\s€ von 40,00\s€\. Es bleiben 25,00\s€\.$/);
    expect(texte(data)).toContain('Weg: Überweisung, Beleg: Buchung 2026-11-15 SM24-B-2026-0051');
  });

  it('lässt ein Storno ohne eingegangene Zahlung wie bisher zu', async () => {
    const offen = bestellung({ status: 'neu', zahlung: { umfang: 'gesamt', betragCent: 4_000, status: 'offen' } });
    const data = await speichern(offen, { status: 'storniert' });
    expect(data.status).toBe('storniert');
    expect(data.storno?.entscheidung ?? null).toBeNull();
  });

  it('gilt nur für Änderungen des Teams, nicht für den Server', async () => {
    const original = bestellung();
    const data = (await stornoKorrekturVorAenderung({
      operation: 'update',
      originalDoc: original,
      req: req(null),
      data: { status: 'storniert' },
    } as never)) as Partial<Vorgaenge>;
    expect(data.status).toBe('storniert');
  });
});

describe('Erstattung mit Weg und Beleg', () => {
  it('verlangt den Weg und außerhalb des Zahlungsdienstes einen Beleg', async () => {
    const original = bestellung();
    await expect(speichern(original, { erstattung: { art: 'ganz', grund: 'Retoure' } })).rejects.toThrow(ERSTATTUNG_MELDUNG_WEG.weg);
    for (const weg of ['ueberweisung', 'bar', 'sonstige'] as const) {
      await expect(speichern(original, { erstattung: { art: 'ganz', grund: 'Retoure', weg } })).rejects.toThrow(ERSTATTUNG_MELDUNG_WEG.beleg);
    }
    const bar = await speichern(original, { erstattung: { art: 'ganz', grund: 'Retoure', weg: 'bar', beleg: 'Quittung 17' } });
    expect(bar.erstattung).toMatchObject({ weg: 'bar', beleg: 'Quittung 17', betragCent: 4_000 });
    expect(bar.zahlung?.status).toBe('erstattet');
  });
});

describe('Berichtigung einer irrtümlichen Erstattung', () => {
  const erstattet = async (weg: 'bar' | 'zahlungsdienst') => {
    const original = bestellung();
    const data = await speichern(original, {
      erstattung: { art: 'teilweise', betragCent: 1_000, grund: 'Kulanz', weg, ...(weg === 'bar' ? { beleg: 'Quittung 3' } : {}) },
    });
    return { ...original, ...data } as Vorgaenge;
  };

  it('Zahlungsstand bleibt ohne Grund gesperrt; mit Grund geht er dokumentiert zurück', async () => {
    const doc = await erstattet('bar');
    await expect(speichern(doc, { zahlung: { ...doc.zahlung, status: 'bezahlt' } })).rejects.toThrow(ERSTATTUNG_MELDUNG.zurueck);
    expect(ERSTATTUNG_MELDUNG.zurueck).toContain('Berichtigung: Grund');

    const data = await speichern(doc, { erstattung: { ...doc.erstattung, art: null, betragCent: null, berichtigungGrund: 'Falscher Vorgang erwischt' } });
    expect(data.zahlung).toMatchObject({ status: 'bezahlt', erstattetCent: null });
    expect(data.erstattung).toMatchObject({ art: null, betragCent: null, berichtigungGrund: null });
    expect(texte(data)).toContain('Erstattung berichtigt: von 10,00');
    expect(texte(data)).toContain('Grund: Falscher Vorgang erwischt (Mina Saad).');
  });

  it('macht den Betrag nur kleiner', async () => {
    const doc = await erstattet('bar');
    await expect(
      speichern(doc, { erstattung: { ...doc.erstattung, betragCent: 2_000, berichtigungGrund: 'Tippfehler' } }),
    ).rejects.toThrow(ERSTATTUNG_MELDUNG_WEG.berichtigungHoeher);
    const kleiner = await speichern(doc, { erstattung: { ...doc.erstattung, betragCent: 500, berichtigungGrund: 'Tippfehler' } });
    expect(kleiner.zahlung).toMatchObject({ status: 'teilweise-erstattet', erstattetCent: 500 });
  });

  it('geht nicht für Erstattungen über den Zahlungsdienst', async () => {
    const doc = await erstattet('zahlungsdienst');
    await expect(
      speichern(doc, { erstattung: { ...doc.erstattung, art: null, betragCent: null, berichtigungGrund: 'Irrtum' } }),
    ).rejects.toThrow(ERSTATTUNG_MELDUNG_WEG.berichtigungZahlungsdienst);
  });
});

describe('Korrekturpositionen', () => {
  it('erfasst eine Korrektur mit Betrag, Grund, Datum und Bearbeiter; die ursprüngliche Summe bleibt', async () => {
    const original = bestellung();
    const data = await speichern(original, { korrekturen: [{ betragCent: -500, grund: 'Nachlass Wartezeit' }] });
    expect(data.korrekturen).toHaveLength(1);
    expect(data.korrekturen?.[0]).toMatchObject({ betragCent: -500, grund: 'Nachlass Wartezeit', von: 'Mina Saad' });
    expect(data.korrekturen?.[0].am).toBeTruthy();
    expect(data.summen?.gesamtCent).toBe(4_000);
    expect(summeNachKorrektur(4_000, data.korrekturen)).toBe(3_500);
    expect(korrekturText(4_000, data.korrekturen)).toMatch(/^Ursprünglich 40,00\s€, Korrekturen -5,00\s€, nach Korrektur 35,00\s€\.$/);
    expect(texte(data)).toContain('Korrekturposition -5,00');
  });

  it('lässt gespeicherte Korrekturen weder ändern noch löschen', async () => {
    const original = bestellung({ korrekturen: [{ id: 'k1', betragCent: 300, grund: 'Zusatzschlüssel', am: '2026-11-15T12:00:00.000Z', von: 'Mina Saad' }] });
    await expect(speichern(original, { korrekturen: [] })).rejects.toThrow(KORREKTUR_MELDUNG.fest);
    await expect(speichern(original, { korrekturen: [{ id: 'k1', betragCent: 100, grund: 'Zusatzschlüssel' }] })).rejects.toThrow(KORREKTUR_MELDUNG.fest);
    // Unverändert mitgeschickt: bleibt, auch mit Datum und Bearbeiter des Originals.
    const gleich = await speichern(original, { korrekturen: [{ id: 'k1', betragCent: 300, grund: 'Zusatzschlüssel' }] });
    expect(gleich.korrekturen).toEqual(original.korrekturen);
  });

  it('prüft Betrag, Grund, Art und Summe', async () => {
    const original = bestellung();
    await expect(speichern(original, { korrekturen: [{ betragCent: 0, grund: 'x' }] })).rejects.toThrow(KORREKTUR_MELDUNG.betrag);
    await expect(speichern(original, { korrekturen: [{ betragCent: 100, grund: ' ' }] })).rejects.toThrow(KORREKTUR_MELDUNG.grund);
    await expect(speichern(original, { korrekturen: [{ betragCent: -5_000, grund: 'zu viel' }] })).rejects.toThrow(KORREKTUR_MELDUNG.negativ);
    const termin = bestellung({ art: 'termin', nummer: 'SM24-T-2026-0051' });
    await expect(speichern(termin, { korrekturen: [{ betragCent: 100, grund: 'x' }] })).rejects.toThrow(KORREKTUR_MELDUNG.nurBestellung);
  });
});
