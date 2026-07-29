import { Reporter } from "@playwright/test/reporter";
import { allureRemoveResults } from "@utils/allure.utils";

/**
 * Custom Playwright reporter that prunes stale Allure result files after the run finishes,
 * keeping the generated report focused on actionable results (see
 * `allureRemoveResults`/`Environment.ALLURE_REPORT_REMOVE_STATUS`). Registered in
 * `playwright.config.ts`'s `reporter` array.
 */
class AllureCleanupReporter implements Reporter {
  /** Called by Playwright once the full run has finished; triggers the Allure results cleanup. */
  onEnd() {
    allureRemoveResults();
  }
}
export default AllureCleanupReporter;
