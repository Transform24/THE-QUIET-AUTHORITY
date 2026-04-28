const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3333',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npx serve . --listen 3333 --single',
    url: 'http://localhost:3333',
    reuseExistingServer: !process.env.CI,
    timeout: 15000,
  },
});
