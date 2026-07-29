import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for a category-filtered products listing page. */
export class CategoryLocators {
  readonly categoryHeading: Locator;

  constructor(page: Page) {
    this.categoryHeading = page.locator(".title text-center");
  }
}
