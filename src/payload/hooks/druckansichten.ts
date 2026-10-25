import { randomBytes } from 'node:crypto';

import type { Endpoint, PayloadRequest } from 'payload';

import { vorgangZuSeite } from '../../lib/data/payload-mapping';
import { produktionslisteHtml, vorgangsblattHtml } from '../../lib/druckansichten';
import type { Vorgaenge } from '../../payload-types';
import { hatRolle } from '../access/rollen';
import { einstellungenLaden } from './vorgang-benachrichtigen';

/*
 * Druckansichten der Sammlung Vorgänge (nur Team):
 * - GET /api/vorgaenge/:id/vorgangsblatt — ein Vorgang kompakt zum Drucken
 *   oder „als PDF speichern“ (Leitfaden Kap. 11 und 17),
 * - GET /api/vorgaenge/produktionsliste — offene Code- und Zylinderpositionen
 *   (Leitfaden Kap. 08).
 * Payload prüft bei eigenen Endpunkten keine Rechte — deshalb hier
 * ausdrücklich. Die Seiten enthalten personenbezogene Daten: nicht
 * zwischenspeichern, nicht einbetten, nicht indexieren; Skripte nur mit Nonce.
 */

function htmlAntwort(html: string, nonce: string): Response {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': [
        "default-src 'none'",
        "style-src 'unsafe-inline'",
        `script-src 'nonce-${nonce}'`,
        "base-uri 'none'",
        "form-action 'none'",
        "frame-ancestors 'none'",
      ].join('; '),
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function fehler(status: number, text: string): Response {
  return new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function abgelehnt(req: PayloadRequest): Response | null {
  if (!req.user) return fehler(401, 'Bitte melden Sie sich im Backend an.');
  if (!hatRolle(req.user, 'inhaber', 'mitarbeiter')) return fehler(403, 'Keine Berechtigung.');
  return null;
}

const nonce = () => randomBytes(16).toString('base64');

export async function vorgangsblattHandler(req: PayloadRequest): Promise<Response> {
  const verboten = abgelehnt(req);
  if (verboten) return verboten;
  const id = String(req.routeParams?.id ?? '');
  if (!/^\d{1,15}$/.test(id)) return fehler(404, 'Vorgang nicht gefunden.');

  const doc = (await req.payload.findByID({
    collection: 'vorgaenge',
    id: Number(id),
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
    req,
  })) as Vorgaenge | null;
  if (!doc) return fehler(404, 'Vorgang nicht gefunden.');

  const einstellungen = await einstellungenLaden(req);
  const n = nonce();
  return htmlAntwort(vorgangsblattHtml({ vorgang: vorgangZuSeite(doc), firma: einstellungen?.company, nonce: n }), n);
}

export async function produktionslisteHandler(req: PayloadRequest): Promise<Response> {
  const verboten = abgelehnt(req);
  if (verboten) return verboten;

  const { docs } = await req.payload.find({
    collection: 'vorgaenge',
    where: {
      and: [
        { art: { equals: 'bestellung' } },
        { 'zahlung.status': { equals: 'bezahlt' } },
        { status: { not_in: ['versendet', 'abgeschlossen', 'storniert'] } },
      ],
    },
    sort: 'createdAt',
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  });
  const n = nonce();
  const admin = req.payload.config.routes.admin || '/admin';
  return htmlAntwort(
    produktionslisteHtml({
      vorgaenge: (docs as Vorgaenge[]).map(vorgangZuSeite),
      nonce: n,
      vorgangLink: (vorgangId) => `${admin}/collections/vorgaenge/${encodeURIComponent(vorgangId)}`,
    }),
    n,
  );
}

export const druckansichten: Endpoint[] = [
  { path: '/:id/vorgangsblatt', method: 'get', handler: vorgangsblattHandler },
  { path: '/produktionsliste', method: 'get', handler: produktionslisteHandler },
];
