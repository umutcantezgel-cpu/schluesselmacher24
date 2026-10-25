#!/usr/bin/env node
/**
 * Produktionsbuild (`npm run build`, auch auf Vercel).
 *
 * 1. Pflichtprüfungen: Ein Produktions-Build (VERCEL_ENV=production) bricht
 *    ab ohne Datenbank, PAYLOAD_SECRET oder NEXT_PUBLIC_SITE_URL und ohne
 *    verschlüsselte Datenbankverbindung (DATABASE_CA_CERT oder sslmode). Fehlende
 *    Anbindungen (Cron, Dateiablage, Mail, Zahlung) ergeben Warnungen.
 * 2. Mit Datenbank — lokal und in Produktion, in Vorschauen nur mit
 *    SM24_PREVIEW_MIGRATE=1:
 *    - lokales Postgres starten, falls keine externe Datenbank gesetzt ist
 *      (scripts/db.mjs ensure),
 *    - Migrationen über die direkte Verbindung (DATABASE_URL_UNPOOLED bzw.
 *      POSTGRES_URL_NON_POOLING, sonst DATABASE_URL),
 *    - Seed (jede Sammlung nur einmal),
 *    - ersten Inhaber-Zugang anlegen (in Produktion Pflicht),
 *    - Livegang-Prüfung (in Produktion Pflicht, sonst nur Warnung).
 *    Vorschauen überspringen das: Sie sollen nie das Schema einer geteilten
 *    Datenbank ändern.
 * 3. `next build`. Ohne Datenbank liest die Seite content/*.json.
 *
 * Bewusst reines Node-ESM ohne TypeScript-Importe: Die Prüfungen hier sind
 * eigenständig (gleiche Regeln wie src/lib/umgebung.ts). Jeder Fehler endet
 * mit einem Exit-Code ungleich 0.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/** @typedef {Record<string, string | undefined>} Umgebung */

/**
 * @param {Umgebung} env
 * @param {string} name
 */
function wert(env, name) {
  const text = env[name]?.trim();
  return text ? text : undefined;
}

/** @param {Umgebung} env */
export function datenbankUrl(env) {
  return wert(env, 'DATABASE_URL') ?? wert(env, 'POSTGRES_URL');
}

/** @param {Umgebung} env */
export function datenbankUrlDirekt(env) {
  return wert(env, 'DATABASE_URL_UNPOOLED') ?? wert(env, 'POSTGRES_URL_NON_POOLING') ?? datenbankUrl(env);
}

/** @param {Umgebung} env */
export function mitDatenbank(env) {
  return env.SM24_DATA !== 'json' && Boolean(datenbankUrl(env));
}

/** @param {Umgebung} env */
export function istProduktionsBuild(env) {
  return env.VERCEL_ENV === 'production';
}

/** sslmode-Werte, mit denen `pg` ohne eigenes Zertifikat verschlüsselt verbindet. */
const SSL_MODI = ['require', 'verify-ca', 'verify-full'];

/** @param {string | undefined} url */
function mitSslmode(url) {
  try {
    return SSL_MODI.includes(new URL(url ?? '').searchParams.get('sslmode') ?? '');
  } catch {
    return false;
  }
}

/** Anbindungen, die in Produktion fehlen dürfen, aber gemeldet werden. */
const ANBINDUNGEN = [
  { namen: ['CRON_SECRET'], folge: 'Die täglichen Crons werden abgewiesen (Löschfristen, Zahlungsabgleich).' },
  {
    namen: ['STORAGE_BUCKET', 'STORAGE_ACCESS_KEY', 'STORAGE_SECRET_KEY'],
    folge: 'Keine Dateiablage: Kunden können keine Fotos hochladen, Medien lassen sich nicht speichern.',
  },
  { namen: ['MAIL_PROVIDER', 'MAIL_API_KEY', 'MAIL_FROM_ADDRESS'], folge: 'Keine E-Mails an Kunden und Betrieb.' },
  {
    namen: ['PAYMENT_PROVIDER', 'PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET'],
    folge: 'Keine Online-Zahlung: Vorgänge bleiben „offen“ und werden von Hand verbucht.',
  },
];

/**
 * Prüft die Umgebung vor dem Build.
 * @param {Umgebung} env
 * @returns {{ fehler: string[], warnungen: string[] }}
 */
export function pruefeUmgebung(env) {
  /** @type {string[]} */
  const fehler = [];
  /** @type {string[]} */
  const warnungen = [];
  if (!istProduktionsBuild(env)) return { fehler, warnungen };

  if (!datenbankUrl(env)) fehler.push('DATABASE_URL (oder POSTGRES_URL) fehlt — ohne Datenbank kein Backend, keine Vorgänge.');
  else if (env.SM24_DATA === 'json') fehler.push('SM24_DATA=json ist in Produktion nicht erlaubt (Seite liefe ohne Datenbank).');
  // Ohne CA setzt src/payload/betrieb.ts kein `ssl`; ohne sslmode verbände `pg` im Klartext
  // (Laufzeit über DATABASE_URL, Migrationen über die direkte Verbindung).
  else if (!wert(env, 'DATABASE_CA_CERT') && !(mitSslmode(datenbankUrl(env)) && mitSslmode(datenbankUrlDirekt(env)))) {
    fehler.push(
      'Datenbankverbindung wäre unverschlüsselt: DATABASE_CA_CERT setzen (Supabase → Database → Settings → SSL Configuration → '
        + 'Download certificate) oder sslmode in der URL angeben.',
    );
  }
  const geheimnis = wert(env, 'PAYLOAD_SECRET');
  if (!geheimnis) fehler.push('PAYLOAD_SECRET fehlt (mindestens 32 zufällige Zeichen, z. B. `openssl rand -hex 32`).');
  else if (geheimnis.length < 32) warnungen.push('PAYLOAD_SECRET ist kürzer als 32 Zeichen.');
  if (!wert(env, 'NEXT_PUBLIC_SITE_URL')) fehler.push('NEXT_PUBLIC_SITE_URL fehlt (z. B. https://schluesselmacher24.de).');

  for (const { namen, folge } of ANBINDUNGEN) {
    const fehlend = namen.filter((name) => !wert(env, name));
    if (fehlend.length) warnungen.push(`${fehlend.join(', ')} fehlt. ${folge}`);
  }
  return { fehler, warnungen };
}

/**
 * @typedef {object} Schritt
 * @property {string} name
 * @property {string[]} befehl Programm und Argumente
 * @property {Umgebung} [env] zusätzliche Variablen
 * @property {boolean} [nurWarnung] Fehlschlag bricht den Build nicht ab
 */

/**
 * Die Schritte des Builds in ihrer Reihenfolge.
 * @param {Umgebung} env
 * @param {{ node?: string, wurzel?: string }} [optionen]
 * @returns {{ schritte: Schritt[], hinweise: string[] }}
 */
export function planeBuild(env, { node = process.execPath, wurzel = process.cwd() } = {}) {
  const payload = (/** @type {string[]} */ ...args) => [node, path.join(wurzel, 'node_modules/payload/bin.js'), ...args];
  const produktion = istProduktionsBuild(env);
  /** @type {Schritt[]} */
  const schritte = [];
  /** @type {string[]} */
  const hinweise = [];

  if (!mitDatenbank(env)) {
    hinweise.push('Keine Datenbank: Build ohne Datenbank, Inhalte aus content/*.json.');
  } else if (env.VERCEL && !produktion && env.SM24_PREVIEW_MIGRATE !== '1') {
    hinweise.push('Vorschau: Migration, Seed und Zugangsanlage übersprungen (SM24_PREVIEW_MIGRATE=1 schaltet sie ein).');
  } else {
    const url = /** @type {string} */ (datenbankUrl(env));
    if (!env.VERCEL) {
      // db.mjs startet nur ohne externe Datenbank ein lokales Postgres.
      schritte.push({ name: 'Datenbank bereitstellen', befehl: [node, path.join(wurzel, 'scripts/db.mjs'), 'ensure'], env: { DATABASE_URL: url } });
    }
    // DDL über die direkte Verbindung, nicht über den Pooler.
    schritte.push({ name: 'Migrationen', befehl: payload('migrate'), env: { DATABASE_URL: datenbankUrlDirekt(env) } });
    schritte.push({ name: 'Seed', befehl: payload('run', 'src/scripts/seed.ts'), env: { DATABASE_URL: url } });
    schritte.push({
      name: 'Erster Backend-Zugang',
      befehl: payload('run', 'src/scripts/admin-anlegen.ts'),
      env: { DATABASE_URL: url, SM24_ADMIN_PFLICHT: produktion ? '1' : '' },
    });
    schritte.push({
      name: 'Livegang-Prüfung',
      befehl: payload('run', 'src/scripts/livegang-pruefen.ts'),
      env: { DATABASE_URL: url },
      nurWarnung: !produktion,
    });
  }

  schritte.push({ name: 'Next.js-Build', befehl: [node, path.join(wurzel, 'node_modules/next/dist/bin/next'), 'build'] });
  return { schritte, hinweise };
}

/** Lädt .env-Dateien wie `next build` und die Payload-CLI (nur lokal relevant). */
async function umgebungLaden() {
  try {
    const { default: nextEnv } = await import('@next/env');
    nextEnv.loadEnvConfig(process.cwd(), false, { info: () => {}, error: console.error });
  } catch {
    // Ohne @next/env gelten nur die Variablen der Shell.
  }
}

async function main() {
  await umgebungLaden();
  const env = /** @type {Umgebung} */ (process.env);

  const { fehler, warnungen } = pruefeUmgebung(env);
  for (const warnung of warnungen) console.warn(`⚠ ${warnung}`);
  if (fehler.length) {
    console.error('Produktions-Build abgebrochen:');
    for (const eintrag of fehler) console.error(`  ✗ ${eintrag}`);
    console.error('Variablen in Vercel unter Settings → Environment Variables (Production) setzen.');
    process.exit(1);
  }

  const { schritte, hinweise } = planeBuild(env);
  for (const hinweis of hinweise) console.log(hinweis);
  for (const schritt of schritte) {
    console.log(`\n▶ ${schritt.name}`);
    const [programm, ...args] = schritt.befehl;
    const ergebnis = spawnSync(programm, args, { stdio: 'inherit', env: { ...process.env, ...schritt.env } });
    const code = ergebnis.status ?? 1;
    if (code === 0) continue;
    if (schritt.nurWarnung) {
      console.warn(`⚠ ${schritt.name} meldet Befunde (Exit ${code}) — außerhalb der Produktion nur eine Warnung.`);
      continue;
    }
    console.error(`✗ ${schritt.name} fehlgeschlagen (Exit ${code}).`);
    process.exit(code);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
