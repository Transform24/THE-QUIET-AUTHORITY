import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';

const LOCAL_CHROMIUM = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    screenshot: 'only-on-failure',
    ...(existsSync(LOCAL_CHROMIUM) ? { launchOptions: { executablePath: LOCAL_CHROMIUM } } : {}),
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
    },
  ],
  outputDir: 'test-results/',
});
