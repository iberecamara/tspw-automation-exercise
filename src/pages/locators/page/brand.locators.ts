import { Locator, Page } from "@playwright/test";

export class BrandLocators {
  readonly brandHeading: Locator;

  constructor(page: Page) {
    this.brandHeading = page.locator(".title text-center");
  }
}
