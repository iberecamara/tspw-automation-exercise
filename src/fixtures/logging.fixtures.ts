import { Environment } from "@configs/environment.config";
import { NEWLINE } from "@data/constants/constants";
import { test as base, TestInfo } from "@playwright/test";
import { TestAutomationLogger } from "@utils/logger.utils";
import { prettyJson } from "@utils/string.utils";

/**
 * The per-worker logger fixture, plus a side-effect-only auto-fixtures. `autologger` is typed `void` (rather than `undefined`) deliberately — TypeScript allows a
 * `void`-typed fixture's `use()` to be called with no argument, which `undefined` doesn't;
 * see the scoped ESLint override for `src/fixtures/*.fixtures.ts` in `eslint.config.mjs`.
 */
interface LoggingFixtures {
  logger: TestAutomationLogger;
  autologger: void;
}

/**
 * Extends the base Playwright `test` with:
 * - `logger` — the worker-scoped `TestAutomationLogger` singleton.
 * - `autologger` (auto-running) — wraps every test with `*`/`#` boundary-marker log lines plus
 *   its title/tags/annotations, which `TestAutomationLogger.splitGeneratedLogs()` later uses to
 *   split each worker's raw log into one file per test.
 */
export const test = base.extend<LoggingFixtures>({
  logger: async ({ }, use, testInfo) => {
    const log = TestAutomationLogger.getInstance(
      testInfo.workerIndex.toString(),
    );
    await use(log);
  },
  autologger: [
    async ({ logger }, use, testInfo: TestInfo) => {
      logger.info("*".repeat(Environment.LOG_LINE_LENGTH));
      logger.info(NEWLINE);
      if (Environment.TEST_DELAY > 0) {
        logger.info(`Will wait Test Delay: ${Environment.TEST_DELAY} seconds`);
      }
      if (testInfo.retry > 0 && Environment.RETRY_DELAY > 0) {
        logger.info(`Will wait Test Retry Delay: ${Environment.RETRY_DELAY} seconds`);
      }
      logger.info(`Test Project: ${testInfo.project.name}`);
      logger.info(`Starting test: ${testInfo.title}`);
      logger.info(
        `Test tags: ${testInfo.tags.length > 0 ? testInfo.tags.join(", ") : "none"}`,
      );
      if (testInfo.annotations.length > 0) {
        logger.info(
          `Test annotations: ${prettyJson(testInfo.annotations, { sameline: true })}`,
        );
      }
      await use();
      logger.info(
        `Test finished: ${testInfo.title}. Test result: ${testInfo.status}`,
      );
      logger.info(NEWLINE);
      logger.info("#".repeat(Environment.LOG_LINE_LENGTH));
    },
    {
      auto: true,
    },
  ],
});
