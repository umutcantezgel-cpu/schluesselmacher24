import { configDefaults, defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: [...configDefaults.exclude, '.claude/**', 'src/**/*.db.test.ts'],
    // Keine echten Mails, Zahlungen oder Bucket-Zugriffe aus Tests.
    setupFiles: ['src/test/setup-umgebung.ts'],
  },
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, './src/payload.config.ts'),
      'server-only': path.resolve(dirname, './src/test/server-only-stub.ts'),
      '@': path.resolve(dirname, './src'),
    },
  },
});
