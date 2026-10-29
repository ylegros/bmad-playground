import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: 'hosted.spec.ts', timeout: 30_000,
  expect: { timeout: 7_000 }, reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3103', headless: true, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node scripts/static-preview.mjs', url: 'http://127.0.0.1:3103', reuseExistingServer: true },
});
