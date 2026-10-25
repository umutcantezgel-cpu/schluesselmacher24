import { paymentStatus } from '@/lib/integrations';
import { cronAbgelehnt } from '@/lib/server/cron-zugriff';
import { zahlungenAbgleichen } from '@/lib/zahlung/abgleich';

/*
 * GET /api/cron/zahlungen — stündlicher Abgleich offener Termin-Zahlungen
 * (Vercel Cron). Zugang wie alle Cron-Routen über `CRON_SECRET`
 * (src/lib/server/cron-zugriff.ts). Antwort nur mit Zählern, ohne Vorgangsdaten.
 */

function antwort(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: Request): Promise<Response> {
  const abgelehnt = cronAbgelehnt(request);
  if (abgelehnt) return abgelehnt;

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
