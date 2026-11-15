import { configDefaults, defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    exclude: [...configDefaults.exclude, '.claude/**', '_werkstatt/**', 'src/**/*.db.test.ts'],
    // Keine echten Mails, Zahlungen oder Bucket-Zugriffe aus Tests.
    setupFiles: ['src/test/setup-umgebung.ts'],
    // Musterdaten (Beispiel-Codelinien und -Artikel) sind nur in Tests sichtbar (A-046, src/lib/beispiele.ts).
    env: { SM24_BEISPIELE: '1' },
  },
  resolve: {
    alias: {
      '@payload-config': path.resolve(dirname, './src/payload.config.ts'),
      'server-only': path.resolve(dirname, './src/test/server-only-stub.ts'),
      '@': path.resolve(dirname, './src'),
    },
  },
});
