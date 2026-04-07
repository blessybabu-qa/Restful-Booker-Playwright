import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') }); // Load environment variables from .env file

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
      name: 'setup',
      testMatch: /api-ping\.spec\.ts/,
      use: { baseURL: process.env.API_URL },
    },
    {
      name: 'api-tests',
      testMatch: /tests\/api\/.*\.spec\.ts/,
      dependencies: ['setup'],
      use: { baseURL: process.env.API_URL },
    },
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
  ],
});