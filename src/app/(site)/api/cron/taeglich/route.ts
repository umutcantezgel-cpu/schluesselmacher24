import { cronAbgelehnt } from '@/lib/server/cron-zugriff';
import { mitDatenbank } from '@/lib/umgebung';

/*
 * GET /api/cron/taeglich — täglicher Lauf (vercel.json, 02:17 UTC):
 * - Kundendateien mit abgelaufener Aufbewahrungsfrist und nie zugeordnete
 *   Uploads (älter als 24 Stunden) löschen,
 * - überholte Zähler der Ratenbegrenzung löschen,
 * - an Termine in „Tage vorher“ Tagen erinnern (Einstellungen → Buchung;
 *   Vercel Hobby erlaubt nur tägliche Crons, deshalb hier und nicht stündlich),
 * - zuletzt den Betrieb prüfen (src/lib/server/betriebszustand.ts): Größen
 *   gegen die Grenzen des Free-Plans, Lebenszeichen der Sicherung und das
 *   eigene Lebenszeichen „cron-taeglich“ mit dem Ergebnis dieses Laufs, das
 *   die nächtliche Sicherung prüft. Befunde gehen als Betriebsmail ans Team
 *   und sind allein kein Fehlschlag.
 *
 * Die Antwort enthält nur Zahlen, nie Dateinamen (personenbezogen). Bei
 * Fehlschlägen antwortet die Route mit 500, damit Vercel den Lauf als
 * fehlgeschlagen anzeigt. GET-Route-Handler werden in Next 16 nicht
 * zwischengespeichert; `no-store` gilt zusätzlich für Zwischenstationen.
 */

export const maxDuration = 60;

const KEIN_CACHE = { 'Cache-Control': 'no-store' };

interface Teilergebnis {
  body: Record<string, unknown>;
  fehlschlag: boolean;
}

/** Bereinigung, Zählerpflege und Erinnerungen. Wirft nie. */
async function aufraeumenUndErinnern(): Promise<Teilergebnis> {
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
    return {
      body: {
        kundendateien: {
          geloescht: dateien.geloescht.length,
          fehlgeschlagen: dateien.fehlgeschlagen.length,
          uebersprungen: dateien.uebersprungen.length,
        },
        ratenzaehler: { geloescht: zaehler },
        erinnerungen: erinnerungen ?? { fehler: 'Lauf fehlgeschlagen.' },
      },
      fehlschlag: dateien.fehlgeschlagen.length > 0 || !erinnerungen || erinnerungen.fehlgeschlagen > 0,
    };
  } catch (error) {
    console.error('[cron/taeglich] Lauf fehlgeschlagen', error);
    return { body: { error: 'Lauf fehlgeschlagen.' }, fehlschlag: true };
  }
}

/** Zuletzt, damit das Lebenszeichen das Ergebnis des Laufs trägt. Wirft nie. */
async function betriebPruefenUndMelden(laufFehlgeschlagen: boolean): Promise<Teilergebnis> {
  try {
    const { betriebPruefen } = await import('@/lib/server/betriebszustand');
    const { befunde, datenbankMb, ablageMb, mail } = await betriebPruefen({
      cronStatus: laufFehlgeschlagen ? 'fehler' : 'ok',
    });
    return { body: { befunde, datenbankMb, ablageMb, ...(mail ? { mail } : {}) }, fehlschlag: false };
  } catch (error) {
    console.error('[cron/taeglich] Betriebsprüfung fehlgeschlagen', error);
    return { body: { fehler: 'Prüfung fehlgeschlagen.' }, fehlschlag: true };
  }
}

export async function GET(request: Request): Promise<Response> {
  const abgelehnt = cronAbgelehnt(request);
  if (abgelehnt) return abgelehnt;

  if (!mitDatenbank()) {
    return Response.json({ error: 'Keine Datenbank angebunden.' }, { status: 503, headers: KEIN_CACHE });
  }

  const lauf = await aufraeumenUndErinnern();
  const betrieb = await betriebPruefenUndMelden(lauf.fehlschlag);
  return Response.json(
    { ...lauf.body, betrieb: betrieb.body },
    { status: lauf.fehlschlag || betrieb.fehlschlag ? 500 : 200, headers: KEIN_CACHE },
  );
}
