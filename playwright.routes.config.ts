import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'route-loading.spec.ts',
  workers: 1,
  reporter: 'list',
  use: {
    browserName: 'chromium',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    },
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:5000',
      reuseExistingServer: true,
    },
    {
      command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 5001',
      url: 'http://127.0.0.1:5001',
      timeout: 120_000,
    },
  ],
});
