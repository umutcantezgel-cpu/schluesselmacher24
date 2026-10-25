import type { Endpoint, PayloadRequest, Where } from 'payload';

import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { tagInBerlin, vorgaengeAlsCsv } from '../../lib/vorgaenge-csv';
import type { Vorgaenge } from '../../payload-types';
import { hatRolle } from '../access/rollen';
import { benutzerName } from './vorgang-benachrichtigen';

/*
 * Aktionen der Sammlung Vorgänge für das Backend:
 * - POST /api/vorgaenge/:id/termin-verschieben (Team)
 * - POST /api/vorgaenge/telefontermin (Team)
 * - GET  /api/vorgaenge/export?von=JJJJ-MM-TT&bis=JJJJ-MM-TT (nur Inhaber, CSV)
 * Payload prüft bei eigenen Endpunkten keine Rechte — deshalb hier
 * ausdrücklich (401 ohne Anmeldung, 403 ohne Rolle). Die Terminlogik liegt im
 * Server der Seite und wird erst beim Aufruf geladen (Datenschicht, Mails).
 */

function json(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function abgelehnt(req: PayloadRequest, ...rollen: Array<'inhaber' | 'mitarbeiter'>): Response | null {
  if (!req.user) return json(401, { error: 'Bitte melden Sie sich an.' });
  if (!hatRolle(req.user, ...rollen)) return json(403, { error: 'Keine Berechtigung.' });
  return null;
}

async function koerper(req: PayloadRequest): Promise<unknown> {
  try {
    return await req.json?.();
  } catch {
    return null;
  }
}

export async function terminVerschiebenHandler(req: PayloadRequest): Promise<Response> {
  const verboten = abgelehnt(req, 'inhaber', 'mitarbeiter');
  if (verboten) return verboten;
  const id = String(req.routeParams?.id ?? '');
  if (!/^\d{1,15}$/.test(id)) return json(404, { error: 'Vorgang nicht gefunden.' });

  const { terminVerschieben } = await import('../../lib/server/termin-verwaltung');
  const ergebnis = await terminVerschieben(id, await koerper(req), benutzerName(req.user));
  return ergebnis.ok
    ? json(200, { ok: true, meldung: ergebnis.meldung, nummer: ergebnis.nummer })
    : json(ergebnis.status, { ok: false, error: ergebnis.fehler });
}

export async function telefonterminHandler(req: PayloadRequest): Promise<Response> {
  const verboten = abgelehnt(req, 'inhaber', 'mitarbeiter');
  if (verboten) return verboten;

  const { telefonterminEintragen } = await import('../../lib/server/termin-verwaltung');
  const ergebnis = await telefonterminEintragen(await koerper(req), benutzerName(req.user));
  return ergebnis.ok
    ? json(201, { ok: true, meldung: ergebnis.meldung, id: ergebnis.vorgangId, nummer: ergebnis.nummer })
    : json(ergebnis.status, { ok: false, error: ergebnis.fehler });
}

const TAG = /^\d{4}-\d{2}-\d{2}$/;
/** Längster Zeitraum je Export (gut drei Jahre). */
const HOECHSTENS_TAGE = 1100;

function tagPlus(iso: string, tage: number): string {
  const datum = new Date(`${iso}T12:00:00Z`);
  datum.setUTCDate(datum.getUTCDate() + tage);
  return datum.toISOString().slice(0, 10);
}

export async function exportHandler(req: PayloadRequest): Promise<Response> {
  const verboten = abgelehnt(req, 'inhaber');
  if (verboten) return verboten;

  const von = req.searchParams?.get('von') ?? '';
  const bis = req.searchParams?.get('bis') ?? '';
  if (!TAG.test(von) || !TAG.test(bis) || Number.isNaN(Date.parse(von)) || Number.isNaN(Date.parse(bis)) || von > bis) {
    return json(400, { error: 'Bitte einen Zeitraum mit „von“ und „bis“ (JJJJ-MM-TT) angeben.' });
  }
  if ((Date.parse(bis) - Date.parse(von)) / 86_400_000 > HOECHSTENS_TAGE) {
    return json(400, { error: 'Der Zeitraum ist zu lang (höchstens drei Jahre je Export).' });
  }

  // Mit einem Tag Puffer lesen und dann nach dem Tag in deutscher Zeit auswählen.
  const where: Where = {
    and: [
      { createdAt: { greater_than_equal: `${tagPlus(von, -1)}T00:00:00.000Z` } },
      { createdAt: { less_than_equal: `${tagPlus(bis, 1)}T23:59:59.999Z` } },
    ],
  };
  const { docs } = await req.payload.find({
    collection: 'vorgaenge',
    where,
    sort: 'createdAt',
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  });
  const vorgaenge = (docs as Vorgaenge[])
    .map(vorgangZuSeite)
    .filter((vorgang) => {
      const tag = tagInBerlin(vorgang.createdAt);
      return tag >= von && tag <= bis;
    });

  return new Response(vorgaengeAlsCsv(vorgaenge), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vorgaenge_${von}_${bis}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

export const terminAktionen: Endpoint[] = [
  { path: '/:id/termin-verschieben', method: 'post', handler: terminVerschiebenHandler },
  { path: '/telefontermin', method: 'post', handler: telefonterminHandler },
  { path: '/export', method: 'get', handler: exportHandler },
];
