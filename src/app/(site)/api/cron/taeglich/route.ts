import { cronAbgelehnt } from '@/lib/server/cron-zugriff';
import { mitDatenbank } from '@/lib/umgebung';

/*
 * GET /api/cron/taeglich — täglicher Lauf (vercel.json, 02:17 UTC):
 * - Kundendateien mit abgelaufener Aufbewahrungsfrist und nie zugeordnete
 *   Uploads (älter als 24 Stunden) löschen,
 * - überholte Zähler der Ratenbegrenzung löschen,
 * - an Termine in „Tage vorher“ Tagen erinnern (Einstellungen → Buchung;
 *   Vercel Hobby erlaubt nur tägliche Crons, deshalb hier und nicht stündlich).
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
    const [{ bereinigeKundendateien }, { alteZaehlerLoeschen }, { terminErinnerungenSenden }] = await Promise.all([
      import('@/lib/server/kundendateien'),
      import('@/lib/server/rate-limit'),
      import('@/lib/server/termin-erinnerungen'),
    ]);
    const dateien = await bereinigeKundendateien();
    const zaehler = await alteZaehlerLoeschen();
    // Ein Fehler bei den Erinnerungen hält die Bereinigung nicht auf (und umgekehrt).
    const erinnerungen = await terminErinnerungenSenden().catch((error: unknown) => {
      console.error('[cron/taeglich] Termin-Erinnerungen fehlgeschlagen', error);
      return null;
    });

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
      erinnerungen: erinnerungen ?? { fehler: 'Lauf fehlgeschlagen.' },
    };
    const fehlschlag = dateien.fehlgeschlagen.length > 0 || !erinnerungen || erinnerungen.fehlgeschlagen > 0;
    return Response.json(body, { status: fehlschlag ? 500 : 200, headers: KEIN_CACHE });
  } catch (error) {
    console.error('[cron/taeglich] Lauf fehlgeschlagen', error);
    return Response.json({ error: 'Lauf fehlgeschlagen.' }, { status: 500, headers: KEIN_CACHE });
  }
}
