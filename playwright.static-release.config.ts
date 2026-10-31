import { defineConfig } from '@playwright/test';
if (!process.env.PREVIEW_DIRECTORY) throw new Error('Set PREVIEW_DIRECTORY to the isolated iteration-three static dist.');
export default defineConfig({
  testDir:'./tests/static-release',testMatch:'all-seasons.spec.ts',fullyParallel:false,workers:1,timeout:180_000,
  expect:{timeout:10_000},reporter:[['list']],outputDir:'test-results/static-release',
  use:{baseURL:'http://127.0.0.1:3104',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
  webServer:{command:'node scripts/static-preview.mjs',url:'http://127.0.0.1:3104',reuseExistingServer:false,env:{PORT:'3104',PREVIEW_DIRECTORY:process.env.PREVIEW_DIRECTORY}},
});
