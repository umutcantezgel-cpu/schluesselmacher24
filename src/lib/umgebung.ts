/* ==========================================================================
   Umgebung
   Ein Ort für alle Fragen an die Umgebungsvariablen: Datenbank, Dateiablage,
   Mailversand, Zahlung und Server-Adresse. Bewusst ohne 'server-only' und
   ohne Importe — die Payload-Konfiguration und die `payload run`-Skripte
   laden diese Datei ebenfalls. Werte werden bei jedem Aufruf frisch gelesen,
   damit Tests sie mit `vi.stubEnv` setzen können.
   ========================================================================== */

/** Gesetzt und nicht nur Leerzeichen. */
function wert(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/* ---------- Datenbank ---------------------------------------------------- */

/**
 * Verbindung für den laufenden Betrieb. `POSTGRES_URL` ist der Name, den die
 * Vercel-Integrationen (Supabase, Neon) vergeben.
 */
export function datenbankUrl(): string | undefined {
  return wert('DATABASE_URL') ?? wert('POSTGRES_URL');
}

/**
 * Direkte Verbindung ohne Pooler — für Migrationen, die Sitzungsfunktionen
 * brauchen. Ohne eigene Angabe dieselbe wie `datenbankUrl()`.
 */
export function datenbankUrlDirekt(): string | undefined {
  return wert('DATABASE_URL_UNPOOLED') ?? wert('POSTGRES_URL_NON_POOLING') ?? datenbankUrl();
}

/**
 * Arbeitet die Seite mit der Datenbank (Payload)? Ohne Verbindung oder mit
 * `SM24_DATA=json` liest sie die Inhalte aus `content/*.json` (Notbetrieb).
 */
export function mitDatenbank(): boolean {
  return process.env.SM24_DATA !== 'json' && Boolean(datenbankUrl());
}

/**
 * Darf der Server dauerhaft auf die eigene Festplatte schreiben? Auf Vercel
 * nicht (flüchtiges Dateisystem), ebenso nicht mit `SM24_READONLY_CONTENT=1`.
 */
export function dateisystemSchreibbar(): boolean {
  return !process.env.VERCEL && process.env.SM24_READONLY_CONTENT !== '1';
}

/** Produktion: auf Vercel nur die Produktionsumgebung, sonst `NODE_ENV`. */
export function istProduktion(): boolean {
  if (process.env.VERCEL) return process.env.VERCEL_ENV === 'production';
  return process.env.NODE_ENV === 'production';
}

/**
 * Schaufenster: Produktion auf Vercel ohne Datenbank. Das lässt der Build nur
 * mit ausdrücklichem Schalter zu (scripts/build.mjs, scripts/schaufenster.json).
 * Die Seite zeigt dann Gestaltung und Inhalte aus content/*.json, nimmt aber
 * nichts an: Formulare und Uploads lehnen ehrlich ab (src/lib/server/ohne-speicher.ts),
 * die Datenschicht schreibt ohnehin nicht (src/lib/data/json-adapter.ts).
 */
export function istSchaufenster(): boolean {
  return Boolean(process.env.VERCEL) && process.env.VERCEL_ENV === 'production' && !mitDatenbank();
}

/**
 * Redaktions- und Prüfhinweise zeigen (etwa „Diese Rechtstexte sind Entwürfe“)?
 * Überall außer auf der Live-Seite. Das Schaufenster dient der Sichtprüfung
 * und zeigt sie deshalb wie eine Vorschau — sonst stünden ungeprüfte Entwürfe
 * öffentlich ohne ihren Hinweis da.
 */
export function pruefhinweiseZeigen(): boolean {
  return !istProduktion() || istSchaufenster();
}

/**
 * Kann die Seite Vorgänge dauerhaft speichern? Nicht ohne Datenbank auf einem
 * schreibgeschützten Dateisystem (Schaufenster und Vorschauen auf Vercel).
 */
export function speichernMoeglich(): boolean {
  return mitDatenbank() || dateisystemSchreibbar();
}

/* ---------- Suchmaschinen ------------------------------------------------ */

/**
 * Die echte Produktionsdomain. Nur unter ihr (mit oder ohne `www.`) darf eine
 * Seite in den Index; jede andere Adresse desselben Builds (etwa die
 * `*.vercel.app`-Adressen) liefert `X-Robots-Tag: noindex` (FA-25-20).
 */
export const PRODUKTIONSDOMAIN = 'schluesselmacher24.de';

/**
 * Dürfen Suchmaschinen die Seiten aufnehmen? Die eine Stelle, an der das
 * entschieden wird (FA-25-20, FA-SEO-01C): Root-Layout (Meta-Angabe), robots.txt
 * (Sitemap-Hinweis) und `suchmaschinenKopfzeilen()` (Kopfzeile) fragen hier.
 *
 * - Nur in der Produktion — Vorschau-Deployments und lokale Entwicklung stehen
 *   auf noindex (Erg. Leitfaden §4).
 * - Das Schaufenster zählt wie eine Vorschau: Eine Seite, die keine Bestellung
 *   annimmt, gehört nicht in den Index (A-042).
 * - Außerhalb von Vercel genügt `NODE_ENV=production` nicht: Ein Produktions-
 *   build auf einem eigenen Server (Prüfserver, Staging) bleibt auf noindex,
 *   bis `SM24_INDEXIERUNG=an` ausdrücklich gesetzt ist.
 * - `SM24_INDEXIERUNG=aus` sperrt überall, auch auf Vercel (Notbremse).
 *
 * Wirkt beim Build: robots.txt, die Meta-Angabe statischer Seiten und die Kopfzeilen-Regel werden dann
 * erzeugt. Den Schalter deshalb beim Build setzen; eine Änderung braucht einen neuen Build/ein neues Deployment.
 */
export function indexierungErlaubt(): boolean {
  const schalter = process.env.SM24_INDEXIERUNG?.trim().toLowerCase();
  if (schalter === 'aus') return false;
  if (!istProduktion() || istSchaufenster()) return false;
  if (process.env.VERCEL) return true;
  return schalter === 'an';
}

/** Eine Kopfzeilen-Regel im Format von `headers()` in `next.config.ts`. */
export interface KopfzeilenRegel {
  source: string;
  missing?: Array<{ type: 'host'; value: string }>;
  headers: Array<{ key: string; value: string }>;
}

/** Hostname der Produktion als Muster für `missing`/`has` (Next.js verankert es mit ^…$). */
export const PRODUKTIONS_HOST_MUSTER = `(?:www\\.)?${PRODUKTIONSDOMAIN.replace(/\./g, '\\.')}`;

/**
 * Hosts ohne Kopfzeile, wenn die Indexierung erlaubt ist: die Produktionsdomain und die eigene Maschine
 * (`localhost`, `127.0.0.1`). Die Loopback-Adressen erreicht keine Suchmaschine; ausgenommen sind sie nur,
 * damit ein Messlauf gegen einen lokal mit `SM24_INDEXIERUNG=an` gebauten Server (Seobility-Ersatz
 * `onpage.mjs`) die Seiten so sieht wie die Produktion. Next.js vergleicht den Host ohne Port.
 */
export const OHNE_NOINDEX_HOST_MUSTER = `(?:${PRODUKTIONS_HOST_MUSTER}|localhost|127\\.0\\.0\\.1)`;

/**
 * `X-Robots-Tag: noindex` als Kopfzeile für `next.config.ts` (`headers()`).
 * Ist die Indexierung nicht erlaubt, gilt sie für jede Adresse; sonst für jede
 * Adresse außer der Produktionsdomain (und der eigenen Maschine, siehe
 * `OHNE_NOINDEX_HOST_MUSTER`). robots.txt sperrt dabei nichts, damit
 * Suchmaschinen das noindex überhaupt lesen (FA-RECHERCHE-05, Abschnitt 4).
 *
 * Wie robots.txt und die Meta-Angabe des Layouts wird diese Regel beim Build
 * festgelegt (`headers()` landet im Routen-Manifest): `SM24_INDEXIERUNG` muss beim
 * Build gesetzt sein, eine Änderung braucht einen neuen Build bzw. ein neues Deployment.
 */
export function suchmaschinenKopfzeilen(): KopfzeilenRegel[] {
  const headers = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];
  if (!indexierungErlaubt()) return [{ source: '/:path*', headers }];
  return [{ source: '/:path*', missing: [{ type: 'host', value: OHNE_NOINDEX_HOST_MUSTER }], headers }];
}

/** Bestätigung für die Google Search Console (`GOOGLE_SITE_VERIFICATION`), falls gesetzt. */
export function googleVerifizierung(): string | undefined {
  return wert('GOOGLE_SITE_VERIFICATION');
}

/* ---------- Dateiablage -------------------------------------------------- */

export interface Dateiablage {
  /** Nur bei S3-kompatiblen Anbietern (Supabase, R2); bei AWS leer. */
  endpoint?: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Externe Ablage (S3-kompatibler, privater Bucket) für Medien, Kundendateien
 * und interne Dateien. `null`: Dateien liegen auf der eigenen Festplatte.
 * `SM24_STORAGE=lokal` erzwingt das, etwa in Tests und bei der Entwicklung.
 */
export function dateiablage(): Dateiablage | null {
  if (process.env.SM24_STORAGE === 'lokal') return null;
  const bucket = wert('STORAGE_BUCKET');
  const accessKeyId = wert('STORAGE_ACCESS_KEY');
  const secretAccessKey = wert('STORAGE_SECRET_KEY');
  if (!bucket || !accessKeyId || !secretAccessKey) return null;
  const ablage: Dateiablage = {
    region: wert('STORAGE_REGION') ?? 'auto',
    bucket,
    accessKeyId,
    secretAccessKey,
  };
  const endpoint = wert('STORAGE_ENDPOINT');
  if (endpoint) ablage.endpoint = endpoint;
  return ablage;
}

/* ---------- Server-Adresse ----------------------------------------------- */

/**
 * Adresse des Backends für Payload (`serverURL`).
 *
 * In Produktion die feste Domain. In Vorschauen und lokal bleibt sie leer:
 * Payload erzeugt dann relative Adressen und nimmt für Links in E-Mails den
 * Host der Anfrage, sofern er in der CSRF-Liste steht (geprüft an
 * `payload/dist/utilities/getRequestOrigin.js`, Standardwert `''` in
 * `payload/dist/config/defaults.js`). So zeigen Admin-Aufrufe und Bilder in
 * einer Vorschau nicht auf eine fremde Deployment-Adresse.
 */
export function serverUrl(): string {
  const gesetzt = wert('NEXT_PUBLIC_SERVER_URL');
  if (istProduktion()) {
    if (gesetzt) return ohneSchraegstrich(gesetzt);
    const vercel = wert('VERCEL_PROJECT_PRODUCTION_URL');
    return vercel ? `https://${ohneSchraegstrich(vercel)}` : '';
  }
  return gesetzt ? ohneSchraegstrich(gesetzt) : '';
}

function ohneSchraegstrich(url: string): string {
  return url.replace(/\/+$/, '');
}

/* ---------- Mailversand -------------------------------------------------- */

export interface MailKonfiguration {
  provider: 'resend';
  apiKey: string;
  fromAddress: string;
  fromName: string;
  replyTo?: string;
  /** Empfänger der Betriebsmails, aus `MAIL_TEAM_ADDRESS` (kommagetrennt). */
  teamAdressen: string[];
  /** Außerhalb der Produktion gehen alle Mails an diese Adresse (`MAIL_REDIRECT_TO`). */
  redirectTo?: string;
}

/** Vollständige Resend-Anbindung oder `null`. */
export function mailKonfiguration(): MailKonfiguration | null {
  const apiKey = wert('MAIL_API_KEY');
  const fromAddress = wert('MAIL_FROM_ADDRESS');
  if (process.env.MAIL_PROVIDER?.trim() !== 'resend' || !apiKey || !fromAddress) return null;
  const konfiguration: MailKonfiguration = {
    provider: 'resend',
    apiKey,
    fromAddress,
    fromName: wert('MAIL_FROM_NAME') ?? 'SCHLÜSSELMACHER24',
    teamAdressen: liste(process.env.MAIL_TEAM_ADDRESS),
  };
  const replyTo = wert('MAIL_REPLY_TO');
  if (replyTo) konfiguration.replyTo = replyTo;
  const redirectTo = wert('MAIL_REDIRECT_TO');
  if (redirectTo && !istProduktion()) konfiguration.redirectTo = redirectTo;
  return konfiguration;
}

/* ---------- Zahlung ------------------------------------------------------ */

export interface ZahlungKonfiguration {
  provider: 'stripe';
  apiKey: string;
  webhookSecret: string;
  /** Stripe-Zahlarten (`payment_method_types`), Standard: nur `card`. */
  zahlarten: string[];
  /** Rechnungen über Stripe erzeugen (`PAYMENT_INVOICES=1`). */
  rechnungen: boolean;
}

/** Vollständige Stripe-Anbindung oder `null`. */
export function zahlungKonfiguration(): ZahlungKonfiguration | null {
  const apiKey = wert('PAYMENT_API_KEY');
  const webhookSecret = wert('PAYMENT_WEBHOOK_SECRET');
  if (process.env.PAYMENT_PROVIDER?.trim() !== 'stripe' || !apiKey || !webhookSecret) return null;
  const zahlarten = liste(process.env.PAYMENT_METHODS);
  return {
    provider: 'stripe',
    apiKey,
    webhookSecret,
    zahlarten: zahlarten.length ? zahlarten : ['card'],
    rechnungen: process.env.PAYMENT_INVOICES?.trim() === '1',
  };
}

/**
 * Partnerauszahlung über den Zahlungsdienst (FA-KERN-04, A-049 Nr. 5). Nur mit ausdrücklichem Schalter
 * `PARTNER_AUSZAHLUNG=stripe-connect` und vollständiger Stripe-Anbindung; sonst `manuell` (das Team
 * überweist und vermerkt Datum und Beleg). Der Schalter bleibt aus, bis Anwalt, Steuerberatung und das
 * Konto beim Zahlungsdienst geklärt sind (MA-36).
 */
export function auszahlungsWeg(): 'manuell' | 'stripe-connect' {
  return process.env.PARTNER_AUSZAHLUNG?.trim() === 'stripe-connect' && zahlungKonfiguration() ? 'stripe-connect' : 'manuell';
}

/** Kommagetrennte Liste ohne leere Einträge. */
function liste(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((eintrag) => eintrag.trim())
    .filter(Boolean);
}
