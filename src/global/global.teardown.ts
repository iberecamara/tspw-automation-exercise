import { TestAutomationLogger } from "@utils/logger.utils";

/**
 * Playwright global teardown hook (wired into `playwright.config.ts`'s `globalTeardown`), run
 * once after every worker in the suite has finished. Finalizes logging by splitting each
 * worker's raw temp log file into one file per test execution (see
 * `TestAutomationLogger.splitGeneratedLogs`).
 */
async function globalTeardown() {
  await TestAutomationLogger.splitGeneratedLogs();
}

export default globalTeardown;
