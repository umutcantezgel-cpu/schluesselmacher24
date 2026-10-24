import { cronAbgelehnt } from '@/lib/server/cron-zugriff';
import { mitDatenbank } from '@/lib/umgebung';

/*
 * GET /api/cron/taeglich — täglicher Lauf (vercel.json, 02:17 UTC):
 * - Kundendateien mit abgelaufener Aufbewahrungsfrist und nie zugeordnete
 *   Uploads (älter als 24 Stunden) löschen,
 * - überholte Zähler der Ratenbegrenzung löschen.
 *
 * Die Antwort enthält nur Zahlen, nie Dateinamen (personenbezogen). Bei
 * Fehlschlägen antwortet die Route mit 500, damit Vercel den Lauf als
 * fehlgeschlagen anzeigt. GET-Route-Handler werden in Next 16 nicht
 * zwischengespeichert; `no-store` gilt zusätzlich für Zwischenstationen.
 */

export const maxDuration = 60;

const KEIN_CACHE = { 'Cache-Control': 'no-store' };

export async function GET(request: Request): Promise<Response> {
  const abgelehnt = cronAbgelehnt(request);
  if (abgelehnt) return abgelehnt;

  if (!mitDatenbank()) {
    return Response.json({ error: 'Keine Datenbank angebunden.' }, { status: 503, headers: KEIN_CACHE });
  }

  try {
    // Erst hier laden: Ohne Datenbank verlangt die Payload-Konfiguration nichts.
    const [{ bereinigeKundendateien }, { alteZaehlerLoeschen }] = await Promise.all([
      import('@/lib/server/kundendateien'),
      import('@/lib/server/rate-limit'),
    ]);
    const dateien = await bereinigeKundendateien();
    const zaehler = await alteZaehlerLoeschen();

    for (const datei of dateien.fehlgeschlagen) {
      console.error(`[cron/taeglich] Kundendatei #${datei.id} nicht gelöscht: ${datei.fehler}`);
    }
    const body = {
      kundendateien: {
        geloescht: dateien.geloescht.length,
        fehlgeschlagen: dateien.fehlgeschlagen.length,
        uebersprungen: dateien.uebersprungen.length,
      },
      ratenzaehler: { geloescht: zaehler },
    };
    return Response.json(body, { status: dateien.fehlgeschlagen.length ? 500 : 200, headers: KEIN_CACHE });
  } catch (error) {
    console.error('[cron/taeglich] Lauf fehlgeschlagen', error);
    return Response.json({ error: 'Lauf fehlgeschlagen.' }, { status: 500, headers: KEIN_CACHE });
  }
}
