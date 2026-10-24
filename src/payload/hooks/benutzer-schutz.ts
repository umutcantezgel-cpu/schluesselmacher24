import type { PostgresAdapter } from '@payloadcms/db-postgres';
import { APIError, Forbidden, type CollectionBeforeOperationHook, type PayloadRequest } from 'payload';

import {
  absenderAus,
  absenderSchluessel,
  zaehleImSpeicher,
  zaehleInDatenbank,
  type RateLimitRule,
  type SqlAusfuehrer,
} from '../../lib/server/ratenzaehler';

/*
 * Schutz der Backend-Zugänge (Sammlung `benutzer`).
 *
 * Bewusst ohne Module mit 'server-only': Die Payload-Konfiguration lädt diese
 * Datei auch in `payload run`-Skripten außerhalb von Next.
 */

/* ---------- Keine offene Erstregistrierung ------------------------------ */

/**
 * Payload bietet auf einer leeren Datenbank jedem Besucher an, das erste
 * Konto anzulegen (/admin/create-first-user → POST /api/benutzer/first-register).
 * `registerFirstUserOperation` legt das Konto mit `payload.create` an und reicht
 * dabei die HTTP-Anfrage weiter — ohne angemeldeten Benutzer und mit
 * `payloadAPI: 'REST'`. Dieser Hook läuft dort mit (`buildBeforeOperation` in
 * `createOperation`) und sperrt den Weg dauerhaft.
 *
 * Erlaubt bleiben: angemeldete Benutzer (die Zugriffsregel `create` verlangt
 * dann die Rolle Inhaber), das Skript admin-anlegen.ts (`context.adminAnlage`)
 * und Aufrufe der Local API aus eigenem Servercode (Skripte, Tests).
 */
export const erstregistrierungSperren: CollectionBeforeOperationHook = ({ operation, req, context }) => {
  if (operation !== 'create') return;
  if (req.user || context?.adminAnlage === true || req.payloadAPI === 'local') return;
  throw new Forbidden(req.t);
};

/* ---------- Ratenbegrenzung für Anmeldung und „Passwort vergessen“ ------- */

/**
 * Payload sperrt nach fünf Fehlversuchen das Konto für 15 Minuten — je Konto,
 * nicht je Absender. Diese Grenze je Absender bremst das Durchprobieren
 * vieler Konten und den Missbrauch von „Passwort vergessen“ als Mailschleuder.
 */
export const ANMELDE_LIMITS = {
  login: { name: 'backend-anmeldung', limit: 20, windowMs: 15 * 60 * 1000 },
  forgotPassword: { name: 'backend-passwort', limit: 5, windowMs: 15 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

export const MELDUNG_ZU_VIELE_VERSUCHE =
  'Zu viele Versuche in kurzer Zeit. Bitte warten Sie 15 Minuten und versuchen Sie es dann erneut.';

const speicher = new Map<string, number[]>();

async function zaehlen(req: PayloadRequest, rule: RateLimitRule, now: number): Promise<boolean> {
  const schluessel = absenderSchluessel(rule, absenderAus(req.headers));
  try {
    const db = (req.payload.db as unknown as PostgresAdapter).drizzle as unknown as SqlAusfuehrer;
    return (await zaehleInDatenbank(db, schluessel, rule, now)) <= rule.limit;
  } catch (error) {
    req.payload.logger.warn({ msg: 'Ratenbegrenzung der Anmeldung: Datenbank nicht erreichbar, zähle im Speicher.', err: error });
    return zaehleImSpeicher(speicher, schluessel, rule, now);
  }
}

export const anmeldungBegrenzen: CollectionBeforeOperationHook = async ({ operation, req }) => {
  if (operation !== 'login' && operation !== 'forgotPassword') return;
  // Eigener Servercode (Local API) wird nicht gebremst.
  if (req.payloadAPI === 'local') return;
  if (!(await zaehlen(req, ANMELDE_LIMITS[operation], Date.now()))) {
    throw new APIError(MELDUNG_ZU_VIELE_VERSUCHE, 429, null, true);
  }
};

/** Nur für Tests: leert den Rückfallspeicher. */
export function anmeldeSpeicherLeeren() {
  speicher.clear();
}
