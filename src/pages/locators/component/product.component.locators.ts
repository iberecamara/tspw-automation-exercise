import { Locator, Page } from "@playwright/test";

export class ProductComponentLocators {
  readonly productsContainer: Locator;
  readonly productViewLink: (index: number) => Locator;
  readonly productLocator: (name: string) => Locator;
  readonly productAddFromOverlay: (name: string) => Locator;
  readonly products: Locator;
  readonly productName: (locator: Locator) => Locator;
  readonly productPrice: (locator: Locator) => Locator;

  constructor(page: Page) {
    this.productsContainer = page.locator(".features_items");
    this.productLocator = (name: string): Locator => {
      return page
        .locator("div.product-image-wrapper > div.single-products")
        .filter({ hasText: name })
        .first();
    };
    this.productAddFromOverlay = (name: string): Locator => {
      return this.productLocator(name).locator("div.overlay-content > .btn");
    };
    this.productViewLink = (index: number): Locator => {
      return page
        .getByRole("link", { name: " View Product" })
        .and(page.locator(`a[href="/product_details/${index}"]`));
    };
    this.products = this.productsContainer.locator(".single-products");
    this.productName = (locator: Locator) => {
      return locator.locator("p").first();
    };
    this.productPrice = (locator: Locator) => {
      return locator.locator("h2").first();
    };
  }
}
