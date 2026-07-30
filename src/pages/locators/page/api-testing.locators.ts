import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the Api Testing reference page. */
export class ApiTestingLocators {
  readonly page: Page;
  readonly mainContainer: Locator;
  readonly feedbackContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContainer = page.locator(".container").filter({ hasText: "APIs List for practice" });
    this.feedbackContainer = page.locator(".panel-group").filter({ hasText: "Feedback for Us" });
  }
}
