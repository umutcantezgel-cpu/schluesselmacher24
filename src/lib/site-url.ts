/**
 * Ermittelt die Basis-URL der Website sicher für alle Umgebungen
 * (lokal, Vercel Preview, Produktion).
 *
 * Verhindert Fehler wie "TypeError: Invalid URL (input: '')", wenn
 * Umgebungsvariablen leer oder unvollständig übergeben werden.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.startsWith('http://') || envUrl.startsWith('https://')
      ? envUrl
      : `https://${envUrl}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return 'https://schluesselmacher24.de';
}
