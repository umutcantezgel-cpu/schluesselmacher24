import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Eigene Postgres-Instanz für die Datenbanktests: anderer Port, frisches
 * Datenverzeichnis, Migrationen und Seed wie im Build. Die Entwicklungsdaten
 * bleiben unberührt.
 */
// Eigener Port je paralleler Testlauf möglich (z. B. in Worktrees): SM24_TEST_PG_PORT.
const PORT = process.env.SM24_TEST_PG_PORT ?? '5434';
const DIR = path.join(os.tmpdir(), `sm24-test-pg-${process.pid}`);

function run(args: string[], env: NodeJS.ProcessEnv) {
  const result = spawnSync(args[0], args.slice(1), { env, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    throw new Error(`${args.join(' ')} fehlgeschlagen:\n${result.stdout}\n${result.stderr}`);
  }
}

export default function setup() {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    SM24_PG_PORT: PORT,
    SM24_PG_DIR: DIR,
    SM24_PG_DATABASE: 'sm24_test',
    DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${PORT}/sm24_test`,
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'nur-fuer-tests-0123456789abcdef',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3000',
  };
  run(['node', 'scripts/db.mjs', 'start'], env);
  run(['npx', 'payload', 'migrate'], env);
  run(['npx', 'payload', 'run', 'src/scripts/seed.ts'], env);

  for (const key of ['DATABASE_URL', 'PAYLOAD_SECRET', 'NEXT_PUBLIC_SERVER_URL'] as const) {
    process.env[key] = env[key];
  }

  return () => {
    spawnSync('node', ['scripts/db.mjs', 'stop'], { env, stdio: 'ignore' });
    rmSync(DIR, { recursive: true, force: true });
    rmSync(`${DIR}.log`, { force: true });
  };
}
