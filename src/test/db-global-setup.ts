import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { Client } from 'pg';

import { alterRole, scramVerifier } from '../../scripts/scram-verifier.mjs';

/**
 * Eigene Postgres-Instanz für die Datenbanktests: anderer Port, frisches
 * Datenverzeichnis, Rechte und Rollen wie bei Supabase (supabase/), danach
 * Migrationen als Eigentümer sm24_migration und Seed sowie alle Tests als
 * Laufzeitrolle sm24_app – fehlt der App ein Recht, fällt das hier auf und
 * nicht erst in Produktion. Die Entwicklungsdaten bleiben unberührt.
 */
// Eigener Port je paralleler Testlauf möglich (z. B. in Worktrees): SM24_TEST_PG_PORT.
const PORT = process.env.SM24_TEST_PG_PORT ?? '5434';
const DIR = path.join(os.tmpdir(), `sm24-test-pg-${process.pid}`);
const ROLLEN = ['sm24_migration', 'sm24_app', 'sm24_sicherung'] as const;

/** Nur für die lokale Testdatenbank. */
function testPasswort(rolle: (typeof ROLLEN)[number]): string {
  return `test-${rolle}-nur-lokal`;
}

function adresse(benutzer: string, passwort: string): string {
  return `postgres://${benutzer}:${passwort}@127.0.0.1:${PORT}/sm24_test`;
}

function run(args: string[], env: NodeJS.ProcessEnv) {
  const result = spawnSync(args[0], args.slice(1), { env, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`${args.join(' ')} fehlgeschlagen:\n${result.stdout}\n${result.stderr}`);
  }
}

export default async function setup() {
  const superuser = adresse('postgres', 'postgres');
  const app = adresse('sm24_app', testPasswort('sm24_app'));
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    SM24_PG_PORT: PORT,
    SM24_PG_DIR: DIR,
    SM24_PG_DATABASE: 'sm24_test',
    DATABASE_URL: superuser,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'nur-fuer-tests-0123456789abcdef',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
    // Dateien immer lokal — auch wenn in der Shell Zugangsdaten für den Bucket stehen.
    SM24_STORAGE: 'lokal',
  };
  run(['node', 'scripts/db.mjs', 'start'], env);
  run(['node', 'scripts/supabase-rechte.mjs', 'anwenden', '--nachbildung'], { ...env, SUPABASE_RECHTE_URL: superuser });

  // Passwörter als SCRAM-Verifier wie beim Inhaber – prüft das Werkzeug gleich mit.
  const client = new Client({ connectionString: superuser });
  await client.connect();
  for (const rolle of ROLLEN) await client.query(alterRole(rolle, scramVerifier(testPasswort(rolle))));
  await client.end();

  run(['npx', 'payload', 'migrate'], { ...env, DATABASE_URL: adresse('sm24_migration', testPasswort('sm24_migration')) });
  run(['npx', 'payload', 'run', 'src/scripts/seed.ts'], { ...env, DATABASE_URL: app });

  for (const key of ['PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL', 'SM24_STORAGE'] as const) {
    process.env[key] = env[key];
  }
  process.env.DATABASE_URL = app;
  // Nur für Tests, die Rechte gezielt prüfen (src/test/rollen.db.test.ts).
  process.env.SM24_TEST_DATABASE_URL_SUPERUSER = superuser;
  process.env.SM24_TEST_DATABASE_URL_SICHERUNG = adresse('sm24_sicherung', testPasswort('sm24_sicherung'));

  return () => {
    spawnSync('node', ['scripts/db.mjs', 'stop'], { env, stdio: 'ignore' });
    rmSync(DIR, { recursive: true, force: true });
    rmSync(`${DIR}.log`, { force: true });
  };
}
