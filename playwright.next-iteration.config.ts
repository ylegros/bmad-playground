import {defineConfig} from '@playwright/test';

export default defineConfig({
 testDir:'./tests/next-iteration',fullyParallel:false,workers:1,timeout:60_000,
 expect:{timeout:10_000},reporter:[['list']],outputDir:'test-results/next-iteration',
 use:{baseURL:'http://127.0.0.1:3105',headless:true,trace:'retain-on-failure',screenshot:'only-on-failure'},
 webServer:{command:'node app/server/index.ts',url:'http://127.0.0.1:3105/api/v1/seasons',reuseExistingServer:false,env:{PORT:'3105'}},
});
