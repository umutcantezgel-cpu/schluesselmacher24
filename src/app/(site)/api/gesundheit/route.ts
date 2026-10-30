import { createHash, timingSafeEqual } from 'node:crypto';

import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';

import type { SqlAusfuehrer } from '@/lib/server/ratenzaehler';
import { mitDatenbank } from '@/lib/umgebung';

/*
 * GET /api/gesundheit?schluessel=… — für den Uptime-Monitor (docs/SUPABASE.md,
 * Wachhalten): Antwortet die Datenbank innerhalb von 5 Sekunden auf
 * `SELECT 1`? Der Abruf alle paar Minuten hält das Supabase-Projekt zugleich
 * wach. HEAD beantwortet Next.js über diesen Handler mit.
 *
 * Ohne gültigen Schlüssel (GESUNDHEIT_SCHLUESSEL, mindestens 24 Zeichen,
 * zeitkonstant verglichen) antwortet die Route mit 404 und berührt die
 * Datenbank nicht – sie lässt sich so weder finden noch zum Wecken
 * missbrauchen. Die Antwort enthält keine Details; `no-store` hält sie aus
 * jedem Zwischenspeicher (GET-Route-Handler cacht Next 16 ohnehin nicht).
 */

export const maxDuration = 15;

const KEIN_CACHE = { 'Cache-Control': 'no-store' };
const ZEITGRENZE_MS = 5_000;
const MINDESTLAENGE = 24;

function sha256(text: string): Buffer {
  return createHash('sha256').update(text, 'utf8').digest();
}

function schluesselPasst(request: Request): boolean {
  const erwartet = process.env.GESUNDHEIT_SCHLUESSEL?.trim();
  if (!erwartet) return false;
  if (erwartet.length < MINDESTLAENGE) {
    console.warn(`[gesundheit] GESUNDHEIT_SCHLUESSEL ist kürzer als ${MINDESTLAENGE} Zeichen – Route bleibt aus.`);
    return false;
  }
  const erhalten = new URL(request.url).searchParams.get('schluessel') ?? '';
  // Beide Seiten gehasht: gleich lange Werte für timingSafeEqual, die Länge sickert nicht durch.
  return timingSafeEqual(sha256(erhalten), sha256(erwartet));
}

/** `SELECT 1` über die Verbindung der Website; wirft nach der Zeitgrenze. */
async function datenbankAntwortet(): Promise<void> {
  // Dynamisch wie in rate-limit.ts: Ohne Datenbank verlangt die Konfiguration nichts.
  const { payloadInstanz } = await import('@/lib/data/payload-adapter');
  const payload = await payloadInstanz();
  const db = (payload.db as unknown as PostgresAdapter).drizzle as unknown as SqlAusfuehrer;
  // Promise.resolve: Drizzle führt die Abfrage bei jedem `then` neu aus – so genau einmal.
  const abfrage = Promise.resolve(db.execute(sql`SELECT 1`));
  let zeitgrenze: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      abfrage,
      new Promise<never>((_, reject) => {
        zeitgrenze = setTimeout(() => reject(new Error(`keine Antwort nach ${ZEITGRENZE_MS} ms`)), ZEITGRENZE_MS);
      }),
    ]);
  } finally {
    clearTimeout(zeitgrenze);
    // Scheitert die Abfrage erst nach der Zeitgrenze, ist das kein unbehandelter Fehler mehr.
    abfrage.catch(() => undefined);
  }
}

export async function GET(request: Request): Promise<Response> {
  if (!schluesselPasst(request)) return new Response('Not Found', { status: 404, headers: KEIN_CACHE });

  if (!mitDatenbank()) return Response.json({ ok: false }, { status: 503, headers: KEIN_CACHE });

  try {
    await datenbankAntwortet();
    return Response.json({ ok: true }, { headers: KEIN_CACHE });
  } catch (error) {
    console.error('[gesundheit] Datenbank antwortet nicht', error);
    return Response.json({ ok: false }, { status: 503, headers: KEIN_CACHE });
  }
}
