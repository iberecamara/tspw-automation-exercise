import { Page } from "@playwright/test";

/** Raw `Locator` definitions for the Test Cases reference page. */
export class TestCasesLocators {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
}
