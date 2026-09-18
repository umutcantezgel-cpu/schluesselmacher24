import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.spec.ts'],
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
});
