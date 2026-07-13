import { FullResult, Reporter } from '@playwright/test/reporter';
import { AllureUtils } from '@utils/allure.utils';

class AllureCleanupReporter implements Reporter {
    async onEnd(result: FullResult) {
        await AllureUtils.allureRemoveResults();
    }
}
export default AllureCleanupReporter;