#!/usr/bin/env node
/**
 * Lokale Postgres-Datenbank für Entwicklung, Build und Tests.
 *
 * Nutzt die echten PostgreSQL-17-Binärdateien aus dem npm-Paket
 * `embedded-postgres` — ohne Docker oder Homebrew. Der Server lauscht nur auf
 * localhost. In Produktion wird stattdessen `DATABASE_URL` (Supabase) gesetzt;
 * dieses Skript ist dann nicht beteiligt.
 *
 *   node scripts/db.mjs start | stop | status | ensure | reset
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const root = process.cwd();

const DATA_DIR = path.resolve(root, process.env.SM24_PG_DIR ?? '.data/postgres');
const LOG_FILE = `${DATA_DIR}.log`;
const PORT = Number(process.env.SM24_PG_PORT ?? 5433);
const USER = 'postgres';
const PASSWORD = process.env.SM24_PG_PASSWORD ?? 'postgres';
const DATABASE = process.env.SM24_PG_DATABASE ?? 'schluesselmacher24';

function binDir() {
  // Das Plattformpaket exportiert kein package.json; der Ordner liegt aber fest
  // unter node_modules.
  const dir = path.join(root, 'node_modules', '@embedded-postgres', `${os.platform()}-${os.arch()}`, 'native', 'bin');
  if (!existsSync(dir)) {
    throw new Error(`Postgres-Binärdateien fehlen (${dir}). Bitte "npm install" ausführen.`);
  }
  return dir;
}

// Erst bei Bedarf auflösen: mit externer Datenbank werden keine Binärdateien gebraucht.
const bin = (name) => path.join(binDir(), name);

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { encoding: 'utf8', ...options });
  return { code: result.status ?? 1, out: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function isRunning() {
  if (!existsSync(path.join(DATA_DIR, 'PG_VERSION'))) return false;
  return run(bin('pg_ctl'), ['-D', DATA_DIR, 'status']).code === 0;
}

function initialise() {
  mkdirSync(path.dirname(DATA_DIR), { recursive: true });
  const pwFile = path.join(os.tmpdir(), `sm24-pg-${process.pid}.pw`);
  writeFileSync(pwFile, PASSWORD, { mode: 0o600 });
  const init = run(bin('initdb'), [
    '-D', DATA_DIR,
    '-U', USER,
    '--pwfile', pwFile,
    '--auth=scram-sha-256',
    '--encoding=UTF8',
    '--no-locale',
  ]);
  rmSync(pwFile, { force: true });
  if (init.code !== 0) throw new Error(`initdb fehlgeschlagen:\n${init.out}`);
}

async function ensureDatabase() {
  const { Client } = require('pg');
  const client = new Client({ host: '127.0.0.1', port: PORT, user: USER, password: PASSWORD, database: 'postgres' });
  await client.connect();
  const found = await client.query('select 1 from pg_database where datname = $1', [DATABASE]);
  if (found.rowCount === 0) await client.query(`create database "${DATABASE}"`);
  await client.end();
}

async function start() {
  if (!existsSync(path.join(DATA_DIR, 'PG_VERSION'))) initialise();
  if (!isRunning()) {
    // Nur TCP auf localhost; Unix-Sockets aus, damit keine Pfadlängen-Probleme entstehen.
    const started = run(bin('pg_ctl'), [
      '-D', DATA_DIR,
      '-l', LOG_FILE,
      '-w',
      '-o', `-p ${PORT} -c listen_addresses=127.0.0.1 -c unix_socket_directories=`,
      'start',
    ]);
    if (started.code !== 0) throw new Error(`Start fehlgeschlagen:\n${started.out}`);
  }
  await ensureDatabase();
  console.log(`Postgres läuft: postgres://${USER}:***@127.0.0.1:${PORT}/${DATABASE}`);
}

function stop() {
  if (!isRunning()) {
    console.log('Postgres läuft nicht.');
    return;
  }
  const stopped = run(bin('pg_ctl'), ['-D', DATA_DIR, '-m', 'fast', '-w', 'stop']);
  if (stopped.code !== 0) throw new Error(`Stopp fehlgeschlagen:\n${stopped.out}`);
  console.log('Postgres gestoppt.');
}

/** Zeigt DATABASE_URL auf einen anderen Server (z. B. Supabase), bleibt das lokale Postgres aus. */
function usesExternalDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    const { hostname, port } = new URL(url);
    const local = ['127.0.0.1', 'localhost', '::1'].includes(hostname);
    return !(local && Number(port || 5432) === PORT);
  } catch {
    return false;
  }
}

const command = process.argv[2] ?? 'status';

try {
  if (command === 'ensure' && usesExternalDatabase()) {
    console.log('Externe Datenbank (DATABASE_URL) — lokales Postgres wird nicht gestartet.');
  } else if (command === 'start' || command === 'ensure') await start();
  else if (command === 'stop') stop();
  else if (command === 'status') console.log(isRunning() ? `läuft (Port ${PORT})` : 'gestoppt');
  else if (command === 'reset') {
    stop();
    rmSync(DATA_DIR, { recursive: true, force: true });
    await start();
  } else {
    console.error(`Unbekannter Befehl: ${command}`);
    process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
