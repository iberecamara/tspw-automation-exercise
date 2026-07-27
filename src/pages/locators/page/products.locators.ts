import { Locator, Page } from "@playwright/test";

export class ProductsLocators {
  readonly searchProductsInput: Locator;
  readonly searchProductsButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.searchProductsInput = page.getByPlaceholder("Search Product");
    this.searchProductsButton = page.locator("#submit_search");
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }
}
