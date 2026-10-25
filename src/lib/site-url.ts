/**
 * Ermittelt die Basis-URL der Website sicher für alle Umgebungen
 * (lokal, Vercel Preview, Produktion) — immer mit Protokoll, ohne
 * Schrägstrich am Ende. Verwendet für Metadaten, Sitemap, robots.txt und
 * absolute Rücksprungadressen (z. B. Stripe Checkout).
 *
 * - Vercel-Vorschau: die Branch-Adresse (VERCEL_BRANCH_URL), sonst die
 *   Deployment-Adresse. NEXT_PUBLIC_SITE_URL zählt dort nicht, sonst führten
 *   Rücksprünge aus einer Vorschau auf die echte Seite.
 * - Produktion und lokal: NEXT_PUBLIC_SITE_URL, auf Vercel ersatzweise die
 *   Produktionsdomain (VERCEL_PROJECT_PRODUCTION_URL).
 *
 * Verhindert Fehler wie "TypeError: Invalid URL (input: '')", wenn
 * Umgebungsvariablen leer oder unvollständig übergeben werden.
 */
export function getSiteUrl(): string {
  // Wörtliche Zugriffe: Nur so setzt Next.js NEXT_PUBLIC_SITE_URL auch im Browser ein.
  if (wert(process.env.VERCEL) && wert(process.env.VERCEL_ENV) !== 'production') {
    const vorschau = wert(process.env.VERCEL_BRANCH_URL) ?? wert(process.env.VERCEL_URL);
    if (vorschau) return mitProtokoll(vorschau);
  }

  const gesetzt =
    wert(process.env.NEXT_PUBLIC_SITE_URL)
    ?? wert(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    ?? wert(process.env.VERCEL_URL);
  return gesetzt ? mitProtokoll(gesetzt) : 'https://schluesselmacher24.de';
}

function wert(text: string | undefined): string | undefined {
  return text?.trim() || undefined;
}

function mitProtokoll(url: string): string {
  const absolut = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  return absolut.replace(/\/+$/, '');
}
