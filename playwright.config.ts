import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') }); 

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html'], 
    ['allure-playwright']
    ],             

  use: {
    baseURL: process.env.BASE_URL ,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    
    {
      name: 'ui-chromium',
      testMatch: /tests\/UI\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL,
        launchOptions: { args: ['--start-maximized'] 
          },
      },
    },
    {
      name: 'ui-firefox',
      testMatch: /tests\/UI\/.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        baseURL: process.env.BASE_URL,
  },
},
    {
      name: 'ui-webkit',
      testMatch: /tests\/UI\/.*\.spec\.ts/,
      use: { ...devices['Desktop Safari'],
         baseURL: process.env.BASE_URL
       },
    },

    {
      name: 'setup',
      testMatch: /api-ping\.spec\.ts/,
      dependencies: ['ui-chromium', 'ui-firefox', 'ui-webkit'],
      use: { baseURL: process.env.API_URL },
    },
    {
      name: 'api-tests',
      testMatch: /tests\/api\/(?!api-ping).*\.spec\.ts/,
      dependencies: ['setup'],
      use: { baseURL: process.env.API_URL },
    },
  ],
});