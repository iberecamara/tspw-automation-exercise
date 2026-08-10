import { Environment } from "@configs/environment.config";
import { SECOND_IN_MILLISECONDS } from "@data/constants/common.constants";
import { test as base } from "@playwright/test";

interface TestDelay {
  delay: void;
}

/**
 * Add delays to avoid the testing application crashing due to too many requests in a short time.
 */
export const test = base.extend<TestDelay>({
  delay: [
    async ({ page }, use, testInfo) => {
      if (Environment.TEST_DELAY > 0) {
        await page.waitForTimeout(
          Environment.TEST_DELAY * SECOND_IN_MILLISECONDS,
        );
      }
      if (testInfo.retry > 0 && Environment.RETRY_DELAY > 0) {
        await page.waitForTimeout(
          testInfo.retry * Environment.RETRY_DELAY * SECOND_IN_MILLISECONDS,
        );
      }
      await use();
    },
    {
      auto: true,
    },
  ],
});
