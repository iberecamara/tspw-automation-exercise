import { Environment } from "@configs/environment.config";
import { PATHS } from "@configs/paths";
import { SECOND_IN_MILLISECONDS } from "@data/constants/common.constants";
import { SCREENSHOTS_FILEPATH } from "@files/screenshots/screenshots.filepath";
import { defineConfig, devices } from "@playwright/test";
import { getDateTime } from "@utils/datetime.utils";
import { capitalize } from "@utils/string.utils";
import * as os from "node:os";
import path from "node:path";

/**
 * Launch options shared by every project (`headless`/`slowMo`, both environment-driven), reused
 * both in the top-level `use.launchOptions` and layered into each project"s own `launchOptions`.
 */
const globalLaunchOptions = {
  headless: Environment.HEADLESS,
  slowMo: Environment.SLOWMO,
};

// True when this run is one shard of a sharded execution (see docker-compose.yml"s
// tests-shard service and docker.compose.utils.ts, which set SHARD_INDEX per container).
const isSharded = Boolean(process.env.SHARD_INDEX);

/**
 * The framework"s Playwright configuration: test directory, timeouts, retries/workers (all
 * environment-driven via {@link Environment}), the HTML/JSON/Allure reporter stack plus the
 * custom Allure-cleanup reporter, `baseURL` (so tests can navigate with relative paths), and the
 * single Chromium project (see the README"s Project Structure section for the framework"s
 * browser-coverage scope).
 */
export default defineConfig({
  testDir: "../tests/",
  timeout: 90 * SECOND_IN_MILLISECONDS,
  expect: {
    timeout: 5 * SECOND_IN_MILLISECONDS,
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
    },
  },
  fullyParallel: true,
  retries: Environment.RETRIES,
  workers: Environment.WORKERS,
  globalTeardown: require.resolve(PATHS.GLOBAL_TEARDOWN_PATH),
  snapshotDir: SCREENSHOTS_FILEPATH,
  // Nests every visual-regression baseline under a folder named for where it was captured
  // ("local" | "docker" | "github" — see Environment.SNAPSHOT_ENV), since font rendering and
  // anti-aliasing differ enough between a developer's machine, this project's Docker image, and
  // the GitHub Actions runner image to produce false-positive diffs if they shared one baseline
  // set. `npm run test:visual:update` picks the right folder automatically, wherever it's run.
  snapshotPathTemplate: `{snapshotDir}/{testFileDir}/{testFileName}-snapshots/${Environment.SNAPSHOT_ENV}/{arg}{-projectName}{-platform}{ext}`,
  reporter: [
    ["line"],
    ...(isSharded
      ? [["blob", { outputDir: PATHS.BLOB_REPORTS_SHARD_DIR }] as const]
      : [
          [
            "html",
            { open: "never", outputFolder: PATHS.HTML_REPORTS_DIR },
          ] as const,
          ["json", { outputFile: PATHS.JSON_REPORTS_FILE }] as const,
        ]),
    [
      "allure-playwright",
      {
        environmentInfo: {
          "OS Platform": os.platform(),
          "OS Release": os.release(),
          "OS Version": os.version(),
          "Node Version": process.version,
          Hostname: os.hostname(),
          "CI Execution?": process.env.CI ? "Yes" : "No",
          Language: "TypeScript",
          Framework: "Playwright",
          Flavor: "Vanilla",
          Suite: "Web + API",
          Application: Environment.APPLICATION,
          Environment: capitalize(Environment.APPLICATION_ENVIRONMENT),
          Instance: Environment.BASE_URL,
          "Date and Time": getDateTime().datetime,
          "Sharded?": isSharded ? "Yes" : "No",
          ...(isSharded ? { Shards: Environment.SHARD_TOTAL } : {}),
        },
        resultsDir: PATHS.ALLURE_RESULTS_DIR,
        details: true,
      },
    ],
    [path.resolve(__dirname, PATHS.ALLURE_CLEANUP_REPORTER_PATH)],
  ],
  outputDir: PATHS.PLAYWRIGHT_REPORTS_DIR,
  use: {
    baseURL: Environment.BASE_URL,
    testIdAttribute: "data-qa",
    ignoreHTTPSErrors: true,
    actionTimeout: 5 * SECOND_IN_MILLISECONDS,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    launchOptions: globalLaunchOptions,
  },
  projects: [
    {
      name: "Chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: Environment.VIEWPORT,
        deviceScaleFactor: undefined,
        launchOptions: {
          ...globalLaunchOptions,
          args: ["--start-maximized"],
        },
      },
    },
    {
      name: "Chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: Environment.VIEWPORT,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
    {
      name: "Firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: Environment.VIEWPORT,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: Environment.HEADLESS ? [] : ["-width=1920", "-height=1080"],
        },
      },
    },
    {
      name: "Edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: Environment.VIEWPORT,
        deviceScaleFactor: undefined,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
    {
      name: "Safari",
      testIgnore: "src/tests/ui/download.ts",
      use: {
        ...devices["Desktop Safari"],
        deviceScaleFactor: undefined,
      },
    },
    {
      name: "iPhone 14 Pro Max",
      testIgnore: ["src/tests/ui/visual/**", "src/tests/ui/download.ts"],
      use: { ...devices["iPhone 14 Pro Max"], deviceScaleFactor: undefined },
    },
    {
      name: "Samsung Galaxy S24 Ultra",
      use: { ...devices["Galaxy S24 Ultra"] },
    },
  ],
});
