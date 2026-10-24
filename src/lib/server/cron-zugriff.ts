import 'server-only';

import { createHash, timingSafeEqual } from 'node:crypto';

/*
 * Zugang zu den Cron-Routen (/api/cron/*). Vercel schickt bei jedem
 * geplanten Aufruf `Authorization: Bearer <CRON_SECRET>` mit, sobald die
 * Variable im Projekt gesetzt ist. Crons laufen nur auf dem
 * Produktions-Deployment.
 */

export type CronZugriff = 'ok' | 'nicht-eingerichtet' | 'verboten';

function sha256(text: string): Buffer {
  return createHash('sha256').update(text, 'utf8').digest();
}

/**
 * Prüft den Authorization-Header zeitkonstant. Beide Seiten werden vorher
 * gehasht, damit `timingSafeEqual` gleich lange Werte vergleicht und die
 * Länge des Geheimnisses nicht durchsickert.
 */
export function cronErlaubt(request: Request): CronZugriff {
  const geheimnis = process.env.CRON_SECRET?.trim();
  if (!geheimnis) return 'nicht-eingerichtet';
  const erhalten = request.headers.get('authorization') ?? '';
  return timingSafeEqual(sha256(erhalten), sha256(`Bearer ${geheimnis}`)) ? 'ok' : 'verboten';
}

/** Antwort für einen abgelehnten Aufruf, sonst `null`. */
export function cronAbgelehnt(request: Request): Response | null {
  const zugriff = cronErlaubt(request);
  if (zugriff === 'ok') return null;
  return zugriff === 'nicht-eingerichtet'
    ? Response.json({ error: 'CRON_SECRET ist nicht gesetzt.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
    : Response.json({ error: 'Nicht berechtigt.' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
}
