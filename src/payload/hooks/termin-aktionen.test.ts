import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Vorgaenge } from '../../payload-types';
import { exportHandler, telefonterminHandler, terminVerschiebenHandler } from './termin-aktionen';

/* Endpunkte der Sammlung Vorgänge: Rechte (401/403), Weitergabe an die
 * Terminlogik und CSV-Export mit nachgebildetem `req`. */

const verwaltung = vi.hoisted(() => ({
  terminVerschieben: vi.fn(async () => ({ ok: true as const, meldung: 'Termin verschoben.', vorgangId: '42', nummer: 'SM24-T-2026-0007' })),
  telefonterminEintragen: vi.fn(async () => ({ ok: false as const, status: 409 as const, fehler: 'Bereits vergeben.' })),
}));
vi.mock('../../lib/server/termin-verwaltung', () => verwaltung);

const INHABER = { id: 1, email: 'mina@example.org', name: 'Mina Saad', rollen: ['inhaber'] };
const MITARBEITER = { id: 2, email: 'team@example.org', name: 'Team', rollen: ['mitarbeiter'] };

const docs: Vorgaenge[] = [];
const find = vi.fn(async () => ({ docs }));

function req(user: unknown, teil: { routeParams?: Record<string, unknown>; suche?: string; body?: unknown } = {}) {
  return {
    user,
    context: {},
    routeParams: teil.routeParams ?? {},
    searchParams: new URLSearchParams(teil.suche ?? ''),
    json: async () => teil.body,
    payload: { find },
  } as never;
}

beforeEach(() => {
  docs.length = 0;
  find.mockClear();
  verwaltung.terminVerschieben.mockClear();
});

describe('Termin verschieben und Telefontermin', () => {
  it('verlangt Anmeldung und eine Team-Rolle', async () => {
    expect((await terminVerschiebenHandler(req(null, { routeParams: { id: '42' } }))).status).toBe(401);
    expect((await terminVerschiebenHandler(req({ id: 3, rollen: [] }, { routeParams: { id: '42' } }))).status).toBe(403);
    expect((await telefonterminHandler(req(null))).status).toBe(401);
    expect(verwaltung.terminVerschieben).not.toHaveBeenCalled();
  });

  it('gibt Angaben und Benutzer an die Terminlogik weiter', async () => {
    const antwort = await terminVerschiebenHandler(req(MITARBEITER, { routeParams: { id: '42' }, body: { datum: '2027-03-03', uhrzeit: '10:00' } }));
    expect(antwort.status).toBe(200);
    expect(await antwort.json()).toMatchObject({ ok: true, nummer: 'SM24-T-2026-0007' });
    expect(verwaltung.terminVerschieben).toHaveBeenCalledWith('42', { datum: '2027-03-03', uhrzeit: '10:00' }, 'Team');
    const belegt = await telefonterminHandler(req(INHABER, { body: {} }));
    expect(belegt.status).toBe(409);
    expect(await belegt.json()).toMatchObject({ ok: false, error: 'Bereits vergeben.' });
  });

  it('lehnt ungültige Kennungen ab', async () => {
    expect((await terminVerschiebenHandler(req(INHABER, { routeParams: { id: 'abc' } }))).status).toBe(404);
  });
});

describe('CSV-Export', () => {
  it('nur für Inhaber', async () => {
    expect((await exportHandler(req(null, { suche: 'von=2026-10-01&bis=2026-10-31' }))).status).toBe(401);
    expect((await exportHandler(req(MITARBEITER, { suche: 'von=2026-10-01&bis=2026-10-31' }))).status).toBe(403);
    expect(find).not.toHaveBeenCalled();
  });

  it('verlangt einen gültigen Zeitraum', async () => {
    expect((await exportHandler(req(INHABER, { suche: 'von=2026-10-31&bis=2026-10-01' }))).status).toBe(400);
    expect((await exportHandler(req(INHABER, { suche: 'von=gestern&bis=heute' }))).status).toBe(400);
    expect((await exportHandler(req(INHABER, { suche: 'von=2020-01-01&bis=2026-01-01' }))).status).toBe(400);
  });

  it('liefert die Vorgänge des Zeitraums in deutscher Zeit als CSV-Datei', async () => {
    const basis = {
      art: 'bestellung',
      bereich: 'schluessel-nach-code',
      prozess: 'direktkauf',
      status: 'neu',
      kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '1', land: 'Deutschland' },
      updatedAt: '2026-10-01T10:00:00.000Z',
    };
    docs.push(
      // 30.09. 23:30 deutscher Zeit — gehört nicht in den Oktober.
      { ...basis, id: 1, nummer: 'SM24-B-2026-0001', createdAt: '2026-09-30T21:30:00.000Z' } as Vorgaenge,
      // 01.10. 00:30 deutscher Zeit (UTC noch 30.09.) — gehört in den Oktober.
      { ...basis, id: 2, nummer: 'SM24-B-2026-0002', createdAt: '2026-09-30T22:30:00.000Z' } as Vorgaenge,
    );
    const antwort = await exportHandler(req(INHABER, { suche: 'von=2026-10-01&bis=2026-10-31' }));
    expect(antwort.status).toBe(200);
    expect(antwort.headers.get('content-type')).toBe('text/csv; charset=utf-8');
    expect(antwort.headers.get('content-disposition')).toBe('attachment; filename="vorgaenge_2026-10-01_2026-10-31.csv"');
    const text = await antwort.text();
    expect(text).toContain('SM24-B-2026-0002;01.10.2026');
    expect(text).not.toContain('SM24-B-2026-0001');
  });
});
