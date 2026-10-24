import { createHash, timingSafeEqual } from 'node:crypto';

import { paymentStatus } from '@/lib/integrations';
import { zahlungenAbgleichen } from '@/lib/zahlung/abgleich';

/*
 * GET /api/cron/zahlungen — stündlicher Abgleich offener Termin-Zahlungen
 * (Vercel Cron). Vercel sendet `Authorization: Bearer <CRON_SECRET>`.
 * Antwort nur mit Zählern, ohne Vorgangsdaten.
 */

function antwort(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** Zeitkonstanter Vergleich über die Hashes — gleich lang, egal was ankommt. */
function berechtigt(request: Request, geheimnis: string): boolean {
  const kopf = request.headers.get('authorization') ?? '';
  const erwartet = createHash('sha256').update(`Bearer ${geheimnis}`, 'utf8').digest();
  const erhalten = createHash('sha256').update(kopf, 'utf8').digest();
  return timingSafeEqual(erwartet, erhalten);
}

export async function GET(request: Request): Promise<Response> {
  const geheimnis = process.env.CRON_SECRET?.trim();
  if (!geheimnis) return antwort(503, { error: 'CRON_SECRET ist nicht gesetzt.' });
  if (!berechtigt(request, geheimnis)) return antwort(401, { error: 'Nicht berechtigt.' });

  // Ohne Online-Zahlung gibt es nichts abzugleichen — und Termine ohne
  // Sitzung sind dann gewollt (Zahlung außerhalb des Systems).
  if (!paymentStatus().configured) return antwort(200, { uebersprungen: true });

  try {
    return antwort(200, { ...(await zahlungenAbgleichen()) });
  } catch (error) {
    console.error('[zahlung] Abgleich fehlgeschlagen', error);
    return antwort(500, { error: 'Abgleich fehlgeschlagen.' });
  }
}
