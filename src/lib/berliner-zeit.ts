/* ==========================================================================
   Kalendertag und Jahr in deutscher Zeit
   Der Server läuft in UTC (Vercel). Zwischen 22 bzw. 23 Uhr UTC und
   Mitternacht ist in Deutschland schon der nächste Tag — „heute“, der
   Vorlauf und das Jahr der Vorgangsnummer richten sich nach der Werkstatt,
   nicht nach der Uhr des Servers.
   ========================================================================== */

const TEILE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Jahr, Monat und Tag eines Zeitpunkts in deutscher Zeit. */
function teile(jetzt: Date): { jahr: string; monat: string; tag: string } {
  const werte: Record<string, string> = {};
  for (const teil of TEILE.formatToParts(jetzt)) werte[teil.type] = teil.value;
  return { jahr: werte.year, monat: werte.month, tag: werte.day };
}

/** Heutiger Tag in deutscher Zeit als ISO-Datum, z. B. „2027-01-01“. */
export function heuteInBerlin(jetzt: Date = new Date()): string {
  const { jahr, monat, tag } = teile(jetzt);
  return `${jahr}-${monat}-${tag}`;
}

/** Aktuelles Jahr in deutscher Zeit. */
export function jahrInBerlin(jetzt: Date = new Date()): number {
  return Number(teile(jetzt).jahr);
}

const UHR = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Berlin',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

/** Abstand der deutschen Uhrzeit zu UTC in Minuten (60 im Winter, 120 im Sommer). */
function versatzMinuten(zeitpunkt: number): number {
  const werte: Record<string, string> = {};
  for (const teil of UHR.formatToParts(new Date(zeitpunkt))) werte[teil.type] = teil.value;
  const wanduhr = Date.UTC(
    Number(werte.year),
    Number(werte.month) - 1,
    Number(werte.day),
    Number(werte.hour),
    Number(werte.minute),
    Number(werte.second),
  );
  return Math.round((wanduhr - Math.floor(zeitpunkt / 1000) * 1000) / 60_000);
}

/**
 * Zeitpunkt zu Datum und Uhrzeit in deutscher Zeit, z. B. („2026-10-27“,
 * „10:00“) → 09:00 UTC. Sommer- und Winterzeit richten sich nach dem Tag des
 * Termins, nicht nach dem Tag der Berechnung.
 */
export function zeitpunktInBerlin(datum: string, uhrzeit: string): Date {
  const [jahr, monat, tag] = datum.split('-').map(Number);
  const [stunde, minute] = uhrzeit.split(':').map(Number);
  const alsUtc = Date.UTC(jahr, monat - 1, tag, stunde, minute);
  const erster = alsUtc - versatzMinuten(alsUtc) * 60_000;
  // Zweiter Schritt für Tage mit Zeitumstellung: Versatz am Ergebnis prüfen.
  return new Date(alsUtc - versatzMinuten(erster) * 60_000);
}
