import { TestCasesPage } from "@pages/test-cases.page";
import { BaseSteps } from "@steps/base.steps";

export class TestCasesSteps extends BaseSteps {

    readonly testCasesPage: TestCasesPage;

    constructor(testCasesPage: TestCasesPage) {
        super();
        this.testCasesPage = testCasesPage;
    }

}