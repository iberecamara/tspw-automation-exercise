import { TestCasesPage } from "@pages/test-cases.page";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class TestCasesSteps extends BaseSteps {
  readonly testCasesPage: TestCasesPage;

  constructor(testCasesPage: TestCasesPage) {
    super();
    this.testCasesPage = testCasesPage;
  }
}
