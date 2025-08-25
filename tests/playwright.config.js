import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './automated',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: './reports/playwright-report' }],
    ['json', { outputFile: './reports/playwright-results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 2560, height: 1440 }
      },
    },

    // Mobile devices
    {
      name: 'mobile-chrome-small',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 320, height: 568 }
      },
    },
    {
      name: 'mobile-chrome-medium',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 }
      },
    },
    {
      name: 'mobile-chrome-large',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 414, height: 896 }
      },
    },

    // Tablets
    {
      name: 'tablet-ipad',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 768, height: 1024 }
      },
    },
    {
      name: 'tablet-landscape',
      use: { 
        ...devices['iPad Pro landscape'],
        viewport: { width: 1024, height: 768 }
      },
    },
  ],

  webServer: {
    command: 'npx http-server ../. -p 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
});