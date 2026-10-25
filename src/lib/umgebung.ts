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

/* ---------- Suchmaschinen ------------------------------------------------ */

/**
 * Dürfen Suchmaschinen die Seiten aufnehmen? Nur in der Produktion — Vorschau-
 * Deployments und lokale Entwicklung stehen auf noindex (Erg. Leitfaden §4).
 */
export function indexierungErlaubt(): boolean {
  return istProduktion();
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

/** Kommagetrennte Liste ohne leere Einträge. */
function liste(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((eintrag) => eintrag.trim())
    .filter(Boolean);
}
