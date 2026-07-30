import { BasePage } from "@pages.base/base.page";
import { ApiTestingLocators } from "@pages.base/locators/page/api-testing.locators";
import { Page } from "@playwright/test";

/** The Api Testing reference page — a static list of the site's own suggested API test cases. No actions beyond navigation/locator access; used purely for its title/content, so it defines no methods of its own. */
export class ApiTestingPage extends BasePage {
  readonly locators: ApiTestingLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new ApiTestingLocators(page);
  }
}
