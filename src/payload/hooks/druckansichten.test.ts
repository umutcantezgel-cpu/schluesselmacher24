import { describe, expect, it, vi } from 'vitest';

import { produktionslisteHandler, vorgangsblattHandler } from './druckansichten';

/* Druckansichten: Rechte (401/403), Nonce in Skript und CSP, keine
 * Zwischenspeicherung — mit nachgebildetem `req`. */

const MITARBEITER = { id: 2, email: 'team@example.org', name: 'Team', rollen: ['mitarbeiter'] };

const DOC = {
  id: 42,
  nummer: 'SM24-A-2026-0042',
  art: 'anfrage',
  bereich: 'sicherheitstechnik',
  prozess: 'gefuehrte-anfrage',
  status: 'neu',
  createdAt: '2026-10-20T08:00:00.000Z',
  updatedAt: '2026-10-20T08:00:00.000Z',
  kontakt: { vorname: 'Erika', nachname: 'Muster', email: 'erika@example.org', telefon: '0301234567', land: 'Deutschland' },
  zusammenfassung: [{ titel: 'Objekt', zeilen: [{ label: 'Kameras', wert: '4' }] }],
};

const findByID = vi.fn(async () => DOC);
const find = vi.fn(async () => ({ docs: [] }));
const findGlobal = vi.fn(async () => {
  throw new Error('keine Einstellungen im Test');
});

function req(user: unknown, routeParams: Record<string, unknown> = {}) {
  return {
    user,
    context: {},
    routeParams,
    payload: { findByID, find, findGlobal, config: { routes: { admin: '/admin' } }, logger: { warn: vi.fn() } },
  } as never;
}

describe('Druckansichten', () => {
  it('verlangt Anmeldung und eine Team-Rolle', async () => {
    expect((await vorgangsblattHandler(req(null, { id: '42' }))).status).toBe(401);
    expect((await vorgangsblattHandler(req({ id: 3, rollen: [] }, { id: '42' }))).status).toBe(403);
    expect((await produktionslisteHandler(req(null))).status).toBe(401);
    expect(findByID).not.toHaveBeenCalled();
    expect(find).not.toHaveBeenCalled();
  });

  it('liefert das Vorgangsblatt als HTML mit Nonce, ohne Zwischenspeicher', async () => {
    const antwort = await vorgangsblattHandler(req(MITARBEITER, { id: '42' }));
    expect(antwort.status).toBe(200);
    expect(antwort.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(antwort.headers.get('cache-control')).toBe('no-store');
    const csp = antwort.headers.get('content-security-policy') ?? '';
    const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
    expect(nonce).toBeTruthy();
    expect(csp).toContain("frame-ancestors 'none'");
    const html = await antwort.text();
    expect(html).toContain(`<script nonce="${nonce}">`);
    expect(html).toContain('SM24-A-2026-0042');
    expect(html).toContain('Sicherheitstechnik');
    expect(html).toContain('<th>Kameras</th><td>4</td>');
  });

  it('lehnt ungültige Kennungen ab und fragt nur offene, bezahlte Bestellungen ab', async () => {
    expect((await vorgangsblattHandler(req(MITARBEITER, { id: '4x' }))).status).toBe(404);
    const liste = await produktionslisteHandler(req(MITARBEITER));
    expect(liste.status).toBe(200);
    expect(await liste.text()).toContain('Keine offenen Code- oder Zylinderpositionen.');
    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          and: [
            { art: { equals: 'bestellung' } },
            { 'zahlung.status': { equals: 'bezahlt' } },
            { status: { not_in: ['versendet', 'abgeschlossen', 'storniert'] } },
          ],
        },
      }),
    );
  });
});
