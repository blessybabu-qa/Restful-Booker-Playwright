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
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL ,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});