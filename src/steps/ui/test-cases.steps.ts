import { TestCasesPage } from "@pages/test-cases.page";
import { TestAutomationLogger } from "@utils/logger.utils";

export class TestCasesSteps {

    readonly logger: TestAutomationLogger;
    readonly testCasesPage: TestCasesPage;

    constructor(logger: TestAutomationLogger, testCasesPage: TestCasesPage) {
        this.logger = logger;
        this.testCasesPage = testCasesPage;
    }

}