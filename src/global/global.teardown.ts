import { TestAutomationLogger } from "@utils/logger.utils";

/**
 * Playwright global teardown hook (wired into `playwright.config.ts`'s `globalTeardown`), run
 * once after every worker in the suite has finished. Finalizes logging by removing all
 * TEMP log files(see `TestAutomationLogger.removeTempFiles`).
 */
async function globalTeardown() {
  await TestAutomationLogger.splitGeneratedLogs();
}

export default globalTeardown;
