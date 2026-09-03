import path from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Vitest covers lib/ only: lib/season/ and lib/storage.ts. Components and
    // routes are checked by eye, and e2e/ belongs to Playwright.
    include: ['lib/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    // Match the "@/*" path alias in tsconfig.json so lib/ code reads the same
    // in a test as it does in the app.
    alias: { '@': path.resolve(import.meta.dirname) },
  },
})
