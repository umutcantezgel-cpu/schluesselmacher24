import 'server-only';

import { createHash } from 'node:crypto';

import { sql, type PostgresAdapter } from '@payloadcms/db-postgres';

import { heuteInBerlin } from '@/lib/berliner-zeit';
import {
  betriebBefunde,
  grenzenAusUmgebung,
  inMb,
  type Befund,
  type LebenszeichenQuelle,
  type Messwerte,
} from '@/lib/betrieb/zustand';
import { getSettings } from '@/lib/data';
import { idempotenzSchluessel, sendeVorlage, teamEmpfaenger, vorlagenKontext } from '@/lib/mail/versand';
import { betriebWarnung } from '@/lib/mail/vorlagen/betrieb-warnung';
import type { MailLogEntry } from '@/lib/types';

import type { SqlAusfuehrer } from './ratenzaehler';

/* ==========================================================================
   Betriebsprüfung im täglichen Cron (docs/SUPABASE.md, Überwachung)
   Misst Datenbankgröße, Dateiablage (geschätzt aus den Dateigrößen in der
   Datenbank, ohne Abfrage beim Bucket) und Rohgröße der Tabellen, liest die
   Lebenszeichen der Sicherung und setzt das eigene („cron-taeglich“). Die
   nächtliche Sicherung prüft umgekehrt dieses Lebenszeichen – so meldet sich
   jeder Ausfallweg irgendwo. Befunde gehen als Betriebsmail an das Team,
   höchstens einmal am Tag je Befundlage (Idempotenz-Schlüssel bei Resend).
   Ohne Lebenszeichen-Tabelle (lokale Datenbank ohne Supabase-Härtung) bleibt
   es bei Größen und Füllständen.
   ========================================================================== */

export interface BetriebsErgebnis {
  befunde: Befund[];
  datenbankMb: number;
  ablageMb: number;
  /** Nur mit Befunden: Ergebnis der Betriebsmail. */
  mail?: MailLogEntry['result'] | 'keine-empfaenger';
}

interface Messung extends Messwerte {
  /** Gibt es intern.lebenszeichen_setzen (supabase/sql/0004)? */
  lebenszeichenSetzbar: boolean;
}

async function datenbank(): Promise<SqlAusfuehrer> {
  // Dynamisch wie in rate-limit.ts: Ohne Datenbank verlangt die Konfiguration nichts.
  const { payloadInstanz } = await import('@/lib/data/payload-adapter');
  const payload = await payloadInstanz();
  return (payload.db as unknown as PostgresAdapter).drizzle as unknown as SqlAusfuehrer;
}

function bytes(wert: unknown): number {
  const zahl = Number(wert);
  return Number.isFinite(zahl) && zahl > 0 ? zahl : 0;
}

/** Liest Größen und Lebenszeichen. Wirft bei Datenbankfehlern. */
export async function messwerteLesen(db: SqlAusfuehrer): Promise<Messung> {
  const { rows } = await db.execute(sql`
    SELECT
      pg_database_size(current_database())::bigint AS "datenbank",
      (SELECT coalesce(sum(pg_table_size(c.oid)), 0)::bigint
         FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')) AS "tabellen",
      ((SELECT coalesce(sum("filesize"), 0) FROM "kundendateien")
        + (SELECT coalesce(sum("filesize"), 0) FROM "interne_dateien")
        + (SELECT coalesce(sum(coalesce("filesize", 0) + coalesce("sizes_klein_filesize", 0)
             + coalesce("sizes_mittel_filesize", 0) + coalesce("sizes_gross_filesize", 0)), 0) FROM "medien")
      )::bigint AS "ablage",
      to_regclass('intern.lebenszeichen') IS NOT NULL AS "tabelle_da",
      to_regprocedure('intern.lebenszeichen_setzen(text, jsonb)') IS NOT NULL AS "setzen_da"
  `);
  const zeile = rows[0] ?? {};

  let lebenszeichen: Messwerte['lebenszeichen'] = null;
  if (zeile.tabelle_da === true) {
    const ergebnis = await db.execute(sql`SELECT "quelle", "zuletzt" FROM intern.lebenszeichen`);
    lebenszeichen = {};
    for (const eintrag of ergebnis.rows) {
      const zuletzt = new Date(String(eintrag.zuletzt));
      if (!Number.isNaN(zuletzt.getTime())) lebenszeichen[eintrag.quelle as LebenszeichenQuelle] = zuletzt;
    }
  }

  return {
    datenbankBytes: bytes(zeile.datenbank),
    tabellenBytes: bytes(zeile.tabellen),
    ablageBytes: bytes(zeile.ablage),
    lebenszeichen,
    lebenszeichenSetzbar: zeile.setzen_da === true,
  };
}

/** Betriebsmail mit allen Befunden an das Team. Wirft nie. */
async function melden(befunde: Befund[], jetzt: Date): Promise<NonNullable<BetriebsErgebnis['mail']>> {
  try {
    const settings = await getSettings();
    const an = teamEmpfaenger(settings.company);
    if (an.length === 0) return 'keine-empfaenger';
    const stand = heuteInBerlin(jetzt);
    // Je Tag und Befundlage höchstens eine Mail, auch bei einem zweiten Lauf.
    const lage = createHash('sha256')
      .update(befunde.map((befund) => `${befund.art}:${befund.stufe}`).join('|'))
      .digest('hex')
      .slice(0, 12);
    const eintrag = await sendeVorlage({
      art: 'team-hinweis',
      an,
      inhalt: betriebWarnung({ befunde, stand, kontext: vorlagenKontext(settings) }),
      idempotenzSchluessel: idempotenzSchluessel('betrieb', 'warnung', `${stand}-${lage}`),
    });
    if (eintrag.result !== 'gesendet') console.warn(`[betrieb] Betriebsmail: ${eintrag.result}`);
    return eintrag.result;
  } catch (error) {
    console.error('[betrieb] Betriebsmail nicht versendet', error instanceof Error ? error.name : 'Fehler');
    return 'fehlgeschlagen';
  }
}

/**
 * Misst, setzt das Lebenszeichen „cron-taeglich“ (mit dem Ergebnis des
 * übrigen Crons) und meldet Befunde. Wirft nur, wenn die Messung selbst
 * scheitert – dann antwortet der Cron mit 500.
 */
export async function betriebPruefen({
  cronStatus,
  jetzt = new Date(),
}: {
  cronStatus: 'ok' | 'fehler';
  jetzt?: Date;
}): Promise<BetriebsErgebnis> {
  const db = await datenbank();
  const messung = await messwerteLesen(db);
  if (messung.lebenszeichenSetzbar) {
    await db.execute(
      sql`SELECT intern.lebenszeichen_setzen('cron-taeglich', ${JSON.stringify({ status: cronStatus })}::jsonb)`,
    );
  }

  const befunde = betriebBefunde(messung, jetzt, grenzenAusUmgebung());
  const ergebnis: BetriebsErgebnis = {
    befunde,
    datenbankMb: inMb(messung.datenbankBytes),
    ablageMb: inMb(messung.ablageBytes),
  };
  if (befunde.length > 0) ergebnis.mail = await melden(befunde, jetzt);
  return ergebnis;
}
