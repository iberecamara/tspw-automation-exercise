import { TestCasesLocators } from "@locators/page/test-cases.locators";
import { BasePage } from "@pages.base/base.page";
import { Page } from "@playwright/test";

export class TestCasesPage extends BasePage {
  readonly locators: TestCasesLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new TestCasesLocators(page);
  }
}
