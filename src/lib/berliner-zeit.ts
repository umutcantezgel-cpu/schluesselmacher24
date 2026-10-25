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
