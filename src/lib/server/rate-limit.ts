import 'server-only';

import { createHmac } from 'node:crypto';

import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';
import { headers } from 'next/headers';

/**
 * Ratenbegrenzung pro Absender und Vorgang.
 *
 * Gezählt wird in der Tabelle `sm24_ratenbegrenzung`, damit die Grenze auch
 * über mehrere Server-Instanzen hinweg gilt (festes Zeitfenster je Absender).
 * Ist die Datenbank nicht erreichbar — oder in Einheitstests ohne
 * DATABASE_URL —, zählt jede Instanz im eigenen Arbeitsspeicher weiter. Das
 * bremst Massenanfragen weiterhin zuverlässig, nur eben je Instanz.
 */

export interface RateLimitRule {
  /** Name des Vorgangs, z. B. "anfrage". */
  name: string;
  /** Erlaubte Aufrufe im Zeitfenster. */
  limit: number;
  /** Zeitfenster in Millisekunden. */
  windowMs: number;
}

export const LIMITS = {
  vorgang: { name: 'vorgang', limit: 10, windowMs: 10 * 60 * 1000 },
  bestellung: { name: 'bestellung', limit: 10, windowMs: 10 * 60 * 1000 },
  status: { name: 'status', limit: 20, windowMs: 10 * 60 * 1000 },
  // Großzügiger: ein Formular kann ein Dutzend Fotos enthalten, dazu Wiederholungen.
  upload: { name: 'upload', limit: 30, windowMs: 10 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

export const RATE_LIMIT_MESSAGE =
  'Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten und versuchen Sie es erneut.';

/* ---------- Absender ---------------------------------------------------- */

async function clientAddress(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || h.get('x-real-ip') || 'unbekannt';
}

/**
 * Die Adresse wird nur als HMAC gespeichert. Ein einfacher Hash genügte
 * nicht: Alle IPv4-Adressen lassen sich in Minuten durchprobieren.
 */
function absenderSchluessel(rule: RateLimitRule, address: string): string {
  const geheimnis = process.env.PAYLOAD_SECRET || 'sm24-ratenbegrenzung';
  const hash = createHmac('sha256', geheimnis).update(address, 'utf8').digest('hex');
  return `${rule.name}:${hash}`;
}

/* ---------- Zählung in der Datenbank ------------------------------------ */

/** Nach einem Fehler wird die Datenbank eine Weile nicht mehr gefragt. */
const DB_PAUSE_MS = 30_000;
let dbPauseBis = 0;

function datenbankVerwenden(now: number): boolean {
  if (process.env.SM24_DATA === 'json') return false;
  // Deckt auch Einheitstests ab: dort gibt es keine DATABASE_URL.
  if (!process.env.DATABASE_URL) return false;
  return now >= dbPauseBis;
}

/** Ein einziges UPSERT: neues Fenster → 1, sonst +1. Liefert den Zählerstand. */
async function zaehleInDatenbank(schluessel: string, rule: RateLimitRule, now: number): Promise<number> {
  // Dynamisch: Die Payload-Konfiguration verlangt Geheimnisse, die es ohne
  // Datenbank (z. B. in Einheitstests) nicht gibt.
  const { payloadInstanz } = await import('@/lib/data/payload-adapter');
  const payload = await payloadInstanz();
  const db = (payload.db as unknown as PostgresAdapter).drizzle;

  const jetzt = new Date(now).toISOString();
  const fensterEnde = new Date(now - rule.windowMs).toISOString();
  const result = await db.execute(sql`
    INSERT INTO "sm24_ratenbegrenzung" AS r ("schluessel", "fenster_start", "anzahl")
    VALUES (${schluessel}, ${jetzt}::timestamptz, 1)
    ON CONFLICT ("schluessel") DO UPDATE SET
      "fenster_start" = CASE WHEN r."fenster_start" <= ${fensterEnde}::timestamptz
        THEN EXCLUDED."fenster_start" ELSE r."fenster_start" END,
      "anzahl" = CASE WHEN r."fenster_start" <= ${fensterEnde}::timestamptz
        THEN 1 ELSE LEAST(r."anzahl" + 1, ${rule.limit + 1}) END
    RETURNING "anzahl"
  `);

  // Gelegentlich aufräumen, damit die Tabelle nicht mit alten Absendern wächst.
  if (Math.random() < 0.01) {
    const alt = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    await db.execute(sql`DELETE FROM "sm24_ratenbegrenzung" WHERE "fenster_start" < ${alt}::timestamptz`);
  }

  const anzahl = Number((result.rows[0] as { anzahl?: unknown } | undefined)?.anzahl);
  if (!Number.isFinite(anzahl)) throw new Error('Ratenbegrenzung: unerwartete Antwort der Datenbank.');
  return anzahl;
}

/* ---------- Rückfall im Arbeitsspeicher --------------------------------- */

const buckets = new Map<string, number[]>();

function zaehleImSpeicher(schluessel: string, rule: RateLimitRule, now: number): boolean {
  const recent = (buckets.get(schluessel) ?? []).filter((t) => now - t < rule.windowMs);
  if (recent.length >= rule.limit) {
    buckets.set(schluessel, recent);
    return false;
  }
  recent.push(now);
  buckets.set(schluessel, recent);

  // Speicher klein halten.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= rule.windowMs)) buckets.delete(k);
    }
  }
  return true;
}

/* ---------- Öffentliche Schnittstelle ----------------------------------- */

/** Gibt `true` zurück, wenn der Aufruf erlaubt ist, und zählt ihn mit. */
export async function allowRequest(rule: RateLimitRule, now = Date.now()): Promise<boolean> {
  const schluessel = absenderSchluessel(rule, await clientAddress());

  if (datenbankVerwenden(now)) {
    try {
      return (await zaehleInDatenbank(schluessel, rule, now)) <= rule.limit;
    } catch (error) {
      dbPauseBis = now + DB_PAUSE_MS;
      console.warn('[ratenbegrenzung] Datenbank nicht erreichbar, zähle vorübergehend im Speicher.', error);
    }
  }
  return zaehleImSpeicher(schluessel, rule, now);
}

/** Nur für Tests: leert den Speicher und hebt eine Datenbank-Pause auf. */
export function resetRateLimits() {
  buckets.clear();
  dbPauseBis = 0;
}
