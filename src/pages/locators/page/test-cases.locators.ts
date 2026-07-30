import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the Test Cases reference page. */
export class TestCasesLocators {
  readonly page: Page;
  readonly mainContainer: Locator;
  readonly feedbackContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContainer = page
      .locator(".container")
      .filter({
        hasText: "Test Cases",
        hasNotText: "Test Cases Below is the list",
      });
    this.feedbackContainer = page
      .locator(".panel-group")
      .filter({ hasText: "Feedback for Us" });
  }
}
