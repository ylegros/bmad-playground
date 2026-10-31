import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/audits', timeout: 45_000, workers: 2,
  outputDir: '.site-artifacts/iteration-three/audit-browser',
  expect: { timeout: 8_000 }, reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3002', headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'node app/server/index.ts', env: {PORT:'3002'}, url: 'http://127.0.0.1:3002/api/v1/seasons', reuseExistingServer: false },
});
