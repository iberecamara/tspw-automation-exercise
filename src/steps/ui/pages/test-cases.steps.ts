import { TestCasesPage } from "@pages/test-cases.page";
import { BaseSteps } from "@steps/base.steps";

/** Readable, logged steps driving {@link TestCasesPage}. Currently defines no steps of its own beyond construction; the one spec that exercises this page (`test-cases.spec.ts`) doesn't destructure this fixture at all, relying instead on `CommonSteps.validateTitle` and `HeaderComponentSteps.clickTestCases` for navigation/validation. */
export class TestCasesSteps extends BaseSteps {
  readonly testCasesPage: TestCasesPage;

  constructor(testCasesPage: TestCasesPage) {
    super();
    this.testCasesPage = testCasesPage;
  }
}
