import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['hosted.spec.ts', '**/audits/**', '**/static-release/**'],
  fullyParallel: true,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3001', headless: true, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node app/server/index.ts', url: 'http://127.0.0.1:3001/api/v1/seasons', reuseExistingServer: true },
});
