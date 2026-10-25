import { createHmac } from 'node:crypto';

import { sql } from '@payloadcms/db-postgres';

/*
 * Bausteine der Ratenbegrenzung: Absender bestimmen, Schlüssel bilden und in
 * der Tabelle `sm24_ratenbegrenzung` zählen.
 *
 * Bewusst ohne 'server-only' und ohne Next-Abhängigkeiten: Auch die
 * Payload-Konfiguration nutzt diese Datei (Ratenbegrenzung der Anmeldung im
 * Backend, src/payload/hooks/benutzer-schutz.ts), und die läuft ebenso in
 * `payload run`-Skripten außerhalb von Next.
 */

export interface RateLimitRule {
  /** Name des Vorgangs, z. B. "anfrage". */
  name: string;
  /** Erlaubte Aufrufe im Zeitfenster. */
  limit: number;
  /** Zeitfenster in Millisekunden. */
  windowMs: number;
}

/** Zähler, deren Fenster länger als einen Tag zurückliegt, sind überholt. */
export const ZAEHLER_AUFBEWAHREN_MS = 24 * 60 * 60 * 1000;

/* ---------- Absender ---------------------------------------------------- */

const HEXTETT = /^[0-9a-f]{1,4}$/;

/** Schreibt eine IPv6-Adresse in acht Gruppen aus; `null`, wenn sie ungültig ist. */
function ipv6Gruppen(adresse: string): string[] | null {
  let text = adresse;
  // Eingebettete IPv4-Adresse am Ende („64:ff9b::192.0.2.1“) als zwei Gruppen.
  const ipv4 = /^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/.exec(text);
  if (ipv4) {
    const bytes = ipv4[2].split('.').map(Number);
    if (bytes.some((b) => b > 255)) return null;
    text = `${ipv4[1]}${((bytes[0] << 8) | bytes[1]).toString(16)}:${((bytes[2] << 8) | bytes[3]).toString(16)}`;
  }

  const haelften = text.split('::');
  if (haelften.length > 2) return null;
  const teile = (haelfte: string) => (haelfte ? haelfte.split(':') : []);
  let gruppen: string[];
  if (haelften.length === 1) {
    gruppen = teile(text);
  } else {
    const links = teile(haelften[0]);
    const rechts = teile(haelften[1]);
    const fehlend = 8 - links.length - rechts.length;
    if (fehlend < 1) return null;
    gruppen = [...links, ...Array<string>(fehlend).fill('0'), ...rechts];
  }
  if (gruppen.length !== 8 || !gruppen.every((g) => HEXTETT.test(g))) return null;
  return gruppen.map((g) => parseInt(g, 16).toString(16));
}

/**
 * Vereinheitlicht die Adresse für die Zählung. IPv6-Anschlüsse erhalten in
 * der Regel ein ganzes /64-Netz; innerhalb davon kann jeder Absender beliebig
 * wechseln. Gezählt wird deshalb je /64-Präfix. IPv4 (auch in IPv6-Schreibweise
 * „::ffff:192.0.2.1“) bleibt die einzelne Adresse.
 */
export function adresseKuerzen(adresse: string): string {
  let text = adresse.trim().toLowerCase();
  const inKlammern = /^\[([^\]]+)\](?::\d+)?$/.exec(text);
  if (inKlammern) text = inKlammern[1];
  const mitPort = /^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/.exec(text);
  if (mitPort) return mitPort[1];
  if (!text.includes(':')) return text;

  text = text.replace(/%.*$/, '');
  const gruppen = ipv6Gruppen(text);
  if (!gruppen) return text;

  // IPv4-gemappt (::ffff:a.b.c.d): die eigentliche IPv4-Adresse zählen.
  if (gruppen.slice(0, 5).every((g) => g === '0') && gruppen[5] === 'ffff') {
    const [hoch, tief] = [parseInt(gruppen[6], 16), parseInt(gruppen[7], 16)];
    return [hoch >> 8, hoch & 0xff, tief >> 8, tief & 0xff].join('.');
  }
  return `${gruppen.slice(0, 4).join(':')}::/64`;
}

/** Absender aus den Kopfzeilen: der erste Eintrag von `x-forwarded-for` (auf Vercel von der Plattform gesetzt). */
export function absenderAus(kopf: Headers): string {
  const weitergeleitet = kopf.get('x-forwarded-for')?.split(',')[0]?.trim();
  return adresseKuerzen(weitergeleitet || kopf.get('x-real-ip')?.trim() || 'unbekannt');
}

/**
 * Die Adresse wird nur als HMAC gespeichert. Ein einfacher Hash genügte
 * nicht: Alle IPv4-Adressen lassen sich in Minuten durchprobieren.
 */
export function absenderSchluessel(rule: RateLimitRule, adresse: string): string {
  const geheimnis = process.env.PAYLOAD_SECRET || 'sm24-ratenbegrenzung';
  const hash = createHmac('sha256', geheimnis).update(adresse, 'utf8').digest('hex');
  return `${rule.name}:${hash}`;
}

/* ---------- Zählung in der Datenbank ------------------------------------ */

type Abfrage = ReturnType<typeof sql>;
export interface SqlAusfuehrer {
  execute(abfrage: Abfrage): Promise<{ rows: Record<string, unknown>[] }>;
}

/** Ein einziges UPSERT: neues Fenster → 1, sonst +1. Liefert den Zählerstand. */
export async function zaehleInDatenbank(
  db: SqlAusfuehrer,
  schluessel: string,
  rule: RateLimitRule,
  now: number,
): Promise<number> {
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

  // Gelegentlich aufräumen; gründlich räumt der tägliche Cron auf.
  if (Math.random() < 0.01) await loescheAlteZaehler(db, now);

  const anzahl = Number((result.rows[0] as { anzahl?: unknown } | undefined)?.anzahl);
  if (!Number.isFinite(anzahl)) throw new Error('Ratenbegrenzung: unerwartete Antwort der Datenbank.');
  return anzahl;
}

/** Löscht Zähler, deren Fenster älter als einen Tag ist. Liefert die Anzahl. */
export async function loescheAlteZaehler(db: SqlAusfuehrer, now = Date.now()): Promise<number> {
  const grenze = new Date(now - ZAEHLER_AUFBEWAHREN_MS).toISOString();
  const result = await db.execute(sql`
    WITH geloescht AS (
      DELETE FROM "sm24_ratenbegrenzung" WHERE "fenster_start" < ${grenze}::timestamptz RETURNING 1
    )
    SELECT count(*)::int AS "anzahl" FROM geloescht
  `);
  return Number((result.rows[0] as { anzahl?: unknown } | undefined)?.anzahl ?? 0);
}

/* ---------- Rückfall im Arbeitsspeicher --------------------------------- */

/** Zählt im Speicher der Instanz; `true`, solange die Grenze nicht erreicht ist. */
export function zaehleImSpeicher(
  buckets: Map<string, number[]>,
  schluessel: string,
  rule: RateLimitRule,
  now: number,
): boolean {
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
