import { describe, expect, it, vi } from 'vitest';

import { partnervertragPdfHandler } from './partnervertrag-pdf';

/* Partnervertrag-PDF (E7-OPUS-01): Rechte, Lesen mit den Rechten der Person, PDF als Entwurf.
 * Erfundene Testdaten (G4), nachgebildetes `req`. */

const MITARBEITER = {
  id: 2,
  email: 'team@example.invalid',
  name: 'Team',
  rollen: ['mitarbeiter'],
};
const PARTNER = {
  id: 7,
  kennung: 'P-0007',
  firma: 'Testschlüssel Nord',
  ort: 'Musterhausen',
  abrechnungsmodell: 'A',
};

const findByID = vi.fn(async () => PARTNER);
const findGlobal = vi.fn(async () => {
  throw new Error('keine Einstellungen im Test');
});

function req(user: unknown, routeParams: Record<string, unknown> = {}) {
  return {
    user,
    context: {},
    routeParams,
    payload: {
      findByID,
      findGlobal,
      collections: {},
      config: { routes: { admin: '/admin' } },
      logger: { warn: vi.fn() },
    },
  } as never;
}

describe('Partnervertrag als PDF (E7-OPUS-01, G-39)', () => {
  it('verlangt Anmeldung, eine Team-Rolle und eine gültige Kennung', async () => {
    expect((await partnervertragPdfHandler(req(null, { id: '7' }))).status).toBe(401);
    expect((await partnervertragPdfHandler(req({ id: 3, rollen: [] }, { id: '7' }))).status).toBe(403);
    expect((await partnervertragPdfHandler(req(MITARBEITER, { id: '7x' }))).status).toBe(404);
    expect(findByID).not.toHaveBeenCalled();
  });

  it('liest mit den Rechten der Person und liefert einen Entwurf als PDF ohne Zwischenspeicher', async () => {
    const antwort = await partnervertragPdfHandler(req(MITARBEITER, { id: '7' }));
    expect(antwort.status).toBe(200);
    expect(findByID).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'partnerbetriebe',
        id: 7,
        overrideAccess: false,
        user: MITARBEITER,
      }),
    );
    expect(antwort.headers.get('content-type')).toBe('application/pdf');
    expect(antwort.headers.get('cache-control')).toBe('no-store');
    expect(antwort.headers.get('content-disposition')).toBe('inline; filename="Partnervertrag-P-0007-Entwurf.pdf"');
    const daten = Buffer.from(await antwort.arrayBuffer());
    expect(daten.subarray(0, 5).toString()).toBe('%PDF-');
  });

  it('meldet 404, wenn der Betrieb fehlt oder nicht lesbar ist', async () => {
    findByID.mockResolvedValueOnce(null as never);
    expect((await partnervertragPdfHandler(req(MITARBEITER, { id: '8' }))).status).toBe(404);
  });
});
