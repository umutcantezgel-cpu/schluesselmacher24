import 'server-only';

import { type PostgresAdapter } from '@payloadcms/db-postgres';
import { headers } from 'next/headers';

import { mitDatenbank } from '@/lib/umgebung';

import {
  absenderAus,
  absenderSchluessel,
  loescheAlteZaehler,
  zaehleImSpeicher,
  zaehleInDatenbank,
  type RateLimitRule,
  type SqlAusfuehrer,
} from './ratenzaehler';

export type { RateLimitRule };

/**
 * Ratenbegrenzung pro Absender und Vorgang.
 *
 * Gezählt wird in der Tabelle `sm24_ratenbegrenzung`, damit die Grenze auch
 * über mehrere Server-Instanzen hinweg gilt (festes Zeitfenster je Absender).
 * Ist die Datenbank nicht erreichbar — oder in Einheitstests ohne
 * DATABASE_URL —, zählt jede Instanz im eigenen Arbeitsspeicher weiter. Das
 * bremst Massenanfragen weiterhin zuverlässig, nur eben je Instanz.
 * Absender und Zählung: ratenzaehler.ts (IPv6 je /64-Präfix).
 */

export const LIMITS = {
  vorgang: { name: 'vorgang', limit: 10, windowMs: 10 * 60 * 1000 },
  bestellung: { name: 'bestellung', limit: 10, windowMs: 10 * 60 * 1000 },
  status: { name: 'status', limit: 20, windowMs: 10 * 60 * 1000 },
  // Großzügiger: ein Formular kann ein Dutzend Fotos enthalten, dazu Wiederholungen.
  upload: { name: 'upload', limit: 30, windowMs: 10 * 60 * 1000 },
  // Je Aufruf ein Abruf bei Stripe: „Jetzt bezahlen“ und Rückkehr von der Zahlungsseite.
  zahlung: { name: 'zahlung', limit: 10, windowMs: 10 * 60 * 1000 },
  rueckkehr: { name: 'rueckkehr', limit: 20, windowMs: 10 * 60 * 1000 },
  // Widerrufsbutton: wenige echte Erklärungen, aber kein Durchprobieren von Nummern.
  widerruf: { name: 'widerruf', limit: 5, windowMs: 10 * 60 * 1000 },
  // Öffentliche Abfragen des Termin-Assistenten — je Aufruf ein Datenbankzugriff.
  termine: { name: 'termine', limit: 60, windowMs: 10 * 60 * 1000 },
  preis: { name: 'preis', limit: 60, windowMs: 10 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

export const RATE_LIMIT_MESSAGE =
  'Zu viele Anfragen in kurzer Zeit. Bitte warten Sie einige Minuten und versuchen Sie es erneut.';

/* ---------- Absender ---------------------------------------------------- */

async function clientAddress(): Promise<string> {
  return absenderAus(await headers());
}

/* ---------- Zählung in der Datenbank ------------------------------------ */

/** Nach einem Fehler wird die Datenbank eine Weile nicht mehr gefragt. */
const DB_PAUSE_MS = 30_000;
let dbPauseBis = 0;

function datenbankVerwenden(now: number): boolean {
  // Deckt auch Einheitstests ab: dort gibt es keine Datenbankverbindung.
  if (!mitDatenbank()) return false;
  return now >= dbPauseBis;
}

async function datenbank(): Promise<SqlAusfuehrer> {
  // Dynamisch: Die Payload-Konfiguration verlangt Geheimnisse, die es ohne
  // Datenbank (z. B. in Einheitstests) nicht gibt.
  const { payloadInstanz } = await import('@/lib/data/payload-adapter');
  const payload = await payloadInstanz();
  return (payload.db as unknown as PostgresAdapter).drizzle as unknown as SqlAusfuehrer;
}

/* ---------- Rückfall im Arbeitsspeicher --------------------------------- */

const buckets = new Map<string, number[]>();

/* ---------- Öffentliche Schnittstelle ----------------------------------- */

/** Gibt `true` zurück, wenn der Aufruf erlaubt ist, und zählt ihn mit. */
export async function allowRequest(rule: RateLimitRule, now = Date.now()): Promise<boolean> {
  const schluessel = absenderSchluessel(rule, await clientAddress());

  if (datenbankVerwenden(now)) {
    try {
      return (await zaehleInDatenbank(await datenbank(), schluessel, rule, now)) <= rule.limit;
    } catch (error) {
      dbPauseBis = now + DB_PAUSE_MS;
      console.warn('[ratenbegrenzung] Datenbank nicht erreichbar, zähle vorübergehend im Speicher.', error);
    }
  }
  return zaehleImSpeicher(buckets, schluessel, rule, now);
}

/**
 * Löscht Zähler, deren Fenster älter als einen Tag ist (täglicher Cron).
 * Ohne Datenbank gibt es nichts zu löschen.
 */
export async function alteZaehlerLoeschen(now = Date.now()): Promise<number> {
  if (!mitDatenbank()) return 0;
  return loescheAlteZaehler(await datenbank(), now);
}

/** Nur für Tests: leert den Speicher und hebt eine Datenbank-Pause auf. */
export function resetRateLimits() {
  buckets.clear();
  dbPauseBis = 0;
}
