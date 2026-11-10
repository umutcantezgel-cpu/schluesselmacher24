import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/* Ohne Datenbank auf schreibgeschütztem Dateisystem (Schaufenster und Vorschauen
 * auf Vercel) sagt createRecord sofort und ehrlich, dass nichts gespeichert wird —
 * ohne die Datenschicht anzufassen. Die Wege mit Datenbank prüft
 * create-record.db.test.ts. */

const mocks = vi.hoisted(() => ({ getSettings: vi.fn(), vorgangAnlegen: vi.fn() }));

vi.mock('@/lib/data', () => ({
  TerminVergebenFehler: class TerminVergebenFehler extends Error {},
  ZuVieleOffeneTermineFehler: class ZuVieleOffeneTermineFehler extends Error {},
  getAppointments: vi.fn(),
  getCollection: vi.fn(),
  getSettings: mocks.getSettings,
  vorgangAendern: vi.fn(),
  vorgangAnlegen: mocks.vorgangAnlegen,
  vorgangDateienSetzen: vi.fn(),
}));
vi.mock('@/lib/integrations', () => ({ createPayment: vi.fn(), storageStatus: vi.fn(() => ({ configured: false })) }));
vi.mock('./benachrichtigungen', () => ({ benachrichtigeNeuerVorgang: vi.fn(async () => []) }));

import { createRecord, OHNE_SPEICHER, type TrustedRecordInput } from './create-record';

const EINGABE: TrustedRecordInput = {
  kind: 'anfrage',
  area: 'kontakt',
  process: 'kontakt',
  contact: { name: 'Erika Beispiel', email: 'erika@beispiel.test', phone: '06441 000000' },
  payload: {},
  summary: [],
  uploads: [],
} as unknown as TrustedRecordInput;

beforeEach(() => {
  for (const name of ['DATABASE_URL', 'POSTGRES_URL', 'SM24_DATA', 'VERCEL', 'VERCEL_ENV', 'SM24_READONLY_CONTENT']) {
    vi.stubEnv(name, undefined);
  }
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  mocks.getSettings.mockReset();
  mocks.vorgangAnlegen.mockReset();
});

describe('createRecord ohne Speicher', () => {
  it('lehnt im Schaufenster (Produktion auf Vercel ohne Datenbank) ehrlich ab', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(await createRecord(EINGABE)).toEqual({ ok: false, notices: [], error: OHNE_SPEICHER });
    expect(mocks.getSettings).not.toHaveBeenCalled();
    expect(mocks.vorgangAnlegen).not.toHaveBeenCalled();
  });

  it('lehnt in einer Vorschau ohne Datenbank genauso ab', async () => {
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'preview');
    expect((await createRecord(EINGABE)).error).toBe(OHNE_SPEICHER);
    expect(mocks.vorgangAnlegen).not.toHaveBeenCalled();
  });

  it('lehnt auch außerhalb von Vercel ab, wenn nichts gespeichert werden kann', async () => {
    // Eigener Server mit schreibgeschütztem Dateisystem, ohne Datenbank
    vi.stubEnv('SM24_READONLY_CONTENT', '1');
    expect((await createRecord(EINGABE)).error).toBe(OHNE_SPEICHER);
    // Auf Vercel mit Datenbank-Adresse, aber erzwungenem JSON-Modus
    vi.stubEnv('SM24_READONLY_CONTENT', undefined);
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    vi.stubEnv('SM24_DATA', 'json');
    expect((await createRecord(EINGABE)).error).toBe(OHNE_SPEICHER);
    expect(mocks.getSettings).not.toHaveBeenCalled();
    expect(mocks.vorgangAnlegen).not.toHaveBeenCalled();
  });

  it('nennt einen anderen Weg und verspricht keinen späteren Versuch', () => {
    expect(OHNE_SPEICHER).toMatch(/noch nicht freigeschaltet/);
    expect(OHNE_SPEICHER).toMatch(/rufen Sie uns an/);
    expect(OHNE_SPEICHER).not.toMatch(/erneut/);
  });

  it('greift nicht, wenn gespeichert werden kann (Datenbank oder beschreibbares Dateisystem)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.getSettings.mockRejectedValue(new Error('absichtlich'));

    // Lokal ohne Datenbank: Der JSON-Adapter darf schreiben.
    const lokal = await createRecord(EINGABE);
    expect(lokal.ok).toBe(false);
    expect(lokal.error).not.toBe(OHNE_SPEICHER);
    expect(mocks.getSettings).toHaveBeenCalledTimes(1);

    // Auf Vercel mit Datenbank: Die Datenbank speichert.
    vi.stubEnv('VERCEL', '1');
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('DATABASE_URL', 'postgres://pooler/db');
    const produktion = await createRecord(EINGABE);
    expect(produktion.error).not.toBe(OHNE_SPEICHER);
    expect(mocks.getSettings).toHaveBeenCalledTimes(2);
  });
});
