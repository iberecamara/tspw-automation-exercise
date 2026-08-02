import { Environment } from "@configs/environment.config";
import { SECOND_IN_MILLISECONDS } from "@data/constants/constants";
import { test as allure } from "@fixtures/allure.fixtures";
import { test as apis } from "@fixtures/apis.fixtures";
import { test as data } from "@fixtures/data.fixtures";
import { test as logging } from "@fixtures/logging.fixtures";
import { test as pages } from "@fixtures/pages.fixtures";
import { test as steps } from "@fixtures/steps.fixtures";
import { mergeTests } from "playwright/test";

/**
 * The single, fully composed `test` object every spec file imports (`import { test } from
 * "@fixtures/fixtures"`). Merges every fixture module (API clients, generated test data,
 * logging, pages, steps) into one Playwright `test`, so a spec can destructure any fixture it
 * needs from a single import without knowing which individual module provides it.
 */
const merged = mergeTests(allure, apis, data, logging, pages, steps);

interface TestDelay {
  delay: void;
}

export const test = merged.extend<TestDelay>({
  delay: [
    async ({ page }, use) => {
      await use();
      if (Environment.CI) {
        await page.waitForTimeout(10 * SECOND_IN_MILLISECONDS);
      }
    },
    {
      auto: true,
    },
  ],
});
