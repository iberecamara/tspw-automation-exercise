import { BasePage } from "@pages.base/base.page";
import { TestCasesLocators } from "@pages.base/locators/page/test-cases.locators";
import { Page } from "@playwright/test";

/** The Test Cases reference page — a static list of the site's own suggested manual test cases. No actions beyond navigation/locator access; used purely for its title/content, so it defines no methods of its own. */
export class TestCasesPage extends BasePage {
  readonly locators: TestCasesLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new TestCasesLocators(page);
  }
}
