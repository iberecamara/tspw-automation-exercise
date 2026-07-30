import { Locator, Page } from "@playwright/test";

/** Raw `Locator` definitions for the all-products listing page. */
export class ProductsLocators {
  readonly productsAdvertisement: Locator;
  readonly allProductsContainer: Locator;
  readonly searchProductsInput: Locator;
  readonly searchProductsButton: Locator;

  constructor(page: Page) {
    this.productsAdvertisement = page.locator("#advertisement");
    this.searchProductsInput = page.getByPlaceholder("Search Product");
    this.searchProductsButton = page.locator("#submit_search");
    this.allProductsContainer = page.locator(".features_items");
  }
}
