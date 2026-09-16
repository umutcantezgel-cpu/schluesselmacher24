/* Anzeigeformate — deutschsprachig, ohne fachliche Annahmen. */

const EUR = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
});

const NUM = new Intl.NumberFormat('de-DE');

/** Betrag in Cent als Euro-Text, z. B. 6990 → "69,90 €". */
export function formatCents(cents: number): string {
  return EUR.format(cents / 100);
}

export function formatNumber(value: number): string {
  return NUM.format(value);
}

/** ISO-Datum ("2026-10-02") als "Freitag, 2. Oktober 2026". */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** ISO-Datum kurz, z. B. "02.10.2026". */
export function formatDateShort(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/** Vollständiger Zeitstempel, z. B. "02.10.2026, 14:30". */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** Dauer in Minuten als "1 Std. 30 Min.". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} Min.`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} Std.` : `${hours} Std. ${rest} Min.`;
}

export function formatMillimeter(mm: number): string {
  return `${NUM.format(mm)} mm`;
}

const DAY_NAMES = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
];

/** 1 = Montag … 7 = Sonntag */
export function formatWeekday(day: number): string {
  return DAY_NAMES[day - 1] ?? '';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
