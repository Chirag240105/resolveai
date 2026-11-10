import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'apps/api/src/**/*.test.ts'],
    testTimeout: 10000,
  },
});

