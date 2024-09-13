import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./test/fixtures/fixtures.cjs'],
    coverage: {
      // TODO: find a way to track coverage in ./bin
      include: ['lib/*.ts'],
    },
  },
});
