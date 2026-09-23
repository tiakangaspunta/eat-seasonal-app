import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://localhost:3000'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  // The flows run against `next dev`, four browsers at once, and a navigation
  // there can take longer than the default 5 seconds while the server is also
  // serving full-size photos. These are wiring checks, not speed checks, so the
  // wait is longer; a real hang still fails, just 10 seconds later.
  expect: { timeout: 15_000 },
  use: { baseURL },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
})
