import { Locator, Page } from "@playwright/test";

export class CategoryLocators {
  readonly categoryHeading: Locator;

  constructor(page: Page) {
    this.categoryHeading = page.locator(".title text-center");
  }
}
