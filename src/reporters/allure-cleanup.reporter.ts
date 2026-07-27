import { Reporter } from "@playwright/test/reporter";
import { allureRemoveResults } from "@utils/allure.utils";

class AllureCleanupReporter implements Reporter {
  onEnd() {
    allureRemoveResults();
  }
}
export default AllureCleanupReporter;
