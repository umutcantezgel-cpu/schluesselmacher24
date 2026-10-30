#!/usr/bin/env node
/**
 * Datenbankrechte nach docs/SUPABASE.md: anwenden (nur lokal und in CI) und
 * prüfen (Build, CI, von Hand).
 *
 *   node scripts/supabase-rechte.mjs pruefen
 *   node scripts/supabase-rechte.mjs anwenden [--nachbildung]
 *
 * pruefen   Führt supabase/pruefungen/rechte.sql aus und listet die Befunde.
 *           Im Produktions-Build läuft das als Laufzeitrolle sm24_app direkt
 *           nach den Migrationen (scripts/build.mjs). Exit 0 = keine Befunde,
 *           1 = Befunde, 2 = technischer Fehler (z. B. keine Verbindung).
 * anwenden  Spielt supabase/sql/*.sql der Reihe nach ein, mit --nachbildung
 *           vorher supabase/nachbildung.sql (Supabase-Rollen nachgebildet).
 *           Nur für lokale Datenbanken (DB-Tests, Probe-Wiederherstellung).
 *           Bei Supabase wendet Claude die Dateien per MCP `apply_migration` an.
 *
 * Verbindung: SUPABASE_RECHTE_URL, sonst DATABASE_URL bzw. POSTGRES_URL.
 * TLS wie in src/payload/betrieb.ts: Mit DATABASE_CA_CERT prüft `pg` das
 * Zertifikat (verify-full); die SSL-Angaben der Adresse werden dann entfernt,
 * weil `pg` sie sonst über das eigene `ssl`-Objekt legt.
 *
 * Bewusst reines Node-ESM ohne TypeScript-Importe wie scripts/build.mjs.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SQL_ORDNER = path.join(WURZEL, 'supabase', 'sql');
const NACHBILDUNG = path.join(WURZEL, 'supabase', 'nachbildung.sql');
const PRUEFUNG = path.join(WURZEL, 'supabase', 'pruefungen', 'rechte.sql');

/** Parameter der Verbindungsadresse, die `pg` in die SSL-Einstellung übersetzt. */
const SSL_PARAMETER = ['sslmode', 'ssl', 'sslrootcert', 'sslcert', 'sslkey', 'sslpassword', 'uselibpqcompat'];

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
export function verbindungsUrl(env) {
  return wert(env, 'SUPABASE_RECHTE_URL') ?? wert(env, 'DATABASE_URL') ?? wert(env, 'POSTGRES_URL');
}

/**
 * Verbindungsoptionen für `pg` mit derselben TLS-Regel wie src/payload/betrieb.ts.
 * @param {string} url
 * @param {Umgebung} env
 */
export function verbindungsOptionen(url, env) {
  const pem = wert(env, 'DATABASE_CA_CERT');
  if (!pem) return { connectionString: url };
  const ca = pem.includes('\\n') ? pem.replace(/\\n/g, '\n') : pem;
  const adresse = new URL(url);
  for (const name of SSL_PARAMETER) adresse.searchParams.delete(name);
  return { connectionString: adresse.toString(), ssl: { ca, rejectUnauthorized: true } };
}

/**
 * Supabase bekommt die Dateien nur über das MCP (versioniert in
 * supabase_migrations.schema_migrations), nie über dieses Skript.
 * @param {string} url
 */
export function istSupabase(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.endsWith('.supabase.com') || hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

/** Die SQL-Dateien in der Reihenfolge ihrer Nummern. */
export function sqlDateien(ordner = SQL_ORDNER) {
  return readdirSync(ordner)
    .filter((name) => /^\d{4}_[a-z0-9_]+\.sql$/.test(name))
    .sort()
    .map((name) => path.join(ordner, name));
}

/**
 * Befunde als Textzeilen, gleich lange Spalte für die Art.
 * @param {{ art: string, objekt: string }[]} befunde
 */
export function befundeFormatieren(befunde) {
  const breite = Math.max(0, ...befunde.map((befund) => befund.art.length));
  return befunde.map((befund) => `  ${befund.art.padEnd(breite)}  ${befund.objekt}`);
}

/**
 * @param {string} url
 * @param {Umgebung} env
 */
async function verbinden(url, env) {
  const { Client } = require('pg');
  const client = new Client({ ...verbindungsOptionen(url, env), connectionTimeoutMillis: 15_000 });
  await client.connect();
  return client;
}

/**
 * @param {string} url
 * @param {Umgebung} env
 * @returns {Promise<{ art: string, objekt: string }[]>}
 */
export async function pruefen(url, env) {
  const client = await verbinden(url, env);
  try {
    const { rows } = await client.query(readFileSync(PRUEFUNG, 'utf8'));
    return rows;
  } finally {
    await client.end();
  }
}

/**
 * @param {string} url
 * @param {Umgebung} env
 * @param {{ nachbildung?: boolean }} [optionen]
 */
export async function anwenden(url, env, { nachbildung = false } = {}) {
  if (istSupabase(url)) {
    throw new Error('Bei Supabase werden die Dateien per MCP apply_migration angewendet, nicht mit diesem Skript.');
  }
  const dateien = [...(nachbildung ? [NACHBILDUNG] : []), ...sqlDateien()];
  const client = await verbinden(url, env);
  try {
    for (const datei of dateien) {
      await client.query(readFileSync(datei, 'utf8'));
      console.log(`✓ ${path.relative(WURZEL, datei)}`);
    }
  } finally {
    await client.end();
  }
}

async function main() {
  const env = /** @type {Umgebung} */ (process.env);
  const [befehl, ...optionen] = process.argv.slice(2);
  const url = verbindungsUrl(env);
  if (!url) {
    console.error('Keine Datenbank: SUPABASE_RECHTE_URL oder DATABASE_URL setzen.');
    process.exit(2);
  }

  if (befehl === 'anwenden') {
    try {
      await anwenden(url, env, { nachbildung: optionen.includes('--nachbildung') });
    } catch (error) {
      console.error(`Datenbankrechte nicht angewendet: ${error instanceof Error ? error.message : error}`);
      process.exit(2);
    }
    return;
  }

  if (befehl === 'pruefen') {
    let befunde;
    try {
      befunde = await pruefen(url, env);
    } catch (error) {
      console.error(`Datenbankrechte nicht geprüft: ${error instanceof Error ? error.message : error}`);
      process.exit(2);
    }
    if (befunde.length === 0) {
      console.log('Datenbankrechte: keine Befunde.');
      return;
    }
    console.error(`Datenbankrechte: ${befunde.length} Befund(e) (supabase/pruefungen/rechte.sql):`);
    for (const zeile of befundeFormatieren(befunde)) console.error(zeile);
    process.exit(1);
  }

  console.error('Aufruf: node scripts/supabase-rechte.mjs pruefen | anwenden [--nachbildung]');
  process.exit(2);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
