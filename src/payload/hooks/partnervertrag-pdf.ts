import type { Endpoint, PayloadRequest } from 'payload';

import { erzeugePdf } from '../../lib/pdf/erzeuge-pdf';
import { partnervertragBlatt, partnervertragDateiname, type PartnervertragPartner } from '../../lib/pdf/partnervertrag';
import { hatRolle } from '../access/rollen';
import { einstellungenLaden } from './vorgang-benachrichtigen';

/*
 * GET /api/partnerbetriebe/:id/vertrag-pdf (E7-OPUS-01, G-39): Partnervertrag als PDF aus der Vorlage,
 * nur für das Team. Gelesen wird mit den Rechten der angemeldeten Person: Die Provisionssätze erscheinen
 * nur für den Inhaber (Feldrecht `feldNurInhaber`). Ohne geprüfte Vorlage des Anwalts ist das Blatt ein
 * Entwurf (R10).
 */

function fehler(status: number, text: string): Response {
  return new Response(text, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function partnervertragPdfHandler(req: PayloadRequest): Promise<Response> {
  if (!req.user) return fehler(401, 'Bitte melden Sie sich im Backend an.');
  if (!hatRolle(req.user, 'inhaber', 'mitarbeiter')) return fehler(403, 'Keine Berechtigung.');
  const id = String(req.routeParams?.id ?? '');
  if (!/^\d{1,15}$/.test(id)) return fehler(404, 'Partnerbetrieb nicht gefunden.');

  const doc = (await req.payload.findByID({
    collection: 'partnerbetriebe',
    id: Number(id),
    depth: 0,
    overrideAccess: false,
    user: req.user,
    disableErrors: true,
    req,
  })) as PartnervertragPartner | null;
  if (!doc) return fehler(404, 'Partnerbetrieb nicht gefunden.');

  const firma = (await einstellungenLaden(req))?.company;
  const { blatt, entwurf } = partnervertragBlatt({
    partner: doc,
    anbieter: {
      legalName: firma?.legalName ?? '',
      street: firma?.street ?? '',
      postalCode: firma?.postalCode ?? '',
      city: firma?.city ?? '',
    },
  });
  const daten = await erzeugePdf(blatt);
  return new Response(new Uint8Array(daten), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${partnervertragDateiname(doc, entwurf)}"`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

export const partnervertragEndpunkte: Endpoint[] = [
  {
    path: '/:id/vertrag-pdf',
    method: 'get',
    handler: partnervertragPdfHandler,
  },
];
