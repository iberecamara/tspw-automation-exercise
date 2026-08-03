import { Environment } from "@configs/environment.config";
import { SECOND_IN_MILLISECONDS } from "@data/constants/common.constants";
import { test as base } from "@playwright/test";

interface TestDelay {
  delay: void;
}

/**
 * Add delays to avoid the public testing application crashing due to too many requests in a short time.
 */
export const test = base.extend<TestDelay>({
  delay: [
    async ({ page }, use, testInfo) => {
      const snapshotMode = testInfo.config.updateSnapshots;
      const isDownloadScenario = testInfo.tags.includes("@download");
      if (
        snapshotMode === "all" ||
        snapshotMode === "changed" ||
        isDownloadScenario
      ) {
        await page.waitForTimeout(15 * SECOND_IN_MILLISECONDS);
      }
      if (Environment.CI) {
        await page.waitForTimeout(15 * SECOND_IN_MILLISECONDS);
      }
      if (testInfo.retry > 0) {
        await page.waitForTimeout(testInfo.retry * 10 * SECOND_IN_MILLISECONDS);
      }
      await use();
    },
    {
      auto: true,
    },
  ],
});
