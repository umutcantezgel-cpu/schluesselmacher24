import { defineConfig } from 'vitest/config';

import base from './vitest.config';

/** Tests gegen eine echte, frisch aufgesetzte Postgres-Datenbank (`*.db.test.ts`). */
export default defineConfig({
  resolve: base.resolve,
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.db.test.ts'],
    exclude: ['node_modules/**', '.claude/**'],
    globalSetup: ['src/test/db-global-setup.ts'],
    testTimeout: 30_000,
    hookTimeout: 120_000,
    fileParallelism: false,
    pool: 'forks',
  },
});
