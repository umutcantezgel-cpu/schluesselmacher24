/** Zeitpunkte für Erklärungen und Bestätigungen — immer in deutscher Zeit, sekundengenau. */
const ZEITPUNKT = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** ISO-Zeitpunkt als „24.10.2026, 14:30:05 Uhr“ in deutscher Zeit (auch auf Servern in UTC). */
export function eingangszeitText(iso: string): string {
  const datum = new Date(iso);
  if (Number.isNaN(datum.getTime())) return iso;
  return `${ZEITPUNKT.format(datum)} Uhr`;
}
