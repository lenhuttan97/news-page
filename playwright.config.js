import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 30000,
  },
  use: {
    headless: true,
  },
})