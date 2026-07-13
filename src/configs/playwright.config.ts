import { defineConfig, devices, FullConfig } from '@playwright/test';
import * as os from "node:os";
import { MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { Environment } from '@configs/environment.config';
import { DateTimeUtils } from '@utils/datetime.utils';
import path from 'node:path';


export default defineConfig({
  testDir: '../tests/',
  timeout: process.env.CI ? 30 * MINUTE_IN_MILISSECONDS : 90 * MINUTE_IN_MILISSECONDS,
  expect: {
    timeout: 5 * MINUTE_IN_MILISSECONDS,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: Environment.WORKERS,
  globalTeardown: require.resolve('../global/global.teardown'),
  reporter: [
    ['line'],
    ["html", { open: "never", outputFolder: "../../artifacts/reports/html" }],
    ["json", { outputFile: "../../artifacts/reports/json/report.json" }],
    [
      "allure-playwright",
      {
        environmentInfo: {
          "OS Platform": os.platform(),
          "OS Release": os.release(),
          "OS Version": os.version(),
          "Node Version": process.version,
          "Hostname": os.hostname(),
          "CI Execution?": process.env.CI ? "Yes" : "No",
          "Language": "TypeScript",
          "Framework": "Playwright",
          "Flavor": "Vanilla",
          "Suite": "Web",
          "Application": Environment.APPLICATION,
          "Environment": Environment.APPLICATION_ENVIRONMENT,
          "Instance": Environment.BASE_URL,
          "Date and Time": DateTimeUtils.getDateTime().datetime
        },
        resultsDir: "./artifacts/reports/allure/allure-results",
        details: true
      }
    ],
    [path.resolve(__dirname, '../reporters/allure-cleanup.reporter.ts')]
  ],
  outputDir: '../../artifacts/reports/playwright/test-results',
  use: {
    testIdAttribute: 'data-qa',
    headless: Environment.HEADLESS,
    ignoreHTTPSErrors: true,
    actionTimeout: 5 * MINUTE_IN_MILISSECONDS,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      slowMo: Environment.SLOWMO
    }
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: Environment.VIEWPORT,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
  ],
});
