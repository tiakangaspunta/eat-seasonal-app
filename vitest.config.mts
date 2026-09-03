import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Vitest covers lib/ only: lib/season/ and lib/storage.ts. Components and
    // routes are checked by eye, and e2e/ belongs to Playwright.
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
})
