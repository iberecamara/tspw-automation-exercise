import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for a brand-filtered products listing page. */
export class BrandLocators {
  readonly brandHeading: Locator;

  constructor(page: Page) {
    this.brandHeading = page.locator(".title text-center");
  }
}
