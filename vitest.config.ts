import { configDefaults, defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, './src/payload.config.ts'),
      'server-only': path.resolve(dirname, './src/test/server-only-stub.ts'),
      '@': path.resolve(dirname, './src'),
    },
  },
});
