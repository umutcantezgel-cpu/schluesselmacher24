import type { PoolConfig } from 'pg';

import { getSiteUrl } from '../lib/site-url';
import { datenbankUrl, istProduktion, mitDatenbank, serverUrl } from '../lib/umgebung';

/*
 * Betriebswerte der Payload-Konfiguration: Server-Adresse, CSRF-Liste,
 * Geheimnis und Datenbank-Pool. Ohne 'server-only' — payload.config.ts und
 * die `payload run`-Skripte laden diese Datei. Werte werden bei jedem Aufruf
 * frisch gelesen (Tests setzen sie mit `vi.stubEnv`).
 */

/* ---------- Server-Adresse ----------------------------------------------- */

/**
 * `serverURL` für Payload. In Produktion fest die eigene Domain
 * (NEXT_PUBLIC_SERVER_URL, sonst VERCEL_PROJECT_PRODUCTION_URL), in
 * Vorschauen und lokal leer — geprüft am Quelltext von Payload 3.90:
 *
 * - Leer erzeugt Payload relative Adressen für Admin-Aufrufe und Dateien
 *   (`formatAdminURL`, `generateFilePathOrURL`). Eine Vorschau ruft so nie
 *   die Adresse eines anderen Deployments auf (CSP `connect-src 'self'`,
 *   Cookie nur für den eigenen Host).
 * - Links in E-Mails („Passwort vergessen“) bildet Payload dann aus dem Host
 *   der Anfrage, aber nur, wenn er in der CSRF-Liste steht, sonst bleibt der
 *   Link relativ (`getRequestOrigin`).
 * - In Produktion ist die feste Adresse die sichere Wahl: Reset-Links zeigen
 *   immer auf die echte Domain, unabhängig vom Host der Anfrage, und
 *   Skripte ohne Anfrage (`createLocalReq`) haben eine gültige Adresse.
 *   Dateiadressen werden dadurch absolut — medienBild macht daraus wieder
 *   Pfade (src/lib/data/payload-mapping.ts).
 */
export function payloadServerUrl(): string {
  return serverUrl();
}

/* ---------- CSRF --------------------------------------------------------- */

function herkunft(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const { origin } = new URL(/^https?:\/\//.test(url) ? url : `https://${url}`);
    return origin === 'null' ? undefined : origin;
  } catch {
    return undefined;
  }
}

/** Die andere Variante mit bzw. ohne „www.“ — nicht für localhost und IP-Adressen. */
function wwwVariante(origin: string): string | undefined {
  const url = new URL(origin);
  if (!url.hostname.includes('.') || /^[\d.]+$/.test(url.hostname)) return undefined;
  url.hostname = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
  return url.origin;
}

/**
 * Herkünfte, von denen Payload Anmelde-Cookies annimmt (`csrf`). Ohne Liste
 * akzeptierte Payload Cookies von jeder Herkunft. Enthalten: Server- und
 * Site-Adresse samt www-Variante, auf Vercel die Deployment- und die
 * Branch-Adresse (Vorschauen werden über beide aufgerufen), lokal
 * http://localhost.
 */
export function csrfHerkuenfte(): string[] {
  const liste = new Set<string>();
  const hinzu = (url: string | undefined) => {
    const origin = herkunft(url);
    if (origin) liste.add(origin);
  };

  hinzu(serverUrl());
  const site = herkunft(getSiteUrl());
  if (site) {
    liste.add(site);
    const www = wwwVariante(site);
    if (www) liste.add(www);
  }
  hinzu(process.env.VERCEL_URL?.trim());
  hinzu(process.env.VERCEL_BRANCH_URL?.trim());
  if (!process.env.VERCEL) hinzu(`http://localhost:${process.env.PORT?.trim() || '3000'}`);
  return [...liste];
}

/* ---------- Geheimnis ---------------------------------------------------- */

export const MELDUNG_GEHEIMNIS_FEHLT =
  'PAYLOAD_SECRET fehlt. In Produktion mit Datenbank ist ein festes Geheimnis Pflicht '
  + '(mindestens 32 zufällige Zeichen, z. B. `openssl rand -hex 32`), sonst gelten Anmeldungen '
  + 'nur bis zum nächsten Start. Bitte in Vercel unter Settings → Environment Variables (Production) setzen.';

/**
 * Geheimnis für Anmeldungen. In Produktion mit Datenbank Pflicht. Sonst
 * (z. B. erster Build ohne Datenbank, Seite aus content/*.json) ein
 * Zufallswert statt eines festen Werts, damit niemand Anmeldungen fälschen
 * kann; das Backend ist dann nicht nutzbar.
 */
export function payloadGeheimnis(): string {
  const gesetzt = process.env.PAYLOAD_SECRET?.trim();
  if (gesetzt) return gesetzt;
  if (istProduktion() && mitDatenbank()) throw new Error(MELDUNG_GEHEIMNIS_FEHLT);
  console.warn('PAYLOAD_SECRET fehlt — Backend deaktiviert, Seite läuft aus content/*.json.');
  return crypto.randomUUID() + crypto.randomUUID();
}

/* ---------- Datenbank-Pool ----------------------------------------------- */

/**
 * CA-Zertifikat der Datenbank (Supabase: „SSL certificate“) aus
 * DATABASE_CA_CERT. Vercel speichert Zeilenumbrüche oft als „\n“.
 */
export function datenbankZertifikat(): string | undefined {
  const pem = process.env.DATABASE_CA_CERT?.trim();
  if (!pem) return undefined;
  return pem.includes('\\n') ? pem.replace(/\\n/g, '\n') : pem;
}

/** Parameter der Verbindungsadresse, die `pg` in die SSL-Einstellung übersetzt. */
const SSL_PARAMETER = ['sslmode', 'ssl', 'sslrootcert', 'sslcert', 'sslkey', 'sslpassword', 'uselibpqcompat'];

/**
 * Entfernt die SSL-Angaben aus der Verbindungsadresse. Nötig, sobald ein
 * eigenes `ssl`-Objekt (mit CA) übergeben wird: `pg` liest die Adresse nach
 * der Konfiguration und überschriebe es sonst (pg/lib/connection-parameters.js,
 * `Object.assign({}, config, parse(connectionString))`).
 */
export function ohneSslParameter(url: string): string {
  try {
    const adresse = new URL(url);
    for (const name of SSL_PARAMETER) adresse.searchParams.delete(name);
    return adresse.toString();
  } catch {
    return url;
  }
}

/**
 * Pool für den Postgres-Adapter. Auf Vercel klein (viele kurzlebige
 * Instanzen teilen sich den Pooler von Supabase), mit festen Zeitgrenzen,
 * damit eine hängende Verbindung keine Funktion bis zum Timeout blockiert.
 * Mit DATABASE_CA_CERT prüft `pg` das Zertifikat der Datenbank gegen diese CA.
 */
export function poolKonfiguration(): PoolConfig {
  const url = datenbankUrl();
  const ca = datenbankZertifikat();
  const pool: PoolConfig = {
    connectionString: url && ca ? ohneSslParameter(url) : url,
    max: process.env.VERCEL ? 5 : 10,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  };
  if (ca) pool.ssl = { ca, rejectUnauthorized: true };
  return pool;
}
